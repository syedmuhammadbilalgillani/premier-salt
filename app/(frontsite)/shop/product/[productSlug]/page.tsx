import { notFound } from "next/navigation";

import { PageHero } from "@/components/layout/PageHero";
import { ShopProductCard } from "@/components/ui/ShopProductCard";
import { getShopProductBySlug, getShopProducts } from "@/lib/product";
import { ShopProductDetailClient } from "@/routes/ShopProductDetailClient";

// Shop content is admin-managed and cache-tagged (revalidateTag on every
// product mutation) — no need to force-dynamic a public page.

export default async function ShopProductPage({
  params,
}: {
  params: Promise<{ productSlug: string }>;
}) {
  const { productSlug } = await params;

  const product = await getShopProductBySlug(productSlug);
  if (!product) {
    notFound();
  }

  const allProducts = await getShopProducts();
  const related = allProducts
    .filter((p) => p.categoryId === product.categoryId && p.slug !== product.slug)
    .slice(0, 4);

  return (
    <>
      <PageHero
        eyebrow={product.categoryTitle ?? "Shop"}
        title={product.title}
        description={product.description ?? undefined}
        crumbs={[{ label: "Shop", to: "/shop" }, { label: product.title }]}
      />

      <ShopProductDetailClient product={product} />

      {related.length > 0 && (
        <div className="mx-auto max-w-7xl px-6 pb-20 md:px-8">
          <h2 className="mb-6 font-serif text-2xl text-maroon">Related Products</h2>
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
            {related.map((p) => (
              <ShopProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
