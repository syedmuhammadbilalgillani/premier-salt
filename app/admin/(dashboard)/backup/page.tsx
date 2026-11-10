import { BackupClient } from "./backup-client";

export const dynamic = "force-dynamic";

export default function BackupPage() {
  return (
    <div className="px-6 py-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold">Backup &amp; Restore</h1>
        <p className="text-sm text-muted-foreground">
          Download a full copy of the database and uploaded files, or restore
          one. Restore replaces everything.
        </p>
      </div>
      <BackupClient />
    </div>
  );
}
