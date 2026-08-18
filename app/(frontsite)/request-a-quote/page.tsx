import type { Metadata } from "next";
import { getCachedCategories } from "@/lib/category";
import { buildMetadata } from "@/lib/seo";
import RequestQuote from "@/routes/RequestQuote";

export const metadata: Metadata = buildMetadata({
  title: "Request a Quote",
  description:
    "Share your requirement and our export sales team will follow up with pricing and availability.",
  path: "/request-a-quote",
});

export default async function RequestQuotePage() {
  const categories = await getCachedCategories({});
  return <RequestQuote categories={categories} />;
}
