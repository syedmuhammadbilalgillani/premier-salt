import type { Metadata } from "next";
import Contact from "@/routes/Contact";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Get in Touch",
  description:
    "Reach our team for export, wholesale, private-label or retail enquiries.",
  path: "/contact",
});

const page = () => {
  return <Contact />;
};

export default page;
