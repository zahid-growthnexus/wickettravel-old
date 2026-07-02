"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Clock, Headset, MessageCircle, PhoneCall, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/motion-primitives";
import { useI18n } from "@/lib/i18n";
import { WHATSAPP_URL } from "@/lib/links";

const PHONE_DISPLAY = "+44 7417 564704";
const PHONE_TEL = "+447417564704";

/**
 * "Talk to a real person" — standalone premium support section placed
 * mid-page. A real, friendly agent photo + prominent click-to-call number
 * make phone booking feel human and trustworthy. 24/7, on-brand navy/orange.
 */
export default function CallUsBand() {
  const { t } = useI18n();
  const reduce = useReducedMotion();

  return (
    <section aria-labelledby="call-us-heading" className="section bg-mist">
      <div className="container-page">
        <Reveal className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy-800 via-navy-900 to-navy-950 shadow-2xl shadow-navy-950/30 ring-1 ring-white/10">
          {/* Soft accent glows */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-accent-500/20 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-navy-500/20 blur-3xl"
          />

          <div className="relative grid items-center gap-10 px-6 py-10 sm:px-10 sm:py-12 lg:grid-cols-[auto_1fr_auto] lg:gap-12">
            {/* Friendly real support agent */}
            <div className="mx-auto lg:mx-0">
              <div className="relative">
                <div className="relative h-44 w-44 overflow-hidden rounded-3xl ring-4 ring-white/15 sm:h-52 sm:w-52">
                  <Image
                    src="https://images.unsplash.com/photo-1598257006458-087169a1f08d?auto=format&fit=crop&w=480&q=80"
                    alt="A friendly Wicket Travel support agent taking a customer call"
                    fill
                    sizes="(max-width: 640px) 176px, 208px"
                    className="object-cover"
                  />
                </div>
                {/* Online-now badge */}
                <span className="absolute -bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full bg-white px-3 py-1.5 text-xs font-bold text-navy-900 shadow-lg">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  </span>
                  Online now
                </span>
              </div>
            </div>

            {/* Copy */}
            <div className="text-center lg:text-left">
              <span className="t-eyebrow inline-flex items-center gap-2 text-accent-400">
                <Headset className="h-4 w-4" aria-hidden="true" />
                {t("call.eyebrow")}
              </span>
              <h2 id="call-us-heading" className="t-h2 mt-3 text-white">
                {t("call.title")}
              </h2>
              <p className="t-body mx-auto mt-3 max-w-xl text-navy-200 lg:mx-0">
                {t("call.lead")}
              </p>
              <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-semibold text-navy-100 lg:justify-start">
                <li className="inline-flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-accent-400" aria-hidden="true" />
                  Available 24/7 — day or night
                </li>
                <li className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-accent-400" aria-hidden="true" />
                  Trusted airlines · no hidden fees
                </li>
              </ul>
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
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-navy-100 transition-colors hover:text-white focus-visible:outline-none focus-visible:text-white"
              >
                <MessageCircle className="h-4 w-4 text-emerald-400" aria-hidden="true" />
                Or message us on WhatsApp
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
