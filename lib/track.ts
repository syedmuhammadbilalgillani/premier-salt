"use client";

// Client-side helper for the site's self-hosted tracking pixel. Fires
// "view"/"click"/"purchase" events at POST /api/track. Visitor id is an
// anonymous cookie (1 year) — no personal data is ever collected.

const VISITOR_COOKIE = "psalt_vid";
const SESSION_KEY = "psalt_sid";
const VISITOR_MAX_AGE_DAYS = 365;

function readCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function writeCookie(name: string, value: string, maxAgeDays: number) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeDays * 86400}; samesite=lax`;
}

function getVisitorId(): string {
  let id = readCookie(VISITOR_COOKIE);
  if (!id) {
    id = crypto.randomUUID();
    writeCookie(VISITOR_COOKIE, id, VISITOR_MAX_AGE_DAYS);
  }
  return id;
}

function getSessionId(): string {
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export interface TrackOptions {
  entityType?: string;
  entityId?: string;
  label?: string;
  value?: string | number;
}

export function track(eventType: "view" | "click" | "purchase", options: TrackOptions = {}) {
  if (typeof window === "undefined") return;

  const params = new URLSearchParams(window.location.search);
  const payload = {
    eventType,
    entityType: options.entityType,
    entityId: options.entityId,
    label: options.label,
    pageUrl: window.location.pathname + window.location.search,
    referrer: document.referrer || null,
    utmSource: params.get("utm_source"),
    utmMedium: params.get("utm_medium"),
    utmCampaign: params.get("utm_campaign"),
    visitorId: getVisitorId(),
    sessionId: getSessionId(),
    value: options.value !== undefined ? String(options.value) : null,
  };

  const body = JSON.stringify(payload);
  const url = "/api/track";

  if (navigator.sendBeacon) {
    navigator.sendBeacon(url, new Blob([body], { type: "application/json" }));
  } else {
    fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true }).catch(
      () => {},
    );
  }
}

export function trackClick(options: TrackOptions) {
  track("click", options);
}

export function trackPurchase(options: TrackOptions) {
  track("purchase", options);
}
