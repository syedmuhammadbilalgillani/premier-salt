"use client";

import { useCallback, useEffect, useState } from "react";
import { readStorage, writeStorage } from "@/lib/storage";

// No customer accounts exist yet — this remembers which orders were placed
// from *this* browser (by uuid, the same opaque id /order-confirmation uses)
// so "My Account > Orders" has something to show without a login system.
// Only works on the device/browser that placed the order.
const KEY = "premierSalt.myOrders";
const listeners = new Set<() => void>();

function read(): string[] {
  return readStorage<string[]>(KEY, []);
}
function write(ids: string[]) {
  writeStorage(KEY, ids);
  listeners.forEach((l) => l());
}

export function useMyOrders() {
  const [orderIds, setOrderIds] = useState<string[]>(() => read());

  useEffect(() => {
    const listener = () => setOrderIds(read());
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const addOrder = useCallback((id: string) => {
    const current = read();
    if (!current.includes(id)) write([id, ...current]);
  }, []);

  return { orderIds, addOrder };
}
