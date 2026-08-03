import { NextResponse } from "next/server";

import { getCachedPublishedBlogPosts } from "@/lib/blog";

// Public endpoint — powers the storefront search page's blog results.
// Not covered by proxy.ts's /api/blog/* auth matcher (deliberately a
// separate path), same pattern as /api/navigation/products and
// /api/shop/products.
export async function GET() {
  try {
    const posts = await getCachedPublishedBlogPosts();
    const data = posts.map((p) => ({
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt,
      categorySlug: p.categorySlug,
    }));
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error listing published blog posts", error);
    return NextResponse.json(
      { success: false, error: "Failed to load blog posts." },
      { status: 500 },
    );
  }
}
