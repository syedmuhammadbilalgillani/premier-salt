import type { Metadata } from "next";
import PaymentPolicy from "@/routes/PaymentPolicy";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Payment Policy",
  description:
    "Accepted payment methods for retail shop orders and wholesale enquiries.",
  path: "/payment-policy",
});

const page = () => {
  return <PaymentPolicy />;
};

export default page;
