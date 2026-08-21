import type { Metadata } from "next";
import Contact from "@/routes/Contact";
import { buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema } from "@/lib/schema";

export const revalidate = 86400;

export const metadata: Metadata = buildMetadata({
  title: "Contact Premier Salt Industries | Export & Sales Department",
  description:
    "Get in touch with Premier Salt Industries for bulk Himalayan salt quotes, containerized export, private-label packaging, and distribution inquiries.",
  path: "/contact",
});

export default function ContactPage() {
  const breadcrumbs = getBreadcrumbSchema([
    { name: "Contact Us", url: "/contact" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbs} />
      <Contact />
    </>
  );
}

