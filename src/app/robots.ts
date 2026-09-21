import type { MetadataRoute } from "next";
import { CANONICAL_URL } from "@/lib/siteUrl";

/**
 * What crawlers should and should not fetch.
 *
 * The account area and the auth screens are private or personal.
 *
 * The legacy `?i=<number>` spam URLs are deliberately NOT disallowed here:
 * proxy.ts answers them with 410 Gone, and a crawler has to be allowed to
 * fetch a URL to see that it is gone. Blocking them in robots.txt would
 * leave them indexed with their old titles.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/account/",
          "/login",
          "/register",
          "/forgot-password",
          "/auth/",
          "/api/",
        ],
      },
    ],
    sitemap: `${CANONICAL_URL}/sitemap.xml`,
    host: CANONICAL_URL,
  };
}
