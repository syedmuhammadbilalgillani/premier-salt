import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { CategoryHubView } from "@/components/storefront/CategoryHubView";
import { CategoryLeafView } from "@/components/storefront/CategoryLeafView";
import {
  getCachedCategory,
  getCachedCategoryBySlug,
  getCachedChildCategories,
} from "@/lib/category";
import { getCatalogProductsForCategory } from "@/lib/product";
import { buildMetadata, toPlainDescription } from "@/lib/seo";

// Category content is admin-managed and cache-tagged (revalidateTag on every
// category/product mutation) — no need to force-dynamic a public page.

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: slug } = await params;
  const category = await getCachedCategoryBySlug(slug);
  if (!category) return buildMetadata({ title: "Category", description: "", path: `/${slug}`, noindex: true });

  return buildMetadata({
    title: category.title,
    description:
      toPlainDescription(category.description) ||
      `Explore our range of ${category.title} — wholesale, export and private-label enquiries welcome.`,
    path: `/${slug}`,
    image: category.image_url ?? undefined,
  });
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: slug } = await params;

  const category = await getCachedCategoryBySlug(slug);
  if (!category) notFound();

  // A subcategory's canonical URL is /{parentSlug}/{slug} — redirect flat
  // links (e.g. the homepage's category grid) to it instead of rendering
  // here, so the nested route is the one that actually shows the page.
  if (category.parentCategoryId) {
    const parent = await getCachedCategory(category.parentCategoryId);
    if (parent) {
      redirect(`/${parent.slug}/${category.slug}`);
    }
  }

  const subcategories = await getCachedChildCategories(category.id);

  const crumbs = [
    { label: "Products", to: "/products" },
    { label: category.title },
  ];

  if (subcategories.length > 0) {
    return (
      <>
        <CategoryHubView
          eyebrow="Products"
          title={category.title}
          crumbs={crumbs}
          category={category}
          parentSlug={category.slug}
          subcategories={subcategories}
        />
      </>
    );
  }

  const products = await getCatalogProductsForCategory(category.id);

  return (
    <>
      <CategoryLeafView
        eyebrow="Products"
        title={category.title}
        crumbs={crumbs}
        category={category}
        products={products}
      />
    </>
  );
}
