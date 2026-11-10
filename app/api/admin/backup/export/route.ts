import { Readable } from "stream";
import { NextResponse } from "next/server";

import { createBackupArchive } from "@/lib/backup";

// Auth is enforced by proxy.ts for /api/admin/*.
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const archive = await createBackupArchive();
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    return new Response(Readable.toWeb(archive) as ReadableStream, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="premier-salt-backup-${stamp}.zip"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Backup export failed", error);
    return NextResponse.json(
      { success: false, error: "Failed to create backup." },
      { status: 500 },
    );
  }
}
