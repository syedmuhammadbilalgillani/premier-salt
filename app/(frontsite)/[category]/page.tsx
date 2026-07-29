import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { Button } from "@/components/ui/button";
import { FAQAccordion } from "@/components/ui/FAQAccordion";
import {
  getCachedCategory,
  getCachedCategoryBySlug,
  getCachedChildCategories,
} from "@/lib/category";
import { getCatalogProductsForCategory, type CatalogProduct } from "@/lib/product";

// Category content is admin-managed and cache-tagged (revalidateTag on every
// category/product mutation) — no need to force-dynamic a public page.

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
      const values = product.optionsByName[col];
      const text = values?.length ? values.join(", ") : product.spec?.[col];
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
    new Set(products.flatMap((p) => Object.keys(p.optionsByName))),
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
                  {columns.map((col) => {
                    const values = product.optionsByName[col];
                    const text = values?.length
                      ? values.join(", ")
                      : (product.spec?.[col] ?? "—");
                    return (
                      <td key={col} className="px-4 py-3 text-muted">
                        {text}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </Reveal>
  );
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: slug } = await params;

  const category = await getCachedCategoryBySlug(slug);
  if (!category) notFound();

  const [parent, children, catalogProducts] = await Promise.all([
    category.parentCategoryId ? getCachedCategory(category.parentCategoryId) : null,
    getCachedChildCategories(category.id),
    getCatalogProductsForCategory(category.id),
  ]);

  const faqs = [
    {
      question: `Is private labeling available for ${category.title.toLowerCase()}?`,
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
      <PageHero
        eyebrow={parent ? parent.title : "Products"}
        title={category.title}
        description={category.description ?? undefined}
        crumbs={[
          { label: "Products", to: "/products" },
          ...(parent ? [{ label: parent.title, to: `/${parent.slug}` }] : []),
          { label: category.title },
        ]}
      />

      <div className="mx-auto grid max-w-(--container-page) grid-cols-1 gap-16 px-6 py-20 md:grid-cols-[1fr_320px] md:px-8">
        <div className="flex flex-col gap-14">
          <Reveal>
            {category.image_url ? (
              <div className="relative aspect-[12/7] w-full overflow-hidden rounded-md">
                <Image
                  src={category.image_url}
                  alt={category.title}
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 800px, 100vw"
                  priority
                />
              </div>
            ) : (
              <ImagePlaceholder
                label={`${category.title} — Product Gallery`}
                width={1200}
                height={700}
              />
            )}
          </Reveal>

          {category.spec ? <SpecList spec={category.spec} /> : null}

          <ProductsSection categoryName={category.title} products={catalogProducts} />

          {children.length > 0 && (
            <Reveal>
              <span className="eyebrow">Explore</span>
              <h2 className="mt-3 mb-5 font-serif text-2xl text-maroon">
                Subcategories
              </h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {children.map((child) => (
                  <Link
                    key={child.id}
                    href={`/${child.slug}`}
                    className="group flex flex-col gap-3"
                  >
                    {child.image_url ? (
                      <div className="relative aspect-[5/3.6] w-full overflow-hidden rounded-md">
                        <Image
                          src={child.image_url}
                          alt={child.title}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                          sizes="(min-width: 640px) 400px, 90vw"
                        />
                      </div>
                    ) : (
                      <ImagePlaceholder label={child.title} width={500} height={360} />
                    )}
                    <span className="text-sm font-medium text-charcoal group-hover:text-terracotta">
                      {child.title}
                    </span>
                  </Link>
                ))}
              </div>
            </Reveal>
          )}

          <Reveal>
            <span className="eyebrow">FAQ</span>
            <h2 className="mt-3 mb-5 font-serif text-2xl text-maroon">
              Common Questions
            </h2>
            <FAQAccordion items={faqs} />
          </Reveal>
        </div>

        <Reveal className="h-fit rounded-sm border border-border bg-sand/40 p-6">
          <h3 className="font-serif text-lg text-maroon">Get a Quote</h3>
          <p className="mt-3 text-sm text-muted">
            Share your requirement for {category.title.toLowerCase()} and our
            export sales team will follow up with pricing, MOQ and production
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
