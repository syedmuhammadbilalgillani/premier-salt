import { getCachedCategories } from "@/lib/category";
import Home from "@/routes/Home";

const HomePage = async () => {
  const categories = await getCachedCategories({ limit: 6 });

  // console.log(categories, "categories");

  return <Home categories={categories} />;
};

export default HomePage;
