import type { Metadata } from "next";
import Wholesale from "@/routes/Wholesale";
import { buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema } from "@/lib/schema";

export const revalidate = 86400;

export const metadata: Metadata = buildMetadata({
  title: "Wholesale & Distributor Supply | Premier Salt Industries",
  description:
    "Partner with Premier Salt for wholesale bulk Himalayan salt supply, distributor pricing, and consistent containerized freight delivery.",
  path: "/wholesale-distributor",
});

export default function WholesalePage() {
  const breadcrumbs = getBreadcrumbSchema([
    { name: "Wholesale & Distributors", url: "/wholesale-distributor" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbs} />
      <Wholesale />
    </>
  );
}

