"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRightLeft,
  CalendarDays,
  Car,
  ChevronDown,
  ExternalLink,
  Hotel,
  MapPin,
  Minus,
  Plane,
  PlaneLanding,
  PlaneTakeoff,
  Plus,
  Search,
  Users,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { useI18n } from "@/lib/i18n";
import { type Airport, formatAirport, searchAirports } from "@/lib/airports";
import { HOLIDAYS_URL } from "@/lib/links";

type Tab = "flights" | "hotels" | "cars";

const CABINS = ["Economy", "Premium Economy", "Business", "First"] as const;
const AIRLINES = [
  "British Airways",
  "Virgin Atlantic",
  "Air India",
  "Emirates",
  "Qatar Airways",
  "Gulf Air",
  "Etihad Airways",
] as const;

/* ── Close-on-outside-click helper ─────────────────────────────────────── */
function useClickOutside<T extends HTMLElement>(onAway: () => void) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const handler = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onAway();
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [onAway]);
  return ref;
}

/* ── Airport autocomplete field ────────────────────────────────────────── */
function AirportField({
  label,
  icon: Icon,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  icon: typeof PlaneTakeoff;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const id = useId();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const ref = useClickOutside<HTMLDivElement>(() => setOpen(false));

  // Show suggestions once the traveler has typed ~3 letters.
  const results: Airport[] = value.trim().length >= 3 ? searchAirports(value) : [];
  const showPanel = open && value.trim().length >= 3;

  const select = (a: Airport) => {
    onChange(formatAirport(a));
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative min-w-0">
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
          type="text"
          role="combobox"
          aria-expanded={showPanel}
          aria-autocomplete="list"
          aria-controls={`${id}-list`}
          autoComplete="off"
          value={value}
          placeholder={placeholder}
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
            setActive(0);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (!showPanel) return;
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActive((i) => Math.min(i + 1, results.length - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((i) => Math.max(i - 1, 0));
            } else if (e.key === "Enter" && results[active]) {
              e.preventDefault();
              select(results[active]);
            } else if (e.key === "Escape") {
              setOpen(false);
            }
          }}
          className="w-full min-w-0 bg-transparent text-sm font-semibold text-navy-900 placeholder:font-medium placeholder:text-slate-400 focus:outline-none"
        />
      </div>

      <AnimatePresence>
        {showPanel && (
          <motion.ul
            id={`${id}-list`}
            role="listbox"
            initial={reduce ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 6 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 top-full z-30 mt-2 max-h-72 overflow-auto rounded-xl border border-slate-200 bg-white py-1.5 shadow-xl shadow-navy-950/15"
          >
            {results.length === 0 ? (
              <li className="px-4 py-3 text-sm text-slate-500">{t("fs.noResults")}</li>
            ) : (
              results.map((a, i) => (
                <li key={a.code} role="option" aria-selected={i === active}>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => select(a)}
                    onMouseEnter={() => setActive(i)}
                    className={cn(
                      "flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors",
                      i === active ? "bg-navy-50" : "hover:bg-slate-50"
                    )}
                  >
                    <span
                      className={cn(
                        "grid h-8 w-8 shrink-0 place-items-center rounded-lg text-xs font-bold",
                        a.metro
                          ? "bg-accent-100 text-accent-700"
                          : "bg-navy-50 text-navy-700"
                      )}
                    >
                      {a.code}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-navy-900">
                        {a.metro ? `All ${a.city} Airports` : `${a.city} ${a.name}`}
                      </span>
                      <span className="block truncate text-xs text-slate-500">
                        {a.country}
                      </span>
                    </span>
                  </button>
                </li>
              ))
            )}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Plain bordered field wrapper (dates, selects) ─────────────────────── */
function FieldShell({
  label,
  icon: Icon,
  children,
  className,
}: {
  label: string;
  icon: typeof CalendarDays;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("min-w-0", className)}>
      <span className="block text-[0.7rem] font-bold uppercase tracking-wide text-slate-500">
        {label}
      </span>
      <div className="mt-1 flex items-center gap-2">
        <Icon className="h-4 w-4 shrink-0 text-navy-600" aria-hidden="true" />
        {children}
      </div>
    </div>
  );
}

/* ── Travelers stepper popover ─────────────────────────────────────────── */
function Stepper({
  label,
  value,
  min,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-1.5">
      <span className="text-sm font-semibold text-navy-900">{label}</span>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          aria-label={`Decrease ${label}`}
          className="grid h-8 w-8 place-items-center rounded-full border border-slate-300 text-navy-700 transition-colors hover:border-navy-500 hover:bg-navy-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="w-5 text-center text-sm font-bold tabular-nums text-navy-900">
          {value}
        </span>
        <button
          type="button"
          onClick={() => onChange(Math.min(9, value + 1))}
          disabled={value >= 9}
          aria-label={`Increase ${label}`}
          className="grid h-8 w-8 place-items-center rounded-full border border-slate-300 text-navy-700 transition-colors hover:border-navy-500 hover:bg-navy-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function TravelersField() {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const ref = useClickOutside<HTMLDivElement>(() => setOpen(false));
  const total = adults + children;
  const summary = `${total} ${total === 1 ? "traveler" : "travelers"}`;

  return (
    <div ref={ref} className="relative min-w-0">
      <span className="block text-[0.7rem] font-bold uppercase tracking-wide text-slate-500">
        {t("fs.travelers")}
      </span>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="mt-1 flex w-full items-center gap-2 text-left"
      >
        <Users className="h-4 w-4 shrink-0 text-navy-600" aria-hidden="true" />
        <span className="flex-1 truncate text-sm font-semibold text-navy-900">{summary}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-slate-400 transition-transform",
            open && "rotate-180"
          )}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 6 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 top-full z-30 mt-2 w-[min(18rem,90vw)] rounded-xl border border-slate-200 bg-white p-4 shadow-xl shadow-navy-950/15"
          >
            <Stepper label="Adults" value={adults} min={1} onChange={setAdults} />
            <div className="border-t border-slate-100" />
            <Stepper label="Children" value={children} min={0} onChange={setChildren} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Styled native select ──────────────────────────────────────────────── */
function SelectField({
  label,
  icon: Icon,
  options,
  defaultValue,
}: {
  label: string;
  icon: typeof Plane;
  options: readonly string[];
  defaultValue?: string;
}) {
  return (
    <FieldShell label={label} icon={Icon}>
      <div className="relative w-full min-w-0">
        <select
          defaultValue={defaultValue ?? options[0]}
          className="w-full min-w-0 cursor-pointer appearance-none bg-transparent pr-6 text-sm font-semibold text-navy-900 focus:outline-none"
        >
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          aria-hidden="true"
        />
      </div>
    </FieldShell>
  );
}

/* ── Flights panel ─────────────────────────────────────────────────────── */
function FlightsPanel() {
  const { t } = useI18n();
  const [trip, setTrip] = useState<"return" | "oneway">("return");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  return (
    <div className="space-y-4">
      {/* Trip type + direct toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          role="radiogroup"
          aria-label={t("fs.return") + " / " + t("fs.oneway")}
          className="inline-flex rounded-full bg-slate-100 p-1"
        >
          {(["return", "oneway"] as const).map((v) => (
            <button
              key={v}
              type="button"
              role="radio"
              aria-checked={trip === v}
              onClick={() => setTrip(v)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-semibold transition-colors",
                trip === v
                  ? "bg-white text-navy-900 shadow-sm"
                  : "text-slate-500 hover:text-navy-800"
              )}
            >
              {t(v === "return" ? "fs.return" : "fs.oneway")}
            </button>
          ))}
        </div>

        <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-navy-800">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-slate-300 text-accent-500 accent-accent-500 focus:ring-accent-500"
          />
          {t("fs.direct")}
        </label>
      </div>

      {/* From / swap / To */}
      <div className="relative grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 px-4 py-3 transition-colors focus-within:border-navy-500 focus-within:ring-2 focus-within:ring-navy-500/20">
          <AirportField
            label={t("fs.from")}
            icon={PlaneTakeoff}
            value={from}
            onChange={setFrom}
            placeholder={t("fs.searchPh")}
          />
        </div>
        <div className="rounded-xl border border-slate-200 px-4 py-3 transition-colors focus-within:border-navy-500 focus-within:ring-2 focus-within:ring-navy-500/20">
          <AirportField
            label={t("fs.to")}
            icon={PlaneLanding}
            value={to}
            onChange={setTo}
            placeholder={t("fs.searchPh")}
          />
        </div>

        {/* Swap button — centered on the divider */}
        <button
          type="button"
          onClick={swap}
          aria-label={t("fs.swap")}
          className="absolute left-1/2 top-1/2 z-10 hidden h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-slate-200 bg-white text-navy-700 shadow-sm transition-all hover:border-navy-500 hover:text-accent-600 sm:grid"
        >
          <ArrowRightLeft className="h-4 w-4" aria-hidden="true" />
        </button>
        {/* Mobile swap */}
        <button
          type="button"
          onClick={swap}
          aria-label={t("fs.swap")}
          className="mx-auto -my-1 grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-white text-navy-700 shadow-sm transition-all hover:border-navy-500 hover:text-accent-600 sm:hidden"
        >
          <ArrowRightLeft className="h-4 w-4 rotate-90" aria-hidden="true" />
        </button>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 px-4 py-3 transition-colors focus-within:border-navy-500 focus-within:ring-2 focus-within:ring-navy-500/20">
          <FieldShell label={t("fs.depart")} icon={CalendarDays}>
            <input
              type="date"
              className="w-full min-w-0 bg-transparent text-sm font-semibold text-navy-900 focus:outline-none [color-scheme:light]"
            />
          </FieldShell>
        </div>
        <div
          className={cn(
            "rounded-xl border border-slate-200 px-4 py-3 transition-colors focus-within:border-navy-500 focus-within:ring-2 focus-within:ring-navy-500/20",
            trip === "oneway" && "opacity-50"
          )}
        >
          <FieldShell label={t("fs.returnDate")} icon={CalendarDays}>
            <input
              type="date"
              disabled={trip === "oneway"}
              className="w-full min-w-0 bg-transparent text-sm font-semibold text-navy-900 focus:outline-none disabled:cursor-not-allowed [color-scheme:light]"
            />
          </FieldShell>
        </div>
      </div>

      {/* Travelers / cabin / airline */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 px-4 py-3 transition-colors focus-within:border-navy-500 focus-within:ring-2 focus-within:ring-navy-500/20">
          <TravelersField />
        </div>
        <div className="rounded-xl border border-slate-200 px-4 py-3 transition-colors focus-within:border-navy-500 focus-within:ring-2 focus-within:ring-navy-500/20">
          <SelectField label={t("fs.cabin")} icon={Plane} options={CABINS} />
        </div>
        <div className="rounded-xl border border-slate-200 px-4 py-3 transition-colors focus-within:border-navy-500 focus-within:ring-2 focus-within:ring-navy-500/20">
          <SelectField
            label={t("fs.airline")}
            icon={Plane}
            options={[t("airline.any"), ...AIRLINES]}
          />
        </div>
      </div>

      {/* Search */}
      <button
        type="button"
        className="btn-primary h-13 w-full py-4 text-base"
      >
        <Search className="h-5 w-5" aria-hidden="true" />
        {t("fs.search")}
      </button>
    </div>
  );
}

/* ── Cars panel (kept simple; flights are the focus) ───────────────────── */
function CarsPanel() {
  const { t } = useI18n();
  const [loc, setLoc] = useState("");
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 px-4 py-3 transition-colors focus-within:border-navy-500 focus-within:ring-2 focus-within:ring-navy-500/20">
        <AirportField
          label="Pick-up location"
          icon={MapPin}
          value={loc}
          onChange={setLoc}
          placeholder={t("fs.searchPh")}
        />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 px-4 py-3 transition-colors focus-within:border-navy-500 focus-within:ring-2 focus-within:ring-navy-500/20">
          <FieldShell label="Pick-up" icon={CalendarDays}>
            <input
              type="date"
              className="w-full min-w-0 bg-transparent text-sm font-semibold text-navy-900 focus:outline-none [color-scheme:light]"
            />
          </FieldShell>
        </div>
        <div className="rounded-xl border border-slate-200 px-4 py-3 transition-colors focus-within:border-navy-500 focus-within:ring-2 focus-within:ring-navy-500/20">
          <FieldShell label="Drop-off" icon={CalendarDays}>
            <input
              type="date"
              className="w-full min-w-0 bg-transparent text-sm font-semibold text-navy-900 focus:outline-none [color-scheme:light]"
            />
          </FieldShell>
        </div>
      </div>
      <button type="button" className="btn-primary h-13 w-full py-4 text-base">
        <Search className="h-5 w-5" aria-hidden="true" />
        Search Cars
      </button>
    </div>
  );
}

/* ── Main widget ───────────────────────────────────────────────────────── */
const TABS: { id: Tab; labelKey: string; icon: typeof Plane; redirect?: boolean }[] = [
  { id: "flights", labelKey: "tab.flights", icon: Plane },
  { id: "hotels", labelKey: "tab.hotels", icon: Hotel, redirect: true },
  { id: "cars", labelKey: "tab.cars", icon: Car },
];

export default function FlightSearch() {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const [tab, setTab] = useState<Tab>("flights");

  return (
    <div className="mx-auto mt-10 max-w-4xl text-left">
      {/* Tab switcher */}
      <div
        role="tablist"
        aria-label="Search type"
        className="flex w-full gap-1 rounded-t-2xl bg-white/10 p-1.5 backdrop-blur-sm sm:w-auto sm:max-w-md"
      >
        {TABS.map(({ id, labelKey, icon: Icon, redirect }) => {
          const active = tab === id && !redirect;
          return (
            <button
              key={id}
              role="tab"
              aria-selected={active}
              onClick={() => {
                if (redirect) {
                  window.open(HOLIDAYS_URL, "_blank", "noopener,noreferrer");
                } else {
                  setTab(id);
                }
              }}
              className={cn(
                "relative flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-xl px-2 py-3 text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:flex-initial sm:gap-2 sm:px-5",
                active ? "text-navy-900" : "text-white/90 hover:text-white"
              )}
            >
              {active && (
                <motion.span
                  layoutId="flight-tab"
                  className="absolute inset-0 rounded-xl bg-white shadow-sm"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <Icon className="relative h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="relative truncate">{t(labelKey)}</span>
              {redirect && (
                <ExternalLink className="relative h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden="true" />
              )}
            </button>
          );
        })}
      </div>

      {/* Panel */}
      <div className="rounded-b-2xl rounded-tr-2xl bg-white p-4 shadow-2xl shadow-navy-950/40 ring-1 ring-black/5 sm:p-5">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={tab}
            initial={reduce ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            {tab === "cars" ? <CarsPanel /> : <FlightsPanel />}
          </motion.div>
        </AnimatePresence>
        <p className="mt-3 px-1 text-xs text-slate-500">{t("hero.helper")}</p>
      </div>
    </div>
  );
}
