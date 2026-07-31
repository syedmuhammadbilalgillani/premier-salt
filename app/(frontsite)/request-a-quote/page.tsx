import { getCachedCategories } from "@/lib/category";
import RequestQuote from "@/routes/RequestQuote";

export default async function RequestQuotePage() {
  const categories = await getCachedCategories({});
  return <RequestQuote categories={categories} />;
}
