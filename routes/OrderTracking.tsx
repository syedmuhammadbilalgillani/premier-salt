"use client";

import { useState, type FormEvent } from "react";
import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";
import { FormField, inputClasses } from "@/components/ui/FormField";
import { findOrderByIdAndEmail } from "@/hooks/useOrders";
import type { Order } from "@/types/order";

const statuses: Order["status"][] = [
  "Order Received",
  "Confirmed",
  "Processing",
  "Ready for Dispatch",
  "Dispatched",
  "Delivered",
];

export default function OrderTracking() {
  const [order, setOrder] = useState<Order | null | undefined>(undefined);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const id = (form.get("orderId") as string)?.trim();
    const email = (form.get("email") as string)?.trim();
    setOrder(findOrderByIdAndEmail(id, email) ?? null);
  }

  return (
    <>
      <PageHero
        eyebrow="Shop"
        title="Track Your Order"
        description="Enter your order number and email to see its current status."
        crumbs={[{ label: "Order Tracking" }]}
      />
      <div className="mx-auto max-w-xl px-6 py-16 md:px-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FormField label="Order Number" htmlFor="orderId" required>
            <input
              id="orderId"
              name="orderId"
              placeholder="PS-2026-0001"
              className={inputClasses}
              required
            />
          </FormField>
          <FormField label="Email Address" htmlFor="email" required>
            <input
              id="email"
              name="email"
              type="email"
              className={inputClasses}
              required
            />
          </FormField>
          <Button type="submit">Track Order</Button>
        </form>

        {order === null && (
          <p className="mt-6 text-sm text-error">
            No matching order was found. Check the order number and email, then
            try again.
          </p>
        )}

        {order && (
          <div className="mt-10">
            <p className="font-serif text-xl text-maroon">Order {order.id}</p>
            <ol className="mt-6 flex flex-col gap-3">
              {statuses.map((status) => {
                const reached =
                  statuses.indexOf(order.status) >= statuses.indexOf(status);
                return (
                  <li key={status} className="flex items-center gap-3">
                    <span
                      className={`h-3 w-3 rounded-full ${reached ? "bg-terracotta" : "bg-border"}`}
                    />
                    <span
                      className={`text-sm ${reached ? "text-charcoal" : "text-muted"}`}
                    >
                      {status}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>
        )}
      </div>
    </>
  );
}
