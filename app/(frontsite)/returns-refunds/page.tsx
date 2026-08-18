import type { Metadata } from "next";
import ReturnsRefunds from "@/routes/ReturnsRefunds";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Returns & Refunds",
  description:
    "Our policy for returns, exchanges and refunds on shop orders.",
  path: "/returns-refunds",
});

const page = () => {
  return <ReturnsRefunds />;
};

export default page;
