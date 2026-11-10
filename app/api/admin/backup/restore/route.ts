import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { readBackupFile, restoreFromZip } from "@/lib/backup";

// Auth is enforced by proxy.ts for /api/admin/*.
export const dynamic = "force-dynamic";
export const maxDuration = 300;

/**
 * POST multipart/form-data
 *   mode:   "dry-run" | "restore"
 *   file:   the backup .zip   (or)
 *   saved:  name of a backup stored on the server (e.g. a safety backup)
 *   confirm: must be "RESTORE" for mode=restore
 */
export async function POST(request: NextRequest) {
  try {
    const form = await request.formData();
    const mode = form.get("mode");
    if (mode !== "dry-run" && mode !== "restore") {
      return NextResponse.json(
        { success: false, error: "Invalid mode." },
        { status: 400 },
      );
    }
    if (mode === "restore" && form.get("confirm") !== "RESTORE") {
      return NextResponse.json(
        { success: false, error: 'Type "RESTORE" to confirm.' },
        { status: 400 },
      );
    }

    let bytes: Uint8Array | null = null;
    const file = form.get("file");
    const saved = form.get("saved");
    if (file instanceof File && file.size > 0) {
      bytes = new Uint8Array(await file.arrayBuffer());
    } else if (typeof saved === "string" && saved) {
      bytes = await readBackupFile(saved);
    }
    if (!bytes) {
      return NextResponse.json(
        { success: false, error: "No backup file provided." },
        { status: 400 },
      );
    }

    const report = await restoreFromZip(bytes, mode);
    if (mode === "restore" && report.ok) revalidatePath("/", "layout");
    return NextResponse.json({ success: report.ok, report });
  } catch (error) {
    console.error("Backup restore failed", error);
    return NextResponse.json(
      { success: false, error: "Restore failed unexpectedly." },
      { status: 500 },
    );
  }
}
