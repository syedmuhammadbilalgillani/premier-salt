"use client";

import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/button";
import { FAQAccordion, type FAQItem } from "@/components/ui/FAQAccordion";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ShopProductCard } from "@/components/ui/ShopProductCard";
import { company } from "@/data/company";
import { useShopCatalog } from "@/hooks/useShopCatalog";
import type { ShopProduct } from "@/lib/product";
import {
  ArrowRight,
  Building2,
  Factory,
  Home as HomeIcon,
  Globe2,
  Package,
  ShieldCheck,
  Store,
  Tag,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const trustStrip = [
  "Mined in Khewra, Pakistan",
  "Shipped to 60+ countries",
  "ISO 9001 · HACCP · Halal · FDA",
  "Your own brand on the pack",
];

const reasons = [
  {
    icon: Factory,
    title: "Straight from the source",
    text: "We mine and pack our own Himalayan salt in Pakistan. No middlemen, so you get fair prices and the same quality every time.",
  },
  {
    icon: ShieldCheck,
    title: "Certified and checked",
    text: "Every batch is checked before it leaves our factory. We hold ISO 9001, HACCP, ISO 22000 and Halal certificates.",
  },
  {
    icon: Package,
    title: "Packed the way you want",
    text: "Small jars for a kitchen or 25 kg bags for a shop. We can also print your own brand on the pack.",
  },
];

const bulkSteps = [
  {
    title: "Tell us what you need",
    text: "Share the product, how much, and where it is going.",
  },
  {
    title: "Get a price and a sample",
    text: "We send you a quote, and a sample if you want to check the salt first.",
  },
  {
    title: "We make and pack your order",
    text: "Your order is made, packed and checked against what we agreed.",
  },
  {
    title: "We help it ship",
    text: "We help with export papers and loading, so it reaches you safely.",
  },
];

const audiences = [
  {
    icon: Store,
    title: "Shops and wholesalers",
    text: "Regular supply for stores, chains and distributors.",
    href: "/wholesale-distributor",
  },
  {
    icon: Tag,
    title: "Brands (your own label)",
    text: "Sell Himalayan salt under your own name and packaging.",
    href: "/private-labeling",
  },
  {
    icon: Globe2,
    title: "Importers abroad",
    text: "Container loads with export documents and shipping help.",
    href: "/export-capabilities",
  },
  {
    icon: Building2,
    title: "Restaurants and hotels",
    text: "Cooking salt, serving plates and gift items in bulk.",
    href: "/request-a-quote",
  },
];

function plainText(html: string | null | undefined) {
  return (html ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

interface HomeCategory {
  slug: string;
  title: string;
  description: string | null;
  image_url: string | null;
}

export default function Home({
  categories,
  initialProducts = [],
  faqs = [],
}: {
  categories: HomeCategory[];
  initialProducts?: ShopProduct[];
  faqs?: FAQItem[];
}) {
  const { products: clientProducts } = useShopCatalog();
  const products =
    clientProducts.length > 0 ? clientProducts : initialProducts;
  const featuredProducts = products.slice(0, 8);

  return (
    <>
      {/* 1. Hero — one message, two clear paths */}
      <section className="relative flex min-h-[420px] items-center overflow-hidden bg-charcoal pt-36 pb-14 sm:min-h-[480px] md:min-h-[560px] md:pt-44 md:pb-16">
        <div className="absolute inset-0">
          <Image
            src="/assets/home-page-hero-pic.webp"
            alt="Pink Himalayan salt crystals, salt lamps and cooking slabs from Premier Salt"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[60%_center] sm:object-center"
          />
          <div className="absolute inset-0 bg-linear-to-t from-primary/85 via-primary/45 to-primary/5" />
        </div>

        <Reveal className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-6 md:px-8">
          <div className="max-w-3xl">
            <span className="eyebrow text-xs text-salt-pink sm:text-sm">
              Himalayan Salt from Khewra, Pakistan
            </span>

            <h1 className="mt-3 max-w-3xl font-serif text-[2.5rem] leading-[1.05] text-cream sm:mt-4 sm:text-5xl md:text-6xl lg:text-7xl">
              Pure Himalayan Salt, Direct from Pakistan
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-6 text-cream/80 sm:mt-5 sm:text-base sm:leading-relaxed md:text-lg">
              Pink salt for your kitchen, salt lamps for your home, and bulk
              supply for shops, brands and exporters. Buy online, or ask us for
              a price.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
              <Link href="/shop" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto">Shop for Home</Button>
              </Link>
              <Link href="/request-a-quote" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="w-full border-cream bg-cream text-charcoal hover:bg-cream/90 sm:w-auto"
                >
                  Bulk &amp; Business Orders
                </Button>
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* 2. Trust strip — concrete facts */}
      <Reveal stagger className="border-b border-border bg-cream">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-6 py-8 text-center sm:grid-cols-4 md:px-8">
          {trustStrip.map((item) => (
            <div key={item} className="text-sm font-medium text-primary">
              {item}
            </div>
          ))}
        </div>
      </Reveal>

      {/* 3. Which one are you? */}
      <section className="mx-auto max-w-7xl px-6 py-14 sm:py-16 md:py-20 md:px-8">
        <SectionHeading
          eyebrow="Start Here"
          title="How would you like to buy?"
          align="center"
          className="mx-auto"
        />
        <Reveal className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          <Link
            href="/shop"
            className="group flex flex-col gap-3 rounded-sm border border-border bg-cream p-8 transition-shadow hover:shadow-md"
          >
            <HomeIcon className="h-7 w-7 text-primary" strokeWidth={1.5} />
            <h3 className="font-serif text-2xl text-primary">
              I want to buy for myself
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Cooking salt, salt lamps, bath salt and gifts. Add to cart and
              pay when it arrives or by bank transfer.
            </p>
            <span className="mt-2 flex items-center gap-1 text-sm font-semibold text-primary">
              Go to the shop <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
          <Link
            href="/request-a-quote"
            className="group flex flex-col gap-3 rounded-sm border border-border bg-cream p-8 transition-shadow hover:shadow-md"
          >
            <Building2 className="h-7 w-7 text-primary" strokeWidth={1.5} />
            <h3 className="font-serif text-2xl text-primary">
              I need a large quantity
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              For shops, brands, restaurants and importers. Tell us what you
              need and we will send you a price.
            </p>
            <span className="mt-2 flex items-center gap-1 text-sm font-semibold text-primary">
              Ask for a price <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        </Reveal>
      </section>

      {/* 4. Featured shop products */}
      {featuredProducts.length > 0 && (
        <section className="bg-sand/40 py-14 sm:py-16 md:py-20">
          <div className="mx-auto w-full max-w-7xl px-6 md:px-8">
            <SectionHeading
              eyebrow="Online Shop"
              title="Popular Himalayan Salt Products"
            />
            <Reveal
              stagger
              className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4"
            >
              {featuredProducts.map((product) => (
                <ShopProductCard key={product.slug} product={product} />
              ))}
            </Reveal>
            <Link
              href="/shop"
              className="mt-8 flex w-fit items-center gap-1.5 text-sm font-semibold text-primary"
            >
              See everything in the shop <ArrowRight size={15} />
            </Link>
          </div>
        </section>
      )}

      {/* 5. Categories */}
      <section className="mx-auto max-w-7xl px-6 py-14 sm:py-16 md:py-20 md:px-8">
        <SectionHeading
          eyebrow="What We Make"
          title="Himalayan Salt Products by Type"
          description="Pick a type to see sizes, packing and how to order."
        />
        <Reveal
          stagger
          className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {categories?.map((cat) => (
            <Link
              key={cat?.slug}
              href={`/${cat?.slug}`}
              className="group flex flex-col"
            >
              {cat?.image_url ? (
                <Image
                  src={cat.image_url}
                  width={364}
                  height={273}
                  alt={`${cat.title} – Himalayan salt by Premier Salt`}
                  className="max-h-72 max-w-91 rounded object-cover object-center shadow"
                />
              ) : (
                <ImagePlaceholder label={cat?.title} width={640} height={480} />
              )}
              <h3 className="mt-4 font-serif text-xl text-primary">
                {cat?.title}
              </h3>
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                {plainText(cat?.description)}
              </p>
              <span className="mt-2 flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-primary">
                View products <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          ))}
        </Reveal>
      </section>

      {/* 6. Why us */}
      <section className="bg-sand/40 py-14 sm:py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <SectionHeading
            eyebrow="Why Premier Salt"
            title="A Himalayan Salt Manufacturer You Can Trust"
            align="center"
            className="mx-auto"
          />
          <Reveal
            stagger
            className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3"
          >
            {reasons.map((r) => (
              <div
                key={r.title}
                className="flex flex-col gap-3 rounded-sm border border-border bg-cream p-7"
              >
                <r.icon className="h-6 w-6 text-primary" strokeWidth={1.5} />
                <h3 className="font-serif text-lg text-primary">{r.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {r.text}
                </p>
              </div>
            ))}
          </Reveal>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/about">
              <Button variant="outline">About the Company</Button>
            </Link>
            <Link href="/manufacturing">
              <Button variant="ghost">
                See Our Factory <ArrowRight />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 7. Who we supply (clickable) */}
      <section className="mx-auto max-w-7xl px-6 py-14 sm:py-16 md:py-20 md:px-8">
        <SectionHeading
          eyebrow="Business Buyers"
          title="Wholesale Himalayan Salt for Every Kind of Buyer"
        />
        <Reveal
          stagger
          className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {audiences.map((a) => (
            <Link
              key={a.title}
              href={a.href}
              className="flex flex-col gap-3 rounded-sm border border-border p-6 transition-shadow hover:shadow-md"
            >
              <a.icon className="h-6 w-6 text-primary" strokeWidth={1.5} />
              <h3 className="font-serif text-lg text-primary">{a.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {a.text}
              </p>
              <span className="mt-auto flex items-center gap-1 text-sm font-semibold text-primary">
                Learn more <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </Reveal>
      </section>

      {/* 8. How bulk ordering works */}
      <section className="bg-primary py-14 text-cream sm:py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <SectionHeading
            eyebrow="How Bulk Orders Work"
            title="From Your Enquiry to Your Door in 4 Steps"
            tone="dark"
          />
          <Reveal
            stagger
            className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
          >
            {bulkSteps.map((step, i) => (
              <div key={step.title} className="border-t border-cream/20 pt-5">
                <span className="font-serif text-2xl text-salt-pink">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 text-base font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-cream/75">
                  {step.text}
                </p>
              </div>
            ))}
          </Reveal>
          <Link href="/request-a-quote" className="mt-10 inline-block">
            <Button className="bg-cream text-primary hover:bg-cream/90">
              Start a Bulk Enquiry
            </Button>
          </Link>
        </div>
      </section>

      {/* 9. Certifications */}
      <section className="mx-auto max-w-7xl px-6 py-14 sm:py-16 md:py-20 md:px-8">
        <SectionHeading
          eyebrow="Quality & Certificates"
          title="Certified Food-Grade Himalayan Salt"
        />
        <Reveal
          stagger
          className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6"
        >
          {company.certifications.map((cert) => (
            <div
              key={cert.name}
              className="flex flex-col items-center gap-3 text-center"
            >
              <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl border border-border bg-white p-4">
                <Image
                  src={cert.image}
                  alt={`${cert.name} certificate – ${cert.subtitle}`}
                  fill
                  className="object-contain p-3"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold leading-snug text-charcoal">
                  {cert.name}
                </span>
                <span className="mt-0.5 text-[11px] leading-tight text-muted-foreground">
                  {cert.subtitle}
                </span>
              </div>
            </div>
          ))}
        </Reveal>
      </section>

      {/* 10. FAQ (visible, matches the FAQPage schema) */}
      {faqs.length > 0 && (
        <section className="bg-sand/40 py-14 sm:py-16 md:py-20">
          <div className="mx-auto max-w-3xl px-6 md:px-8">
            <SectionHeading
              eyebrow="Questions"
              title="Common Questions About Our Salt"
              align="center"
              className="mx-auto"
            />
            <div className="mt-10">
              <FAQAccordion items={faqs} />
            </div>
            <Link
              href="/about-himalayan-salt"
              className="mt-8 flex w-fit items-center gap-1.5 text-sm font-semibold text-primary"
            >
              Learn more about Himalayan salt <ArrowRight size={15} />
            </Link>
          </div>
        </section>
      )}

      {/* 11. Final CTA */}
      <section className="bg-primary py-14 text-cream sm:py-16 md:py-20">
        <Reveal className="mx-auto max-w-2xl px-6 text-center md:px-8">
          <h2 className="font-serif text-3xl sm:text-4xl">
            Ready to Order Himalayan Salt?
          </h2>
          <p className="mt-4 text-sm text-cream/80 sm:text-base">
            Buy online for your home, or tell us what you need in bulk and we
            will reply with a price.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/shop">
              <Button className="bg-cream text-primary hover:bg-cream/90">
                Shop Online
              </Button>
            </Link>
            <Link href="/request-a-quote">
              <Button
                variant="outline"
                className="border-cream text-cream hover:bg-cream hover:text-primary"
              >
                Get a Bulk Price
              </Button>
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
