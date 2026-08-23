"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Plane, Search } from "lucide-react";
import { useI18n } from "@/lib/i18n";

/** Condensed search prompt that drops in after the hero scrolls out of view. */
export default function StickySearchBar() {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 720);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: -100 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          /* bg-neutral-000/95 is near-opaque, so the backdrop-blur was barely visible
             but forced a full-width backdrop-filter repaint on every scroll
             frame (a top cause of Android Chrome jank). Dropped — looks the
             same, composites far cheaper. */
          className="fixed inset-x-0 top-16 border-b z-sticky border-primary-100 bg-neutral-000/95 shadow-e1"
        >
          <div className="container-page flex h-14 items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-sm bg-primary-050 text-primary-700">
                <Plane className="h-4 w-4 -rotate-45" aria-hidden="true" />
              </span>
              <span className="truncate t-label-2 text-primary-800">
                {t("sticky.text")}
              </span>
            </div>
            <Link href="/" className="btn btn-primary shrink-0 px-4 py-2 sm:px-6 sm:py-3">
              <Search className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">{t("sticky.cta")}</span>
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
