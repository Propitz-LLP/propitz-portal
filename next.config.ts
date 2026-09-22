import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Site media is served from Supabase Storage (see `IMG` in src/data/site.ts).
    // `unoptimized` lets the browser load images directly, so the app runs
    // anywhere without an image-optimization backend.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "vkrlvjnsunciemrxtlfs.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      { protocol: "https", hostname: "cdn-icons-png.flaticon.com" },
    ],
  },
  async redirects() {
    return [
      // Service pages that were once at the site root (SEO cleanup, Sept 2026).
      {
        source: "/transactional-structuring-support",
        destination: "/services/transactional-structuring-support",
        // 301 rather than Next's default 308: what the SEO brief asked for,
        // and every crawler and link checker understands it.
        statusCode: 301,
      },
      {
        source: "/professional-network-access",
        destination: "/services/professional-network-access",
        statusCode: 301,
      },
    ];
  },
};

export default nextConfig;
