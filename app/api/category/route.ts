import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";

import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";
import { isValidSlug, isValidSpec } from "@/lib/validators";
import { getCachedCategories, resolveParentCategoryId } from "@/lib/category";

// Auth is enforced by middleware.ts for /api/category/*.

export async function GET(request: NextRequest) {
  try {
    const search = request.nextUrl.searchParams
      .get("search")
      ?.trim()
      .toLowerCase();

    const rows = await getCachedCategories({});
    const data = search
      ? rows.filter((c) => c.title.toLowerCase().includes(search))
      : rows;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error listing categories", error);
    return NextResponse.json(
      { success: false, error: "Failed to list categories." },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => null)) as Record<
      string,
      unknown
    > | null;

    if (!body) {
      return NextResponse.json(
        { success: false, error: "Invalid request body." },
        { status: 400 },
      );
    }

    const { title, slug, description, image_url, parentCategoryId, spec } =
      body;

    if (typeof title !== "string" || !title.trim()) {
      return NextResponse.json(
        { success: false, error: "Title is required." },
        { status: 400 },
      );
    }
    if (typeof slug !== "string" || !isValidSlug(slug)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Slug is required and must be lowercase letters, numbers and hyphens only.",
        },
        { status: 400 },
      );
    }
    if (description !== undefined && typeof description !== "string") {
      return NextResponse.json(
        { success: false, error: "Description must be text." },
        { status: 400 },
      );
    }
    if (image_url !== undefined && typeof image_url !== "string") {
      return NextResponse.json(
        { success: false, error: "Image URL must be text." },
        { status: 400 },
      );
    }
    if (spec !== undefined && spec !== null && !isValidSpec(spec)) {
      return NextResponse.json(
        {
          success: false,
          error: "Specifications must be a flat set of key-value pairs.",
        },
        { status: 400 },
      );
    }

    const [existing] = await db
      .select({ id: categories.id })
      .from(categories)
      .where(eq(categories.slug, slug))
      .limit(1);

    if (existing) {
      return NextResponse.json(
        { success: false, error: "A category with this slug already exists." },
        { status: 409 },
      );
    }

    const parentResult = await resolveParentCategoryId(parentCategoryId);
    if (!parentResult.ok) {
      return NextResponse.json(
        { success: false, error: parentResult.error },
        { status: 400 },
      );
    }

    const [created] = await db
      .insert(categories)
      .values({
        title: title.trim(),
        slug,
        description: description?.trim() || null,
        image_url: image_url?.trim() || null,
        parentCategoryId: parentResult.value,
        spec:
          spec && isValidSpec(spec) && Object.keys(spec).length ? spec : null,
      })
      .returning();

    revalidateTag("categories", "max");

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    console.error("Error creating category", error);
    return NextResponse.json(
      { success: false, error: "Failed to create category." },
      { status: 500 },
    );
  }
}
