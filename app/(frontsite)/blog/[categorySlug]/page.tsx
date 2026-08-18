import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BlogListingView } from "@/components/storefront/BlogListingView";
import { getCachedBlogCategoryBySlug, getCachedPublishedBlogPosts } from "@/lib/blog";
import { buildMetadata } from "@/lib/seo";

// Blog content is admin-managed and cache-tagged (revalidateTag on every
// blog-post mutation) — no need to force-dynamic a public page.

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}): Promise<Metadata> {
  const { categorySlug } = await params;
  const category = await getCachedBlogCategoryBySlug(categorySlug);
  if (!category) {
    return buildMetadata({
      title: "Blog",
      description: "",
      path: `/blog/${categorySlug}`,
      noindex: true,
    });
  }

  return buildMetadata({
    title: `${category.title} Articles`,
    description: `Articles about ${category.title.toLowerCase()} from Premier Salt Industries.`,
    path: `/blog/${categorySlug}`,
  });
}

export default async function BlogCategoryPage({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}) {
  const { categorySlug } = await params;

  const category = await getCachedBlogCategoryBySlug(categorySlug);
  if (!category) notFound();

  const allPosts = await getCachedPublishedBlogPosts();

  return (
    <BlogListingView
      allPosts={allPosts}
      activeCategorySlug={category.slug}
      activeCategoryTitle={category.title}
    />
  );
}
