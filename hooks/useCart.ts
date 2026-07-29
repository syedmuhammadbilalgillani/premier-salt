"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { readStorage, writeStorage } from "@/lib/storage";
import { useShopCatalog } from "@/hooks/useShopCatalog";
import type { ShopProduct } from "@/lib/product";

export interface CartLine {
  productSlug: string;
  /** null = simple (non-variant) product, priced/stocked off the product itself. */
  variantId: string | null;
  quantity: number;
}

export interface CartItem extends CartLine {
  product: ShopProduct;
  variant: ShopProduct["variants"][number] | null;
  name: string;
  variantLabel: string | null;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  sku: string | null;
  imageUrl: string | null;
}

const KEY = "premierSalt.cart";
const listeners = new Set<() => void>();

function sameLine(a: { productSlug: string; variantId: string | null }, productSlug: string, variantId: string | null) {
  return a.productSlug === productSlug && a.variantId === variantId;
}

function readCart(): CartLine[] {
  return readStorage<CartLine[]>(KEY, []);
}

function writeCart(lines: CartLine[]) {
  writeStorage(KEY, lines);
  listeners.forEach((l) => l());
}

function resolveVariant(product: ShopProduct | undefined, variantId: string | null) {
  if (!product || !variantId) return null;
  return product.variants.find((v) => v.id === variantId) ?? null;
}

function resolveStock(product: ShopProduct, variant: ShopProduct["variants"][number] | null) {
  return variant ? variant.stockQuantity : product.stockQuantity;
}

export function useCart() {
  const { products } = useShopCatalog();
  const [lines, setLines] = useState<CartLine[]>(() => readCart());

  useEffect(() => {
    const listener = () => setLines(readCart());
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const addItem = useCallback(
    (productSlug: string, variantId: string | null, quantity: number) => {
      const product = products.find((p) => p.slug === productSlug);
      const variant = resolveVariant(product, variantId);
      const maxStock = product ? resolveStock(product, variant) : 99;
      const current = readCart();
      const existing = current.find((l) => sameLine(l, productSlug, variantId));
      if (existing) {
        existing.quantity = Math.min(existing.quantity + quantity, maxStock);
        writeCart([...current]);
      } else {
        writeCart([...current, { productSlug, variantId, quantity: Math.min(quantity, maxStock) }]);
      }
    },
    [products],
  );

  const updateQuantity = useCallback(
    (productSlug: string, variantId: string | null, quantity: number) => {
      const product = products.find((p) => p.slug === productSlug);
      const variant = resolveVariant(product, variantId);
      const maxStock = product ? resolveStock(product, variant) : 99;
      const current = readCart();
      if (quantity <= 0) {
        writeCart(current.filter((l) => !sameLine(l, productSlug, variantId)));
        return;
      }
      writeCart(
        current.map((l) =>
          sameLine(l, productSlug, variantId) ? { ...l, quantity: Math.min(quantity, maxStock) } : l,
        ),
      );
    },
    [products],
  );

  const removeItem = useCallback((productSlug: string, variantId: string | null) => {
    writeCart(readCart().filter((l) => !sameLine(l, productSlug, variantId)));
  }, []);

  const clearCart = useCallback(() => writeCart([]), []);

  const items: CartItem[] = useMemo(
    () =>
      lines
        .map((line) => {
          const product = products.find((p) => p.slug === line.productSlug);
          if (!product) return null;
          const variant = resolveVariant(product, line.variantId);
          if (line.variantId && !variant) return null; // stale line, variant no longer exists

          const price = variant ? variant.price : (product.basePrice ?? 0);
          const compareAtPrice = variant ? variant.compareAtPrice : product.compareAtPrice;
          const stock = resolveStock(product, variant);
          const variantLabel = variant ? Object.values(variant.combination).join(" / ") : null;
          const primaryImage = product.images.find((img) => img.isPrimary)?.url ?? product.images.at(0)?.url ?? null;

          return {
            ...line,
            product,
            variant,
            name: variantLabel ? `${product.title} — ${variantLabel}` : product.title,
            variantLabel,
            price,
            compareAtPrice,
            stock,
            sku: variant?.sku ?? product.sku,
            imageUrl: variant?.imageUrl ?? primaryImage,
          };
        })
        .filter((v): v is CartItem => v !== null),
    [lines, products],
  );

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return {
    items,
    subtotal,
    itemCount,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
  };
}
