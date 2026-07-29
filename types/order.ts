export type OrderStatus =
  | "Order Received"
  | "Confirmed"
  | "Processing"
  | "Ready for Dispatch"
  | "Dispatched"
  | "Delivered";

export interface OrderLine {
  slug: string;
  name: string;
  price: number;
  quantity: number;
  variantId: string | null;
  variantLabel: string | null;
  sku: string | null;
}

export interface Order {
  id: string;
  createdAt: string;
  status: OrderStatus;
  customer: { firstName: string; lastName: string; email: string; phone: string };
  address: { line1: string; line2?: string; city: string; province: string; postalCode: string; country: string };
  deliveryMethod: "Standard Delivery" | "Store/Office Pickup";
  paymentMethod: "Cash on Delivery" | "Bank Transfer" | "Card Payment";
  notes?: string;
  lines: OrderLine[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
}
