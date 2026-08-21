import type { Metadata } from "next";
import Downloads from "@/routes/Downloads";
import { buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema } from "@/lib/schema";

export const revalidate = 86400;

export const metadata: Metadata = buildMetadata({
  title: "Downloads & Technical Product Catalogues | Premier Salt",
  description:
    "Download official product catalogues, private-label specification sheets, certificate summaries, and export checklists from Premier Salt Industries.",
  path: "/downloads",
});

export default function DownloadsPage() {
  const breadcrumbs = getBreadcrumbSchema([
    { name: "Downloads", url: "/downloads" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbs} />
      <Downloads />
    </>
  );
}

