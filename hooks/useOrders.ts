"use client";

import { readStorage, writeStorage } from "@/lib/storage";
import type { Order } from "@/types/order";

const KEY = "premierSalt.orders";

export function readOrders(): Order[] {
  return readStorage<Order[]>(KEY, []);
}

export function saveOrder(order: Order) {
  const existing = readOrders();
  writeStorage(KEY, [...existing, order]);
}

export function generateOrderId(): string {
  const year = new Date().getFullYear();
  const existing = readOrders().filter((o) => o.id.includes(String(year)));
  const next = String(existing.length + 1).padStart(4, "0");
  return `PS-${year}-${next}`;
}

export function findOrder(id: string): Order | undefined {
  return readOrders().find((o) => o.id.toLowerCase() === id.toLowerCase());
}

export function findOrderByIdAndEmail(
  id: string,
  email: string,
): Order | undefined {
  return readOrders().find(
    (o) =>
      o.id.toLowerCase() === id.toLowerCase() &&
      o.customer.email.toLowerCase() === email.toLowerCase(),
  );
}
