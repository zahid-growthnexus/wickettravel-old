"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion-primitives";
import { cn } from "@/lib/cn";
import { useI18n } from "@/lib/i18n";

/**
 * "Today's best fares" region browser. Tabs switch the region; six destination
 * cards animate in. Fares stay soft and number-free — we surface routes, not
 * prices. Landmark shots without a reliable Unsplash match are stored locally
 * in /public/cities (Wikimedia Commons).
 */
type Dest = { city: string; country: string; img: string };

const REGIONS: { name: string; cities: Dest[] }[] = [
  {
    name: "United Kingdom",
    cities: [
      {
        city: "Heathrow",
        country: "London, UK",
        img: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80",
      },
      {
        city: "Manchester",
        country: "United Kingdom",
        img: "https://images.unsplash.com/photo-1515586838455-8f8f940d6853?auto=format&fit=crop&w=800&q=80",
      },
      {
        city: "Birmingham",
        country: "United Kingdom",
        img: "/cities/birmingham.jpg",
      },
      {
        city: "Gatwick",
        country: "London, UK",
        img: "https://images.unsplash.com/photo-1513026705753-bc3fffca8bf4?auto=format&fit=crop&w=800&q=80",
      },
      {
        city: "Luton",
        country: "London, UK",
        img: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80",
      },
      {
        city: "Edinburgh",
        country: "Scotland, UK",
        img: "/cities/edinburgh.jpg",
      },
    ],
  },
  {
    name: "United States",
    cities: [
      {
        city: "New York",
        country: "United States",
        img: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80",
      },
      {
        city: "Los Angeles",
        country: "United States",
        img: "https://images.unsplash.com/photo-1515896769750-31548aa180ed?auto=format&fit=crop&w=800&q=80",
      },
      {
        city: "Chicago",
        country: "United States",
        img: "https://images.unsplash.com/photo-1494522855154-9297ac14b55f?auto=format&fit=crop&w=800&q=80",
      },
      {
        city: "Miami",
        country: "United States",
        img: "https://images.unsplash.com/photo-1506966953602-c20cc11f75e3?auto=format&fit=crop&w=800&q=80",
      },
      {
        city: "San Francisco",
        country: "United States",
        img: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=800&q=80",
      },
      {
        city: "Washington DC",
        country: "United States",
        img: "https://images.unsplash.com/photo-1501466044931-62695aada8e9?auto=format&fit=crop&w=800&q=80",
      },
    ],
  },
  {
    name: "United Arab Emirates",
    cities: [
      {
        city: "Dubai",
        country: "UAE",
        img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80",
      },
      {
        city: "Abu Dhabi",
        country: "UAE",
        img: "https://images.unsplash.com/photo-1512632578888-169bbbc64f33?auto=format&fit=crop&w=800&q=80",
      },
      {
        city: "Sharjah",
        country: "UAE",
        img: "https://images.unsplash.com/photo-1578895101408-1a36b834405b?auto=format&fit=crop&w=800&q=80",
      },
      {
        city: "Ras Al Khaimah",
        country: "UAE",
        img: "https://images.unsplash.com/photo-1547235001-d703406d3f17?auto=format&fit=crop&w=800&q=80",
      },
      {
        city: "Ajman",
        country: "UAE",
        img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
      },
      {
        city: "Fujairah",
        country: "UAE",
        img: "https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=800&q=80",
      },
    ],
  },
  {
    name: "Asia",
    cities: [
      {
        city: "Tokyo",
        country: "Japan",
        img: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80",
      },
      {
        city: "Singapore",
        country: "Singapore",
        img: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80",
      },
      {
        city: "Bangkok",
        country: "Thailand",
        img: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=800&q=80",
      },
      {
        city: "Kuala Lumpur",
        country: "Malaysia",
        img: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=80",
      },
      {
        city: "Hong Kong",
        country: "Hong Kong SAR",
        img: "https://images.unsplash.com/photo-1536599018102-9f803c140fc1?auto=format&fit=crop&w=800&q=80",
      },
      {
        city: "Seoul",
        country: "South Korea",
        img: "https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&w=800&q=80",
      },
    ],
  },
  {
    name: "South Asia",
    cities: [
      {
        city: "Karachi",
        country: "Pakistan",
        img: "https://images.unsplash.com/photo-1617373743747-3bb331fd4e8d?auto=format&fit=crop&w=800&q=80",
      },
      {
        city: "Lahore",
        country: "Pakistan",
        img: "/cities/lahore.jpg",
      },
      {
        city: "Islamabad",
        country: "Pakistan",
        img: "https://images.unsplash.com/photo-1608020932658-d0e19a69580b?auto=format&fit=crop&w=800&q=80",
      },
      {
        city: "Delhi",
        country: "India",
        img: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80",
      },
      {
        city: "Mumbai",
        country: "India",
        img: "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?auto=format&fit=crop&w=800&q=80",
      },
      {
        city: "Dhaka",
        country: "Bangladesh",
        img: "/cities/dhaka.jpg",
      },
    ],
  },
];

function DestCard({ d }: { d: Dest }) {
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
          alt={`Flights to ${d.city}, ${d.country}`}
          fill
          sizes="96px"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="t-h3 truncate text-navy-900">{d.city}</h3>
        <p className="text-xs text-slate-500">{d.country}</p>
        <p className="mt-1 text-sm font-extrabold text-navy-900">
          {t("city.soft")}
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
  const [active, setActive] = useState(REGIONS[0].name);
  const region = REGIONS.find((r) => r.name === active) ?? REGIONS[0];

  return (
    <section className="section bg-mist">
      <div className="container-page">
        <Reveal className="section-lead text-center">
          <span className="t-eyebrow text-accent-600">{t("city.eyebrow")}</span>
          <h2 className="t-h2 mt-3 text-navy-900">{t("city.title")}</h2>
          <p className="t-body mt-4 text-slate-600">{t("city.lead")}</p>
        </Reveal>

        {/* Region tabs — active tab is a filled navy pill (white text), hover a
            clearly visible navy tint. The animated pill sits UNDER the label
            (label wrapped in relative z-10), never behind the section bg. */}
        <div
          role="tablist"
          aria-label="Region"
          className="mt-10 flex flex-wrap justify-center gap-2"
        >
          {REGIONS.map(({ name }) => {
            const selected = name === active;
            return (
              <button
                key={name}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setActive(name)}
                className={cn(
                  "relative rounded-full px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2",
                  selected
                    ? "text-white"
                    : "bg-white text-navy-800 shadow-sm ring-1 ring-navy-100 hover:bg-navy-100 hover:text-navy-900"
                )}
              >
                {selected && (
                  <motion.span
                    layoutId="region-tab"
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full bg-navy-800 shadow-md"
                    transition={
                      reduce
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 400, damping: 32 }
                    }
                  />
                )}
                <span className="relative z-10">{name}</span>
              </button>
            );
          })}
        </div>

        {/* Destination cards for the active region */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {region.cities.map((d) => (
              <DestCard key={d.city} d={d} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
