"use client";

import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { b2bCategories } from "@/data/b2bCategories";
import Link from "next/link";
import { useState } from "react";

const filters = [
  "All Products",
  "Food",
  "Home & Décor",
  "Kitchen",
  "Architecture",
  "Animal",
  "Spa",
  "Industrial",
] as const;

export default function Products() {
  const [active, setActive] =
    useState<(typeof filters)[number]>("All Products");

  const visible = b2bCategories.filter(
    (c) => active === "All Products" || c.filterGroup === active,
  );

  return (
    <>
      <PageHero
        eyebrow="Products"
        title="Himalayan Salt Product Range"
        description="This section is for wholesale, export, distributor and private-label enquiries. Retail buyers should visit our online shop."
        crumbs={[{ label: "Products" }]}
      />

      <div className="mx-auto max-w-7xl px-6 py-16 md:px-8">
        <div className="mb-10 flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={`rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-wide ${
                active === f
                  ? "border-terracotta bg-terracotta text-cream"
                  : "border-border text-charcoal hover:border-terracotta"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <Reveal
          stagger
          className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {visible.map((cat) => (
            <div
              key={cat.slug}
              className="flex flex-col gap-3 border border-border p-5"
            >
              <ImagePlaceholder label={cat.name} width={640} height={440} />
              <h3 className="font-serif text-lg text-maroon">{cat.name}</h3>
              <p className="text-sm leading-relaxed text-muted">
                {cat.description}
              </p>
              {cat.subcategories.length > 0 && (
                <p className="text-xs text-muted">
                  Includes: {cat.subcategories.map((s) => s.name).join(", ")}
                </p>
              )}
              <div className="mt-1 flex gap-4">
                <Link
                  href="/request-a-quote"
                  className="text-sm font-semibold text-terracotta hover:text-maroon"
                >
                  Request Quote →
                </Link>
                <Link
                  href={`/${cat.slug}`}
                  className="text-sm font-semibold text-charcoal hover:text-terracotta"
                >
                  View Category →
                </Link>
              </div>
            </div>
          ))}
        </Reveal>

        <Reveal className="mt-20 grid grid-cols-1 gap-8 border-t border-border pt-16 sm:grid-cols-2">
          <div className="rounded-sm bg-sand/40 p-8">
            <h3 className="font-serif text-xl text-maroon">B2B Catalogue</h3>
            <ul className="mt-4 flex flex-col gap-2 text-sm text-charcoal">
              {[
                "Bulk quantities",
                "Custom packaging",
                "Private label",
                "Export enquiry",
                "Price on request",
              ].map((i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-terracotta" />{" "}
                  {i}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-sm bg-cream p-8 border border-border">
            <h3 className="font-serif text-xl text-maroon">Online Shop</h3>
            <ul className="mt-4 flex flex-col gap-2 text-sm text-charcoal">
              {[
                "Small quantities",
                "Listed retail prices",
                "Pakistan delivery",
                "Online checkout",
              ].map((i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-terracotta" />{" "}
                  {i}
                </li>
              ))}
            </ul>
            <Link
              href="/shop"
              className="mt-4 inline-block text-sm font-semibold text-terracotta hover:text-maroon"
            >
              Shop Online →
            </Link>
          </div>
        </Reveal>
      </div>
    </>
  );
}
