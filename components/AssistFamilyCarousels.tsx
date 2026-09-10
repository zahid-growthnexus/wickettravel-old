"use client";

import Image from "next/image";
import Link from "next/link";
import { useReducedMotion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  CalendarDays,
  HandHeart,
  Inbox,
  Loader2,
  Plane,
  Users,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { destinationImage, type ParsedEntry } from "@/lib/parents";
import { useParentBoard } from "@/lib/useParentBoard";

/**
 * The main /parents-tickets page's live-listings section, replacing the old
 * text-heavy filterable grid (components/ParentsBoard.tsx, now the content of
 * the two dedicated list pages instead — see /parents-tickets/requests and
 * /parents-tickets/offers). Two horizontal, auto-scrolling carousels: families
 * asking for a companion, and travellers already offering one. Each card
 * leans on a real place photo and large type rather than the board's dense
 * text — reference, one-line detail and a price chip only; the rest of what
 * that entry says lives one tap away on its detail page.
 *
 * Same live feed as the board (lib/useParentBoard -> /api/parent-ticket/public),
 * same privacy guarantee: nothing here is anything the poster didn't already
 * consent to publish, and no contact detail ever appears.
 */

const TRACK_COUNT = 12; // cap so a busy feed doesn't turn one loop into a marathon

function CarouselCard({ entry }: { entry: ParsedEntry }) {
  const { isTraveller, reference, from, to, date, amount } = entry;
  if (!reference) return null; // no stable URL to link to — skip rather than guess one

  const bg = destinationImage(to, from);
  const route = [from, to].filter(Boolean).join(" → ") || "Route on request";

  return (
    <Link
      href={`/parents-tickets/listing/${encodeURIComponent(reference)}`}
      className="group relative block h-72 w-64 shrink-0 overflow-hidden rounded-lg shadow-e2 ring-1 ring-primary-900/10 transition-transform duration-200 ease-out hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 sm:h-80 sm:w-72"
    >
      <Image
        src={bg}
        alt=""
        fill
        sizes="288px"
        className="object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-primary-900/95 via-primary-900/35 to-primary-900/10" />

      <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-2 p-4">
        <span
          className={cn(
            "pill",
            isTraveller
              ? "bg-primary-050 text-primary-700"
              : "bg-accent-100 text-accent-700"
          )}
        >
          {isTraveller ? (
            <HandHeart className="h-3.5 w-3.5" aria-hidden="true" />
          ) : (
            <Users className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          {isTraveller ? "Offering to help" : "Needs a companion"}
        </span>
      </div>

      <div className="absolute inset-x-0 bottom-0 p-4">
        <p className="flex items-center gap-1.5 t-h5 text-text-on-dark">
          {route}
        </p>
        {date && (
          <p className="mt-1 flex items-center gap-1.5 t-body-sm text-primary-100">
            <CalendarDays className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {date}
          </p>
        )}
        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="t-label-2 text-text-on-dark">
            {amount !== undefined
              ? `${isTraveller ? "Asking" : "Offering"} £${amount}`
              : "Amount agreed directly"}
          </span>
          <span className="inline-flex items-center gap-1 t-label-3 text-accent-400 transition-transform duration-200 group-hover:translate-x-1">
            Details
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
        </div>
      </div>
    </Link>
  );
}

function CarouselRow({
  entries,
  duration,
}: {
  entries: ParsedEntry[];
  duration: number;
}) {
  const reduce = useReducedMotion();
  const withRefs = entries.filter((e) => e.reference).slice(0, TRACK_COUNT);

  if (reduce) {
    return (
      <div className="flex gap-4 overflow-x-auto px-1 pb-2">
        {withRefs.map((entry) => (
          <CarouselCard key={entry.reference} entry={entry} />
        ))}
      </div>
    );
  }

  return (
    <div className="marquee overflow-hidden">
      <div
        className="marquee-track gap-4 pr-4"
        style={{ ["--marquee-duration" as string]: `${duration}s` }}
      >
        {[false, true].map((dup) => (
          <div key={dup ? "dup" : "orig"} aria-hidden={dup || undefined} className="flex shrink-0 gap-4 pr-4">
            {withRefs.map((entry) => (
              <CarouselCard key={`${dup ? "dup-" : ""}${entry.reference}`} entry={entry} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptySide({ label }: { label: string }) {
  return (
    <div className="card flex items-center gap-4 p-6">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary-050">
        <Inbox className="h-5 w-5 text-primary-700" aria-hidden="true" />
      </span>
      <p className="t-body-sm text-text-secondary">
        No open {label} right now — be the first to post, or check back soon.
      </p>
    </div>
  );
}

function CarouselSection({
  title,
  lead,
  icon: Icon,
  badgeClass,
  entries,
  status,
  emptyLabel,
  moreHref,
  duration,
}: {
  title: string;
  lead: string;
  icon: typeof Users;
  badgeClass: string;
  entries: ParsedEntry[];
  status: "loading" | "ready" | "error";
  emptyLabel: string;
  moreHref: string;
  duration: number;
}) {
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-full", badgeClass)}>
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h3 className="t-h4 text-primary-800">{title}</h3>
            <p className="t-body-sm text-text-secondary">{lead}</p>
          </div>
        </div>
        <Link
          href={moreHref}
          className="inline-flex items-center gap-1.5 t-label-2 text-primary-800 underline decoration-accent-400 decoration-2 underline-offset-2 transition-colors hover:text-accent-600"
        >
          More
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      <div className="mt-6">
        {status === "loading" && (
          <div className="flex items-center gap-2 py-10 justify-center t-body-sm text-text-secondary">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Loading live entries…
          </div>
        )}
        {status === "error" && (
          <div className="flex items-center gap-2 py-10 justify-center t-body-sm text-text-secondary">
            <AlertTriangle className="h-4 w-4 text-warning" aria-hidden="true" />
            Couldn&rsquo;t load this right now.
          </div>
        )}
        {status === "ready" && entries.length === 0 && <EmptySide label={emptyLabel} />}
        {status === "ready" && entries.length > 0 && (
          <CarouselRow entries={entries} duration={duration} />
        )}
      </div>
    </div>
  );
}

export default function AssistFamilyCarousels() {
  const { state, entries } = useParentBoard(50);

  const requesters = entries.filter((e) => e.type === "requester");
  const travellers = entries.filter((e) => e.type === "traveller");
  const status = state.status;

  return (
    <div className="space-y-14">
      <CarouselSection
        title="Families asking for a companion"
        lead="Someone flying alone, and the family who'd rather they weren't."
        icon={Users}
        badgeClass="bg-accent-100 text-accent-700"
        entries={requesters}
        status={status}
        emptyLabel="requests"
        moreHref="/parents-tickets/requests"
        duration={Math.max(35, requesters.length * 6)}
      />
      <CarouselSection
        title="Travellers offering to help"
        lead="Already booked on the route, happy to keep someone company."
        icon={HandHeart}
        badgeClass="bg-primary-050 text-primary-700"
        entries={travellers}
        status={status}
        emptyLabel="offers"
        moreHref="/parents-tickets/offers"
        duration={Math.max(35, travellers.length * 6)}
      />
      <p className="flex items-center justify-center gap-2 t-body-sm text-text-secondary">
        <Plane className="h-4 w-4 shrink-0 text-accent-500" aria-hidden="true" />
        Every card is already shortened before it gets here — first names and
        last initials only, no phone numbers or email addresses. Contact
        details are never published; our team makes every introduction.
      </p>
    </div>
  );
}
