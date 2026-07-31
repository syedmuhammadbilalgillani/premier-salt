import { and, desc, eq, ilike, inArray } from "drizzle-orm";
import { unstable_cache, revalidateTag } from "next/cache";

import { db } from "@/lib/db";
import {
  orders,
  orderLines,
  products,
  productVariants,
  productVariantOptionValues,
  productOptionValues,
} from "@/lib/db/schema";
import { calculateDiscount, calculateShipping } from "@/lib/shipping";

export {
  ORDER_STATUSES,
  ORDER_STATUS_LABELS,
  ORDER_PROGRESS_STATUSES,
  type OrderStatus,
} from "@/lib/orderStatus";
import type { OrderStatus } from "@/lib/orderStatus";

/** Thrown for expected, user-facing failures (out of stock, bad product) — caught by the API route and turned into a 400, never a 500. */
export class OrderValidationError extends Error {}

export interface CreateOrderLineInput {
  productSlug: string;
  variantId: string | null;
  quantity: number;
}

export interface CreateOrderInput {
  customer: { firstName: string; lastName: string; email: string; phone: string };
  address: {
    line1: string;
    line2?: string | null;
    city: string;
    province: string;
    postalCode: string;
    country?: string;
  };
  deliveryMethod: string;
  paymentMethod: string;
  notes?: string | null;
  discountCode?: string;
  lines: CreateOrderLineInput[];
}

async function variantLabel(
  tx: Pick<typeof db, "select">,
  variantId: string,
): Promise<string | null> {
  const links = await tx
    .select({ optionValueId: productVariantOptionValues.optionValueId })
    .from(productVariantOptionValues)
    .where(eq(productVariantOptionValues.variantId, variantId));
  if (!links.length) return null;

  const values = await tx
    .select({ value: productOptionValues.value })
    .from(productOptionValues)
    .where(
      inArray(
        productOptionValues.id,
        links.map((l) => l.optionValueId),
      ),
    );
  return values.map((v) => v.value).join(" / ") || null;
}

/**
 * The only way an order gets created. Re-derives price/stock from the DB —
 * never trusts client-submitted amounts — and decrements stock atomically in
 * the same transaction that inserts the order. Throws OrderValidationError
 * for expected failures (out of stock, unavailable product); the whole
 * transaction rolls back on any error.
 */
export async function createOrder(
  input: CreateOrderInput,
): Promise<{ id: string; orderNumber: string }> {
  if (!input.lines.length) {
    throw new OrderValidationError("Your cart is empty.");
  }

  return db.transaction(async (tx) => {
    let subtotal = 0;
    const lineInserts: (typeof orderLines.$inferInsert)[] = [];

    for (const line of input.lines) {
      if (line.quantity <= 0) {
        throw new OrderValidationError("Invalid item quantity.");
      }

      const [product] = await tx
        .select()
        .from(products)
        .where(eq(products.slug, line.productSlug))
        .limit(1);
      if (!product || product.channel !== "shop" || product.status !== "active") {
        throw new OrderValidationError(
          `"${line.productSlug}" is no longer available.`,
        );
      }

      let variant: typeof productVariants.$inferSelect | null = null;
      if (line.variantId) {
        const [v] = await tx
          .select()
          .from(productVariants)
          .where(eq(productVariants.id, line.variantId))
          .limit(1);
        if (!v || v.productId !== product.id || !v.isActive) {
          throw new OrderValidationError(
            `The selected option for "${product.title}" is no longer available.`,
          );
        }
        variant = v;
      }

      const availableStock = variant ? variant.stockQuantity : product.stockQuantity;
      if (availableStock < line.quantity) {
        throw new OrderValidationError(
          `Not enough stock for "${product.title}" — only ${availableStock} left.`,
        );
      }

      const price = Number(variant ? variant.price : (product.basePrice ?? 0));
      subtotal += price * line.quantity;

      lineInserts.push({
        orderId: "", // filled in after the order row is inserted, below
        productId: product.id,
        variantId: variant?.id ?? null,
        productSlug: product.slug,
        name: product.title,
        variantLabel: variant ? await variantLabel(tx, variant.id) : null,
        sku: (variant?.sku ?? product.sku) || null,
        price: price.toFixed(2),
        quantity: line.quantity,
      });

      if (variant) {
        await tx
          .update(productVariants)
          .set({ stockQuantity: variant.stockQuantity - line.quantity })
          .where(eq(productVariants.id, variant.id));
      } else {
        await tx
          .update(products)
          .set({ stockQuantity: product.stockQuantity - line.quantity })
          .where(eq(products.id, product.id));
      }
    }

    const discount = calculateDiscount(subtotal, input.discountCode ?? "");
    const shipping =
      input.deliveryMethod === "Store/Office Pickup"
        ? 0
        : calculateShipping(subtotal - discount);
    const total = subtotal - discount + shipping;

    // orderNumber is derived from orderSeq (a real DB sequence, assigned on
    // insert) — insert with a short unique placeholder first, then rename it
    // to the formatted "PS-YYYY-NNNN" once we know the sequence value. Both
    // writes are in the same transaction, so this is still atomic.
    const [created] = await tx
      .insert(orders)
      .values({
        orderNumber: crypto.randomUUID().replace(/-/g, "").slice(0, 20),
        customerFirstName: input.customer.firstName,
        customerLastName: input.customer.lastName,
        customerEmail: input.customer.email,
        customerPhone: input.customer.phone,
        addressLine1: input.address.line1,
        addressLine2: input.address.line2 || null,
        addressCity: input.address.city,
        addressProvince: input.address.province,
        addressPostalCode: input.address.postalCode,
        addressCountry: input.address.country || "Pakistan",
        deliveryMethod: input.deliveryMethod,
        paymentMethod: input.paymentMethod,
        notes: input.notes || null,
        subtotal: subtotal.toFixed(2),
        discount: discount.toFixed(2),
        shipping: shipping.toFixed(2),
        total: total.toFixed(2),
      })
      .returning();

    const orderNumber = `PS-${created.createdAt.getFullYear()}-${String(created.orderSeq).padStart(4, "0")}`;
    const [order] = await tx
      .update(orders)
      .set({ orderNumber })
      .where(eq(orders.id, created.id))
      .returning({ id: orders.id, orderNumber: orders.orderNumber });

    await tx.insert(orderLines).values(
      lineInserts.map((l) => ({ ...l, orderId: created.id })),
    );

    return order;
  });
}

function normalizeOrder(row: typeof orders.$inferSelect) {
  return {
    ...row,
    subtotal: Number(row.subtotal),
    discount: Number(row.discount),
    shipping: Number(row.shipping),
    total: Number(row.total),
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

async function getOrdersListData() {
  const rows = await db.select().from(orders).orderBy(desc(orders.createdAt));
  const ids = rows.map((r) => r.id);

  const lines = ids.length
    ? await db
        .select({ orderId: orderLines.orderId, quantity: orderLines.quantity })
        .from(orderLines)
        .where(inArray(orderLines.orderId, ids))
    : [];
  const itemCountByOrder = new Map<string, number>();
  for (const l of lines) {
    itemCountByOrder.set(l.orderId, (itemCountByOrder.get(l.orderId) ?? 0) + l.quantity);
  }

  return rows.map((row) => ({
    ...normalizeOrder(row),
    itemCount: itemCountByOrder.get(row.id) ?? 0,
  }));
}

export const getCachedOrders = unstable_cache(getOrdersListData, ["orders-list"], {
  tags: ["orders"],
});

async function getOrderData(id: string) {
  const [order] = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  if (!order) return null;

  const lines = await db.select().from(orderLines).where(eq(orderLines.orderId, id));

  return {
    ...normalizeOrder(order),
    lines: lines.map((line) => ({ ...line, price: Number(line.price) })),
  };
}

export function getCachedOrder(id: string) {
  return unstable_cache(() => getOrderData(id), ["order", id], {
    tags: ["orders", `order:${id}`],
  })();
}

/** Uncached — the public order-confirmation page should always reflect the
 *  current status, not a value cached before an admin status change. */
export function getOrderById(id: string) {
  return getOrderData(id);
}

/** Case-insensitive match on both order number and email, mirroring the
 *  storefront's existing order-tracking UX (no real customer accounts). */
export async function findOrderByNumberAndEmail(orderNumber: string, email: string) {
  const [order] = await db
    .select({ id: orders.id })
    .from(orders)
    .where(
      and(ilike(orders.orderNumber, orderNumber), ilike(orders.customerEmail, email)),
    )
    .limit(1);
  if (!order) return null;
  return getOrderData(order.id);
}

/** Full order with line items — order-confirmation, order-tracking, admin detail. */
export type OrderDetail = NonNullable<Awaited<ReturnType<typeof getOrderById>>>;
/** List-row shape — admin orders table. */
export type OrderListItem = Awaited<ReturnType<typeof getCachedOrders>>[number];

export async function updateOrderStatus(id: string, status: OrderStatus) {
  const [updated] = await db
    .update(orders)
    .set({ status, updatedAt: new Date() })
    .where(eq(orders.id, id))
    .returning();

  if (updated) {
    revalidateTag("orders", "max");
    revalidateTag(`order:${id}`, "max");
  }
  return updated ?? null;
}
