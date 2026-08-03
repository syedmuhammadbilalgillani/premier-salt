CREATE TABLE "blog_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"title" varchar(100) NOT NULL,
	"slug" varchar(100) NOT NULL UNIQUE,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "blog_posts" ADD COLUMN "category_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "blog_posts" DROP COLUMN "category";--> statement-breakpoint
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_category_id_blog_categories_id_fkey" FOREIGN KEY ("category_id") REFERENCES "blog_categories"("id");