import type { Metadata } from "next";
import Wholesale from "@/routes/Wholesale";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Wholesale & Distributor Partnerships",
  description:
    "We work with wholesalers and distributors across edible, decor, kitchen, spa and industrial salt categories.",
  path: "/wholesale-distributor",
});

const page = () => {
  return <Wholesale />;
};

export default page;
