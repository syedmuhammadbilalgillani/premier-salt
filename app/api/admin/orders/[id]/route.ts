import { NextRequest, NextResponse } from "next/server";

import { ORDER_STATUSES, getCachedOrder, updateOrderStatus } from "@/lib/order";
import { isValidUuid } from "@/lib/validators";

// Auth is enforced by proxy.ts for /api/admin/*.

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  if (!isValidUuid(id)) {
    return NextResponse.json({ success: false, error: "Invalid order id." }, { status: 400 });
  }

  try {
    const order = await getCachedOrder(id);
    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found." }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    console.error("Error fetching order", error);
    return NextResponse.json({ success: false, error: "Failed to fetch order." }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  if (!isValidUuid(id)) {
    return NextResponse.json({ success: false, error: "Invalid order id." }, { status: 400 });
  }

  try {
    const body = (await request.json().catch(() => null)) as { status?: unknown } | null;
    if (!body || typeof body.status !== "string" || !ORDER_STATUSES.includes(body.status as never)) {
      return NextResponse.json({ success: false, error: "Invalid status." }, { status: 400 });
    }

    const updated = await updateOrderStatus(id, body.status as (typeof ORDER_STATUSES)[number]);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Order not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Error updating order status", error);
    return NextResponse.json({ success: false, error: "Failed to update order." }, { status: 500 });
  }
}
