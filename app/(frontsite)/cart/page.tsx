import type { Metadata } from "next";
import Cart from "@/routes/Cart";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Your Cart",
  description: "Review the items in your shopping cart.",
  path: "/cart",
  noindex: true,
});

const page = () => {
  return <Cart />;
};

export default page;
