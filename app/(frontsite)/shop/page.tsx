import type { Metadata } from "next";
import Shop from "@/routes/Shop";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Shop Himalayan Salt Products Online",
  description:
    "Buy authentic Himalayan salt products online — edible salt, salt lamps, bath salt, animal salt licks and more, with Pakistan-wide delivery.",
  path: "/shop",
});

const page = () => {
  return <Shop />;
};

export default page;
