"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Cookie } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const STORAGE_KEY = "wicket-cookie-consent";

export default function CookieConsent() {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const [show, setShow] = useState(false);

  // Show only if no prior choice (localStorage allowed in this real app).
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

  const decide = (choice: "all" | "rejected" | "preferences") => {
    try {
      window.localStorage.setItem(STORAGE_KEY, choice);
    } catch {
      /* ignore */
    }
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 bottom-0 z-[70] p-3 sm:p-4"
          role="dialog"
          aria-label={t("cookie.title")}
          aria-live="polite"
        >
          <div className="mx-auto flex max-w-5xl flex-col gap-4 rounded-2xl bg-navy-900 p-5 shadow-2xl ring-1 ring-white/10 sm:flex-row sm:items-center sm:gap-6 sm:p-6">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/10 text-accent-400">
              <Cookie className="h-6 w-6" aria-hidden="true" />
            </span>
            <div className="flex-1">
              <h2 className="text-sm font-bold text-white">{t("cookie.title")}</h2>
              <p className="mt-1 text-sm leading-relaxed text-navy-100">{t("cookie.body")}</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={() => decide("preferences")}
                className="order-3 rounded-full px-4 py-2.5 text-sm font-semibold text-navy-100 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:order-1"
              >
                {t("cookie.prefs")}
              </button>
              <button
                type="button"
                onClick={() => decide("rejected")}
                className="order-2 rounded-full border border-white/25 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                {t("cookie.reject")}
              </button>
              <button
                type="button"
                onClick={() => decide("all")}
                className="btn-primary order-1 px-5 py-2.5 focus-visible:ring-offset-navy-900 sm:order-3"
              >
                {t("cookie.accept")}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
