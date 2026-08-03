import { notFound } from "next/navigation";

import { BlogListingView } from "@/components/storefront/BlogListingView";
import { getCachedBlogCategoryBySlug, getCachedPublishedBlogPosts } from "@/lib/blog";

// Blog content is admin-managed and cache-tagged (revalidateTag on every
// blog-post mutation) — no need to force-dynamic a public page.

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
