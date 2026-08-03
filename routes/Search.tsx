"use client";

import { Fragment, Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { PageHero } from "@/components/layout/PageHero";
import { b2bPages } from "@/data/b2bPages";
import { shopProducts } from "@/data/shopProducts";
import { blogPosts } from "@/data/blogPosts";

type ResultType = "B2B Category" | "Shop Product" | "Blog Article";
type ActiveType = ResultType | "All";

interface SearchResult {
  type: ResultType;
  title: string;
  href: string;
  snippet: string;
}

const typeFilters: ResultType[] = [
  "B2B Category",
  "Shop Product",
  "Blog Article",
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
  const [activeType, setActiveType] = useState<ActiveType>("All");

  const normalizedQuery = query.trim().toLowerCase();
  const displayQuery = query.trim();
  const hasQuery = normalizedQuery.length > 0;

  // Keep the input synchronized with browser back/forward navigation.
  useEffect(() => {
    setQuery(queryFromUrl);
  }, [queryFromUrl]);

  // Update the URL after the user pauses typing.
  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const trimmedQuery = query.trim();

      if (trimmedQuery === queryFromUrl) {
        return;
      }

      const params = new URLSearchParams(searchParams.toString());

      if (trimmedQuery) {
        params.set("q", trimmedQuery);
      } else {
        params.delete("q");
      }

      const queryString = params.toString();
      const nextUrl = queryString ? `${pathname}?${queryString}` : pathname;

      router.replace(nextUrl, { scroll: false });
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [pathname, query, queryFromUrl, router, searchParams]);

  const results = useMemo<SearchResult[]>(() => {
    if (!normalizedQuery) {
      return [];
    }

    const categoryResults: SearchResult[] = b2bPages
      .filter(
        (page) =>
          page.name.toLowerCase().includes(normalizedQuery) ||
          page.description.toLowerCase().includes(normalizedQuery),
      )
      .map((page) => ({
        type: "B2B Category",
        title: page.name,
        href: `/${page.slug}`,
        snippet: page.description,
      }));

    const productResults: SearchResult[] = shopProducts
      .filter(
        (product) =>
          product.name.toLowerCase().includes(normalizedQuery) ||
          product.shortDescription.toLowerCase().includes(normalizedQuery),
      )
      .map((product) => ({
        type: "Shop Product",
        title: product.name,
        href: `/shop/product/${product.slug}`,
        snippet: product.shortDescription,
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
        href: `/blog/${post.slug}`,
        snippet: post.excerpt,
      }));

    return [...categoryResults, ...productResults, ...blogResults];
  }, [normalizedQuery]);

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
        "Shop Product": 0,
        "Blog Article": 0,
      },
    );
  }, [results]);

  function highlightText(text: string) {
    const searchTerm = query.trim();

    if (!searchTerm) {
      return text;
    }

    const escapedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const parts = text.split(new RegExp(`(${escapedSearchTerm})`, "gi"));

    return parts.map((part, index) => {
      const isMatch = part.toLowerCase() === searchTerm.toLowerCase();

      if (isMatch) {
        return (
          <mark
            key={`${part}-${index}`}
            className="bg-salt-pink-light text-charcoal"
          >
            {part}
          </mark>
        );
      }

      return <Fragment key={`${part}-${index}`}>{part}</Fragment>;
    });
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-16 md:px-8">
      <label htmlFor="site-search" className="sr-only">
        Search products, categories, and articles
      </label>

      <input
        id="site-search"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search products, categories, articles…"
        autoComplete="off"
        className="w-full rounded-sm border border-border bg-white px-4 py-3 text-sm text-charcoal outline-none transition focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
      />

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
            {visibleResults.length === 1 ? "result" : "results"} for “
            {displayQuery}”
          </p>
        </>
      )}

      {hasQuery && visibleResults.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <p className="text-muted-foreground">
            No results found for “{displayQuery}”.
          </p>

          <p className="text-sm text-muted-foreground">
            Try “salt lamp”, “pink salt”, or “private label”.
          </p>
        </div>
      )}

      {visibleResults.length > 0 && (
        <div className="flex flex-col divide-y divide-border">
          {visibleResults.map((result) => (
            <Link
              key={`${result.type}-${result.href}`}
              href={result.href}
              className="group flex flex-col gap-1 py-5"
            >
              <span className="text-xs font-semibold uppercase tracking-wide text-primary">
                {result.type}
              </span>

              <span className="font-serif text-lg text-charcoal transition-colors group-hover:text-primary">
                {highlightText(result.title)}
              </span>

              <span className="text-sm leading-6 text-muted-foreground">
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
