import { NextResponse } from "next/server";

import { getProductNavTree } from "@/lib/navigation";

// Public endpoint — powers the storefront "Products" nav dropdown, not
// covered by any of the /api/category|product|file-manager auth matchers.
export async function GET() {
  try {
    const data = await getProductNavTree();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error building product navigation", error);
    return NextResponse.json(
      { success: false, error: "Failed to load navigation." },
      { status: 500 },
    );
  }
}
