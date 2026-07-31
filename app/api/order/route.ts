import { NextRequest, NextResponse } from "next/server";

import { createOrder, OrderValidationError, type CreateOrderInput } from "@/lib/order";
import { isValidUuid } from "@/lib/validators";

// Public endpoint — guest checkout has no session to gate on. Not covered by
// any middleware matcher (see proxy.ts); admin order management lives under
// the separate, protected /api/admin/orders/* routes.

const DELIVERY_METHODS = ["Standard Delivery", "Store/Office Pickup"] as const;
const PAYMENT_METHODS = ["Cash on Delivery", "Bank Transfer", "Card Payment"] as const;

interface OrderPayload {
  customer?: unknown;
  address?: unknown;
  deliveryMethod?: unknown;
  paymentMethod?: unknown;
  notes?: unknown;
  discountCode?: unknown;
  lines?: unknown;
}

function validatePayload(body: OrderPayload): { ok: true; value: CreateOrderInput } | { ok: false; error: string } {
  const { customer, address, deliveryMethod, paymentMethod, notes, discountCode, lines } = body;

  if (typeof customer !== "object" || customer === null) {
    return { ok: false, error: "Customer details are required." };
  }
  const c = customer as Record<string, unknown>;
  if (
    typeof c.firstName !== "string" || !c.firstName.trim() ||
    typeof c.lastName !== "string" || !c.lastName.trim() ||
    typeof c.email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email) ||
    typeof c.phone !== "string" || !c.phone.trim()
  ) {
    return { ok: false, error: "Customer details are incomplete or invalid." };
  }

  if (typeof address !== "object" || address === null) {
    return { ok: false, error: "Shipping address is required." };
  }
  const a = address as Record<string, unknown>;
  if (
    typeof a.line1 !== "string" || !a.line1.trim() ||
    typeof a.city !== "string" || !a.city.trim() ||
    typeof a.province !== "string" || !a.province.trim() ||
    typeof a.postalCode !== "string" || !a.postalCode.trim()
  ) {
    return { ok: false, error: "Shipping address is incomplete." };
  }

  if (typeof deliveryMethod !== "string" || !DELIVERY_METHODS.includes(deliveryMethod as never)) {
    return { ok: false, error: "Invalid delivery method." };
  }
  if (typeof paymentMethod !== "string" || !PAYMENT_METHODS.includes(paymentMethod as never)) {
    return { ok: false, error: "Invalid payment method." };
  }

  if (!Array.isArray(lines) || lines.length === 0) {
    return { ok: false, error: "Your cart is empty." };
  }
  const resolvedLines: CreateOrderInput["lines"] = [];
  for (const rawLine of lines) {
    if (typeof rawLine !== "object" || rawLine === null) {
      return { ok: false, error: "Invalid cart item." };
    }
    const l = rawLine as Record<string, unknown>;
    if (typeof l.productSlug !== "string" || !l.productSlug.trim()) {
      return { ok: false, error: "Invalid cart item." };
    }
    if (l.variantId !== null && (typeof l.variantId !== "string" || !isValidUuid(l.variantId))) {
      return { ok: false, error: "Invalid cart item." };
    }
    if (typeof l.quantity !== "number" || !Number.isFinite(l.quantity) || l.quantity <= 0) {
      return { ok: false, error: "Invalid item quantity." };
    }
    resolvedLines.push({
      productSlug: l.productSlug,
      variantId: (l.variantId as string | null) ?? null,
      quantity: Math.trunc(l.quantity),
    });
  }

  return {
    ok: true,
    value: {
      customer: {
        firstName: c.firstName.trim(),
        lastName: c.lastName.trim(),
        email: c.email.trim(),
        phone: c.phone.trim(),
      },
      address: {
        line1: a.line1.trim(),
        line2: typeof a.line2 === "string" ? a.line2.trim() : null,
        city: a.city.trim(),
        province: a.province.trim(),
        postalCode: a.postalCode.trim(),
        country: typeof a.country === "string" ? a.country.trim() : undefined,
      },
      deliveryMethod,
      paymentMethod,
      notes: typeof notes === "string" ? notes.trim() : null,
      discountCode: typeof discountCode === "string" ? discountCode : undefined,
      lines: resolvedLines,
    },
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => null)) as OrderPayload | null;
    if (!body) {
      return NextResponse.json({ success: false, error: "Invalid request body." }, { status: 400 });
    }

    const result = validatePayload(body);
    if (!result.ok) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    const order = await createOrder(result.value);
    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (error) {
    if (error instanceof OrderValidationError) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
    console.error("Error creating order", error);
    return NextResponse.json({ success: false, error: "Failed to place order." }, { status: 500 });
  }
}
