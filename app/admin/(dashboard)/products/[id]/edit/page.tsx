import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { getCachedCategoryOptions } from "@/lib/category";
import { getCachedProduct } from "@/lib/product";
import { ProductForm } from "@/components/admin/ProductForm";

// Authenticated admin page — never statically prerender at build time.
export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await getCachedProduct(id);
  if (!product) {
    notFound();
  }

  const categoryOptions = await getCachedCategoryOptions();

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <div className="mb-6 flex flex-col gap-1">
        <Link
          href="/admin/products"
          className="inline-flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Products
        </Link>
        <h1 className="text-xl font-semibold">Edit Product</h1>
      </div>

      <ProductForm
        mode="edit"
        productId={product.id}
        categoryOptions={categoryOptions}
        defaultValues={{
          title: product.title,
          slug: product.slug,
          description: product.description ?? "",
          categoryId: product.categoryId,
          basePrice: product.basePrice ?? "",
          compareAtPrice: product.compareAtPrice ?? "",
          stockQuantity: String(product.stockQuantity ?? 0),
          sku: product.sku ?? "",
          status: product.status,
          channel: product.channel,
          hasVariants: product.hasVariants,
          spec: product.spec ?? {},
          images: product.images.map((img) => ({
            url: img.url,
            altText: img.altText ?? "",
            isPrimary: img.isPrimary,
          })),
        }}
        initialOptions={product.options.map((option) => ({
          id: option.id,
          name: option.name,
          values: option.values.map((v) => ({
            id: v.id,
            value: v.value,
            priceModifier: v.priceModifier,
          })),
        }))}
        initialVariants={product.variants.map((variant) => ({
          id: variant.id,
          combination: variant.combination,
          sku: variant.sku ?? "",
          price: variant.price,
          compareAtPrice: variant.compareAtPrice ?? "",
          stockQuantity: variant.stockQuantity,
          isActive: variant.isActive,
          imageUrl: variant.imageUrl ?? "",
        }))}
      />
    </div>
  );
}
