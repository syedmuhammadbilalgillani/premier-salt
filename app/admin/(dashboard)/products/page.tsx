import Link from "next/link";
import { Plus } from "lucide-react";

import { getCachedProductList } from "@/lib/product";
import { Button } from "@/components/ui/button";
import { ProductsTable } from "./_components/ProductsTable";

// Authenticated admin page — never statically prerender at build time. The
// underlying DB reads are still cached via unstable_cache/revalidateTag.
export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const data = await getCachedProductList();

  return (
    <div className="px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Products</h1>
          <p className="text-sm text-muted-foreground">
            Manage the products sold on the storefront.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="size-4" />
            New Product
          </Link>
        </Button>
      </div>

      <ProductsTable data={data} />
    </div>
  );
}
