import { getCachedCategories } from "@/lib/category";
import { getCatalogNavProducts } from "@/lib/product";

export interface ProductNavProduct {
  id: string;
  label: string;
  href: string;
}

export interface ProductNavNode {
  id: string;
  label: string;
  slug: string;
  href: string;
  children: ProductNavNode[];
  /** This category's own channel="catalog" products (not from subcategories). */
  products: ProductNavProduct[];
}

/**
 * Builds the full category tree (any depth, driven by parentCategoryId) for
 * the storefront "Products" nav dropdown, with each category's own catalog
 * products attached underneath it. Backed by the same cached/tagged reads
 * used by the admin panel, so it stays in sync automatically — see
 * revalidateTag("categories"/"products") in app/api/category|product/**.
 */
export async function getProductNavTree(): Promise<ProductNavNode[]> {
  const [categories, catalogProducts] = await Promise.all([
    getCachedCategories({}),
    getCatalogNavProducts(),
  ]);

  const nodeById = new Map<string, ProductNavNode>();
  for (const c of categories) {
    nodeById.set(c.id, {
      id: c.id,
      label: c.title,
      slug: c.slug,
      href: `/${c.slug}`,
      children: [],
      products: [],
    });
  }

  for (const p of catalogProducts) {
    const node = nodeById.get(p.categoryId);
    if (node) {
      node.products.push({ id: p.id, label: p.title, href: node.href });
    }
  }

  const roots: ProductNavNode[] = [];
  for (const c of categories) {
    const node = nodeById.get(c.id);
    if (!node) continue;
    const parent = c.parentCategoryId ? nodeById.get(c.parentCategoryId) : undefined;
    if (parent) {
      parent.children.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}
