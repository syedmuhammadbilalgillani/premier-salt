import type { Metadata } from "next";
import { getCachedCategories } from "@/lib/category";
import { getShopProducts } from "@/lib/product";
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

const homeFaqs = [
  {
    question: "Where is Premier Salt Industries located and where is the salt sourced?",
    answer:
      "Premier Salt Industries operates its processing plant on GT Road Muridke, Punjab, Pakistan, sourcing 100% authentic mineral-rich rock salt directly from the Himalayan Khewra salt range belt.",
  },
  {
    question: "What products does Premier Salt manufacture and export?",
    answer:
      "We manufacture and export food-grade edible Himalayan pink/white/black salt, animal lick salt blocks, handcrafted Himalayan salt lamps, spa & bath salts, cooking slabs, and industrial salt.",
  },
  {
    question: "Does Premier Salt offer OEM, wholesale, and private-label packaging?",
    answer:
      "Yes. We specialize in custom OEM and private-label packaging for international supermarket brands, wholesalers, and retail distributors, including custom pouches, grinders, shaker jars, and bulk 25kg/50kg/1-ton bags.",
  },
  {
    question: "What quality and safety certifications does Premier Salt hold?",
    answer:
      "Premier Salt holds ISO 9001:2015, HACCP, ISO 22000:2018 food safety certification, Halal Certification, SMAP membership, and is registered with the U.S. FDA.",
  },
];

const HomePage = async ({ firstLevelCategory }: HomePageProps = {}) => {
  const [categories, products] = await Promise.all([
    getCachedCategories({
      limit: 6,
      firstLevelOnly: true,
    }),
    getShopProducts(),
  ]);

  const homeFaqSchema = getFAQPageSchema(homeFaqs);

  return (
    <>
      <JsonLd data={homeFaqSchema} />
      <Home categories={categories} initialProducts={products} />
    </>
  );
};

export default HomePage;
