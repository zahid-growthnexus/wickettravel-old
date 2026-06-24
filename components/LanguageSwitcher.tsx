"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, Globe } from "lucide-react";
import { LANGUAGES, useI18n } from "@/lib/i18n";
import { cn } from "@/lib/cn";

export default function LanguageSwitcher() {
  const { lang, setLang, t, dir } = useI18n();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click / Escape.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Sit opposite the chatbot: chatbot is right in LTR / left in RTL.
  const side = dir === "rtl" ? "right-4 sm:right-5" : "left-4 sm:left-5";
  const current = LANGUAGES.find((l) => l.code === lang);

  return (
    <div ref={ref} className={cn("fixed bottom-4 z-50 sm:bottom-5", side)}>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "absolute bottom-14 w-56 overflow-hidden rounded-2xl bg-white p-2 shadow-2xl ring-1 ring-black/10",
              dir === "rtl" ? "right-0" : "left-0"
            )}
            role="menu"
            aria-label={t("lang.title")}
          >
            <div className="px-3 py-2 text-xs font-bold uppercase tracking-wide text-slate-500">
              {t("lang.title")}
            </div>
            {LANGUAGES.map((l) => {
              const active = l.code === lang;
              return (
                <button
                  key={l.code}
                  type="button"
                  role="menuitemradio"
                  aria-checked={active}
                  onClick={() => {
                    setLang(l.code);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500",
                    active
                      ? "bg-navy-50 font-bold text-navy-900"
                      : "font-medium text-slate-700 hover:bg-mist"
                  )}
                >
                  <span className="flex flex-col items-start">
                    <span>{l.native}</span>
                    <span className="text-xs font-normal text-slate-500">{l.label}</span>
                  </span>
                  {active && <Check className="h-4 w-4 text-accent-500" aria-hidden="true" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        whileHover={reduce ? undefined : { scale: 1.05 }}
        whileTap={reduce ? undefined : { scale: 0.95 }}
        className="flex h-12 items-center gap-2 rounded-full bg-white px-4 text-sm font-bold text-navy-900 shadow-lg ring-1 ring-slate-200 transition-colors hover:bg-mist focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500"
        aria-label={t("lang.title")}
        aria-expanded={open}
      >
        <Globe className="h-5 w-5 text-navy-700" aria-hidden="true" />
        <span className="uppercase">{current?.code}</span>
      </motion.button>
    </div>
  );
}
