"use client";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { Button } from "@/components/ui/button";
import { ShopProductCard } from "@/components/ui/ShopProductCard";
import { brandsConfig } from "@/data/company";
import { useShopCatalog } from "@/hooks/useShopCatalog";
import { notFound, useParams } from "next/navigation";
import Link from "next/link";

export default function BrandDetail() {
  const { brandSlug } = useParams();
  const brand = [brandsConfig.brandOne, brandsConfig.brandTwo].find(
    (b) => b.slug === brandSlug,
  );

  const { products } = useShopCatalog();

  if (!brand) return notFound();

  const featured = products.slice(0, 4);

  return (
    <>
      <PageHero
        eyebrow="Our Brands"
        title={brand?.name}
        description="Consumer-facing brand under Premier Salt Industries."
        crumbs={[
          { label: "Our Brands", to: "/brands" },
          { label: brand?.name },
        ]}
      />
      <div className="mx-auto flex max-w-7xl flex-col gap-16 px-6 py-16 md:px-8">
        <Reveal>
          <ImagePlaceholder
            label={`${brand?.name} — Hero Image`}
            width={1600}
            height={700}
          />
        </Reveal>
        <Reveal className="grid grid-cols-1 gap-10 md:grid-cols-2">
          <div>
            <span className="eyebrow">Positioning</span>
            <h2 className="mt-3 font-serif text-2xl text-primary">
              A Trusted Name for Everyday Himalayan Salt
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {brand?.name} brings Premier Salt's processing standards to
              households and retail shelves, with a focus on consistent quality
              and accessible packaging.
            </p>
          </div>
          <div>
            <span className="eyebrow">Values</span>
            <h2 className="mt-3 font-serif text-2xl text-primary">
              What the Brand Stands For
            </h2>
            <ul className="mt-4 flex flex-col gap-2 text-sm text-charcoal">
              {[
                "Authenticity",
                "Consistency",
                "Accessible everyday quality",
              ].map((v) => (
                <li key={v} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" /> {v}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal>
          <h2 className="mb-6 font-serif text-2xl text-primary">
            Featured Products
          </h2>
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
            {featured.map((p) => (
              <ShopProductCard key={p.slug} product={p} />
            ))}
          </div>
        </Reveal>

        <Reveal className="flex flex-wrap gap-4 border-t border-border pt-10">
          <Link href="/wholesale-distributor">
            <Button variant="outline">Become a Retailer/Distributor</Button>
          </Link>
          <Link href="/shop">
            <Button>Shop Brand Products</Button>
          </Link>
        </Reveal>
      </div>
    </>
  );
}
