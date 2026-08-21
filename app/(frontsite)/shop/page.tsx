import type { Metadata } from "next";
import Shop from "@/routes/Shop";
import { getShopProducts } from "@/lib/product";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Shop Himalayan Salt Products Online",
  description:
    "Buy authentic Himalayan salt products online — edible salt, salt lamps, bath salt, animal salt licks and more, with Pakistan-wide delivery.",
  path: "/shop",
});

const page = async () => {
  const products = await getShopProducts();
  return <Shop initialProducts={products} />;
};

export default page;

