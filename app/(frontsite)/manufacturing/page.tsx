import type { Metadata } from "next";
import Manufacturing from "@/routes/Manufacturing";
import { buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema } from "@/lib/schema";

export const revalidate = 86400;

export const metadata: Metadata = buildMetadata({
  title: "Manufacturing Facility & Processing Plant | Premier Salt",
  description:
    "Our modern processing plant in Muridke handles every stage of Himalayan salt production, from Khewra raw rock intake to optical sorting and export-ready packaging.",
  path: "/manufacturing",
  image: "/assets/Manufacturing-Facility_Hero_Img.webp",
});

export default function ManufacturingPage() {
  const breadcrumbs = getBreadcrumbSchema([
    { name: "Manufacturing Facility", url: "/manufacturing" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbs} />
      <Manufacturing />
    </>
  );
}

