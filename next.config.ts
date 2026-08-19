import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Images are referenced from the live Propitz site.
    // `unoptimized` lets the browser load them directly, so the app runs
    // anywhere without an image-optimization backend.
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "propitz.com" },
      { protocol: "https", hostname: "www.propitz.com" },
      { protocol: "https", hostname: "cdn-icons-png.flaticon.com" },
    ],
  },
};

export default nextConfig;
