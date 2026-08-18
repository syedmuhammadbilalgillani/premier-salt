import type { Metadata } from "next";
import OrderTracking from "@/routes/OrderTracking";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Track Your Order",
  description:
    "Enter your order number and email to see its current status.",
  path: "/order-tracking",
});

const page = () => {
  return <OrderTracking />;
};

export default page;
