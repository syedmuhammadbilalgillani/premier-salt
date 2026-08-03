"use client";

import { useState, type FormEvent } from "react";
import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";
import { FormField, inputClasses } from "@/components/ui/FormField";
import {
  ORDER_PROGRESS_STATUSES,
  ORDER_STATUS_LABELS,
} from "@/lib/orderStatus";
import type { OrderDetail } from "@/lib/order";

export default function OrderTracking() {
  const [order, setOrder] = useState<OrderDetail | null | undefined>(undefined);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const orderNumber = (form.get("orderId") as string)?.trim();
    const email = (form.get("email") as string)?.trim();

    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/order/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNumber, email }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setOrder(null);
        setError(data.error || "No matching order was found.");
        return;
      }
      setOrder(data.data);
    } catch {
      setOrder(null);
      setError("Could not look up your order. Please try again.");
    } finally {
      setLoading(false);
    }
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
          <Button type="submit" disabled={loading}>
            {loading ? "Searching…" : "Track Order"}
          </Button>
        </form>

        {order === null && (
          <p className="mt-6 text-sm text-error">
            {error ||
              "No matching order was found. Check the order number and email, then try again."}
          </p>
        )}

        {order && (
          <div className="mt-10">
            <p className="font-serif text-xl text-primary">
              Order {order.orderNumber}
            </p>
            <ol className="mt-6 flex flex-col gap-3">
              {ORDER_PROGRESS_STATUSES.map((status) => {
                const reached =
                  order.status !== "cancelled" &&
                  ORDER_PROGRESS_STATUSES.indexOf(order.status) >=
                    ORDER_PROGRESS_STATUSES.indexOf(status);
                return (
                  <li key={status} className="flex items-center gap-3">
                    <span
                      className={`h-3 w-3 rounded-full ${reached ? "bg-primary" : "bg-border"}`}
                    />
                    <span
                      className={`text-sm ${reached ? "text-charcoal" : "text-muted-foreground"}`}
                    >
                      {ORDER_STATUS_LABELS[status]}
                    </span>
                  </li>
                );
              })}
            </ol>
            {order.status === "cancelled" && (
              <p className="mt-4 text-sm text-error">
                This order has been cancelled.
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
}
