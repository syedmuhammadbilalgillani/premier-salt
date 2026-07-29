import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { getCachedCategoryOptions } from "@/lib/category";
import { CategoryForm } from "@/components/admin/CategoryForm";

// Authenticated admin page — never statically prerender at build time.
export const dynamic = "force-dynamic";

export default async function NewCategoryPage() {
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
        <h1 className="text-xl font-semibold">New Category</h1>
      </div>

      <CategoryForm mode="create" categoryOptions={categoryOptions} />
    </div>
  );
}
