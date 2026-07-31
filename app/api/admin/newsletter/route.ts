import { NextResponse } from "next/server";

import { getCachedSubscribers } from "@/lib/newsletter";

// Auth is enforced by proxy.ts for /api/admin/*.

export async function GET() {
  try {
    const data = await getCachedSubscribers();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error listing newsletter subscribers", error);
    return NextResponse.json(
      { success: false, error: "Failed to list subscribers." },
      { status: 500 },
    );
  }
}
