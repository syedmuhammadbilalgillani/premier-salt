import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BlogListingView } from "@/components/storefront/BlogListingView";
import {
  getCachedBlogCategories,
  getCachedBlogCategoryBySlug,
  getCachedPublishedBlogPosts,
} from "@/lib/blog";
import { buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema } from "@/lib/schema";

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const categories = await getCachedBlogCategories();
  return categories.map((c) => ({ categorySlug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}): Promise<Metadata> {
  const { categorySlug } = await params;
  const category = await getCachedBlogCategoryBySlug(categorySlug);
  if (!category) {
    return buildMetadata({
      title: "Blog",
      description: "",
      path: `/blog/${categorySlug}`,
      noindex: true,
    });
  }

  return buildMetadata({
    title: `${category.title} Articles | Premier Salt Blog`,
    description: `Expert articles and industry insights about ${category.title.toLowerCase()} from Premier Salt Industries.`,
    path: `/blog/${categorySlug}`,
  });
}

export default async function BlogCategoryPage({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}) {
  const { categorySlug } = await params;

  const category = await getCachedBlogCategoryBySlug(categorySlug);
  if (!category) notFound();

  const allPosts = await getCachedPublishedBlogPosts();

  const breadcrumbsSchema = getBreadcrumbSchema([
    { name: "Blog", url: "/blog" },
    { name: category.title, url: `/blog/${category.slug}` },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbsSchema} />
      <BlogListingView
        allPosts={allPosts}
        activeCategorySlug={category.slug}
        activeCategoryTitle={category.title}
      />
    </>
  );
}
