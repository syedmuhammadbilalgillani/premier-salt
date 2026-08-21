import type { Metadata } from "next";
import About from "@/routes/About";
import { buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema } from "@/lib/schema";
import { getCachedCategories } from "@/lib/category";

export const revalidate = 86400;

export const metadata: Metadata = buildMetadata({
  title: "About Premier Salt Industries | Himalayan Salt Manufacturer",
  description:
    "Premier Salt Industries is a leading processor, manufacturer and bulk exporter of authentic Himalayan rock salt from Pakistan, supplying importers worldwide.",
  path: "/about",
  image: "/assets/about-us-hero-pic.webp",
});

export default async function AboutPage() {
  const breadcrumbs = getBreadcrumbSchema([
    { name: "About Us", url: "/about" },
  ]);

  // The About page's stats band reports real catalogue size rather than
  // marketing estimates, so the counts are read at build/revalidate time.
  const categories = await getCachedCategories({});
  const productCount = categories.reduce(
    (total, category) => total + Number(category.productCount ?? 0),
    0,
  );

  return (
    <>
      <JsonLd data={breadcrumbs} />
      <About productCount={productCount} categoryCount={categories.length} />
    </>
  );
}

