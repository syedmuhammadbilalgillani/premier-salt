import { NextResponse } from "next/server";

import { getCachedOrders } from "@/lib/order";

// Auth is enforced by proxy.ts for /api/admin/*.

export async function GET() {
  try {
    const data = await getCachedOrders();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error listing orders", error);
    return NextResponse.json({ success: false, error: "Failed to list orders." }, { status: 500 });
  }
}
