import type { Metadata } from "next";
import FAQ from "@/routes/FAQ";
import { buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { getFAQPageSchema, getBreadcrumbSchema } from "@/lib/schema";
import { faqGroups } from "@/data/faqs";

export const metadata: Metadata = buildMetadata({
  title: "Frequently Asked Questions | Premier Salt Industries",
  description:
    "Official answers to common questions about Premier Salt Himalayan products, Khewra mining, bulk wholesale, containerized export, private labeling, and retail orders.",
  path: "/faq",
});

export default function FAQPage() {
  const allFaqs = faqGroups.flatMap((g) => g.items);
  const faqSchema = getFAQPageSchema(allFaqs);
  const breadcrumbs = getBreadcrumbSchema([{ name: "FAQ", url: "/faq" }]);

  return (
    <>
      <JsonLd data={[faqSchema, breadcrumbs]} />
      <FAQ />
    </>
  );
}

