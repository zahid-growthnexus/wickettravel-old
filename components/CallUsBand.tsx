"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Clock, Headset, PhoneCall, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/motion-primitives";
import { useI18n } from "@/lib/i18n";

const PHONE_DISPLAY = "+44 7417 564704";
const PHONE_TEL = "+447417564704";

/**
 * Premium "call us" band. Sits at the top of the footer to invite phone
 * bookings with a real support number. Number-free on price; trust-forward.
 */
export default function CallUsBand() {
  const { t } = useI18n();
  const reduce = useReducedMotion();

  return (
    <section aria-labelledby="call-us-heading" className="bg-navy-950">
      <div className="container-page py-14 sm:py-16">
        <Reveal className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy-800 via-navy-900 to-navy-950 px-6 py-10 shadow-2xl shadow-navy-950/40 ring-1 ring-white/10 sm:px-10 sm:py-12">
          {/* Soft accent glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-accent-500/20 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-navy-500/20 blur-3xl"
          />

          <div className="relative flex flex-col items-center gap-8 text-center lg:flex-row lg:justify-between lg:text-left">
            <div className="flex flex-col items-center gap-5 lg:flex-row lg:items-center lg:gap-6">
              {/* Friendly support agent vibe */}
              <span className="relative grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-accent-500 text-white shadow-lg shadow-accent-500/30">
                <Headset className="h-8 w-8" aria-hidden="true" />
                <span className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full border-2 border-navy-900 bg-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-white" />
                </span>
              </span>
              <div className="max-w-xl">
                <span className="t-eyebrow text-accent-400">{t("call.eyebrow")}</span>
                <h2 id="call-us-heading" className="t-h2 mt-2 text-white">
                  {t("call.title")}
                </h2>
                <p className="t-body mt-3 text-navy-200">{t("call.lead")}</p>
              </div>
            </div>

            {/* Click-to-call */}
            <div className="flex shrink-0 flex-col items-center gap-3">
              <motion.a
                href={`tel:${PHONE_TEL}`}
                whileHover={reduce ? undefined : { scale: 1.03 }}
                whileTap={reduce ? undefined : { scale: 0.98 }}
                className="inline-flex items-center gap-3 rounded-full bg-accent-500 px-7 py-4 text-lg font-extrabold text-white shadow-lg shadow-accent-500/30 transition-colors hover:bg-accent-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-900"
                aria-label={`${t("call.cta")} ${PHONE_DISPLAY}`}
              >
                <PhoneCall className="h-6 w-6" aria-hidden="true" />
                {PHONE_DISPLAY}
              </motion.a>
              <p className="flex items-center gap-4 text-xs font-semibold text-navy-200">
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-accent-400" aria-hidden="true" />
                  24/7
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-accent-400" aria-hidden="true" />
                  Trusted airlines
                </span>
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
