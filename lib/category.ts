import { desc, eq, count } from "drizzle-orm";
import { unstable_cache } from "next/cache";

import { db } from "@/lib/db";
import { categories, products } from "@/lib/db/schema";
import { isValidUuid } from "@/lib/validators";

// ---------- Cached reads ----------
// Tagged with "categories" (list-level) plus a per-id tag for single-record
// reads, so a create/update/delete only needs to call revalidateTag with the
// tags it actually affects (see app/api/category/**/route.ts).

export const getCachedCategories = unstable_cache(
  async ({ limit }: { limit?: number }) => {
    const query = db
      .select({
        id: categories.id,
        title: categories.title,
        slug: categories.slug,
        description: categories.description,
        image_url: categories.image_url,
        parentCategoryId: categories.parentCategoryId,
        spec: categories.spec,
        createdAt: categories.createdAt,
        updatedAt: categories.updatedAt,
        productCount: count(products.id),
      })
      .from(categories)
      .leftJoin(products, eq(categories.id, products.categoryId))
      .groupBy(categories.id)
      .orderBy(desc(categories.createdAt));

    if (limit) {
      query.limit(limit);
    }

    const rows = await query;

    console.log(rows, "rows in getcachedcategories");

    // Dates aren't JSON-safe across a cache round-trip — normalize at the source.
    return rows.map((c) => ({
      ...c,
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
    }));
  },
  ["categories-list"],
  { tags: ["categories"] },
);

export const getCachedCategoryOptions = unstable_cache(
  async () =>
    db.select({ id: categories.id, title: categories.title }).from(categories),
  ["categories-options"],
  { tags: ["categories"] },
);

export function getCachedCategory(id: string) {
  return unstable_cache(
    async () => {
      const [category] = await db
        .select()
        .from(categories)
        .where(eq(categories.id, id))
        .limit(1);
      return category ?? null;
    },
    ["category", id],
    { tags: ["categories", `category:${id}`] },
  )();
}

export function getCachedCategoryBySlug(slug: string) {
  return unstable_cache(
    async () => {
      const [category] = await db
        .select()
        .from(categories)
        .where(eq(categories.slug, slug))
        .limit(1);
      return category ?? null;
    },
    ["category-slug", slug],
    { tags: ["categories", `category-slug:${slug}`] },
  )();
}

/** Direct children of a category — powers the hub-view subcategory cards on its public page. */
export function getCachedChildCategories(categoryId: string) {
  return unstable_cache(
    async () =>
      db
        .select({
          id: categories.id,
          title: categories.title,
          slug: categories.slug,
          image_url: categories.image_url,
          description: categories.description,
          productCount: count(products.id),
        })
        .from(categories)
        .leftJoin(products, eq(categories.id, products.categoryId))
        .where(eq(categories.parentCategoryId, categoryId))
        .groupBy(categories.id),
    ["category-children", categoryId],
    { tags: ["categories", "products", `category-children:${categoryId}`] },
  )();
}

/**
 * Resolve a requested parent category id: validates it exists and that
 * assigning it wouldn't create a cycle (self-parent or an ancestor loop).
 * Pass `excludeId` (the category being edited) when updating.
 */
export async function resolveParentCategoryId(
  rawParentId: unknown,
  excludeId?: string,
): Promise<{ ok: true; value: string | null } | { ok: false; error: string }> {
  if (rawParentId === undefined || rawParentId === null || rawParentId === "") {
    return { ok: true, value: null };
  }
  if (typeof rawParentId !== "string" || !isValidUuid(rawParentId)) {
    return { ok: false, error: "Invalid parent category." };
  }
  if (excludeId && rawParentId === excludeId) {
    return { ok: false, error: "A category cannot be its own parent." };
  }

  const all = await db
    .select({
      id: categories.id,
      parentCategoryId: categories.parentCategoryId,
    })
    .from(categories);

  const found = all.some((c) => c.id === rawParentId);
  if (!found) {
    return { ok: false, error: "Parent category not found." };
  }

  if (excludeId) {
    const parentMap = new Map(all.map((c) => [c.id, c.parentCategoryId]));
    let cursor: string | null = rawParentId;
    const seen = new Set<string>();
    while (cursor) {
      if (cursor === excludeId) {
        return {
          ok: false,
          error: "This would create a circular category hierarchy.",
        };
      }
      if (seen.has(cursor)) break;
      seen.add(cursor);
      cursor = parentMap.get(cursor) ?? null;
    }
  }

  return { ok: true, value: rawParentId };
}

/** True if any category currently lists `id` as its parent. */
export async function hasChildCategories(id: string): Promise<boolean> {
  const [child] = await db
    .select({ id: categories.id })
    .from(categories)
    .where(eq(categories.parentCategoryId, id))
    .limit(1);
  return Boolean(child);
}
