import type { Metadata } from "next";
import DamagedProducts from "@/routes/DamagedProducts";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Damaged Products",
  description:
    "What to do if an item arrives damaged, and how we resolve it.",
  path: "/damaged-products",
});

const page = () => {
  return <DamagedProducts />;
};

export default page;
