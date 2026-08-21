import type { MetadataRoute } from "next";

import { getCachedCategories } from "@/lib/category";
import { getCachedPublishedBlogPosts } from "@/lib/blog";
import { getShopProducts } from "@/lib/product";
import { SITE_URL } from "@/lib/seo";

const STATIC_ROUTES = [
  "/",
  "/about",
  "/about-himalayan-salt",
  "/manufacturing",
  "/products",
  "/shop",
  "/blog",
  "/contact",
  "/faq",
  "/request-a-quote",
  "/private-labeling",
  "/wholesale-distributor",
  "/export-capabilities",
  "/quality-certifications",
  "/sustainability",
  "/order-tracking",
  "/terms-conditions",
  "/privacy-policy",
  "/cookie-policy",
  "/payment-policy",
  "/shipping-delivery",
  "/returns-refunds",
  "/damaged-products",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, shopProducts, blogPosts] = await Promise.all([
    getCachedCategories({}),
    getShopProducts(),
    getCachedPublishedBlogPosts(),
  ]);

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: path === "/" ? "daily" : "monthly",
    priority: path === "/" ? 1 : 0.6,
  }));

  const categoryEntries: MetadataRoute.Sitemap = categories.map((cat) => {
    const parent = cat.parentCategoryId
      ? categories.find((c) => c.id === cat.parentCategoryId)
      : null;
    const path = parent ? `/${parent.slug}/${cat.slug}` : `/${cat.slug}`;
    return {
      url: `${SITE_URL}${path}`,
      lastModified: cat.updatedAt,
      changeFrequency: "weekly",
      priority: 0.7,
    };
  });

  const productEntries: MetadataRoute.Sitemap = shopProducts.map((p) => ({
    url: `${SITE_URL}/shop/product/${p.slug}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const blogEntries: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${SITE_URL}/blog/${post.categorySlug}/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticEntries, ...categoryEntries, ...productEntries, ...blogEntries];
}
