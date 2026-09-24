"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  FileText,
  Loader2,
  Package,
  Search,
  Tag,
  X,
} from "lucide-react";

import { useShopCatalog } from "@/hooks/useShopCatalog";
import type { ProductNavNode } from "@/lib/navigation";
import { cn } from "@/lib/utils";

interface SearchCategory {
  title: string;
  slug: string;
  description: string;
}

interface SearchBlogPost {
  title: string;
  slug: string;
  excerpt: string;
  categorySlug: string;
}

interface CatalogItem {
  id: string;
  title: string;
  href: string;
  category: string;
}

function extractCatalogProducts(nodes: ProductNavNode[]): CatalogItem[] {
  const items: CatalogItem[] = [];

  function walk(node: ProductNavNode) {
    if (node.products && node.products.length > 0) {
      for (const prod of node.products) {
        items.push({
          id: prod.id,
          title: prod.label,
          href: prod.href,
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

  for (const root of nodes) {
    walk(root);
  }

  return items;
}

export function HeaderSearch({
  productCategories = [],
  className,
}: {
  productCategories?: ProductNavNode[];
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [categories, setCategories] = useState<SearchCategory[]>([]);
  const [blogPosts, setBlogPosts] = useState<SearchBlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [, startTransition] = useTransition();

  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputId = useId();

  const { products: shopProducts } = useShopCatalog();

  const catalogItems = useMemo(
    () => extractCatalogProducts(productCategories),
    [productCategories],
  );

  const loadIndex = useCallback(() => {
    if (categories.length > 0 && blogPosts.length > 0) return;
    setIsLoading(true);
    Promise.all([
      fetch("/api/site-categories")
        .then((r) => r.json())
        .then((d) => (d.success ? (d.data as SearchCategory[]) : []))
        .catch(() => []),
      fetch("/api/blog-posts")
        .then((r) => r.json())
        .then((d) => (d.success ? (d.data as SearchBlogPost[]) : []))
        .catch(() => []),
    ]).then(([catData, blogData]) => {
      setCategories(catData);
      setBlogPosts(blogData);
      setIsLoading(false);
    });
  }, [categories.length, blogPosts.length]);

  function toggleOpen() {
    if (!isOpen) {
      loadIndex();
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }

  // Focus input on open
  useEffect(() => {
    if (!isOpen) return;

    const focusTimer = setTimeout(() => {
      inputRef.current?.focus();
    }, 50);

    return () => clearTimeout(focusTimer);
  }, [isOpen]);

  // Close on Escape or click outside
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        setIsOpen(false);
      }
    }

    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const cleanQuery = query.trim().toLowerCase();
  const hasQuery = cleanQuery.length > 0;

  // Filter matching items
  const matchedCategories = hasQuery
    ? categories
        .filter(
          (c) =>
            c.title.toLowerCase().includes(cleanQuery) ||
            c.description.toLowerCase().includes(cleanQuery),
        )
        .slice(0, 4)
    : [];

  const matchedShopProducts = hasQuery
    ? shopProducts
        .filter(
          (p) =>
            p.title.toLowerCase().includes(cleanQuery) ||
            (p.description ?? "").toLowerCase().includes(cleanQuery),
        )
        .slice(0, 4)
    : [];

  const matchedCatalogProducts = hasQuery
    ? catalogItems
        .filter(
          (p) =>
            p.title.toLowerCase().includes(cleanQuery) ||
            p.category.toLowerCase().includes(cleanQuery),
        )
        .slice(0, 4)
    : [];

  const matchedPosts = hasQuery
    ? blogPosts
        .filter(
          (b) =>
            b.title.toLowerCase().includes(cleanQuery) ||
            b.excerpt.toLowerCase().includes(cleanQuery),
        )
        .slice(0, 3)
    : [];

  const totalResultsCount =
    matchedCategories.length +
    matchedShopProducts.length +
    matchedCatalogProducts.length +
    matchedPosts.length;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setIsOpen(false);
    startTransition(() => {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    });
  }

  function handleSelectResult(href: string) {
    setIsOpen(false);
    startTransition(() => {
      router.push(href);
    });
  }

  return (
    <div className={cn("relative", className)} ref={containerRef}>
      {/* Search trigger button */}
      <button
        type="button"
        onClick={toggleOpen}
        onMouseEnter={loadIndex}
        onFocus={loadIndex}
        aria-label="Search Premier Salt products and articles"
        aria-expanded={isOpen}
        className="flex h-9 w-9 items-center justify-center rounded-full text-charcoal transition-colors hover:bg-black/5 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
      >
        {isOpen ? (
          <X className="h-4.5 w-4.5" />
        ) : (
          <Search className="h-4.5 w-4.5" />
        )}
      </button>

      {/* Floating search dropdown overlay */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="false"
          aria-label="Site Search"
          className="absolute right-0 top-12 z-50 w-[92vw] max-w-lg rounded-md border border-border bg-white p-3 shadow-xl sm:w-[480px] sm:p-4 animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Input Form */}
          <form onSubmit={handleSubmit} className="relative flex items-center">
            <label htmlFor={inputId} className="sr-only">
              Search products, categories and articles
            </label>
            <Search className="pointer-events-none absolute left-3.5 h-4 w-4 text-muted-foreground" />
            <input
              ref={inputRef}
              id={inputId}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products, lamps, salt, articles…"
              autoComplete="off"
              className="h-10 w-full rounded-sm border border-border bg-muted/30 pl-9 pr-16 text-sm text-charcoal outline-none transition placeholder:text-muted-foreground focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/15"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  inputRef.current?.focus();
                }}
                aria-label="Clear search input"
                className="absolute right-9 flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-charcoal"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
            <button
              type="submit"
              disabled={!query.trim()}
              aria-label="Submit search"
              className="absolute right-2 flex h-7 w-7 items-center justify-center rounded-sm bg-primary text-cream transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </form>

          {/* Search Content */}
          <div className="mt-3 max-h-[60vh] overflow-y-auto overscroll-contain pr-1">
            {isLoading && (
              <div className="flex items-center justify-center gap-2 py-8 text-xs text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span>Loading searchable index…</span>
              </div>
            )}

            {!isLoading && hasQuery && totalResultsCount === 0 && (
              <div className="py-8 text-center">
                <p className="text-sm font-medium text-charcoal">
                  No matches for &ldquo;{query}&rdquo;
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Try searching for &ldquo;pink salt&rdquo;, &ldquo;salt
                  lamps&rdquo;, or &ldquo;edible salt&rdquo;.
                </p>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                >
                  Search on full results page
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            )}

            {!isLoading && !hasQuery && (
              <div className="py-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Popular Searches
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {[
                    "Himalayan Salt Lamps",
                    "Pink Edible Salt",
                    "Animal Lick Salt",
                    "Bath Salt",
                    "Cooking Slabs",
                    "Private Label",
                  ].map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => {
                        setQuery(item);
                        inputRef.current?.focus();
                      }}
                      className="rounded-full border border-border bg-cream/50 px-2.5 py-1 text-xs text-charcoal transition-colors hover:border-primary hover:text-primary"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {!isLoading && hasQuery && totalResultsCount > 0 && (
              <div className="space-y-4 py-1">
                {/* Shop Products */}
                {matchedShopProducts.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 pb-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
                      <Package className="h-3.5 w-3.5" />
                      <span>Shop Products</span>
                    </div>
                    <div className="divide-y divide-border/60">
                      {matchedShopProducts.map((p) => (
                        <button
                          key={`shop-${p.id}`}
                          type="button"
                          onClick={() =>
                            handleSelectResult(`/shop/product/${p.slug}`)
                          }
                          className="flex w-full items-center justify-between py-2 text-left transition-colors hover:bg-muted/40 rounded px-1.5"
                        >
                          <div className="min-w-0 pr-2">
                            <p className="truncate text-xs font-medium text-charcoal">
                              {p.title}
                            </p>
                            {p.categoryTitle && (
                              <p className="truncate text-[10px] text-muted-foreground">
                                {p.categoryTitle}
                              </p>
                            )}
                          </div>
                          {p.basePrice !== null && (
                            <span className="shrink-0 text-xs font-semibold text-primary">
                              PKR {Number(p.basePrice).toLocaleString()}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* B2B Catalog Products */}
                {matchedCatalogProducts.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 pb-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
                      <Package className="h-3.5 w-3.5" />
                      <span>B2B / Wholesale Products</span>
                    </div>
                    <div className="divide-y divide-border/60">
                      {matchedCatalogProducts.map((item) => (
                        <button
                          key={`cat-prod-${item.id}`}
                          type="button"
                          onClick={() => handleSelectResult(item.href)}
                          className="flex w-full items-center justify-between py-2 text-left transition-colors hover:bg-muted/40 rounded px-1.5"
                        >
                          <div className="min-w-0 pr-2">
                            <p className="truncate text-xs font-medium text-charcoal">
                              {item.title}
                            </p>
                            <p className="truncate text-[10px] text-muted-foreground">
                              {item.category}
                            </p>
                          </div>
                          <span className="shrink-0 rounded bg-sand/40 px-1.5 py-0.5 text-[10px] font-medium text-charcoal">
                            Wholesale
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Categories */}
                {matchedCategories.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 pb-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
                      <Tag className="h-3.5 w-3.5" />
                      <span>Categories</span>
                    </div>
                    <div className="divide-y divide-border/60">
                      {matchedCategories.map((c) => (
                        <button
                          key={`category-${c.slug}`}
                          type="button"
                          onClick={() => handleSelectResult(`/${c.slug}`)}
                          className="flex w-full items-center justify-between py-2 text-left transition-colors hover:bg-muted/40 rounded px-1.5"
                        >
                          <span className="truncate text-xs font-medium text-charcoal">
                            {c.title}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            Browse category →
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Blog Articles */}
                {matchedPosts.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 pb-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
                      <FileText className="h-3.5 w-3.5" />
                      <span>Articles &amp; Guides</span>
                    </div>
                    <div className="divide-y divide-border/60">
                      {matchedPosts.map((post) => (
                        <button
                          key={`post-${post.slug}`}
                          type="button"
                          onClick={() =>
                            handleSelectResult(
                              `/blog/${post.categorySlug}/${post.slug}`,
                            )
                          }
                          className="flex w-full items-center justify-between py-2 text-left transition-colors hover:bg-muted/40 rounded px-1.5"
                        >
                          <span className="truncate text-xs font-medium text-charcoal">
                            {post.title}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            Read article →
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer with view all results */}
          {hasQuery && (
            <div className="mt-3 border-t border-border pt-2 text-center">
              <Link
                href={`/search?q=${encodeURIComponent(query.trim())}`}
                onClick={() => setIsOpen(false)}
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-sm bg-primary/10 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-cream"
              >
                <span>View all results for &ldquo;{query}&rdquo;</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
