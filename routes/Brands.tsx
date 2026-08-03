import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { brandsConfig } from "@/data/company";
import { ArrowRight } from "lucide-react";

export default function Brands() {
  const brands = [brandsConfig.brandOne, brandsConfig.brandTwo];
  return (
    <>
      <PageHero
        eyebrow="Our Brands"
        title="Two Consumer Brands"
        description="Premier Salt's consumer brands bring authentic Himalayan salt products to households and retail partners."
        crumbs={[{ label: "Our Brands" }]}
      />
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-8">
        <Reveal stagger className="grid grid-cols-1 gap-10 md:grid-cols-2">
          {brands.map((brand) => (
            <Link
              key={brand.slug}
              href={`/brands/${brand.slug}`}
              className="group flex flex-col gap-4 border border-border p-8"
            >
              <ImagePlaceholder
                label={`${brand.name} — Brand Logo`}
                width={600}
                height={300}
              />
              <h2 className="font-serif text-2xl text-primary group-hover:text-primary">
                {brand.name}
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                A Premier Salt consumer brand, built on the same processing
                standards as our export range.
              </p>
              <span className="text-sm font-semibold text-primary">
                Explore Brand <ArrowRight />
              </span>
            </Link>
          ))}
        </Reveal>
      </div>
    </>
  );
}
