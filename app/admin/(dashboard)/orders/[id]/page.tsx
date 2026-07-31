import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { getCachedOrder } from "@/lib/order";
import { isValidUuid } from "@/lib/validators";
import { OrderStatusForm } from "./_components/OrderStatusForm";

// Authenticated admin page — never statically prerender at build time.
export const dynamic = "force-dynamic";

function formatPrice(value: number) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "PKR" }).format(value);
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!isValidUuid(id)) {
    notFound();
  }

  const order = await getCachedOrder(id);
  if (!order) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <div className="mb-6 flex flex-col gap-1">
        <Link
          href="/admin/orders"
          className="inline-flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Orders
        </Link>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-xl font-semibold">{order.orderNumber}</h1>
          <span className="text-sm text-muted-foreground">
            Placed {new Date(order.createdAt).toLocaleString()}
          </span>
        </div>
      </div>

      <div className="mb-8 rounded-lg border p-4">
        <h2 className="mb-3 text-sm font-medium text-muted-foreground">Status</h2>
        <OrderStatusForm orderId={order.id} currentStatus={order.status} />
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="rounded-lg border p-4">
          <h2 className="mb-2 text-sm font-medium text-muted-foreground">Customer</h2>
          <p className="text-sm">
            {order.customerFirstName} {order.customerLastName}
          </p>
          <p className="text-sm text-muted-foreground">{order.customerEmail}</p>
          <p className="text-sm text-muted-foreground">{order.customerPhone}</p>
        </div>
        <div className="rounded-lg border p-4">
          <h2 className="mb-2 text-sm font-medium text-muted-foreground">
            Delivery Address
          </h2>
          <p className="text-sm">
            {order.addressLine1}
            {order.addressLine2 ? `, ${order.addressLine2}` : ""}
          </p>
          <p className="text-sm text-muted-foreground">
            {order.addressCity}, {order.addressProvince} {order.addressPostalCode}
          </p>
          <p className="text-sm text-muted-foreground">{order.addressCountry}</p>
        </div>
        <div className="rounded-lg border p-4">
          <h2 className="mb-2 text-sm font-medium text-muted-foreground">Delivery</h2>
          <p className="text-sm">{order.deliveryMethod}</p>
        </div>
        <div className="rounded-lg border p-4">
          <h2 className="mb-2 text-sm font-medium text-muted-foreground">Payment</h2>
          <p className="text-sm">{order.paymentMethod}</p>
        </div>
      </div>

      {order.notes && (
        <div className="mb-8 rounded-lg border p-4">
          <h2 className="mb-2 text-sm font-medium text-muted-foreground">Notes</h2>
          <p className="text-sm">{order.notes}</p>
        </div>
      )}

      <div className="mb-8 overflow-x-auto rounded-lg border">
        <table className="w-full min-w-[480px] text-left text-sm">
          <thead>
            <tr className="border-b bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-3 font-medium">Item</th>
              <th className="px-4 py-3 font-medium">SKU</th>
              <th className="px-4 py-3 font-medium">Qty</th>
              <th className="px-4 py-3 text-right font-medium">Price</th>
              <th className="px-4 py-3 text-right font-medium">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.lines.map((line) => (
              <tr key={line.id} className="border-b last:border-0">
                <td className="px-4 py-3">
                  {line.name}
                  {line.variantLabel && (
                    <span className="block text-xs text-muted-foreground">
                      {line.variantLabel}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{line.sku ?? "—"}</td>
                <td className="px-4 py-3">{line.quantity}</td>
                <td className="px-4 py-3 text-right">{formatPrice(line.price)}</td>
                <td className="px-4 py-3 text-right">
                  {formatPrice(line.price * line.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="ml-auto flex max-w-xs flex-col gap-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{formatPrice(order.subtotal)}</span>
        </div>
        {order.discount > 0 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Discount</span>
            <span>− {formatPrice(order.discount)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span>{order.shipping === 0 ? "Free" : formatPrice(order.shipping)}</span>
        </div>
        <div className="flex justify-between border-t pt-2 text-base font-semibold">
          <span>Total</span>
          <span>{formatPrice(order.total)}</span>
        </div>
      </div>
    </div>
  );
}
