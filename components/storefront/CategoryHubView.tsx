import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { Crumb } from "@/components/layout/Breadcrumbs";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { Button } from "@/components/ui/button";
import { FAQAccordion } from "@/components/ui/FAQAccordion";
import { cn } from "@/lib/utils";

function SpecList({ spec }: { spec: Record<string, string> }) {
  const entries = Object.entries(spec);
  if (!entries.length) return null;
  return (
    <Reveal>
      <span className="eyebrow">Specifications</span>
      <h2 className="mt-3 mb-4 font-serif text-xl text-primary">Overview</h2>
      <dl className="grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
        {entries.map(([key, value]) => (
          <div
            key={key}
            className="flex justify-between gap-4 border-b border-border py-2 text-sm"
          >
            <dt className="text-muted-foreground">{key}</dt>
            <dd className="text-right text-charcoal">{value}</dd>
          </div>
        ))}
      </dl>
    </Reveal>
  );
}

export interface CategoryHubViewCategory {
  title: string;
  description: string | null;
  image_url: string | null;
  spec: Record<string, string> | null;
}

export interface SubcategoryCardData {
  id: string;
  title: string;
  slug: string;
  image_url: string | null;
  description: string | null;
  productCount: number;
}

/**
 * Full category-detail page body for a "hub" category (one that has
 * subcategories) — hero, description, specifications, then a card grid of
 * its subcategories (product count + excerpt per card, linking to the
 * nested `/{category}/{subcategory}` URL) instead of a products section.
 * Products live at the leaf level — see the category-hierarchy plan.
 */
export function CategoryHubView({
  eyebrow,
  title,
  crumbs,
  category,
  parentSlug,
  subcategories,
}: {
  eyebrow: string;
  title: string;
  crumbs: Crumb[];
  category: CategoryHubViewCategory;
  /** This category's own slug — subcategory links are `/{parentSlug}/{child.slug}`. */
  parentSlug: string;
  subcategories: SubcategoryCardData[];
}) {
  const faqs = [
    {
      question: `How is ${title.toLowerCase()} organized?`,
      answer: `${title} is grouped into ${subcategories.length} subcategories below — open one to see its full product range and packing options.`,
    },
    {
      question: "Can you provide a formal quotation?",
      answer:
        "Yes — use the Request a Quote form with your product, quantity and destination details and we'll follow up promptly.",
    },
    {
      question: "Do you support export shipments for this category?",
      answer:
        "Yes, this category is available for export, wholesale and distributor enquiries.",
    },
  ];

  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} crumbs={crumbs} />

      <div className="mx-auto grid max-w-(--container-page) grid-cols-1 gap-16 px-6 py-20 md:grid-cols-[1fr_320px] md:px-8">
        <div className="flex flex-col gap-14">
          <Reveal>
            {category.image_url ? (
              <div className="relative aspect-[12/7] w-full overflow-hidden rounded-md">
                <Image
                  src={category.image_url}
                  alt={title}
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 800px, 100vw"
                  priority
                />
              </div>
            ) : (
              <ImagePlaceholder
                label={`${title} — Product Gallery`}
                width={1200}
                height={700}
              />
            )}
          </Reveal>

          {category.description ? (
            <Reveal>
              <div
                dangerouslySetInnerHTML={{ __html: category.description }}
                className={cn(
                  "text-sm leading-relaxed text-muted-foreground",
                  "[&_p]:my-2 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0",
                  "[&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5",
                  "[&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5",
                  "[&_blockquote]:my-2 [&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-3 [&_blockquote]:italic",
                  "[&_h2]:mt-4 [&_h2]:mb-2 [&_h2]:font-serif [&_h2]:text-lg [&_h2]:text-primary",
                  "[&_h3]:mt-3 [&_h3]:mb-1.5 [&_h3]:font-serif [&_h3]:text-base [&_h3]:text-primary",
                  "[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2",
                )}
              />
            </Reveal>
          ) : null}

          {category.spec ? <SpecList spec={category.spec} /> : null}

          <Reveal className="flex flex-col gap-6">
            <div>
              <span className="eyebrow">Explore</span>
              <h2 className="mt-3 mb-1 font-serif text-2xl text-primary">
                {title} Subcategories
              </h2>
              <p className="text-sm text-muted-foreground">
                Choose a subcategory to see its full product range, sizes and
                packing options.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {subcategories.map((child) => (
                <Link
                  key={child.id}
                  href={`/${parentSlug}/${child.slug}`}
                  className="group flex flex-col overflow-hidden rounded-sm border border-border transition-colors hover:border-primary"
                >
                  {child.image_url ? (
                    <div className="relative aspect-[5/3.2] w-full overflow-hidden">
                      <Image
                        src={child.image_url}
                        alt={child.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                        sizes="(min-width: 640px) 400px, 90vw"
                      />
                    </div>
                  ) : (
                    <ImagePlaceholder
                      label={child.title}
                      width={500}
                      height={320}
                    />
                  )}
                  <div className="flex flex-1 flex-col gap-2 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-serif text-base text-primary group-hover:text-primary">
                        {child.title}
                      </span>
                      <span className="shrink-0 rounded-full bg-sand/60 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-charcoal">
                        {child.productCount}{" "}
                        {child.productCount === 1 ? "product" : "products"}
                      </span>
                    </div>
                    {child.description ? (
                      <div
                        dangerouslySetInnerHTML={{ __html: child.description }}
                        className="line-clamp-2 text-sm text-muted-foreground-foreground[&_*]:inline"
                      />
                    ) : null}
                    <span className="mt-auto flex items-center gap-1 pt-1 text-xs font-semibold uppercase tracking-wide text-primary">
                      View Range <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </Reveal>

          <Reveal>
            <span className="eyebrow">FAQ</span>
            <h2 className="mt-3 mb-5 font-serif text-2xl text-primary">
              Common Questions
            </h2>
            <FAQAccordion items={faqs} />
          </Reveal>
        </div>

        <Reveal className="h-fit rounded-sm border border-border bg-sand/40 p-6">
          <h3 className="font-serif text-lg text-primary">Get a Quote</h3>
          <p className="mt-3 text-sm text-muted-foreground">
            Share your requirement for {title.toLowerCase()} and our export
            sales team will follow up with pricing, MOQ and production schedule.
          </p>
          <Link href="/request-a-quote" className="mt-5 block">
            <Button className="w-full">Request Quote</Button>
          </Link>
        </Reveal>
      </div>
    </>
  );
}
