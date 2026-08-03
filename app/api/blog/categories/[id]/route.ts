import { NextRequest, NextResponse } from "next/server";
import { and, eq, ne } from "drizzle-orm";
import { revalidateTag } from "next/cache";

import { db } from "@/lib/db";
import { blogCategories } from "@/lib/db/schema";
import { isValidSlug, isValidUuid } from "@/lib/validators";
import { getCachedBlogCategory, hasBlogPostsInCategory } from "@/lib/blog";

// Auth is enforced by proxy.ts for /api/blog/*.

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  if (!isValidUuid(id)) {
    return NextResponse.json(
      { success: false, error: "Invalid blog category id." },
      { status: 400 },
    );
  }

  try {
    const category = await getCachedBlogCategory(id);
    if (!category) {
      return NextResponse.json(
        { success: false, error: "Blog category not found." },
        { status: 404 },
      );
    }
    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    console.error("Error fetching blog category", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch blog category." },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  if (!isValidUuid(id)) {
    return NextResponse.json(
      { success: false, error: "Invalid blog category id." },
      { status: 400 },
    );
  }

  try {
    const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
    if (!body) {
      return NextResponse.json(
        { success: false, error: "Invalid request body." },
        { status: 400 },
      );
    }

    const { title, slug } = body;

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

    const [existing] = await db
      .select({ id: blogCategories.id })
      .from(blogCategories)
      .where(eq(blogCategories.id, id))
      .limit(1);
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Blog category not found." },
        { status: 404 },
      );
    }

    const [slugTaken] = await db
      .select({ id: blogCategories.id })
      .from(blogCategories)
      .where(and(eq(blogCategories.slug, slug), ne(blogCategories.id, id)))
      .limit(1);
    if (slugTaken) {
      return NextResponse.json(
        { success: false, error: "A blog category with this slug already exists." },
        { status: 409 },
      );
    }

    const [updated] = await db
      .update(blogCategories)
      .set({ title: title.trim(), slug, updatedAt: new Date() })
      .where(eq(blogCategories.id, id))
      .returning();

    revalidateTag("blog-categories", "max");
    revalidateTag(`blog-category:${id}`, "max");
    // Post listings/detail queries embed the category title/slug, so any
    // cached post pages need to see the rename too.
    revalidateTag("blog-posts", "max");

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Error updating blog category", error);
    return NextResponse.json(
      { success: false, error: "Failed to update blog category." },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  if (!isValidUuid(id)) {
    return NextResponse.json(
      { success: false, error: "Invalid blog category id." },
      { status: 400 },
    );
  }

  try {
    if (await hasBlogPostsInCategory(id)) {
      return NextResponse.json(
        {
          success: false,
          error: "This category has blog posts. Reassign or delete them first.",
        },
        { status: 409 },
      );
    }

    const [deleted] = await db
      .delete(blogCategories)
      .where(eq(blogCategories.id, id))
      .returning();
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Blog category not found." },
        { status: 404 },
      );
    }

    revalidateTag("blog-categories", "max");
    revalidateTag(`blog-category:${id}`, "max");

    return NextResponse.json({ success: true, data: deleted });
  } catch (error) {
    console.error("Error deleting blog category", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete blog category." },
      { status: 500 },
    );
  }
}
