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

/**
 * Shared board-entry parsing, extracted from components/ParentsBoard.tsx so
 * the carousels, the full list pages and the detail page all read the same
 * live `/api/parent-ticket/public` payload the same defensive way instead of
 * three copies of the same field-picking logic drifting apart. The upstream
 * shape is not contractually frozen beyond `{ ok, count, entries }`, so every
 * field is read defensively — a missing, null or renamed key drops quietly
 * rather than breaking a card.
 */
export type Entry = Record<string, unknown>;

function str(v: unknown): string | undefined {
  if (typeof v !== "string") return undefined;
  const t = v.trim();
  return t ? t : undefined;
}

function num(v: unknown): number | undefined {
  const n =
    typeof v === "number"
      ? v
      : typeof v === "string" && v.trim() !== ""
        ? Number(v)
        : NaN;
  return Number.isFinite(n) ? n : undefined;
}

function pick(entry: Entry, ...keys: string[]): string | undefined {
  for (const k of keys) {
    const v = str(entry[k]);
    if (v) return v;
  }
  return undefined;
}

function pickNum(entry: Entry, ...keys: string[]): number | undefined {
  for (const k of keys) {
    const v = num(entry[k]);
    if (v !== undefined) return v;
  }
  return undefined;
}

/** Render a date if it parses; otherwise show whatever the feed sent. */
export function formatEntryDate(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export type ParsedEntry = {
  raw: Entry;
  type: EnquiryType | undefined;
  isTraveller: boolean;
  reference: string | undefined;
  name: string | undefined;
  from: string | undefined;
  to: string | undefined;
  date: string | undefined;
  airline: string | undefined;
  languages: string | undefined;
  body: string | undefined;
  relationship: string | undefined;
  mobility: string | undefined;
  parentAge: number | undefined;
  capacity: number | undefined;
  amount: number | undefined;
};

/** Parse one raw feed row into every field any surface (carousel, list,
 *  detail page) needs, once — so they can't disagree on how a field is read. */
export function parseEntry(entry: Entry): ParsedEntry {
  const type = pick(entry, "enquiry_type") as EnquiryType | undefined;
  const isTraveller = type === "traveller";
  return {
    raw: entry,
    type,
    isTraveller,
    reference: pick(entry, "reference", "ref", "id"),
    name: pick(entry, "display_name", "name"),
    from: pick(entry, "from_location", "from", "origin"),
    to: pick(entry, "to_location", "to", "destination"),
    date: formatEntryDate(pick(entry, "travel_date", "date")),
    airline: pick(entry, "airline"),
    languages: pick(entry, "languages", "languages_spoken"),
    body: pick(
      entry,
      isTraveller ? "assistance_offered" : "assistance_needed",
      "assistance_offered",
      "assistance_needed",
      "notes"
    ),
    relationship: pick(entry, "relationship"),
    mobility: pick(entry, "mobility_needs"),
    parentAge: pickNum(entry, "parent_age"),
    capacity: pickNum(entry, "parents_capacity"),
    amount: pickNum(
      entry,
      isTraveller ? "assistance_fee" : "offer_amount",
      "assistance_fee",
      "offer_amount"
    ),
  };
}

/**
 * Background art for a carousel/detail card, matched from whichever real
 * place name the poster typed into `from`/`to` — not tied to enquiry type,
 * since a family's journey and a traveller's route both come from the same
 * two free-text fields. Falls back to the hero photograph (tinted, like every
 * other unmatched-location card on the site) rather than inventing a stock
 * photo for a place nobody actually typed.
 *
 * Images: public/cities/{delhi,mumbai,bangalore,hyderabad,heathrow,
 * manchester,edinburgh}.jpg — every one of these already exists and is
 * already live elsewhere on the site (components/BestFaresByCity.tsx,
 * app/flights/page.tsx, app/hotels/page.tsx), so this reuses that same
 * photography rather than introducing a second, different picture of the
 * same city under the same path.
 *
 * Matches both the full place name and its IATA airport code, since the
 * live feed's `from_location`/`to_location` fields turn out to hold codes
 * ("HYD", "LHR") rather than names in practice — every code is anchored with
 * `\b` so it only matches as a whole word, never as a substring of something
 * else typed free-text.
 */
const PLACE_IMAGES: { match: RegExp; src: string }[] = [
  { match: /delhi|new delhi|\bdel\b/i, src: "/cities/delhi.jpg" },
  { match: /mumbai|bombay|\bbom\b/i, src: "/cities/mumbai.jpg" },
  { match: /bangalore|bengaluru|\bblr\b/i, src: "/cities/bangalore.jpg" },
  { match: /hyderabad|\bhyd\b/i, src: "/cities/hyderabad.jpg" },
  { match: /dubai|\bdxb\b/i, src: "/cities/dubai.jpg" },
  {
    match: /heathrow|\blhr\b|\blondon\b|\blgw\b|\bltn\b|\blon\b/i,
    src: "/cities/heathrow.jpg",
  },
  { match: /manchester|\bman\b/i, src: "/cities/manchester.jpg" },
  {
    match: /edinburgh|scotland|glasgow|\bedi\b|\bgla\b/i,
    src: "/cities/edinburgh.jpg",
  },
];

const FALLBACK_IMAGE = "/hero/cabin-window-wing.jpg";

export function destinationImage(...locations: (string | undefined)[]): string {
  for (const loc of locations) {
    if (!loc) continue;
    const hit = PLACE_IMAGES.find((p) => p.match.test(loc));
    if (hit) return hit.src;
  }
  return FALLBACK_IMAGE;
}
