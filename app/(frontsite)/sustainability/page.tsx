import type { Metadata } from "next";
import Sustainability from "@/routes/Sustainability";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Sustainability",
  description:
    "Responsible practices guide how we source, process and package Himalayan salt products.",
  path: "/sustainability",
});

const page = () => {
  return <Sustainability />;
};

export default page;
