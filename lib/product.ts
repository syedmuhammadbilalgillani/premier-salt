import { and, asc, desc, eq, inArray } from "drizzle-orm";
import { unstable_cache } from "next/cache";

import { db } from "@/lib/db";
import {
  categories,
  productImages,
  productOptionValues,
  productOptions,
  productVariantOptionValues,
  productVariants,
  products,
} from "@/lib/db/schema";

export interface ProductImageInput {
  url: string;
  altText?: string | null;
  isPrimary?: boolean;
}

export interface ProductOptionValueInput {
  value: string;
  priceModifier?: string;
}

export interface ProductOptionInput {
  name: string;
  values: ProductOptionValueInput[];
}

export interface ProductVariantInput {
  /** Option name -> selected value text, must cover every submitted option. */
  combination: Record<string, string>;
  sku?: string | null;
  price: string;
  compareAtPrice?: string | null;
  stockQuantity?: number;
  weight?: string | null;
  imageUrl?: string | null;
  spec?: Record<string, string> | null;
  isActive?: boolean;
}

/** Listing row: product core fields + category title + primary image + variant rollups. */
async function getProductListData() {
  const rows = await db
    .select({
      id: products.id,
      title: products.title,
      slug: products.slug,
      sku: products.sku,
      basePrice: products.basePrice,
      compareAtPrice: products.compareAtPrice,
      stockQuantity: products.stockQuantity,
      hasVariants: products.hasVariants,
      status: products.status,
      createdAt: products.createdAt,
      categoryTitle: categories.title,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .orderBy(desc(products.createdAt));

  const ids = rows.map((r) => r.id);

  const primaryImages = ids.length
    ? await db
        .select({ productId: productImages.productId, url: productImages.url })
        .from(productImages)
        .where(inArray(productImages.productId, ids))
        .orderBy(desc(productImages.isPrimary))
    : [];
  const imageByProductId = new Map<string, string>();
  for (const img of primaryImages) {
    if (!imageByProductId.has(img.productId)) imageByProductId.set(img.productId, img.url);
  }

  const variantStats = ids.length
    ? await db
        .select({
          productId: productVariants.productId,
          price: productVariants.price,
          stockQuantity: productVariants.stockQuantity,
        })
        .from(productVariants)
        .where(inArray(productVariants.productId, ids))
    : [];
  const statsByProductId = new Map<
    string,
    { minPrice: number; maxPrice: number; totalStock: number }
  >();
  for (const v of variantStats) {
    const price = Number(v.price);
    const current = statsByProductId.get(v.productId);
    if (!current) {
      statsByProductId.set(v.productId, { minPrice: price, maxPrice: price, totalStock: v.stockQuantity });
    } else {
      current.minPrice = Math.min(current.minPrice, price);
      current.maxPrice = Math.max(current.maxPrice, price);
      current.totalStock += v.stockQuantity;
    }
  }

  // Dates aren't JSON-safe across a cache round-trip — normalize at the source.
  return rows.map((row) => ({
    ...row,
    createdAt: row.createdAt.toISOString(),
    imageUrl: imageByProductId.get(row.id) ?? null,
    variantStats: statsByProductId.get(row.id) ?? null,
  }));
}

// ---------- Cached reads ----------
// Tagged with "products" (list-level) plus a per-id tag for single-record
// reads. The list also carries the "categories" tag since it displays each
// product's category title.

export const getCachedProductList = unstable_cache(getProductListData, ["products-list"], {
  tags: ["products", "categories"],
});

export function getCachedProduct(id: string) {
  return unstable_cache(() => getFullProduct(id), ["product", id], {
    tags: ["products", `product:${id}`],
  })();
}

export interface CatalogProduct {
  id: string;
  title: string;
  slug: string;
  sku: string | null;
  /** e.g. { "Size": "500g", "Packing": "Pouch" } — drives the category
   *  page's dynamic table columns. Catalog products don't have variants;
   *  this is the only source of size/packing-type info for them. */
  spec: Record<string, string> | null;
  imageUrl: string | null;
}

/**
 * Products for a category's public page — only channel="catalog", status="active".
 * "shop" products stay linked to the category but never appear here.
 */
async function getCatalogProductsForCategoryData(
  categoryId: string,
): Promise<CatalogProduct[]> {
  const rows = await db
    .select({
      id: products.id,
      title: products.title,
      slug: products.slug,
      sku: products.sku,
      spec: products.spec,
    })
    .from(products)
    .where(
      and(
        eq(products.categoryId, categoryId),
        eq(products.channel, "catalog"),
        eq(products.status, "active"),
      ),
    )
    .orderBy(asc(products.title));

  const ids = rows.map((r) => r.id);
  if (!ids.length) return [];

  const primaryImages = await db
    .select({ productId: productImages.productId, url: productImages.url })
    .from(productImages)
    .where(inArray(productImages.productId, ids))
    .orderBy(desc(productImages.isPrimary));
  const imageByProductId = new Map<string, string>();
  for (const img of primaryImages) {
    if (!imageByProductId.has(img.productId)) {
      imageByProductId.set(img.productId, img.url);
    }
  }

  return rows.map((row) => ({
    ...row,
    imageUrl: imageByProductId.get(row.id) ?? null,
  }));
}

export function getCatalogProductsForCategory(categoryId: string) {
  return unstable_cache(
    () => getCatalogProductsForCategoryData(categoryId),
    ["catalog-products", categoryId],
    { tags: ["products", "categories", `category-products:${categoryId}`] },
  )();
}

export interface CatalogNavProduct {
  id: string;
  title: string;
  slug: string;
  categoryId: string;
}

/**
 * All channel="catalog", status="active" products, id/title/slug/categoryId
 * only — powers the storefront "Products" nav dropdown, which lists each
 * category's own products alongside its subcategories.
 */
async function getCatalogNavProductsData(): Promise<CatalogNavProduct[]> {
  return db
    .select({
      id: products.id,
      title: products.title,
      slug: products.slug,
      categoryId: products.categoryId,
    })
    .from(products)
    .where(and(eq(products.channel, "catalog"), eq(products.status, "active")))
    .orderBy(asc(products.title));
}

export const getCatalogNavProducts = unstable_cache(
  getCatalogNavProductsData,
  ["catalog-nav-products"],
  { tags: ["products"] },
);

export interface ShopProductVariant {
  id: string;
  sku: string | null;
  price: number;
  compareAtPrice: number | null;
  stockQuantity: number;
  imageUrl: string | null;
  /** e.g. { "Packaging": "1kg Jar" } */
  combination: Record<string, string>;
}

export interface ShopProduct {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  sku: string | null;
  basePrice: number | null;
  compareAtPrice: number | null;
  stockQuantity: number;
  hasVariants: boolean;
  spec: Record<string, string> | null;
  categoryId: string;
  categoryTitle: string | null;
  categorySlug: string | null;
  images: { url: string; altText: string | null; isPrimary: boolean }[];
  variants: ShopProductVariant[];
}

/**
 * Products for the direct-purchase /shop module — only channel="shop",
 * status="active". Carries full pricing/stock/variant data (unlike the
 * catalog read, which deliberately omits price).
 */
async function getShopProductsData(): Promise<ShopProduct[]> {
  const rows = await db
    .select({
      id: products.id,
      title: products.title,
      slug: products.slug,
      description: products.description,
      sku: products.sku,
      basePrice: products.basePrice,
      compareAtPrice: products.compareAtPrice,
      stockQuantity: products.stockQuantity,
      hasVariants: products.hasVariants,
      spec: products.spec,
      categoryId: products.categoryId,
      categoryTitle: categories.title,
      categorySlug: categories.slug,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(and(eq(products.channel, "shop"), eq(products.status, "active")))
    .orderBy(desc(products.createdAt));

  const ids = rows.map((r) => r.id);
  if (!ids.length) return [];

  const images = await db
    .select()
    .from(productImages)
    .where(inArray(productImages.productId, ids))
    .orderBy(asc(productImages.position));
  const imagesByProductId = new Map<string, typeof images>();
  for (const img of images) {
    const list = imagesByProductId.get(img.productId) ?? [];
    list.push(img);
    imagesByProductId.set(img.productId, list);
  }

  const options = await db
    .select()
    .from(productOptions)
    .where(inArray(productOptions.productId, ids))
    .orderBy(asc(productOptions.position));
  const optionIds = options.map((o) => o.id);
  const values = optionIds.length
    ? await db
        .select()
        .from(productOptionValues)
        .where(inArray(productOptionValues.optionId, optionIds))
    : [];
  const valueById = new Map(values.map((v) => [v.id, v]));
  const optionNameById = new Map(options.map((o) => [o.id, o.name]));

  const variants = await db
    .select()
    .from(productVariants)
    .where(inArray(productVariants.productId, ids))
    .orderBy(asc(productVariants.createdAt));
  const variantIds = variants.map((v) => v.id);
  const links = variantIds.length
    ? await db
        .select()
        .from(productVariantOptionValues)
        .where(inArray(productVariantOptionValues.variantId, variantIds))
    : [];

  const variantsByProductId = new Map<string, ShopProductVariant[]>();
  for (const variant of variants) {
    const combination: Record<string, string> = {};
    for (const link of links) {
      if (link.variantId !== variant.id) continue;
      const value = valueById.get(link.optionValueId);
      if (!value) continue;
      const optionName = optionNameById.get(value.optionId);
      if (optionName) combination[optionName] = value.value;
    }
    const list = variantsByProductId.get(variant.productId) ?? [];
    list.push({
      id: variant.id,
      sku: variant.sku,
      price: Number(variant.price),
      compareAtPrice: variant.compareAtPrice ? Number(variant.compareAtPrice) : null,
      stockQuantity: variant.stockQuantity,
      imageUrl: variant.imageUrl,
      combination,
    });
    variantsByProductId.set(variant.productId, list);
  }

  return rows.map((row) => ({
    ...row,
    basePrice: row.basePrice ? Number(row.basePrice) : null,
    compareAtPrice: row.compareAtPrice ? Number(row.compareAtPrice) : null,
    images: (imagesByProductId.get(row.id) ?? []).map((img) => ({
      url: img.url,
      altText: img.altText,
      isPrimary: img.isPrimary,
    })),
    variants: variantsByProductId.get(row.id) ?? [],
  }));
}

export const getShopProducts = unstable_cache(getShopProductsData, ["shop-products"], {
  tags: ["products", "categories"],
});

export function getShopProductBySlug(slug: string) {
  return unstable_cache(
    async () => {
      const all = await getShopProductsData();
      return all.find((p) => p.slug === slug) ?? null;
    },
    ["shop-product", slug],
    { tags: ["products", "categories", `product-slug:${slug}`] },
  )();
}

/** Full product read model used by the edit page and the detail API. */
export async function getFullProduct(id: string) {
  const [product] = await db.select().from(products).where(eq(products.id, id)).limit(1);
  if (!product) return null;

  const images = await db
    .select()
    .from(productImages)
    .where(eq(productImages.productId, id))
    .orderBy(asc(productImages.position));

  const options = await db
    .select()
    .from(productOptions)
    .where(eq(productOptions.productId, id))
    .orderBy(asc(productOptions.position));

  const optionIds = options.map((o) => o.id);
  const values = optionIds.length
    ? await db
        .select()
        .from(productOptionValues)
        .where(inArray(productOptionValues.optionId, optionIds))
        .orderBy(asc(productOptionValues.position))
    : [];
  const valueById = new Map(values.map((v) => [v.id, v]));

  const optionsWithValues = options.map((option) => ({
    ...option,
    values: values.filter((v) => v.optionId === option.id),
  }));

  const variants = await db
    .select()
    .from(productVariants)
    .where(eq(productVariants.productId, id))
    .orderBy(asc(productVariants.createdAt));

  const variantIds = variants.map((v) => v.id);
  const links = variantIds.length
    ? await db
        .select()
        .from(productVariantOptionValues)
        .where(inArray(productVariantOptionValues.variantId, variantIds))
    : [];

  const optionNameById = new Map(options.map((o) => [o.id, o.name]));
  const variantsWithCombination = variants.map((variant) => {
    const combination: Record<string, string> = {};
    for (const link of links) {
      if (link.variantId !== variant.id) continue;
      const value = valueById.get(link.optionValueId);
      if (!value) continue;
      const optionName = optionNameById.get(value.optionId);
      if (optionName) combination[optionName] = value.value;
    }
    return { ...variant, combination };
  });

  return {
    ...product,
    images,
    options: optionsWithValues,
    variants: variantsWithCombination,
  };
}

/**
 * Replace a product's images, options+values, and variants+links wholesale.
 * Child tables are entirely owned by the product, so a full delete-and-
 * reinsert per save is simpler and safer than diffing — options/values get
 * fresh ids every save, variants are matched to them by (option name, value
 * text) rather than by id, which sidesteps any client/server id mismatch.
 */
export async function replaceProductChildren(
  productId: string,
  input: {
    images: ProductImageInput[];
    options: ProductOptionInput[];
    variants: ProductVariantInput[];
  },
) {
  await db.transaction(async (tx) => {
    // Images
    await tx.delete(productImages).where(eq(productImages.productId, productId));
    if (input.images.length) {
      const hasPrimary = input.images.some((img) => img.isPrimary);
      await tx.insert(productImages).values(
        input.images.map((img, index) => ({
          productId,
          url: img.url,
          altText: img.altText || null,
          position: index,
          isPrimary: hasPrimary ? Boolean(img.isPrimary) : index === 0,
        })),
      );
    }

    // Variants first (they reference option values, which we're about to
    // recreate), then options+values, then re-link.
    await tx.delete(productVariants).where(eq(productVariants.productId, productId));
    await tx.delete(productOptions).where(eq(productOptions.productId, productId));

    if (!input.options.length) return;

    const valueIdByKey = new Map<string, string>();

    for (let i = 0; i < input.options.length; i++) {
      const option = input.options[i];
      const [insertedOption] = await tx
        .insert(productOptions)
        .values({ productId, name: option.name, position: i })
        .returning();

      if (!option.values.length) continue;

      const insertedValues = await tx
        .insert(productOptionValues)
        .values(
          option.values.map((v, vi) => ({
            optionId: insertedOption.id,
            value: v.value,
            priceModifier: v.priceModifier || "0",
            position: vi,
          })),
        )
        .returning();

      insertedValues.forEach((v) => {
        valueIdByKey.set(`${option.name}::${v.value}`, v.id);
      });
    }

    for (const variant of input.variants) {
      const [insertedVariant] = await tx
        .insert(productVariants)
        .values({
          productId,
          sku: variant.sku || null,
          price: variant.price,
          compareAtPrice: variant.compareAtPrice || null,
          stockQuantity: variant.stockQuantity ?? 0,
          weight: variant.weight || null,
          imageUrl: variant.imageUrl || null,
          spec:
            variant.spec && Object.keys(variant.spec).length ? variant.spec : null,
          isActive: variant.isActive ?? true,
        })
        .returning();

      const optionValueIds = Object.entries(variant.combination)
        .map(([optionName, value]) => valueIdByKey.get(`${optionName}::${value}`))
        .filter((v): v is string => Boolean(v));

      if (optionValueIds.length) {
        await tx.insert(productVariantOptionValues).values(
          optionValueIds.map((optionValueId) => ({
            variantId: insertedVariant.id,
            optionValueId,
          })),
        );
      }
    }
  });
}
