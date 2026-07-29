"use client";

import { useEffect, useState } from "react";
import type { ShopProduct } from "@/lib/product";

let cache: ShopProduct[] | null = null;
let inflight: Promise<ShopProduct[]> | null = null;
const listeners = new Set<() => void>();

function load(): Promise<ShopProduct[]> {
  if (cache) return Promise.resolve(cache);
  if (!inflight) {
    inflight = fetch("/api/shop/products")
      .then((res) => res.json())
      .then((json) => {
        cache = json.success ? (json.data as ShopProduct[]) : [];
        return cache;
      })
      .catch(() => {
        cache = [];
        return cache;
      })
      .finally(() => {
        inflight = null;
        listeners.forEach((l) => l());
      });
  }
  return inflight;
}

/** Fetch-once-and-share shop product catalog — same pattern as useCart/useWishlist. */
export function useShopCatalog() {
  const [products, setProducts] = useState<ShopProduct[]>(() => cache ?? []);
  const [loading, setLoading] = useState(() => cache === null);

  useEffect(() => {
    const listener = () => {
      setProducts(cache ?? []);
      setLoading(false);
    };
    listeners.add(listener);
    if (cache === null) {
      load();
    }
    return () => {
      listeners.delete(listener);
    };
  }, []);

  return { products, loading };
}
