import Image from "next/image";
import Link from "next/link";

import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { getCachedCategories } from "@/lib/category";
import { ArrowRight } from "lucide-react";

// Category content is admin-managed and cache-tagged (revalidateTag on every
// category mutation) — no need to force-dynamic a public page.

interface CategoryNode {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  productCount: number;
  children: { id: string; title: string }[];
}

function buildCategoryTree(
  categories: Awaited<ReturnType<typeof getCachedCategories>>,
): CategoryNode[] {
  const nodeById = new Map<string, CategoryNode>();
  for (const c of categories) {
    nodeById.set(c.id, { ...c, children: [] });
  }

  const roots: CategoryNode[] = [];
  for (const c of categories) {
    const node = nodeById.get(c.id);
    if (!node) continue;
    const parent = c.parentCategoryId
      ? nodeById.get(c.parentCategoryId)
      : undefined;
    if (parent) {
      parent.children.push({ id: node.id, title: node.title });
    } else {
      roots.push(node);
    }
  }
  return roots;
}

export default async function ProductsPage() {
  const categories = await getCachedCategories({});
  const roots = buildCategoryTree(categories);

  return (
    <>
      <PageHero
        eyebrow="Products"
        title="Himalayan Salt Product Range"
        description="This section is for wholesale, export, distributor and private-label enquiries. Retail buyers should visit our online shop."
        crumbs={[{ label: "Products" }]}
      />

      <div className="mx-auto max-w-7xl px-6 py-16 md:px-8">
        {roots.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Categories will appear here once they&apos;re added.
          </p>
        ) : (
          <Reveal
            stagger
            className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            {roots.map((cat) => (
              <div key={cat.id} className="flex flex-col gap-3 p-5">
                {cat.image_url ? (
                  <div className="relative shadow aspect-[4/2.75] w-full overflow-hidden rounded-sm bg-sand/40">
                    <Image
                      src={cat.image_url}
                      alt={cat.title}
                      fill
                      className="object-cover h-full"
                      sizes="(min-width: 1024px) 360px, (min-width: 640px) 45vw, 90vw"
                    />
                  </div>
                ) : (
                  <ImagePlaceholder
                    label={cat.title}
                    width={640}
                    height={440}
                  />
                )}
                <h3 className="font-serif text-lg text-primary">{cat.title}</h3>
                {cat.description ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: cat.description }}
                    className="line-clamp-3 text-sm leading-relaxed text-muted-foreground"
                  />
                ) : null}
                <span className="text-xs font-semibold uppercase tracking-wide text-primary">
                  {cat.productCount} product{cat.productCount === 1 ? "" : "s"}
                </span>
                {cat.children.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Includes: {cat.children.map((c) => c.title).join(", ")}
                  </p>
                )}
                <div className="mt-1 flex gap-4 justify-between">
                  <Link
                    href="/request-a-quote"
                    className="text-sm font-semibold text-primary hover:text-primary flex items-center gap-1.5"
                  >
                    Request Quote{" "}
                    <ArrowRight size={15} className="-rotate-45" />
                  </Link>
                  <Link
                    href={`/${cat.slug}`}
                    className="text-sm font-semibold text-charcoal hover:text-primary flex items-center gap-1.5"
                  >
                    View Category{" "}
                    <ArrowRight size={15} className="-rotate-45" />
                  </Link>
                </div>
              </div>
            ))}
          </Reveal>
        )}

        <Reveal className="mt-20 grid grid-cols-1 gap-8 border-t border-border pt-16 sm:grid-cols-2">
          <div className="rounded-sm bg-sand/40 p-8">
            <h3 className="font-serif text-xl text-primary">B2B Catalogue</h3>
            <ul className="mt-4 flex flex-col gap-2 text-sm text-charcoal">
              {[
                "Bulk quantities",
                "Custom packaging",
                "Private label",
                "Export enquiry",
                "Price on request",
              ].map((i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" /> {i}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-sm border border-border bg-cream p-8">
            <h3 className="font-serif text-xl text-primary">Online Shop</h3>
            <ul className="mt-4 flex flex-col gap-2 text-sm text-charcoal">
              {[
                "Small quantities",
                "Listed retail prices",
                "Pakistan delivery",
                "Online checkout",
              ].map((i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" /> {i}
                </li>
              ))}
            </ul>
            <Link
              href="/shop"
              className="mt-4 flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary"
            >
              Shop Online <ArrowRight size={15} />
            </Link>
          </div>
        </Reveal>
      </div>
    </>
  );
}
