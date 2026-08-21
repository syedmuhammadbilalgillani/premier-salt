import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageHero } from "@/components/layout/PageHero";
import { ShopProductCard } from "@/components/ui/ShopProductCard";
import { getShopProductBySlug, getShopProducts } from "@/lib/product";
import { buildMetadata, toPlainDescription } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { getProductSchema, getBreadcrumbSchema } from "@/lib/schema";
import { ShopProductDetailClient } from "@/routes/ShopProductDetailClient";

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const products = await getShopProducts();
  return products.map((p) => ({ productSlug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ productSlug: string }>;
}): Promise<Metadata> {
  const { productSlug } = await params;
  const product = await getShopProductBySlug(productSlug);
  if (!product) {
    return buildMetadata({
      title: "Product",
      description: "",
      path: `/shop/product/${productSlug}`,
      noindex: true,
    });
  }

  const primaryImage =
    product.images.find((img) => img.isPrimary)?.url ?? product.images[0]?.url;

  return buildMetadata({
    title: `${product.title} | Buy Himalayan Salt Online`,
    description:
      toPlainDescription(product.description) ||
      `Buy authentic ${product.title} online from Premier Salt Industries. 100% natural Himalayan pink rock salt with Pakistan-wide delivery and export-grade quality.`,
    path: `/shop/product/${productSlug}`,
    image: primaryImage,
  });
}

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
    .filter(
      (p) => p.categoryId === product.categoryId && p.slug !== product.slug,
    )
    .slice(0, 4);

  const productSchema = getProductSchema(product);
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Shop", url: "/shop" },
    { name: product.categoryTitle ?? "Products", url: "/shop" },
    { name: product.title, url: `/shop/product/${product.slug}` },
  ]);

  return (
    <>
      <JsonLd data={[productSchema, breadcrumbSchema]} />
      <PageHero
        eyebrow={product.categoryTitle ?? "Shop"}
        title={product.title}
        description={product.description ?? undefined}
        crumbs={[{ label: "Shop", to: "/shop" }, { label: product.title }]}
      />

      <ShopProductDetailClient product={product} />

      {related.length > 0 && (
        <div className="mx-auto max-w-7xl px-6 pb-20 md:px-8">
          <h2 className="mb-6 font-serif text-2xl text-primary">
            Related Products
          </h2>
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
