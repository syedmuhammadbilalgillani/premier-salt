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
}: ContentPageProps) {
  return (
    <>
      <PageHero
        eyebrow={eyebrow}
        title={title}
        description={description}
        crumbs={crumbs}
      />
      <div className="mx-auto flex max-w-7xl flex-col gap-16 px-6 py-20 md:px-8">
        {sections.map((section) => (
          <Reveal
            key={section.title}
            className="grid grid-cols-1 gap-6 border-t border-border pt-10 md:grid-cols-[240px_1fr]"
          >
            <div>
              <span className="eyebrow">{section.eyebrow}</span>
              <h2 className="mt-3 font-serif text-2xl text-maroon">
                {section.title}
              </h2>
            </div>
            <div className="flex flex-col gap-4">
              {section.paragraphs.map((p, i) => (
                <p key={i} className="text-base leading-relaxed text-muted">
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
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-terracotta" />{" "}
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
      <section className="bg-sand/40 py-16">
        <Reveal className="mx-auto flex max-w-7xl flex-col items-start gap-4 px-6 md:px-8">
          <h2 className="font-serif text-2xl text-maroon sm:text-3xl">
            {ctaTitle}
          </h2>
          <p className="max-w-xl text-base text-muted">{ctaText}</p>
          <Link href={ctaTo}>
            <Button>{ctaLabel}</Button>
          </Link>
        </Reveal>
      </section>
    </>
  );
}
