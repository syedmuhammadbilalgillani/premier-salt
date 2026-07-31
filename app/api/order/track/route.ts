import { NextRequest, NextResponse } from "next/server";

import { findOrderByNumberAndEmail } from "@/lib/order";

// Public — order number + email is the only lookup key (no customer
// accounts exist). Returns a generic not-found on any mismatch so it never
// reveals which field was wrong.

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => null)) as
      | { orderNumber?: unknown; email?: unknown }
      | null;

    const orderNumber = typeof body?.orderNumber === "string" ? body.orderNumber.trim() : "";
    const email = typeof body?.email === "string" ? body.email.trim() : "";

    if (!orderNumber || !email) {
      return NextResponse.json(
        { success: false, error: "Order number and email are required." },
        { status: 400 },
      );
    }

    const order = await findOrderByNumberAndEmail(orderNumber, email);
    if (!order) {
      return NextResponse.json(
        { success: false, error: "No order found matching that order number and email." },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    console.error("Error tracking order", error);
    return NextResponse.json({ success: false, error: "Failed to look up order." }, { status: 500 });
  }
}
