import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";

import { getCachedBlogCategories } from "@/lib/blog";
import { Button } from "@/components/ui/button";
import { BlogCategoriesTable } from "./_components/BlogCategoriesTable";

// Authenticated admin page — never statically prerender at build time.
export const dynamic = "force-dynamic";

export default async function BlogCategoriesPage() {
  const data = await getCachedBlogCategories();

  return (
    <div className="px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link
            href="/admin/blog"
            className="mb-1 inline-flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Blog
          </Link>
          <h1 className="text-xl font-semibold">Blog Categories</h1>
          <p className="text-sm text-muted-foreground">
            Manage the taxonomy used to classify blog posts.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/blog/categories/new">
            <Plus className="size-4" />
            New Category
          </Link>
        </Button>
      </div>

      <BlogCategoriesTable data={data} />
    </div>
  );
}
