import type { Metadata } from "next";
import PrivacyPolicy from "@/routes/PrivacyPolicy";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description:
    "How Premier Salt Industries collects, uses and protects the information you share with us.",
  path: "/privacy-policy",
});

const page = () => {
  return <PrivacyPolicy />;
};

export default page;
