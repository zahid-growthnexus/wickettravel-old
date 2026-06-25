"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion-primitives";
import { cn } from "@/lib/cn";
import { useI18n } from "@/lib/i18n";

/**
 * "Today's best fares" departure-city browser. Tabs switch the originating UK
 * airport; the destination cards animate in. Fares stay soft and number-free —
 * we surface routes, not prices.
 */
const CITIES = [
  "London Heathrow",
  "Manchester",
  "Birmingham",
  "Newcastle",
  "London Gatwick",
];

type Dest = { city: string; country: string; img: string };

const DESTINATIONS: Dest[] = [
  {
    city: "Delhi",
    country: "India",
    img: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80",
  },
  {
    city: "Dubai",
    country: "UAE",
    img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80",
  },
  {
    city: "Bangkok",
    country: "Thailand",
    img: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=800&q=80",
  },
  {
    city: "Mumbai",
    country: "India",
    img: "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?auto=format&fit=crop&w=800&q=80",
  },
  {
    city: "Karachi",
    country: "Pakistan",
    img: "https://images.unsplash.com/photo-1617373743747-3bb331fd4e8d?auto=format&fit=crop&w=800&q=80",
  },
  {
    city: "Islamabad",
    country: "Pakistan",
    img: "https://images.unsplash.com/photo-1608020932658-d0e19a69580b?auto=format&fit=crop&w=800&q=80",
  },
];

function DestCard({ d, from }: { d: Dest; from: string }) {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  return (
    <motion.a
      href="#top"
      whileHover={reduce ? undefined : { y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="card card-hover group flex items-center gap-4 overflow-hidden p-3"
    >
      <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl">
        <Image
          src={d.img}
          alt={`${d.city}, ${d.country}`}
          fill
          sizes="96px"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="t-h3 truncate text-navy-900">{d.city}</h3>
        <p className="text-xs text-slate-500">
          {t("city.from")} {from}
        </p>
        <p className="mt-1 text-sm font-extrabold text-navy-900">
          Starting from low fares
        </p>
      </div>
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent-50 text-accent-600 transition-colors group-hover:bg-accent-500 group-hover:text-white">
        <ArrowRight className="h-5 w-5" aria-hidden="true" />
      </span>
    </motion.a>
  );
}

export default function BestFaresByCity() {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const [active, setActive] = useState(CITIES[0]);

  return (
    <section className="section bg-mist">
      <div className="container-page">
        <Reveal className="section-lead text-center">
          <span className="t-eyebrow text-accent-600">{t("city.eyebrow")}</span>
          <h2 className="t-h2 mt-3 text-navy-900">{t("city.title")}</h2>
          <p className="t-body mt-4 text-slate-600">{t("city.lead")}</p>
        </Reveal>

        {/* Departure-city tabs */}
        <div
          role="tablist"
          aria-label="Departure airport"
          className="mt-10 flex flex-wrap justify-center gap-2"
        >
          {CITIES.map((city) => {
            const selected = city === active;
            return (
              <button
                key={city}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setActive(city)}
                className={cn(
                  "relative rounded-full px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2",
                  selected ? "text-white" : "text-navy-700 hover:bg-navy-50"
                )}
              >
                {selected && (
                  <motion.span
                    layoutId="city-tab"
                    className="absolute inset-0 -z-10 rounded-full bg-navy-800"
                    transition={
                      reduce
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 400, damping: 32 }
                    }
                  />
                )}
                {city}
              </button>
            );
          })}
        </div>

        {/* Destination cards for the active departure city */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {DESTINATIONS.map((d) => (
              <DestCard key={d.city} d={d} from={active} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
