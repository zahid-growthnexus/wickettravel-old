"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { useI18n } from "@/lib/i18n";
import { HOLIDAYS_URL, PORTAL_LOGIN_URL } from "@/lib/links";
import TrustpilotBadge from "@/components/TrustpilotBadge";

const NAV_LINKS: { key: string; href: string; external?: boolean }[] = [
  { key: "nav.flights", href: "#top" },
  { key: "nav.hotels", href: HOLIDAYS_URL, external: true },
  { key: "nav.cars", href: HOLIDAYS_URL, external: true },
  { key: "nav.deals", href: "#deals" },
  { key: "nav.dubaiVisa", href: "#dubai-visa" },
  { key: "nav.parentsTickets", href: "#parents-tickets" },
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

  // Lock body scroll + close on Escape while the mobile drawer is open.
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 w-full transition-all duration-300",
        // The header owns a stacking context. While the drawer is open, lift the
        // whole header above the floating WhatsApp / language launchers (z-50) so
        // the backdrop covers them instead of them poking through the drawer.
        open ? "z-[70]" : "z-50",
        scrolled
          // Solid-ish white instead of bg-white/90 + backdrop-blur: a sticky,
          // full-width backdrop-filter repaints every scroll frame on Android.
          // /95 is visually indistinguishable from the frosted version.
          ? "border-b border-navy-100 bg-white/95 shadow-sm"
          : "border-b border-transparent bg-white/0"
      )}
    >
      <div className="container-page flex h-16 items-center justify-between">
        {/* Logo — 2172×724 source (3:1); explicit width/height so there's no
            layout shift, height utilities keep it tidy inside the h-16 bar. */}
        <a href="#top" className="group flex items-center" aria-label="Wicket Travel home">
          <Image
            src="/logo-trans.png"
            alt="Wicket Travel"
            width={144}
            height={48}
            priority
            className="h-10 w-auto transition-transform duration-200 group-hover:-translate-y-0.5 sm:h-11"
          />
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <a
              key={link.key}
              href={link.href}
              {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors duration-200 hover:bg-navy-50 hover:text-navy-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500 focus-visible:ring-offset-2"
            >
              {t(link.key)}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* Trust signal only at the widest desktop widths. A wrapper owns the
              show/hide so it can't be defeated by the badge's own `inline-flex`
              display utility (same specificity → later rule wins). */}
          <div className="hidden xl:block">
            <TrustpilotBadge />
          </div>
          <a
            href={PORTAL_LOGIN_URL}
            className="hidden rounded-full bg-accent-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-accent-600 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 sm:inline-flex"
          >
            {t("cta.getQuote")}
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

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop — tap to dismiss */}
            <motion.div
              key="drawer-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onClick={() => setOpen(false)}
              aria-hidden="true"
              className="fixed inset-0 z-40 bg-navy-950/40 backdrop-blur-sm lg:hidden"
            />

            {/* Slide-in panel */}
            <motion.div
              key="drawer-panel"
              id="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              initial={reduce ? { opacity: 0 } : { x: "100%" }}
              animate={reduce ? { opacity: 1 } : { x: 0 }}
              exit={reduce ? { opacity: 0 } : { x: "100%" }}
              transition={
                reduce
                  ? { duration: 0.15 }
                  : { type: "spring", stiffness: 320, damping: 34 }
              }
              className="fixed inset-y-0 right-0 z-50 flex w-[min(20rem,82vw)] flex-col overflow-y-auto overscroll-contain bg-white shadow-2xl shadow-navy-950/20 lg:hidden"
            >
              {/* Drawer header */}
              <div className="flex h-16 shrink-0 items-center justify-between border-b border-navy-100 px-5">
                <Image
                  src="/logo-trans.png"
                  alt="Wicket Travel"
                  width={120}
                  height={40}
                  className="h-9 w-auto"
                />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-navy-900 transition-colors hover:bg-navy-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500"
                  aria-label="Close menu"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <nav className="flex flex-1 flex-col gap-1 p-4" aria-label="Mobile">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.key}
                    href={link.href}
                    {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    onClick={() => setOpen(false)}
                    className="flex min-h-[44px] items-center rounded-lg px-3 text-base font-medium text-slate-700 transition-colors hover:bg-navy-50 hover:text-navy-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500"
                  >
                    {t(link.key)}
                  </a>
                ))}
              </nav>

              {/* Footer block — trust signal + primary CTA, pinned to bottom */}
              <div className="mt-auto shrink-0 space-y-4 border-t border-navy-100 p-5">
                <TrustpilotBadge compact className="!px-0" />
                <a
                  href={PORTAL_LOGIN_URL}
                  onClick={() => setOpen(false)}
                  className="flex min-h-[48px] items-center justify-center rounded-full bg-accent-500 px-5 text-base font-semibold text-white shadow-sm transition-colors hover:bg-accent-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2"
                >
                  {t("cta.getQuote")}
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
