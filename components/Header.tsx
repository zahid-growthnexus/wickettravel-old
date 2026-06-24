"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, Plane, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { useI18n } from "@/lib/i18n";
import TrustpilotBadge from "@/components/TrustpilotBadge";

const NAV_LINKS = [
  { key: "nav.flights", href: "#destinations" },
  { key: "nav.hotels", href: "#destinations" },
  { key: "nav.cars", href: "#destinations" },
  { key: "nav.deals", href: "#deals" },
  { key: "nav.about", href: "#how-it-works" },
  { key: "nav.contact", href: "#newsletter" },
];

export default function Header() {
  const { t, dir } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const reduce = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll, trap focus, Esc-to-close, restore focus on close.
  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = "hidden";
    const focusId = window.setTimeout(() => panelRef.current?.focus(), 60);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const panel = panelRef.current;
      if (!panel) return;
      const items = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
      window.clearTimeout(focusId);
      toggleRef.current?.focus();
    };
  }, [open]);

  const fromRight = dir !== "rtl";
  const offscreen = fromRight ? "100%" : "-100%";

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b border-navy-100 bg-white/90 shadow-sm backdrop-blur-md"
          : "border-b border-transparent bg-white/0"
      )}
    >
      <div className="container-page flex h-16 items-center justify-between">
        {/* Logo */}
        <a href="#top" className="group flex items-center gap-2" aria-label="Wicket Travel home">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-navy-800 text-white shadow-sm transition-transform duration-200 group-hover:-translate-y-0.5">
            <Plane className="h-5 w-5 -rotate-45" strokeWidth={2.25} />
          </span>
          <span className="text-lg font-extrabold tracking-tight text-navy-900">
            Wicket<span className="text-accent-500">Travel</span>
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <a
              key={link.key}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors duration-200 hover:bg-navy-50 hover:text-navy-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500 focus-visible:ring-offset-2"
            >
              {t(link.key)}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <TrustpilotBadge className="hidden xl:inline-flex" />
          <a
            href="#deals"
            className="hidden rounded-full bg-accent-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-accent-600 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 sm:inline-flex"
          >
            {t("cta.findDeals")}
          </a>

          {/* Mobile toggle */}
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-navy-900 transition-colors hover:bg-navy-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500 lg:hidden"
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile drawer — portaled to body so it escapes the header's
          backdrop-filter containing block and covers the full viewport. */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <div className="fixed inset-0 z-[60] lg:hidden">
                {/* Backdrop */}
                <motion.div
                  className="absolute inset-0 bg-navy-950/55 backdrop-blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  onClick={() => setOpen(false)}
                  aria-hidden="true"
                />

                {/* Panel */}
                <motion.div
                  id="mobile-menu"
                  ref={panelRef}
                  role="dialog"
                  aria-modal="true"
                  aria-label="Menu"
                  tabIndex={-1}
                  initial={reduce ? { opacity: 0 } : { x: offscreen }}
                  animate={reduce ? { opacity: 1 } : { x: 0 }}
                  exit={reduce ? { opacity: 0 } : { x: offscreen }}
                  transition={
                    reduce
                      ? { duration: 0.2 }
                      : { type: "spring", stiffness: 320, damping: 34 }
                  }
                  className={cn(
                    "absolute inset-y-0 flex w-[min(20rem,86vw)] flex-col bg-white shadow-2xl outline-none",
                    fromRight ? "right-0" : "left-0"
                  )}
                >
                  {/* Panel header */}
                  <div className="flex h-16 shrink-0 items-center justify-between border-b border-navy-100 px-5">
                    <span className="flex items-center gap-2">
                      <span className="grid h-9 w-9 place-items-center rounded-xl bg-navy-800 text-white">
                        <Plane className="h-5 w-5 -rotate-45" strokeWidth={2.25} />
                      </span>
                      <span className="text-lg font-extrabold tracking-tight text-navy-900">
                        Wicket<span className="text-accent-500">Travel</span>
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-navy-900 transition-colors hover:bg-navy-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500"
                      aria-label="Close menu"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>

                  {/* Links */}
                  <nav
                    className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 py-4"
                    aria-label="Mobile"
                  >
                    {NAV_LINKS.map((link) => (
                      <a
                        key={link.key}
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className="flex min-h-[48px] items-center rounded-xl px-3 text-base font-semibold text-navy-900 transition-colors hover:bg-navy-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500"
                      >
                        {t(link.key)}
                      </a>
                    ))}
                  </nav>

                  {/* Footer: trust + CTA */}
                  <div className="shrink-0 border-t border-navy-100 px-5 py-4">
                    <TrustpilotBadge compact className="!px-0" />
                    <a
                      href="#deals"
                      onClick={() => setOpen(false)}
                      className="mt-4 flex min-h-[48px] items-center justify-center rounded-full bg-accent-500 px-5 text-base font-semibold text-white shadow-sm transition-colors hover:bg-accent-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2"
                    >
                      {t("cta.findDeals")}
                    </a>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </header>
  );
}
