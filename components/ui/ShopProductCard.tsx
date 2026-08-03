"use client";

import { Heart } from "lucide-react";
import Image from "next/image";
import type { ShopProduct } from "@/lib/product";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import Link from "next/link";

function priceRange(product: ShopProduct) {
  if (!product.hasVariants || product.variants.length === 0) {
    return { min: product.basePrice ?? 0, max: product.basePrice ?? 0 };
  }
  const prices = product.variants.map((v) => v.price);
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

function totalStock(product: ShopProduct) {
  if (!product.hasVariants) return product.stockQuantity;
  return product.variants.reduce((sum, v) => sum + v.stockQuantity, 0);
}

export function ShopProductCard({ product }: { product: ShopProduct }) {
  const { addItem } = useCart();
  const { toggle, has } = useWishlist();
  const stock = totalStock(product);
  const inStock = stock > 0;
  const { min, max } = priceRange(product);
  const primaryImage =
    product.images.find((img) => img.isPrimary)?.url ??
    product.images.at(0)?.url ??
    null;

  return (
    <div className="group flex flex-col">
      <div className="relative">
        <Link href={`/shop/product/${product.slug}`}>
          {primaryImage ? (
            <div className="relative aspect-square w-full overflow-hidden rounded-sm bg-sand/40">
              <Image
                src={primaryImage}
                alt={product.title}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, 90vw"
              />
            </div>
          ) : (
            <ImagePlaceholder label={product.title} width={600} height={600} />
          )}
        </Link>
        <button
          aria-label={
            has(product.slug) ? "Remove from wishlist" : "Add to wishlist"
          }
          onClick={() => toggle(product.slug)}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm"
        >
          <Heart
            className={`h-4 w-4 ${has(product.slug) ? "fill-primary text-primary" : "text-charcoal"}`}
          />
        </button>
        <span
          className={`absolute left-3 top-3 rounded-sm px-2 py-1 text-[11px] font-semibold uppercase tracking-wide ${
            inStock ? "bg-success/90 text-white" : "bg-error/90 text-white"
          }`}
        >
          {inStock ? "In Stock" : "Out of Stock"}
        </span>
      </div>
      <Link
        href={`/shop/product/${product.slug}`}
        className="mt-3 text-sm font-medium text-charcoal hover:text-primary"
      >
        {product.title}
      </Link>
      <span className="text-xs text-muted-foreground">
        {product.categoryTitle}
      </span>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="font-serif text-lg text-primary">
          {min === max
            ? `PKR ${min.toLocaleString()}`
            : `PKR ${min.toLocaleString()} – ${max.toLocaleString()}`}
        </span>
        {!product.hasVariants && product.compareAtPrice && (
          <span className="text-xs text-muted-foregroundline-through">
            PKR {product.compareAtPrice.toLocaleString()}
          </span>
        )}
      </div>
      {product.hasVariants ? (
        <Link
          href={`/shop/product/${product.slug}`}
          className="mt-3 block rounded-sm border border-primary py-2 text-center text-xs font-semibold uppercase tracking-wide text-primary transition-colors hover:bg-primary hover:text-cream"
        >
          Choose Options
        </Link>
      ) : (
        <button
          disabled={!inStock}
          onClick={() => addItem(product.slug, null, 1)}
          className="mt-3 rounded-sm border border-primary py-2 text-xs font-semibold uppercase tracking-wide text-primary transition-colors hover:bg-primary hover:text-cream disabled:cursor-not-allowed disabled:border-border disabled:text-muted-foregrounddisabled:hover:bg-transparent"
        >
          {inStock ? "Add to Cart" : "Out of Stock"}
        </button>
      )}
    </div>
  );
}
