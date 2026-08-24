"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRightLeft,
  CalendarDays,
  Car,
  Check,
  ChevronDown,
  ExternalLink,
  Hotel,
  Minus,
  Plane,
  PlaneLanding,
  PlaneTakeoff,
  Plus,
  Route,
  Search,
  Users,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { useI18n, type Lang } from "@/lib/i18n";
import { type Airport, searchAirports } from "@/lib/airports";
import { HOLIDAYS_URL, PORTAL_BOOKING_URL } from "@/lib/links";

type Tab ="flights" |"hotels" |"cars";

/* Field anatomy.

   The caption sits OUTSIDE the well, so the well holds nothing but the
   traveler's answer — and the answer is two lines: what they picked, then the
   detail that confirms it ("London" over "LHR · Heathrow, UK"). That is what
   earns the height. Earlier passes set the well height directly and padded
   one short line out to fill it, which is why it read as bloated at 66px and
   cramped at 50px; sized around two real lines it lands at 58/62px and looks
   deliberate at either end. */
const CAPTION = "mb-1.5 block t-overline text-text-secondary";
const VALUE =
  "block w-full min-w-0 truncate bg-transparent font-sans text-[14px] font-bold leading-[20px] text-primary-800 placeholder:text-text-secondary focus:outline-none sm:text-[16px] sm:leading-[24px]";
const SUB = "mt-0.5 block truncate t-caption text-text-secondary";
/* Row 2 holds short picks rather than the route and dates the search turns
   on, so its answers sit one step down the scale from row 1. */
const VALUE_SM =
  "block w-full min-w-0 truncate bg-transparent font-sans text-[13px] font-bold leading-[18px] text-primary-800 sm:text-[14px] sm:leading-[20px]";

/* One well for every field. White surface over the panel's own white reads as
   flat, so the border carries the edge and the ladder runs rest → hover
   (warmer border) → focus (ink border + ring, the only ring in the row). */
/* Split base from height because cn() is plain clsx — two competing min-h
   utilities in one string would resolve by CSS order, not by which came last. */
const WELL_BASE =
  "relative flex w-full items-center gap-2.5 rounded-md border border-neutral-300 bg-neutral-000 px-3.5 transition-all duration-200 hover:border-primary-300 focus-within:border-primary-700 focus-within:ring-2 focus-within:ring-primary-700/15";
const WELL = cn(WELL_BASE, "min-h-[58px] sm:min-h-[62px]");
/* Row 2 carries no caption and a shorter value, so it sits tighter than the
   route and date fields without losing the shared surface. */
const WELL_COMPACT = cn(WELL_BASE, "min-h-[48px] sm:min-h-[52px]");

/* From/To carry three things: what the traveler reads, the IATA code the
   portal needs, and the line that confirms the pick. Free-typed text leaves
   the code empty and is handed to the portal raw, exactly as it was before. */
type Place = { text: string; code: string; detail: string };
const EMPTY_PLACE: Place = { text: "", code: "", detail: "" };
function toPlace(a: Airport): Place {
  return a.metro
    ? { text: `All ${a.city} Airports`, code: a.code, detail: `${a.code} · ${a.country}` }
    : {
        text: a.city,
        code: a.code,
        detail: `${a.code} · ${a.name}, ${a.country}`,
      };
}

const DATE_LOCALE: Record<Lang, string> = {
  en: "en-GB",
  es: "es-ES",
  fr: "fr-FR",
  ar: "ar",
  ur: "ur-PK",
};

/* Parsed field by field on purpose: handing "2026-03-20" to the Date
   constructor reads it as UTC midnight, which renders as the 19th anywhere
   west of Greenwich. */
function parseDay(v: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v);
  return m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : null;
}

const CABINS = ["Economy","Premium Economy","Business","First"] as const;
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
  hint,
}: {
  label: string;
  icon: typeof PlaneTakeoff;
  value: Place;
  onChange: (v: Place) => void;
  placeholder: string;
  hint: string;
}) {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const id = useId();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const ref = useClickOutside<HTMLDivElement>(() => setOpen(false));

  // Show suggestions once the traveler has typed ~3 letters.
  const results: Airport[] = value.text.trim().length >= 3 ? searchAirports(value.text) : [];
  const showPanel = open && value.text.trim().length >= 3;

  const select = (a: Airport) => {
    onChange(toPlace(a));
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative min-w-0">
      <label htmlFor={id} className={CAPTION}>
        {label}
      </label>
      <div className={WELL}>
        <Icon className="h-[18px] w-[18px] shrink-0 text-primary-700" aria-hidden="true" />
        <span className="min-w-0 flex-1">
          <input
            id={id}
            type="text"
            role="combobox"
            aria-expanded={showPanel}
            aria-autocomplete="list"
            aria-controls={`${id}-list`}
            aria-describedby={`${id}-detail`}
            autoComplete="off"
            value={value.text}
            placeholder={placeholder}
            onChange={(e) => {
              // Typing invalidates the pick: the detail line and the code both
              // belong to an airport the traveler chose, not to loose text.
              onChange({ text: e.target.value, code: "", detail: "" });
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
            className={cn(VALUE, "min-h-[24px]")}
          />
          <span id={`${id}-detail`} className={SUB}>
            {value.detail || hint}
          </span>
        </span>
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
            className="absolute left-0 right-0 top-full mt-2 max-h-72 z-popover overflow-auto rounded-md border border-neutral-300 bg-neutral-000 py-2 shadow-e3 shadow-primary-900/15"
          >
            {results.length === 0 ? (
              <li className="px-3.5 py-2.5 t-body-sm text-text-secondary">{t("fs.noResults")}</li>
            ) : (
              results.map((a, i) => (
                <li key={a.code} role="option" aria-selected={i === active}>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => select(a)}
                    onMouseEnter={() => setActive(i)}
                    className={cn(
                      "flex w-full items-center gap-3 px-3.5 py-2.5 text-left transition-colors",
                      i === active ? "bg-primary-050" : "hover:bg-neutral-050"
                    )}
                  >
                    <span
                      className={cn(
                        "grid h-8 w-8 shrink-0 place-items-center rounded-sm t-label-3",
                        a.metro
                          ? "bg-accent-100 text-accent-700"
                          : "bg-primary-050 text-primary-700"
                      )}
                    >
                      {a.code}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate t-label-2 text-primary-800">
                        {a.metro ? `All ${a.city} Airports` : `${a.city} ${a.name}`}
                      </span>
                      <span className="block truncate t-caption text-text-secondary">
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

/* ── On/off preference ────────────────────────────────────────────────── */
/* A real checkbox underneath (keyboard, screen readers, form semantics) with
   the box drawn in the panel's own language; the native control is visually
   hidden rather than removed. */
function CheckOption({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="inline-flex min-h-[44px] cursor-pointer select-none items-center gap-2.5 sm:min-h-0">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className={cn(
          "grid h-[18px] w-[18px] shrink-0 place-items-center rounded-xs border transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-primary-700 peer-focus-visible:ring-offset-1",
          checked
            ? "border-accent-500 bg-accent-500 text-text-on-dark"
            : "border-neutral-300 bg-neutral-000"
        )}
      >
        {checked && <Check className="h-3 w-3" strokeWidth={3} />}
      </span>
      <span className="t-body-sm text-primary-800">{label}</span>
    </label>
  );
}

/* ── Date field ────────────────────────────────────────────────────────── */
/* The native control stays — it brings the platform picker, the keyboard
   behaviour and the calendar for free — but it renders "mm/dd/yyyy", which is
   both the wrong order for a UK audience and no use as a two-line answer. So
   it is stretched invisibly across the well (its picker indicator too, which
   is what makes a click anywhere in the well open the calendar) and the well
   draws the value itself: "20 March" over "Sunday". */
function DateField({
  label,
  value,
  onChange,
  disabled,
  min,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  min?: string;
}) {
  const { t, lang } = useI18n();
  const id = useId();
  const day = parseDay(value);
  const locale = DATE_LOCALE[lang];

  return (
    <div className="min-w-0">
      <label htmlFor={id} className={CAPTION}>
        {label}
      </label>
      <div className={cn(WELL, disabled && "opacity-55")}>
        <CalendarDays
          className="h-[18px] w-[18px] shrink-0 text-primary-700"
          aria-hidden="true"
        />
        <span className="min-w-0 flex-1">
          <span className={cn(VALUE, !day && "font-normal text-text-secondary")}>
            {day
              ? day.toLocaleDateString(locale, { day: "numeric", month: "long" })
              : t("fs.addDate")}
          </span>
          <span className={SUB}>
            {day
              ? day.toLocaleDateString(locale, { weekday: "long" })
              : t("fs.pickDay")}
          </span>
        </span>
        <input
          id={id}
          type="date"
          value={value}
          min={min}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed [color-scheme:light] [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:h-auto [&::-webkit-calendar-picker-indicator]:w-auto [&::-webkit-calendar-picker-indicator]:cursor-pointer"
        />
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
    <div className="flex items-center justify-between gap-4 py-2">
      <span className="t-label-2 text-primary-800">{label}</span>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          aria-label={`Decrease ${label}`}
          className="grid h-8 w-8 place-items-center rounded-full border border-neutral-300 text-primary-700 transition-colors hover:border-primary-500 hover:bg-primary-050 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="w-5 text-center t-label-2 tabular-nums text-primary-800">
          {value}
        </span>
        <button
          type="button"
          onClick={() => onChange(Math.min(9, value + 1))}
          disabled={value >= 9}
          aria-label={`Increase ${label}`}
          className="grid h-8 w-8 place-items-center rounded-full border border-neutral-300 text-primary-700 transition-colors hover:border-primary-500 hover:bg-primary-050 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function TravelersField({
  adults,
  childrenCount,
  onAdultsChange,
  onChildrenChange,
  muted,
}: {
  adults: number;
  childrenCount: number;
  onAdultsChange: (v: number) => void;
  onChildrenChange: (v: number) => void;
  muted?: boolean;
}) {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [childAges, setChildAges] = useState<string[]>([]);
  const ref = useClickOutside<HTMLDivElement>(() => setOpen(false));
  const total = adults + childrenCount;
  const summary = `${total} ${total === 1 ? "traveler" : "travelers"}`;
  /* Matches the existing English-only summary above rather than inventing a
     half-translated field; the whole widget's traveler counts read in English
     today and should be lifted into the dictionary together. */
  const breakdown = [
    `${adults} ${adults === 1 ? "adult" : "adults"}`,
    childrenCount > 0
      ? `${childrenCount} ${childrenCount === 1 ? "child" : "children"}`
      : null,
  ]
    .filter(Boolean)
    .join(", ");

  // Keep one age box per child: grow with blanks, shrink from the end.
  const updateChildren = (n: number) => {
    onChildrenChange(n);
    setChildAges((prev) =>
      n > prev.length
        ? [...prev, ...Array<string>(n - prev.length).fill("")]
        : prev.slice(0, n)
    );
  };

  return (
    <div ref={ref} className="relative min-w-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={`${t("fs.travelers")}: ${summary}`}
        className={cn(WELL_COMPACT, "cursor-pointer text-left")}
      >
        <Users className="h-[18px] w-[18px] shrink-0 text-primary-700" aria-hidden="true" />
        <span className="min-w-0 flex-1">
          <span className={cn(VALUE_SM, muted && "font-normal text-text-secondary")}>
            {summary}
          </span>
          <span className={SUB}>{breakdown}</span>
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-text-tertiary transition-transform duration-200",
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
            className="absolute left-0 top-full mt-2 w-[min(18rem,80vw)] z-popover rounded-md border border-neutral-300 bg-neutral-000 p-4 shadow-e3 shadow-primary-900/15"
          >
            <Stepper label="Adults" value={adults} min={1} onChange={onAdultsChange} />
            <div className="border-t border-neutral-200" />
            <Stepper label="Children" value={childrenCount} min={0} onChange={updateChildren} />

            {/* One mini age box per child — required, compact wrapping grid */}
            {childrenCount > 0 && (
              <div className="mt-2 border-t border-neutral-200 pt-3">
                <span className="block t-overline leading-[12px] text-text-secondary">
                  {t("fs.childAges")}
                </span>
                <div className="mt-2 grid grid-cols-4 gap-2">
                  <AnimatePresence initial={false}>
                    {childAges.map((age, i) => (
                      <motion.label
                        key={i}
                        initial={reduce ? false : { opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.85 }}
                        transition={{ duration: 0.15 }}
                        className="flex flex-col items-center gap-1"
                      >
                        <span className="t-label-3 text-text-secondary">
                          {t("fs.age")} {i + 1}
                        </span>
                        <input
                          type="number"
                          min={0}
                          max={17}
                          inputMode="numeric"
                          required
                          aria-label={`Child ${i + 1} age`}
                          value={age}
                          onChange={(e) =>
                            setChildAges((prev) =>
                              prev.map((v, j) => (j === i ? e.target.value : v))
                            )
                          }
                          className="h-10 w-full rounded-md border border-neutral-300 bg-neutral-000 text-center t-label-2 text-primary-800 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                        />
                      </motion.label>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Select ────────────────────────────────────────────────────────────────
   A listbox, not a native <select>. `appearance-none` only ever restyled the
   closed state — the moment it opened, the browser drew the OS list, which
   ignores every token in the system and looked nothing like the airport and
   traveller popovers sitting beside it. This is the same panel those two
   already use, so all three dropdowns in the widget now match. */
function SelectField({
  label,
  icon: Icon,
  options,
  value,
  onChange,
  onFocus,
  variant = "pill",
  muted,
}: {
  label: string;
  icon: typeof Plane;
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
  onFocus?: () => void;
  muted?: boolean;
  /* "well" sits in the field grid with a caption above it; "pill" is the
     compact form used in the refinements strip, where the value is already
     self-describing ("Any airline") and the caption is the accessible name. */
  variant?: "pill" | "well";
}) {
  const reduce = useReducedMotion();
  const id = useId();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const ref = useClickOutside<HTMLDivElement>(() => setOpen(false));

  const openAt = (index: number) => {
    setActive(index);
    setOpen(true);
    onFocus?.();
  };

  const commit = (option: string) => {
    onChange(option);
    setOpen(false);
  };

  return (
    <div ref={ref} className={variant === "well" ? "relative min-w-0" : "relative"}>
      <button
        type="button"
        /* Select-only combobox (WAI-ARIA APG): the button carries the combobox
           role so it can own aria-activedescendant, the same way AirportField's
           input does. A bare button role cannot. */
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-activedescendant={open ? `${id}-opt-${active}` : undefined}
        onClick={() =>
          open ? setOpen(false) : openAt(Math.max(0, options.indexOf(value)))
        }
        onKeyDown={(e) => {
          if (!open) {
            // Down / Up / Enter / Space all open a closed listbox, per APG.
            if ([" ", "Enter", "ArrowDown", "ArrowUp"].includes(e.key)) {
              e.preventDefault();
              openAt(Math.max(0, options.indexOf(value)));
            }
            return;
          }
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setActive((i) => Math.min(i + 1, options.length - 1));
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActive((i) => Math.max(i - 1, 0));
          } else if (e.key === "Home") {
            e.preventDefault();
            setActive(0);
          } else if (e.key === "End") {
            e.preventDefault();
            setActive(options.length - 1);
          } else if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            commit(options[active]);
          } else if (e.key === "Escape") {
            e.preventDefault();
            setOpen(false);
          } else if (e.key === "Tab") {
            setOpen(false);
          }
        }}
        aria-label={`${label}: ${value}`}
        className={
          variant === "well"
            ? cn(WELL_COMPACT, "cursor-pointer text-left", open && "border-primary-700")
            : cn(
                "flex h-10 max-w-full cursor-pointer items-center gap-2 rounded-full border px-3.5 text-left transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700 focus-visible:ring-offset-1",
                open
                  ? "border-primary-700 bg-primary-050"
                  : "border-neutral-300 hover:border-primary-300 hover:bg-neutral-050"
              )
        }
      >
        <Icon
          className={cn(
            "shrink-0 text-primary-700",
            variant === "well" ? "h-[18px] w-[18px]" : "h-4 w-4"
          )}
          aria-hidden="true"
        />
        <span
          className={cn(
            "truncate text-primary-800",
            variant === "well" ? VALUE_SM : "t-label-2",
            variant === "well" && muted && "font-normal text-text-secondary"
          )}
        >
          {value}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-text-tertiary transition-transform duration-200",
            open && "rotate-180"
          )}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            id={`${id}-list`}
            role="listbox"
            aria-label={label}
            initial={reduce ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 6 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "absolute left-0 top-full mt-2 max-h-64 min-w-full z-popover overflow-auto rounded-md border border-neutral-300 bg-neutral-000 py-2 shadow-e3 shadow-primary-900/15",
              variant === "well" ? "right-0" : "w-max max-w-[min(20rem,calc(100vw-3rem))]"
            )}
          >
            {options.map((option, i) => {
              const selected = option === value;
              return (
                <li
                  key={option}
                  id={`${id}-opt-${i}`}
                  role="option"
                  aria-selected={selected}
                >
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => commit(option)}
                    onMouseEnter={() => setActive(i)}
                    className={cn(
                      "flex w-full cursor-pointer items-center justify-between gap-3 px-3.5 py-2.5 text-left t-label-2 transition-colors duration-200",
                      i === active ? "bg-primary-050" : "hover:bg-neutral-050",
                      selected ? "text-primary-800" : "text-text-secondary"
                    )}
                  >
                    <span className="truncate">{option}</span>
                    {selected && (
                      <Check
                        className="h-4 w-4 shrink-0 text-accent-500"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Flights panel ─────────────────────────────────────────────────────── */

/** Portal query values for each cabin label shown in the widget. */
const CABIN_PARAM: Record<string, string> = {
  Economy:"economy",
  "Premium Economy":"premium",
  Business:"business",
  First:"first",
};

/** A picked airport hands over its IATA code; free-typed text goes as-is. */
function toRouteParam(place: Place): string {
  return place.code || place.text.trim();
}

function FlightsPanel() {
  const { t } = useI18n();
  const [trip, setTrip] = useState<"return" |"oneway">("return");
  const [from, setFrom] = useState<Place>(EMPTY_PLACE);
  const [to, setTo] = useState<Place>(EMPTY_PLACE);
  const [depart, setDepart] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [cabin, setCabin] = useState<string>(CABINS[0]);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  // The portal wizard should only be pre-filled with fields the traveler
  // actually chose, so cabin/travelers track whether they were touched —
  // untouched defaults stay out of the handoff URL.
  const [cabinTouched, setCabinTouched] = useState(false);
  const [travelersTouched, setTravelersTouched] = useState(false);
  const [routeNudge, setRouteNudge] = useState(false);
  // Controlled so the same fields can render in the desktop row and inside
  // the mobile"More options" disclosure without drifting apart.
  const [stops, setStops] = useState(0);
  const [airline, setAirline] = useState("");
  const [baggage, setBaggage] = useState(false);
  const [flexDates, setFlexDates] = useState(false);

  const airlineOptions = [t("airline.any"), ...AIRLINES];
  /* Two options, not three: the booking portal only understands "direct", so
     a "1 stop max" choice would be a filter we cannot actually hand off. */
  const stopsOptions = [t("fs.stopsAny"), t("fs.stopsDirect")];
  const direct = stops === 1;

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  /* Hand off to the portal booking wizard with whatever the traveler filled
     in — empty fields are simply omitted. Child ages stay here; the wizard
     collects them in its Step 1. */
  const search = () => {
    if (!from.text.trim() && !to.text.trim()) {
      setRouteNudge(true);
      return;
    }
    const params = new URLSearchParams();
    if (from.text.trim()) params.set("from", toRouteParam(from));
    if (to.text.trim()) params.set("to", toRouteParam(to));
    if (direct) params.set("tripType","direct");
    if (depart) params.set("depart", depart);
    if (trip ==="return" && returnDate) params.set("return", returnDate);
    if (cabinTouched) params.set("cabin", CABIN_PARAM[cabin]);
    if (travelersTouched || adults > 1 || children > 0)
      params.set("adults", String(adults));
    if (children > 0) params.set("children", String(children));
    if (baggage) params.set("baggage", "1");
    if (flexDates) params.set("flexible", "1");
    window.location.assign(`${PORTAL_BOOKING_URL}?${params.toString()}`);
  };

  return (
    <div className="space-y-4">
      {/* Trip type leads: it is a mode rather than a value, and it decides
          whether the Return field below is even in play. */}
      <div className="flex flex-wrap items-center gap-3">
        <div
          role="radiogroup"
          aria-label={t("fs.return") + " / " + t("fs.oneway")}
          className="inline-flex rounded-full bg-neutral-100 p-1"
        >
          {(["return", "oneway"] as const).map((v) => (
            <button
              key={v}
              type="button"
              role="radio"
              aria-checked={trip === v}
              onClick={() => setTrip(v)}
              className={cn(
                "h-11 cursor-pointer rounded-full px-3.5 t-label-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700 focus-visible:ring-offset-1 sm:h-8",
                trip === v
                  ? "bg-neutral-000 text-primary-800 shadow-e1"
                  : "text-text-secondary hover:text-primary-800"
              )}
            >
              {t(v === "return" ? "fs.return" : "fs.oneway")}
            </button>
          ))}
        </div>

      </div>

      {/* Row 1 — the route and the dates. Two pairs: From and To share the
          width evenly with each other, Depart and Return likewise, and the
          route pair takes the larger share because a city and its airport
          line is the longest answer in the panel. */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-[2fr_0.7fr_0.7fr]">
        <div className="relative col-span-2 lg:col-span-1">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <AirportField
              label={t("fs.from")}
              icon={PlaneTakeoff}
              value={from}
              onChange={(v) => {
                setFrom(v);
                setRouteNudge(false);
              }}
              placeholder={t("fs.searchPh")}
              hint={t("fs.airportHint")}
            />
            <AirportField
              label={t("fs.to")}
              icon={PlaneLanding}
              value={to}
              onChange={(v) => {
                setTo(v);
                setRouteNudge(false);
              }}
              placeholder={t("fs.searchPh")}
              hint={t("fs.airportHint")}
            />
          </div>

          {/* Dead centre of the pair, which is the seam between the two wells
              stacked. Side by side the captions sit above the wells and pull
              the wrapper's midpoint up by half a caption (16px line + 6px
              gap), so the glyph is pushed back down by 11px to land on the
              wells' own centre line. */}
          <button
            type="button"
            onClick={swap}
            aria-label={t("fs.swap")}
            className="group absolute left-1/2 top-1/2 grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 cursor-pointer place-items-center rounded-full border border-neutral-300 bg-neutral-000 text-primary-700 shadow-e1 transition-colors hover:border-primary-700 hover:text-accent-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700 z-popover sm:top-[calc(50%+11px)]"
          >
            <ArrowRightLeft
              className="h-4 w-4 rotate-90 transition-transform duration-300 group-hover:-rotate-90 sm:rotate-0 sm:group-hover:rotate-180"
              aria-hidden="true"
            />
          </button>
        </div>

        <DateField label={t("fs.depart")} value={depart} onChange={setDepart} />
        <DateField
          label={t("fs.returnDate")}
          value={returnDate}
          onChange={setReturnDate}
          disabled={trip === "oneway"}
          min={depart || undefined}
        />
      </div>

      {/* Row 2 — who is flying and how, then the action. Four fields sharing
          the width evenly, and a button that takes only the room its label
          needs, so the row ends flush with row 1 at every width. */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-[1fr_1fr_1fr_1fr_auto] lg:items-end">
        <TravelersField
          adults={adults}
          childrenCount={children}
          onAdultsChange={(v) => {
            setAdults(v);
            setTravelersTouched(true);
          }}
          onChildrenChange={(v) => {
            setChildren(v);
            setTravelersTouched(true);
          }}
          muted={!travelersTouched}
        />
        <SelectField
          label={t("fs.cabin")}
          icon={Plane}
          options={CABINS}
          value={cabin}
          onChange={setCabin}
          onFocus={() => setCabinTouched(true)}
          variant="well"
          muted={!cabinTouched}
        />
        <SelectField
          label={t("fs.airline")}
          icon={Plane}
          options={airlineOptions}
          value={airline || airlineOptions[0]}
          onChange={setAirline}
          variant="well"
          muted={!airline}
        />
        <SelectField
          label={t("fs.stops")}
          icon={Route}
          options={stopsOptions}
          value={stopsOptions[stops]}
          onChange={(v) => setStops(stopsOptions.indexOf(v))}
          variant="well"
          muted={stops === 0}
        />

        <button
          type="button"
          onClick={search}
          className="btn btn-primary col-span-2 h-[48px] w-full shrink-0 cursor-pointer whitespace-nowrap rounded-md px-7 shadow-e2 transition-all duration-300 ease-out hover:shadow-e3 sm:h-[52px] lg:col-span-1 lg:w-auto"
        >
          <span className="uppercase t-label-2 tracking-[0.2px]">{t("fs.search")}</span>
          <Search className="h-[18px] w-[18px]" strokeWidth={2.5} aria-hidden="true" />
        </button>
      </div>

      {/* Row 3 — preferences that are simply on or off, left-aligned under
          the fields they qualify. */}
      {/* Extra top padding on top of the row rhythm: these are bare labels
          with no well around them, so 16px reads tighter here than it does
          between two rows of fields. */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 sm:pt-3">
        <CheckOption
          label={t("fs.baggage")}
          checked={baggage}
          onChange={setBaggage}
        />
        <CheckOption
          label={t("fs.flexDates")}
          checked={flexDates}
          onChange={setFlexDates}
        />
      </div>

      {routeNudge && (
        <p role="status" className="px-1 t-label-2 text-accent-600">
          {t("fs.routeNudge")}
        </p>
      )}
    </div>
  );
}

/* ── Main widget ───────────────────────────────────────────────────────── */
/* Hotels AND car rentals are handled on the holidays site — both tabs
   redirect there in a new tab; only Flights renders a panel here. */
const TABS: { id: Tab; labelKey: string; icon: typeof Plane; redirect?: boolean }[] = [
  { id:"flights", labelKey:"tab.flights", icon: Plane },
  { id:"hotels", labelKey:"tab.hotels", icon: Hotel, redirect: true },
  { id:"cars", labelKey:"tab.cars", icon: Car, redirect: true },
];

export default function FlightSearch() {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const [tab, setTab] = useState<Tab>("flights");

  return (
    <div className="text-left">
      {/* Tab switcher */}
      <div
        role="tablist"
        aria-label="Search type"
        className="flex w-fit max-w-full gap-2 overflow-x-auto pb-3"
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
                  window.open(HOLIDAYS_URL,"_blank","noopener,noreferrer");
                } else {
                  setTab(id);
                }
              }}
              className={cn(
                "relative flex min-h-[44px] shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full px-4 py-2.5 t-label-2 transition-colors duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-000 sm:px-5",
                active
                  ? "text-primary-800"
                  : "text-text-on-dark/90 hover:bg-neutral-000/10 hover:text-text-on-dark"
              )}
            >
              {active && (
                <motion.span
                  layoutId="flight-tab"
                  className="absolute inset-0 rounded-full bg-neutral-000 shadow-e2"
                  transition={{ type:"spring", stiffness: 400, damping: 32 }}
                />
              )}
              <Icon className="relative h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="relative whitespace-nowrap">{t(labelKey)}</span>
              {redirect && (
                <ExternalLink className="relative hidden h-3.5 w-3.5 shrink-0 opacity-70 sm:block" aria-hidden="true" />
              )}
            </button>
          );
        })}
      </div>

      {/* Panel */}
      <div className="rounded-lg bg-neutral-000 px-4 py-5 shadow-e3 sm:px-6 sm:py-6">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={tab}
            initial={reduce ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            <FlightsPanel />
          </motion.div>
        </AnimatePresence>
        <p className="mt-4 t-caption text-text-secondary">{t("hero.helper")}</p>
      </div>
    </div>
  );
}
