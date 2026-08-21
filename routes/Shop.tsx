"use client";

import { Suspense, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { ShopProductCard } from "@/components/ui/ShopProductCard";
import { useShopCatalog } from "@/hooks/useShopCatalog";
import type { ShopProduct } from "@/lib/product";

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "name", label: "Name" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
] as const;

type SortValue = (typeof sortOptions)[number]["value"];

export default function ShopPage({
  initialProducts = [],
}: {
  initialProducts?: ShopProduct[];
}) {
  return (
    <>
      <PageHero
        eyebrow="Shop"
        title="Shop Himalayan Salt Products"
        description="Retail-quantity Himalayan salt, salt lamps, kitchen products, spa items and gifts, delivered across Pakistan."
        crumbs={[{ label: "Shop" }]}
        image="/assets/Shop-Hero-Pic.webp"
      />

      <Suspense fallback={<ShopLoading />}>
        <ShopContent initialProducts={initialProducts} />
      </Suspense>
    </>
  );
}

function productPrice(product: {
  basePrice: number | null;
  hasVariants: boolean;
  variants: { price: number }[];
}) {
  if (product.hasVariants && product.variants.length) {
    return Math.min(...product.variants.map((v) => v.price));
  }
  return product.basePrice ?? 0;
}

function ShopContent({
  initialProducts = [],
}: {
  initialProducts?: ShopProduct[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { products: clientProducts, loading: clientLoading } = useShopCatalog();
  const products =
    clientProducts.length > 0 ? clientProducts : initialProducts;
  const loading =
    clientProducts.length === 0 && initialProducts.length === 0 && clientLoading;

  const category = searchParams.get("category") ?? "";
  const q = searchParams.get("q") ?? "";

  const sortParam = searchParams.get("sort");
  const sort: SortValue = isValidSort(sortParam) ? sortParam : "featured";

  const shopCategories = useMemo(() => {
    const titles = new Set<string>();
    for (const p of products) {
      if (p.categoryTitle) titles.add(p.categoryTitle);
    }
    return Array.from(titles).sort();
  }, [products]);

  function updateParam(key: string, value: string) {
    const nextParams = new URLSearchParams(searchParams.toString());

    if (value) {
      nextParams.set(key, value);
    } else {
      nextParams.delete(key);
    }

    const queryString = nextParams.toString();
    const nextUrl = queryString ? `${pathname}?${queryString}` : pathname;

    router.replace(nextUrl, { scroll: false });
  }

  function clearFilters() {
    router.replace(pathname, { scroll: false });
  }

  const filteredProducts = useMemo(() => {
    const normalizedQuery = q.trim().toLowerCase();

    const filtered = products.filter((product) => {
      const matchesCategory = !category || product.categoryTitle === category;

      const matchesQuery =
        !normalizedQuery ||
        product.title.toLowerCase().includes(normalizedQuery) ||
        (product.description ?? "").toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });

    switch (sort) {
      case "name":
        return [...filtered].sort((a, b) => a.title.localeCompare(b.title));

      case "price-asc":
        return [...filtered].sort((a, b) => productPrice(a) - productPrice(b));

      case "price-desc":
        return [...filtered].sort((a, b) => productPrice(b) - productPrice(a));

      case "featured":
      default:
        return filtered;
    }
  }, [products, category, q, sort]);

  return (
    <main className="mx-auto grid max-w-7xl w-full grid-cols-1 gap-10 px-6 py-16 md:grid-cols-[240px_1fr] md:px-8">
      <aside className="flex flex-col gap-8">
        <div>
          <label
            htmlFor="shop-search"
            className="mb-2 block text-sm font-semibold text-primary"
          >
            Search
          </label>

          <input
            id="shop-search"
            type="search"
            value={q}
            onChange={(event) => updateParam("q", event.target.value)}
            placeholder="Search products…"
            autoComplete="off"
            className="w-full rounded-sm border border-border bg-white px-3 py-2 text-sm text-charcoal outline-none transition focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
          />
        </div>

        <div>
          <span className="mb-2 block text-sm font-semibold text-primary">
            Category
          </span>

          <div
            className="flex flex-col gap-1.5"
            aria-label="Product categories"
          >
            <button
              type="button"
              onClick={() => updateParam("category", "")}
              aria-pressed={!category}
              className={getCategoryClass(!category)}
            >
              All Products
            </button>

            {shopCategories.map((shopCategory) => (
              <button
                key={shopCategory}
                type="button"
                onClick={() => updateParam("category", shopCategory)}
                aria-pressed={category === shopCategory}
                className={getCategoryClass(category === shopCategory)}
              >
                {shopCategory}
              </button>
            ))}
          </div>
        </div>

        {(category || q || sort !== "featured") && (
          <button
            type="button"
            onClick={clearFilters}
            className="w-fit text-sm font-semibold text-primary transition-colors hover:text-primary"
          >
            Clear all filters
          </button>
        )}
      </aside>

      <section>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            {filteredProducts.length}{" "}
            {filteredProducts.length === 1 ? "product" : "products"}
          </p>

          <div className="flex items-center gap-2">
            <label
              htmlFor="shop-sort"
              className="text-sm text-muted-foreground"
            >
              Sort
            </label>

            <select
              id="shop-sort"
              value={sort}
              onChange={(event) => {
                const value = event.target.value as SortValue;

                updateParam("sort", value === "featured" ? "" : value);
              }}
              className="rounded-sm border border-border bg-white px-3 py-1.5 text-sm text-charcoal outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <ShopGridLoading />
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-24 text-center">
            <p className="font-serif text-xl text-primary">
              No products match your filters
            </p>

            <p className="max-w-md text-sm text-muted-foreground">
              Try another search term or remove the selected category.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="text-sm font-semibold text-primary transition-colors hover:text-primary"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <Reveal
            stagger
            className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3"
          >
            {filteredProducts.map((product) => (
              <ShopProductCard key={product.slug} product={product} />
            ))}
          </Reveal>
        )}
      </section>
    </main>
  );
}

function isValidSort(value: string | null): value is SortValue {
  return sortOptions.some((option) => option.value === value);
}

function getCategoryClass(active: boolean) {
  return [
    "text-left text-sm transition-colors",
    "focus-visible:outline-none focus-visible:text-primary",
    active ? "font-semibold text-primary" : "text-charcoal hover:text-primary",
  ].join(" ");
}

function ShopGridLoading() {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="h-80 animate-pulse rounded-sm bg-muted" />
      ))}
    </div>
  );
}

function ShopLoading() {
  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-16 md:grid-cols-[240px_1fr] md:px-8">
      <div className="space-y-6">
        <div className="h-10 animate-pulse rounded-sm bg-muted" />
        <div className="h-40 animate-pulse rounded-sm bg-muted" />
      </div>

      <div>
        <div className="mb-6 h-8 animate-pulse rounded-sm bg-muted" />

        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-80 animate-pulse rounded-sm bg-muted"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
