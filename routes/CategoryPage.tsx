import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { Button } from "@/components/ui/button";
import { FAQAccordion } from "@/components/ui/FAQAccordion";
import { getB2BPage } from "@/data/b2bPages";
import { notFound, usePathname } from "next/navigation";
import Link from "next/link";

function Block({
  eyebrow,
  title,
  items,
}: {
  eyebrow: string;
  title: string;
  items: string[];
}) {
  return (
    <div>
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="mt-3 mb-4 font-serif text-xl text-primary">{title}</h2>
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-2 text-sm text-charcoal"
          >
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />{" "}
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function CategoryPage() {
  const category = usePathname();
  const page = getB2BPage(category);

  if (!page) return notFound();

  const relatedPages = page.related
    .map((s) => getB2BPage(s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
  const faqs = [
    {
      question: `Is private labeling available for ${page.name.toLowerCase()}?`,
      answer: page.privateLabelAvailable
        ? "Yes — private-label options are available for this category. Contact sales to discuss your requirement."
        : "This category is generally supplied under our own specifications, but custom project requirements can be discussed with our sales team.",
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
      <PageHero
        eyebrow={page.parent ? page.parent.name : "Products"}
        title={page.name}
        description={page.description}
        crumbs={[
          { label: "Products", to: "/products" },
          ...(page.parent
            ? [{ label: page.parent.name, to: `/${page.parent.slug}` }]
            : []),
          { label: page.name },
        ]}
      />

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 px-6 py-20 md:grid-cols-[1fr_320px] md:px-8">
        <div className="flex flex-col gap-14">
          <Reveal>
            <ImagePlaceholder
              label={`${page.name} — Product Gallery`}
              width={1200}
              height={700}
            />
          </Reveal>

          <Reveal className="grid grid-cols-1 gap-10 sm:grid-cols-2">
            <Block
              eyebrow="Product Options"
              title="What's Available"
              items={page.productOptions}
            />
            <Block
              eyebrow="Applications"
              title="Key Applications"
              items={page.applications}
            />
            <Block
              eyebrow="Customization"
              title="Customization Options"
              items={page.customization}
            />
            <Block
              eyebrow="Packaging"
              title="Packaging Options"
              items={page.packaging}
            />
          </Reveal>

          <Reveal>
            <span className="eyebrow">FAQ</span>
            <h2 className="mt-3 mb-5 font-serif text-2xl text-primary">
              Common Questions
            </h2>
            <FAQAccordion items={faqs} />
          </Reveal>

          {relatedPages.length > 0 && (
            <Reveal>
              <span className="eyebrow">Related</span>
              <h2 className="mt-3 mb-5 font-serif text-2xl text-primary">
                You May Also Need
              </h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {relatedPages.map((rel) => (
                  <Link
                    key={rel.slug}
                    href={`/${rel.slug}`}
                    className="group flex flex-col gap-3"
                  >
                    <ImagePlaceholder
                      label={rel.name}
                      width={500}
                      height={360}
                    />
                    <span className="text-sm font-medium text-charcoal group-hover:text-primary">
                      {rel.name}
                    </span>
                  </Link>
                ))}
              </div>
            </Reveal>
          )}
        </div>

        <Reveal className="h-fit rounded-sm border border-border bg-sand/40 p-6">
          <h3 className="font-serif text-lg text-primary">
            Specification Overview
          </h3>
          <dl className="mt-4 flex flex-col gap-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Product type</dt>
              <dd className="text-right text-charcoal">{page.name}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Colour options</dt>
              <dd className="text-right text-charcoal">
                Multiple, see product options
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Size options</dt>
              <dd className="text-right text-charcoal">Multiple</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Packaging</dt>
              <dd className="text-right text-charcoal">{page.packaging[0]}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Private label</dt>
              <dd className="text-right text-charcoal">
                {page.privateLabelAvailable ? "Available" : "On request"}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Wholesale</dt>
              <dd className="text-right text-charcoal">Available</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Export</dt>
              <dd className="text-right text-charcoal">Available</dd>
            </div>
          </dl>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            Contact sales for current specifications, MOQ and production
            schedule.
          </p>
          <Link href="/request-a-quote" className="mt-5 block">
            <Button className="w-full">Request Quote</Button>
          </Link>
        </Reveal>
      </div>
    </>
  );
}
