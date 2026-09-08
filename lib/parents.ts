/**
 * Shared, server-safe constants for the Parents Tickets flow.
 *
 * Kept in a plain module (not inside the "use client" form) for the same reason
 * lib/visa.ts exists: importing plain data out of a client-boundary file into a
 * Server Component turns it into an opaque client reference during RSC
 * prerendering instead of the real array, and `.map()` then fails at build time.
 *
 * Option lists are deliberately open-ended at the end ("Other …") so nobody is
 * forced to misdescribe a real situation to fit a dropdown.
 */

/** Who the requester is to the person travelling. Sent as `relationship`. */
export const RELATIONSHIPS = [
  "Son",
  "Daughter",
  "Grandchild",
  "Niece / Nephew",
  "Other relative",
  "Friend / Carer",
] as const;

/** Sent as `mobility_needs`. Plain language, not clinical. */
export const MOBILITY_NEEDS = [
  "None — just company and reassurance",
  "Wheelchair assistance",
  "Walking aid / slow on their feet",
  "Visual impairment",
  "Hearing impairment",
  "Other (described in the notes)",
] as const;

/** The two sides of the board. `key` is the exact `enquiry_type` the API takes. */
export const ROLES = [
  {
    key: "requester",
    label: "I need help for a relative",
    blurb:
      "Someone in your family is flying alone and you would rather they were not.",
  },
  {
    key: "traveller",
    label: "I want to help someone",
    blurb:
      "You are already flying that route and are happy to keep someone company.",
  },
] as const;

export type EnquiryType = (typeof ROLES)[number]["key"];
