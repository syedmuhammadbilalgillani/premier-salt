import type { Metadata } from "next";
import Search from "@/routes/Search";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Search",
  description: "Search products, categories and articles on Premier Salt.",
  path: "/search",
  noindex: true,
});

const page = () => {
  return <Search />;
};

export default page;
