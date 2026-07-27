"use client";

import { useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  ChevronDown,
  HandHeart,
  HeartHandshake,
  Lock,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion-primitives";
import ParentsListings from "@/components/ParentsListings";
import { cn } from "@/lib/cn";
import { BUSINESS } from "@/lib/seo";
import { PORTAL_LOGIN_URL, PORTAL_SIGNUP_URL } from "@/lib/links";

/**
 * "Parents Tickets" lead-capture section, laid out as two equal columns:
 *   • Left  — the warm human pitch + a "Submit your request" button.
 *   • Right — the live community board (<ParentsListings />).
 *
 * The button opens the enquiry form in a modal. Inside, one form with a toggle
 * lets either party fill it in:
 *   • Traveller  — "I can help a parent"      → enquiry_type: "traveller"
 *   • Requester  — "I need help for my parent" → enquiry_type: "requester"
 * The toggle swaps the conditional fields; shared fields stay put so nothing is
 * lost when switching. Submitting a request requires a free portal account, so
 * the final step funnels the visitor to sign-up (existing members sign in) —
 * keeping every match private and verified.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

type Mode = "traveller" | "requester";

const HOW_IT_WORKS = [
  {
    icon: UserRound,
    title: "Tell us the route",
    body: "Share your parent's journey — or the trip you're already taking.",
  },
  {
    icon: HeartHandshake,
    title: "We personally match",
    body: "Our team hand-picks a trusted traveller heading the very same way.",
  },
  {
    icon: ShieldCheck,
    title: "Travel with peace of mind",
    body: "We introduce both sides and stay in touch from gate to gate.",
  },
];

const RELATIONSHIPS = [
  "Son",
  "Daughter",
  "Grandchild",
  "Niece / Nephew",
  "Other relative",
  "Friend / Carer",
];

const MOBILITY_NEEDS = [
  "None — just company & reassurance",
  "Wheelchair assistance",
  "Walking aid / slow on their feet",
  "Visual impairment",
  "Hearing impairment",
  "Other (described in notes)",
];

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  from: string;
  to: string;
  travelDate: string;
  airline: string;
  languages: string;
  notes: string;
  // Traveller
  assistanceOffered: string;
  parentsCapacity: string;
  assistanceFee: string;
  // Requester
  parentName: string;
  parentAge: string;
  relationship: string;
  assistanceNeeded: string;
  mobilityNeeds: string;
  offerAmount: string;
};

const EMPTY_FORM: FormState = {
  fullName: "",
  email: "",
  phone: "",
  from: "",
  to: "",
  travelDate: "",
  airline: "",
  languages: "",
  notes: "",
  assistanceOffered: "",
  parentsCapacity: "",
  assistanceFee: "",
  parentName: "",
  parentAge: "",
  relationship: "",
  assistanceNeeded: "",
  mobilityNeeds: "",
  offerAmount: "",
};

type Field = keyof FormState;
type Errors = Partial<Record<Field, string>>;

function fieldError(field: Field, data: FormState): string | undefined {
  const v = data[field].trim();
  switch (field) {
    case "fullName":
      return v ? undefined : "Please enter your full name.";
    case "email":
      if (!v) return "Please enter your email address.";
      if (!/^\S+@\S+\.\S+$/.test(v)) return "Enter a valid email address.";
      return undefined;
    case "phone":
      return v ? undefined : "Please enter your phone / WhatsApp number.";
    case "from":
      return v ? undefined : "Please enter the departure city or airport.";
    case "to":
      return v ? undefined : "Please enter the destination city or airport.";
    case "travelDate":
      if (v && v < new Date().toISOString().slice(0, 10))
        return "Travel date can't be in the past.";
      return undefined;
    case "parentAge":
      if (v && (!/^\d{1,3}$/.test(v) || Number(v) < 1 || Number(v) > 120))
        return "Enter a valid age.";
      return undefined;
    case "parentsCapacity":
      if (v && (!/^\d{1,2}$/.test(v) || Number(v) < 1))
        return "Enter how many parents you can help.";
      return undefined;
    case "assistanceFee":
    case "offerAmount":
      if (v && (Number.isNaN(Number(v)) || Number(v) < 0 || Number(v) > 100))
        return "Enter an amount between £0 and £100.";
      return undefined;
    default:
      return undefined;
  }
}

/* ── Shared field primitives (mirrors the Dubai Visa form) ─────────── */

const inputBase =
  "h-12 w-full rounded-lg border bg-white px-4 text-base text-navy-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2";
const inputTone =
  "border-slate-300 focus:border-navy-600 focus:ring-navy-500/25";
const inputErrorTone =
  "border-red-400 focus:border-red-500 focus:ring-red-500/25";

function FieldShell({
  id,
  label,
  required,
  error,
  hint,
  className,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-navy-900"
      >
        {label}
        {required && (
          <span className="text-red-500" aria-hidden="true">
            {" "}
            *
          </span>
        )}
      </label>
      {children}
      {error ? (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-2 flex items-start gap-1 text-xs font-medium text-red-600"
        >
          <AlertCircle className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : hint ? (
        <p className="mt-2 text-xs text-slate-400">{hint}</p>
      ) : null}
    </div>
  );
}

type CommonFieldProps = {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
};

function TextField({
  id,
  label,
  required,
  error,
  hint,
  className,
  value,
  onChange,
  onBlur,
  type = "text",
  placeholder,
  autoComplete,
  min,
  max,
  step,
  inputMode,
}: CommonFieldProps & {
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  min?: number;
  max?: number;
  step?: number;
  inputMode?: "text" | "numeric" | "decimal";
}) {
  return (
    <FieldShell {...{ id, label, required, error, hint, className }}>
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        min={min}
        max={max}
        step={step}
        inputMode={inputMode}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className={cn(inputBase, error ? inputErrorTone : inputTone)}
      />
    </FieldShell>
  );
}

function SelectField({
  id,
  label,
  required,
  error,
  hint,
  className,
  value,
  onChange,
  onBlur,
  options,
  placeholder = "Select…",
}: CommonFieldProps & { options: string[]; placeholder?: string }) {
  return (
    <FieldShell {...{ id, label, required, error, hint, className }}>
      <div className="relative">
        <select
          id={id}
          value={value}
          aria-required={required || undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          className={cn(
            inputBase,
            "appearance-none pr-10",
            error ? inputErrorTone : inputTone,
            value ? "text-navy-900" : "text-slate-400"
          )}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((o) => (
            <option key={o} value={o} className="text-navy-900">
              {o}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          aria-hidden="true"
        />
      </div>
    </FieldShell>
  );
}

function TextAreaField({
  id,
  label,
  required,
  error,
  hint,
  className,
  value,
  onChange,
  onBlur,
  placeholder,
}: CommonFieldProps & { placeholder?: string }) {
  return (
    <FieldShell {...{ id, label, required, error, hint, className }}>
      <textarea
        id={id}
        rows={3}
        value={value}
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className={cn(
          inputBase,
          "h-auto min-h-[104px] py-3",
          error ? inputErrorTone : inputTone
        )}
      />
    </FieldShell>
  );
}

/** Hairline break between logical field groups inside the grid. */
function GroupBreak() {
  return (
    <div aria-hidden="true" className="border-t border-slate-100 sm:col-span-2" />
  );
}

/* ── Mode toggle ──────────────────────────────────────────────────── */

const MODES: { value: Mode; label: string; sub: string; icon: typeof HandHeart }[] = [
  {
    value: "requester",
    label: "I need help for my parent",
    sub: "Find a companion",
    icon: HeartHandshake,
  },
  {
    value: "traveller",
    label: "I can help a parent",
    sub: "Offer to accompany",
    icon: HandHeart,
  },
];

function ModeToggle({
  mode,
  onChange,
}: {
  mode: Mode;
  onChange: (m: Mode) => void;
}) {
  const reduce = useReducedMotion();
  return (
    <div
      role="tablist"
      aria-label="What would you like to do?"
      className="grid grid-cols-2 gap-2 rounded-xl bg-navy-50 p-1.5"
    >
      {MODES.map(({ value, label, sub, icon: Icon }) => {
        const selected = mode === value;
        return (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(value)}
            className={cn(
              "relative flex flex-col items-center gap-1 rounded-lg px-3 py-3 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500 focus-visible:ring-offset-1",
              selected ? "text-white" : "text-navy-700 hover:text-navy-900"
            )}
          >
            {selected && (
              <motion.span
                layoutId="pt-mode-pill"
                aria-hidden="true"
                className="absolute inset-0 rounded-lg bg-navy-800 shadow-sm"
                transition={
                  reduce
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 380, damping: 32 }
                }
              />
            )}
            <span className="relative flex items-center gap-1.5">
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0",
                  selected ? "text-accent-400" : "text-navy-400"
                )}
                aria-hidden="true"
              />
              <span className="text-[11px] font-bold uppercase tracking-wide">
                {sub}
              </span>
            </span>
            <span className="relative text-[13px] font-semibold leading-tight">
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ── Section ──────────────────────────────────────────────────────── */

export default function ParentsTickets() {
  const [open, setOpen] = useState(false);
  const openForm = () => setOpen(true);
  const closeForm = () => setOpen(false);

  return (
    <section
      id="parents-tickets"
      className="section relative scroll-mt-16 overflow-hidden bg-navy-950"
      aria-labelledby="parents-tickets-heading"
    >
      {/* Airport-at-dusk backdrop with a navy wash so copy stays readable */}
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src="https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?auto=format&fit=crop&w=1920&q=75"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950/95 via-navy-950/88 to-navy-900/72" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-transparent to-navy-950/60" />
      </div>

      <div className="container-page relative">
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left — warm human pitch + the button that opens the enquiry form */}
          <div className="lg:pt-4">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2">
                <HandHeart
                  className="h-4 w-4 text-accent-400"
                  aria-hidden="true"
                />
                <span className="t-eyebrow text-white">Parents Tickets</span>
              </span>
              <h2
                id="parents-tickets-heading"
                className="t-h2 mt-5 text-[clamp(2rem,1.4rem+2.4vw,3rem)] text-white"
              >
                Travelling with elderly parents,
                <span className="block text-accent-400">made easier</span>
              </h2>
              <p className="t-body-lg mt-5 max-w-xl text-navy-100/90">
                We connect families who need someone to accompany an elderly
                parent with trusted travellers already going the same way — and
                our team personally arranges every introduction.
              </p>
            </Reveal>

            <Stagger className="mt-9">
              <ul className="space-y-6">
                {HOW_IT_WORKS.map(({ icon: Icon, title, body }) => (
                  <li key={title}>
                    <StaggerItem className="flex items-start gap-4">
                      <span
                        className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/10 text-accent-400 ring-1 ring-white/15"
                        aria-hidden="true"
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <h3 className="text-base font-bold text-white">
                          {title}
                        </h3>
                        <p className="t-small mt-1 text-navy-100/80">{body}</p>
                      </div>
                    </StaggerItem>
                  </li>
                ))}
              </ul>
            </Stagger>

            <Reveal delay={0.15}>
              <p className="mt-9 flex items-center gap-2 text-sm font-medium text-navy-100/70">
                <Sparkles
                  className="h-4 w-4 shrink-0 text-accent-400"
                  aria-hidden="true"
                />
                A warm, human service — no accounts, no fees to enquire. Just a
                real person who calls you back.
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="mt-9">
                <button
                  type="button"
                  onClick={openForm}
                  className="btn-primary h-13 w-full px-7 text-base sm:w-auto"
                >
                  <Send className="h-4 w-4" aria-hidden="true" />
                  Submit your request
                </button>
                <p className="mt-3 text-sm text-navy-100/70">
                  Takes two minutes — no account needed to enquire.
                </p>
              </div>
            </Reveal>
          </div>

          {/* Right — the live community board */}
          <Reveal delay={0.1}>
            <ParentsListings onStart={openForm} />
          </Reveal>
        </div>
      </div>

      <EnquiryModal open={open} onClose={closeForm} />
    </section>
  );
}

/* ── Enquiry form (rendered inside the modal) ─────────────────────── */

function EnquiryForm({ onClose }: { onClose: () => void }) {
  const reduce = useReducedMotion();
  const [mode, setMode] = useState<Mode>("requester");
  const [data, setData] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Errors>({});

  const set = (field: Field) => (value: string) => {
    setData((d) => ({ ...d, [field]: value }));
    setErrors((e) => (e[field] ? { ...e, [field]: undefined } : e));
  };

  const blurCheck = (field: Field) => () => {
    const msg = fieldError(field, data);
    if (msg) setErrors((e) => ({ ...e, [field]: msg }));
  };

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-2xl shadow-navy-950/40 ring-1 ring-white/20">
      {/* Card header */}
      <div className="relative bg-gradient-to-r from-navy-900 to-navy-800 px-5 py-5 pr-14 sm:px-8 sm:py-6 sm:pr-16">
        <h3
          id="pt-modal-title"
          className="text-lg font-extrabold tracking-tight text-white sm:text-xl"
        >
          Start with a quick enquiry
        </h3>
        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-navy-100/85">
          <HeartHandshake className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          Tell us a little and our team will be in touch shortly.
        </p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 sm:right-4 sm:top-4"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <div className="px-5 py-6 sm:p-8">
        <form noValidate onSubmit={(e) => e.preventDefault()}>
          <ModeToggle
            mode={mode}
            onChange={(m) => {
              setMode(m);
              // Drop errors that belong to the other mode's fields.
              setErrors({});
            }}
          />

          <div className="mt-6 grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2 sm:gap-x-5 sm:gap-y-6">
            {/* Shared — contact */}
            <TextField
              id="pt-fullName"
              label="Full Name"
              required
              placeholder="Your full name"
              autoComplete="name"
              error={errors.fullName}
              value={data.fullName}
              onChange={set("fullName")}
              onBlur={blurCheck("fullName")}
              className="sm:col-span-2"
            />
            <TextField
              id="pt-email"
              type="email"
              label="Email"
              required
              placeholder="you@example.com"
              autoComplete="email"
              error={errors.email}
              value={data.email}
              onChange={set("email")}
              onBlur={blurCheck("email")}
            />
            <TextField
              id="pt-phone"
              type="tel"
              label="Phone / WhatsApp"
              required
              placeholder="+44 ..."
              autoComplete="tel"
              error={errors.phone}
              value={data.phone}
              onChange={set("phone")}
              onBlur={blurCheck("phone")}
            />

            <GroupBreak />

            {/* Shared — route */}
            <TextField
              id="pt-from"
              label="From"
              required
              placeholder="City or airport"
              error={errors.from}
              value={data.from}
              onChange={set("from")}
              onBlur={blurCheck("from")}
            />
            <TextField
              id="pt-to"
              label="To"
              required
              placeholder="City or airport"
              error={errors.to}
              value={data.to}
              onChange={set("to")}
              onBlur={blurCheck("to")}
            />
            <TextField
              id="pt-travelDate"
              type="date"
              label="Travel Date"
              error={errors.travelDate}
              value={data.travelDate}
              onChange={set("travelDate")}
              onBlur={blurCheck("travelDate")}
            />
            <TextField
              id="pt-airline"
              label="Airline (optional)"
              placeholder="If already booked"
              value={data.airline}
              onChange={set("airline")}
            />
            <TextField
              id="pt-languages"
              label="Languages Spoken"
              placeholder="e.g. English, Hindi, Urdu"
              value={data.languages}
              onChange={set("languages")}
              className="sm:col-span-2"
            />

            <GroupBreak />

            {/* Conditional — swaps with the toggle */}
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={mode}
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
                transition={{ duration: 0.24, ease: EASE }}
                className="grid grid-cols-1 gap-x-4 gap-y-5 sm:col-span-2 sm:grid-cols-2 sm:gap-x-5 sm:gap-y-6"
              >
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-navy-500 sm:col-span-2">
                  {mode === "traveller" ? (
                    <>
                      <HandHeart
                        className="h-4 w-4 text-accent-500"
                        aria-hidden="true"
                      />
                      How you can help
                    </>
                  ) : (
                    <>
                      <Users
                        className="h-4 w-4 text-accent-500"
                        aria-hidden="true"
                      />
                      About your parent
                    </>
                  )}
                </p>

                {mode === "traveller" ? (
                  <>
                    <TextAreaField
                      id="pt-assistanceOffered"
                      label="What assistance can you offer?"
                      placeholder="e.g. help at check-in & security, company on the flight, staying with them until family arrives"
                      value={data.assistanceOffered}
                      onChange={set("assistanceOffered")}
                      className="sm:col-span-2"
                    />
                    <TextField
                      id="pt-parentsCapacity"
                      type="number"
                      inputMode="numeric"
                      min={1}
                      step={1}
                      label="How many parents can you help?"
                      placeholder="e.g. 1"
                      error={errors.parentsCapacity}
                      value={data.parentsCapacity}
                      onChange={set("parentsCapacity")}
                      onBlur={blurCheck("parentsCapacity")}
                    />
                    <TextField
                      id="pt-assistanceFee"
                      type="number"
                      inputMode="numeric"
                      min={0}
                      max={100}
                      step={1}
                      label="Assistance Fee (£, optional)"
                      placeholder="0–100"
                      hint="Leave blank to offer your help for free."
                      error={errors.assistanceFee}
                      value={data.assistanceFee}
                      onChange={set("assistanceFee")}
                      onBlur={blurCheck("assistanceFee")}
                    />
                  </>
                ) : (
                  <>
                    <TextField
                      id="pt-parentName"
                      label="Parent's Name"
                      placeholder="Their name"
                      value={data.parentName}
                      onChange={set("parentName")}
                    />
                    <TextField
                      id="pt-parentAge"
                      type="number"
                      inputMode="numeric"
                      min={1}
                      max={120}
                      step={1}
                      label="Parent's Age"
                      placeholder="e.g. 74"
                      error={errors.parentAge}
                      value={data.parentAge}
                      onChange={set("parentAge")}
                      onBlur={blurCheck("parentAge")}
                    />
                    <SelectField
                      id="pt-relationship"
                      label="Your Relationship to Them"
                      options={RELATIONSHIPS}
                      value={data.relationship}
                      onChange={set("relationship")}
                    />
                    <SelectField
                      id="pt-mobilityNeeds"
                      label="Mobility Needs"
                      options={MOBILITY_NEEDS}
                      value={data.mobilityNeeds}
                      onChange={set("mobilityNeeds")}
                    />
                    <TextAreaField
                      id="pt-assistanceNeeded"
                      label="Assistance Needed"
                      placeholder="e.g. company on the flight, help with bags & boarding, someone to stay with them until we arrive"
                      value={data.assistanceNeeded}
                      onChange={set("assistanceNeeded")}
                      className="sm:col-span-2"
                    />
                    <TextField
                      id="pt-offerAmount"
                      type="number"
                      inputMode="numeric"
                      min={0}
                      max={100}
                      step={1}
                      label="Offer Amount (£, optional)"
                      placeholder="0–100"
                      hint="A thank-you for the traveller, if you'd like."
                      error={errors.offerAmount}
                      value={data.offerAmount}
                      onChange={set("offerAmount")}
                      onBlur={blurCheck("offerAmount")}
                      className="sm:col-span-2"
                    />
                  </>
                )}
              </motion.div>
            </AnimatePresence>

            <GroupBreak />

            <TextAreaField
              id="pt-notes"
              label="Notes"
              placeholder="Anything else that would help us make the right match?"
              value={data.notes}
              onChange={set("notes")}
              className="sm:col-span-2"
            />
          </div>

          {/* Sign-up gate — a request can only be submitted from an account */}
          <div className="mt-8 border-t border-slate-100 pt-6">
            <div className="flex items-start gap-3 rounded-xl border border-accent-200 bg-accent-50 p-4">
              <span
                className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent-500 text-white"
                aria-hidden="true"
              >
                <Lock className="h-4 w-4" />
              </span>
              <p className="text-xs leading-relaxed text-navy-800">
                <span className="font-bold text-navy-900">
                  Sign-up required to submit.
                </span>{" "}
                To send your request and be matched securely, please create a
                free Wicket account — it keeps everyone&apos;s details private.
              </p>
            </div>

            <a
              href={PORTAL_SIGNUP_URL}
              className="btn-primary mt-4 h-12 w-full text-base"
            >
              Sign up to submit your request
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>

            <p className="mt-3 text-center text-sm text-slate-600">
              Already a member?{" "}
              <a
                href={PORTAL_LOGIN_URL}
                className="font-semibold text-navy-900 underline decoration-accent-400 decoration-2 underline-offset-2 hover:text-accent-600"
              >
                Sign in
              </a>
            </p>

            <div className="mt-5 flex items-start gap-3 rounded-xl border border-navy-100 bg-navy-50/70 p-4">
              <span
                className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-navy-800 text-white"
                aria-hidden="true"
              >
                <Phone className="h-4 w-4" />
              </span>
              <p className="text-xs leading-relaxed text-navy-800">
                <span className="font-bold text-navy-900">
                  Prefer to talk first?
                </span>{" "}
                Call or WhatsApp us on{" "}
                <a
                  href={`tel:${BUSINESS.phone}`}
                  className="inline-flex items-center gap-1 font-semibold text-navy-900 underline decoration-accent-400 decoration-2 underline-offset-2 hover:text-accent-600"
                >
                  {BUSINESS.phoneDisplay}
                </a>{" "}
                — a real person will call you back.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Modal shell ──────────────────────────────────────────────────── */

function EnquiryModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const reduce = useReducedMotion();

  // Close on Escape and lock body scroll while the dialog is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] overflow-y-auto">
          {/* Dimmed backdrop — click to dismiss */}
          <motion.div
            aria-hidden="true"
            onClick={onClose}
            className="fixed inset-0 bg-navy-950/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
          <div className="relative flex min-h-full items-center justify-center p-4 sm:p-6">
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="pt-modal-title"
              className="w-full max-w-2xl"
              initial={
                reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }
              }
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.28, ease: EASE }}
            >
              <EnquiryForm onClose={onClose} />
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
