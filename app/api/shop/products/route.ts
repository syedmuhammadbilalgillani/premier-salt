import { NextResponse } from "next/server";

import { getShopProducts } from "@/lib/product";

// Public endpoint — powers the /shop catalog, product cards and the cart's
// client-side price/stock resolution. Not covered by the /api/product auth
// matcher (deliberately, same reasoning as /api/navigation/products).
export async function GET() {
  try {
    const data = await getShopProducts();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error listing shop products", error);
    return NextResponse.json(
      { success: false, error: "Failed to load shop products." },
      { status: 500 },
    );
  }
}
