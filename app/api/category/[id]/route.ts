import { NextRequest, NextResponse } from "next/server";
import { and, eq, ne } from "drizzle-orm";
import { revalidateTag } from "next/cache";

import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";
import { isValidSlug, isValidSpec, isValidUuid } from "@/lib/validators";
import {
  getCachedCategory,
  hasChildCategories,
  resolveParentCategoryId,
} from "@/lib/category";
import {
  deleteStoragePathRecursive,
  resolveStoragePathWithRelative,
  storageUrlToRelativePath,
} from "@/lib/storage-path";

// Auth is enforced by middleware.ts for /api/category/*.

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  if (!isValidUuid(id)) {
    return NextResponse.json(
      { success: false, error: "Invalid category id." },
      { status: 400 },
    );
  }

  try {
    const category = await getCachedCategory(id);

    if (!category) {
      return NextResponse.json(
        { success: false, error: "Category not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    console.error("Error fetching category", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch category." },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  if (!isValidUuid(id)) {
    return NextResponse.json(
      { success: false, error: "Invalid category id." },
      { status: 400 },
    );
  }

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
      .select()
      .from(categories)
      .where(eq(categories.id, id))
      .limit(1);

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Category not found." },
        { status: 404 },
      );
    }

    const [slugTaken] = await db
      .select({ id: categories.id })
      .from(categories)
      .where(and(eq(categories.slug, slug), ne(categories.id, id)))
      .limit(1);

    if (slugTaken) {
      return NextResponse.json(
        { success: false, error: "A category with this slug already exists." },
        { status: 409 },
      );
    }

    const parentResult = await resolveParentCategoryId(parentCategoryId, id);
    if (!parentResult.ok) {
      return NextResponse.json(
        { success: false, error: parentResult.error },
        { status: 400 },
      );
    }

    const nextImageUrl =
      image_url !== undefined ? (image_url as string).trim() || null : null;

    // If the image changed, best-effort delete the old one. Never block the
    // update on cleanup failure — a stray file is fine, a failed save isn't.
    if (existing.image_url && existing.image_url !== nextImageUrl) {
      const relative = storageUrlToRelativePath(existing.image_url);
      if (relative) {
        const resolved = resolveStoragePathWithRelative(relative);
        if (resolved) {
          deleteStoragePathRecursive(resolved.fullPath).catch((err) =>
            console.warn("Could not delete old category image", err),
          );
        }
      }
    }

    const [updated] = await db
      .update(categories)
      .set({
        title: title.trim(),
        slug,
        description:
          typeof description === "string" ? description.trim() || null : null,
        image_url: nextImageUrl,
        parentCategoryId: parentResult.value,
        spec:
          spec && isValidSpec(spec) && Object.keys(spec).length ? spec : null,
        updatedAt: new Date(),
      })
      .where(eq(categories.id, id))
      .returning();

    revalidateTag("categories", "max");
    revalidateTag(`category:${id}`, "max");

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Error updating category", error);
    return NextResponse.json(
      { success: false, error: "Failed to update category." },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  if (!isValidUuid(id)) {
    return NextResponse.json(
      { success: false, error: "Invalid category id." },
      { status: 400 },
    );
  }

  try {
    if (await hasChildCategories(id)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "This category has subcategories. Reassign or delete them first.",
        },
        { status: 409 },
      );
    }

    const [deleted] = await db
      .delete(categories)
      .where(eq(categories.id, id))
      .returning();

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Category not found." },
        { status: 404 },
      );
    }

    if (deleted.image_url) {
      const relative = storageUrlToRelativePath(deleted.image_url);
      if (relative) {
        const resolved = resolveStoragePathWithRelative(relative);
        if (resolved) {
          deleteStoragePathRecursive(resolved.fullPath).catch((err) =>
            console.warn("Could not delete category image", err),
          );
        }
      }
    }

    revalidateTag("categories", "max");
    revalidateTag(`category:${id}`, "max");

    return NextResponse.json({ success: true, data: deleted });
  } catch (error) {
    console.error("Error deleting category", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete category." },
      { status: 500 },
    );
  }
}
