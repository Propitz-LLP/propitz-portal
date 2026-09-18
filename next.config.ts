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
        pathname: "/storage/v1/object/public/assets/**",
      },
      { protocol: "https", hostname: "cdn-icons-png.flaticon.com" },
    ],
  },
};

export default nextConfig;
