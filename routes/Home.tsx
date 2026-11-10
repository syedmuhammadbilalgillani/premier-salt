"use client";

import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/button";
import { FAQAccordion } from "@/components/ui/FAQAccordion";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ShopProductCard } from "@/components/ui/ShopProductCard";
import { company } from "@/data/company";
import { homeContent as c } from "@/data/home";
import { useShopCatalog } from "@/hooks/useShopCatalog";
import type { ShopProduct } from "@/lib/product";
import { ArrowRight, Building2, Home as HomeIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface HomeCategory {
  slug: string;
  title: string;
  description: string | null;
  image_url: string | null;
}

export interface HomeBlogPost {
  title: string;
  slug: string;
  categorySlug: string;
  excerpt: string | null;
  coverImage: string | null;
  publishedAt: string;
}

function plainText(html: string | null | undefined) {
  return (html ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export default function Home({
  categories,
  initialProducts = [],
  posts = [],
}: {
  categories: HomeCategory[];
  initialProducts?: ShopProduct[];
  posts?: HomeBlogPost[];
}) {
  const { products: clientProducts } = useShopCatalog();
  const products =
    clientProducts.length > 0 ? clientProducts : initialProducts;
  const featuredProducts = products.slice(0, 8);

  // Categories follow the order set in data/home.ts; any not listed come after.
  const order: readonly string[] = c.products.slugs;
  const rank = (slug: string) => {
    const i = order.indexOf(slug);
    return i === -1 ? order.length : i;
  };
  const shownCategories = [...categories]
    .sort((a, b) => rank(a.slug) - rank(b.slug))
    .slice(0, 6);

  return (
    <>
      {/* 1. Hero */}
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
              {c.hero.eyebrow}
            </span>
            <h1 className="mt-3 max-w-3xl font-serif text-[2.5rem] leading-[1.05] text-cream sm:mt-4 sm:text-5xl md:text-6xl lg:text-7xl">
              {c.hero.title}
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-cream/80 sm:mt-5 sm:text-base sm:leading-relaxed md:text-lg">
              {c.hero.text}
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
              <Link href={c.hero.primaryCta.href} className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto">
                  {c.hero.primaryCta.label}
                </Button>
              </Link>
              <Link href={c.hero.secondaryCta.href} className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="w-full border-cream bg-cream text-charcoal hover:bg-cream/90 sm:w-auto"
                >
                  {c.hero.secondaryCta.label}
                </Button>
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* 2. Quick facts */}
      <Reveal stagger className="border-b border-border bg-cream">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-6 py-8 text-center sm:grid-cols-4 md:px-8">
          {c.stats.map((s) => (
            <div key={s.label}>
              <div className="font-serif text-2xl text-primary sm:text-3xl">
                {s.value}
              </div>
              <div className="mt-1 text-xs text-muted-foreground sm:text-sm">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* 3. Who we are */}
      <section className="mx-auto max-w-7xl px-6 py-14 sm:py-16 md:py-20 md:px-8">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
          <Reveal>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md bg-sand/40">
              <Image
                src={c.who.image}
                alt={c.who.imageAlt}
                fill
                className="object-cover"
                sizes="(min-width: 768px) 45vw, 100vw"
              />
            </div>
          </Reveal>
          <Reveal className="flex flex-col gap-5" delay={0.1}>
            <span className="eyebrow">{c.who.eyebrow}</span>
            <h2 className="font-serif text-3xl text-primary sm:text-4xl">
              {c.who.title}
            </h2>
            {c.who.paragraphs.map((p) => (
              <p
                key={p}
                className="text-base leading-relaxed text-muted-foreground"
              >
                {p}
              </p>
            ))}
            <p className="text-sm font-medium text-charcoal">
              {c.who.signature}
            </p>
            <Link
              href={c.who.link.href}
              className="flex w-fit items-center gap-1.5 text-sm font-semibold text-primary"
            >
              {c.who.link.label} <ArrowRight size={15} />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* 4. Two ways to buy */}
      <section className="bg-sand/40 py-14 sm:py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <SectionHeading
            eyebrow="Start here"
            title="How would you like to buy?"
            align="center"
            className="mx-auto"
          />
          <Reveal className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            <Link
              href="/shop"
              className="flex flex-col gap-3 rounded-sm border border-border bg-cream p-8 transition-shadow hover:shadow-md"
            >
              <HomeIcon className="h-7 w-7 text-primary" strokeWidth={1.5} />
              <h3 className="font-serif text-2xl text-primary">
                I want to buy for myself
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Cooking salt, salt lamps, bath salt and gifts. Add to cart and
                pay by cash on delivery, bank transfer or card.
              </p>
              <span className="mt-2 flex items-center gap-1 text-sm font-semibold text-primary">
                Go to the shop <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
            <Link
              href="/request-a-quote"
              className="flex flex-col gap-3 rounded-sm border border-border bg-cream p-8 transition-shadow hover:shadow-md"
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
        </div>
      </section>

      {/* 5. Product ranges */}
      <section className="mx-auto max-w-7xl px-6 py-14 sm:py-16 md:py-20 md:px-8">
        <SectionHeading
          eyebrow={c.products.eyebrow}
          title={c.products.title}
          description={c.products.text}
        />
        <Reveal
          stagger
          className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {shownCategories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/${cat.slug}`}
              className="group flex flex-col"
            >
              {cat.image_url ? (
                <Image
                  src={cat.image_url}
                  width={364}
                  height={273}
                  alt={`${cat.title} from Premier Salt`}
                  className="max-h-72 max-w-91 rounded object-cover object-center shadow"
                />
              ) : (
                <ImagePlaceholder label={cat.title} width={640} height={480} />
              )}
              <h3 className="mt-4 font-serif text-xl text-primary">
                {cat.title}
              </h3>
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                {plainText(cat.description)}
              </p>
              <span className="mt-2 flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-primary">
                View products <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          ))}
        </Reveal>
        <Link
          href="/products"
          className="mt-8 flex w-fit items-center gap-1.5 text-sm font-semibold text-primary"
        >
          See all products <ArrowRight size={15} />
        </Link>
      </section>

      {/* 6. Shop products */}
      {featuredProducts.length > 0 && (
        <section className="bg-sand/40 py-14 sm:py-16 md:py-20">
          <div className="mx-auto w-full max-w-7xl px-6 md:px-8">
            <SectionHeading eyebrow="Online shop" title="Ready to buy today" />
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

      {/* 7. Origin */}
      <section className="mx-auto max-w-7xl px-6 py-14 sm:py-16 md:py-20 md:px-8">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
          <Reveal className="flex flex-col gap-5">
            <span className="eyebrow">{c.origin.eyebrow}</span>
            <h2 className="font-serif text-3xl text-primary sm:text-4xl">
              {c.origin.title}
            </h2>
            {c.origin.paragraphs.map((p) => (
              <p
                key={p}
                className="text-base leading-relaxed text-muted-foreground"
              >
                {p}
              </p>
            ))}
            <Link
              href={c.origin.link.href}
              className="flex w-fit items-center gap-1.5 text-sm font-semibold text-primary"
            >
              {c.origin.link.label} <ArrowRight size={15} />
            </Link>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md bg-sand/40">
              <Image
                src={c.origin.image}
                alt={c.origin.imageAlt}
                fill
                className="object-cover"
                sizes="(min-width: 768px) 45vw, 100vw"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* 8. Process */}
      <section className="bg-primary py-14 text-cream sm:py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <SectionHeading
            eyebrow={c.process.eyebrow}
            title={c.process.title}
            description={c.process.text}
            tone="dark"
          />
          <Reveal
            stagger
            className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
          >
            {c.process.steps.map((step, i) => (
              <div key={step.title} className="flex flex-col gap-3">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm bg-cream/10">
                  <Image
                    src={step.image}
                    alt={step.alt}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 100vw"
                  />
                </div>
                <span className="font-serif text-xl text-salt-pink">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-base font-semibold">{step.title}</h3>
                <p className="text-sm leading-relaxed text-cream/75">
                  {step.text}
                </p>
              </div>
            ))}
          </Reveal>
          <Link
            href={c.process.link.href}
            className="mt-10 flex w-fit items-center gap-1.5 text-sm font-semibold text-cream"
          >
            {c.process.link.label} <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* 9. Private label */}
      <section className="mx-auto max-w-7xl px-6 py-14 sm:py-16 md:py-20 md:px-8">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
          <Reveal className="flex flex-col gap-5">
            <span className="eyebrow">{c.privateLabel.eyebrow}</span>
            <h2 className="font-serif text-3xl text-primary sm:text-4xl">
              {c.privateLabel.title}
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              {c.privateLabel.text}
            </p>
            <ul className="flex flex-col gap-2 text-sm text-charcoal">
              {c.privateLabel.points.map((pt) => (
                <li key={pt} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  {pt}
                </li>
              ))}
            </ul>
            <Link href={c.privateLabel.cta.href} className="mt-2 w-fit">
              <Button>{c.privateLabel.cta.label}</Button>
            </Link>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="relative aspect-[900/700] w-full overflow-hidden rounded-md bg-sand/40">
              <Image
                src={c.privateLabel.image}
                alt={c.privateLabel.imageAlt}
                fill
                className="object-cover"
                sizes="(min-width: 768px) 45vw, 100vw"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* 10. Who buys */}
      <section className="bg-sand/40 py-14 sm:py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <SectionHeading eyebrow={c.buyers.eyebrow} title={c.buyers.title} />
          <Reveal
            stagger
            className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {c.buyers.items.map((a) => (
              <Link
                key={a.title}
                href={a.href}
                className="flex flex-col gap-3 rounded-sm border border-border bg-cream p-6 transition-shadow hover:shadow-md"
              >
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
        </div>
      </section>

      {/* 11. Certificates */}
      <section className="mx-auto max-w-7xl px-6 py-14 sm:py-16 md:py-20 md:px-8">
        <SectionHeading
          eyebrow={c.certificates.eyebrow}
          title={c.certificates.title}
          description={c.certificates.text}
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
        <Link
          href={c.certificates.link.href}
          className="mt-8 flex w-fit items-center gap-1.5 text-sm font-semibold text-primary"
        >
          {c.certificates.link.label} <ArrowRight size={15} />
        </Link>
      </section>

      {/* 12. FAQ */}
      <section className="bg-sand/40 py-14 sm:py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-6 md:px-8">
          <SectionHeading
            eyebrow="Questions"
            title="Questions people ask us"
            align="center"
            className="mx-auto"
          />
          <div className="mt-10">
            <FAQAccordion items={[...c.faqs]} />
          </div>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-primary">
            <Link href="/faq" className="flex items-center gap-1.5">
              More questions <ArrowRight size={15} />
            </Link>
            <Link href="/contact" className="flex items-center gap-1.5">
              Talk to our team <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* 13. Latest posts */}
      {posts.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-14 sm:py-16 md:py-20 md:px-8">
          <SectionHeading eyebrow="From our blog" title="Latest articles" />
          <Reveal
            stagger
            className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3"
          >
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.categorySlug}/${post.slug}`}
                className="group flex flex-col gap-3"
              >
                {post.coverImage ? (
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-sm bg-sand/40">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover"
                      sizes="(min-width: 768px) 30vw, 100vw"
                    />
                  </div>
                ) : null}
                <h3 className="font-serif text-lg text-primary">
                  {post.title}
                </h3>
                {post.excerpt ? (
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {post.excerpt}
                  </p>
                ) : null}
                <span className="flex items-center gap-1 text-sm font-semibold text-primary">
                  Read more <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            ))}
          </Reveal>
          <Link
            href="/blog"
            className="mt-8 flex w-fit items-center gap-1.5 text-sm font-semibold text-primary"
          >
            See all articles <ArrowRight size={15} />
          </Link>
        </section>
      )}

      {/* 14. Final CTA */}
      <section className="bg-primary py-14 text-cream sm:py-16 md:py-20">
        <Reveal className="mx-auto max-w-2xl px-6 text-center md:px-8">
          <h2 className="font-serif text-3xl sm:text-4xl">
            {c.finalCta.title}
          </h2>
          <p className="mt-4 text-sm text-cream/80 sm:text-base">
            {c.finalCta.text}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href={c.finalCta.primary.href}>
              <Button className="bg-cream text-primary hover:bg-cream/90">
                {c.finalCta.primary.label}
              </Button>
            </Link>
            <Link href={c.finalCta.secondary.href}>
              <Button
                variant="outline"
                className="border-cream text-cream hover:bg-cream hover:text-primary"
              >
                {c.finalCta.secondary.label}
              </Button>
            </Link>
          </div>
          <p className="mt-8 text-sm text-cream/70">
            Call {company.phone} · {company.emails.sales}
          </p>
        </Reveal>
      </section>
    </>
  );
}
