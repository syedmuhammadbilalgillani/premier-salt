import type { Metadata } from "next";
import Checkout from "@/routes/Checkout";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Checkout",
  description: "Complete your order.",
  path: "/checkout",
  noindex: true,
});

const page = () => {
  return <Checkout />;
};

export default page;
