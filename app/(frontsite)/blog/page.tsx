import type { Metadata } from "next";
import { BlogListingView } from "@/components/storefront/BlogListingView";
import { getCachedPublishedBlogPosts } from "@/lib/blog";
import { buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema } from "@/lib/schema";

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: "Blog & Himalayan Salt Insights | Premier Salt",
  description:
    "Articles on Himalayan salt — sourcing from Khewra, processing, export standards, private-label guides, and culinary uses from Premier Salt Industries.",
  path: "/blog",
});

export default async function BlogPage() {
  const allPosts = await getCachedPublishedBlogPosts();
  const breadcrumbsSchema = getBreadcrumbSchema([
    { name: "Blog", url: "/blog" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbsSchema} />
      <BlogListingView allPosts={allPosts} />
    </>
  );
}

