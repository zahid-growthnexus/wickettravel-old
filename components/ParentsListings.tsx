"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { useReducedMotion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  CalendarDays,
  Globe,
  HandHeart,
  HeartHandshake,
  Languages,
  Loader2,
  Lock,
  MapPin,
  Plane,
  RefreshCw,
  SlidersHorizontal,
  Sparkles,
  UserRound,
  Users,
} from "lucide-react";
import { Reveal } from "@/components/motion-primitives";
import { cn } from "@/lib/cn";
import { PORTAL_LOGIN_URL } from "@/lib/links";

/**
 * Live "Parents Tickets" community feed. Fetches approved, anonymised public
 * entries from our same-origin read relay (app/api/parent-ticket/public →
 * portal) and shows them in two continuously scrolling lanes:
 *   • Travellers who can help  (enquiry_type "traveller") — scrolls right→left
 *   • Families who need help    (enquiry_type "requester") — scrolls left→right
 *
 * Only the fields the endpoint returns are shown — there are NO contact details
 * in the payload, and we never invent entries. Cards render cleanly when the
 * optional fields (airline, languages, assistance_*) are null. The feed degrades
 * gracefully: a friendly message on error/429, a warm "be the first" empty
 * state when there's nothing yet, and a calm static row (no marquee) when a lane
 * has only a few entries or the visitor prefers reduced motion.
 */

const ENDPOINT = "/api/parent-ticket/public";

// Below this count a lane renders as a calm, centred static row instead of a
// scrolling marquee — so 1–3 entries never look like a stuttering carousel.
const STATIC_MAX = 4;
// A marquee's base track is padded up to this many cards so the loop always
// fills the width and never leaves an obvious gap on wide screens.
const MIN_LANE = 6;

type Kind = "traveller" | "requester";

type Entry = {
  reference: string;
  enquiry_type: Kind;
  display_name: string | null;
  from_location: string | null;
  to_location: string | null;
  travel_date: string | null;
  airline: string | null;
  languages: string | null;
  assistance_offered: string | null;
  assistance_needed: string | null;
};

type Status = "loading" | "ready" | "error" | "rate_limited";

/* ── Helpers ──────────────────────────────────────────────────────────── */

/** Coerce an untrusted API row into a clean Entry, or null if unusable. */
function normalise(raw: unknown): Entry | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const s = (v: unknown) =>
    typeof v === "string" && v.trim() ? v.trim() : null;
  const type = r.enquiry_type;
  if (type !== "traveller" && type !== "requester") return null;
  return {
    reference: s(r.reference) ?? "",
    enquiry_type: type,
    display_name: s(r.display_name),
    from_location: s(r.from_location),
    to_location: s(r.to_location),
    travel_date: s(r.travel_date),
    airline: s(r.airline),
    languages: s(r.languages),
    assistance_offered: s(r.assistance_offered),
    assistance_needed: s(r.assistance_needed),
  };
}

function initials(name: string | null): string {
  if (!name) return "";
  const parts = name
    .replace(/[^\p{L}\s.'-]/gu, "")
    .split(/\s+/)
    .filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
  return (first + last).toUpperCase();
}

function formatDate(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso.length <= 10 ? `${iso}T00:00:00` : iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function monthKey(iso: string | null): string | null {
  if (!iso || !/^\d{4}-\d{2}/.test(iso)) return null;
  return iso.slice(0, 7); // YYYY-MM
}

function monthLabel(ym: string): string {
  const d = new Date(`${ym}-01T00:00:00`);
  if (Number.isNaN(d.getTime())) return ym;
  return d.toLocaleDateString("en-GB", { month: "short", year: "numeric" });
}

/* ── Listing card ─────────────────────────────────────────────────────── */

function MetaChip({
  icon: Icon,
  children,
}: {
  icon: typeof Plane;
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-navy-50 px-2.5 py-1 text-[11px] font-semibold text-navy-700 ring-1 ring-navy-100">
      <Icon className="h-3 w-3 shrink-0 text-navy-400" aria-hidden="true" />
      <span className="truncate">{children}</span>
    </span>
  );
}

function ListingCard({
  entry,
  className,
}: {
  entry: Entry;
  className?: string;
}) {
  const isTraveller = entry.enquiry_type === "traveller";
  const name = entry.display_name ?? "A Wicket member";
  const date = formatDate(entry.travel_date);
  const blurb = isTraveller ? entry.assistance_offered : entry.assistance_needed;
  const hasRoute = entry.from_location && entry.to_location;
  const monogram = initials(entry.display_name);

  return (
    <article
      className={cn(
        "flex flex-col rounded-2xl bg-white p-4 text-left shadow-lg shadow-navy-950/20 ring-1 ring-white/40 sm:p-5",
        className
      )}
    >
      {/* Header — who they are + intent */}
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-extrabold",
            isTraveller
              ? "bg-accent-50 text-accent-600 ring-1 ring-accent-200"
              : "bg-navy-50 text-navy-700 ring-1 ring-navy-100"
          )}
          aria-hidden="true"
        >
          {monogram || <UserRound className="h-5 w-5" />}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-navy-900">{name}</p>
          <span
            className={cn(
              "mt-0.5 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide",
              isTraveller ? "text-accent-600" : "text-navy-600"
            )}
          >
            {isTraveller ? (
              <>
                <HandHeart className="h-3 w-3" aria-hidden="true" />
                Can help
              </>
            ) : (
              <>
                <HeartHandshake className="h-3 w-3" aria-hidden="true" />
                Needs a companion
              </>
            )}
          </span>
        </div>
      </div>

      {/* Route — from → to with a flight motif */}
      {hasRoute ? (
        <div className="mt-4 flex items-center gap-2">
          <span className="min-w-0 flex-1 truncate text-right text-sm font-bold text-navy-900">
            {entry.from_location}
          </span>
          <span
            className="relative grid h-6 w-11 shrink-0 place-items-center"
            aria-hidden="true"
          >
            <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-navy-200 via-accent-400 to-navy-200" />
            <Plane className="relative h-3.5 w-3.5 rotate-45 text-accent-500" />
          </span>
          <span className="min-w-0 flex-1 truncate text-sm font-bold text-navy-900">
            {entry.to_location}
          </span>
        </div>
      ) : (
        (entry.from_location || entry.to_location) && (
          <p className="mt-4 flex items-center gap-1.5 text-sm font-bold text-navy-900">
            <MapPin className="h-3.5 w-3.5 text-accent-500" aria-hidden="true" />
            {entry.from_location ?? entry.to_location}
          </p>
        )
      )}

      {/* Optional meta — only what's present */}
      {(date || entry.airline || entry.languages) && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {date && <MetaChip icon={CalendarDays}>{date}</MetaChip>}
          {entry.airline && <MetaChip icon={Plane}>{entry.airline}</MetaChip>}
          {entry.languages && (
            <MetaChip icon={Languages}>{entry.languages}</MetaChip>
          )}
        </div>
      )}

      {/* A glimpse of what they wrote — clamped */}
      {blurb && (
        <p className="mt-3 line-clamp-2 rounded-lg bg-navy-50/70 px-2.5 py-2 text-xs leading-relaxed text-slate-600">
          {blurb}
        </p>
      )}
    </article>
  );
}

/* ── Lanes ────────────────────────────────────────────────────────────── */

const CARD_MARQUEE = "w-[280px] shrink-0 sm:w-[300px]";
const CARD_STATIC = "w-[280px] max-w-full";

/** Calm, centred, wrapping row — used for small lanes and reduced motion. */
function StaticLane({ items }: { items: Entry[] }) {
  return (
    <div className="flex flex-wrap justify-center gap-4 sm:gap-5">
      {items.map((e, i) => (
        <ListingCard
          key={`${e.reference}-${i}`}
          entry={e}
          className={CARD_STATIC}
        />
      ))}
    </div>
  );
}

/** Seamless infinite marquee (two identical rows, track shifts −50%). */
function MarqueeLane({
  items,
  reverse,
}: {
  items: Entry[];
  reverse: boolean;
}) {
  // Pad the base track up to MIN_LANE cards so the loop always fills the width.
  let base = items;
  if (base.length < MIN_LANE) {
    const reps = Math.ceil(MIN_LANE / base.length);
    base = Array.from({ length: reps }, () => items).flat();
  }
  // Slow & readable: ~6s per card keeps the velocity constant and calm.
  const duration = Math.max(28, base.length * 6);

  const row = (dup: boolean) => (
    <div
      aria-hidden={dup || undefined}
      className="flex shrink-0 items-stretch gap-4 pr-4 sm:gap-5 sm:pr-5"
    >
      {base.map((e, i) => (
        <ListingCard
          key={`${dup ? "dup-" : ""}${e.reference}-${i}`}
          entry={e}
          className={CARD_MARQUEE}
        />
      ))}
    </div>
  );

  return (
    <div className="marquee marquee-mask overflow-hidden py-1">
      <div
        className={cn("marquee-track", reverse && "marquee-track--reverse")}
        style={{ "--marquee-duration": `${duration}s` } as CSSProperties}
      >
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}

function Lane({ items, reverse }: { items: Entry[]; reverse: boolean }) {
  const reduce = useReducedMotion();
  if (reduce || items.length <= STATIC_MAX) {
    return <StaticLane items={items} />;
  }
  return <MarqueeLane items={items} reverse={reverse} />;
}

/* ── Filter chips ─────────────────────────────────────────────────────── */

function Chip({
  active,
  onClick,
  icon: Icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon?: typeof Plane;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-950",
        active
          ? "border-accent-400 bg-accent-500 text-white shadow-sm"
          : "border-white/25 bg-white/10 text-navy-50 hover:bg-white/20"
      )}
    >
      {Icon && <Icon className="h-3.5 w-3.5" aria-hidden="true" />}
      {children}
    </button>
  );
}

/* ── Group heading ────────────────────────────────────────────────────── */

function GroupHeading({
  kind,
  count,
}: {
  kind: Kind;
  count: number;
}) {
  const isTraveller = kind === "traveller";
  const Icon = isTraveller ? HandHeart : HeartHandshake;
  return (
    <div className="mb-4 flex items-center gap-3">
      <span
        className={cn(
          "grid h-9 w-9 shrink-0 place-items-center rounded-xl ring-1",
          isTraveller
            ? "bg-accent-500/15 text-accent-400 ring-accent-400/30"
            : "bg-white/10 text-navy-100 ring-white/20"
        )}
        aria-hidden="true"
      >
        <Icon className="h-4.5 w-4.5" />
      </span>
      <div>
        <h4 className="text-base font-bold text-white sm:text-lg">
          {isTraveller ? "Travellers who can help" : "Families who need help"}
        </h4>
        <p className="text-xs text-navy-100/70">
          {isTraveller
            ? "Kind souls already flying your parent's route"
            : "Loved ones hoping for a hand along the way"}
          {count > 0 && (
            <span className="ml-1.5 font-semibold text-navy-100/90">
              · {count} {count === 1 ? "post" : "posts"}
            </span>
          )}
        </p>
      </div>
    </div>
  );
}

/** Invite shown when a whole group is empty — turns absence into a nudge. */
function GroupInvite({ kind }: { kind: Kind }) {
  const isTraveller = kind === "traveller";
  return (
    <div className="rounded-2xl border border-dashed border-white/20 bg-white/[0.04] p-6 text-center">
      <p className="text-sm text-navy-100/85">
        {isTraveller
          ? "No travellers have offered on these routes yet."
          : "No families are waiting on these routes right now."}
      </p>
      <p className="mt-1 text-sm font-semibold text-white">
        {isTraveller
          ? "Flying soon? You could be the first to offer a hand."
          : "Need a companion? Be the first to post your parent's trip."}
      </p>
    </div>
  );
}

/* ── Section ──────────────────────────────────────────────────────────── */

function scrollToForm() {
  document
    .getElementById("pt-fullName")
    ?.scrollIntoView({ behavior: "smooth", block: "center" });
}

export default function ParentsListings() {
  const [status, setStatus] = useState<Status>("loading");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [airport, setAirport] = useState<string | null>(null);
  const [month, setMonth] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setStatus("loading");

    (async () => {
      try {
        const res = await fetch(`${ENDPOINT}?limit=50`, {
          signal: controller.signal,
          headers: { Accept: "application/json" },
        });
        if (res.status === 429) {
          setStatus("rate_limited");
          return;
        }
        const data: unknown = await res.json().catch(() => null);
        if (
          !res.ok ||
          !data ||
          typeof data !== "object" ||
          (data as { ok?: unknown }).ok !== true
        ) {
          setStatus("error");
          return;
        }
        const list = Array.isArray((data as { entries?: unknown }).entries)
          ? (data as { entries: unknown[] }).entries
          : [];
        setEntries(list.map(normalise).filter((e): e is Entry => e !== null));
        setStatus("ready");
      } catch (err) {
        if ((err as Error)?.name === "AbortError") return;
        setStatus("error");
      }
    })();

    return () => controller.abort();
  }, [reloadKey]);

  // Filter options come from ALL entries so chips stay stable while filtering.
  const airports = useMemo(() => {
    const seen = new Map<string, string>();
    for (const e of entries) {
      if (e.from_location) {
        const key = e.from_location.toLowerCase();
        if (!seen.has(key)) seen.set(key, e.from_location);
      }
    }
    return [...seen.values()].sort((a, b) => a.localeCompare(b)).slice(0, 8);
  }, [entries]);

  const months = useMemo(() => {
    const set = new Set<string>();
    for (const e of entries) {
      const k = monthKey(e.travel_date);
      if (k) set.add(k);
    }
    return [...set].sort();
  }, [entries]);

  const filtered = useMemo(() => {
    return entries.filter((e) => {
      if (
        airport &&
        (e.from_location ?? "").toLowerCase() !== airport.toLowerCase()
      ) {
        return false;
      }
      if (month && monthKey(e.travel_date) !== month) return false;
      return true;
    });
  }, [entries, airport, month]);

  const travellersAll = entries.filter((e) => e.enquiry_type === "traveller");
  const requestersAll = entries.filter((e) => e.enquiry_type === "requester");
  const travellers = filtered.filter((e) => e.enquiry_type === "traveller");
  const requesters = filtered.filter((e) => e.enquiry_type === "requester");

  const showFilters =
    status === "ready" &&
    entries.length > 0 &&
    (airports.length > 1 || months.length > 1);

  const reload = () => setReloadKey((k) => k + 1);

  return (
    <div className="mt-16 lg:mt-24">
      <Reveal className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2">
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-500" />
          </span>
          <span className="t-eyebrow text-white">Our community, live</span>
        </span>
        <h3 className="t-h2 mt-5 text-[clamp(1.6rem,1.2rem+1.6vw,2.25rem)] text-white">
          People helping people, right now
        </h3>
        <p className="section-lead t-body-lg mt-4 text-navy-100/85">
          Real travellers offering a hand, and real families looking for one —
          on their way through airports just like yours.
        </p>
      </Reveal>

      {/* Loading */}
      {status === "loading" && (
        <div
          className="mt-10 flex items-center justify-center gap-2 py-16 text-navy-100/80"
          role="status"
          aria-live="polite"
        >
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
          <span className="text-sm font-medium">Loading the community feed…</span>
        </div>
      )}

      {/* Error / rate limited — never a broken section */}
      {(status === "error" || status === "rate_limited") && (
        <div className="mx-auto mt-10 max-w-lg rounded-2xl border border-white/15 bg-white/[0.06] p-8 text-center">
          <span
            className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-white/10 text-accent-400"
            aria-hidden="true"
          >
            <AlertCircle className="h-7 w-7" />
          </span>
          <p className="mt-5 text-base font-bold text-white">
            {status === "rate_limited"
              ? "The community feed is very busy right now"
              : "We couldn't load the community feed just now"}
          </p>
          <p className="mt-2 text-sm text-navy-100/80">
            {status === "rate_limited"
              ? "Please give it a moment and try again — everyone's welcome here."
              : "It's not you — please try again in a moment."}
          </p>
          <button
            type="button"
            onClick={reload}
            className="btn-outline mt-6 h-11 px-5"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Try again
          </button>
        </div>
      )}

      {/* Empty — warm invitation to be first */}
      {status === "ready" && entries.length === 0 && (
        <div className="mx-auto mt-10 max-w-2xl overflow-hidden rounded-2xl border border-white/15 bg-white/[0.06] p-8 text-center sm:p-12">
          <span
            className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-accent-500/15 text-accent-400 ring-1 ring-accent-400/30"
            aria-hidden="true"
          >
            <Sparkles className="h-8 w-8" />
          </span>
          <h4 className="mt-6 text-xl font-extrabold text-white sm:text-2xl">
            Be the first to start the journey
          </h4>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-navy-100/85 sm:text-base">
            Our community is just taking off. Post your route — whether you can
            help a parent or need a companion for yours — and we'll gently match
            you with the right person heading the same way.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={scrollToForm}
              className="btn-primary h-12 w-full px-6 sm:w-auto"
            >
              <HandHeart className="h-4 w-4" aria-hidden="true" />
              Post your journey
            </button>
            <a
              href={PORTAL_LOGIN_URL}
              className="btn-outline h-12 w-full border-white/25 bg-white/10 px-6 text-white hover:bg-white/20 sm:w-auto"
            >
              Register or sign in
            </a>
          </div>
        </div>
      )}

      {/* Ready with entries */}
      {status === "ready" && entries.length > 0 && (
        <>
          {showFilters && (
            <div className="mt-9 space-y-3">
              {airports.length > 1 && (
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <span className="mr-1 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-navy-100/75">
                    <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
                    Airport
                  </span>
                  <Chip active={!airport} onClick={() => setAirport(null)}>
                    All airports
                  </Chip>
                  {airports.map((a) => (
                    <Chip
                      key={a}
                      icon={Plane}
                      active={airport === a}
                      onClick={() => setAirport(airport === a ? null : a)}
                    >
                      {a}
                    </Chip>
                  ))}
                </div>
              )}
              {months.length > 1 && (
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <span className="mr-1 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-navy-100/75">
                    <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                    Month
                  </span>
                  <Chip active={!month} onClick={() => setMonth(null)}>
                    Any month
                  </Chip>
                  {months.map((m) => (
                    <Chip
                      key={m}
                      active={month === m}
                      onClick={() => setMonth(month === m ? null : m)}
                    >
                      {monthLabel(m)}
                    </Chip>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="mt-10 space-y-12">
            {/* Travellers who can help — scrolls right → left */}
            <div>
              <GroupHeading kind="traveller" count={travellersAll.length} />
              {travellersAll.length === 0 ? (
                <GroupInvite kind="traveller" />
              ) : travellers.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-white/20 bg-white/[0.04] px-6 py-8 text-center text-sm text-navy-100/80">
                  No travellers match these filters — try another airport or
                  month.
                </p>
              ) : (
                <Lane items={travellers} reverse={false} />
              )}
            </div>

            {/* Families who need help — scrolls left → right */}
            <div>
              <GroupHeading kind="requester" count={requestersAll.length} />
              {requestersAll.length === 0 ? (
                <GroupInvite kind="requester" />
              ) : requesters.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-white/20 bg-white/[0.04] px-6 py-8 text-center text-sm text-navy-100/80">
                  No families match these filters — try another airport or month.
                </p>
              ) : (
                <Lane items={requesters} reverse />
              )}
            </div>
          </div>

          {/* Teaser → sign-up */}
          <div className="mt-12 overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-r from-white/[0.09] to-white/[0.04] p-6 sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-7">
            <div className="flex items-start gap-3">
              <span
                className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent-500 text-white"
                aria-hidden="true"
              >
                <Lock className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-bold text-white sm:text-base">
                  You're seeing just a glimpse
                </p>
                <p className="mt-1 max-w-xl text-sm text-navy-100/80">
                  Full details are shared once you're registered, so everyone's
                  privacy stays protected. Sign in to see the full picture and
                  connect with your match.
                </p>
              </div>
            </div>
            <a
              href={PORTAL_LOGIN_URL}
              className="btn-primary mt-4 h-12 w-full whitespace-nowrap px-6 sm:mt-0 sm:w-auto"
            >
              Register to connect
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </>
      )}

      {/* Reassurance strip */}
      {status === "ready" && (
        <p className="mt-8 flex items-center justify-center gap-2 text-center text-xs text-navy-100/75">
          <Globe className="h-3.5 w-3.5 shrink-0 text-accent-400" aria-hidden="true" />
          Names are shortened and contact details are never shown publicly.
          Entries appear only after our team reviews them.
        </p>
      )}
    </div>
  );
}
