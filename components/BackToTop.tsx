"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/cn";
import { useI18n } from "@/lib/i18n";

/**
 * Floating back-to-top launcher — stacks directly above WhatsAppButton on the
 * same edge (bottom-right in LTR, bottom-left in RTL) rather than competing
 * with it for a corner. Appears only once the visitor has scrolled roughly a
 * viewport's worth, so it never sits idle over the hero.
 */
export default function BackToTop() {
  const { t, dir } = useI18n();
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const side = dir === "rtl" ? "left-4 sm:left-6" : "right-4 sm:right-6";

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={() =>
            window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" })
          }
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          whileHover={reduce ? undefined : { scale: 1.05 }}
          whileTap={reduce ? undefined : { scale: 0.95 }}
          aria-label={t("backToTop.label")}
          className={cn(
            "fixed bottom-[84px] z-float grid h-12 w-12 place-items-center rounded-full bg-primary-800 text-text-on-dark shadow-e2 transition-colors hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 sm:bottom-[92px]",
            side
          )}
        >
          <ArrowUp className="h-5 w-5" aria-hidden="true" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
