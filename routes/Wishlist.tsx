"use client";

import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";
import { ShopProductCard } from "@/components/ui/ShopProductCard";
import { useWishlist } from "@/hooks/useWishlist";
import { useShopCatalog } from "@/hooks/useShopCatalog";

export default function Wishlist() {
  const { slugs } = useWishlist();
  const { products } = useShopCatalog();
  const items = products.filter((p) => slugs.includes(p.slug));

  return (
    <>
      <PageHero
        eyebrow="Shop"
        title="Your Wishlist"
        crumbs={[{ label: "Wishlist" }]}
      />
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-8">
        {items.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <p className="text-muted-foreground">
              Your wishlist is empty. Save products you're interested in for
              later.
            </p>
            <Link href="/shop">
              <Button>Shop Now</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
            {items.map((p) => (
              <ShopProductCard key={p.slug} product={p} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
