"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Clock, MessageCircle, PhoneCall, ShieldCheck } from "lucide-react";
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
    <section aria-labelledby="call-us-heading" className="section bg-sand-500">
      <div className="container-page">
        <Reveal className="relative overflow-hidden rounded-lg bg-gradient-to-br from-primary-800 via-primary-800 to-primary-900 shadow-e3 shadow-primary-900/30 ring-1 ring-neutral-000/10">
          {/* Soft accent glows */}

          <div className="relative grid items-center gap-10 px-6 py-10 sm:px-10 sm:py-12 lg:grid-cols-[auto_1fr_auto] lg:gap-12">
            {/* Friendly real support agent */}
            <div className="mx-auto lg:mx-0">
              <div className="relative">
                <div className="relative h-44 w-44 overflow-hidden rounded-lg ring-4 ring-neutral-000/15 sm:h-52 sm:w-52">
                  <Image
                    src="https://images.unsplash.com/photo-1598257006458-087169a1f08d?auto=format&fit=crop&w=480&q=80"
                    alt="A friendly Wicket Travel support agent taking a customer call"
                    fill
                    sizes="(max-width: 640px) 176px, 208px"
                    className="object-cover"
                  />
                </div>
                {/* Online-now badge */}
                <span className="absolute -bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-neutral-000 px-3 py-2 t-label-3 text-primary-800 shadow-e2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-success" />
                  </span>
                  Online now
                </span>
              </div>
            </div>

            {/* Copy */}
            <div className="text-center lg:text-left">
              <h2 id="call-us-heading" className="t-h2 text-text-on-dark">
                {t("call.title")}
              </h2>
              <p className="t-body mx-auto mt-3 max-w-xl text-primary-200 lg:mx-0">
                {t("call.lead")}
              </p>
              <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 t-label-2 text-primary-100 lg:justify-start">
                <li className="inline-flex items-center gap-2">
                  <Clock className="h-4 w-4 text-accent-400" aria-hidden="true" />
                  Available 24/7 — day or night
                </li>
                <li className="inline-flex items-center gap-2">
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
                className="inline-flex items-center gap-3 rounded-full bg-accent-500 px-8 py-4 t-h4 text-text-on-dark shadow-e2 shadow-accent-500/30 transition-colors hover:bg-accent-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-800"
                aria-label={`${t("call.cta")} ${PHONE_DISPLAY}`}
              >
                <PhoneCall className="h-6 w-6" aria-hidden="true" />
                {PHONE_DISPLAY}
              </motion.a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 t-label-2 text-primary-100 transition-colors hover:text-text-on-dark focus-visible:outline-none focus-visible:text-text-on-dark"
              >
                <MessageCircle className="h-4 w-4 text-success" aria-hidden="true" />
                Or message us on WhatsApp
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
