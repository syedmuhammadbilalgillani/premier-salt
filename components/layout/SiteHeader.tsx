import { getProductNavTree } from "@/lib/navigation";
import { SiteHeaderClient } from "@/components/layout/SiteHeaderClient";

export async function SiteHeader() {
  const productCategories = await getProductNavTree();
  return <SiteHeaderClient productCategories={productCategories} />;
}
