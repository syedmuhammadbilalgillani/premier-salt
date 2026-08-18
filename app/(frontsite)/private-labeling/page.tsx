import type { Metadata } from "next";
import PrivateLabeling from "@/routes/PrivateLabeling";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Private Label Himalayan Salt Products",
  description:
    "Develop customized Himalayan salt products and packaging under your own brand.",
  path: "/private-labeling",
  image: "/privatelabelbanner.jpeg",
});

const page = () => {
  return <PrivateLabeling />;
};

export default page;
