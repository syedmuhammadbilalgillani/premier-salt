import type { Metadata } from "next";
import MyAccountOrders from "@/routes/MyAccountOrders";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "My Orders",
  description: "View your past orders.",
  path: "/my-account/orders",
  noindex: true,
});

const page = () => {
  return <MyAccountOrders />;
};

export default page;
