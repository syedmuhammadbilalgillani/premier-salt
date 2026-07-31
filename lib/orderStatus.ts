// Pure constants — no DB import — so client components can use these
// without pulling lib/order.ts's server-only (db) code into the browser bundle.

export const ORDER_STATUSES = [
  "order_received",
  "confirmed",
  "processing",
  "ready_for_dispatch",
  "dispatched",
  "delivered",
  "cancelled",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  order_received: "Order Received",
  confirmed: "Confirmed",
  processing: "Processing",
  ready_for_dispatch: "Ready for Dispatch",
  dispatched: "Dispatched",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

/** Linear fulfillment progression for a status stepper — "cancelled" is a
 *  terminal branch state, not a step in the normal flow. */
export const ORDER_PROGRESS_STATUSES = ORDER_STATUSES.filter(
  (s) => s !== "cancelled",
);
