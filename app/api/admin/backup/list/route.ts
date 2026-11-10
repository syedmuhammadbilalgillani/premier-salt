import { NextResponse } from "next/server";

import { listBackups } from "@/lib/backup";

// Auth is enforced by proxy.ts for /api/admin/*.
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ success: true, data: await listBackups() });
}
