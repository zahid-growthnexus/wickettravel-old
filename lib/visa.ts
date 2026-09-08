/**
 * Shared, server-safe constants for the Dubai/UAE visa enquiry flow.
 *
 * These used to live inside components/VisaEnquiryForm.tsx, but that file is
 * "use client" — importing a plain data export from a client-boundary file
 * into a Server Component (app/visa/page.tsx) turns it into an opaque client
 * reference during RSC prerendering rather than the real array, which broke
 * `PERKS.map()` at build time. Plain data with no client-only behavior
 * belongs in a plain module so both server and client code can import the
 * real value.
 */

export const VISA_TYPES = [
  "Tourist Visa — 30 days",
  "Tourist Visa — 60 days",
  "Visit Visa",
  "Not sure yet",
];

/** Trust promises shown beside the form on both surfaces. */
export const PERKS = [
  "Eligibility checked before you pay",
  "Documents reviewed by a UAE visa expert",
  "A real person calls you back within 2 hours",
];
