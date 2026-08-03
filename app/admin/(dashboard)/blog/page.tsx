import Link from "next/link";
import { FolderTree, Plus } from "lucide-react";

import { getCachedBlogPosts } from "@/lib/blog";
import { Button } from "@/components/ui/button";
import { BlogPostsTable } from "./_components/BlogPostsTable";

// Authenticated admin page — never statically prerender at build time. The
// actual DB reads are still cached via unstable_cache/revalidateTag in
// lib/blog.ts.
export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const data = await getCachedBlogPosts();

  return (
    <div className="px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Blog</h1>
          <p className="text-sm text-muted-foreground">
            Manage the articles shown on the storefront&apos;s Blog page.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline">
            <Link href="/admin/blog/categories">
              <FolderTree className="size-4" />
              Categories
            </Link>
          </Button>
          <Button asChild>
            <Link href="/admin/blog/new">
              <Plus className="size-4" />
              New Post
            </Link>
          </Button>
        </div>
      </div>

      <BlogPostsTable data={data} />
    </div>
  );
}
