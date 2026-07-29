import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { brandsConfig } from "@/data/company";

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
              <h2 className="font-serif text-2xl text-maroon group-hover:text-terracotta">
                {brand.name}
              </h2>
              <p className="text-sm leading-relaxed text-muted">
                A Premier Salt consumer brand, built on the same processing
                standards as our export range.
              </p>
              <span className="text-sm font-semibold text-terracotta">
                Explore Brand →
              </span>
            </Link>
          ))}
        </Reveal>
      </div>
    </>
  );
}
