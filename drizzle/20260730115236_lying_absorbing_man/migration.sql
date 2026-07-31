CREATE TYPE "order_status" AS ENUM('order_received', 'confirmed', 'processing', 'ready_for_dispatch', 'dispatched', 'delivered', 'cancelled');--> statement-breakpoint
CREATE TABLE "order_lines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"order_id" uuid NOT NULL,
	"product_id" uuid,
	"variant_id" uuid,
	"product_slug" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"variant_label" varchar(255),
	"sku" varchar(100),
	"price" numeric(12,2) NOT NULL,
	"quantity" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"order_number" varchar(20) NOT NULL UNIQUE,
	"order_seq" serial,
	"status" "order_status" DEFAULT 'order_received'::"order_status" NOT NULL,
	"customer_first_name" varchar(100) NOT NULL,
	"customer_last_name" varchar(100) NOT NULL,
	"customer_email" varchar(255) NOT NULL,
	"customer_phone" varchar(30) NOT NULL,
	"address_line1" varchar(255) NOT NULL,
	"address_line2" varchar(255),
	"address_city" varchar(100) NOT NULL,
	"address_province" varchar(100) NOT NULL,
	"address_postal_code" varchar(20) NOT NULL,
	"address_country" varchar(100) DEFAULT 'Pakistan' NOT NULL,
	"delivery_method" varchar(30) NOT NULL,
	"payment_method" varchar(30) NOT NULL,
	"notes" text,
	"subtotal" numeric(12,2) NOT NULL,
	"discount" numeric(12,2) DEFAULT '0' NOT NULL,
	"shipping" numeric(12,2) NOT NULL,
	"total" numeric(12,2) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "order_lines" ADD CONSTRAINT "order_lines_order_id_orders_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "order_lines" ADD CONSTRAINT "order_lines_product_id_products_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "order_lines" ADD CONSTRAINT "order_lines_variant_id_product_variants_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "product_variants"("id") ON DELETE SET NULL;