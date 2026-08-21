import type { Metadata } from "next";
import { getCachedCategories } from "@/lib/category";
import { buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema } from "@/lib/schema";
import RequestQuote from "@/routes/RequestQuote";

export const revalidate = 86400;

export const metadata: Metadata = buildMetadata({
  title: "Request a B2B Export Quote | Premier Salt",
  description:
    "Request wholesale and export quotes for Himalayan edible pink salt, salt lamps, animal licks, cooking slabs, and custom private-label packaging.",
  path: "/request-a-quote",
});

export default async function RequestQuotePage() {
  const categories = await getCachedCategories({});
  const breadcrumbs = getBreadcrumbSchema([
    { name: "Request a Quote", url: "/request-a-quote" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbs} />
      <RequestQuote categories={categories} />
    </>
  );
}

