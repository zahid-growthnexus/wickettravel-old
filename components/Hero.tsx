"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import FlightSearch from "@/components/FlightSearch";

export default function Hero() {
  const { t } = useI18n();
  const reduce = useReducedMotion();

  return (
    <section
      id="top"
      className="relative isolate overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-24"
    >
      {/* Full-bleed flight background — fills the hero on every screen size,
          plane + sky kept in view with a lighter, readable overlay. */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="https://images.unsplash.com/photo-1556388158-158ea5ccacbd?auto=format&fit=crop&w=2400&q=80"
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Lighter scrim than before: sky/plane stays clearly visible while the
            centered text keeps strong contrast. */}
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950/65 via-navy-900/45 to-navy-950/70" />
        <div className="absolute inset-0 bg-gradient-to-tr from-navy-950/40 via-transparent to-accent-500/5" />
        {!reduce && (
          <motion.div
            aria-hidden="true"
            className="absolute right-[-8rem] top-10 h-80 w-80 rounded-full bg-accent-500/15 blur-3xl"
            animate={{ x: [0, -40, 0], y: [0, 40, 0] }}
            transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
      </div>

      <div className="container-page">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-navy-50 backdrop-blur-sm sm:text-sm">
            <span className="h-2 w-2 rounded-full bg-accent-400" />
            {t("hero.badge")}
          </span>
          <h1 className="t-display mt-6 text-white [text-shadow:0_2px_24px_rgb(11_22_56_/_0.45)]">
            {t("hero.title")}{" "}
            <span className="text-accent-400">{t("hero.accent")}</span>
          </h1>
          <p className="t-body-lg mx-auto mt-5 max-w-2xl text-navy-50 [text-shadow:0_1px_12px_rgb(11_22_56_/_0.5)]">
            {t("hero.subline")}
          </p>
        </motion.div>

        {/* Flight search widget */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <FlightSearch />
        </motion.div>
      </div>
    </section>
  );
}
