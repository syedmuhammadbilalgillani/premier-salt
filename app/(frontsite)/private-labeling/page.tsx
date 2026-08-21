import type { Metadata } from "next";
import PrivateLabeling from "@/routes/PrivateLabeling";
import { buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema } from "@/lib/schema";

export const revalidate = 86400;

export const metadata: Metadata = buildMetadata({
  title: "Private Label Himalayan Salt & OEM Packaging | Premier Salt",
  description:
    "Custom private-label Himalayan salt products, pouches, grinders, shaker jars, and retail packaging for international brands, supermarket chains, and distributors.",
  path: "/private-labeling",
  image: "/privatelabelbanner.jpeg",
});

export default function PrivateLabelingPage() {
  const breadcrumbs = getBreadcrumbSchema([
    { name: "Private Labeling", url: "/private-labeling" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbs} />
      <PrivateLabeling />
    </>
  );
}

