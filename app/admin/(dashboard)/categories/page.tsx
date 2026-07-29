import Link from "next/link";
import { Plus } from "lucide-react";

import { getCachedCategories } from "@/lib/category";
import { Button } from "@/components/ui/button";
import { CategoriesTable } from "./_components/CategoriesTable";

// This is an authenticated admin page — force-dynamic keeps it from ever
// being statically prerendered at build time (which would both bypass auth
// and freeze the data). The actual DB reads are still cached via
// unstable_cache/revalidateTag in lib/category.ts.
export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const rows = await getCachedCategories({});

  const titleById = new Map(rows.map((c) => [c.id, c.title]));
  const data = rows.map((c) => ({
    ...c,
    parentTitle: c.parentCategoryId
      ? (titleById.get(c.parentCategoryId) ?? null)
      : null,
  }));

  console.log(data, "data in admin categories");

  return (
    <div className="px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Categories</h1>
          <p className="text-sm text-muted-foreground">
            Manage the categories shown on the storefront.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/categories/new">
            <Plus className="size-4" />
            New Category
          </Link>
        </Button>
      </div>

      <CategoriesTable data={data} />
    </div>
  );
}
