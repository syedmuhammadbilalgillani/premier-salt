import Image from "next/image";
import Link from "next/link";

import type { Crumb } from "@/components/layout/Breadcrumbs";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { Button } from "@/components/ui/button";
import { FAQAccordion } from "@/components/ui/FAQAccordion";
import type { CatalogProduct } from "@/lib/product";
import { cn } from "@/lib/utils";

function SpecList({ spec }: { spec: Record<string, string> }) {
  const entries = Object.entries(spec);
  if (!entries.length) return null;
  return (
    <Reveal>
      <span className="eyebrow">Specifications</span>
      <h2 className="mt-3 mb-4 font-serif text-xl text-maroon">Overview</h2>
      <dl className="grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
        {entries.map(([key, value]) => (
          <div key={key} className="flex justify-between gap-4 border-b border-border py-2 text-sm">
            <dt className="text-muted">{key}</dt>
            <dd className="text-right text-charcoal">{value}</dd>
          </div>
        ))}
      </dl>
    </Reveal>
  );
}

function productSummary(product: CatalogProduct, columns: string[]): string {
  return columns
    .map((col) => {
      const text = product.spec?.[col];
      return text ? `${col}: ${text}` : null;
    })
    .filter((v): v is string => Boolean(v))
    .join(" · ");
}

function ProductsSection({
  categoryName,
  products,
}: {
  categoryName: string;
  products: CatalogProduct[];
}) {
  if (!products.length) {
    return (
      <Reveal>
        <span className="eyebrow">Products</span>
        <h2 className="mt-3 mb-4 font-serif text-2xl text-maroon">
          {categoryName} Range
        </h2>
        <p className="text-sm text-muted">
          Products for this category will appear here shortly.
        </p>
      </Reveal>
    );
  }

  const columns = Array.from(
    new Set(products.flatMap((p) => Object.keys(p.spec ?? {}))),
  );

  return (
    <Reveal className="flex flex-col gap-8">
      <div>
        <span className="eyebrow">Products</span>
        <h2 className="mt-3 mb-1 font-serif text-2xl text-maroon">
          {categoryName} Range
        </h2>
        <p className="text-sm text-muted">
          Available sizes and packing options for this category. Contact us
          for pricing, MOQ and custom specifications.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex flex-col gap-3 rounded-sm border border-border p-4"
          >
            {product.imageUrl ? (
              <div className="relative aspect-square w-full overflow-hidden rounded-sm bg-sand/40">
                <Image
                  src={product.imageUrl}
                  alt={product.title}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, 90vw"
                />
              </div>
            ) : (
              <ImagePlaceholder label={product.title} width={400} height={400} />
            )}
            <div>
              <p className="font-serif text-base text-maroon">{product.title}</p>
              {product.sku && (
                <p className="mt-0.5 text-xs text-muted">SKU: {product.sku}</p>
              )}
              {columns.length ? (
                <p className="mt-1.5 text-xs leading-relaxed text-charcoal">
                  {productSummary(product, columns) || "—"}
                </p>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      {columns.length ? (
        <div className="overflow-x-auto rounded-sm border border-border">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-sand/40 text-xs uppercase tracking-wide text-muted">
                <th className="px-4 py-3 font-medium">Sr#</th>
                <th className="px-4 py-3 font-medium">SKU</th>
                <th className="px-4 py-3 font-medium">Name</th>
                {columns.map((col) => (
                  <th key={col} className="px-4 py-3 font-medium">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={product.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 text-muted">
                    {String(index + 1).padStart(2, "0")}
                  </td>
                  <td className="px-4 py-3 text-charcoal">{product.sku ?? "—"}</td>
                  <td className="px-4 py-3 font-medium text-charcoal">
                    {product.title}
                  </td>
                  {columns.map((col) => (
                    <td key={col} className="px-4 py-3 text-muted">
                      {product.spec?.[col] ?? "—"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </Reveal>
  );
}

export interface CategoryLeafViewCategory {
  title: string;
  description: string | null;
  image_url: string | null;
  spec: Record<string, string> | null;
}

/**
 * Full category-detail page body for a leaf category (one with no
 * subcategories) — hero, description, specifications, its catalog products
 * (grid + dynamic spec table), FAQ and a "Request Quote" sidebar CTA. Used
 * both by `/[category]` (when the resolved category has no children) and by
 * `/[category]/[subcategory]` (always, since a subcategory route never
 * hub-ifies further — see the category-hierarchy plan's scope boundary).
 */
export function CategoryLeafView({
  eyebrow,
  title,
  crumbs,
  category,
  products,
}: {
  eyebrow: string;
  title: string;
  crumbs: Crumb[];
  category: CategoryLeafViewCategory;
  products: CatalogProduct[];
}) {
  const faqs = [
    {
      question: `Is private labeling available for ${title.toLowerCase()}?`,
      answer:
        "Private-label options are available for most categories — contact sales to discuss your requirement.",
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
              <ImagePlaceholder label={`${title} — Product Gallery`} width={1200} height={700} />
            )}
          </Reveal>

          {category.description ? (
            <Reveal>
              <div
                dangerouslySetInnerHTML={{ __html: category.description }}
                className={cn(
                  "text-sm leading-relaxed text-muted",
                  "[&_p]:my-2 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0",
                  "[&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5",
                  "[&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5",
                  "[&_blockquote]:my-2 [&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-3 [&_blockquote]:italic",
                  "[&_h2]:mt-4 [&_h2]:mb-2 [&_h2]:font-serif [&_h2]:text-lg [&_h2]:text-maroon",
                  "[&_h3]:mt-3 [&_h3]:mb-1.5 [&_h3]:font-serif [&_h3]:text-base [&_h3]:text-maroon",
                  "[&_a]:text-terracotta [&_a]:underline [&_a]:underline-offset-2",
                )}
              />
            </Reveal>
          ) : null}

          {category.spec ? <SpecList spec={category.spec} /> : null}

          <ProductsSection categoryName={title} products={products} />

          <Reveal>
            <span className="eyebrow">FAQ</span>
            <h2 className="mt-3 mb-5 font-serif text-2xl text-maroon">Common Questions</h2>
            <FAQAccordion items={faqs} />
          </Reveal>
        </div>

        <Reveal className="h-fit rounded-sm border border-border bg-sand/40 p-6">
          <h3 className="font-serif text-lg text-maroon">Get a Quote</h3>
          <p className="mt-3 text-sm text-muted">
            Share your requirement for {title.toLowerCase()} and our export sales
            team will follow up with pricing, MOQ and production schedule.
          </p>
          <Link href="/request-a-quote" className="mt-5 block">
            <Button className="w-full">Request Quote</Button>
          </Link>
        </Reveal>
      </div>
    </>
  );
}
