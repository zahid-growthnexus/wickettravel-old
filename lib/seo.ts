/**
 * Single source of truth for SEO + NAP (Name, Address, Phone) signals.
 * Consumed by the Metadata API (app/layout.tsx), JSON-LD structured data
 * (app/page.tsx), the sitemap, robots and the OG/icon image routes so the
 * business identity stays consistent everywhere Google and AI engines read it.
 */

/** Production URL — canonical origin for metadata, JSON-LD, sitemap & robots. */
export const SITE_URL = "https://www.wickettravel.com";

export const BUSINESS = {
  name: "Wicket Travel",
  legalName: "Wicket Travel Limited",
  registration: "17001759",
  /** E.164 for tel: links + JSON-LD; keep in sync with lib/links WHATSAPP_URL. */
  phone: "+447417564704",
  phoneDisplay: "+44 7417 564704",
  email: "info@wickettravel.com",
  streetAddress: "Lampton Avenue",
  addressLocality: "Hounslow",
  addressRegion: "London",
  addressCountry: "GB",
  postalCode: "TW3 4EW",
  /** Trustpilot rating as shown on-page (TrustpilotBadge + Testimonials). */
  ratingValue: 4.8,
  reviewCount: 12480,
  sameAs: [
    "https://x.com/WicketTravel",
    "https://www.instagram.com/wickettravel/",
    "https://www.facebook.com/profile.php?id=61581927811628&sk=followers",
    "https://www.trustpilot.com/review/wickettravel.com",
  ],
} as const;

/** Sister brand — flights live here, hotels/cars/packages live there. */
export const SISTER_BRAND = {
  name: "Wicket Travel Holidays",
  url: "https://www.wickettravelholidays.com/",
} as const;

/** UK departure airports we surface — reused in copy, FAQ and structured data. */
export const UK_DEPARTURES = [
  "London Heathrow",
  "Manchester",
  "Birmingham",
  "London Gatwick",
  "London Luton",
  "Edinburgh",
] as const;
