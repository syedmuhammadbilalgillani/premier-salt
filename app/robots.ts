import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          // Public, unauthenticated, read-only endpoints that the storefront
          // fetches client-side for real page content (shop grid, nav mega-menu,
          // category list, blog listing). Without an explicit allow here, the
          // blanket "/api" disallow below hides that data from Googlebot's
          // renderer, so those sections show up empty in the indexed page —
          // this is what Search Console's "blocked by robots.txt" flag on
          // /api/shop/products was reporting. Everything else under /api is a
          // real admin/auth-gated route (or write-only) and stays blocked.
          "/api/shop/products",
          "/api/navigation/products",
          "/api/site-categories",
          "/api/blog-posts",
        ],
        disallow: [
          "/admin",
          "/api",
          "/cart",
          "/checkout",
          "/order-confirmation",
          "/wishlist",
          "/search",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
