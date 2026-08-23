"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Loader2,
  Send,
  X,
} from "lucide-react";
import { Reveal } from "@/components/motion-primitives";

/**
 * Dubai Visa — marketing banner only. The full application wizard is retired;
 * the banner's CTA opens a short enquiry modal that posts to the same
 * /api/visa-enquiry relay, so an expert can call the traveller back and take
 * the detail over the phone.
 */

const VISA_TYPES = [
  "Tourist Visa — 30 days",
  "Tourist Visa — 60 days",
  "Visit Visa",
  "Not sure yet",
];

const PERKS = [
  "Eligibility checked before you pay",
  "Documents reviewed by a UAE visa expert",
  "A real person calls you back within 2 hours",
];

type Field ="first_name" |"last_name" |"email" |"phone";

const EMPTY = {
  visa_type: VISA_TYPES[0],
  first_name:"",
  last_name:"",
  email:"",
  phone:"",
  additional_notes:"",
};

const EMAIL_RE = /^\S+@\S+\.\S+$/;

export default function VisaBanner() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Lock body scroll, close on Escape, and move focus into the dialog.
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow ="hidden";
    const onKey = (e: KeyboardEvent) => e.key ==="Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow ="";
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const set = (key: keyof typeof EMPTY, value: string) => {
    setData((d) => ({ ...d, [key]: value }));
    if (key in errors)
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key as Field];
        return next;
      });
  };

  const validate = () => {
    const next: Partial<Record<Field, string>> = {};
    if (!data.first_name.trim()) next.first_name ="Enter your first name.";
    if (!data.last_name.trim()) next.last_name ="Enter your last name.";
    if (!EMAIL_RE.test(data.email.trim()))
      next.email ="Enter a valid email address.";
    if (!data.phone.trim()) next.phone ="Enter your phone number.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    if (!validate()) return;

    setSubmitting(true);
    try {
      // The relay expects multipart: a `payload` JSON string (documents are
      // collected later, on the call-back).
      const body = new FormData();
      body.append("payload", JSON.stringify(data));
      const res = await fetch("/api/visa-enquiry", { method:"POST", body });
      const result: { ok?: boolean; reference?: string; error?: string } =
        await res.json();
      if (res.ok && result.ok) {
        setReference(result.reference ?? null);
        setSubmitted(true);
      } else {
        setSubmitError(result.error ??"The enquiry could not be submitted.");
      }
    } catch {
      // Network failure or an unparseable response — entered data stays put so
      // the visitor can simply retry.
      setSubmitError("We couldn't reach our server — please check your connection.");
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setData(EMPTY);
    setErrors({});
    setSubmitError(null);
    setReference(null);
    setSubmitted(false);
  };

  const field =
    "mt-2 w-full rounded-md border border-neutral-300 bg-neutral-000 px-4 py-3 t-body-sm text-primary-800 outline-none transition-colors placeholder:text-text-tertiary focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20";
  const label ="t-label-2 text-primary-800";

  return (
    <section
      id="dubai-visa"
      className="section scroll-mt-16 bg-sand-500"
      aria-labelledby="dubai-visa-heading"
    >
      <div className="container-page">
        <Reveal className="relative overflow-hidden rounded-lg bg-gradient-to-br from-primary-800 via-primary-800 to-primary-900 shadow-e3 shadow-primary-900/30 ring-1 ring-neutral-000/10">
          {/* Soft accent glows */}

          <div className="relative grid items-center gap-8 px-6 py-10 sm:px-10 sm:py-12 lg:grid-cols-[1fr_auto] lg:gap-12">
            <div className="text-center lg:text-left">
              <h2 id="dubai-visa-heading" className="t-h2 text-text-on-dark">
                Dubai visa help, handled end to end
              </h2>
              <p className="t-body-lg mx-auto mt-4 max-w-xl text-primary-200 lg:mx-0">
                Expert support for your UAE tourist or visit visa — from the
                eligibility check right through to submission. Quick, reliable,
                stress-free.
              </p>
              <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 t-label-2 text-primary-100 lg:justify-start">
                {PERKS.map((perk) => (
                  <li key={perk} className="inline-flex items-center gap-2">
                    <CheckCircle2
                      className="h-4 w-4 shrink-0 text-accent-400"
                      aria-hidden="true"
                    />
                    {perk}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex shrink-0 flex-col items-center gap-3">
              <motion.button
                type="button"
                onClick={() => setOpen(true)}
                whileHover={reduce ? undefined : { scale: 1.03 }}
                whileTap={reduce ? undefined : { scale: 0.98 }}
                className="inline-flex items-center gap-3 rounded-full bg-accent-500 px-8 py-4 t-label-1 text-text-on-dark shadow-e2 shadow-accent-500/30 transition-colors hover:bg-accent-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-800"
              >
                Start your visa enquiry
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </motion.button>
              <p className="flex items-center gap-2 t-body-sm text-primary-300">
                <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                Takes a minute — no account needed
              </p>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Enquiry modal */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 flex z-modal items-end justify-center p-0 sm:items-center sm:p-6">
            <motion.div
              key="visa-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease:"easeOut" }}
              onClick={() => setOpen(false)}
              aria-hidden="true"
              className="absolute inset-0 bg-primary-900/60 backdrop-blur-sm"
            />
            <motion.div
              key="visa-panel"
              role="dialog"
              aria-modal="true"
              aria-labelledby="visa-modal-title"
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex max-h-[92dvh] w-full max-w-xl flex-col overflow-hidden rounded-t-lg bg-neutral-000 shadow-e3 sm:rounded-lg"
            >
              <div className="flex shrink-0 items-start justify-between gap-4 bg-gradient-to-r from-primary-800 to-primary-800 px-6 py-6 sm:px-8">
                <div>
                  <h3
                    id="visa-modal-title"
                    className="t-h4 text-text-on-dark"
                  >
                    Dubai visa enquiry
                  </h3>
                  <p className="mt-2 flex items-center gap-2 t-body-sm text-primary-100/85">
                    <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    Our expert contacts you within 2 hours.
                  </p>
                </div>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close enquiry form"
                  className="-mr-2 -mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-sm text-text-on-dark/80 transition-colors hover:bg-neutral-000/10 hover:text-text-on-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-000/50"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="overflow-y-auto overscroll-contain px-6 py-6 sm:px-8">
                {submitted ? (
                  <div className="py-6 text-center" role="status">
                    <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-success-surface">
                      <CheckCircle2
                        className="h-9 w-9 text-success"
                        aria-hidden="true"
                      />
                    </span>
                    <h4 className="t-h3 mt-6 t-body-lg text-primary-800">
                      Enquiry received!
                    </h4>
                    {reference && (
                      <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-primary-050 px-4 py-2 t-body-sm text-primary-800">
                        Your reference:{""}
                        <span className="font-extrabold  text-primary-800">
                          {reference}
                        </span>
                      </p>
                    )}
                    <p className="t-body-sm mx-auto mt-4 max-w-sm text-text-secondary">
                      A Wicket Travel visa expert will call you back within 2
                      hours to confirm your details and next steps.
                    </p>
                    <div className="mt-8 flex flex-wrap justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="btn btn-primary px-6 py-3"
                      >
                        Done
                      </button>
                      <button
                        type="button"
                        onClick={reset}
                        className="btn btn-outline px-6 py-3"
                      >
                        Send another
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={submit} noValidate className="space-y-4">
                    <div>
                      <label htmlFor="vb-type" className={label}>
                        Visa type
                      </label>
                      <select
                        id="vb-type"
                        value={data.visa_type}
                        onChange={(e) => set("visa_type", e.target.value)}
                        className={field}
                      >
                        {VISA_TYPES.map((v) => (
                          <option key={v} value={v}>
                            {v}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="vb-first" className={label}>
                          First name
                        </label>
                        <input
                          id="vb-first"
                          value={data.first_name}
                          onChange={(e) => set("first_name", e.target.value)}
                          autoComplete="given-name"
                          aria-invalid={!!errors.first_name}
                          aria-describedby={
                            errors.first_name ?"vb-first-error" : undefined
                          }
                          className={field}
                          placeholder="Aisha"
                        />
                        {errors.first_name && (
                          <p id="vb-first-error" className="mt-2 t-label-3 text-error">
                            {errors.first_name}
                          </p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="vb-last" className={label}>
                          Last name
                        </label>
                        <input
                          id="vb-last"
                          value={data.last_name}
                          onChange={(e) => set("last_name", e.target.value)}
                          autoComplete="family-name"
                          aria-invalid={!!errors.last_name}
                          aria-describedby={
                            errors.last_name ?"vb-last-error" : undefined
                          }
                          className={field}
                          placeholder="Khan"
                        />
                        {errors.last_name && (
                          <p id="vb-last-error" className="mt-2 t-label-3 text-error">
                            {errors.last_name}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="vb-email" className={label}>
                          Email
                        </label>
                        <input
                          id="vb-email"
                          type="email"
                          inputMode="email"
                          value={data.email}
                          onChange={(e) => set("email", e.target.value)}
                          autoComplete="email"
                          aria-invalid={!!errors.email}
                          aria-describedby={
                            errors.email ?"vb-email-error" : undefined
                          }
                          className={field}
                          placeholder="you@example.com"
                        />
                        {errors.email && (
                          <p id="vb-email-error" className="mt-2 t-label-3 text-error">
                            {errors.email}
                          </p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="vb-phone" className={label}>
                          Phone
                        </label>
                        <input
                          id="vb-phone"
                          type="tel"
                          inputMode="tel"
                          value={data.phone}
                          onChange={(e) => set("phone", e.target.value)}
                          autoComplete="tel"
                          aria-invalid={!!errors.phone}
                          aria-describedby={
                            errors.phone ?"vb-phone-error" : undefined
                          }
                          className={field}
                          placeholder="+44 7000 000000"
                        />
                        {errors.phone && (
                          <p id="vb-phone-error" className="mt-2 t-label-3 text-error">
                            {errors.phone}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="vb-notes" className={label}>
                        Anything we should know?{""}
                        <span className="font-normal text-text-secondary">(optional)</span>
                      </label>
                      <textarea
                        id="vb-notes"
                        rows={3}
                        value={data.additional_notes}
                        onChange={(e) => set("additional_notes", e.target.value)}
                        className={`${field} resize-y`}
                        placeholder="Travel dates, number of applicants, previous UAE visas…"
                      />
                    </div>

                    {submitError && (
                      <p
                        role="alert"
                        className="rounded-md bg-error-surface px-4 py-3 t-label-2 text-error"
                      >
                        {submitError}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn btn-primary w-full px-6 py-4 t-body disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                          Sending…
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" aria-hidden="true" />
                          Send enquiry
                        </>
                      )}
                    </button>
                    <p className="text-center t-caption text-text-secondary">
                      We only use your details to answer this enquiry.
                    </p>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
