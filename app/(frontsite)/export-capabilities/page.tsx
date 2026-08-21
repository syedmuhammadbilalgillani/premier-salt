import type { Metadata } from "next";
import ExportCapabilities from "@/routes/ExportCapabilities";
import { buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema } from "@/lib/schema";

export const revalidate = 86400;

export const metadata: Metadata = buildMetadata({
  title: "Global Export Capabilities & Logistics | Premier Salt",
  description:
    "We supply containerized bulk Himalayan salt exports to 60+ countries via Karachi Port on FOB, CIF, and CFR terms with complete regulatory documentation.",
  path: "/export-capabilities",
});

export default function ExportCapabilitiesPage() {
  const breadcrumbs = getBreadcrumbSchema([
    { name: "Export Capabilities", url: "/export-capabilities" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbs} />
      <ExportCapabilities />
    </>
  );
}

