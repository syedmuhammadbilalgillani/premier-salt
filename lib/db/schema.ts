import { relations } from "drizzle-orm/_relations";
import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  jsonb,
  type AnyPgColumn,
  pgEnum,
  numeric,
  integer,
  uniqueIndex,
  serial,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),

  firstName: varchar("first_name", { length: 100 }).notNull(),

  lastName: varchar("last_name", { length: 100 }),

  email: varchar("email", { length: 255 }).notNull().unique(),

  password: text("password").notNull(),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});

export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),

  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),

  image_url: text("image_url"),
  parentCategoryId: uuid("parent_category_id").references(
    (): AnyPgColumn => categories.id,
  ),
  // Dynamic key-value pairs (e.g. Origin, Purity, Grain Size) shown on the
  // category's detail page. Flat string map — see lib/validators.ts#isValidSpec.
  spec: jsonb("spec").$type<Record<string, string>>(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});

// ---------- ENUMS ----------
export const productStatusEnum = pgEnum("product_status", [
  "draft",
  "active",
  "archived",
]);

// "catalog" — shows on its category's public page (grid + size/packing
// table, wholesale/quote-based). "shop" — excluded from the category page,
// reserved for the direct-purchase /shop module.
export const productChannelEnum = pgEnum("product_channel", [
  "catalog",
  "shop",
]);

// ---------- PRODUCTS ----------
export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),

  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),

  categoryId: uuid("category_id")
    .references(() => categories.id)
    .notNull(),

  // Base price — required for "shop" channel products (used directly, or as
  // a fallback/reference price when the product has variants). Optional for
  // "catalog" channel products, which are wholesale/quote-based and don't
  // display a fixed price.
  basePrice: numeric("base_price", { precision: 12, scale: 2 }),
  compareAtPrice: numeric("compare_at_price", { precision: 12, scale: 2 }),

  sku: varchar("sku", { length: 100 }).unique(),

  // Flat key-value specs — same pattern as categories.spec
  // e.g. { "Material": "Cotton", "Origin": "Pakistan", "Weight": "500g" }
  spec: jsonb("spec").$type<Record<string, string>>(),

  hasVariants: boolean("has_variants").default(false).notNull(),

  // Only used when hasVariants = false — variant-level stock lives on
  // productVariants.stockQuantity instead.
  stockQuantity: integer("stock_quantity").default(0).notNull(),

  status: productStatusEnum("status").default("draft").notNull(),
  channel: productChannelEnum("channel").default("catalog").notNull(),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ---------- PRODUCT IMAGES ----------
export const productImages = pgTable("product_images", {
  id: uuid("id").defaultRandom().primaryKey(),

  productId: uuid("product_id")
    .references(() => products.id, { onDelete: "cascade" })
    .notNull(),

  url: text("url").notNull(),
  altText: varchar("alt_text", { length: 255 }),
  position: integer("position").default(0).notNull(),
  isPrimary: boolean("is_primary").default(false).notNull(),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ---------- PRODUCT OPTIONS (e.g. "Color", "Size", "RAM") ----------
// These are the option TYPES a product can have — dynamic per product.
export const productOptions = pgTable("product_options", {
  id: uuid("id").defaultRandom().primaryKey(),

  productId: uuid("product_id")
    .references(() => products.id, { onDelete: "cascade" })
    .notNull(),

  name: varchar("name", { length: 100 }).notNull(), // "Color", "Size", "RAM"
  position: integer("position").default(0).notNull(),
});

// ---------- PRODUCT OPTION VALUES (e.g. "Red", "XL", "16GB") ----------
export const productOptionValues = pgTable("product_option_values", {
  id: uuid("id").defaultRandom().primaryKey(),

  optionId: uuid("option_id")
    .references(() => productOptions.id, { onDelete: "cascade" })
    .notNull(),

  value: varchar("value", { length: 100 }).notNull(), // "Red", "XL"

  // Optional: if you want value-level price effect independent of variant
  priceModifier: numeric("price_modifier", { precision: 12, scale: 2 })
    .default("0")
    .notNull(),

  position: integer("position").default(0).notNull(),
});

// ---------- PRODUCT VARIANTS (actual sellable SKUs) ----------
// Each variant = one specific combination of option values,
// with its OWN final price + stock. This is the source of truth for pricing.
export const productVariants = pgTable("product_variants", {
  id: uuid("id").defaultRandom().primaryKey(),

  productId: uuid("product_id")
    .references(() => products.id, { onDelete: "cascade" })
    .notNull(),

  sku: varchar("sku", { length: 100 }).unique(),

  price: numeric("price", { precision: 12, scale: 2 }).notNull(),
  compareAtPrice: numeric("compare_at_price", { precision: 12, scale: 2 }),

  stockQuantity: integer("stock_quantity").default(0).notNull(),

  weight: numeric("weight", { precision: 10, scale: 3 }), // for shipping calc
  imageUrl: text("image_url"),

  // Variant-specific overrides, if needed
  spec: jsonb("spec").$type<Record<string, string>>(),

  isActive: boolean("is_active").default(true).notNull(),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ---------- VARIANT <-> OPTION VALUE JOIN ----------
// Links a variant to the exact combination of option values it represents.
// e.g. Variant "V1" -> [Color: Red, Size: XL]
export const productVariantOptionValues = pgTable(
  "product_variant_option_values",
  {
    variantId: uuid("variant_id")
      .references(() => productVariants.id, { onDelete: "cascade" })
      .notNull(),

    optionValueId: uuid("option_value_id")
      .references(() => productOptionValues.id, { onDelete: "cascade" })
      .notNull(),
  },
  (table) => ({
    pk: uniqueIndex("variant_option_value_unique").on(
      table.variantId,
      table.optionValueId,
    ),
  }),
);

// ---------- RELATIONS ----------
export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  images: many(productImages),
  options: many(productOptions),
  variants: many(productVariants),
}));

export const productOptionsRelations = relations(
  productOptions,
  ({ one, many }) => ({
    product: one(products, {
      fields: [productOptions.productId],
      references: [products.id],
    }),
    values: many(productOptionValues),
  }),
);

export const productOptionValuesRelations = relations(
  productOptionValues,
  ({ one, many }) => ({
    option: one(productOptions, {
      fields: [productOptionValues.optionId],
      references: [productOptions.id],
    }),
    variantLinks: many(productVariantOptionValues),
  }),
);

export const productVariantsRelations = relations(
  productVariants,
  ({ one, many }) => ({
    product: one(products, {
      fields: [productVariants.productId],
      references: [products.id],
    }),
    optionValues: many(productVariantOptionValues),
  }),
);

export const productVariantOptionValuesRelations = relations(
  productVariantOptionValues,
  ({ one }) => ({
    variant: one(productVariants, {
      fields: [productVariantOptionValues.variantId],
      references: [productVariants.id],
    }),
    optionValue: one(productOptionValues, {
      fields: [productVariantOptionValues.optionValueId],
      references: [productOptionValues.id],
    }),
  }),
);

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  products: many(products),
  parentCategory: one(categories, {
    fields: [categories.parentCategoryId],
    references: [categories.id],
    relationName: "categoryParent",
  }),
  childCategories: many(categories, {
    relationName: "categoryParent",
  }),
}));

// ---------- ORDERS ----------
export const orderStatusEnum = pgEnum("order_status", [
  "order_received",
  "confirmed",
  "processing",
  "ready_for_dispatch",
  "dispatched",
  "delivered",
  "cancelled",
]);

export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),

  // Human-readable display number, e.g. "PS-2026-0001" — built from orderSeq
  // at insert time. orderSeq (a real DB sequence) is what guarantees
  // uniqueness; orderNumber is just its formatted, displayed form.
  orderNumber: varchar("order_number", { length: 20 }).notNull().unique(),
  orderSeq: serial("order_seq"),

  status: orderStatusEnum("status").default("order_received").notNull(),

  customerFirstName: varchar("customer_first_name", { length: 100 }).notNull(),
  customerLastName: varchar("customer_last_name", { length: 100 }).notNull(),
  customerEmail: varchar("customer_email", { length: 255 }).notNull(),
  customerPhone: varchar("customer_phone", { length: 30 }).notNull(),

  addressLine1: varchar("address_line1", { length: 255 }).notNull(),
  addressLine2: varchar("address_line2", { length: 255 }),
  addressCity: varchar("address_city", { length: 100 }).notNull(),
  addressProvince: varchar("address_province", { length: 100 }).notNull(),
  addressPostalCode: varchar("address_postal_code", { length: 20 }).notNull(),
  addressCountry: varchar("address_country", { length: 100 })
    .default("Pakistan")
    .notNull(),

  deliveryMethod: varchar("delivery_method", { length: 30 }).notNull(),
  paymentMethod: varchar("payment_method", { length: 30 }).notNull(),
  notes: text("notes"),

  subtotal: numeric("subtotal", { precision: 12, scale: 2 }).notNull(),
  discount: numeric("discount", { precision: 12, scale: 2 })
    .default("0")
    .notNull(),
  shipping: numeric("shipping", { precision: 12, scale: 2 }).notNull(),
  total: numeric("total", { precision: 12, scale: 2 }).notNull(),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ---------- ORDER LINES ----------
export const orderLines = pgTable("order_lines", {
  id: uuid("id").defaultRandom().primaryKey(),

  orderId: uuid("order_id")
    .references(() => orders.id, { onDelete: "cascade" })
    .notNull(),

  // Traceability refs, not the source of truth — an order line must survive
  // the referenced product/variant being deleted later, so these are
  // nullable and never cascade-delete the order line itself.
  productId: uuid("product_id").references(() => products.id, {
    onDelete: "set null",
  }),
  variantId: uuid("variant_id").references(() => productVariants.id, {
    onDelete: "set null",
  }),

  // Snapshot fields — what actually prints on the order, immune to later
  // edits on the product/variant.
  productSlug: varchar("product_slug", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  variantLabel: varchar("variant_label", { length: 255 }),
  sku: varchar("sku", { length: 100 }),
  price: numeric("price", { precision: 12, scale: 2 }).notNull(),
  quantity: integer("quantity").notNull(),
});

export const ordersRelations = relations(orders, ({ many }) => ({
  lines: many(orderLines),
}));

export const orderLinesRelations = relations(orderLines, ({ one }) => ({
  order: one(orders, {
    fields: [orderLines.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderLines.productId],
    references: [products.id],
  }),
  variant: one(productVariants, {
    fields: [orderLines.variantId],
    references: [productVariants.id],
  }),
}));

// ---------- ENQUIRIES (Request a Quote / Contact / Private Label leads) ----------
export const enquiryTypeEnum = pgEnum("enquiry_type", [
  "quote_request",
  "contact",
  "private_label",
]);

export const enquiryStatusEnum = pgEnum("enquiry_status", [
  "new",
  "contacted",
  "closed",
]);

export const enquiries = pgTable("enquiries", {
  id: uuid("id").defaultRandom().primaryKey(),

  // Display reference, e.g. "RFQ-2026-0001" — built from enquirySeq at
  // insert time, same pattern as orders.orderNumber/orderSeq.
  reference: varchar("reference", { length: 20 }).notNull().unique(),
  enquirySeq: serial("enquiry_seq"),

  type: enquiryTypeEnum("type").notNull(),
  status: enquiryStatusEnum("status").default("new").notNull(),

  fullName: varchar("full_name", { length: 150 }).notNull(),
  companyName: varchar("company_name", { length: 150 }),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 30 }),
  country: varchar("country", { length: 100 }),

  subject: varchar("subject", { length: 255 }),
  message: text("message"),

  // Flat key-value for the fields that differ per enquiry type (buyerType/
  // productCategory/quantity for quote_request; department for contact;
  // packaging/targetMarket/timeline for private_label) — same pattern as
  // categories.spec/products.spec.
  details: jsonb("details").$type<Record<string, string>>(),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ---------- NEWSLETTER ----------
export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  subscribedAt: timestamp("subscribed_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

