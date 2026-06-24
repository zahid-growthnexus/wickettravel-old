"use client";

import { useEffect, useState } from "react";
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
  const { t } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

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
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-navy-900 transition-colors hover:bg-navy-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500 lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={reduce ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden border-t border-navy-100 bg-white lg:hidden"
          >
            <nav className="flex flex-col gap-1 px-5 py-4 sm:px-6" aria-label="Mobile">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.key}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-3 text-base font-medium text-slate-700 transition-colors hover:bg-navy-50 hover:text-navy-800"
                >
                  {t(link.key)}
                </a>
              ))}
              <div className="mt-2 px-3">
                <TrustpilotBadge compact className="!px-0" />
              </div>
              <a
                href="#deals"
                onClick={() => setOpen(false)}
                className="mt-2 rounded-full bg-accent-500 px-5 py-3 text-center text-base font-semibold text-white transition-colors hover:bg-accent-600"
              >
                {t("cta.findDeals")}
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
