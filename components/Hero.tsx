"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  CalendarDays,
  Car,
  Hotel,
  MapPin,
  Plane,
  Search,
  Users,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { useI18n } from "@/lib/i18n";

type Tab = "flights" | "hotels" | "cars";

const TABS: { id: Tab; labelKey: string; icon: typeof Plane }[] = [
  { id: "flights", labelKey: "tab.flights", icon: Plane },
  { id: "hotels", labelKey: "tab.hotels", icon: Hotel },
  { id: "cars", labelKey: "tab.cars", icon: Car },
];

type FieldDef = {
  icon: typeof MapPin;
  label: string;
  placeholder: string;
  type?: string;
};

/* Per-field divider classes for a 2×2 (tablet) → single-row (desktop) grid.
   Each cell only draws the internal grid lines it owns, so the bordered
   container stays seamless at every breakpoint. Panels always have 4 fields. */
const CELL_BORDER = [
  "border-b sm:border-r lg:border-b-0", // top-left
  "border-b lg:border-r lg:border-b-0", // top-right
  "border-b sm:border-b-0 sm:border-r lg:border-r", // bottom-left
  "", // bottom-right
];

function Field({ icon: Icon, label, placeholder, type = "text", index }: FieldDef & { index: number }) {
  const id = `field-${label.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <div
      className={cn(
        "min-w-0 border-slate-200 px-4 py-3 transition-colors focus-within:bg-navy-50/60 focus-within:ring-2 focus-within:ring-inset focus-within:ring-navy-500 sm:py-3.5",
        CELL_BORDER[index]
      )}
    >
      <label
        htmlFor={id}
        className="block text-[0.7rem] font-bold uppercase tracking-wide text-slate-500"
      >
        {label}
      </label>
      <div className="mt-1 flex items-center gap-2">
        <Icon className="h-4 w-4 shrink-0 text-navy-600" aria-hidden="true" />
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          className="w-full min-w-0 bg-transparent text-sm font-semibold text-navy-900 placeholder:font-medium placeholder:text-slate-500 focus:outline-none"
        />
      </div>
    </div>
  );
}

const PANELS: Record<Tab, FieldDef[]> = {
  flights: [
    { icon: MapPin, label: "From", placeholder: "London (LHR)" },
    { icon: MapPin, label: "To", placeholder: "New York (JFK)" },
    { icon: CalendarDays, label: "Depart", placeholder: "Add date", type: "date" },
    { icon: Users, label: "Travelers", placeholder: "1 adult" },
  ],
  hotels: [
    { icon: MapPin, label: "Destination", placeholder: "Barcelona, Spain" },
    { icon: CalendarDays, label: "Check-in", placeholder: "Add date", type: "date" },
    { icon: CalendarDays, label: "Check-out", placeholder: "Add date", type: "date" },
    { icon: Users, label: "Guests", placeholder: "2 guests, 1 room" },
  ],
  cars: [
    { icon: MapPin, label: "Pick-up location", placeholder: "Dubai Airport (DXB)" },
    { icon: CalendarDays, label: "Pick-up", placeholder: "Add date", type: "date" },
    { icon: CalendarDays, label: "Drop-off", placeholder: "Add date", type: "date" },
    { icon: Car, label: "Car type", placeholder: "Any vehicle" },
  ],
};

export default function Hero() {
  const { t } = useI18n();
  const [tab, setTab] = useState<Tab>("flights");
  const reduce = useReducedMotion();

  return (
    <section
      id="top"
      className="relative isolate overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-24"
    >
      {/* Full-bleed background image + readability overlay */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=2400&q=80"
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950/85 via-navy-900/75 to-navy-900/90" />
        <div className="absolute inset-0 bg-gradient-to-tr from-navy-950/60 via-transparent to-accent-500/10" />
        {!reduce && (
          <motion.div
            aria-hidden="true"
            className="absolute right-[-8rem] top-10 h-80 w-80 rounded-full bg-accent-500/20 blur-3xl"
            animate={{ x: [0, -40, 0], y: [0, 40, 0] }}
            transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
      </div>

      <div className="container-page">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-navy-50 backdrop-blur-sm sm:text-sm">
            <span className="h-2 w-2 rounded-full bg-accent-400" />
            {t("hero.badge")}
          </span>
          <h1 className="t-display mt-6 text-white">
            {t("hero.title")} <span className="text-accent-400">{t("hero.accent")}</span>
          </h1>
          <p className="t-body-lg mx-auto mt-5 max-w-2xl text-navy-100">{t("hero.subline")}</p>
        </motion.div>

        {/* Search widget */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-10 max-w-4xl"
        >
          {/* Tab switcher */}
          <div
            role="tablist"
            aria-label="Search type"
            className="flex w-full gap-1 rounded-t-2xl bg-white/10 p-1.5 backdrop-blur-md sm:w-auto sm:max-w-md"
          >
            {TABS.map(({ id, labelKey, icon: Icon }) => {
              const active = tab === id;
              return (
                <button
                  key={id}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setTab(id)}
                  className={cn(
                    "relative flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-xl px-2 py-3 text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:flex-initial sm:gap-2 sm:px-5",
                    active ? "text-navy-900" : "text-white/90 hover:text-white"
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="hero-tab"
                      className="absolute inset-0 rounded-xl bg-white shadow-sm"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <Icon className="relative h-4 w-4 shrink-0" aria-hidden="true" />
                  <span className="relative truncate">{t(labelKey)}</span>
                </button>
              );
            })}
          </div>

          {/* Field panel */}
          <div className="rounded-b-2xl rounded-tr-2xl bg-white p-3 shadow-2xl shadow-navy-950/40 ring-1 ring-black/5 sm:p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-stretch">
              <div className="flex-1 overflow-hidden rounded-xl border border-slate-200">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={tab}
                    initial={reduce ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
                  >
                    {PANELS[tab].map((f, i) => (
                      <Field key={f.label} {...f} index={i} />
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>

              <button
                type="button"
                className="btn-primary h-12 w-full shrink-0 px-8 text-base lg:h-auto lg:w-auto lg:self-stretch"
              >
                <Search className="h-5 w-5" aria-hidden="true" />
                {t("cta.searchDeals")}
              </button>
            </div>
            <p className="mt-3 px-1 text-xs text-slate-500">{t("hero.helper")}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
