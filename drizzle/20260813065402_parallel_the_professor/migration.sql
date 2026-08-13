CREATE TYPE "analytics_event_type" AS ENUM('view', 'click', 'purchase');--> statement-breakpoint
CREATE TABLE "analytics_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"event_type" "analytics_event_type" NOT NULL,
	"entity_type" varchar(40),
	"entity_id" uuid,
	"label" varchar(100),
	"page_url" text NOT NULL,
	"referrer" text,
	"utm_source" varchar(100),
	"utm_medium" varchar(100),
	"utm_campaign" varchar(100),
	"visitor_id" uuid NOT NULL,
	"session_id" uuid NOT NULL,
	"value" numeric(12,2),
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "analytics_events_created_at_idx" ON "analytics_events" ("created_at");--> statement-breakpoint
CREATE INDEX "analytics_events_event_type_idx" ON "analytics_events" ("event_type");--> statement-breakpoint
CREATE INDEX "analytics_events_entity_idx" ON "analytics_events" ("entity_type","entity_id");--> statement-breakpoint
CREATE INDEX "analytics_events_visitor_idx" ON "analytics_events" ("visitor_id");