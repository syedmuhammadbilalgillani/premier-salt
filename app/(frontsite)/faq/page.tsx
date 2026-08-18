import type { Metadata } from "next";
import FAQ from "@/routes/FAQ";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Frequently Asked Questions",
  description:
    "Answers to common questions about our company, products, wholesale, export, and retail orders.",
  path: "/faq",
});

const page = () => {
  return <FAQ />;
};

export default page;
