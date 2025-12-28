import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Disable static imports to allow dynamic image loading
    disableStaticImages: false,
    // Configure cache headers for images
    minimumCacheTTL: 60, // 1 minute cache TTL for development
    unoptimized: process.env.NODE_ENV === "development", // Disable optimization in dev for faster iteration
  },
  // Add headers to prevent aggressive caching in dev
  async headers() {
    return [
      {
        source: "/assets/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=60, must-revalidate",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
