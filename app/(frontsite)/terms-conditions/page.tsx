import type { Metadata } from "next";
import TermsConditions from "@/routes/TermsConditions";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Terms & Conditions",
  description:
    "The terms that apply when you use this website or place an order with us.",
  path: "/terms-conditions",
});

const page = () => {
  return <TermsConditions />;
};

export default page;
