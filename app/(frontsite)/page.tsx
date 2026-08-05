import { getCachedCategories } from "@/lib/category";
import Home from "@/routes/Home";

interface HomePageProps {
  firstLevelCategory?: boolean;
}

const HomePage = async ({ firstLevelCategory }: HomePageProps = {}) => {
  const categories = await getCachedCategories({
    limit: 6,
    firstLevelOnly: true,
  });

  // console.log(categories, "categories");

  return <Home categories={categories} />;
};

export default HomePage;
