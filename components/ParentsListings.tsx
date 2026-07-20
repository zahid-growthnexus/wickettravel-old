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
  Loader2,
  Lock,
  Plane,
  RefreshCw,
  SlidersHorizontal,
  Sparkles,
  UserRound,
} from "lucide-react";
import { Reveal } from "@/components/motion-primitives";
import { cn } from "@/lib/cn";
import { PORTAL_LOGIN_URL } from "@/lib/links";

/**
 * Live "Parents Tickets" community board. Fetches approved, anonymised public
 * entries from our same-origin read relay (app/api/parent-ticket/public →
 * portal) and shows them in a FIXED-HEIGHT, two-column board:
 *   • Left  — Families who need help  (enquiry_type "requester")
 *   • Right — Travellers who can help (enquiry_type "traveller")
 *
 * Each column is a compact scrolling list, so the section never grows however
 * many entries are approved — 3 or 30, the container stays the same size and the
 * list scrolls inside it. Longer lists auto-scroll vertically (opposite ways for
 * a lively feel), pause on hover, and fall back to a static, manually-scrollable
 * list under reduced-motion or when a column is short.
 *
 * Only the fields the endpoint returns are shown — there are NO contact details
 * in the payload, and we never invent entries. The rest of each person's details
 * stay gated behind sign-in (the teaser), keeping privacy intact.
 */

const ENDPOINT = "/api/parent-ticket/public";

// Above this many rows a column auto-scrolls; at or below it, the list fits and
// stays static (no distracting motion for just a handful of entries).
const AUTOSCROLL_MIN = 6;

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

/** Short, space-friendly date for a compact row (e.g. "30 Jul"). */
function shortDate(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso.length <= 10 ? `${iso}T00:00:00` : iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
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

/* ── Compact listing row ──────────────────────────────────────────────── */

function ListingRow({ entry }: { entry: Entry }) {
  const isTraveller = entry.enquiry_type === "traveller";
  const name = entry.display_name ?? "A Wicket member";
  const monogram = initials(entry.display_name);
  const date = shortDate(entry.travel_date);
  const hasRoute = entry.from_location && entry.to_location;

  return (
    <div
      role="listitem"
      className="group flex items-center gap-2.5 rounded-xl px-2.5 py-2 transition-colors hover:bg-white/[0.07]"
    >
      <span
        className={cn(
          "grid h-9 w-9 shrink-0 place-items-center rounded-full text-[11px] font-extrabold ring-1",
          isTraveller
            ? "bg-accent-500/15 text-accent-300 ring-accent-400/25"
            : "bg-white/10 text-navy-50 ring-white/15"
        )}
        aria-hidden="true"
      >
        {monogram || <UserRound className="h-4 w-4" />}
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-bold text-white">{name}</p>
        <p className="mt-0.5 flex items-center gap-1 truncate text-[11px] text-navy-100/70">
          {hasRoute ? (
            <>
              <span className="truncate">{entry.from_location}</span>
              <Plane
                className="h-2.5 w-2.5 shrink-0 rotate-45 text-accent-400"
                aria-hidden="true"
              />
              <span className="truncate">{entry.to_location}</span>
            </>
          ) : (
            <span className="truncate">
              {entry.from_location ?? entry.to_location ?? "Route shared privately"}
            </span>
          )}
          {date && (
            <>
              <span className="text-navy-100/30" aria-hidden="true">
                ·
              </span>
              <span className="shrink-0 whitespace-nowrap text-navy-100/60">
                {date}
              </span>
            </>
          )}
        </p>
      </div>

      {/* Subtle hint that the full picture is behind sign-in */}
      <ArrowRight
        className="h-3.5 w-3.5 shrink-0 text-navy-100/0 transition-colors group-hover:text-accent-400"
        aria-hidden="true"
      />
    </div>
  );
}

/* ── Fixed-height column ──────────────────────────────────────────────── */

function Column({
  kind,
  items,
  total,
  reverse,
}: {
  kind: Kind;
  items: Entry[];
  total: number;
  reverse: boolean;
}) {
  const reduce = useReducedMotion();
  const isTraveller = kind === "traveller";
  const Icon = isTraveller ? HandHeart : HeartHandshake;
  const animate = !reduce && items.length > AUTOSCROLL_MIN;
  const duration = Math.max(26, items.length * 4);

  const segment = (dup: boolean) => (
    <div
      aria-hidden={dup || undefined}
      role={dup ? undefined : "list"}
      className="flex flex-col gap-1 pb-1"
    >
      {items.map((e, i) => (
        <ListingRow key={`${dup ? "d-" : ""}${e.reference}-${i}`} entry={e} />
      ))}
    </div>
  );

  return (
    <div className="flex h-[20rem] flex-col overflow-hidden rounded-2xl border border-white/12 bg-white/[0.04] sm:h-[24rem]">
      {/* Column header (fixed) */}
      <div
        className={cn(
          "flex items-center gap-2.5 border-b px-3.5 py-3",
          isTraveller ? "border-accent-400/20" : "border-white/10"
        )}
      >
        <span
          className={cn(
            "grid h-8 w-8 shrink-0 place-items-center rounded-lg",
            isTraveller
              ? "bg-accent-500/15 text-accent-300"
              : "bg-white/10 text-navy-100"
          )}
          aria-hidden="true"
        >
          <Icon className="h-4 w-4" />
        </span>
        <p className="min-w-0 flex-1 truncate text-[13px] font-bold text-white">
          {isTraveller ? "Travellers who can help" : "Families who need help"}
        </p>
        <span className="shrink-0 rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-bold text-navy-100/85">
          {total}
        </span>
      </div>

      {/* List area (fills remaining height) */}
      {items.length === 0 ? (
        <div className="flex flex-1 items-center justify-center p-6 text-center">
          <p className="text-xs leading-relaxed text-navy-100/70">
            {isTraveller
              ? "No travellers on these routes yet — could you be the first to offer a hand?"
              : "No families on these routes yet — be the first to ask for a companion."}
          </p>
        </div>
      ) : animate ? (
        <div className="vmarquee relative flex-1 overflow-hidden">
          <div
            className={cn(
              "vmarquee-track vmarquee-mask px-2 py-2",
              reverse && "vmarquee-track--reverse"
            )}
            style={{ "--marquee-duration": `${duration}s` } as CSSProperties}
          >
            {segment(false)}
            {segment(true)}
          </div>
        </div>
      ) : (
        <div
          role="list"
          className="flex flex-1 flex-col gap-1 overflow-y-auto px-2 py-2"
        >
          {items.map((e, i) => (
            <ListingRow key={`${e.reference}-${i}`} entry={e} />
          ))}
        </div>
      )}
    </div>
  );
}

/** Two placeholder columns while the feed loads. */
function BoardSkeleton() {
  const col = (accent: boolean) => (
    <div className="h-[20rem] overflow-hidden rounded-2xl border border-white/12 bg-white/[0.04] sm:h-[24rem]">
      <div className="flex items-center gap-2.5 border-b border-white/10 px-3.5 py-3">
        <span
          className={cn(
            "h-8 w-8 shrink-0 rounded-lg",
            accent ? "bg-accent-500/15" : "bg-white/10"
          )}
        />
        <span className="h-3 w-32 rounded bg-white/10" />
      </div>
      <div className="space-y-2 p-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <span className="h-9 w-9 shrink-0 rounded-full bg-white/10" />
            <div className="flex-1 space-y-1.5">
              <span className="block h-2.5 w-24 rounded bg-white/10" />
              <span className="block h-2 w-36 rounded bg-white/[0.07]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  return (
    <div className="mt-8 grid animate-pulse grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
      {col(false)}
      {col(true)}
    </div>
  );
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
        "inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-950",
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
          // Always revalidate against the relay so a freshly-approved entry
          // shows up — never a stale copy from the browser's own cache. The
          // relay's short shared CDN cache still shields the upstream.
          cache: "no-store",
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

  const requesters = filtered.filter((e) => e.enquiry_type === "requester");
  const travellers = filtered.filter((e) => e.enquiry_type === "traveller");

  const showFilters =
    status === "ready" &&
    entries.length > 0 &&
    (airports.length > 1 || months.length > 1);

  const reload = () => setReloadKey((k) => k + 1);

  return (
    <div className="mt-12 border-t border-white/10 pt-10 lg:mt-14 lg:pt-12">
      <Reveal>
        <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2">
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-500" />
          </span>
          <span className="t-eyebrow text-white">Our community, live</span>
        </span>
        <h3 className="t-h2 mt-5 text-[clamp(1.5rem,1.2rem+1.4vw,2rem)] text-white">
          People helping people, right now
        </h3>
        <p className="t-body-lg mt-4 max-w-xl text-navy-100/85">
          Real families looking for a hand, and trusted travellers offering one —
          matched on the routes through airports just like yours.
        </p>
      </Reveal>

      {/* Loading */}
      {status === "loading" && <BoardSkeleton />}

      {/* Error / rate limited — never a broken section */}
      {(status === "error" || status === "rate_limited") && (
        <div className="mt-8 rounded-2xl border border-white/15 bg-white/[0.06] p-8 text-center">
          <span
            className="mx-auto grid h-13 w-13 place-items-center rounded-full bg-white/10 text-accent-400"
            aria-hidden="true"
          >
            <AlertCircle className="h-6 w-6" />
          </span>
          <p className="mt-4 text-base font-bold text-white">
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
            className="btn-outline mt-6 h-11 border-white/25 bg-white/10 px-5 text-white hover:bg-white/20"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Try again
          </button>
        </div>
      )}

      {/* Empty — warm invitation to be first */}
      {status === "ready" && entries.length === 0 && (
        <div className="mt-8 overflow-hidden rounded-2xl border border-white/15 bg-white/[0.06] p-8 text-center sm:p-10">
          <span
            className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-accent-500/15 text-accent-400 ring-1 ring-accent-400/30"
            aria-hidden="true"
          >
            <Sparkles className="h-8 w-8" />
          </span>
          <h4 className="mt-6 text-xl font-extrabold text-white">
            Be the first to start the journey
          </h4>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-navy-100/85">
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

      {/* Ready with entries — the fixed-height two-column board */}
      {status === "ready" && entries.length > 0 && (
        <>
          {showFilters && (
            <div className="mt-8 space-y-3">
              {airports.length > 1 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="mr-1 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-navy-100/75">
                    <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
                    Airport
                  </span>
                  <Chip active={!airport} onClick={() => setAirport(null)}>
                    All
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
                <div className="flex flex-wrap items-center gap-2">
                  <span className="mr-1 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-navy-100/75">
                    <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                    Month
                  </span>
                  <Chip active={!month} onClick={() => setMonth(null)}>
                    Any
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

          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
            {/* Left — families who need help (scrolls up) */}
            <Column
              kind="requester"
              items={requesters}
              total={requesters.length}
              reverse={false}
            />
            {/* Right — travellers who can help (scrolls the opposite way) */}
            <Column
              kind="traveller"
              items={travellers}
              total={travellers.length}
              reverse
            />
          </div>

          {/* Teaser → sign-up */}
          <div className="mt-6 overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-r from-white/[0.09] to-white/[0.04] p-5 sm:flex sm:items-center sm:justify-between sm:gap-6">
            <div className="flex items-start gap-3">
              <span
                className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent-500 text-white"
                aria-hidden="true"
              >
                <Lock className="h-4.5 w-4.5" />
              </span>
              <p className="text-sm text-navy-100/85">
                <span className="font-bold text-white">
                  You're seeing just a glimpse.
                </span>{" "}
                Full details are shared once you're registered, so everyone's
                privacy stays protected.
              </p>
            </div>
            <a
              href={PORTAL_LOGIN_URL}
              className="btn-primary mt-4 h-11 w-full whitespace-nowrap px-5 sm:mt-0 sm:w-auto"
            >
              Register to connect
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </>
      )}

      {/* Reassurance strip */}
      {status === "ready" && (
        <p className="mt-6 flex items-start gap-2 text-left text-xs text-navy-100/75">
          <Globe className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-400" aria-hidden="true" />
          Names are shortened and contact details are never shown publicly.
          Entries appear only after our team reviews them.
        </p>
      )}
    </div>
  );
}
