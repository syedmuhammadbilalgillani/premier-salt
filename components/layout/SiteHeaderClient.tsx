"use client";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// DropdownMenu's own classes use the shadcn tokens (bg-popover,
// text-popover-foreground, focus:bg-accent, ring-foreground/10), which are
// scoped to the admin panel only (see .admin-theme in app/globals.css) and so
// resolve to nothing on the storefront. `!` is required on the overrides: some
// of the component defaults tailwind-merge won't dedupe (the arbitrary
// `w-(--radix-dropdown-menu-trigger-width)`, the ring), and the rest must win
// regardless of source order.
const triggerClass =
  "group flex cursor-pointer items-center gap-1 rounded-sm px-2 py-1 text-sm font-medium text-charcoal outline-hidden transition-colors hover:text-primary data-[state=open]:text-primary";
const contentPanelClass =
  "!w-auto min-w-56 rounded-md border border-border !bg-white p-1.5 !text-charcoal shadow-lg !ring-0";
const itemClass =
  "cursor-pointer rounded-sm px-3 py-2 text-sm text-charcoal focus:!bg-cream focus:!text-primary";
const subTriggerClass =
  "cursor-pointer rounded-sm px-3 py-2 text-sm text-charcoal focus:!bg-cream focus:!text-primary data-[state=open]:!bg-cream data-[state=open]:!text-primary";
const plainLinkClass =
  "rounded-sm px-2 py-1 text-sm font-medium text-charcoal transition-colors hover:text-primary";

/**
 * DropdownMenu is click-driven by default; a site navbar is expected to open on
 * hover too, so open state is controlled here. The close is delayed so the
 * pointer can cross the gap between trigger and panel without it snapping shut.
 */
function NavDropdown({
  label,
  contentClassName,
  align = "start",
  children,
}: {
  label: string;
  contentClassName?: string;
  align?: "start" | "center" | "end";
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), 140);
  }, [cancelClose]);

  useEffect(() => cancelClose, [cancelClose]);

  const openNow = () => {
    cancelClose();
    setOpen(true);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
      <DropdownMenuTrigger
        className={triggerClass}
        onPointerEnter={openNow}
        onPointerLeave={scheduleClose}
      >
        {label}
        <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200 group-data-[state=open]:rotate-180" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        sideOffset={10}
        collisionPadding={16}
        className={cn(contentPanelClass, contentClassName)}
        // A hover-opened menu shouldn't yank focus back to the trigger when the
        // pointer simply moves away.
        onCloseAutoFocus={(event) => event.preventDefault()}
        onPointerEnter={cancelClose}
        onPointerLeave={scheduleClose}
      >
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function flattenNavNode(
  node: ProductNavNode,
  depth: number,
): { id: string; label: string; to: string; depth: number }[] {
  const entries = [{ id: node.id, label: node.label, to: node.href, depth }];
  for (const child of node.children) {
    entries.push(...flattenNavNode(child, depth + 1));
  }
  for (const product of node.products) {
    entries.push({
      id: product.id,
      label: product.label,
      to: product.href,
      depth: depth + 1,
    });
  }
  return entries;
}

/**
 * One category in the Products menu. A category with subcategories or products
 * of its own becomes a submenu (whose first entry links to the category page
 * itself, so the branch is still reachable); a bare category is a plain link.
 * Recurses, so nesting depth is whatever the DB category tree actually is.
 */
function ProductNavMenuNode({ node }: { node: ProductNavNode }) {
  const hasChildren = node.children.length > 0 || node.products.length > 0;

  if (!hasChildren) {
    return (
      <DropdownMenuItem asChild className={itemClass}>
        <Link href={node.href}>{node.label}</Link>
      </DropdownMenuItem>
    );
  }

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger className={subTriggerClass}>
        {node.label}
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent className={contentPanelClass}>
          <DropdownMenuItem asChild className={cn(itemClass, "font-medium")}>
            <Link href={node.href}>All {node.label}</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="!bg-border" />
          {node.children.map((child) => (
            <ProductNavMenuNode key={child.id} node={child} />
          ))}
          {node.products.map((product) => (
            <DropdownMenuItem key={product.id} asChild className={itemClass}>
              <Link href={product.href}>{product.label}</Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  );
}

export function SiteHeaderClient({
  productCategories,
}: {
  productCategories: ProductNavNode[];
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileGroup, setMobileGroup] = useState<string | null>(null);

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
      <div className="hidden bg-primary text-primary-foreground md:block">
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
            className="font-serif text-2xl font-semibold tracking-wide text-primary"
          >
            <Image
              src={`/premiersalt-logo.png`}
              alt=""
              width={100}
              height={100}
            />{" "}
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
            {mainNavigation.map((item) => {
              if (item.label === "Products") {
                return (
                  <NavDropdown key={item.label} label="Products">
                    {productCategories.length ? (
                      productCategories.map((root) => (
                        <ProductNavMenuNode key={root.id} node={root} />
                      ))
                    ) : (
                      <p className="px-3 py-2 text-sm text-muted-foreground">
                        Categories will appear here once they&apos;re added.
                      </p>
                    )}
                    <DropdownMenuSeparator className="!bg-border" />
                    <DropdownMenuItem
                      asChild
                      className={cn(itemClass, "font-medium")}
                    >
                      <Link href="/products">View All Products</Link>
                    </DropdownMenuItem>
                  </NavDropdown>
                );
              }

              if (item.dropdown) {
                return (
                  <NavDropdown key={item.label} label={item.label}>
                    {item.dropdown.map((link) => (
                      <DropdownMenuItem
                        key={link.to}
                        asChild
                        className={itemClass}
                      >
                        <Link href={link.to}>{link.label}</Link>
                      </DropdownMenuItem>
                    ))}
                  </NavDropdown>
                );
              }

              return (
                <Link
                  key={item.label}
                  href={item.to ?? "#"}
                  className={plainLinkClass}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href={headerCtas[0].to}
              className="hidden rounded-sm border border-primary px-4 py-2 text-xs font-semibold uppercase tracking-wide text-primary hover:bg-primary hover:text-cream md:inline-block"
            >
              {headerCtas[0].label}
            </Link>
            <Link
              href={headerCtas[1].to}
              className="hidden rounded-sm bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-wide text-cream hover:bg-primary md:inline-block"
            >
              {headerCtas[1].label}
            </Link>

            <div className="hidden items-center gap-4 border-l border-border pl-4 lg:flex">
              <Link href={retailNavigation[0].to} aria-label="Search">
                <Search className="h-4.5 w-4.5 text-charcoal hover:text-primary" />
              </Link>
              <Link href={retailNavigation[1].to} aria-label="Wishlist">
                <Heart className="h-4.5 w-4.5 text-charcoal hover:text-primary" />
              </Link>
              <Link href={retailNavigation[2].to} aria-label="Account">
                <User className="h-4.5 w-4.5 text-charcoal hover:text-primary" />
              </Link>
              <Link
                href={retailNavigation[3].to}
                aria-label="Cart"
                className="relative"
              >
                <ShoppingBag className="h-4.5 w-4.5 text-charcoal hover:text-primary" />
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
              <span className="font-serif text-xl text-primary">
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
                const flatLinks: {
                  id: string;
                  label: string;
                  to: string;
                  depth: number;
                }[] = isProducts
                  ? productCategories.flatMap((root) => flattenNavNode(root, 0))
                  : (
                      item.dropdown ??
                      item.megaMenu?.flatMap((g) => [
                        { label: g.label, to: g.to ?? "#" },
                        ...g.links,
                      ]) ??
                      []
                    ).map((link, index) => ({
                      ...link,
                      id: `${link.to}-${index}`,
                      depth: 0,
                    }));
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
                              "py-1.5 text-sm text-muted-foregroundhover:text-primary",
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
                className="rounded-sm border border-primary px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-primary"
              >
                {headerCtas[0].label}
              </Link>
              <Link
                href={headerCtas[1].to}
                onClick={() => setMobileOpen(false)}
                className="rounded-sm bg-primary px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-cream"
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
