import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";

import { db } from "@/lib/db";
import { categories, products } from "@/lib/db/schema";
import {
  isValidPrice,
  isValidSlug,
  isValidSpec,
  isValidUuid,
} from "@/lib/validators";
import {
  getCachedProductList,
  replaceProductChildren,
  type ProductOptionInput,
  type ProductVariantInput,
  type ProductImageInput,
} from "@/lib/product";

// Auth is enforced by middleware.ts for /api/product/*.

const STATUSES = ["draft", "active", "archived"] as const;
const CHANNELS = ["catalog", "shop"] as const;

export async function GET(request: NextRequest) {
  try {
    const search = request.nextUrl.searchParams.get("search")?.trim().toLowerCase();

    const rows = await getCachedProductList();
    const data = search
      ? rows.filter((r) => r.title.toLowerCase().includes(search))
      : rows;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error listing products", error);
    return NextResponse.json(
      { success: false, error: "Failed to list products." },
      { status: 500 },
    );
  }
}

interface ProductPayload {
  title?: unknown;
  slug?: unknown;
  description?: unknown;
  categoryId?: unknown;
  basePrice?: unknown;
  compareAtPrice?: unknown;
  stockQuantity?: unknown;
  sku?: unknown;
  spec?: unknown;
  status?: unknown;
  channel?: unknown;
  hasVariants?: unknown;
  images?: unknown;
  options?: unknown;
  variants?: unknown;
}

/** Shared validation for both create and update. Returns a typed, clean payload or an error string. */
export function validateProductPayload(body: ProductPayload):
  | {
      ok: true;
      value: {
        title: string;
        slug: string;
        description: string | null;
        categoryId: string;
        basePrice: string | null;
        compareAtPrice: string | null;
        stockQuantity: number;
        sku: string | null;
        spec: Record<string, string> | null;
        status: (typeof STATUSES)[number];
        channel: (typeof CHANNELS)[number];
        hasVariants: boolean;
        images: ProductImageInput[];
        options: ProductOptionInput[];
        variants: ProductVariantInput[];
      };
    }
  | { ok: false; error: string } {
  const {
    title,
    slug,
    description,
    categoryId,
    basePrice,
    compareAtPrice,
    stockQuantity,
    sku,
    spec,
    status,
    channel,
    hasVariants,
    images,
    options,
    variants,
  } = body;

  if (typeof title !== "string" || !title.trim()) {
    return { ok: false, error: "Title is required." };
  }
  if (typeof slug !== "string" || !isValidSlug(slug)) {
    return {
      ok: false,
      error: "Slug is required and must be lowercase letters, numbers and hyphens only.",
    };
  }
  if (typeof categoryId !== "string" || !isValidUuid(categoryId)) {
    return { ok: false, error: "A valid category is required." };
  }
  const resolvedChannel: (typeof CHANNELS)[number] =
    typeof channel === "string" && CHANNELS.includes(channel as never)
      ? (channel as (typeof CHANNELS)[number])
      : "catalog";

  // Catalog products are wholesale/quote-based — no pricing or stock at all
  // (they're informational, sold via a quote request, not this system). Shop
  // products need a fixed price to sell directly.
  let resolvedBasePrice: string | null = null;
  let resolvedCompareAtPrice: string | null = null;
  if (resolvedChannel === "shop") {
    const rawBasePrice = typeof basePrice === "string" ? basePrice.trim() : "";
    if (!rawBasePrice) {
      return { ok: false, error: "Base price is required for shop products." };
    }
    if (!isValidPrice(rawBasePrice)) {
      return { ok: false, error: "Base price must be a valid non-negative number." };
    }
    resolvedBasePrice = rawBasePrice;

    if (
      compareAtPrice !== undefined &&
      compareAtPrice !== null &&
      compareAtPrice !== ""
    ) {
      if (!isValidPrice(compareAtPrice)) {
        return { ok: false, error: "Compare-at price must be a valid non-negative number." };
      }
      resolvedCompareAtPrice = compareAtPrice as string;
    }
  }

  if (spec !== undefined && spec !== null && !isValidSpec(spec)) {
    return { ok: false, error: "Specifications must be a flat set of key-value pairs." };
  }
  if (typeof status !== "string" || !STATUSES.includes(status as never)) {
    return { ok: false, error: "Status must be draft, active or archived." };
  }

  const resolvedImages: ProductImageInput[] = Array.isArray(images)
    ? images
        .filter((img): img is Record<string, unknown> => typeof img === "object" && img !== null)
        .map((img) => ({
          url: String(img.url ?? ""),
          altText: typeof img.altText === "string" ? img.altText : null,
          isPrimary: Boolean(img.isPrimary),
        }))
        .filter((img) => img.url)
    : [];

  // Catalog products never have purchasable variants — they're described by
  // flat specifications instead (see the `spec` field below).
  const resolvedHasVariants = resolvedChannel === "catalog" ? false : Boolean(hasVariants);
  const resolvedOptions: ProductOptionInput[] = [];
  const resolvedVariants: ProductVariantInput[] = [];

  if (resolvedHasVariants) {
    if (!Array.isArray(options) || options.length === 0) {
      return {
        ok: false,
        error: "At least one option (e.g. Color) is required for a product with variants.",
      };
    }
    for (const rawOption of options) {
      if (typeof rawOption !== "object" || rawOption === null) {
        return { ok: false, error: "Invalid option." };
      }
      const name = (rawOption as Record<string, unknown>).name;
      const values = (rawOption as Record<string, unknown>).values;
      if (typeof name !== "string" || !name.trim()) {
        return { ok: false, error: "Every option needs a name." };
      }
      if (!Array.isArray(values) || values.length === 0) {
        return { ok: false, error: `Option "${name}" needs at least one value.` };
      }
      const resolvedValues: ProductOptionInput["values"] = [];
      for (const rawValue of values) {
        if (typeof rawValue !== "object" || rawValue === null) {
          return { ok: false, error: "Invalid option value." };
        }
        const value = (rawValue as Record<string, unknown>).value;
        const priceModifier = (rawValue as Record<string, unknown>).priceModifier;
        if (typeof value !== "string" || !value.trim()) {
          return { ok: false, error: `Option "${name}" has an empty value.` };
        }
        if (
          priceModifier !== undefined &&
          priceModifier !== null &&
          priceModifier !== "" &&
          !isValidPrice(priceModifier)
        ) {
          return { ok: false, error: `Invalid price modifier for "${value}".` };
        }
        resolvedValues.push({
          value: value.trim(),
          priceModifier: typeof priceModifier === "string" ? priceModifier : "0",
        });
      }
      resolvedOptions.push({ name: name.trim(), values: resolvedValues });
    }

    if (!Array.isArray(variants) || variants.length === 0) {
      return { ok: false, error: "At least one variant is required." };
    }
    const optionNames = resolvedOptions.map((o) => o.name);
    const seenCombinations = new Set<string>();
    for (const rawVariant of variants) {
      if (typeof rawVariant !== "object" || rawVariant === null) {
        return { ok: false, error: "Invalid variant." };
      }
      const v = rawVariant as Record<string, unknown>;
      const combination = v.combination;
      if (typeof combination !== "object" || combination === null) {
        return { ok: false, error: "Every variant needs an option combination." };
      }
      const comboEntries = Object.entries(combination as Record<string, unknown>);
      if (comboEntries.length !== optionNames.length) {
        return {
          ok: false,
          error: "Every variant must have a value for each option.",
        };
      }
      const cleanCombo: Record<string, string> = {};
      for (const name of optionNames) {
        const val = (combination as Record<string, unknown>)[name];
        if (typeof val !== "string" || !val.trim()) {
          return { ok: false, error: `Variant is missing a value for "${name}".` };
        }
        cleanCombo[name] = val;
      }
      const fingerprint = JSON.stringify(
        optionNames.map((n) => [n, cleanCombo[n]]),
      );
      if (seenCombinations.has(fingerprint)) {
        return { ok: false, error: "Duplicate variant combination found." };
      }
      seenCombinations.add(fingerprint);

      if (!isValidPrice(v.price)) {
        return { ok: false, error: "Every variant needs a valid price." };
      }
      if (
        v.compareAtPrice !== undefined &&
        v.compareAtPrice !== null &&
        v.compareAtPrice !== "" &&
        !isValidPrice(v.compareAtPrice)
      ) {
        return { ok: false, error: "Invalid variant compare-at price." };
      }
      const stockQuantity =
        typeof v.stockQuantity === "number" && Number.isFinite(v.stockQuantity)
          ? Math.max(0, Math.trunc(v.stockQuantity))
          : 0;
      if (v.spec !== undefined && v.spec !== null && !isValidSpec(v.spec)) {
        return { ok: false, error: "Invalid variant specifications." };
      }

      resolvedVariants.push({
        combination: cleanCombo,
        sku: typeof v.sku === "string" ? v.sku.trim() || null : null,
        price: v.price as string,
        compareAtPrice: (v.compareAtPrice as string) || null,
        stockQuantity,
        weight: (v.weight as string) || null,
        imageUrl: typeof v.imageUrl === "string" ? v.imageUrl : null,
        spec: (v.spec as Record<string, string>) || null,
        isActive: v.isActive === undefined ? true : Boolean(v.isActive),
      });
    }
  }

  const resolvedStockQuantity =
    resolvedChannel === "catalog"
      ? 0
      : typeof stockQuantity === "number" && Number.isFinite(stockQuantity)
        ? Math.max(0, Math.trunc(stockQuantity))
        : 0;

  return {
    ok: true,
    value: {
      title: title.trim(),
      slug,
      description: typeof description === "string" ? description.trim() || null : null,
      categoryId,
      basePrice: resolvedBasePrice,
      compareAtPrice: resolvedCompareAtPrice,
      stockQuantity: resolvedStockQuantity,
      sku: typeof sku === "string" ? sku.trim() || null : null,
      spec: spec && isValidSpec(spec) && Object.keys(spec).length ? spec : null,
      status: status as (typeof STATUSES)[number],
      channel: resolvedChannel,
      hasVariants: resolvedHasVariants,
      images: resolvedImages,
      options: resolvedOptions,
      variants: resolvedVariants,
    },
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => null)) as ProductPayload | null;
    if (!body) {
      return NextResponse.json({ success: false, error: "Invalid request body." }, { status: 400 });
    }

    const result = validateProductPayload(body);
    if (!result.ok) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }
    const value = result.value;

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
      .where(eq(products.slug, value.slug))
      .limit(1);
    if (slugTaken) {
      return NextResponse.json(
        { success: false, error: "A product with this slug already exists." },
        { status: 409 },
      );
    }

    const [created] = await db
      .insert(products)
      .values({
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
      })
      .returning();

    await replaceProductChildren(created.id, {
      images: value.images,
      options: value.options,
      variants: value.variants,
    });

    revalidateTag("products", "max");

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    console.error("Error creating product", error);
    return NextResponse.json({ success: false, error: "Failed to create product." }, { status: 500 });
  }
}
