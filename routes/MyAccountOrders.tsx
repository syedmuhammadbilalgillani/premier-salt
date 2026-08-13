"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { PageHero } from "@/components/layout/PageHero";
import { useMyOrders } from "@/hooks/useMyOrders";
import { ORDER_STATUS_LABELS, type OrderStatus } from "@/lib/orderStatus";

interface MyOrderSummary {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  total: number;
  createdAt: string;
}

export default function MyAccountOrders() {
  const { orderIds } = useMyOrders();
  const [orders, setOrders] = useState<MyOrderSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    Promise.all(
      orderIds.map((id) =>
        fetch(`/api/order/${id}`)
          .then((res) => res.json())
          .then((json) => (json.success ? (json.data as MyOrderSummary) : null))
          .catch(() => null),
      ),
    ).then((results) => {
      if (cancelled) return;
      const found = results.filter((o): o is MyOrderSummary => o !== null);
      found.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
      setOrders(found);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [orderIds]);

  return (
    <>
      <PageHero
        eyebrow="Shop"
        title="Your Orders"
        description="Orders placed from this browser. Orders placed on another device won't appear here — use Order Tracking with your order number and email instead."
        crumbs={[{ label: "My Account", to: "/my-account" }, { label: "Orders" }]}
      />
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-8">
        {loading ? (
          <p className="text-muted-foreground">Loading your orders…</p>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-start gap-2">
            <p className="text-muted-foreground">
              No orders yet in this browser. Orders you place will appear here.
            </p>
            <Link href="/order-tracking" className="text-sm font-semibold text-primary hover:text-primary/80">
              Track an order from another device →
            </Link>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-border border-y border-border">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/order-confirmation/${order.id}`}
                className="flex items-center justify-between py-4 hover:text-primary"
              >
                <div>
                  <p className="font-medium text-charcoal">{order.orderNumber}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString()} ·{" "}
                    {ORDER_STATUS_LABELS[order.status]}
                  </p>
                </div>
                <span className="font-serif text-primary">
                  PKR {order.total.toLocaleString()}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
