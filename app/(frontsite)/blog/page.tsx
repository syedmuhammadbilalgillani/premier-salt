import { BlogListingView } from "@/components/storefront/BlogListingView";
import { getCachedPublishedBlogPosts } from "@/lib/blog";

// Blog content is admin-managed and cache-tagged (revalidateTag on every
// blog-post mutation) — no need to force-dynamic a public page.

export default async function BlogPage() {
  const allPosts = await getCachedPublishedBlogPosts();

  return <BlogListingView allPosts={allPosts} />;
}
