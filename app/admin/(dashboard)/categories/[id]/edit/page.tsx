import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { getCachedCategory, getCachedCategoryOptions } from "@/lib/category";
import { CategoryForm } from "@/components/admin/CategoryForm";

// Authenticated admin page — never statically prerender at build time.
export const dynamic = "force-dynamic";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const category = await getCachedCategory(id);
  if (!category) {
    notFound();
  }

  const categoryOptions = await getCachedCategoryOptions();

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <div className="mb-6 flex flex-col gap-1">
        <Link
          href="/admin/categories"
          className="inline-flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Categories
        </Link>
        <h1 className="text-xl font-semibold">Edit Category</h1>
      </div>

      <CategoryForm
        mode="edit"
        categoryId={category.id}
        categoryOptions={categoryOptions}
        defaultValues={{
          title: category.title,
          slug: category.slug,
          description: category.description ?? "",
          image_url: category.image_url ?? "",
          parentCategoryId: category.parentCategoryId ?? undefined,
          spec: category.spec ?? {},
        }}
      />
    </div>
  );
}
