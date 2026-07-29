const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isValidSlug(value: string): boolean {
  return SLUG_RE.test(value);
}

export function isValidUuid(value: string): boolean {
  return UUID_RE.test(value);
}

/** A flat object of string keys to string values — no nesting, no arrays. */
export function isValidSpec(value: unknown): value is Record<string, string> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }
  return Object.values(value).every((v) => typeof v === "string");
}

/** A non-negative, finite decimal — valid for a Postgres numeric column. */
export function isValidPrice(value: unknown): value is string {
  if (typeof value !== "string" || !value.trim()) return false;
  const num = Number(value);
  return Number.isFinite(num) && num >= 0;
}
