import type { Metadata } from "next";
import { getCachedCategories } from "@/lib/category";
import { getShopProducts } from "@/lib/product";
import { getCachedPublishedBlogPosts } from "@/lib/blog";
import { homeContent } from "@/data/home";
import { buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { getFAQPageSchema } from "@/lib/schema";
import Home from "@/routes/Home";

interface HomePageProps {
  firstLevelCategory?: boolean;
}

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: "Premier Salt | Leading Himalayan Salt Manufacturer & Global Bulk Exporter",
  description:
    "Premier Salt Industries is Pakistan's premier manufacturer & containerized exporter of 100% authentic Himalayan rock salt from Khewra. Certified with ISO 9001, HACCP, ISO 22000, Halal & FDA.",
  path: "/",
  image: "/assets/home-page-hero-pic.webp",
});


const HomePage = async ({ firstLevelCategory }: HomePageProps = {}) => {
  const [categories, products, allPosts] = await Promise.all([
    getCachedCategories({
      limit: 12,
      firstLevelOnly: true,
    }),
    getShopProducts(),
    getCachedPublishedBlogPosts(),
  ]);
  const posts = allPosts.slice(0, 3);

  const homeFaqSchema = getFAQPageSchema([...homeContent.faqs]);

  return (
    <>
      <JsonLd data={homeFaqSchema} />
      <Home
        categories={categories}
        initialProducts={products}
        posts={posts}
      />
    </>
  );
};

export default HomePage;
