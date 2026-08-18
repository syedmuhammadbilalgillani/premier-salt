import type { Metadata } from "next";
import { BlogListingView } from "@/components/storefront/BlogListingView";
import { getCachedPublishedBlogPosts } from "@/lib/blog";
import { buildMetadata } from "@/lib/seo";

// Blog content is admin-managed and cache-tagged (revalidateTag on every
// blog-post mutation) — no need to force-dynamic a public page.

export const metadata: Metadata = buildMetadata({
  title: "Blog",
  description:
    "Articles on Himalayan salt — sourcing, processing, uses and buying guides from Premier Salt Industries.",
  path: "/blog",
});

export default async function BlogPage() {
  const allPosts = await getCachedPublishedBlogPosts();

  return <BlogListingView allPosts={allPosts} />;
}
