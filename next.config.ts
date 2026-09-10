import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Serve AVIF first (smallest, best for LCP + mobile), then WebP, then the
    // browser falls back to the original format. Applies to every next/image —
    // hero, hotel/city cards, resort collage — with no visual change.
    formats: ["image/avif", "image/webp"],
    // No remotePatterns: every next/image on the site now serves from /public.
    // The last hotlinked source (an images.unsplash.com photo on /about) has
    // been replaced with a local file — see public/about/above-the-clouds.jpg
    // — so an external allowlist entry here would be unused surface area.
  },
};

export default nextConfig;
