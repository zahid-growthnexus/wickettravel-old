"use client";

import { useReducedMotion } from "framer-motion";
import { BadgeCheck, Star } from "lucide-react";
import { Reveal } from "@/components/motion-primitives";
import { cn } from "@/lib/cn";
import { useI18n } from "@/lib/i18n";

const TRUSTPILOT_URL = "https://www.trustpilot.com/review/wickettravel.com";

/**
 * Real reviews from our Trustpilot profile (trustpilot.com/review/wickettravel.com)
 * — names and star ratings as published; excerpts shortened for the card format.
 */
type Review = { name: string; rating: number; text: string };

const REVIEWS: Review[] = [
  {
    name: "Kumar P",
    rating: 5,
    text: "My third booking in three months — always the cheapest price and excellent, responsive service.",
  },
  {
    name: "Mr Sunil Buditi",
    rating: 5,
    text: "Available 24/7 with quick WhatsApp replies. Booked instantly and got my PNR by email.",
  },
  {
    name: "Siddique Shaik",
    rating: 5,
    text: "Amazing time booking my tickets — the team's response was perfect.",
  },
  {
    name: "Ganesh Kuppala",
    rating: 5,
    text: "Professional and responsive. Found me better routes and more affordable fares.",
  },
  {
    name: "Venu",
    rating: 5,
    text: "Accurate, clear flight information. Simple and hassle-free from start to finish.",
  },
  {
    name: "Swati Pardeshi-Chowdary",
    rating: 5,
    text: "Excellent personalised service and the best rates I could find.",
  },
  {
    name: "Raj Tiwari",
    rating: 4,
    text: "Wonderful flight booking services — I'd happily recommend them.",
  },
  {
    name: "Venkatesh Krishna Murthy",
    rating: 5,
    text: "Amazing service with the best prices.",
  },
  {
    name: "Mr Venkata Vudathu",
    rating: 5,
    text: "Good service and great support.",
  },
  {
    name: "Mr A",
    rating: 5,
    text: "Supportive and prompt customer service — would recommend.",
  },
  {
    name: "Ashok",
    rating: 5,
    text: "Responsive even at 11 PM, cheaper than the airline website — and ATOL peace of mind.",
  },
  {
    name: "Chinna",
    rating: 5,
    text: "Trusted tickets — they took care of schedule changes and cancellations for me.",
  },
];

/** Trustpilot-style star row: solid green squares with white stars. */
function TrustStars({ rating, size = "md" }: { rating: number; size?: "sm" | "md" }) {
  const box = size === "sm" ? "h-5 w-5" : "h-6 w-6";
  const star = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";
  return (
    <div className="flex gap-0.5" aria-label={`Rated ${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "grid place-items-center",
            box,
            i < rating ? "bg-[#00b67a]" : "bg-slate-300"
          )}
        >
          <Star className={cn(star, "fill-white text-white")} aria-hidden="true" />
        </span>
      ))}
    </div>
  );
}

function ReviewCard({ r }: { r: Review }) {
  return (
    <article className="card flex h-full w-[19rem] shrink-0 flex-col p-6 sm:w-[21rem]">
      <TrustStars rating={r.rating} size="sm" />
      <p className="t-small mt-4 flex-1 text-slate-700">&ldquo;{r.text}&rdquo;</p>
      <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
        <span className="text-sm font-bold text-navy-900">{r.name}</span>
        <span className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-[#00b67a]">
          <BadgeCheck className="h-4 w-4" aria-hidden="true" />
          Verified review
        </span>
      </div>
    </article>
  );
}

export default function Testimonials() {
  const { t } = useI18n();
  const reduce = useReducedMotion();

  const row = (ariaHidden: boolean) => (
    <div
      aria-hidden={ariaHidden || undefined}
      className="flex shrink-0 items-stretch gap-5 pr-5"
    >
      {REVIEWS.map((r) => (
        <ReviewCard key={`${ariaHidden ? "dup-" : ""}${r.name}`} r={r} />
      ))}
    </div>
  );

  return (
    <section className="section overflow-hidden bg-white">
      <div className="container-page">
        <Reveal className="section-lead text-center">
          <span className="t-eyebrow text-accent-600">{t("rev.eyebrow")}</span>
          <h2 className="t-h2 mt-3 text-navy-900">{t("rev2.title")}</h2>
          <a
            href={TRUSTPILOT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-5 py-2.5 shadow-sm transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00b67a] focus-visible:ring-offset-2"
          >
            <Star className="h-5 w-5 fill-[#00b67a] text-[#00b67a]" aria-hidden="true" />
            <span className="text-sm font-bold text-navy-900">
              Trustpilot
            </span>
            <TrustStars rating={5} size="sm" />
            <span className="text-sm font-semibold text-slate-600">
              {t("rev2.link")}
            </span>
          </a>
        </Reveal>
      </div>

      {/* Continuous review slider — two copies of the row slide left in a
          seamless loop; hover pauses. Reduced motion gets a static,
          horizontally scrollable row instead. */}
      <Reveal delay={0.1} className="mt-12">
        {reduce ? (
          <div className="flex gap-5 overflow-x-auto px-5 pb-2 sm:px-8">
            {REVIEWS.map((r) => (
              <ReviewCard key={r.name} r={r} />
            ))}
          </div>
        ) : (
          <div className="marquee overflow-hidden" aria-label="Traveler reviews from Trustpilot">
            <div className="marquee-track [--marquee-duration:80s]">
              {row(false)}
              {row(true)}
            </div>
          </div>
        )}
      </Reveal>
    </section>
  );
}
