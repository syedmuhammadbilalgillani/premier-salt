import { NextResponse } from "next/server";

import { getCachedCategories } from "@/lib/category";

// Public endpoint — powers the storefront search page's category results.
// Not covered by proxy.ts's /api/category/* auth matcher (deliberately a
// separate path), same pattern as /api/navigation/products, /api/blog-posts
// and /api/shop/products.
export async function GET() {
  try {
    const categories = await getCachedCategories({});
    const data = categories.map((c) => ({
      title: c.title,
      slug: c.slug,
      // Strip HTML from the rich-text description for a plain-text snippet.
      description: (c.description ?? "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim(),
    }));
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error listing site categories", error);
    return NextResponse.json(
      { success: false, error: "Failed to load categories." },
      { status: 500 },
    );
  }
}
