import type { MetadataRoute } from "next";
import { CANONICAL_URL } from "@/lib/siteUrl";

/**
 * What crawlers should and should not fetch.
 *
 * The account area is private, and /auth and /api are endpoints rather
 * than pages — nothing there is worth fetching.
 *
 * The sign-in screens are a different case and are NOT listed here. They
 * carry a `noindex` tag instead, which is the stronger signal: a blocked
 * URL can still be indexed on the strength of a link alone, and a crawler
 * that is not allowed to fetch the page can never read the tag telling it
 * to stay away.
 *
 * The legacy spam URLs are left crawlable for the same reason: proxy.ts
 * answers them with 410 Gone, and a crawler has to be allowed to fetch a
 * URL to see that it is gone. Blocking them in robots.txt would leave
 * hundreds of thousands of them indexed under their old titles.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/account/", "/auth/", "/api/"],
      },
    ],
    sitemap: `${CANONICAL_URL}/sitemap.xml`,
    host: CANONICAL_URL,
  };
}
