import type { Metadata } from "next";
import About from "@/routes/About";
import { buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema } from "@/lib/schema";

export const revalidate = 86400;

export const metadata: Metadata = buildMetadata({
  title: "About Premier Salt Industries | Himalayan Salt Manufacturer",
  description:
    "Premier Salt Industries is a leading processor, manufacturer and bulk exporter of authentic Himalayan rock salt from Pakistan, supplying importers worldwide.",
  path: "/about",
  image: "/assets/about-us-hero-pic.webp",
});

export default function AboutPage() {
  const breadcrumbs = getBreadcrumbSchema([
    { name: "About Us", url: "/about" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbs} />
      <About />
    </>
  );
}

