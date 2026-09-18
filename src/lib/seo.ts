import type { Metadata } from "next";

/**
 * Metadata for one public page: its title and description, plus a canonical
 * URL and OpenGraph block of its own. Without the OpenGraph block every page
 * inherits the root layout's, so shares of any page preview as the homepage.
 *
 * `path` is site-relative ("/about-us"); `metadataBase` in the root layout
 * turns it into an absolute URL.
 */
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      // The layout's "%s — PropITZ" template only applies to <title>.
      title: `${title} — PropITZ`,
      description,
      url: path,
      type: "website",
      siteName: "PropITZ",
    },
  };
}
