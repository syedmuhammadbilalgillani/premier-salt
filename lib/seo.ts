import type { Metadata } from "next";

export const SITE_NAME = "Premier Salt";
export const SITE_URL = "https://www.premiersalt.pk";
export const DEFAULT_OG_IMAGE = "/premiersalt-logo.png";

/** Strip HTML tags from admin-authored rich text and truncate for a meta description. */
export function toPlainDescription(html: string | null | undefined, maxLength = 160): string {
  if (!html) return "";
  const text = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1).trimEnd()}…`;
}

/** Build an absolute URL under the production domain (for canonical/OG use). */
export function absoluteUrl(path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${clean}`;
}

interface BuildMetadataOptions {
  title: string;
  description: string;
  /** Path only, e.g. "/about" — used for canonical + og:url. */
  path: string;
  /** Absolute or site-relative image URL. Defaults to the site logo. */
  image?: string;
  /** "article" for blog posts, otherwise "website". */
  type?: "website" | "article";
  /** Set to hide this page from search engines (cart, checkout, account, search results, etc.). */
  noindex?: boolean;
}

/**
 * Shared metadata builder for every frontsite page — gives each page a
 * distinct title/description, a canonical URL (dedupes e.g. query-string
 * variants), and matching Open Graph + Twitter Card tags so shared links
 * render a preview card instead of nothing.
 */
export function buildMetadata({
  title,
  description,
  path,
  image,
  type = "website",
  noindex = false,
}: BuildMetadataOptions): Metadata {
  const url = absoluteUrl(path);
  const ogImage = image
    ? image.startsWith("http")
      ? image
      : absoluteUrl(image)
    : absoluteUrl(DEFAULT_OG_IMAGE);

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: noindex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      images: [{ url: ogImage }],
      type,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}
