"use client";

import { motion, useReducedMotion } from "framer-motion";
import { BellRing, Send } from "lucide-react";
import { Reveal } from "@/components/motion-primitives";
import { useI18n } from "@/lib/i18n";

export default function Newsletter() {
  const { t } = useI18n();
  const reduce = useReducedMotion();

  return (
    <section id="newsletter" className="section scroll-mt-16 bg-sand-500">
      <div className="container-page">
        <Reveal>
          <div className="relative overflow-hidden rounded-lg bg-primary-800 px-6 py-12 shadow-xl sm:px-12 sm:py-16">
            {/* Decorative accents */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-br from-primary-800 via-primary-800 to-primary-900"
            />
            {!reduce && (
              <>
                <motion.div
                  aria-hidden="true"
                  className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-accent-500/30 blur-3xl"
                  animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                  aria-hidden="true"
                  className="absolute -bottom-20 left-10 h-64 w-64 rounded-full bg-primary-500/30 blur-3xl"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
                  transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                />
              </>
            )}

            <div className="relative mx-auto max-w-2xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-accent-500 px-4 py-1.5 t-label-3 text-text-on-dark">
                <BellRing className="h-4 w-4" aria-hidden="true" />
                Deal alerts
              </span>
              <h2 className="t-h2 mt-5 text-text-on-dark">{t("news.title")}</h2>
              <p className="t-body-lg mx-auto mt-4 max-w-xl text-primary-100">{t("news.lead")}</p>

              <form
                className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
                onSubmit={(e) => e.preventDefault()}
              >
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  placeholder={t("news.placeholder")}
                  className="h-12 w-full rounded-full border border-neutral-000/20 bg-neutral-000 px-5 t-label-2 text-primary-800 placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-400"
                />
                <button
                  type="submit"
                  className="btn btn-primary h-12 shrink-0 px-6 focus-visible:ring-offset-primary-800"
                >
                  <Send className="h-4 w-4" aria-hidden="true" />
                  {t("news.button")}
                </button>
              </form>
              <p className="mt-4 t-caption text-primary-100">
                By subscribing you agree to our Privacy Policy. Unsubscribe
                anytime.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
