import { NextRequest, NextResponse } from "next/server";
import { and, eq, ne } from "drizzle-orm";
import { revalidateTag } from "next/cache";

import { db } from "@/lib/db";
import { categories, products } from "@/lib/db/schema";
import { isValidUuid } from "@/lib/validators";
import {
  getCachedProduct,
  replaceProductChildren,
} from "@/lib/product";
import { validateProductPayload } from "@/app/api/product/route";

// Auth is enforced by middleware.ts for /api/product/*.

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  if (!isValidUuid(id)) {
    return NextResponse.json({ success: false, error: "Invalid product id." }, { status: 400 });
  }

  try {
    const product = await getCachedProduct(id);
    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found." }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error("Error fetching product", error);
    return NextResponse.json({ success: false, error: "Failed to fetch product." }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  if (!isValidUuid(id)) {
    return NextResponse.json({ success: false, error: "Invalid product id." }, { status: 400 });
  }

  try {
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ success: false, error: "Invalid request body." }, { status: 400 });
    }

    const result = validateProductPayload(body);
    if (!result.ok) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }
    const value = result.value;

    const [existing] = await db.select().from(products).where(eq(products.id, id)).limit(1);
    if (!existing) {
      return NextResponse.json({ success: false, error: "Product not found." }, { status: 404 });
    }

    const [category] = await db
      .select({ id: categories.id })
      .from(categories)
      .where(eq(categories.id, value.categoryId))
      .limit(1);
    if (!category) {
      return NextResponse.json({ success: false, error: "Category not found." }, { status: 400 });
    }

    const [slugTaken] = await db
      .select({ id: products.id })
      .from(products)
      .where(and(eq(products.slug, value.slug), ne(products.id, id)))
      .limit(1);
    if (slugTaken) {
      return NextResponse.json(
        { success: false, error: "A product with this slug already exists." },
        { status: 409 },
      );
    }

    const [updated] = await db
      .update(products)
      .set({
        title: value.title,
        slug: value.slug,
        description: value.description,
        categoryId: value.categoryId,
        basePrice: value.basePrice,
        compareAtPrice: value.compareAtPrice,
        stockQuantity: value.stockQuantity,
        sku: value.sku,
        spec: value.spec,
        status: value.status,
        channel: value.channel,
        hasVariants: value.hasVariants,
        updatedAt: new Date(),
      })
      .where(eq(products.id, id))
      .returning();

    await replaceProductChildren(id, {
      images: value.images,
      options: value.options,
      variants: value.variants,
    });

    revalidateTag("products", "max");
    revalidateTag(`product:${id}`, "max");

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Error updating product", error);
    return NextResponse.json({ success: false, error: "Failed to update product." }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  if (!isValidUuid(id)) {
    return NextResponse.json({ success: false, error: "Invalid product id." }, { status: 400 });
  }

  try {
    // Cascades: images, options -> values, variants, and variant<->value
    // links are all declared ON DELETE CASCADE from products/options/variants.
    const [deleted] = await db.delete(products).where(eq(products.id, id)).returning();

    if (!deleted) {
      return NextResponse.json({ success: false, error: "Product not found." }, { status: 404 });
    }

    revalidateTag("products", "max");
    revalidateTag(`product:${id}`, "max");

    return NextResponse.json({ success: true, data: deleted });
  } catch (error) {
    console.error("Error deleting product", error);
    return NextResponse.json({ success: false, error: "Failed to delete product." }, { status: 500 });
  }
}
