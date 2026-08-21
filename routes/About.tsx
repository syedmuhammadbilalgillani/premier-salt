import Image from "next/image";
import Link from "next/link";

import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/button";
import { company } from "@/data/company";

// Real production sequence — the numbering below encodes actual order
// (rock in, rock out), not decoration.
const processSteps = [
  {
    title: "Raw Material Intake",
    text: "Salt rock is selected and inspected on arrival from the mine.",
    image: "/assets/Raw_material_intake_area.webp",
  },
  {
    title: "Crushing & Sizing",
    text: "Material is crushed and graded to the grain size each product line needs.",
    image: "/assets/Crushing_and_sizing_line.webp",
  },
  {
    title: "Cleaning & Processing",
    text: "Cleaned and finished by product type — edible grade, lamp pieces, slabs or licks.",
    image: "/assets/Cleaning_and_processing_station.webp",
  },
  {
    title: "Packaging & Dispatch",
    text: "Packed to buyer specification, warehoused and prepared for container loading.",
    image: "/assets/Packaging_line.webp",
  },
];

const capabilities = [
  "Bulk and wholesale supply",
  "Custom packaging",
  "Private labeling",
  "Export documentation support",
  "Sample coordination",
  "Responsive sales communication",
];

export default function About({
  productCount,
  categoryCount,
}: {
  productCount: number;
  categoryCount: number;
}) {
  // Every figure here is derived from real catalogue/company data — nothing
  // is a marketing estimate.
  const stats = [
    { value: String(productCount), label: "Product Lines" },
    { value: String(categoryCount), label: "Product Categories" },
    {
      value: String(company.certifications.length),
      label: "Quality Certifications",
    },
    { value: String(company.segments.length), label: "Buyer Segments Served" },
  ];

  return (
    <>
      <PageHero
        eyebrow="Company"
        title="About Premier Salt Industries"
        description={company.positioning}
        crumbs={[{ label: "About Us" }]}
        image="/assets/about-us-hero-pic.webp"
      />

      {/* Who we are — prose kept to a readable measure, paired with a photo
          so the page opens with something to look at, not a wall of text. */}
      <section className="mx-auto max-w-7xl px-6 py-14 sm:py-16 md:px-8 md:py-24">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_360px] md:gap-16">
          <Reveal className="flex flex-col gap-5">
            <span className="eyebrow">Who We Are</span>
            <h2 className="max-w-[20ch] font-serif text-2xl text-primary text-balance sm:text-3xl">
              A Dedicated Himalayan Salt Exporter
            </h2>
            <p className="max-w-[65ch] text-sm leading-relaxed text-muted-foreground sm:text-base">
              {company.name} focuses solely on processing, manufacturing and
              exporting Himalayan salt products — spanning edible, decorative,
              kitchen, spa and industrial categories.
            </p>
            <p className="max-w-[65ch] text-sm leading-relaxed text-muted-foreground sm:text-base">
              We work with importers, wholesalers, distributors, institutional
              buyers and private-label brands who need a dependable, professional
              supplier — backed by customization and export support at every
              stage.
            </p>

            <ul className="mt-2 grid grid-cols-1 gap-x-8 gap-y-2.5 sm:grid-cols-2">
              {capabilities.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-sm text-charcoal"
                >
                  <span className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full bg-salt-pink" />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.1} className="order-first md:order-none">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md bg-sand/40 md:aspect-[555/760]">
              <Image
                src="/assets/homepage-about-section.webp"
                alt="Premier Salt Industries processing facility"
                fill
                className="object-cover"
                sizes="(min-width: 768px) 360px, 100vw"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Proof band — the first thing a B2B buyer scans for. */}
      <section className="bg-primary py-12 text-cream md:py-14">
        <Reveal
          stagger
          className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 md:grid-cols-4 md:px-8"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col gap-1">
              <span className="font-serif text-3xl text-salt-pink tabular-nums sm:text-4xl">
                {stat.value}
              </span>
              <span className="text-xs uppercase tracking-[0.08em] text-cream/70 sm:text-sm">
                {stat.label}
              </span>
            </div>
          ))}
        </Reveal>
      </section>

      {/* Vision & Mission — two distinct statements, so two cards rather than
          a stacked paragraph pair. */}
      <section className="mx-auto max-w-7xl px-6 py-14 sm:py-16 md:px-8 md:py-24">
        <Reveal className="mb-8 flex flex-col gap-3 md:mb-10">
          <span className="eyebrow">Vision &amp; Mission</span>
          <h2 className="font-serif text-2xl text-primary text-balance sm:text-3xl">
            Where We&apos;re Headed
          </h2>
        </Reveal>
        <Reveal stagger className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {[
            { label: "Vision", text: company.vision },
            { label: "Mission", text: company.mission },
          ].map((item) => (
            <div
              key={item.label}
              className="flex flex-col gap-3 rounded-sm border-l-2 border-salt-pink bg-cream p-7 md:p-8"
            >
              <span className="eyebrow text-sm">{item.label}</span>
              <p className="text-base leading-relaxed text-charcoal">
                {item.text}
              </p>
            </div>
          ))}
        </Reveal>
      </section>

      {/* Core values — name + detail is card content, not bullet content. */}
      <section className="bg-sand/40 py-14 sm:py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <Reveal className="mb-8 flex flex-col gap-3 md:mb-12">
            <span className="eyebrow">Core Values</span>
            <h2 className="font-serif text-2xl text-primary text-balance sm:text-3xl">
              How We Operate
            </h2>
          </Reveal>
          <Reveal
            stagger
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {company.values.map((value) => (
              <div
                key={value.name}
                className="flex flex-col gap-2 rounded-sm bg-cream p-6"
              >
                <h3 className="font-serif text-lg text-primary">
                  {value.name}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {value.detail}
                </p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Process — a genuine sequence, so it is numbered. */}
      <section className="mx-auto max-w-7xl px-6 py-14 sm:py-16 md:px-8 md:py-24">
        <Reveal className="mb-8 flex flex-col gap-3 md:mb-12">
          <span className="eyebrow">Our Process</span>
          <h2 className="font-serif text-2xl text-primary text-balance sm:text-3xl">
            From Salt Rock to Loaded Container
          </h2>
          <p className="max-w-[65ch] text-sm leading-relaxed text-muted-foreground sm:text-base">
            Every stage runs in our own facility in Muridke, so quality and
            timelines stay under our control.
          </p>
        </Reveal>
        <Reveal
          stagger
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {processSteps.map((step, i) => (
            <div key={step.title} className="flex flex-col gap-3">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm bg-sand/40">
                <Image
                  src={step.image}
                  alt={step.title}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 300px, (min-width: 640px) 45vw, 90vw"
                />
              </div>
              <span className="font-serif text-sm text-salt-pink tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-serif text-lg text-primary">{step.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {step.text}
              </p>
            </div>
          ))}
        </Reveal>
      </section>

      {/* Certifications — the trust currency for an export buyer. */}
      <section className="bg-cream py-14 sm:py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <Reveal className="mb-8 flex flex-col gap-3 md:mb-12">
            <span className="eyebrow">Quality &amp; Compliance</span>
            <h2 className="font-serif text-2xl text-primary text-balance sm:text-3xl">
              Certifications We Hold
            </h2>
          </Reveal>
          <Reveal
            stagger
            className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6"
          >
            {company.certifications.map((cert) => (
              <div key={cert.name} className="flex flex-col gap-3">
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm border border-border bg-white">
                  <Image
                    src={cert.image}
                    alt={`${cert.name} — ${cert.subtitle}`}
                    fill
                    className="object-contain p-2"
                    sizes="(min-width: 1024px) 180px, (min-width: 640px) 30vw, 45vw"
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-primary">
                    {cert.name}
                  </p>
                  <p className="mt-0.5 text-xs leading-snug text-muted-foreground">
                    {cert.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* CEO message as a pull quote — it reads as a statement, not body copy. */}
      <section className="mx-auto max-w-7xl px-6 py-14 sm:py-16 md:px-8 md:py-24">
        <Reveal className="flex flex-col gap-6 border-t border-border pt-10 md:pt-12">
          <span className="eyebrow">Leadership</span>
          <blockquote className="max-w-[55ch] font-serif text-xl leading-snug text-primary text-balance sm:text-2xl">
            &ldquo;We approach every enquiry — large or small — with the same
            commitment to quality and transparency. Our goal is to be a partner
            our buyers can rely on for the long term.&rdquo;
          </blockquote>
          <div>
            <p className="text-sm font-semibold text-charcoal">
              {company.ceo.name}
            </p>
            <p className="text-sm text-muted-foreground">{company.ceo.title}</p>
          </div>
        </Reveal>
      </section>

      {/* Who we serve — breadth of buyer types, useful qualifying signal. */}
      <section className="bg-sand/40 py-14 sm:py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <Reveal className="mb-6 flex flex-col gap-3 md:mb-8">
            <span className="eyebrow">Who We Serve</span>
            <h2 className="font-serif text-2xl text-primary text-balance sm:text-3xl">
              Built for Every Kind of Buyer
            </h2>
          </Reveal>
          <Reveal stagger className="flex flex-wrap gap-2.5">
            {company.segments.map((segment) => (
              <span
                key={segment}
                className="rounded-full border border-border bg-cream px-4 py-2 text-sm text-charcoal"
              >
                {segment}
              </span>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Specific CTA, not the generic ContentPage default. */}
      <section className="bg-primary py-14 text-cream md:py-16">
        <Reveal className="mx-auto flex max-w-7xl flex-col items-start gap-4 px-6 md:px-8">
          <h2 className="max-w-[24ch] font-serif text-2xl text-balance sm:text-3xl">
            Tell us what you need and we&apos;ll quote it.
          </h2>
          <p className="max-w-xl text-sm text-cream/75 sm:text-base">
            Share your product, quantity and destination — our export sales team
            replies with pricing, MOQ and a production timeline.
          </p>
          <div className="mt-2 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link href="/request-a-quote" className="w-full sm:w-auto">
              <Button className="w-full bg-cream text-primary hover:bg-salt-pink hover:text-primary sm:w-auto">
                Request a Quote
              </Button>
            </Link>
            <Link href="/contact" className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="w-full border-cream text-cream hover:bg-cream hover:text-primary sm:w-auto"
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
