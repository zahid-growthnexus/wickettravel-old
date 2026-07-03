import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Serve AVIF first (smallest, best for LCP + mobile), then WebP, then the
    // browser falls back to the original format. Applies to every next/image —
    // hero, hotel/city cards, resort collage — with no visual change.
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
