import type { Metadata } from "next";
import Shop from "@/routes/Shop";
import { getShopProducts } from "@/lib/product";
import { buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema } from "@/lib/schema";

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: "Shop Himalayan Salt Products Online | Premier Salt",
  description:
    "Buy authentic Himalayan salt products online — edible salt, salt lamps, bath salt, animal salt licks and more, with Pakistan-wide delivery.",
  path: "/shop",
});

export default async function ShopPage() {
  const products = await getShopProducts();
  const breadcrumbsSchema = getBreadcrumbSchema([
    { name: "Shop", url: "/shop" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbsSchema} />
      <Shop initialProducts={products} />
    </>
  );
}


