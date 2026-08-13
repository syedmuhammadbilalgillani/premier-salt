import { and, desc, eq, gte, inArray, sql } from "drizzle-orm";

import { db } from "@/lib/db";
import { analyticsEvents, products } from "@/lib/db/schema";

export interface TrackEventInput {
  eventType: "view" | "click" | "purchase";
  entityType?: string | null;
  entityId?: string | null;
  label?: string | null;
  pageUrl: string;
  referrer?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  visitorId: string;
  sessionId: string;
  value?: string | null;
  metadata?: Record<string, unknown> | null;
}

export async function recordAnalyticsEvent(input: TrackEventInput) {
  await db.insert(analyticsEvents).values({
    eventType: input.eventType,
    entityType: input.entityType ?? null,
    entityId: input.entityId ?? null,
    label: input.label ?? null,
    pageUrl: input.pageUrl,
    referrer: input.referrer ?? null,
    utmSource: input.utmSource ?? null,
    utmMedium: input.utmMedium ?? null,
    utmCampaign: input.utmCampaign ?? null,
    visitorId: input.visitorId,
    sessionId: input.sessionId,
    value: input.value ?? null,
    metadata: input.metadata ?? null,
  });
}

const RANGE_DAYS = { "7d": 7, "30d": 30, "90d": 90 } as const;
export type AnalyticsRange = keyof typeof RANGE_DAYS;

function rangeStart(range: AnalyticsRange) {
  const days = RANGE_DAYS[range];
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

export async function getAnalyticsSummary(range: AnalyticsRange = "30d") {
  const since = rangeStart(range);
  const where = gte(analyticsEvents.createdAt, since);

  const [totals] = await db
    .select({
      views: sql<number>`count(*) filter (where ${analyticsEvents.eventType} = 'view')`.mapWith(Number),
      clicks: sql<number>`count(*) filter (where ${analyticsEvents.eventType} = 'click')`.mapWith(Number),
      purchases: sql<number>`count(*) filter (where ${analyticsEvents.eventType} = 'purchase')`.mapWith(
        Number,
      ),
      revenue: sql<string>`coalesce(sum(${analyticsEvents.value}) filter (where ${analyticsEvents.eventType} = 'purchase'), 0)`,
      visitors: sql<number>`count(distinct ${analyticsEvents.visitorId})`.mapWith(Number),
    })
    .from(analyticsEvents)
    .where(where);

  const timeseries = await db
    .select({
      day: sql<string>`to_char(date_trunc('day', ${analyticsEvents.createdAt}), 'YYYY-MM-DD')`,
      views: sql<number>`count(*) filter (where ${analyticsEvents.eventType} = 'view')`.mapWith(Number),
      clicks: sql<number>`count(*) filter (where ${analyticsEvents.eventType} = 'click')`.mapWith(Number),
      purchases: sql<number>`count(*) filter (where ${analyticsEvents.eventType} = 'purchase')`.mapWith(
        Number,
      ),
    })
    .from(analyticsEvents)
    .where(where)
    .groupBy(sql`date_trunc('day', ${analyticsEvents.createdAt})`)
    .orderBy(sql`date_trunc('day', ${analyticsEvents.createdAt})`);

  const topPages = await db
    .select({
      pageUrl: analyticsEvents.pageUrl,
      views: sql<number>`count(*) filter (where ${analyticsEvents.eventType} = 'view')`.mapWith(Number),
      clicks: sql<number>`count(*) filter (where ${analyticsEvents.eventType} = 'click')`.mapWith(Number),
    })
    .from(analyticsEvents)
    .where(where)
    .groupBy(analyticsEvents.pageUrl)
    .orderBy(desc(sql`count(*) filter (where ${analyticsEvents.eventType} = 'view')`))
    .limit(10);

  const topProductsRaw = await db
    .select({
      entityId: analyticsEvents.entityId,
      views: sql<number>`count(*) filter (where ${analyticsEvents.eventType} = 'view')`.mapWith(Number),
      clicks: sql<number>`count(*) filter (where ${analyticsEvents.eventType} = 'click')`.mapWith(Number),
    })
    .from(analyticsEvents)
    .where(and(where, eq(analyticsEvents.entityType, "product")))
    .groupBy(analyticsEvents.entityId)
    .orderBy(desc(sql`count(*) filter (where ${analyticsEvents.eventType} = 'view')`))
    .limit(10);

  const productIds = topProductsRaw.filter((p) => p.entityId).map((p) => p.entityId as string);
  const productTitles = productIds.length
    ? await db
        .select({ id: products.id, title: products.title })
        .from(products)
        .where(inArray(products.id, productIds))
    : [];
  const titleById = new Map(productTitles.map((p) => [p.id, p.title]));
  const topProducts = topProductsRaw
    .filter((p) => p.entityId)
    .map((p) => ({ ...p, title: titleById.get(p.entityId as string) ?? "Unknown product" }));

  return {
    totals: {
      views: totals?.views ?? 0,
      clicks: totals?.clicks ?? 0,
      purchases: totals?.purchases ?? 0,
      revenue: totals?.revenue ?? "0",
      visitors: totals?.visitors ?? 0,
    },
    timeseries,
    topPages,
    topProducts,
  };
}

export type AnalyticsSummary = Awaited<ReturnType<typeof getAnalyticsSummary>>;
