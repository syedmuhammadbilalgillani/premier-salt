import type { Metadata } from "next";
import ShippingDelivery from "@/routes/ShippingDelivery";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Shipping & Delivery",
  description:
    "How shop orders are delivered, and how wholesale/export shipments are handled.",
  path: "/shipping-delivery",
});

const page = () => {
  return <ShippingDelivery />;
};

export default page;
