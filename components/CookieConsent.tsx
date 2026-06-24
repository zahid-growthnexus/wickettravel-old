"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Cookie } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const STORAGE_KEY = "wicket-cookie-consent";

type Choice = "all" | "rejected" | "preferences";

export default function CookieConsent() {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const [show, setShow] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const acceptRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  // Show only on first visit (no prior choice stored).
  useEffect(() => {
    try {
      if (!window.localStorage.getItem(STORAGE_KEY)) {
        const id = window.setTimeout(() => setShow(true), 600);
        return () => window.clearTimeout(id);
      }
    } catch {
      setShow(true);
    }
  }, []);

  const decide = useCallback((choice: Choice) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, choice);
    } catch {
      /* ignore */
    }
    setShow(false);
  }, []);

  // Focus management, Esc-to-dismiss, focus trap, scroll lock.
  useEffect(() => {
    if (!show) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const focusId = window.setTimeout(() => acceptRef.current?.focus(), 60);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        decide("rejected");
        return;
      }
      if (e.key !== "Tab") return;

      const card = cardRef.current;
      if (!card) return;
      const focusables = card.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.clearTimeout(focusId);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
      previouslyFocused.current?.focus?.();
    };
  }, [show, decide]);

  return (
    <AnimatePresence>
      {show && (
        // Soft dark, blurred backdrop — also the centering container and the
        // AnimatePresence direct child so nested exit animations run.
        <motion.div
          className="fixed inset-0 z-[80] grid place-items-center bg-navy-950/60 p-4 backdrop-blur-sm sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          onClick={() => decide("rejected")}
        >
          {/* Compact centered card */}
          <motion.div
            ref={cardRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-title"
            aria-describedby="cookie-body"
            onClick={(e) => e.stopPropagation()}
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 24 }}
            animate={
              reduce
                ? { opacity: 1 }
                : {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    transition: { type: "spring", stiffness: 300, damping: 26, mass: 0.9 },
                  }
            }
            exit={
              reduce
                ? { opacity: 0 }
                : {
                    opacity: 0,
                    scale: 0.96,
                    y: 10,
                    transition: { duration: 0.18, ease: [0.4, 0, 1, 1] },
                  }
            }
            className="relative max-h-[calc(100dvh-2rem)] w-full max-w-[420px] overflow-y-auto rounded-2xl bg-white p-6 text-center shadow-2xl ring-1 ring-navy-950/5 sm:p-7"
          >
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-accent-50 text-accent-500 ring-1 ring-accent-100">
              <Cookie className="h-6 w-6" aria-hidden="true" />
            </span>

            <h2
              id="cookie-title"
              className="mt-4 text-lg font-bold tracking-tight text-navy-900"
            >
              {t("cookie.title")}
            </h2>
            <p
              id="cookie-body"
              className="mx-auto mt-2 max-w-[34ch] text-sm leading-relaxed text-slate"
            >
              {t("cookie.body")}
            </p>

            <div className="mt-6 flex flex-col gap-2.5">
              <button
                ref={acceptRef}
                type="button"
                onClick={() => decide("all")}
                className="btn-primary w-full px-5 py-3 focus-visible:ring-offset-white"
              >
                {t("cookie.accept")}
              </button>
              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => decide("preferences")}
                  className="cursor-pointer rounded-full px-2 py-1.5 text-sm font-semibold text-navy-600 underline-offset-4 transition-colors hover:text-navy-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500"
                >
                  {t("cookie.prefs")}
                </button>
                <button
                  type="button"
                  onClick={() => decide("rejected")}
                  className="btn-outline px-5 py-2.5"
                >
                  {t("cookie.reject")}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
