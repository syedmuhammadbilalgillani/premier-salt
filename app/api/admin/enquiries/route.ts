import { NextResponse } from "next/server";

import { getCachedEnquiries } from "@/lib/enquiry";

// Auth is enforced by proxy.ts for /api/admin/*.

export async function GET() {
  try {
    const data = await getCachedEnquiries();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error listing enquiries", error);
    return NextResponse.json({ success: false, error: "Failed to list enquiries." }, { status: 500 });
  }
}
