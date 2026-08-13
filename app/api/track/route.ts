import { NextRequest, NextResponse } from "next/server";

import { recordAnalyticsEvent } from "@/lib/analytics";
import { isValidUuid } from "@/lib/validators";

// Public ingest endpoint for the site's own tracking pixel — called via
// navigator.sendBeacon/fetch from the client tracker. Not covered by any
// middleware matcher.

const EVENT_TYPES = ["view", "click", "purchase"] as const;

interface TrackPayload {
  eventType?: unknown;
  entityType?: unknown;
  entityId?: unknown;
  label?: unknown;
  pageUrl?: unknown;
  referrer?: unknown;
  utmSource?: unknown;
  utmMedium?: unknown;
  utmCampaign?: unknown;
  visitorId?: unknown;
  sessionId?: unknown;
  value?: unknown;
}

function isValidNumericString(value: unknown): value is string {
  if (typeof value !== "string" || !value.trim()) return false;
  const num = Number(value);
  return Number.isFinite(num) && num >= 0;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => null)) as TrackPayload | null;
    if (!body) {
      return NextResponse.json({ success: false, error: "Invalid request body." }, { status: 400 });
    }

    const { eventType, entityType, entityId, label, pageUrl, referrer, utmSource, utmMedium, utmCampaign, visitorId, sessionId, value } =
      body;

    if (typeof eventType !== "string" || !EVENT_TYPES.includes(eventType as never)) {
      return NextResponse.json({ success: false, error: "Invalid event type." }, { status: 400 });
    }
    if (typeof pageUrl !== "string" || !pageUrl.trim()) {
      return NextResponse.json({ success: false, error: "pageUrl is required." }, { status: 400 });
    }
    if (typeof visitorId !== "string" || !isValidUuid(visitorId)) {
      return NextResponse.json({ success: false, error: "Invalid visitorId." }, { status: 400 });
    }
    if (typeof sessionId !== "string" || !isValidUuid(sessionId)) {
      return NextResponse.json({ success: false, error: "Invalid sessionId." }, { status: 400 });
    }
    if (entityId !== undefined && entityId !== null && !isValidUuid(entityId as string)) {
      return NextResponse.json({ success: false, error: "Invalid entityId." }, { status: 400 });
    }
    if (value !== undefined && value !== null && !isValidNumericString(value)) {
      return NextResponse.json({ success: false, error: "Invalid value." }, { status: 400 });
    }

    await recordAnalyticsEvent({
      eventType: eventType as (typeof EVENT_TYPES)[number],
      entityType: typeof entityType === "string" ? entityType.slice(0, 40) : null,
      entityId: (entityId as string) ?? null,
      label: typeof label === "string" ? label.slice(0, 100) : null,
      pageUrl: pageUrl.slice(0, 2048),
      referrer: typeof referrer === "string" ? referrer.slice(0, 2048) : null,
      utmSource: typeof utmSource === "string" ? utmSource.slice(0, 100) : null,
      utmMedium: typeof utmMedium === "string" ? utmMedium.slice(0, 100) : null,
      utmCampaign: typeof utmCampaign === "string" ? utmCampaign.slice(0, 100) : null,
      visitorId,
      sessionId,
      value: (value as string) ?? null,
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Error recording analytics event", error);
    return NextResponse.json({ success: false, error: "Failed to record event." }, { status: 500 });
  }
}
