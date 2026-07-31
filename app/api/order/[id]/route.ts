import { NextRequest, NextResponse } from "next/server";

import { getOrderById } from "@/lib/order";
import { isValidUuid } from "@/lib/validators";

// Public — id is an unguessable uuid, safe for anonymous read (same pattern
// as opaque order-confirmation links). Powers /order-confirmation/[orderId].

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isValidUuid(id)) {
    return NextResponse.json({ success: false, error: "Invalid order id." }, { status: 400 });
  }

  try {
    const order = await getOrderById(id);
    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found." }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    console.error("Error fetching order", error);
    return NextResponse.json({ success: false, error: "Failed to fetch order." }, { status: 500 });
  }
}
