import type { Metadata } from "next";
import AboutHimalayanSalt from "@/routes/AboutHimalayanSalt";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "About Himalayan Salt",
  description:
    "A general introduction to Himalayan salt, its natural variation, and how it's used across food, decor, spa and architectural products.",
  path: "/about-himalayan-salt",
});

const page = () => {
  return <AboutHimalayanSalt />;
};

export default page;
