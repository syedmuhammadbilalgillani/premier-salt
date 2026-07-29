"use client";
import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";
import { findOrder } from "@/hooks/useOrders";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const order = orderId ? findOrder(orderId as string) : undefined;

  if (!order) return notFound();

  return (
    <>
      <PageHero
        eyebrow="Order Confirmed"
        title="Thank You for Your Order"
        crumbs={[{ label: "Order Confirmation" }]}
      />
      <div className="mx-auto max-w-2xl px-6 py-16 md:px-8">
        <div className="rounded-sm border border-border bg-cream p-8 print:border-none">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted">
                Order Number
              </p>
              <p className="font-serif text-2xl text-maroon">{order.id}</p>
            </div>
            <p className="text-sm text-muted">
              {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 border-b border-border py-5 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted">
                Customer
              </p>
              <p className="text-sm text-charcoal">
                {order.customer.firstName} {order.customer.lastName}
              </p>
              <p className="text-sm text-muted">{order.customer.email}</p>
              <p className="text-sm text-muted">{order.customer.phone}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted">
                Delivery Address
              </p>
              <p className="text-sm text-charcoal">
                {order.address.line1}
                {order.address.line2 ? `, ${order.address.line2}` : ""}
              </p>
              <p className="text-sm text-muted">
                {order.address.city}, {order.address.province}{" "}
                {order.address.postalCode}
              </p>
              <p className="text-sm text-muted">{order.address.country}</p>
            </div>
          </div>

          <div className="border-b border-border py-5 text-sm">
            <p>
              <span className="font-semibold text-charcoal">Payment: </span>
              <span className="text-muted">{order.paymentMethod}</span>
            </p>
            <p>
              <span className="font-semibold text-charcoal">Delivery: </span>
              <span className="text-muted">{order.deliveryMethod}</span>
            </p>
            <p>
              <span className="font-semibold text-charcoal">Status: </span>
              <span className="text-muted">{order.status}</span>
            </p>
          </div>

          <ul className="flex flex-col gap-2 border-b border-border py-5 text-sm">
            {order.lines.map((line) => (
              <li
                key={`${line.slug}::${line.variantId ?? ""}`}
                className="flex justify-between"
              >
                <span className="text-charcoal">
                  {line.name} × {line.quantity}
                </span>
                <span className="text-muted">
                  PKR {(line.price * line.quantity).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>

          <dl className="flex flex-col gap-2 pt-5 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Subtotal</dt>
              <dd>PKR {order.subtotal.toLocaleString()}</dd>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-success">
                <dt>Discount</dt>
                <dd>− PKR {order.discount.toLocaleString()}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-muted">Shipping</dt>
              <dd>
                {order.shipping === 0
                  ? "Free"
                  : `PKR ${order.shipping.toLocaleString()}`}
              </dd>
            </div>
            <div className="flex justify-between border-t border-border pt-2 font-serif text-lg text-maroon">
              <dt>Total</dt>
              <dd>PKR {order.total.toLocaleString()}</dd>
            </div>
          </dl>
        </div>

        <div className="mt-8 flex flex-wrap gap-4 print:hidden">
          <Button onClick={() => window.print()}>Print Order</Button>
          <Link href="/shop">
            <Button variant="outline">Continue Shopping</Button>
          </Link>
          <Link href="/order-tracking">
            <Button variant="ghost">Track Order →</Button>
          </Link>
        </div>
      </div>
    </>
  );
}
