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
  Minus,
  Plane,
  PlaneLanding,
  PlaneTakeoff,
  Plus,
  Search,
  SlidersHorizontal,
  Users,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { useI18n } from "@/lib/i18n";
import { type Airport, formatAirport, searchAirports } from "@/lib/airports";
import { HOLIDAYS_URL, PORTAL_BOOKING_URL } from "@/lib/links";

type Tab ="flights" |"hotels" |"cars";

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
        className="block t-overline text-text-secondary"
      >
        {label}
      </label>
      <div className="mt-1 flex items-center gap-2">
        <Icon className="h-4 w-4 shrink-0 text-primary-700" aria-hidden="true" />
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
            if (e.key ==="ArrowDown") {
              e.preventDefault();
              setActive((i) => Math.min(i + 1, results.length - 1));
            } else if (e.key ==="ArrowUp") {
              e.preventDefault();
              setActive((i) => Math.max(i - 1, 0));
            } else if (e.key ==="Enter" && results[active]) {
              e.preventDefault();
              select(results[active]);
            } else if (e.key ==="Escape") {
              setOpen(false);
            }
          }}
          className="w-full min-w-0 bg-transparent t-label-2 text-primary-800 placeholder:text-text-tertiary focus:outline-none"
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
            className="absolute left-0 right-0 top-full mt-2 max-h-72 z-popover overflow-auto rounded-md border border-neutral-300 bg-neutral-000 py-2 shadow-e3 shadow-primary-900/15"
          >
            {results.length === 0 ? (
              <li className="px-4 py-3 t-body-sm text-text-secondary">{t("fs.noResults")}</li>
            ) : (
              results.map((a, i) => (
                <li key={a.code} role="option" aria-selected={i === active}>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => select(a)}
                    onMouseEnter={() => setActive(i)}
                    className={cn(
                      "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors",
                      i === active ?"bg-primary-050" :"hover:bg-neutral-050"
                    )}
                  >
                    <span
                      className={cn(
                        "grid h-8 w-8 shrink-0 place-items-center rounded-sm t-label-3",
                        a.metro
                          ?"bg-accent-100 text-accent-700"
                          :"bg-primary-050 text-primary-700"
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
      <span className="block t-overline text-text-secondary">
        {label}
      </span>
      <div className="mt-1 flex items-center gap-2">
        <Icon className="h-4 w-4 shrink-0 text-primary-700" aria-hidden="true" />
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
}: {
  adults: number;
  childrenCount: number;
  onAdultsChange: (v: number) => void;
  onChildrenChange: (v: number) => void;
}) {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [childAges, setChildAges] = useState<string[]>([]);
  const ref = useClickOutside<HTMLDivElement>(() => setOpen(false));
  const total = adults + childrenCount;
  const summary = `${total} ${total === 1 ?"traveler" :"travelers"}`;

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
      <span className="block t-overline text-text-secondary">
        {t("fs.travelers")}
      </span>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="mt-1 flex w-full items-center gap-2 text-left"
      >
        <Users className="h-4 w-4 shrink-0 text-primary-700" aria-hidden="true" />
        <span className="flex-1 truncate t-label-2 text-primary-800">{summary}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-text-tertiary transition-transform",
            open &&"rotate-180"
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
                <span className="block t-overline text-text-secondary">
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
                          className="h-10 w-full rounded-sm border border-neutral-300 bg-neutral-000 text-center t-label-2 text-primary-800 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
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

/* ── Styled native select ──────────────────────────────────────────────── */
function SelectField({
  label,
  icon: Icon,
  options,
  defaultValue,
  value,
  onChange,
  onFocus,
}: {
  label: string;
  icon: typeof Plane;
  options: readonly string[];
  defaultValue?: string;
  /** Controlled mode — needed when the same field renders at two breakpoints. */
  value?: string;
  onChange?: (v: string) => void;
  onFocus?: () => void;
}) {
  return (
    <FieldShell label={label} icon={Icon}>
      <div className="relative w-full min-w-0">
        <select
          onFocus={onFocus}
          {...(onChange
            ? { value, onChange: (e) => onChange(e.target.value) }
            : { defaultValue: defaultValue ?? options[0] })}
          className="w-full min-w-0 cursor-pointer appearance-none bg-transparent pr-6 t-label-2 text-primary-800 focus:outline-none"
        >
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary"
          aria-hidden="true"
        />
      </div>
    </FieldShell>
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

/** Pull the IATA code out of an autocomplete pick ("London Heathrow (LHR),
 *  UK" →"LHR"); free-typed text is passed through as-is. */
function toRouteParam(value: string): string {
  const m = value.match(/\(([A-Z]{3})\)/);
  return m ? m[1] : value.trim();
}

function FlightsPanel() {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const [trip, setTrip] = useState<"return" |"oneway">("return");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
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
  const [direct, setDirect] = useState(false);
  const [airline, setAirline] = useState("");
  const [moreOpen, setMoreOpen] = useState(false);

  const airlineOptions = [t("airline.any"), ...AIRLINES];

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  /* Hand off to the portal booking wizard with whatever the traveler filled
     in — empty fields are simply omitted. Child ages stay here; the wizard
     collects them in its Step 1. */
  const search = () => {
    if (!from.trim() && !to.trim()) {
      setRouteNudge(true);
      return;
    }
    const params = new URLSearchParams();
    if (from.trim()) params.set("from", toRouteParam(from));
    if (to.trim()) params.set("to", toRouteParam(to));
    if (direct) params.set("tripType","direct");
    if (depart) params.set("depart", depart);
    if (trip ==="return" && returnDate) params.set("return", returnDate);
    if (cabinTouched) params.set("cabin", CABIN_PARAM[cabin]);
    if (travelersTouched || adults > 1 || children > 0)
      params.set("adults", String(adults));
    if (children > 0) params.set("children", String(children));
    window.location.assign(`${PORTAL_BOOKING_URL}?${params.toString()}`);
  };

  const directToggle = (className?: string) => (
    <label
      className={cn(
        "cursor-pointer items-center gap-2 t-label-2 text-primary-800",
        className
      )}
    >
      <input
        type="checkbox"
        checked={direct}
        onChange={(e) => setDirect(e.target.checked)}
        className="h-4 w-4 rounded-xs border-neutral-300 text-accent-500 accent-accent-500 focus:ring-accent-500"
      />
      {t("fs.direct")}
    </label>
  );

  /* One shell for every field so the six inputs read as a single instrument
     rather than six separate boxes. Three radii, one rule: inputs keep the
     spec's sm 8, the panel around them takes lg 16 (a hero-sized surface
     earns the larger step), and anything that acts as a button — the trip
     toggle, the tabs, Search — is a full pill, matching the header's CTA. */
  const FIELD =
    "rounded-sm border border-neutral-300 bg-neutral-000 px-3 py-3 transition-colors hover:border-primary-300 focus-within:border-primary-700 focus-within:ring-2 focus-within:ring-primary-700/15";

  return (
    <div className="space-y-3">
      {/* Trip type + direct toggle (direct moves into More options on mobile) */}
      <div className="flex flex-wrap items-center justify-between gap-3">
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
                "cursor-pointer rounded-full px-4 py-2 t-label-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700 focus-visible:ring-offset-1",
                trip === v
                  ? "bg-neutral-000 text-primary-800 shadow-e1"
                  : "text-text-secondary hover:text-primary-800"
              )}
            >
              {t(v === "return" ? "fs.return" : "fs.oneway")}
            </button>
          ))}
        </div>

        {directToggle("hidden sm:inline-flex")}
      </div>

      {/* Row 1 — route + dates. Stacked on mobile; on desktop the twelve-column
          track puts the whole row on one line, which is what keeps the panel
          inside the first screenful. */}
      <div className="grid gap-3 lg:grid-cols-12">
        <div className="relative lg:col-span-7">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className={FIELD}>
              <AirportField
                label={t("fs.from")}
                icon={PlaneTakeoff}
                value={from}
                onChange={(v) => {
                  setFrom(v);
                  setRouteNudge(false);
                }}
                placeholder={t("fs.searchPh")}
              />
            </div>
            <div className={FIELD}>
              <AirportField
                label={t("fs.to")}
                icon={PlaneLanding}
                value={to}
                onChange={(v) => {
                  setTo(v);
                  setRouteNudge(false);
                }}
                placeholder={t("fs.searchPh")}
              />
            </div>
          </div>

          {/* One position serves both layouts: dead centre of the pair, which
              is the seam between them stacked and side by side alike. The glyph
              turns on hover — the affordance is the action. */}
          <button
            type="button"
            onClick={swap}
            aria-label={t("fs.swap")}
            className="group absolute left-1/2 top-1/2 grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 cursor-pointer place-items-center rounded-full border border-neutral-300 bg-neutral-000 text-primary-700 shadow-e1 transition-colors hover:border-primary-700 hover:text-accent-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700 z-popover"
          >
            <ArrowRightLeft
              className="h-4 w-4 rotate-90 transition-transform duration-300 group-hover:-rotate-90 sm:rotate-0 sm:group-hover:rotate-180"
              aria-hidden="true"
            />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:col-span-5">
          <div className={cn(FIELD, "relative")}>
            <FieldShell label={t("fs.depart")} icon={CalendarDays}>
              <input
                type="date"
                value={depart}
                onChange={(e) => setDepart(e.target.value)}
                className="w-full min-w-0 cursor-pointer bg-transparent t-label-2 text-primary-800 focus:outline-none [color-scheme:light] [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:h-auto [&::-webkit-calendar-picker-indicator]:w-auto [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0"
              />
            </FieldShell>
          </div>
          <div className={cn(FIELD, "relative", trip === "oneway" && "opacity-50")}>
            <FieldShell label={t("fs.returnDate")} icon={CalendarDays}>
              <input
                type="date"
                disabled={trip === "oneway"}
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="w-full min-w-0 cursor-pointer bg-transparent t-label-2 text-primary-800 focus:outline-none disabled:cursor-not-allowed [color-scheme:light] [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:h-auto [&::-webkit-calendar-picker-indicator]:w-auto [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0"
              />
            </FieldShell>
          </div>
        </div>
      </div>

      {/* Row 2 — traveller detail, with the search action closing the line. */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-12">
        <div className={cn(FIELD, "lg:col-span-3")}>
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
          />
        </div>
        <div className={cn(FIELD, "lg:col-span-3")}>
          <SelectField
            label={t("fs.cabin")}
            icon={Plane}
            options={CABINS}
            value={cabin}
            onChange={setCabin}
            onFocus={() => setCabinTouched(true)}
          />
        </div>
        <div className={cn(FIELD, "hidden lg:col-span-3 lg:block")}>
          <SelectField
            label={t("fs.airline")}
            icon={Plane}
            options={airlineOptions}
            value={airline || airlineOptions[0]}
            onChange={setAirline}
          />
        </div>

        <button
          type="button"
          onClick={search}
          className="btn btn-primary col-span-2 h-12 w-full cursor-pointer self-center rounded-full shadow-e1 transition-all duration-300 ease-out hover:shadow-e2 lg:col-span-3"
        >
          <Search className="h-4 w-4" aria-hidden="true" />
          {t("fs.search")}
        </button>
      </div>

      {/* Mobile-only: advanced options collapsed behind a disclosure */}
      <div className="sm:hidden">
        <button
          type="button"
          onClick={() => setMoreOpen((v) => !v)}
          aria-expanded={moreOpen}
          aria-controls="fs-more-options"
          className="flex min-h-[44px] w-full cursor-pointer items-center justify-between rounded-sm border border-neutral-300 px-3 t-label-2 text-primary-800 transition-colors hover:border-primary-300 hover:bg-neutral-050 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700"
        >
          <span className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-primary-700" aria-hidden="true" />
            {t("fs.moreOptions")}
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-text-tertiary transition-transform duration-200",
              moreOpen && "rotate-180"
            )}
            aria-hidden="true"
          />
        </button>

        <AnimatePresence initial={false}>
          {moreOpen && (
            <motion.div
              id="fs-more-options"
              initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
              animate={reduce ? { opacity: 1 } : { height: "auto", opacity: 1 }}
              exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="mt-3 space-y-3">
                <div className={FIELD}>
                  <SelectField
                    label={t("fs.airline")}
                    icon={Plane}
                    options={airlineOptions}
                    value={airline || airlineOptions[0]}
                    onChange={setAirline}
                  />
                </div>
                <div className="flex min-h-[44px] items-center rounded-sm border border-neutral-300 px-3">
                  {directToggle("inline-flex")}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
                "relative flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full px-4 py-2.5 t-label-2 transition-colors duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-000 sm:px-6",
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
      <div className="rounded-lg bg-neutral-000 p-4 shadow-e3 sm:p-6">
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
        <p className="mt-3 px-1 t-caption text-text-secondary">{t("hero.helper")}</p>
      </div>
    </div>
  );
}
