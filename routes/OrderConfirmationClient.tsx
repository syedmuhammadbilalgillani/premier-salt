"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ORDER_STATUS_LABELS } from "@/lib/orderStatus";
import type { OrderDetail } from "@/lib/order";

export function OrderConfirmationClient({ order }: { order: OrderDetail }) {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16 md:px-8">
      <div className="rounded-sm border border-border bg-cream p-8 print:border-none">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted">
              Order Number
            </p>
            <p className="font-serif text-2xl text-maroon">{order.orderNumber}</p>
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
              {order.customerFirstName} {order.customerLastName}
            </p>
            <p className="text-sm text-muted">{order.customerEmail}</p>
            <p className="text-sm text-muted">{order.customerPhone}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted">
              Delivery Address
            </p>
            <p className="text-sm text-charcoal">
              {order.addressLine1}
              {order.addressLine2 ? `, ${order.addressLine2}` : ""}
            </p>
            <p className="text-sm text-muted">
              {order.addressCity}, {order.addressProvince}{" "}
              {order.addressPostalCode}
            </p>
            <p className="text-sm text-muted">{order.addressCountry}</p>
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
            <span className="text-muted">{ORDER_STATUS_LABELS[order.status]}</span>
          </p>
        </div>

        <ul className="flex flex-col gap-2 border-b border-border py-5 text-sm">
          {order.lines.map((line) => (
            <li key={line.id} className="flex justify-between">
              <span className="text-charcoal">
                {line.name}
                {line.variantLabel ? ` — ${line.variantLabel}` : ""} × {line.quantity}
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
  );
}
