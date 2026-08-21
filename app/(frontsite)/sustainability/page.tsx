import type { Metadata } from "next";
import Sustainability from "@/routes/Sustainability";
import { buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema } from "@/lib/schema";

export const revalidate = 86400;

export const metadata: Metadata = buildMetadata({
  title: "Environmental & Ethical Sustainability | Premier Salt",
  description:
    "Learn about Premier Salt's commitment to responsible Khewra mining, zero chemical additives, eco-conscious packaging, and ethical workplace practices.",
  path: "/sustainability",
});

export default function SustainabilityPage() {
  const breadcrumbs = getBreadcrumbSchema([
    { name: "Sustainability", url: "/sustainability" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbs} />
      <Sustainability />
    </>
  );
}

