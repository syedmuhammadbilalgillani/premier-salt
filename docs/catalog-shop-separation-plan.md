# Plan: separate Catalog (B2B) and Shop (retail)

Branch: `feat/separate-catalog-shop`

## Today
- One `products` table; `products.channel` = `catalog` | `shop`.
- One `categories` table (with `spec`, used only by B2B category pages).
- Catalog products: category pages, quote-based, price optional.
- Shop products: `/shop`, cart, orders. Orders already reject non-shop products
  (`lib/order.ts`).
- Mixed concerns: one admin product form, one `/api/product` route, and
  `lib/product.ts` (540 lines) serving both.

## Decision
Keep ONE categories table; separate at the product level and in the code.
Do not create two category tables (duplicate slugs and admin work).
Add `categories.channel` (`catalog` | `shop` | `both`, default `both`) only if
the shop needs its own category tree.

## Phases (each is a separate, shippable PR)

### Phase 0 – Safety (before touching data)
- Take a backup from /admin/backup and keep it.
- Fix first: stock oversell race in `lib/order.ts`; `%` wildcard leak in
  `findOrderByNumberAndEmail`.

### Phase 1 – Split the code, no DB change
- `lib/product.ts` -> `lib/catalog.ts` (catalog reads) + `lib/shop.ts`
  (shop reads, `getShopProducts`, `getShopProductBySlug`) + shared `lib/product.ts`
  (types, `replaceProductChildren`).
- `/api/product` keeps working; add `channel` filter to its GET so admin lists
  can ask for one side.
- Result: each module imports only its own reads. Easy to review, zero risk.

### Phase 2 – Split the admin UI
- Sidebar: "Catalog" and "Shop" groups instead of one "Products".
  - `/admin/catalog/products`, `/admin/shop/products` (+ new/edit).
  - Old `/admin/products/*` redirects.
- `ProductForm` takes a fixed `channel` prop; remove the channel dropdown.
  - Catalog form: spec, sizes/packing table, no price/stock.
  - Shop form: price, stock, variants, SKU required.
- Products list tables filtered per channel.

### Phase 3 – Split the API
- `/api/product/*` (admin, gated) -> `/api/admin/catalog/products`,
  `/api/admin/shop/products`, sharing validators.
- Public routes stay: `/api/shop/products`, `/api/navigation/products`.
- Update `proxy.ts` matcher; keep Googlebot-readable endpoints public.

### Phase 4 – Schema (only if Phase 1–3 show real need)
- Option A (recommended): keep `channel` column, add a CHECK constraint
  (shop => `basePrice` not null) and indexes on (`channel`, `status`).
- Option B: new `shop_products` / `catalog_products` tables. Needs a data
  migration, order_lines FK changes, and backup/restore updates. Only worth it
  if the two sides keep diverging in fields (weight, tax, reviews).
- Categories: add `categories.channel` if the shop needs separate categories;
  shop UI then hides `spec`.

### Phase 5 – Storefront cleanup
- Home: featured products come from shop, categories from catalog.
- Search page: query both, show results in two groups.
- Sitemap: separate sections per module.
- Cart/checkout untouched (already shop-only).

## Risks / checks
- Existing rows: all current products keep their `channel`; no data moves in
  Phases 1–3.
- Slugs are globally unique across channels; keep that (URL clash otherwise).
- `lib/backup.ts` fingerprints the schema: any Phase 4 change needs a new
  backup after it (old backups will be refused by restore).
- Cached tags (`unstable_cache`): invalidate both when a product's channel
  changes.

## Definition of done
- No file under catalog code imports shop reads and vice versa.
- Admin has separate Catalog and Shop product screens.
- `tsc` and `eslint` clean; manual pass: create/edit one product per channel,
  place a shop order, open a category page.
