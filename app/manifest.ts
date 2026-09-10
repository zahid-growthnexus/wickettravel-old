import type { MetadataRoute } from "next";
import { BUSINESS } from "@/lib/seo";

/**
 * Web app manifest — lets a browser install/pin the site with the real brand
 * name, icon and colours instead of a bare URL, and is itself a minor
 * indexing/quality signal (Lighthouse SEO + PWA checks look for one).
 * Icon files and brand colours are the ones already in use: app/icon.png,
 * app/apple-icon.png and the navy/orange tokens from app/globals.css.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${BUSINESS.name} — Cheap Flights UK`,
    short_name: BUSINESS.name,
    description:
      "Book cheap flights from the UK with Wicket Travel — best airline ticket deals to India, Dubai and worldwide.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#081a48",
    icons: [
      {
        src: "/icon.png",
        sizes: "256x256",
        type: "image/png",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
