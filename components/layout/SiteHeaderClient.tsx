"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Menu,
  Phone,
  Mail,
  Search,
  Heart,
  User,
  ShoppingBag,
  X,
  ChevronDown,
} from "lucide-react";
import {
  mainNavigation,
  headerCtas,
  retailNavigation,
} from "@/data/navigation";
import { company } from "@/data/company";
import { cn } from "@/lib/utils";
import type { ProductNavNode } from "@/lib/navigation";
import Link from "next/link";
import Image from "next/image";

const DROPDOWN_CLOSE_DELAY_MS = 150;

function flattenNavNode(
  node: ProductNavNode,
  depth: number,
): { id: string; label: string; to: string; depth: number }[] {
  const entries = [{ id: node.id, label: node.label, to: node.href, depth }];
  for (const child of node.children) {
    entries.push(...flattenNavNode(child, depth + 1));
  }
  for (const product of node.products) {
    entries.push({ id: product.id, label: product.label, to: product.href, depth: depth + 1 });
  }
  return entries;
}

export function SiteHeaderClient({
  productCategories,
}: {
  productCategories: ProductNavNode[];
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileGroup, setMobileGroup] = useState<string | null>(null);

  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openMenu = useCallback((label: string) => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setOpenDropdown(label);
  }, []);

  const scheduleClose = useCallback(() => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(
      () => setOpenDropdown(null),
      DROPDOWN_CLOSE_DELAY_MS,
    );
  }, []);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Top bar */}
      <div className="hidden bg-maroon text-cream/90 md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-2 text-xs">
          <div className="flex items-center gap-5">
            <a
              href={`tel:${company.phone.replace(/\s/g, "")}`}
              className="flex items-center gap-1.5 hover:text-cream"
            >
              <Phone className="h-3.5 w-3.5" /> {company.phone}
            </a>
            <a
              href={`mailto:${company.emails.sales}`}
              className="flex items-center gap-1.5 hover:text-cream"
            >
              <Mail className="h-3.5 w-3.5" /> {company.emails.sales}
            </a>
            <span className="text-cream/70">
              Export &amp; Wholesale Enquiries
            </span>
          </div>
          <div className="flex items-center gap-4 text-cream/70">
            <span>Currency: PKR</span>
            <span>Delivering across Pakistan</span>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div
        className={cn(
          "relative border-b transition-colors duration-300",
          scrolled
            ? "border-border bg-cream/95 backdrop-blur-sm"
            : "border-transparent bg-cream",
        )}
      >
        <div className="mx-auto flex  items-center justify-between px-6 py-2 md:px-8">
          <Link
            href="/"
            className="font-serif text-2xl font-semibold tracking-wide text-maroon"
          >
            <Image
              src={`/premiersalt-logo.png`}
              alt=""
              width={100}
              height={100}
            />{" "}
          </Link>

          <nav
            className="hidden items-center gap-7 lg:flex"
            aria-label="Primary"
          >
            {mainNavigation.map((item) => {
              const isProducts = item.label === "Products";
              return (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() =>
                    (item.dropdown || item.megaMenu || isProducts) &&
                    openMenu(item.label)
                  }
                  onMouseLeave={scheduleClose}
                >
                  {item.to && !item.dropdown && !item.megaMenu && !isProducts ? (
                    <Link
                      href={item.to}
                      className="text-sm font-medium text-charcoal transition-colors hover:text-terracotta"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <button
                      className="flex items-center gap-1 text-sm font-medium text-charcoal transition-colors hover:text-terracotta"
                      aria-expanded={openDropdown === item.label}
                    >
                      {item.to ? (
                        <Link href={item.to}>{item.label}</Link>
                      ) : (
                        item.label
                      )}
                      <ChevronDown className="h-3.5 w-3.5" />
                    </button>
                  )}

                  {!isProducts && item.dropdown && openDropdown === item.label && (
                    <div className="absolute left-0 top-full min-w-56 rounded-sm border border-border bg-white py-2 shadow-lg">
                      {item.dropdown.map((link) => (
                        <Link
                          key={link.to}
                          href={link.to}
                          className="block px-4 py-2 text-sm text-charcoal hover:bg-cream hover:text-terracotta"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  )}

                  {!isProducts && item.megaMenu && openDropdown === item.label && (
                    <div className="absolute left-1/2 top-full grid w-[720px] -translate-x-1/2 grid-cols-3 gap-6 rounded-sm border border-border bg-white p-6 shadow-xl">
                      {item.megaMenu.map((group) => (
                        <div key={group.label}>
                          <Link
                            href={group.to ?? "#"}
                            className="mb-2 block text-sm font-semibold text-maroon hover:text-terracotta"
                          >
                            {group.label}
                          </Link>
                          <ul className="flex flex-col gap-1.5">
                            {group.links.map((link) => (
                              <li key={link.to}>
                                <Link
                                  href={link.to}
                                  className="text-sm text-muted hover:text-terracotta"
                                >
                                  {link.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href={headerCtas[0].to}
              className="hidden rounded-sm border border-terracotta px-4 py-2 text-xs font-semibold uppercase tracking-wide text-terracotta hover:bg-terracotta hover:text-cream md:inline-block"
            >
              {headerCtas[0].label}
            </Link>
            <Link
              href={headerCtas[1].to}
              className="hidden rounded-sm bg-terracotta px-4 py-2 text-xs font-semibold uppercase tracking-wide text-cream hover:bg-maroon md:inline-block"
            >
              {headerCtas[1].label}
            </Link>

            <div className="hidden items-center gap-4 border-l border-border pl-4 lg:flex">
              <Link href={retailNavigation[0].to} aria-label="Search">
                <Search className="h-4.5 w-4.5 text-charcoal hover:text-terracotta" />
              </Link>
              <Link href={retailNavigation[1].to} aria-label="Wishlist">
                <Heart className="h-4.5 w-4.5 text-charcoal hover:text-terracotta" />
              </Link>
              <Link href={retailNavigation[2].to} aria-label="Account">
                <User className="h-4.5 w-4.5 text-charcoal hover:text-terracotta" />
              </Link>
              <Link
                href={retailNavigation[3].to}
                aria-label="Cart"
                className="relative"
              >
                <ShoppingBag className="h-4.5 w-4.5 text-charcoal hover:text-terracotta" />
              </Link>
            </div>

            <button
              className="lg:hidden"
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="h-6 w-6 text-charcoal" />
            </button>
          </div>
        </div>

        {/* Full-width Products mega menu — spans the entire page, not just
            the nav item, per the storefront category tree from the DB. */}
        {openDropdown === "Products" && (
          <div
            onMouseEnter={() => openMenu("Products")}
            onMouseLeave={scheduleClose}
            className="absolute inset-x-0 top-full border-t border-border bg-white shadow-2xl"
          >
            <div className="mx-auto max-h-[70vh] max-w-7xl overflow-y-auto px-8 py-8">
              {productCategories.length ? (
                <div className="grid grid-cols-2 gap-x-8 gap-y-7 sm:grid-cols-3 lg:grid-cols-4">
                  {productCategories.map((root) => (
                    <div key={root.id}>
                      <Link
                        href={root.href}
                        className="mb-3 block font-serif text-base text-maroon hover:text-terracotta"
                      >
                        {root.label}
                      </Link>
                      {root.children.length ? (
                        <ul className="flex flex-col gap-2">
                          {root.children.map((child) => (
                            <li key={child.id}>
                              <Link
                                href={child.href}
                                className="text-sm text-muted hover:text-terracotta"
                              >
                                {child.label}
                              </Link>
                              {child.children.length ? (
                                <ul className="mt-1.5 flex flex-col gap-1 border-l border-border pl-3">
                                  {child.children.map((grandchild) => (
                                    <li key={grandchild.id}>
                                      <Link
                                        href={grandchild.href}
                                        className="text-xs text-muted/80 hover:text-terracotta"
                                      >
                                        {grandchild.label}
                                      </Link>
                                      {grandchild.products.length ? (
                                        <ul className="mt-1 flex flex-col gap-1 border-l border-border/60 pl-3">
                                          {grandchild.products.map((product) => (
                                            <li key={product.id}>
                                              <Link
                                                href={product.href}
                                                className="text-xs text-muted/70 hover:text-terracotta"
                                              >
                                                {product.label}
                                              </Link>
                                            </li>
                                          ))}
                                        </ul>
                                      ) : null}
                                    </li>
                                  ))}
                                </ul>
                              ) : null}
                              {child.products.length ? (
                                <ul className="mt-1.5 flex flex-col gap-1 border-l border-border pl-3">
                                  {child.products.map((product) => (
                                    <li key={product.id}>
                                      <Link
                                        href={product.href}
                                        className="text-xs text-muted/70 hover:text-terracotta"
                                      >
                                        {product.label}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              ) : null}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                      {root.products.length ? (
                        <ul
                          className={cn(
                            "flex flex-col gap-1.5",
                            root.children.length && "mt-2 border-t border-border/60 pt-2",
                          )}
                        >
                          {root.products.map((product) => (
                            <li key={product.id}>
                              <Link
                                href={product.href}
                                className="text-sm text-muted/80 hover:text-terracotta"
                              >
                                {product.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted">
                  Categories will appear here once they&apos;re added.
                </p>
              )}
              <div className="mt-8 border-t border-border pt-5 text-center">
                <Link
                  href="/products"
                  className="text-xs font-semibold uppercase tracking-wide text-terracotta hover:text-maroon"
                >
                  View All Products →
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-charcoal/50"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute right-0 top-0 flex h-full w-[86%] max-w-sm flex-col overflow-y-auto bg-cream p-6">
            <div className="mb-6 flex items-center justify-between">
              <span className="font-serif text-xl text-maroon">
                Premier Salt
              </span>
              <button
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
              >
                <X className="h-6 w-6 text-charcoal" />
              </button>
            </div>
            <nav className="flex flex-col gap-1" aria-label="Mobile">
              {mainNavigation.map((item) => {
                const isProducts = item.label === "Products";
                const hasChildren = isProducts
                  ? productCategories.length > 0
                  : Boolean(item.dropdown || item.megaMenu);
                const flatLinks: { id: string; label: string; to: string; depth: number }[] =
                  isProducts
                    ? productCategories.flatMap((root) => flattenNavNode(root, 0))
                    : (item.dropdown ??
                      item.megaMenu?.flatMap((g) => [
                        { label: g.label, to: g.to ?? "#" },
                        ...g.links,
                      ]) ??
                      []
                    ).map((link, index) => ({ ...link, id: `${link.to}-${index}`, depth: 0 }));
                return (
                  <div key={item.label} className="border-b border-border py-2">
                    <button
                      className="flex w-full items-center justify-between py-2 text-left text-sm font-medium text-charcoal"
                      onClick={() =>
                        hasChildren
                          ? setMobileGroup(
                              mobileGroup === item.label ? null : item.label,
                            )
                          : setMobileOpen(false)
                      }
                    >
                      {item.to && !hasChildren ? (
                        <Link
                          href={item.to}
                          onClick={() => setMobileOpen(false)}
                        >
                          {item.label}
                        </Link>
                      ) : (
                        item.label
                      )}
                      {hasChildren && (
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 transition-transform",
                            mobileGroup === item.label && "rotate-180",
                          )}
                        />
                      )}
                    </button>
                    {hasChildren && mobileGroup === item.label && (
                      <div className="flex flex-col gap-1 pb-2 pl-3">
                        {flatLinks.map((link) => (
                          <Link
                            key={link.id}
                            href={link.to}
                            className={cn(
                              "py-1.5 text-sm text-muted hover:text-terracotta",
                              link.depth > 0 && "text-xs",
                              link.depth === 1 && "pl-3",
                              link.depth === 2 && "pl-6",
                              link.depth >= 3 && "pl-9",
                            )}
                            onClick={() => setMobileOpen(false)}
                          >
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
            <div className="mt-6 flex flex-col gap-3">
              <Link
                href={headerCtas[0].to}
                onClick={() => setMobileOpen(false)}
                className="rounded-sm border border-terracotta px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-terracotta"
              >
                {headerCtas[0].label}
              </Link>
              <Link
                href={headerCtas[1].to}
                onClick={() => setMobileOpen(false)}
                className="rounded-sm bg-terracotta px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-cream"
              >
                {headerCtas[1].label}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
