import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { getCachedCategoryOptions } from "@/lib/category";
import { ProductForm } from "@/components/admin/ProductForm";

// Authenticated admin page — never statically prerender at build time.
export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const categoryOptions = await getCachedCategoryOptions();

  return (
    <div className="mx-auto max-w-4xl px-6 py-8 bg-white">
      <div className="mb-6 flex flex-col gap-1">
        <Link
          href="/admin/products"
          className="inline-flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Products
        </Link>
        <h1 className="text-xl font-semibold">New Product</h1>
      </div>

      <ProductForm mode="create" categoryOptions={categoryOptions} />
    </div>
  );
}
