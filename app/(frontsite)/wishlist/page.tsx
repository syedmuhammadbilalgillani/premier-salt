import type { Metadata } from "next";
import Wishlist from "@/routes/Wishlist";
import { Suspense } from "react";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Your Wishlist",
  description: "Products you've saved for later.",
  path: "/wishlist",
  noindex: true,
});

const page = () => {
  return (
    <Suspense>
      <Wishlist />
    </Suspense>
  );
};

export default page;
