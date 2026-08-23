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
      className="relative isolate overflow-hidden pt-24 pb-16 sm:pt-24 sm:pb-24"
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
        <div className="absolute inset-0 bg-gradient-to-b from-primary-900/65 via-primary-800/45 to-primary-900/70" />
        <div className="absolute inset-0 bg-gradient-to-tr from-primary-900/40 via-transparent to-accent-500/5" />
      </div>

      <div className="container-page">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          {/* Short two-line heading: white line + orange accent line, so the
              search widget stays above the fold on common desktop heights. */}
          <h1 className="t-display-2 text-text-on-dark [text-shadow:0_2px_24px_rgb(4_16_46_/_0.45)]">
            {t("hero.title")}
            <span className="block text-accent-400">{t("hero.accent")}</span>
          </h1>
          <p className="t-body-lg mx-auto mt-4 max-w-2xl text-primary-050 [text-shadow:0_1px_12px_rgb(4_16_46_/_0.5)]">
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
