import "server-only";

import { createWriteStream } from "fs";
import { mkdir, readdir, readFile, stat, unlink, writeFile } from "fs/promises";
import path from "path";
import { pipeline } from "stream/promises";
import { ZipArchive } from "archiver";
import { sql, getTableColumns, getTableName, count } from "drizzle-orm";
import type { PgTable } from "drizzle-orm/pg-core";
import { strFromU8, unzipSync } from "fflate";

import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { STORAGE_BASE } from "@/lib/storage-path";

/**
 * Full backup / dry-run / restore of the database (all tables) and the
 * uploaded assets folder.
 *
 * Archive layout:
 *   manifest.json   – format version, schema fingerprint, row counts
 *   db.json         – { [tableName]: row[] }
 *   storage/<path>  – every file under STORAGE_BASE
 *
 * Restore is a full REPLACE: the DB is wiped and reloaded inside a single
 * transaction (all-or-nothing), then the assets folder is made to match.
 */

export const BACKUP_FORMAT_VERSION = 1;

// Parents before children (FK order). Restore deletes in reverse.
const TABLES: PgTable[] = [
  schema.users,
  schema.blogCategories,
  schema.categories,
  schema.products,
  schema.productImages,
  schema.productOptions,
  schema.productOptionValues,
  schema.productVariants,
  schema.productVariantOptionValues,
  schema.orders,
  schema.orderLines,
  schema.enquiries,
  schema.blogPosts,
  schema.newsletterSubscribers,
  schema.analyticsEvents,
];

const INSERT_CHUNK = 500;

export const BACKUP_DIR =
  process.env.BACKUP_DIR || path.join(process.cwd(), "backups");

type Row = Record<string, unknown>;

export interface Manifest {
  formatVersion: number;
  createdAt: string;
  schemaFingerprint: string;
  tables: Record<string, number>;
  assets: { files: number; bytes: number };
}

export interface RestoreReport {
  mode: "dry-run" | "restore";
  ok: boolean;
  errors: string[];
  warnings: string[];
  backupCreatedAt: string | null;
  tables: { name: string; current: number; incoming: number }[];
  assets: {
    incomingFiles: number;
    incomingBytes: number;
    currentFiles: number;
    toAdd: number;
    toOverwrite: number;
    toRemove: number;
  };
  safetyBackup?: string;
}

// ---------- helpers ----------

function schemaFingerprint(): string {
  return TABLES.map((t) => {
    const cols = Object.values(getTableColumns(t))
      .map((c) => c.name)
      .sort()
      .join(",");
    return `${getTableName(t)}(${cols})`;
  }).join(";");
}

async function walkStorage(): Promise<{ rel: string; size: number }[]> {
  const out: { rel: string; size: number }[] = [];
  async function walk(dir: string, prefix: string) {
    let entries: string[];
    try {
      entries = await readdir(dir);
    } catch {
      return;
    }
    for (const name of entries) {
      const full = path.join(dir, name);
      const rel = prefix ? `${prefix}/${name}` : name;
      const s = await stat(full);
      if (s.isDirectory()) await walk(full, rel);
      else out.push({ rel, size: s.size });
    }
  }
  await walk(STORAGE_BASE, "");
  return out;
}

async function readAllTables(): Promise<Record<string, Row[]>> {
  const data: Record<string, Row[]> = {};
  for (const table of TABLES) {
    data[getTableName(table)] = (await db
      .select()
      .from(table as never)) as Row[];
  }
  return data;
}

/** JSON dates come back as strings — turn timestamp columns back into Dates. */
function reviveRows(table: PgTable, rows: Row[]): Row[] {
  const cols = getTableColumns(table);
  const dateKeys = Object.entries(cols)
    .filter(([, c]) => /timestamp|date/i.test(c.columnType))
    .map(([key]) => key);
  if (dateKeys.length === 0) return rows;
  return rows.map((row) => {
    const copy = { ...row };
    for (const key of dateKeys) {
      const v = copy[key];
      if (typeof v === "string") copy[key] = new Date(v);
    }
    return copy;
  });
}

/** Insert parents before children for the self-referencing categories table. */
function sortCategories(rows: Row[]): Row[] {
  const byId = new Map(rows.map((r) => [r.id as string, r]));
  const done = new Set<string>();
  const out: Row[] = [];
  function visit(row: Row, depth = 0) {
    const id = row.id as string;
    if (done.has(id) || depth > 100) return;
    const parentId = row.parentCategoryId as string | null;
    const parent = parentId ? byId.get(parentId) : undefined;
    if (parent) visit(parent, depth + 1);
    done.add(id);
    out.push(row);
  }
  rows.forEach((r) => visit(r));
  return out;
}

// ---------- export ----------

/** Builds the archive. Files are streamed from disk, not buffered. */
export async function createBackupArchive(): Promise<ZipArchive> {
  const data = await readAllTables();
  const files = await walkStorage();

  const manifest: Manifest = {
    formatVersion: BACKUP_FORMAT_VERSION,
    createdAt: new Date().toISOString(),
    schemaFingerprint: schemaFingerprint(),
    tables: Object.fromEntries(
      Object.entries(data).map(([name, rows]) => [name, rows.length]),
    ),
    assets: {
      files: files.length,
      bytes: files.reduce((n, f) => n + f.size, 0),
    },
  };

  const archive = new ZipArchive({ zlib: { level: 6 } });
  archive.append(JSON.stringify(manifest, null, 2), { name: "manifest.json" });
  archive.append(JSON.stringify(data), { name: "db.json" });
  for (const f of files) {
    archive.file(path.join(STORAGE_BASE, ...f.rel.split("/")), {
      name: `storage/${f.rel}`,
    });
  }
  void archive.finalize();
  return archive;
}

export async function writeBackupToDisk(prefix: string): Promise<string> {
  await mkdir(BACKUP_DIR, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const file = path.join(BACKUP_DIR, `${prefix}-${stamp}.zip`);
  const archive = await createBackupArchive();
  await pipeline(archive, createWriteStream(file));
  return file;
}

export async function listBackups() {
  try {
    const names = (await readdir(BACKUP_DIR)).filter((n) => n.endsWith(".zip"));
    const rows = await Promise.all(
      names.map(async (name) => {
        const s = await stat(path.join(BACKUP_DIR, name));
        return { name, size: s.size, modified: s.mtime.toISOString() };
      }),
    );
    return rows.sort((a, b) => b.modified.localeCompare(a.modified));
  } catch {
    return [];
  }
}

export function resolveBackupFile(name: string): string | null {
  if (!/^[\w.-]+\.zip$/.test(name)) return null;
  return path.join(BACKUP_DIR, name);
}

export async function readBackupFile(name: string): Promise<Uint8Array | null> {
  const full = resolveBackupFile(name);
  if (!full) return null;
  try {
    return new Uint8Array(await readFile(full));
  } catch {
    return null;
  }
}

// ---------- restore / dry run ----------

class DryRunRollback extends Error {}

function safeAssetPath(entryName: string): { rel: string; full: string } | null {
  const rel = entryName.replace(/^storage\//, "");
  const parts = rel.split(/[\\/]+/).filter(Boolean);
  if (parts.length === 0 || parts.some((p) => p === ".." || p === ".")) {
    return null;
  }
  const full = path.resolve(STORAGE_BASE, ...parts);
  if (!full.startsWith(STORAGE_BASE + path.sep)) return null;
  return { rel: parts.join("/"), full };
}

export async function restoreFromZip(
  zipBytes: Uint8Array,
  mode: "dry-run" | "restore",
): Promise<RestoreReport> {
  const report: RestoreReport = {
    mode,
    ok: false,
    errors: [],
    warnings: [],
    backupCreatedAt: null,
    tables: [],
    assets: {
      incomingFiles: 0,
      incomingBytes: 0,
      currentFiles: 0,
      toAdd: 0,
      toOverwrite: 0,
      toRemove: 0,
    },
  };

  // 1. Read + validate the archive
  let entries: Record<string, Uint8Array>;
  try {
    entries = unzipSync(zipBytes);
  } catch {
    report.errors.push("This file is not a valid zip archive.");
    return report;
  }
  if (!entries["manifest.json"] || !entries["db.json"]) {
    report.errors.push("Not a Premier Salt backup (manifest.json / db.json missing).");
    return report;
  }

  let manifest: Manifest;
  let data: Record<string, Row[]>;
  try {
    manifest = JSON.parse(strFromU8(entries["manifest.json"]));
    data = JSON.parse(strFromU8(entries["db.json"]));
  } catch {
    report.errors.push("Backup contents are corrupted (invalid JSON).");
    return report;
  }

  report.backupCreatedAt = manifest.createdAt ?? null;
  if (manifest.formatVersion !== BACKUP_FORMAT_VERSION) {
    report.errors.push(
      `Unsupported backup format version ${manifest.formatVersion}.`,
    );
  }
  if (manifest.schemaFingerprint !== schemaFingerprint()) {
    report.errors.push(
      "Database structure in this backup differs from the current one (it was made on a different version of the app). Restore is blocked to avoid data loss.",
    );
  }
  for (const t of TABLES) {
    const name = getTableName(t);
    if (!Array.isArray(data[name])) {
      report.errors.push(`Table "${name}" is missing from the backup.`);
    }
  }

  // 2. Asset diff
  const current = new Map((await walkStorage()).map((f) => [f.rel, f.size]));
  const incoming = new Map<string, { full: string; bytes: Uint8Array }>();
  for (const [entryName, bytes] of Object.entries(entries)) {
    if (!entryName.startsWith("storage/") || entryName.endsWith("/")) continue;
    const p = safeAssetPath(entryName);
    if (!p) {
      report.warnings.push(`Skipped unsafe asset path: ${entryName}`);
      continue;
    }
    incoming.set(p.rel, { full: p.full, bytes });
  }
  report.assets.currentFiles = current.size;
  report.assets.incomingFiles = incoming.size;
  report.assets.incomingBytes = [...incoming.values()].reduce(
    (n, f) => n + f.bytes.length,
    0,
  );
  for (const rel of incoming.keys()) {
    if (current.has(rel)) report.assets.toOverwrite++;
    else report.assets.toAdd++;
  }
  for (const rel of current.keys()) {
    if (!incoming.has(rel)) report.assets.toRemove++;
  }

  if (report.errors.length > 0) return report;

  // 3. Safety backup (real restore only)
  if (mode === "restore") {
    try {
      report.safetyBackup = path.basename(await writeBackupToDisk("pre-restore"));
    } catch (e) {
      report.errors.push(
        `Could not write the safety backup, restore cancelled: ${
          e instanceof Error ? e.message : String(e)
        }`,
      );
      return report;
    }
  }

  const currentCounts: Record<string, number> = {};
  for (const t of TABLES) {
    const [{ value }] = await db.select({ value: count() }).from(t as never);
    currentCounts[getTableName(t)] = Number(value);
  }

  // 4. Replace the DB in ONE transaction. A dry run does the whole thing and
  //    then rolls back, so constraint/type problems show up without any change.
  try {
    await db.transaction(async (tx) => {
      for (const table of [...TABLES].reverse()) {
        await tx.delete(table);
      }

      for (const table of TABLES) {
        const name = getTableName(table);
        let rows = reviveRows(table, data[name]);
        if (table === schema.categories) rows = sortCategories(rows);
        for (let i = 0; i < rows.length; i += INSERT_CHUNK) {
          await tx.insert(table).values(rows.slice(i, i + INSERT_CHUNK) as never);
        }
        report.tables.push({ name, current: currentCounts[name] ?? 0, incoming: rows.length });
      }

      // serial columns: bring their sequences past the restored values
      for (const [tbl, col] of [
        ["orders", "order_seq"],
        ["enquiries", "enquiry_seq"],
      ]) {
        await tx.execute(
          sql.raw(
            `SELECT setval(pg_get_serial_sequence('${tbl}', '${col}'), COALESCE((SELECT MAX(${col}) FROM ${tbl}), 0) + 1, false)`,
          ),
        );
      }

      if (mode === "dry-run") throw new DryRunRollback();
    });
  } catch (e) {
    if (!(e instanceof DryRunRollback)) {
      report.errors.push(
        `Database restore failed and was rolled back (nothing changed): ${
          e instanceof Error ? e.message : String(e)
        }`,
      );
      report.tables = [];
      return report;
    }
  }

  if (mode === "dry-run") {
    report.ok = true;
    return report;
  }

  // 5. Assets: write the incoming files, then drop stale ones
  try {
    for (const { full, bytes } of incoming.values()) {
      await mkdir(path.dirname(full), { recursive: true });
      await writeFile(full, bytes);
    }
    for (const rel of current.keys()) {
      if (!incoming.has(rel)) {
        await unlink(path.join(STORAGE_BASE, ...rel.split("/"))).catch(() => {});
      }
    }
  } catch (e) {
    report.errors.push(
      `Database was restored, but copying assets failed: ${
        e instanceof Error ? e.message : String(e)
      }. Your previous state is in the safety backup.`,
    );
    return report;
  }

  report.ok = true;
  return report;
}
