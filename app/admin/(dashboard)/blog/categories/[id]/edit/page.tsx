import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { getCachedBlogCategory } from "@/lib/blog";
import { BlogCategoryForm } from "@/components/admin/BlogCategoryForm";

// Authenticated admin page — never statically prerender at build time.
export const dynamic = "force-dynamic";

export default async function EditBlogCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const category = await getCachedBlogCategory(id);
  if (!category) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <div className="mb-6 flex flex-col gap-1">
        <Link
          href="/admin/blog/categories"
          className="inline-flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Blog Categories
        </Link>
        <h1 className="text-xl font-semibold">Edit Blog Category</h1>
      </div>

      <BlogCategoryForm
        mode="edit"
        categoryId={category.id}
        defaultValues={{ title: category.title, slug: category.slug }}
      />
    </div>
  );
}
