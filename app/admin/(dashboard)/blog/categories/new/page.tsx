import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { BlogCategoryForm } from "@/components/admin/BlogCategoryForm";

// Authenticated admin page — never statically prerender at build time.
export const dynamic = "force-dynamic";

export default function NewBlogCategoryPage() {
  return (
    <div className="px-6 py-8">
      <div className="mb-6 flex flex-col gap-1">
        <Link
          href="/admin/blog/categories"
          className="inline-flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Blog Categories
        </Link>
        <h1 className="text-xl font-semibold">New Blog Category</h1>
      </div>

      <BlogCategoryForm mode="create" />
    </div>
  );
}
