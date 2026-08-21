"use client";

import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/button";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ShopProductCard } from "@/components/ui/ShopProductCard";
import { b2bCategories } from "@/data/b2bCategories";
import { company } from "@/data/company";
import { useShopCatalog } from "@/hooks/useShopCatalog";
import type { ShopProduct } from "@/lib/product";
import {
  ArrowRight,
  Award,
  Globe2,
  HeartHandshake,
  Package,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const trustStrip = [
  "Manufacturer & Exporter",
  "Private Label Support",
  "Bulk Order Capability",
  "Quality-Focused Processing",
  "Worldwide Buyer Support",
];

const features = [
  {
    icon: Package,
    title: "Reliable Supply",
    text: "Consistent processing capacity to support recurring wholesale and export orders.",
  },
  {
    icon: ShieldCheck,
    title: "Quality Processing",
    text: "Controlled handling at every stage, from raw material selection to final packing.",
  },
  {
    icon: Sparkles,
    title: "Product Consistency",
    text: "Standardized grading and finishing across every batch we ship.",
  },
  {
    icon: Globe2,
    title: "Custom Packaging",
    text: "Packaging formats tailored to your market, brand and shipment size.",
  },
  {
    icon: HeartHandshake,
    title: "Export Coordination",
    text: "Support through documentation, container loading and shipment planning.",
  },
  {
    icon: Award,
    title: "Responsive Support",
    text: "A sales team that replies quickly and follows through on every enquiry.",
  },
];

const exportSteps = [
  {
    title: "Requirement Review",
    text: "We review your product, quantity and market requirements.",
  },
  {
    title: "Product & Packaging Selection",
    text: "You choose products, grain sizes and packaging formats.",
  },
  {
    title: "Quotation & Sampling",
    text: "We share pricing and, where needed, coordinate samples.",
  },
  {
    title: "Production",
    text: "Confirmed orders move into scheduled processing and packing.",
  },
  {
    title: "Quality Inspection",
    text: "Batches are checked against agreed specifications before dispatch.",
  },
  {
    title: "Export & Shipment Support",
    text: "We assist with documentation and shipment coordination.",
  },
];

export default function Home({
  categories,
  initialProducts = [],
}: {
  categories: any[];
  initialProducts?: ShopProduct[];
}) {
  const { products: clientProducts } = useShopCatalog();
  const products =
    clientProducts.length > 0 ? clientProducts : initialProducts;
  const featuredProducts = products.slice(0, 8);

  // console.log(categories, "categories in home ");
  return (
    <>
      {/* 1. Hero */}
      <section className="relative flex min-h-[420px] items-center overflow-hidden bg-charcoal pt-36 pb-14 sm:min-h-[480px] md:min-h-[560px] md:pt-44 md:pb-16">
        {/* Background */}
        <div className="absolute inset-0">
          <Image
            src="/assets/home-page-hero-pic.webp"
            alt="Premium Himalayan salt products"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[60%_center] sm:object-center"
          />

          <div className="absolute inset-0 bg-linear-to-t from-primary/85 via-primary/45 to-primary/5" />
        </div>

        {/* Content */}
        <Reveal className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-6 md:px-8">
          <div className="max-w-3xl">
            <span className="eyebrow text-xs text-salt-pink sm:text-sm">
              Authentic Himalayan Salt from Pakistan
            </span>

            <h1 className="mt-3 max-w-3xl font-serif text-[2.5rem] leading-[1.05] text-cream sm:mt-4 sm:text-5xl md:text-6xl lg:text-7xl">
              Premium Himalayan Salt, Crafted for Global Markets
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-6 text-cream/75 sm:mt-5 sm:text-base sm:leading-relaxed md:text-lg">
              Premier Salt Industries processes, manufactures and exports a
              comprehensive range of authentic Himalayan salt products for
              importers, wholesalers, retailers, private-label brands and
              individual customers.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
              <Link href="/request-a-quote" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto">Request a Quote</Button>
              </Link>

              <Link href="/shop" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="w-full border-cream text hover:bg-cream text-charcoal sm:w-auto"
                >
                  Shop Online
                </Button>
              </Link>

              <Link
                href="/products"
                className="mt-1 text-center text-sm font-medium text-cream/80 underline underline-offset-4 hover:text-salt-pink sm:mt-0 sm:text-left"
              >
                Explore Our Products
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* 2. Trust strip */}
      <Reveal stagger className="border-b border-border bg-cream">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-6 py-10 text-center sm:grid-cols-5 md:px-8">
          {trustStrip.map((item) => (
            <div key={item} className="text-sm font-medium text-primary">
              {item}
            </div>
          ))}
        </div>
      </Reveal>

      {/* 3. Product categories */}
      <section className="mx-auto max-w-7xl px-6 py-14 sm:py-16 md:py-24 md:px-8">
        <SectionHeading eyebrow="Our Range" title="Product Categories" />
        <Reveal
          stagger
          className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {categories?.map((cat) => (
            <Link
              key={cat?.slug}
              href={`/${cat?.slug}`}
              className="group flex flex-col"
            >
              {cat?.image_url ? (
                <Image
                  src={cat?.image_url}
                  width={364}
                  height={273}
                  alt={cat?.name || `Category ${cat?.title}`}
                  className="object-cover object-center max-w-91 max-h-72 shadow rounded"
                />
              ) : (
                <ImagePlaceholder label={cat?.name} width={640} height={480} />
              )}
              <h3 className="mt-4 font-serif text-xl text-primary group-hover:text-primary">
                {cat?.title}
              </h3>
              <div
                dangerouslySetInnerHTML={{ __html: cat?.description || "" }}
                className="mt-2 text-sm line-clamp-3"
              />

              <span className="mt-2 flex items-center gap-1 text-xs uppercase tracking-wide text-primary">
                {cat?.productCount} product line
                {cat?.productCount > 1 ? "s" : ""} · Explore{" "}
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          ))}
        </Reveal>
      </section>

      {/* 4. About */}
      <section className="bg-sand/40 py-14 sm:py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 md:grid-cols-2 md:px-8">
          <Reveal>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md bg-sand/40 md:aspect-[555/994]">
              <Image
                src={`/assets/homepage-about-section.webp`}
                alt="About us banner"
                fill
                className="object-cover"
                sizes="(min-width: 768px) 45vw, 100vw"
              />
            </div>
          </Reveal>
          <Reveal className="flex flex-col justify-center gap-5" delay={0.1}>
            <span className="eyebrow">About</span>
            <h2 className="font-serif text-3xl text-primary sm:text-4xl">
              Your Reliable Himalayan Salt Partner
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              Premier Salt Industries brings together professional processing
              and manufacturing, consistent product quality, and dedicated
              export support. From custom packaging to private labeling, we work
              as an extension of your business.
            </p>
            <p className="text-base leading-relaxed text-muted-foreground">
              Our team supports buyers at every stage — from first enquiry to
              shipment — with responsive, transparent communication.
            </p>
            <div className="mt-2 flex flex-wrap gap-4">
              <Link href="/about">
                <Button variant="outline">About the Company</Button>
              </Link>
              <Link href="/manufacturing">
                <Button variant="ghost">
                  View Manufacturing <ArrowRight />
                </Button>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 5. Why choose us */}
      <section className="mx-auto max-w-7xl px-6 py-14 sm:py-16 md:py-24 md:px-8">
        <SectionHeading
          eyebrow="Why Premier Salt"
          title="Built Around What Buyers Need"
          align="center"
          className="mx-auto"
        />
        <Reveal
          stagger
          className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((f) => (
            <div
              key={f.title}
              className="flex flex-col gap-3 rounded-sm border border-border bg-cream p-7"
            >
              <f.icon className="h-6 w-6 text-primary" strokeWidth={1.5} />
              <h3 className="font-serif text-lg text-primary">{f.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {f.text}
              </p>
            </div>
          ))}
        </Reveal>
      </section>

      {/* 6. Export process */}
      <section className="bg-primary py-14 sm:py-16 md:py-24 text-cream">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <SectionHeading
            eyebrow="How Export Works"
            title="A Clear Path From Enquiry to Shipment"
            tone="dark"
          />
          <Reveal
            stagger
            className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            {exportSteps.map((step, i) => (
              <div key={step.title} className="border-t border-cream/20 pt-5">
                <span className="font-serif text-2xl text-salt-pink">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 text-base font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-cream/70">
                  {step.text}
                </p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* 7. Private label */}
      <section className="mx-auto max-w-7xl px-6 py-14 sm:py-16 md:py-24 md:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:items-center">
          <Reveal className="flex flex-col gap-5">
            <span className="eyebrow">Private Label</span>
            <h2 className="font-serif text-3xl text-primary sm:text-4xl">
              Build Your Himalayan Salt Brand
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              We support private-label development across edible salt, salt
              crafts, bath salt and animal salt licks — with custom sizes,
              custom packaging and brand label support built into the process.
            </p>
            <ul className="grid grid-cols-2 gap-2 text-sm text-charcoal">
              {[
                "Edible salt",
                "Salt crafts",
                "Bath salt",
                "Animal salt licks",
                "Custom sizes",
                "Custom packaging",
              ].map((i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" /> {i}
                </li>
              ))}
            </ul>
            <Link href="/private-labeling" className="mt-2 inline-flex w-fit">
              <Button>Explore Private Label Services</Button>
            </Link>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="relative aspect-[900/700] w-full overflow-hidden rounded-md bg-sand/40">
              <Image
                alt="Private-label packaging"
                src={"/assets/private-label.webp"}
                fill
                className="object-cover"
                sizes="(min-width: 768px) 45vw, 100vw"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* 9. Featured shop products */}
      <section className="mx-auto w-full max-w-7xl px-6 py-14 sm:py-16 md:py-24 md:px-8">
        <SectionHeading eyebrow="Retail Shop" title="Featured Products" />
        <Reveal
          stagger
          className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4"
        >
          {featuredProducts.map((product) => (
            <ShopProductCard key={product.slug} product={product} />
          ))}
        </Reveal>
      </section>

      {/* 10. Certifications */}
      <section className="bg-charcoal py-14 sm:py-16 md:py-24 text-cream">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <SectionHeading
            eyebrow="Quality & Certifications"
            title="Standards We Hold Ourselves To"
            tone="dark"
          />
          <Reveal
            stagger
            className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6"
          >
            {company.certifications.map((cert) => (
              <div
                key={cert.name}
                className="group flex flex-col items-center gap-3 text-center"
              >
                <div className="relative aspect-square w-full rounded-2xl bg-white p-4 shadow-sm flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:shadow-md">
                  <Image
                    src={cert.image}
                    alt={cert.name}
                    fill
                    className="object-contain p-3 transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold leading-snug text-cream">
                    {cert.name}
                  </span>
                  <span className="text-[11px] leading-tight text-cream/70 mt-0.5">
                    {cert.subtitle}
                  </span>
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* 11. Buyer segments */}
      <section className="mx-auto max-w-7xl px-6 py-14 sm:py-16 md:py-24 md:px-8">
        <SectionHeading
          eyebrow="Who We Serve"
          title="Built for Every Kind of Buyer"
          align="center"
          className="mx-auto"
        />
        <Reveal stagger className="mt-10 flex flex-wrap justify-center gap-3">
          {company.segments.map((segment) => (
            <span
              key={segment}
              className="rounded-full border border-border px-4 py-2 text-sm text-charcoal"
            >
              {segment}
            </span>
          ))}
        </Reveal>
      </section>

      {/* 12. Educational */}
      <section className="bg-sand/40 py-14 sm:py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <SectionHeading
            eyebrow="Learn"
            title="Understanding Himalayan Salt"
          />
          <Reveal
            stagger
            className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
          >
            {[
              {
                title: "Natural Origin",
                text: "Formed over millions of years and mined from ancient salt deposits.",
              },
              {
                title: "Colours & Grain Sizes",
                text: "Ranges from white to deep pink, in grain sizes from fine to chunk.",
              },
              {
                title: "Culinary & Decorative Uses",
                text: "Used in cooking, serving, lighting and interior design.",
              },
              {
                title: "Spa & Architectural Uses",
                text: "Featured in bath products and salt tile or brick interiors.",
              },
            ].map((edu) => (
              <div key={edu.title}>
                <h3 className="font-serif text-lg text-primary">{edu.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {edu.text}
                </p>
              </div>
            ))}
          </Reveal>
          <Link
            href="/about-himalayan-salt"
            className="mt-8 flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary"
          >
            Read more about Himalayan salt <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* 13. Final CTA */}
      <section className="relative overflow-hidden bg-primary py-14 sm:py-16 md:py-24 text-cream">
        <Reveal className="mx-auto max-w-2xl px-6 text-center md:px-8">
          <h2 className="font-serif text-3xl sm:text-4xl">
            Looking for a Reliable Himalayan Salt Supplier?
          </h2>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/request-a-quote">
              <Button className="bg-cream text-primary hover:bg-primary hover:text-cream">
                Request a Quote
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                variant="outline"
                className="border-cream text-cream hover:bg-cream hover:text-primary"
              >
                Contact Sales
              </Button>
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
