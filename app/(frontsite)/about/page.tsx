import type { Metadata } from "next";
import About from "@/routes/About";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "About Us",
  description:
    "Premier Salt Industries is a professional business organization specializing in the processing, manufacturing and export of authentic Himalayan salt products from Pakistan.",
  path: "/about",
  image: "/assets/about-us-hero-pic.webp",
});

const page = () => {
  return <About />;
};

export default page;
