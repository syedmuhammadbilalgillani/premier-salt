import type { Metadata } from "next";
import CookiePolicy from "@/routes/CookiePolicy";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Cookie Policy",
  description:
    "How Premier Salt Industries uses cookies and similar local storage on this website.",
  path: "/cookie-policy",
});

const page = () => {
  return <CookiePolicy />;
};

export default page;
