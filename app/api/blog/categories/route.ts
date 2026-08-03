import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";

import { db } from "@/lib/db";
import { blogCategories } from "@/lib/db/schema";
import { isValidSlug } from "@/lib/validators";
import { getCachedBlogCategories } from "@/lib/blog";

// Auth is enforced by proxy.ts for /api/blog/*.

export async function GET() {
  try {
    const data = await getCachedBlogCategories();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error listing blog categories", error);
    return NextResponse.json(
      { success: false, error: "Failed to list blog categories." },
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
      .where(eq(blogCategories.slug, slug))
      .limit(1);

    if (existing) {
      return NextResponse.json(
        { success: false, error: "A blog category with this slug already exists." },
        { status: 409 },
      );
    }

    const [created] = await db
      .insert(blogCategories)
      .values({ title: title.trim(), slug })
      .returning();

    revalidateTag("blog-categories", "max");

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    console.error("Error creating blog category", error);
    return NextResponse.json(
      { success: false, error: "Failed to create blog category." },
      { status: 500 },
    );
  }
}
