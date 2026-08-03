import { and, desc, eq, lte, ne } from "drizzle-orm";
import { unstable_cache } from "next/cache";

import { db } from "@/lib/db";
import { blogCategories, blogPosts } from "@/lib/db/schema";

const WORDS_PER_MINUTE = 200;

/** Plain-text word count from stored HTML, rounded up to a whole minute (min 1). */
export function estimateReadingTime(html: string): string {
  const text = html.replace(/<[^>]*>/g, " ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / WORDS_PER_MINUTE));
  return `${minutes} min read`;
}

function serializeDates<
  T extends { createdAt: Date; updatedAt: Date; publishedAt: Date },
>(row: T) {
  return {
    ...row,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    publishedAt: row.publishedAt.toISOString(),
  };
}

const postWithCategoryColumns = {
  id: blogPosts.id,
  title: blogPosts.title,
  slug: blogPosts.slug,
  categoryId: blogPosts.categoryId,
  categoryTitle: blogCategories.title,
  categorySlug: blogCategories.slug,
  excerpt: blogPosts.excerpt,
  content: blogPosts.content,
  coverImage: blogPosts.coverImage,
  author: blogPosts.author,
  status: blogPosts.status,
  publishedAt: blogPosts.publishedAt,
  createdAt: blogPosts.createdAt,
  updatedAt: blogPosts.updatedAt,
};

// ---------- Admin reads (any status) ----------

export const getCachedBlogPosts = unstable_cache(
  async () => {
    const rows = await db
      .select(postWithCategoryColumns)
      .from(blogPosts)
      .innerJoin(blogCategories, eq(blogPosts.categoryId, blogCategories.id))
      .orderBy(desc(blogPosts.createdAt));
    return rows.map(serializeDates);
  },
  ["blog-posts-list"],
  { tags: ["blog-posts", "blog-categories"] },
);

export function getCachedBlogPost(id: string) {
  return unstable_cache(
    async () => {
      const [post] = await db
        .select(postWithCategoryColumns)
        .from(blogPosts)
        .innerJoin(blogCategories, eq(blogPosts.categoryId, blogCategories.id))
        .where(eq(blogPosts.id, id))
        .limit(1);
      return post ? serializeDates(post) : null;
    },
    ["blog-post", id],
    { tags: ["blog-posts", "blog-categories", `blog-post:${id}`] },
  )();
}

// ---------- Public reads (published + past publishedAt only) ----------

export const getCachedPublishedBlogPosts = unstable_cache(
  async () => {
    const rows = await db
      .select(postWithCategoryColumns)
      .from(blogPosts)
      .innerJoin(blogCategories, eq(blogPosts.categoryId, blogCategories.id))
      .where(
        and(
          eq(blogPosts.status, "published"),
          lte(blogPosts.publishedAt, new Date()),
        ),
      )
      .orderBy(desc(blogPosts.publishedAt));
    return rows.map(serializeDates);
  },
  ["blog-posts-published"],
  { tags: ["blog-posts", "blog-categories"] },
);

export function getCachedPublishedBlogPostBySlug(slug: string) {
  return unstable_cache(
    async () => {
      const [post] = await db
        .select(postWithCategoryColumns)
        .from(blogPosts)
        .innerJoin(blogCategories, eq(blogPosts.categoryId, blogCategories.id))
        .where(
          and(
            eq(blogPosts.slug, slug),
            eq(blogPosts.status, "published"),
            lte(blogPosts.publishedAt, new Date()),
          ),
        )
        .limit(1);
      return post ? serializeDates(post) : null;
    },
    ["blog-post-slug", slug],
    { tags: ["blog-posts", "blog-categories", `blog-post-slug:${slug}`] },
  )();
}

/** Up to `limit` other published posts, preferring the same category. */
export function getCachedRelatedBlogPosts(
  postId: string,
  categoryId: string,
  limit = 3,
) {
  return unstable_cache(
    async () => {
      const rows = await db
        .select(postWithCategoryColumns)
        .from(blogPosts)
        .innerJoin(blogCategories, eq(blogPosts.categoryId, blogCategories.id))
        .where(
          and(
            eq(blogPosts.status, "published"),
            lte(blogPosts.publishedAt, new Date()),
            ne(blogPosts.id, postId),
          ),
        )
        .orderBy(desc(blogPosts.publishedAt))
        .limit(limit * 3);
      // Same-category posts first, then most recent — done in JS since the
      // candidate pool (limit * 3) is already small.
      const sorted = rows.sort(
        (a: { categoryId: string }, b: { categoryId: string }) => {
          const aMatch = a.categoryId === categoryId ? 0 : 1;
          const bMatch = b.categoryId === categoryId ? 0 : 1;
          return aMatch - bMatch;
        },
      );
      return sorted.slice(0, limit).map(serializeDates);
    },
    ["blog-posts-related", postId, categoryId, String(limit)],
    { tags: ["blog-posts", "blog-categories"] },
  )();
}

// ---------- Blog categories ----------

export const getCachedBlogCategories = unstable_cache(
  async () => {
    const rows = await db
      .select()
      .from(blogCategories)
      .orderBy(desc(blogCategories.createdAt));
    return rows.map((c) => ({
      ...c,
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
    }));
  },
  ["blog-categories-list"],
  { tags: ["blog-categories"] },
);

export const getCachedBlogCategoryOptions = unstable_cache(
  async () =>
    db
      .select({ id: blogCategories.id, title: blogCategories.title })
      .from(blogCategories),
  ["blog-categories-options"],
  { tags: ["blog-categories"] },
);

export function getCachedBlogCategory(id: string) {
  return unstable_cache(
    async () => {
      const [category] = await db
        .select()
        .from(blogCategories)
        .where(eq(blogCategories.id, id))
        .limit(1);
      return category ?? null;
    },
    ["blog-category", id],
    { tags: ["blog-categories", `blog-category:${id}`] },
  )();
}

export function getCachedBlogCategoryBySlug(slug: string) {
  return unstable_cache(
    async () => {
      const [category] = await db
        .select()
        .from(blogCategories)
        .where(eq(blogCategories.slug, slug))
        .limit(1);
      return category ?? null;
    },
    ["blog-category-slug", slug],
    { tags: ["blog-categories", `blog-category-slug:${slug}`] },
  )();
}

/** True if any blog post currently uses this category — blocks deletion. */
export async function hasBlogPostsInCategory(
  categoryId: string,
): Promise<boolean> {
  const [post] = await db
    .select({ id: blogPosts.id })
    .from(blogPosts)
    .where(eq(blogPosts.categoryId, categoryId))
    .limit(1);
  return Boolean(post);
}
