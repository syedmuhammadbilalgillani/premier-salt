"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

interface Report {
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

interface SavedBackup {
  name: string;
  size: number;
  modified: string;
}

const mb = (n: number) => `${(n / 1024 / 1024).toFixed(1)} MB`;

export function BackupClient() {
  const [file, setFile] = useState<File | null>(null);
  const [saved, setSaved] = useState<string>("");
  const [report, setReport] = useState<Report | null>(null);
  const [dryRunDone, setDryRunDone] = useState(false);
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState<"" | "dry-run" | "restore">("");
  const [list, setList] = useState<SavedBackup[]>([]);

  const loadList = useCallback(() => {
    return fetch("/api/admin/backup/list")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setList(json.data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    loadList();
  }, [loadList]);

  async function run(mode: "dry-run" | "restore") {
    if (!file && !saved) {
      toast.error("Choose a backup file first.");
      return;
    }
    setBusy(mode);
    try {
      const form = new FormData();
      form.set("mode", mode);
      if (file) form.set("file", file);
      else form.set("saved", saved);
      if (mode === "restore") form.set("confirm", confirm);

      const res = await fetch("/api/admin/backup/restore", {
        method: "POST",
        body: form,
      });
      const json = await res.json();
      if (json.report) setReport(json.report);
      if (!json.report) {
        toast.error(json.error || "Request failed.");
        return;
      }
      if (mode === "dry-run") {
        setDryRunDone(json.report.ok);
        if (json.report.ok) toast.success("Dry run passed. Nothing was changed.");
        else toast.error("Dry run found problems.");
      } else if (json.report.ok) {
        toast.success("Restore complete.");
        setDryRunDone(false);
        setConfirm("");
        loadList();
      } else {
        toast.error("Restore failed.");
      }
    } catch {
      toast.error("Request failed.");
    } finally {
      setBusy("");
    }
  }

  function pickFile(f: File | null) {
    setFile(f);
    setSaved("");
    setReport(null);
    setDryRunDone(false);
    setConfirm("");
  }

  return (
    <div className="grid max-w-3xl gap-8">
      <section className="rounded-md border p-5">
        <h2 className="font-medium">1. Create backup</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Downloads a .zip with every database table and all uploaded files.
          Includes admin password hashes, so keep it private.
        </p>
        <Button
          className="mt-4"
          onClick={() => {
            window.location.href = "/api/admin/backup/export";
          }}
        >
          Download full backup
        </Button>
      </section>

      <section className="rounded-md border p-5">
        <h2 className="font-medium">2. Restore</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          First run a <b>dry run</b>: it checks the backup and shows what would
          change, without changing anything. A safety backup of the current
          data is saved automatically before a real restore.
        </p>

        <div className="mt-4 grid gap-3">
          <input
            type="file"
            accept=".zip,application/zip"
            onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
            className="text-sm"
          />
          {list.length > 0 && (
            <select
              value={saved}
              onChange={(e) => {
                setSaved(e.target.value);
                setFile(null);
                setReport(null);
                setDryRunDone(false);
              }}
              className="rounded-md border bg-background px-3 py-2 text-sm"
            >
              <option value="">…or pick a backup saved on the server</option>
              {list.map((b) => (
                <option key={b.name} value={b.name}>
                  {b.name} ({mb(b.size)})
                </option>
              ))}
            </select>
          )}

          <div>
            <Button
              variant="outline"
              disabled={busy !== "" || (!file && !saved)}
              onClick={() => run("dry-run")}
            >
              {busy === "dry-run" ? "Checking…" : "Dry run (no changes)"}
            </Button>
          </div>
        </div>

        {report && (
          <div className="mt-5 grid gap-3 text-sm">
            {report.errors.map((e) => (
              <p key={e} className="rounded bg-destructive/10 p-2 text-destructive">
                {e}
              </p>
            ))}
            {report.warnings.map((w) => (
              <p key={w} className="rounded bg-yellow-500/10 p-2">
                {w}
              </p>
            ))}
            {report.tables.length > 0 && (
              <>
                <p className="text-muted-foreground">
                  Backup made{" "}
                  {report.backupCreatedAt
                    ? new Date(report.backupCreatedAt).toLocaleString()
                    : "(unknown)"}
                </p>
                <table className="w-full text-left">
                  <thead className="text-muted-foreground">
                    <tr>
                      <th className="py-1">Table</th>
                      <th>Now</th>
                      <th>After restore</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.tables.map((t) => (
                      <tr key={t.name} className="border-t">
                        <td className="py-1">{t.name}</td>
                        <td>{t.current}</td>
                        <td>{t.incoming}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p>
                  Files: {report.assets.toAdd} added, {report.assets.toOverwrite}{" "}
                  overwritten, {report.assets.toRemove} removed (
                  {mb(report.assets.incomingBytes)} in backup).
                </p>
              </>
            )}
            {report.safetyBackup && (
              <p>Safety backup saved as {report.safetyBackup}</p>
            )}
          </div>
        )}

        {dryRunDone && (
          <div className="mt-5 grid gap-3 border-t pt-5">
            <p className="text-sm">
              This will <b>replace all current data and files</b>. Type RESTORE
              to confirm.
            </p>
            <input
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="RESTORE"
              className="w-48 rounded-md border bg-background px-3 py-2 text-sm"
            />
            <div>
              <Button
                variant="destructive"
                disabled={busy !== "" || confirm !== "RESTORE"}
                onClick={() => run("restore")}
              >
                {busy === "restore" ? "Restoring…" : "Restore now"}
              </Button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
