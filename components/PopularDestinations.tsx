"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Star } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion-primitives";
import { useI18n } from "@/lib/i18n";
import { HOLIDAYS_URL } from "@/lib/links";

/**
 * Handpicked hotels & resorts from our sister site, Wicket Travel Holidays.
 * Images are stored locally in /public/hotels so they can never break if the
 * source changes; every card opens the holidays site in a new tab.
 */
type Resort = {
  name: string;
  location: string;
  tag: string;
  img: string;
};

const RESORTS: Resort[] = [
  {
    name: "Ocean Pearl Overwater Villas",
    location: "Maldives",
    tag: "Overwater villas · house reef",
    img: "/hotels/maldives-overwater.jpg",
  },
  {
    name: "Caldera Cliff Suites",
    location: "Santorini, Greece",
    tag: "Sunset caldera views",
    img: "/hotels/santorini-suites.jpg",
  },
  {
    name: "Azure Horizon Resort & Spa",
    location: "Bali, Indonesia",
    tag: "Clifftop infinity pool",
    img: "/hotels/clifftop-pool.jpg",
  },
  {
    name: "Emerald Bay Pool Villas",
    location: "Krabi, Thailand",
    tag: "Private villas · lagoon pool",
    img: "/hotels/tropical-villas.jpg",
  },
  {
    name: "Lagoon Cabana Retreat",
    location: "Koh Samui, Thailand",
    tag: "Beachfront cabanas",
    img: "/hotels/lagoon-cabanas.jpg",
  },
  {
    name: "Teakwood Garden Suites",
    location: "Chiang Mai, Thailand",
    tag: "Boutique garden suites",
    img: "/hotels/boutique-suite.jpg",
  },
];

function ResortCard({ r }: { r: Resort }) {
  const reduce = useReducedMotion();
  return (
    <motion.a
      href={HOLIDAYS_URL}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={reduce ? undefined : { y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="group relative block aspect-[4/5] overflow-hidden rounded-2xl shadow-sm ring-1 ring-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500 focus-visible:ring-offset-2"
    >
      <Image
        src={r.img}
        alt={`${r.name}, ${r.location}`}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/15 to-transparent" />

      <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-navy-800 shadow-sm">
        <Star className="h-3 w-3 fill-accent-400 text-accent-400" aria-hidden="true" />
        Exclusive collection
      </span>

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5">
        <div>
          <h3 className="t-h3 text-xl text-white">{r.name}</h3>
          <p className="t-small text-navy-100">{r.location}</p>
          <p className="mt-1 text-xs font-semibold text-accent-300">{r.tag}</p>
        </div>
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-colors group-hover:bg-accent-500">
          <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>
    </motion.a>
  );
}

export default function PopularDestinations() {
  const { t } = useI18n();
  return (
    <section id="hotels" className="section scroll-mt-16 bg-white">
      <div className="container-page">
        <Reveal className="section-lead text-center">
          <span className="t-eyebrow text-accent-600">{t("hotels.eyebrow")}</span>
          <h2 className="t-h2 mt-3 text-navy-900">{t("hotels.title")}</h2>
          <p className="t-body mt-4 text-slate-600">{t("hotels.lead")}</p>
          <a
            href={HOLIDAYS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-navy-600 transition-colors hover:text-navy-700"
          >
            In partnership with Wicket Travel Holidays
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </Reveal>

        <Stagger
          amount={0.15}
          className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {RESORTS.map((r) => (
            <StaggerItem key={r.name}>
              <ResortCard r={r} />
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal delay={0.1} className="mt-10 text-center">
          <a
            href={HOLIDAYS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary px-7 py-3"
          >
            {t("hotels.cta")}
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
