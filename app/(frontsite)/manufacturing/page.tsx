import type { Metadata } from "next";
import Manufacturing from "@/routes/Manufacturing";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Manufacturing Facility",
  description:
    "Our processing plant in Muridke handles every stage of Himalayan salt production, from raw material selection through to export-ready packaging.",
  path: "/manufacturing",
  image: "/assets/Manufacturing-Facility_Hero_Img.webp",
});

const page = () => {
  return <Manufacturing />;
};

export default page;
