"use client";

import { useCallback, useEffect, useState } from "react";
import { readStorage, writeStorage } from "@/lib/storage";

const KEY = "premierSalt.wishlist";
const listeners = new Set<() => void>();

function read(): string[] {
  return readStorage<string[]>(KEY, []);
}
function write(slugs: string[]) {
  writeStorage(KEY, slugs);
  listeners.forEach((l) => l());
}

export function useWishlist() {
  const [slugs, setSlugs] = useState<string[]>(() => read());

  useEffect(() => {
    const listener = () => setSlugs(read());
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const toggle = useCallback((slug: string) => {
    const current = read();
    write(
      current.includes(slug)
        ? current.filter((s) => s !== slug)
        : [...current, slug],
    );
  }, []);

  const remove = useCallback(
    (slug: string) => write(read().filter((s) => s !== slug)),
    [],
  );
  const has = useCallback((slug: string) => slugs.includes(slug), [slugs]);

  return { slugs, toggle, remove, has };
}
