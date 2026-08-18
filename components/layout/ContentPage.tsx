import type { ReactNode } from "react";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Crumb } from "@/components/layout/Breadcrumbs";

export interface ContentSection {
  eyebrow: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
}

interface ContentPageProps {
  eyebrow: string;
  title: string;
  description: string;
  crumbs: Crumb[];
  sections: ContentSection[];
  ctaTitle?: string;
  ctaText?: string;
  ctaTo?: string;
  ctaLabel?: string;
  children?: ReactNode;
  /** Optional hero background image — see PageHero. */
  image?: string;
}

export function ContentPage({
  eyebrow,
  title,
  description,
  crumbs,
  sections,
  ctaTitle = "Have a requirement in mind?",
  ctaText = "Send us the details and our team will follow up with pricing, packaging options and availability.",
  ctaTo = "/request-a-quote",
  ctaLabel = "Request a Quote",
  children,
  image,
}: ContentPageProps) {
  return (
    <>
      <PageHero
        eyebrow={eyebrow}
        title={title}
        description={description}
        crumbs={crumbs}
        image={image}
      />
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-12 sm:gap-12 sm:py-16 md:gap-16 md:px-8 md:py-20">
        {sections.map((section) => (
          <Reveal
            key={section.title}
            className="grid grid-cols-1 gap-4 border-t border-border pt-8 sm:gap-6 md:grid-cols-[240px_1fr] md:pt-10"
          >
            <div>
              <span className="eyebrow">{section.eyebrow}</span>
              <h2 className="mt-3 font-serif text-xl text-primary sm:text-2xl">
                {section.title}
              </h2>
            </div>
            <div className="flex flex-col gap-4">
              {section.paragraphs.map((p, i) => (
                <p
                  key={i}
                  className="text-sm leading-relaxed text-muted-foreground sm:text-base"
                >
                  {p}
                </p>
              ))}
              {section.bullets && (
                <ul className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {section.bullets.map((b) => (
                    <li
                      key={b}
                      className="flex items-start gap-2 text-sm text-charcoal"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />{" "}
                      {b}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Reveal>
        ))}
        {children}
      </div>
      <section className="bg-sand/40 py-12 md:py-16">
        <Reveal className="mx-auto flex max-w-7xl flex-col items-start gap-4 px-6 md:px-8">
          <h2 className="font-serif text-xl text-primary sm:text-3xl">
            {ctaTitle}
          </h2>
          <p className="max-w-xl text-sm text-muted-foreground sm:text-base">
            {ctaText}
          </p>
          <Link href={ctaTo} className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto">{ctaLabel}</Button>
          </Link>
        </Reveal>
      </section>
    </>
  );
}
