import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { getCachedBlogCategoryOptions } from "@/lib/blog";
import { BlogPostForm } from "@/components/admin/BlogPostForm";

// Authenticated admin page — never statically prerender at build time.
export const dynamic = "force-dynamic";

export default async function NewBlogPostPage() {
  const categoryOptions = await getCachedBlogCategoryOptions();

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <div className="mb-6 flex flex-col gap-1">
        <Link
          href="/admin/blog"
          className="inline-flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Blog
        </Link>
        <h1 className="text-xl font-semibold">New Blog Post</h1>
      </div>

      <BlogPostForm mode="create" categoryOptions={categoryOptions} />
    </div>
  );
}
