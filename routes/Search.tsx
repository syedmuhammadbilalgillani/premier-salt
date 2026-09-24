"use client";

import {
  Fragment,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, FileText, Package, Search, Tag, X } from "lucide-react";

import { PageHero } from "@/components/layout/PageHero";
import { useShopCatalog } from "@/hooks/useShopCatalog";
import type { ProductNavNode } from "@/lib/navigation";

interface SearchBlogPost {
  title: string;
  slug: string;
  excerpt: string;
  categorySlug: string;
}

interface SearchCategory {
  title: string;
  slug: string;
  description: string;
}

interface CatalogItem {
  id: string;
  title: string;
  href: string;
  category: string;
}

type ResultType =
  | "B2B Category"
  | "B2B Product"
  | "Shop Product"
  | "Blog Article";
type ActiveType = ResultType | "All";

interface SearchResult {
  type: ResultType;
  title: string;
  href: string;
  snippet: string;
  category?: string;
  price?: number | null;
}

const typeFilters: ResultType[] = [
  "B2B Category",
  "B2B Product",
  "Shop Product",
  "Blog Article",
];

const POPULAR_SEARCHES = [
  "Himalayan Salt Lamps",
  "Pink Edible Salt",
  "Animal Lick Salt",
  "Bath Salt",
  "Cooking Slabs",
  "Private Label",
];

export default function SearchPage() {
  return (
    <>
      <PageHero
        eyebrow="Search"
        title="Search Premier Salt"
        crumbs={[{ label: "Search" }]}
      />

      <Suspense fallback={<SearchFallback />}>
        <SearchContent />
      </Suspense>
    </>
  );
}

function SearchContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const queryFromUrl = searchParams.get("q") ?? "";

  const [query, setQuery] = useState(queryFromUrl);
  const [prevUrlQuery, setPrevUrlQuery] = useState(queryFromUrl);
  const [activeType, setActiveType] = useState<ActiveType>("All");
  const [blogPosts, setBlogPosts] = useState<SearchBlogPost[]>([]);
  const [categories, setCategories] = useState<SearchCategory[]>([]);
  const [catalogItems, setCatalogItems] = useState<CatalogItem[]>([]);
  const { products } = useShopCatalog();

  // Sync state when URL parameter changes without calling setState inside an effect
  if (queryFromUrl !== prevUrlQuery) {
    setPrevUrlQuery(queryFromUrl);
    setQuery(queryFromUrl);
  }

  useEffect(() => {
    let cancelled = false;

    fetch("/api/blog-posts")
      .then((res) => res.json())
      .then((json) => {
        if (!cancelled && json.success) setBlogPosts(json.data);
      })
      .catch(() => {});

    fetch("/api/site-categories")
      .then((res) => res.json())
      .then((json) => {
        if (!cancelled && json.success) setCategories(json.data);
      })
      .catch(() => {});

    fetch("/api/navigation/products")
      .then((res) => res.json())
      .then((json) => {
        if (!cancelled && json.success) {
          const items: CatalogItem[] = [];
          function walk(node: ProductNavNode) {
            if (node.products && node.products.length > 0) {
              for (const p of node.products) {
                items.push({
                  id: p.id,
                  title: p.label,
                  href: p.href,
                  category: node.label,
                });
              }
            }
            if (node.children && node.children.length > 0) {
              for (const child of node.children) {
                walk(child);
              }
            }
          }
          for (const root of json.data as ProductNavNode[]) {
            walk(root);
          }
          setCatalogItems(items);
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  const normalizedQuery = query.trim().toLowerCase();
  const displayQuery = query.trim();
  const hasQuery = normalizedQuery.length > 0;

  const commitQuery = useCallback(
    (nextQuery: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (nextQuery) {
        params.set("q", nextQuery);
      } else {
        params.delete("q");
      }
      const queryString = params.toString();
      const nextUrl = queryString ? `${pathname}?${queryString}` : pathname;
      router.replace(nextUrl, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  // Debounce URL update when user pauses typing
  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const trimmed = query.trim();
      if (trimmed !== queryFromUrl) {
        commitQuery(trimmed);
      }
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [commitQuery, query, queryFromUrl]);

  const results = useMemo<SearchResult[]>(() => {
    if (!normalizedQuery) {
      return [];
    }

    const categoryResults: SearchResult[] = categories
      .filter(
        (category) =>
          category.title.toLowerCase().includes(normalizedQuery) ||
          category.description.toLowerCase().includes(normalizedQuery),
      )
      .map((category) => ({
        type: "B2B Category",
        title: category.title,
        href: `/${category.slug}`,
        snippet: category.description,
      }));

    const catalogResults: SearchResult[] = catalogItems
      .filter(
        (item) =>
          item.title.toLowerCase().includes(normalizedQuery) ||
          item.category.toLowerCase().includes(normalizedQuery),
      )
      .map((item) => ({
        type: "B2B Product",
        title: item.title,
        href: item.href,
        snippet: `Bulk & wholesale Himalayan salt product in ${item.category}.`,
        category: item.category,
      }));

    const productResults: SearchResult[] = products
      .filter(
        (product) =>
          product.title.toLowerCase().includes(normalizedQuery) ||
          (product.description ?? "").toLowerCase().includes(normalizedQuery),
      )
      .map((product) => ({
        type: "Shop Product",
        title: product.title,
        href: `/shop/product/${product.slug}`,
        snippet: product.description ?? "",
        category: product.categoryTitle ?? undefined,
        price: product.basePrice,
      }));

    const blogResults: SearchResult[] = blogPosts
      .filter(
        (post) =>
          post.title.toLowerCase().includes(normalizedQuery) ||
          post.excerpt.toLowerCase().includes(normalizedQuery),
      )
      .map((post) => ({
        type: "Blog Article",
        title: post.title,
        href: `/blog/${post.categorySlug}/${post.slug}`,
        snippet: post.excerpt,
      }));

    return [
      ...productResults,
      ...catalogResults,
      ...categoryResults,
      ...blogResults,
    ];
  }, [normalizedQuery, blogPosts, categories, catalogItems, products]);

  const visibleResults = useMemo(() => {
    if (activeType === "All") {
      return results;
    }

    return results.filter((result) => result.type === activeType);
  }, [activeType, results]);

  const resultCounts = useMemo(() => {
    return typeFilters.reduce<Record<ResultType, number>>(
      (counts, type) => {
        counts[type] = results.filter((result) => result.type === type).length;
        return counts;
      },
      {
        "B2B Category": 0,
        "B2B Product": 0,
        "Shop Product": 0,
        "Blog Article": 0,
      },
    );
  }, [results]);

  function highlightText(text: string) {
    const searchTerm = query.trim();
    if (!searchTerm) return text;

    const escaped = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const parts = text.split(new RegExp(`(${escaped})`, "gi"));

    return parts.map((part, index) => {
      const isMatch = part.toLowerCase() === searchTerm.toLowerCase();
      if (isMatch) {
        return (
          <mark
            key={`${part}-${index}`}
            className="bg-salt-pink-light/70 text-charcoal font-medium rounded-xs px-0.5"
          >
            {part}
          </mark>
        );
      }
      return <Fragment key={`${part}-${index}`}>{part}</Fragment>;
    });
  }

  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    commitQuery(query.trim());
  }

  function handleSelectTag(tag: string) {
    setQuery(tag);
    commitQuery(tag);
  }

  function getResultIcon(type: ResultType) {
    switch (type) {
      case "Shop Product":
      case "B2B Product":
        return <Package className="h-3.5 w-3.5 text-primary" />;
      case "B2B Category":
        return <Tag className="h-3.5 w-3.5 text-primary" />;
      case "Blog Article":
        return <FileText className="h-3.5 w-3.5 text-primary" />;
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-12 md:px-8">
      {/* Search Input Form */}
      <form onSubmit={handleFormSubmit} className="relative flex items-center">
        <label htmlFor="site-search" className="sr-only">
          Search products, categories, and articles
        </label>

        <Search className="pointer-events-none absolute left-4 h-5 w-5 text-muted-foreground" />

        <input
          id="site-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search products, categories, articles…"
          autoComplete="off"
          className="w-full rounded-sm border border-border bg-white py-3.5 pl-12 pr-28 text-base text-charcoal outline-none transition placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
        />

        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              commitQuery("");
            }}
            aria-label="Clear search"
            className="absolute right-16 flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-charcoal"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        <button
          type="submit"
          className="absolute right-3 rounded-sm bg-primary px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-cream transition-colors hover:bg-primary/90"
        >
          Search
        </button>
      </form>

      {/* Popular suggestions when query is empty */}
      {!hasQuery && (
        <div className="mt-8 rounded-sm border border-border/80 bg-cream/40 p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            Popular Searches
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {POPULAR_SEARCHES.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => handleSelectTag(term)}
                className="rounded-full border border-border bg-white px-3.5 py-1.5 text-xs font-medium text-charcoal transition-colors hover:border-primary hover:text-primary"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Query filters and result count */}
      {hasQuery && (
        <>
          <div
            className="my-6 flex flex-wrap gap-2"
            aria-label="Filter search results"
          >
            <button
              type="button"
              onClick={() => setActiveType("All")}
              aria-pressed={activeType === "All"}
              className={getFilterButtonClass(activeType === "All")}
            >
              All ({results.length})
            </button>

            {typeFilters.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setActiveType(type)}
                aria-pressed={activeType === type}
                className={getFilterButtonClass(activeType === type)}
              >
                {type} ({resultCounts[type]})
              </button>
            ))}
          </div>

          <p className="mb-6 text-sm text-muted-foreground" aria-live="polite">
            {visibleResults.length}{" "}
            {visibleResults.length === 1 ? "result" : "results"} for &ldquo;
            {displayQuery}&rdquo;
          </p>
        </>
      )}

      {/* No results message */}
      {hasQuery && visibleResults.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <p className="text-base font-medium text-charcoal">
            No results found for &ldquo;{displayQuery}&rdquo;.
          </p>
          <p className="text-sm text-muted-foreground">
            Try &ldquo;salt lamp&rdquo;, &ldquo;pink salt&rdquo;, or &ldquo;private
            label&rdquo;.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {POPULAR_SEARCHES.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => handleSelectTag(term)}
                className="rounded-full border border-border bg-cream px-3 py-1 text-xs text-charcoal transition-colors hover:border-primary hover:text-primary"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results List */}
      {visibleResults.length > 0 && (
        <div className="flex flex-col divide-y divide-border">
          {visibleResults.map((result) => (
            <Link
              key={`${result.type}-${result.href}`}
              href={result.href}
              className="group flex flex-col gap-1.5 py-5 transition-colors hover:bg-muted/15 px-2 rounded-sm"
            >
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-primary">
                  {getResultIcon(result.type)}
                  <span>{result.type}</span>
                </span>
                {result.category && (
                  <span className="rounded bg-sand/30 px-1.5 py-0.5 text-[10px] text-muted-foreground">
                    {result.category}
                  </span>
                )}
                {result.price !== undefined && result.price !== null && (
                  <span className="ml-auto text-xs font-bold text-primary">
                    PKR {Number(result.price).toLocaleString()}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="font-serif text-lg text-charcoal transition-colors group-hover:text-primary">
                  {highlightText(result.title)}
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100 group-hover:text-primary" />
              </div>

              <span className="text-sm leading-6 text-muted-foreground line-clamp-2">
                {highlightText(result.snippet)}
              </span>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}

function getFilterButtonClass(active: boolean) {
  return [
    "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
    active
      ? "border-primary bg-primary text-cream"
      : "border-border bg-transparent text-charcoal hover:border-primary hover:text-primary",
  ].join(" ");
}

function SearchFallback() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16 md:px-8">
      <div className="h-12 w-full animate-pulse rounded-sm bg-muted" />

      <div className="mt-8 space-y-5">
        <div className="h-20 animate-pulse rounded-sm bg-muted" />
        <div className="h-20 animate-pulse rounded-sm bg-muted" />
        <div className="h-20 animate-pulse rounded-sm bg-muted" />
      </div>
    </div>
  );
}
