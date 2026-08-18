import type { Metadata } from "next";
import ExportCapabilities from "@/routes/ExportCapabilities";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Export Capabilities",
  description:
    "We support importers, wholesalers, distributors and private-label buyers with coordinated export from Pakistan, start to finish.",
  path: "/export-capabilities",
});

const page = () => {
  return <ExportCapabilities />;
};

export default page;
