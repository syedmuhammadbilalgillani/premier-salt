CREATE TYPE "enquiry_status" AS ENUM('new', 'contacted', 'closed');--> statement-breakpoint
CREATE TYPE "enquiry_type" AS ENUM('quote_request', 'contact', 'private_label');--> statement-breakpoint
CREATE TABLE "enquiries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"reference" varchar(20) NOT NULL UNIQUE,
	"enquiry_seq" serial,
	"type" "enquiry_type" NOT NULL,
	"status" "enquiry_status" DEFAULT 'new'::"enquiry_status" NOT NULL,
	"full_name" varchar(150) NOT NULL,
	"company_name" varchar(150),
	"email" varchar(255) NOT NULL,
	"phone" varchar(30),
	"country" varchar(100),
	"subject" varchar(255),
	"message" text,
	"details" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "newsletter_subscribers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"email" varchar(255) NOT NULL UNIQUE,
	"subscribed_at" timestamp with time zone DEFAULT now() NOT NULL
);
