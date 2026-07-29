import path from "path";
import { readdir, rmdir, stat, unlink } from "fs/promises";

export const STORAGE_BASE = process.env.STORAGE_BASE_PATH
  ? process.env.STORAGE_BASE_PATH
  : path.join(process.cwd(), "public", "storage");

/**
 * Resolve a user-supplied relative path against the storage base.
 * Returns the absolute path, or null if it escapes the storage base.
 */
export function resolveStoragePath(relativePath: string): string | null {
  const normalized = relativePath
    .split(/[\\/]+/)
    .filter((segment) => segment && segment !== "." && segment !== "..")
    .join(path.sep);

  const resolved = path.resolve(STORAGE_BASE, normalized);
  if (resolved !== STORAGE_BASE && !resolved.startsWith(STORAGE_BASE + path.sep)) {
    return null;
  }
  return resolved;
}

/**
 * Same as resolveStoragePath but also returns the sanitized relative path
 * (forward-slash separated) for client display.
 */
export function resolveStoragePathWithRelative(
  relativePath: string
): { fullPath: string; relative: string } | null {
  const normalized = relativePath
    .split(/[\\/]+/)
    .filter((segment) => segment && segment !== "." && segment !== "..")
    .join(path.sep);

  const resolved = path.resolve(STORAGE_BASE, normalized);
  if (resolved !== STORAGE_BASE && !resolved.startsWith(STORAGE_BASE + path.sep)) {
    return null;
  }
  return { fullPath: resolved, relative: normalized.replace(/\\/g, "/") };
}

/**
 * Build the public URL for a stored file, honoring STORAGE_URL_PREFIX so
 * deployments that serve storage from a custom nginx location (e.g. /media)
 * don't end up with broken image URLs saved in the database.
 */
export function getStorageUrl(relativePath: string): string {
  const prefix = (process.env.STORAGE_URL_PREFIX || "/storage").replace(
    /\/+$/,
    "",
  );
  const clean = relativePath.replace(/^\/+/, "");
  return clean ? `${prefix}/${clean}` : prefix;
}

/**
 * Recursively delete a file or directory. Shared by the file-manager delete
 * routes and by modules (e.g. categories) that clean up an image on replace
 * or removal.
 */
export async function deleteStoragePathRecursive(
  fullPath: string,
): Promise<void> {
  const stats = await stat(fullPath);

  if (stats.isDirectory()) {
    const entries = await readdir(fullPath);
    await Promise.all(
      entries.map((entry) =>
        deleteStoragePathRecursive(path.join(fullPath, entry)),
      ),
    );
    await rmdir(fullPath);
  } else {
    await unlink(fullPath);
  }
}

/**
 * Convert a stored URL (as saved on a DB row, e.g. "/storage/categories/x.webp"
 * or "/api/storage/categories/x.webp") back into a storage-relative path,
 * for best-effort cleanup when a record is deleted or its image replaced.
 * Returns null if the URL doesn't look like one of our own storage URLs.
 */
export function storageUrlToRelativePath(url: string): string | null {
  const prefix = (process.env.STORAGE_URL_PREFIX || "/storage").replace(
    /\/+$/,
    "",
  );
  const candidates = [prefix, `/api${prefix}`, "/storage", "/api/storage"];
  for (const candidate of candidates) {
    if (url.startsWith(`${candidate}/`)) {
      return url.slice(candidate.length + 1);
    }
  }
  return null;
}
