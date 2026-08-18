import type { Metadata } from "next";
import { getCachedCategories } from "@/lib/category";
import { buildMetadata } from "@/lib/seo";
import Home from "@/routes/Home";

interface HomePageProps {
  firstLevelCategory?: boolean;
}

export const metadata: Metadata = buildMetadata({
  title: "Premium Himalayan Salt Manufacturer & Exporter",
  description:
    "Premier Salt Industries processes, manufactures and exports authentic Himalayan salt products from Pakistan for importers, wholesalers, retailers and private-label brands.",
  path: "/",
  image: "/assets/home-page-hero-pic.webp",
});

const HomePage = async ({ firstLevelCategory }: HomePageProps = {}) => {
  const categories = await getCachedCategories({
    limit: 6,
    firstLevelOnly: true,
  });

  // console.log(categories, "categories");

  return <Home categories={categories} />;
};

export default HomePage;
