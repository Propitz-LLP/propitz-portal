import type { MetadataRoute } from "next";
import { CANONICAL_URL } from "@/lib/siteUrl";
import { services } from "@/data/services";
import { resources } from "@/data/resources";
import { publishedPosts } from "@/data/blog";

/**
 * When the site's content last changed. A fixed date, not "now": a sitemap
 * that claims every page changed on every crawl gets its dates ignored.
 * Bump it when pages are meaningfully rewritten.
 */
const SITE_UPDATED = new Date("2026-09-21");

/** "17 Sep, 2026" from the blog data, or the site date if it can't be read. */
function postDate(date: string) {
  const d = new Date(date);
  return Number.isNaN(d.getTime()) ? SITE_UPDATED : d;
}

/**
 * Every public page, and nothing else.
 *
 * Built from the same data the pages are, so a new service, tool or article
 * appears here automatically. The account area, the auth screens and the
 * legacy spam URLs indexed under this domain are deliberately absent; see
 * robots.ts for what crawlers are told to skip, and proxy.ts for the 410 on
 * the old `?i=<number>` spam pattern.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => `${CANONICAL_URL}${path}`;

  const page = (
    path: string,
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
    priority: number,
    lastModified: Date = SITE_UPDATED
  ) => ({ url: url(path), lastModified, changeFrequency, priority });

  return [
    page("/", "weekly", 1),
    page("/services", "monthly", 0.9),
    ...services.map((s) => page(`/services/${s.slug}`, "monthly", 0.8)),
    page("/property-marketplace", "daily", 0.9),
    page("/property-marketplace?view=specialists", "weekly", 0.7),
    page("/sell", "monthly", 0.8),
    ...resources.map((r) => page(`/resources/${r.slug}`, "monthly", 0.7)),
    page("/blog", "weekly", 0.7),
    ...publishedPosts.map((p) => page(`/blog/${p.slug}`, "monthly", 0.6, postDate(p.date))),
    page("/work-with-us", "monthly", 0.6),
    page("/about-us", "monthly", 0.6),
    page("/contact-us", "monthly", 0.6),
    page("/vendor-panel-ranking-disclosure", "yearly", 0.4),
    page("/terms-of-use", "yearly", 0.3),
    page("/privacy-policy", "yearly", 0.3),
  ];
}
