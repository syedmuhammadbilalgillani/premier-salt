import type { Metadata } from "next";
import Downloads from "@/routes/Downloads";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Downloads",
  description:
    "Company and product documents for buyers, distributors and partners.",
  path: "/downloads",
});

const page = () => {
  return <Downloads />;
};

export default page;
