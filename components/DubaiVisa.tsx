"use client";

import { useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  AlertCircle,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Loader2,
  Lock,
  Mail,
  MessageCircle,
  Phone,
  Send,
  UploadCloud,
  X,
} from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion-primitives";
import { cn } from "@/lib/cn";
import { BUSINESS } from "@/lib/seo";

/**
 * Dubai Visa lead-capture section: benefits on the left, a 5-step application
 * wizard in an elevated card on the right. Steps 1–3 collect travel, personal
 * and passport details; step 4 covers background questions and step 5 uploads
 * documents and submits to the portal via our same-origin /api/visa-enquiry
 * relay (multipart: `payload` JSON string + `documents` file parts).
 * All values live in one state object so nothing is lost moving back/forward.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

const STEPS = [
  { label: "Visa Type", title: "Visa Type & Travel Details" },
  { label: "Personal", title: "Personal Information" },
  { label: "Passport", title: "Passport & UK Visa" },
  { label: "Background", title: "Employment & Background" },
  { label: "Submit", title: "Upload Documents & Submit" },
];

const BENEFITS = [
  "UAE tourist & visit visa applications",
  "Full eligibility check & advice",
  "Complete document preparation & review",
  "Fast processing — most decisions within days",
  "Free initial consultation",
];

const VISA_TYPES = [
  "30-Day Tourist Visa (Single Entry)",
  "60-Day Tourist Visa (Single Entry)",
  "30-Day Multiple Entry Visa",
  "60-Day Multiple Entry Visa",
  "48-Hour Transit Visa",
  "96-Hour Transit Visa",
];

const PURPOSES = [
  "Tourism / Holiday",
  "Business",
  "Family Visit",
  "Medical Treatment",
  "Cultural / Sport",
  "Transit",
];

const GENDERS = ["Male", "Female", "Other", "Prefer not to say"];

const MARITAL_STATUSES = [
  "Single",
  "Married",
  "Divorced",
  "Separated",
  "Widow/Widower",
];

const PASSPORT_TYPES = [
  "Ordinary / Regular",
  "Diplomatic",
  "Official / Service",
  "Other",
];

const OCCUPATIONS = [
  "Employed",
  "Self-Employed",
  "Student",
  "Retired",
  "Dependent",
  "Unemployed",
  "Other",
];

const COST_COVERERS = [
  "Self",
  "Family / Relative",
  "Employer",
  "Sponsor in UAE",
  "Other",
];

const CONTACT_METHODS = [
  { value: "Call", icon: Phone },
  { value: "WhatsApp", icon: MessageCircle },
  { value: "Email", icon: Mail },
] as const;

const ACCEPTED_FILES = ".pdf,.jpg,.jpeg,.png";
const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10MB per file, matching the portal

// Same-origin relay (app/api/visa-enquiry) that forwards to the portal —
// the portal's CORS allowlist doesn't cover every domain this site runs on.
const ENQUIRY_ENDPOINT = "/api/visa-enquiry";

// UI labels → the portal's preferred_contact_method enum.
const CONTACT_METHOD_API: Record<string, "phone" | "whatsapp" | "email"> = {
  Call: "phone",
  WhatsApp: "whatsapp",
  Email: "email",
};

type FormData = {
  multiPerson: string;
  visaType: string;
  purpose: string;
  arrivalDate: string;
  departureDate: string;
  plans: string;
  firstName: string;
  lastName: string;
  otherNames: string;
  dob: string;
  birthPlace: string;
  nationality: string;
  gender: string;
  maritalStatus: string;
  email: string;
  phone: string;
  ukAddress: string;
  passportType: string;
  passportNumber: string;
  confirmPassport: string;
  issueDate: string;
  expiryDate: string;
  issuingCountry: string;
  ukVisaRef: string;
  ukVisaStart: string;
  ukVisaEnd: string;
  visitedUae: string;
  prevUaeVisa: string;
  occupation: string;
  employer: string;
  jobTitle: string;
  employerAddress: string;
  refusedEntry: string;
  criminalConviction: string;
  costCoverer: string;
  contactMethod: string;
  notes: string;
};

const EMPTY_FORM: FormData = {
  multiPerson: "",
  visaType: "",
  purpose: "",
  arrivalDate: "",
  departureDate: "",
  plans: "",
  firstName: "",
  lastName: "",
  otherNames: "",
  dob: "",
  birthPlace: "",
  nationality: "",
  gender: "",
  maritalStatus: "",
  email: "",
  phone: "",
  ukAddress: "",
  passportType: "",
  passportNumber: "",
  confirmPassport: "",
  issueDate: "",
  expiryDate: "",
  issuingCountry: "",
  ukVisaRef: "",
  ukVisaStart: "",
  ukVisaEnd: "",
  visitedUae: "",
  prevUaeVisa: "",
  occupation: "",
  employer: "",
  jobTitle: "",
  employerAddress: "",
  refusedEntry: "",
  criminalConviction: "",
  costCoverer: "",
  contactMethod: "",
  notes: "",
};

type Field = keyof FormData;
type Errors = Partial<Record<Field, string>>;

// Fields checked before each step may advance (optional fields included so
// cross-field rules like "departure after arrival" still run).
const STEP_FIELDS: Record<number, Field[]> = {
  1: ["multiPerson", "visaType", "purpose", "arrivalDate", "departureDate"],
  2: ["firstName", "lastName", "dob", "nationality", "email", "phone"],
  3: ["passportNumber", "confirmPassport", "issueDate", "expiryDate"],
  4: ["occupation", "contactMethod"],
  5: [],
};

function fieldError(field: Field, data: FormData): string | undefined {
  const v = data[field].trim();
  switch (field) {
    case "multiPerson":
      return v ? undefined : "Please select an option.";
    case "visaType":
      return v ? undefined : "Please choose a visa type.";
    case "purpose":
      return v ? undefined : "Please choose your purpose of visit.";
    case "arrivalDate":
      return v ? undefined : "Please pick your intended arrival date.";
    case "departureDate":
      if (v && data.arrivalDate && v < data.arrivalDate)
        return "Departure must be on or after your arrival date.";
      return undefined;
    case "firstName":
      return v ? undefined : "Please enter your first name.";
    case "lastName":
      return v ? undefined : "Please enter your last name.";
    case "dob":
      if (!v) return "Please enter your date of birth.";
      if (v >= new Date().toISOString().slice(0, 10))
        return "Date of birth must be in the past.";
      return undefined;
    case "nationality":
      return v ? undefined : "Please enter your nationality.";
    case "email":
      if (!v) return "Please enter your email address.";
      if (!/^\S+@\S+\.\S+$/.test(v)) return "Enter a valid email address.";
      return undefined;
    case "phone":
      return v ? undefined : "Please enter your phone / WhatsApp number.";
    case "passportNumber":
      return v ? undefined : "Please enter your passport number.";
    case "confirmPassport":
      if (!v) return "Please re-enter your passport number.";
      if (v !== data.passportNumber.trim())
        return "Passport numbers do not match.";
      return undefined;
    case "issueDate":
      return v ? undefined : "Please enter the passport issue date.";
    case "expiryDate":
      if (!v) return "Please enter the passport expiry date.";
      if (data.issueDate && v <= data.issueDate)
        return "Expiry must be after the issue date.";
      return undefined;
    case "occupation":
      return v ? undefined : "Please select your occupation.";
    case "contactMethod":
      return v ? undefined : "Please choose how you'd like us to contact you.";
    default:
      return undefined;
  }
}

/**
 * Map wizard state onto the portal's visa_enquiries keys. Empty optional
 * fields become `undefined` so JSON.stringify drops them; Yes/No radios
 * become booleans. `status` / `admin_notes` are portal-managed — never sent.
 */
function buildPayload(data: FormData) {
  const opt = (v: string) => v.trim() || undefined;
  const yesNo = (v: string) =>
    v === "Yes" ? true : v === "No" ? false : undefined;
  return {
    more_than_one_person: yesNo(data.multiPerson),
    visa_type: data.visaType.trim(),
    purpose_of_visit: opt(data.purpose),
    arrival_date: opt(data.arrivalDate),
    departure_date: opt(data.departureDate),
    planned_activities: opt(data.plans),
    first_name: data.firstName.trim(),
    last_name: data.lastName.trim(),
    other_names: opt(data.otherNames),
    date_of_birth: opt(data.dob),
    place_of_birth: opt(data.birthPlace),
    nationality: opt(data.nationality),
    gender: opt(data.gender),
    marital_status: opt(data.maritalStatus),
    email: data.email.trim(),
    phone: data.phone.trim(),
    uk_address: opt(data.ukAddress),
    passport_type: opt(data.passportType),
    passport_number: opt(data.passportNumber),
    passport_issue_date: opt(data.issueDate),
    passport_expiry_date: opt(data.expiryDate),
    issuing_country: opt(data.issuingCountry),
    uk_visa_brp_ref: opt(data.ukVisaRef),
    uk_visa_start_date: opt(data.ukVisaStart),
    uk_visa_expiry_date: opt(data.ukVisaEnd),
    previously_visited_uae: yesNo(data.visitedUae),
    previous_uae_visa_number: opt(data.prevUaeVisa),
    occupation: opt(data.occupation),
    employer_name: opt(data.employer),
    job_title: opt(data.jobTitle),
    employer_address: opt(data.employerAddress),
    refused_entry_uae: yesNo(data.refusedEntry),
    criminal_conviction: yesNo(data.criminalConviction),
    who_covers_costs: opt(data.costCoverer),
    preferred_contact_method: CONTACT_METHOD_API[data.contactMethod],
    additional_notes: opt(data.notes),
  };
}

/* ── Shared field primitives ─────────────────────────────── */

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
}: CommonFieldProps & {
  type?: string;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <FieldShell {...{ id, label, required, error, hint, className }}>
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
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
          "h-auto min-h-[112px] py-3",
          error ? inputErrorTone : inputTone
        )}
      />
    </FieldShell>
  );
}

function YesNoField({
  id,
  label,
  required,
  error,
  className,
  value,
  onChange,
}: Omit<CommonFieldProps, "onBlur">) {
  return (
    <fieldset className={className}>
      <legend className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-navy-900">
        {label}
        {required && (
          <span className="text-red-500" aria-hidden="true">
            {" "}
            *
          </span>
        )}
      </legend>
      <div className="grid grid-cols-2 gap-3">
        {["Yes", "No"].map((opt) => {
          const selected = value === opt;
          return (
            <label
              key={opt}
              className={cn(
                "flex h-12 cursor-pointer items-center justify-center rounded-lg border text-sm font-semibold transition-colors",
                "focus-within:ring-2 focus-within:ring-navy-500/40",
                selected
                  ? "border-navy-800 bg-navy-800 text-white shadow-sm"
                  : cn(
                      "bg-white text-navy-800 hover:bg-navy-50",
                      error ? "border-red-400" : "border-slate-300"
                    )
              )}
            >
              <input
                type="radio"
                // First option carries the group id so error focus lands here.
                id={opt === "Yes" ? id : undefined}
                name={id}
                value={opt}
                checked={selected}
                aria-describedby={error ? `${id}-error` : undefined}
                onChange={() => onChange(opt)}
                className="sr-only"
              />
              {opt}
            </label>
          );
        })}
      </div>
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-2 flex items-start gap-1 text-xs font-medium text-red-600"
        >
          <AlertCircle className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </fieldset>
  );
}

function ContactMethodField({
  id,
  label,
  required,
  error,
  className,
  value,
  onChange,
}: Omit<CommonFieldProps, "onBlur">) {
  return (
    <fieldset className={className}>
      <legend className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-navy-900">
        {label}
        {required && (
          <span className="text-red-500" aria-hidden="true">
            {" "}
            *
          </span>
        )}
      </legend>
      <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
        {CONTACT_METHODS.map(({ value: opt, icon: Icon }, i) => {
          const selected = value === opt;
          return (
            <label
              key={opt}
              className={cn(
                "flex min-h-12 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border px-3 py-3 text-xs font-semibold transition-colors sm:flex-row sm:gap-2 sm:text-sm",
                "focus-within:ring-2 focus-within:ring-navy-500/40",
                selected
                  ? "border-navy-800 bg-navy-800 text-white shadow-sm"
                  : cn(
                      "bg-white text-navy-800 hover:bg-navy-50",
                      error ? "border-red-400" : "border-slate-300"
                    )
              )}
            >
              <input
                type="radio"
                // First option carries the group id so error focus lands here.
                id={i === 0 ? id : undefined}
                name={id}
                value={opt}
                checked={selected}
                aria-describedby={error ? `${id}-error` : undefined}
                onChange={() => onChange(opt)}
                className="sr-only"
              />
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0",
                  selected ? "text-accent-400" : "text-slate-400"
                )}
                aria-hidden="true"
              />
              {opt}
            </label>
          );
        })}
      </div>
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-2 flex items-start gap-1 text-xs font-medium text-red-600"
        >
          <AlertCircle className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </fieldset>
  );
}

/**
 * Hairline break between logical field groups inside a step grid. The grid's
 * row gap on either side turns the 1px rule into a calm ~2x group separation.
 */
function GroupBreak() {
  return (
    <div aria-hidden="true" className="border-t border-slate-100 sm:col-span-2" />
  );
}

/* ── Step indicator ──────────────────────────────────────── */

function StepIndicator({
  step,
  onJump,
}: {
  step: number;
  onJump: (n: number) => void;
}) {
  const reduce = useReducedMotion();
  return (
    <div>
      <ol className="flex items-center" aria-label="Application steps">
        {STEPS.map(({ label }, i) => {
          const n = i + 1;
          const done = n < step;
          const current = n === step;
          return (
            <li
              key={label}
              className={cn("flex items-center", n > 1 && "flex-1")}
              aria-current={current ? "step" : undefined}
            >
              {/* Connector — fills green once the previous step completes */}
              {n > 1 && (
                <span className="relative mx-1.5 h-0.5 flex-1 overflow-hidden rounded-full bg-slate-200 sm:mx-2">
                  <motion.span
                    aria-hidden="true"
                    className="absolute inset-0 origin-left rounded-full bg-accent-500"
                    initial={false}
                    animate={{ scaleX: n <= step ? 1 : 0 }}
                    transition={
                      reduce ? { duration: 0 } : { duration: 0.35, ease: EASE }
                    }
                  />
                </span>
              )}
              <span className="flex flex-col items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => done && onJump(n)}
                  disabled={!done}
                  aria-label={`Step ${n}: ${label}${done ? " (completed — go back)" : current ? " (current)" : ""}`}
                  className={cn(
                    "grid h-9 w-9 place-items-center rounded-full text-sm font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500 focus-visible:ring-offset-2",
                    done &&
                      "cursor-pointer bg-accent-500 text-white hover:bg-accent-600",
                    current &&
                      "bg-navy-800 text-white shadow-md ring-4 ring-accent-500/30",
                    !done &&
                      !current &&
                      "border border-slate-300 bg-white text-slate-400"
                  )}
                >
                  {done ? (
                    <motion.span
                      initial={reduce ? false : { scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 22 }}
                      className="grid place-items-center"
                    >
                      <Check className="h-4 w-4" strokeWidth={3} aria-hidden="true" />
                    </motion.span>
                  ) : (
                    n
                  )}
                </button>
                <span
                  className={cn(
                    "hidden text-[10px] font-bold uppercase tracking-wide sm:block",
                    current
                      ? "text-navy-900"
                      : done
                        ? "text-accent-600"
                        : "text-slate-400"
                  )}
                  aria-hidden="true"
                >
                  {label}
                </span>
              </span>
            </li>
          );
        })}
      </ol>
      {/* Compact label for phones, where per-step captions don't fit */}
      <p
        className="mt-3 text-center text-xs font-semibold text-slate-500 sm:hidden"
        aria-hidden="true"
      >
        Step {step} of {STEPS.length} · {STEPS[step - 1].label}
      </p>
    </div>
  );
}

/* ── Wizard ──────────────────────────────────────────────── */

export default function DubaiVisa() {
  const reduce = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(1);
  const [dir, setDir] = useState(1);
  const [data, setData] = useState<FormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Errors>({});
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);

  const addFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    // Snapshot the FileList now — it's live and is emptied when the input's
    // value is reset, before React runs the state updater.
    const wrongType: string[] = [];
    const tooBig: string[] = [];
    const accepted: File[] = [];
    for (const f of Array.from(incoming)) {
      if (!/\.(pdf|jpe?g|png)$/i.test(f.name)) wrongType.push(f.name);
      else if (f.size > MAX_FILE_BYTES) tooBig.push(f.name);
      else accepted.push(f);
    }
    setFiles((prev) => {
      const next = [...prev];
      for (const f of accepted) {
        if (!next.some((p) => p.name === f.name && p.size === f.size))
          next.push(f);
      }
      return next;
    });
    const problems: string[] = [];
    if (wrongType.length)
      problems.push(
        `${wrongType.join(", ")} — only PDF, JPG and PNG files are accepted`
      );
    if (tooBig.length)
      problems.push(`${tooBig.join(", ")} — each file must be under 10MB`);
    setFileError(
      problems.length ? `We couldn't add ${problems.join("; ")}.` : null
    );
  };

  const set = (field: Field) => (value: string) => {
    setData((d) => ({ ...d, [field]: value }));
    // Clear the inline error as soon as the user starts fixing it.
    setErrors((e) => (e[field] ? { ...e, [field]: undefined } : e));
  };

  const blurCheck = (field: Field) => () => {
    const msg = fieldError(field, data);
    if (msg) setErrors((e) => ({ ...e, [field]: msg }));
  };

  const goTo = (n: number) => {
    setDir(n > step ? 1 : -1);
    setStep(n);
    // Keep the card header in view when the wizard changes height on phones.
    cardRef.current?.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "nearest",
    });
  };

  const next = () => {
    const stepErrors: Errors = {};
    for (const f of STEP_FIELDS[step]) {
      const msg = fieldError(f, data);
      if (msg) stepErrors[f] = msg;
    }
    if (Object.keys(stepErrors).length > 0) {
      setErrors((e) => ({ ...e, ...stepErrors }));
      const first = STEP_FIELDS[step].find((f) => stepErrors[f]);
      if (first) document.getElementById(`dv-${first}`)?.focus();
      return;
    }
    goTo(step + 1);
  };

  const submit = async () => {
    if (submitting) return;
    setSubmitting(true);
    setSubmitError(null);

    const body = new window.FormData();
    body.append("payload", JSON.stringify(buildPayload(data)));
    for (const f of files) body.append("documents", f, f.name);

    try {
      const res = await fetch(ENQUIRY_ENDPOINT, {
        method: "POST",
        body,
        signal: AbortSignal.timeout(60_000),
      });
      const result: { ok?: boolean; reference?: string; error?: string } =
        await res.json();
      if (res.ok && result.ok) {
        setReference(result.reference ?? null);
        setSubmitted(true);
      } else {
        setSubmitError(
          result.error ?? "The application could not be submitted."
        );
      }
    } catch {
      // Network failure, timeout or an unparseable response — the entered
      // data stays in state so the user can simply retry.
      setSubmitError(
        "We couldn't reach our server — please check your connection."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const startNewApplication = () => {
    setData(EMPTY_FORM);
    setFiles([]);
    setErrors({});
    setFileError(null);
    setSubmitError(null);
    setReference(null);
    setSubmitted(false);
    setDir(-1);
    setStep(1);
  };

  const paneVariants = {
    enter: (d: number) => ({ x: reduce ? 0 : d * 36, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: reduce ? 0 : d * -36, opacity: 0 }),
  };

  return (
    <section
      id="dubai-visa"
      className="section relative scroll-mt-16 overflow-hidden bg-navy-950"
      aria-labelledby="dubai-visa-heading"
    >
      {/* Dubai skyline backdrop with a navy wash so copy stays readable */}
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src="https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1920&q=75"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950/95 via-navy-950/85 to-navy-900/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-navy-950/60" />
      </div>

      <div className="container-page relative">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left — pitch & benefits */}
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2">
                <span
                  className="h-1.5 w-1.5 rounded-full bg-accent-400"
                  aria-hidden="true"
                />
                <span className="t-eyebrow text-white">
                  Dubai Visa Specialists
                </span>
              </span>
              <h2
                id="dubai-visa-heading"
                className="t-h2 mt-5 text-[clamp(2rem,1.4rem+2.4vw,3rem)] text-white"
              >
                Dubai Visa
                <span className="block text-accent-400">
                  Expert Support from the UK
                </span>
              </h2>
              <p className="t-body-lg mt-5 max-w-xl text-navy-100/90">
                Expert support for your UAE tourist or visit visa — from
                eligibility check to submission. Quick, reliable, stress-free.
              </p>
            </Reveal>

            <Stagger className="mt-8">
              <ul className="space-y-3.5">
                {BENEFITS.map((b) => (
                  <li key={b}>
                    <StaggerItem className="flex items-start gap-3">
                      <span
                        className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent-500 text-white shadow-sm"
                        aria-hidden="true"
                      >
                        <Check className="h-3.5 w-3.5" strokeWidth={3} />
                      </span>
                      <span className="t-body font-medium text-white/90">
                        {b}
                      </span>
                    </StaggerItem>
                  </li>
                ))}
              </ul>
            </Stagger>
          </div>

          {/* Right — application wizard card */}
          <Reveal delay={0.1}>
            <div
              ref={cardRef}
              className="scroll-mt-24 overflow-hidden rounded-2xl bg-white shadow-2xl shadow-navy-950/40 ring-1 ring-white/20"
            >
              {/* Card header */}
              <div className="bg-gradient-to-r from-navy-900 to-navy-800 px-5 py-5 sm:px-8 sm:py-6">
                <h3 className="text-lg font-extrabold tracking-tight text-white sm:text-xl">
                  Apply For Dubai Visa
                </h3>
                <p className="mt-1.5 flex items-center gap-1.5 text-sm text-navy-100/85">
                  <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  Fill in below — our expert contacts you within 2 hours.
                </p>
              </div>

              <div className="px-5 py-6 sm:p-8">
                {submitted ? (
                  <motion.div
                    initial={reduce ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: EASE }}
                    className="py-8 text-center"
                    role="status"
                  >
                    <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-50">
                      <CheckCircle2
                        className="h-9 w-9 text-emerald-500"
                        aria-hidden="true"
                      />
                    </span>
                    <h4 className="t-h3 mt-5 text-xl text-navy-900">
                      Application received!
                    </h4>
                    {reference && (
                      <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-navy-50 px-4 py-1.5 text-sm text-navy-800">
                        Your reference:{" "}
                        <span className="font-extrabold tracking-wide text-navy-900">
                          {reference}
                        </span>
                      </p>
                    )}
                    <p className="t-small mx-auto mt-3 max-w-sm text-slate-600">
                      Thanks, {data.firstName || "traveler"} — our visa expert
                      will contact you within 2 hours{" "}
                      {data.contactMethod === "Call"
                        ? "by phone on "
                        : `via ${data.contactMethod || "email"} on `}
                      <span className="font-semibold text-navy-900">
                        {data.contactMethod === "Email" || !data.contactMethod
                          ? data.email
                          : data.phone}
                      </span>{" "}
                      to complete your application.
                    </p>
                    <button
                      type="button"
                      onClick={startNewApplication}
                      className="btn-outline mt-7 h-12 px-6"
                    >
                      Start a new application
                    </button>
                  </motion.div>
                ) : (
                  <>
                    <StepIndicator step={step} onJump={goTo} />

                    <form
                      noValidate
                      className="mt-7 sm:mt-8"
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (step < STEPS.length) next();
                        else submit();
                      }}
                    >
                      <AnimatePresence mode="wait" custom={dir} initial={false}>
                        <motion.div
                          key={step}
                          custom={dir}
                          variants={paneVariants}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          transition={
                            reduce
                              ? { duration: 0.15 }
                              : { duration: 0.28, ease: EASE }
                          }
                        >
                          <h4 className="t-h3 text-navy-900">
                            {STEPS[step - 1].title}
                          </h4>

                          {step === 1 && (
                            <div className="mt-6 grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2 sm:gap-x-5 sm:gap-y-6">
                              <YesNoField
                                id="dv-multiPerson"
                                label="Applying for more than 1 person?"
                                required
                                error={errors.multiPerson}
                                value={data.multiPerson}
                                onChange={set("multiPerson")}
                                className="sm:col-span-2"
                              />
                              <SelectField
                                id="dv-visaType"
                                label="Visa Type"
                                required
                                error={errors.visaType}
                                value={data.visaType}
                                onChange={set("visaType")}
                                onBlur={blurCheck("visaType")}
                                options={VISA_TYPES}
                              />
                              <SelectField
                                id="dv-purpose"
                                label="Purpose of Visit"
                                required
                                error={errors.purpose}
                                value={data.purpose}
                                onChange={set("purpose")}
                                onBlur={blurCheck("purpose")}
                                options={PURPOSES}
                              />
                              <TextField
                                id="dv-arrivalDate"
                                type="date"
                                label="Intended Arrival Date"
                                required
                                error={errors.arrivalDate}
                                value={data.arrivalDate}
                                onChange={set("arrivalDate")}
                                onBlur={blurCheck("arrivalDate")}
                              />
                              <TextField
                                id="dv-departureDate"
                                type="date"
                                label="Intended Departure Date"
                                error={errors.departureDate}
                                value={data.departureDate}
                                onChange={set("departureDate")}
                                onBlur={blurCheck("departureDate")}
                              />
                              <TextAreaField
                                id="dv-plans"
                                label="Planned Activities in Dubai"
                                placeholder="Tell us more about your plans in Dubai..."
                                value={data.plans}
                                onChange={set("plans")}
                                className="sm:col-span-2"
                              />
                            </div>
                          )}

                          {step === 2 && (
                            <div className="mt-6 grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2 sm:gap-x-5 sm:gap-y-6">
                              <TextField
                                id="dv-firstName"
                                label="First Name"
                                required
                                placeholder="As on passport"
                                autoComplete="given-name"
                                error={errors.firstName}
                                value={data.firstName}
                                onChange={set("firstName")}
                                onBlur={blurCheck("firstName")}
                              />
                              <TextField
                                id="dv-lastName"
                                label="Last Name"
                                required
                                placeholder="As on passport"
                                autoComplete="family-name"
                                error={errors.lastName}
                                value={data.lastName}
                                onChange={set("lastName")}
                                onBlur={blurCheck("lastName")}
                              />
                              <TextField
                                id="dv-otherNames"
                                label="Other Names Used"
                                placeholder="Previous name, maiden name, etc."
                                value={data.otherNames}
                                onChange={set("otherNames")}
                                className="sm:col-span-2"
                              />
                              <GroupBreak />
                              <TextField
                                id="dv-dob"
                                type="date"
                                label="Date of Birth"
                                required
                                autoComplete="bday"
                                error={errors.dob}
                                value={data.dob}
                                onChange={set("dob")}
                                onBlur={blurCheck("dob")}
                              />
                              <TextField
                                id="dv-birthPlace"
                                label="Place of Birth"
                                placeholder="City, Country"
                                value={data.birthPlace}
                                onChange={set("birthPlace")}
                              />
                              <TextField
                                id="dv-nationality"
                                label="Nationality"
                                required
                                placeholder="e.g. British"
                                error={errors.nationality}
                                value={data.nationality}
                                onChange={set("nationality")}
                                onBlur={blurCheck("nationality")}
                              />
                              <SelectField
                                id="dv-gender"
                                label="Gender"
                                value={data.gender}
                                onChange={set("gender")}
                                options={GENDERS}
                              />
                              <SelectField
                                id="dv-maritalStatus"
                                label="Marital Status"
                                value={data.maritalStatus}
                                onChange={set("maritalStatus")}
                                options={MARITAL_STATUSES}
                                className="sm:col-span-2"
                              />
                              <GroupBreak />
                              <TextField
                                id="dv-email"
                                type="email"
                                label="Email Address"
                                required
                                placeholder="you@example.com"
                                autoComplete="email"
                                error={errors.email}
                                value={data.email}
                                onChange={set("email")}
                                onBlur={blurCheck("email")}
                              />
                              <TextField
                                id="dv-phone"
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
                              <TextField
                                id="dv-ukAddress"
                                label="Full UK Residential Address"
                                placeholder="House, Street, City, Postcode"
                                autoComplete="street-address"
                                value={data.ukAddress}
                                onChange={set("ukAddress")}
                                className="sm:col-span-2"
                              />
                            </div>
                          )}

                          {step === 3 && (
                            <div className="mt-6 grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2 sm:gap-x-5 sm:gap-y-6">
                              <SelectField
                                id="dv-passportType"
                                label="Passport Type"
                                value={data.passportType}
                                onChange={set("passportType")}
                                options={PASSPORT_TYPES}
                                className="sm:col-span-2"
                              />
                              <TextField
                                id="dv-passportNumber"
                                label="Passport Number"
                                required
                                placeholder="e.g. AB1234567"
                                error={errors.passportNumber}
                                value={data.passportNumber}
                                onChange={set("passportNumber")}
                                onBlur={blurCheck("passportNumber")}
                              />
                              <TextField
                                id="dv-confirmPassport"
                                label="Confirm Passport Number"
                                required
                                placeholder="Re-enter"
                                error={errors.confirmPassport}
                                value={data.confirmPassport}
                                onChange={set("confirmPassport")}
                                onBlur={blurCheck("confirmPassport")}
                              />
                              <TextField
                                id="dv-issueDate"
                                type="date"
                                label="Passport Issue Date"
                                required
                                error={errors.issueDate}
                                value={data.issueDate}
                                onChange={set("issueDate")}
                                onBlur={blurCheck("issueDate")}
                              />
                              <TextField
                                id="dv-expiryDate"
                                type="date"
                                label="Passport Expiry Date"
                                required
                                error={errors.expiryDate}
                                value={data.expiryDate}
                                onChange={set("expiryDate")}
                                onBlur={blurCheck("expiryDate")}
                              />
                              <TextField
                                id="dv-issuingCountry"
                                label="Issuing Country of Passport"
                                placeholder="e.g. United Kingdom"
                                value={data.issuingCountry}
                                onChange={set("issuingCountry")}
                                className="sm:col-span-2"
                              />
                              <GroupBreak />
                              <TextField
                                id="dv-ukVisaRef"
                                label="UK Visa / BRP Reference"
                                placeholder="UK BRP number or visa reference"
                                value={data.ukVisaRef}
                                onChange={set("ukVisaRef")}
                                className="sm:col-span-2"
                              />
                              <TextField
                                id="dv-ukVisaStart"
                                type="date"
                                label="UK Visa Start Date"
                                value={data.ukVisaStart}
                                onChange={set("ukVisaStart")}
                              />
                              <TextField
                                id="dv-ukVisaEnd"
                                type="date"
                                label="UK Visa Expiry Date"
                                value={data.ukVisaEnd}
                                onChange={set("ukVisaEnd")}
                              />
                              <GroupBreak />
                              <YesNoField
                                id="dv-visitedUae"
                                label="Previously visited the UAE?"
                                value={data.visitedUae}
                                onChange={set("visitedUae")}
                              />
                              <TextField
                                id="dv-prevUaeVisa"
                                label="Previous UAE Visa Number"
                                placeholder="If applicable"
                                value={data.prevUaeVisa}
                                onChange={set("prevUaeVisa")}
                              />
                            </div>
                          )}

                          {step === 4 && (
                            <div className="mt-6 grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2 sm:gap-x-5 sm:gap-y-6">
                              <SelectField
                                id="dv-occupation"
                                label="Occupation"
                                required
                                error={errors.occupation}
                                value={data.occupation}
                                onChange={set("occupation")}
                                onBlur={blurCheck("occupation")}
                                options={OCCUPATIONS}
                                className="sm:col-span-2"
                              />
                              <TextField
                                id="dv-employer"
                                label="Employer / Business Name"
                                placeholder="Employer name"
                                autoComplete="organization"
                                value={data.employer}
                                onChange={set("employer")}
                              />
                              <TextField
                                id="dv-jobTitle"
                                label="Job Title"
                                placeholder="Your role"
                                autoComplete="organization-title"
                                value={data.jobTitle}
                                onChange={set("jobTitle")}
                              />
                              <TextField
                                id="dv-employerAddress"
                                label="Employer Address"
                                placeholder="Full employer address"
                                value={data.employerAddress}
                                onChange={set("employerAddress")}
                                className="sm:col-span-2"
                              />
                              <GroupBreak />
                              <YesNoField
                                id="dv-refusedEntry"
                                label="Have you ever been refused entry to the UAE?"
                                value={data.refusedEntry}
                                onChange={set("refusedEntry")}
                              />
                              <YesNoField
                                id="dv-criminalConviction"
                                label="Have you been convicted of any criminal offence?"
                                value={data.criminalConviction}
                                onChange={set("criminalConviction")}
                              />
                              <GroupBreak />
                              <SelectField
                                id="dv-costCoverer"
                                label="Who is covering your travel costs?"
                                value={data.costCoverer}
                                onChange={set("costCoverer")}
                                options={COST_COVERERS}
                                className="sm:col-span-2"
                              />
                              <ContactMethodField
                                id="dv-contactMethod"
                                label="Preferred Contact Method"
                                required
                                error={errors.contactMethod}
                                value={data.contactMethod}
                                onChange={set("contactMethod")}
                                className="sm:col-span-2"
                              />
                            </div>
                          )}

                          {step === 5 && (
                            <div className="mt-6 space-y-5 sm:space-y-6">
                              <p className="t-small text-slate-600">
                                Upload your passport, BRP card and any
                                supporting documents. You can also email them
                                to{" "}
                                <a
                                  href={`mailto:${BUSINESS.email}`}
                                  className="font-semibold text-navy-800 underline decoration-accent-400 decoration-2 underline-offset-2 hover:text-accent-600"
                                >
                                  {BUSINESS.email}
                                </a>
                                .
                              </p>

                              <div>
                                <input
                                  ref={fileInputRef}
                                  type="file"
                                  multiple
                                  accept={ACCEPTED_FILES}
                                  className="sr-only"
                                  aria-hidden="true"
                                  tabIndex={-1}
                                  onChange={(e) => {
                                    addFiles(e.target.files);
                                    e.target.value = "";
                                  }}
                                />
                                <button
                                  type="button"
                                  onClick={() => fileInputRef.current?.click()}
                                  onDragOver={(e) => {
                                    e.preventDefault();
                                    setDragOver(true);
                                  }}
                                  onDragLeave={() => setDragOver(false)}
                                  onDrop={(e) => {
                                    e.preventDefault();
                                    setDragOver(false);
                                    addFiles(e.dataTransfer.files);
                                  }}
                                  aria-label="Upload documents — PDF, JPG and PNG accepted"
                                  className={cn(
                                    "flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 text-center transition-colors",
                                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500 focus-visible:ring-offset-2",
                                    dragOver
                                      ? "border-accent-500 bg-accent-50"
                                      : "border-slate-300 bg-slate-50/60 hover:border-accent-400 hover:bg-accent-50/50"
                                  )}
                                >
                                  <span
                                    className="grid h-11 w-11 place-items-center rounded-full bg-accent-100 text-accent-600"
                                    aria-hidden="true"
                                  >
                                    <UploadCloud className="h-5 w-5" />
                                  </span>
                                  <span className="text-sm font-bold text-navy-900">
                                    Click to upload documents
                                  </span>
                                  <span className="text-xs text-slate-500">
                                    PDF, JPG, PNG accepted
                                  </span>
                                </button>

                                {files.length > 0 && (
                                  <ul
                                    className="mt-3 flex flex-wrap gap-2"
                                    aria-label="Selected documents"
                                  >
                                    <AnimatePresence initial={false}>
                                      {files.map((f) => (
                                        <motion.li
                                          key={`${f.name}-${f.size}`}
                                          initial={
                                            reduce
                                              ? false
                                              : { opacity: 0, scale: 0.9 }
                                          }
                                          animate={{ opacity: 1, scale: 1 }}
                                          exit={
                                            reduce
                                              ? { opacity: 0 }
                                              : { opacity: 0, scale: 0.9 }
                                          }
                                          transition={{
                                            duration: 0.18,
                                            ease: EASE,
                                          }}
                                          className="flex max-w-full items-center gap-1.5 rounded-full border border-navy-100 bg-navy-50 py-1 pl-3 pr-1 text-xs font-semibold text-navy-800"
                                        >
                                          <span className="max-w-[180px] truncate">
                                            {f.name}
                                          </span>
                                          <button
                                            type="button"
                                            onClick={() =>
                                              setFiles((prev) =>
                                                prev.filter((p) => p !== f)
                                              )
                                            }
                                            aria-label={`Remove ${f.name}`}
                                            className="grid h-6 w-6 place-items-center rounded-full text-navy-500 transition-colors hover:bg-navy-100 hover:text-navy-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500"
                                          >
                                            <X
                                              className="h-3.5 w-3.5"
                                              aria-hidden="true"
                                            />
                                          </button>
                                        </motion.li>
                                      ))}
                                    </AnimatePresence>
                                  </ul>
                                )}

                                {fileError && (
                                  <p
                                    role="alert"
                                    className="mt-3 flex items-start gap-1.5 text-xs font-medium text-red-600"
                                  >
                                    <AlertCircle
                                      className="mt-px h-3.5 w-3.5 shrink-0"
                                      aria-hidden="true"
                                    />
                                    {fileError}
                                  </p>
                                )}
                              </div>

                              <TextAreaField
                                id="dv-notes"
                                label="Additional Notes / Questions"
                                placeholder="Anything else we should know about your application?"
                                value={data.notes}
                                onChange={set("notes")}
                              />

                              <div className="flex items-start gap-3 rounded-xl border border-navy-100 bg-navy-50/70 p-4 sm:p-5">
                                <span
                                  className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent-500 text-white"
                                  aria-hidden="true"
                                >
                                  <Lock className="h-4 w-4" />
                                </span>
                                <p className="text-xs leading-relaxed text-navy-800">
                                  <span className="font-bold text-navy-900">
                                    GDPR Compliant &amp; Secure
                                  </span>{" "}
                                  — your data is used solely for your visa
                                  application.
                                </p>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      </AnimatePresence>

                      {submitError && (
                        <div
                          role="alert"
                          className="mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 sm:p-5"
                        >
                          <AlertCircle
                            className="mt-0.5 h-5 w-5 shrink-0 text-red-500"
                            aria-hidden="true"
                          />
                          <div className="text-sm leading-relaxed text-red-800">
                            <p className="font-bold">
                              We couldn&apos;t submit your application.
                            </p>
                            <p className="mt-1">
                              {submitError} Everything you&apos;ve entered is
                              still here — please try again, or call / WhatsApp
                              us on{" "}
                              <a
                                href={`tel:${BUSINESS.phone}`}
                                className="font-semibold underline decoration-red-300 decoration-2 underline-offset-2 hover:text-red-900"
                              >
                                {BUSINESS.phoneDisplay}
                              </a>{" "}
                              and we&apos;ll take it from there.
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Wizard controls */}
                      <div className="mt-8 flex items-center justify-between gap-4 border-t border-slate-100 pt-6">
                        <button
                          type="button"
                          onClick={() => goTo(step - 1)}
                          className={cn(
                            "btn-outline h-12 px-6",
                            step === 1 && "invisible"
                          )}
                          aria-hidden={step === 1 || undefined}
                          tabIndex={step === 1 ? -1 : undefined}
                        >
                          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                          Back
                        </button>
                        <span
                          className="hidden text-xs font-semibold text-slate-400 sm:block"
                          aria-live="polite"
                        >
                          Step {step} of {STEPS.length}
                        </span>
                        {step < STEPS.length ? (
                          <button type="submit" className="btn-primary h-12 px-7">
                            Next
                            <ChevronRight className="h-4 w-4" aria-hidden="true" />
                          </button>
                        ) : (
                          <button
                            type="submit"
                            disabled={submitting}
                            className={cn(
                              "btn-primary h-12 px-7",
                              submitting && "cursor-wait opacity-70"
                            )}
                          >
                            {submitting ? (
                              <>
                                <Loader2
                                  className="h-4 w-4 animate-spin"
                                  aria-hidden="true"
                                />
                                Submitting…
                              </>
                            ) : (
                              <>
                                Submit Application
                                <Send className="h-4 w-4" aria-hidden="true" />
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </form>
                  </>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
