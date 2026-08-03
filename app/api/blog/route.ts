import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";

import { db } from "@/lib/db";
import { blogCategories, blogPosts } from "@/lib/db/schema";
import { isValidSlug, isValidUuid } from "@/lib/validators";
import { getCachedBlogPosts } from "@/lib/blog";

// Auth is enforced by proxy.ts for /api/blog/*.

export async function GET(request: NextRequest) {
  try {
    const search = request.nextUrl.searchParams.get("search")?.trim().toLowerCase();

    const rows = await getCachedBlogPosts();
    const data = search
      ? rows.filter((p) => p.title.toLowerCase().includes(search))
      : rows;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error listing blog posts", error);
    return NextResponse.json(
      { success: false, error: "Failed to list blog posts." },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
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

    const [existing] = await db
      .select({ id: blogPosts.id })
      .from(blogPosts)
      .where(eq(blogPosts.slug, slug))
      .limit(1);

    if (existing) {
      return NextResponse.json(
        { success: false, error: "A blog post with this slug already exists." },
        { status: 409 },
      );
    }

    const parsedPublishedAt =
      typeof publishedAt === "string" && publishedAt ? new Date(publishedAt) : new Date();
    if (Number.isNaN(parsedPublishedAt.getTime())) {
      return NextResponse.json(
        { success: false, error: "Invalid published date." },
        { status: 400 },
      );
    }

    const [created] = await db
      .insert(blogPosts)
      .values({
        title: title.trim(),
        slug,
        categoryId,
        excerpt: excerpt.trim(),
        content,
        coverImage: typeof coverImage === "string" ? coverImage.trim() || null : null,
        author: typeof author === "string" && author.trim() ? author.trim() : undefined,
        status: status === "published" ? "published" : "draft",
        publishedAt: parsedPublishedAt,
      })
      .returning();

    revalidateTag("blog-posts", "max");

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    console.error("Error creating blog post", error);
    return NextResponse.json(
      { success: false, error: "Failed to create blog post." },
      { status: 500 },
    );
  }
}
