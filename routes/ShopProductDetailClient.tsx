"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/button";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { readStorage, writeStorage } from "@/lib/storage";
import { track, trackClick } from "@/lib/track";
import type { ShopProduct } from "@/lib/product";
import { toast } from "sonner";

function variantLabel(variant: ShopProduct["variants"][number]) {
  return (
    Object.values(variant.combination).join(" / ") || variant.sku || "Option"
  );
}

export function ShopProductDetailClient({ product }: { product: ShopProduct }) {
  const { addItem } = useCart();
  const { toggle, has } = useWishlist();
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    product.hasVariants ? (product.variants[0]?.id ?? null) : null,
  );
  const [quantity, setQuantity] = useState(1);
  const [notifyEmail, setNotifyEmail] = useState("");
  const [notifySent, setNotifySent] = useState(false);

  useEffect(() => {
    track("view", { entityType: "product", entityId: product.id });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);

  const selectedVariant = useMemo(
    () =>
      selectedVariantId
        ? (product.variants.find((v) => v.id === selectedVariantId) ?? null)
        : null,
    [product.variants, selectedVariantId],
  );

  const price = selectedVariant
    ? selectedVariant.price
    : (product.basePrice ?? 0);
  const compareAtPrice = selectedVariant
    ? selectedVariant.compareAtPrice
    : product.compareAtPrice;
  const stock = selectedVariant
    ? selectedVariant.stockQuantity
    : product.stockQuantity;
  const sku = selectedVariant ? selectedVariant.sku : product.sku;
  const inStock = stock > 0;
  const activeImage =
    selectedVariant?.imageUrl ??
    product.images.find((img) => img.isPrimary)?.url ??
    product.images.at(0)?.url ??
    null;

  const canAddToCart = product.hasVariants
    ? Boolean(selectedVariant) && inStock
    : inStock;

  function handleNotify() {
    if (!notifyEmail) return;
    const list = readStorage<Record<string, string[]>>(
      "premierSalt.recentlyViewed",
      {},
    );
    writeStorage("premierSalt.recentlyViewed", {
      ...list,
      [product.slug]: [...(list[product.slug] ?? []), notifyEmail],
    });
    setNotifySent(true);
  }

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-14 px-6 py-16 md:grid-cols-2 md:px-8">
      <Reveal>
        {activeImage ? (
          <div className="relative aspect-square w-full overflow-hidden rounded-sm bg-sand/40">
            <Image
              src={activeImage}
              alt={product.title}
              fill
              className="object-cover"
              sizes="(min-width: 768px) 45vw, 90vw"
            />
          </div>
        ) : (
          <ImagePlaceholder
            label={`${product.title} — Gallery`}
            width={800}
            height={800}
          />
        )}
      </Reveal>

      <Reveal delay={0.1} className="flex flex-col gap-5">
        {sku && (
          <span className="text-xs uppercase tracking-wide text-muted-foreground">
            SKU {sku}
          </span>
        )}
        <div className="flex items-baseline gap-3">
          <span className="font-serif text-3xl text-primary">
            PKR {price.toLocaleString()}
          </span>
          {compareAtPrice && (
            <span className="text-sm text-muted-foregroundline-through">
              PKR {compareAtPrice.toLocaleString()}
            </span>
          )}
        </div>
        <span
          className={`w-fit rounded-sm px-2.5 py-1 text-xs font-semibold uppercase ${inStock ? "bg-success/10 text-success" : "bg-error/10 text-error"}`}
        >
          {inStock ? `In Stock (${stock} available)` : "Out of Stock"}
        </span>
        {product.description && (
          <p className="text-sm leading-relaxed text-muted-foreground">
            {product.description}
          </p>
        )}

        {product.hasVariants && (
          <div>
            <label
              htmlFor="variant-select"
              className="mb-1.5 block text-sm font-semibold text-charcoal"
            >
              Packaging
            </label>
            <select
              id="variant-select"
              value={selectedVariantId ?? ""}
              onChange={(e) => {
                setSelectedVariantId(e.target.value || null);
                setQuantity(1);
              }}
              className="w-full rounded-sm border border-border bg-white px-3 py-2 text-sm text-charcoal outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
            >
              {product.variants.map((variant) => (
                <option
                  key={variant.id}
                  value={variant.id}
                  disabled={variant.stockQuantity <= 0}
                >
                  {variantLabel(variant)} — PKR {variant.price.toLocaleString()}
                  {variant.stockQuantity <= 0 ? " (Out of Stock)" : ""}
                </option>
              ))}
            </select>
          </div>
        )}

        {canAddToCart ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center rounded-sm border border-border">
              <button
                className="px-3 py-2 text-lg"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="w-8 text-center text-sm">{quantity}</span>
              <button
                className="px-3 py-2 text-lg"
                onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <Button
              onClick={() => {
                trackClick({ entityType: "product", entityId: product.id, label: "add_to_cart" });
                addItem(product.slug, selectedVariantId, quantity);
                toast.success(
                  `${quantity} × "${product.title}" added to cart`,
                );
              }}
              className="flex-1"
            >
              Add to Cart
            </Button>
            <button
              aria-label={
                has(product.slug) ? "Remove from wishlist" : "Add to wishlist"
              }
              onClick={() => {
                toggle(product.slug);
                toast.success(
                  has(product.slug)
                    ? "Removed from wishlist"
                    : "Added to wishlist",
                );
              }}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm border border-border transition-transform hover:scale-105"
            >
              <Heart
                className={`h-4.5 w-4.5 ${has(product.slug) ? "fill-primary text-primary" : "text-charcoal"}`}
              />
            </button>
          </div>
        ) : notifySent ? (
          <p className="text-sm text-success">
            We&apos;ll email you at {notifyEmail} when this is back in stock.
          </p>
        ) : (
          <div className="flex gap-3">
            <input
              type="email"
              placeholder="Your email"
              value={notifyEmail}
              onChange={(e) => setNotifyEmail(e.target.value)}
              className="flex-1 rounded-sm border border-border px-3 py-2 text-sm"
            />
            <Button onClick={handleNotify}>Notify Me</Button>
          </div>
        )}

        <div className="mt-2 flex flex-col gap-3 border-t border-border pt-5 text-sm">
          {product.spec &&
            Object.entries(product.spec).map(([key, value]) => (
              <div key={key}>
                <span className="font-semibold text-charcoal">{key}: </span>
                <span className="text-muted-foreground">{value}</span>
              </div>
            ))}
          <div>
            <span className="font-semibold text-charcoal">Shipping: </span>
            <span className="text-muted-foreground">
              Flat PKR 250, free on orders over PKR 5,000.
            </span>
          </div>
          <div>
            <span className="font-semibold text-charcoal">Returns: </span>
            <span className="text-muted-foreground">
              See our{" "}
              <Link
                href="/returns-refunds"
                className="text-primary hover:underline"
              >
                Returns &amp; Refunds policy
              </Link>
              .
            </span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">No reviews yet.</p>
        <Link
          href="/request-a-quote"
          className="text-sm font-semibold text-primary hover:text-primary"
        >
          Looking for bulk quantity? Request a B2B quote <ArrowRight />
        </Link>
      </Reveal>
    </div>
  );
}
