import type { Metadata } from "next";
import QualityCertifications from "@/routes/QualityCertifications";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Quality & Certifications",
  description:
    "Our quality approach runs from incoming material inspection through to pre-shipment checks, supported by recognized certifications.",
  path: "/quality-certifications",
});

const page = () => {
  return <QualityCertifications />;
};

export default page;
