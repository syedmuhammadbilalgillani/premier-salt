import type { Metadata } from "next";
import QualityCertifications from "@/routes/QualityCertifications";
import { buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = buildMetadata({
  title: "Quality Certifications & Safety Standards | ISO 9001, HACCP, FDA, Halal",
  description:
    "Premier Salt Industries maintains strict food safety and manufacturing standards with ISO 9001, HACCP, ISO 22000, Halal Certified, and U.S. FDA Registered salt processing.",
  path: "/quality-certifications",
});

export default function QualityCertificationsPage() {
  const breadcrumbs = getBreadcrumbSchema([
    { name: "Quality & Certifications", url: "/quality-certifications" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbs} />
      <QualityCertifications />
    </>
  );
}

