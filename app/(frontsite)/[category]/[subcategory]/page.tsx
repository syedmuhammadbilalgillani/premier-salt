import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CategoryLeafView } from "@/components/storefront/CategoryLeafView";
import {
  getCachedCategories,
  getCachedCategoryBySlug,
} from "@/lib/category";
import { getCatalogProductsForCategory } from "@/lib/product";
import { buildMetadata, toPlainDescription } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema } from "@/lib/schema";

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const allCategories = await getCachedCategories({});
  const children = allCategories.filter((c) => c.parentCategoryId);
  return children.map((sub) => {
    const parent = allCategories.find((c) => c.id === sub.parentCategoryId);
    return {
      category: parent?.slug ?? "products",
      subcategory: sub.slug,
    };
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; subcategory: string }>;
}): Promise<Metadata> {
  const { category: parentSlug, subcategory: childSlug } = await params;
  const child = await getCachedCategoryBySlug(childSlug);
  if (!child) {
    return buildMetadata({
      title: "Category",
      description: "",
      path: `/${parentSlug}/${childSlug}`,
      noindex: true,
    });
  }

  return buildMetadata({
    title: child.title,
    description:
      toPlainDescription(child.description) ||
      `Explore our range of ${child.title} — wholesale, export and private-label enquiries welcome.`,
    path: `/${parentSlug}/${childSlug}`,
    image: child.image_url ?? undefined,
  });
}

export default async function SubcategoryPage({
  params,
}: {
  params: Promise<{ category: string; subcategory: string }>;
}) {
  const { category: parentSlug, subcategory: childSlug } = await params;

  const parent = await getCachedCategoryBySlug(parentSlug);
  if (!parent) notFound();

  const child = await getCachedCategoryBySlug(childSlug);
  // The child must actually belong to this parent — otherwise
  // /{wrong-parent}/{real-child} would resolve, which it shouldn't.
  if (!child || child.parentCategoryId !== parent.id) notFound();

  const products = await getCatalogProductsForCategory(child.id);

  const crumbs = [
    { label: "Products", to: "/products" },
    { label: parent.title, to: `/${parent.slug}` },
    { label: child.title },
  ];

  const breadcrumbsSchema = getBreadcrumbSchema([
    { name: "Products", url: "/products" },
    { name: parent.title, url: `/${parent.slug}` },
    { name: child.title, url: `/${parent.slug}/${child.slug}` },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbsSchema} />
      <CategoryLeafView
        eyebrow={parent.title}
        title={child.title}
        crumbs={crumbs}
        category={child}
        products={products}
      />
    </>
  );
}
