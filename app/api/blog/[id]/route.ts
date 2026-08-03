import { NextRequest, NextResponse } from "next/server";
import { and, eq, ne } from "drizzle-orm";
import { revalidateTag } from "next/cache";

import { db } from "@/lib/db";
import { blogCategories, blogPosts } from "@/lib/db/schema";
import { isValidSlug, isValidUuid } from "@/lib/validators";
import { getCachedBlogPost } from "@/lib/blog";
import {
  deleteStoragePathRecursive,
  resolveStoragePathWithRelative,
  storageUrlToRelativePath,
} from "@/lib/storage-path";

// Auth is enforced by proxy.ts for /api/blog/*.

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  if (!isValidUuid(id)) {
    return NextResponse.json({ success: false, error: "Invalid blog post id." }, { status: 400 });
  }

  try {
    const post = await getCachedBlogPost(id);
    if (!post) {
      return NextResponse.json({ success: false, error: "Blog post not found." }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: post });
  } catch (error) {
    console.error("Error fetching blog post", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch blog post." },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  if (!isValidUuid(id)) {
    return NextResponse.json({ success: false, error: "Invalid blog post id." }, { status: 400 });
  }

  try {
    const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
    if (!body) {
      return NextResponse.json(
        { success: false, error: "Invalid request body." },
        { status: 400 },
      );
    }

    const {
      title,
      slug,
      categoryId,
      excerpt,
      content,
      coverImage,
      author,
      status,
      publishedAt,
    } = body;

    if (typeof title !== "string" || !title.trim()) {
      return NextResponse.json({ success: false, error: "Title is required." }, { status: 400 });
    }
    if (typeof slug !== "string" || !isValidSlug(slug)) {
      return NextResponse.json(
        {
          success: false,
          error: "Slug is required and must be lowercase letters, numbers and hyphens only.",
        },
        { status: 400 },
      );
    }
    if (typeof categoryId !== "string" || !isValidUuid(categoryId)) {
      return NextResponse.json(
        { success: false, error: "Category is required." },
        { status: 400 },
      );
    }
    const [categoryExists] = await db
      .select({ id: blogCategories.id })
      .from(blogCategories)
      .where(eq(blogCategories.id, categoryId))
      .limit(1);
    if (!categoryExists) {
      return NextResponse.json(
        { success: false, error: "Selected category not found." },
        { status: 400 },
      );
    }
    if (typeof excerpt !== "string" || !excerpt.trim()) {
      return NextResponse.json(
        { success: false, error: "Excerpt is required." },
        { status: 400 },
      );
    }
    if (typeof content !== "string" || !content.trim()) {
      return NextResponse.json(
        { success: false, error: "Content is required." },
        { status: 400 },
      );
    }
    if (status !== undefined && status !== "draft" && status !== "published") {
      return NextResponse.json({ success: false, error: "Invalid status." }, { status: 400 });
    }

    const [existing] = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
    if (!existing) {
      return NextResponse.json({ success: false, error: "Blog post not found." }, { status: 404 });
    }

    const [slugTaken] = await db
      .select({ id: blogPosts.id })
      .from(blogPosts)
      .where(and(eq(blogPosts.slug, slug), ne(blogPosts.id, id)))
      .limit(1);
    if (slugTaken) {
      return NextResponse.json(
        { success: false, error: "A blog post with this slug already exists." },
        { status: 409 },
      );
    }

    const parsedPublishedAt =
      typeof publishedAt === "string" && publishedAt ? new Date(publishedAt) : existing.publishedAt;
    if (Number.isNaN(parsedPublishedAt.getTime())) {
      return NextResponse.json(
        { success: false, error: "Invalid published date." },
        { status: 400 },
      );
    }

    const nextCoverImage =
      typeof coverImage === "string" ? coverImage.trim() || null : null;

    // Best-effort delete of the old cover image if it changed — never block
    // the update on cleanup failure.
    if (existing.coverImage && existing.coverImage !== nextCoverImage) {
      const relative = storageUrlToRelativePath(existing.coverImage);
      if (relative) {
        const resolved = resolveStoragePathWithRelative(relative);
        if (resolved) {
          deleteStoragePathRecursive(resolved.fullPath).catch((err) =>
            console.warn("Could not delete old blog cover image", err),
          );
        }
      }
    }

    const [updated] = await db
      .update(blogPosts)
      .set({
        title: title.trim(),
        slug,
        categoryId,
        excerpt: excerpt.trim(),
        content,
        coverImage: nextCoverImage,
        author: typeof author === "string" && author.trim() ? author.trim() : existing.author,
        status: status === "published" ? "published" : "draft",
        publishedAt: parsedPublishedAt,
        updatedAt: new Date(),
      })
      .where(eq(blogPosts.id, id))
      .returning();

    revalidateTag("blog-posts", "max");
    revalidateTag(`blog-post:${id}`, "max");

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Error updating blog post", error);
    return NextResponse.json(
      { success: false, error: "Failed to update blog post." },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  if (!isValidUuid(id)) {
    return NextResponse.json({ success: false, error: "Invalid blog post id." }, { status: 400 });
  }

  try {
    const [deleted] = await db.delete(blogPosts).where(eq(blogPosts.id, id)).returning();
    if (!deleted) {
      return NextResponse.json({ success: false, error: "Blog post not found." }, { status: 404 });
    }

    if (deleted.coverImage) {
      const relative = storageUrlToRelativePath(deleted.coverImage);
      if (relative) {
        const resolved = resolveStoragePathWithRelative(relative);
        if (resolved) {
          deleteStoragePathRecursive(resolved.fullPath).catch((err) =>
            console.warn("Could not delete blog cover image", err),
          );
        }
      }
    }

    revalidateTag("blog-posts", "max");
    revalidateTag(`blog-post:${id}`, "max");

    return NextResponse.json({ success: true, data: deleted });
  } catch (error) {
    console.error("Error deleting blog post", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete blog post." },
      { status: 500 },
    );
  }
}
