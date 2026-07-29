CREATE TYPE "product_channel" AS ENUM('catalog', 'shop');--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "channel" "product_channel" DEFAULT 'catalog'::"product_channel" NOT NULL;