"use client";

import { motion, useReducedMotion } from "framer-motion";
import { HandHeart, MessageCircle, PhoneCall, Sparkles } from "lucide-react";
import { Reveal } from "@/components/motion-primitives";
import { WHATSAPP_URL } from "@/lib/links";

const PHONE_DISPLAY = "+44 7417 564704";
const PHONE_TEL = "+447417564704";

/**
 * Parents Tickets — marketing banner only. The community board and enquiry
 * form are retired for now; enquiries come in by phone or WhatsApp, where a
 * real person arranges the introduction.
 */
export default function ParentsBanner() {
  const reduce = useReducedMotion();

  return (
    <section
      id="parents-tickets"
      className="section scroll-mt-16 bg-white"
      aria-labelledby="parents-tickets-heading"
    >
      <div className="container-page">
        <Reveal className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy-800 via-navy-900 to-navy-950 shadow-2xl shadow-navy-950/30 ring-1 ring-white/10">
          {/* Soft accent glows */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-accent-500/20 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-20 -right-10 h-56 w-56 rounded-full bg-navy-500/20 blur-3xl"
          />

          <div className="relative grid items-center gap-8 px-6 py-10 sm:px-10 sm:py-12 lg:grid-cols-[1fr_auto] lg:gap-12">
            <div className="text-center lg:text-left">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2">
                <HandHeart className="h-4 w-4 text-accent-400" aria-hidden="true" />
                <span className="t-eyebrow text-white">Parents Tickets</span>
              </span>
              <h2 id="parents-tickets-heading" className="t-h2 mt-5 text-white">
                Travelling with elderly parents,
                <span className="text-accent-400"> made easier</span>
              </h2>
              <p className="t-body-lg mx-auto mt-4 max-w-xl text-navy-200 lg:mx-0">
                We connect families who need someone to accompany an elderly
                parent with trusted travellers already going the same way — and
                our team personally arranges every introduction.
              </p>
              <p className="mt-5 flex items-center justify-center gap-2 text-sm font-medium text-navy-300 lg:justify-start">
                <Sparkles className="h-4 w-4 shrink-0 text-accent-400" aria-hidden="true" />
                A warm, human service — no accounts, no fees to enquire.
              </p>
            </div>

            <div className="flex shrink-0 flex-col items-center gap-3">
              <motion.a
                href={`tel:${PHONE_TEL}`}
                whileHover={reduce ? undefined : { scale: 1.03 }}
                whileTap={reduce ? undefined : { scale: 0.98 }}
                className="inline-flex items-center gap-3 rounded-full bg-accent-500 px-7 py-4 text-base font-extrabold text-white shadow-lg shadow-accent-500/30 transition-colors hover:bg-accent-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-900"
                aria-label={`Call us about Parents Tickets on ${PHONE_DISPLAY}`}
              >
                <PhoneCall className="h-5 w-5" aria-hidden="true" />
                {PHONE_DISPLAY}
              </motion.a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-navy-100 transition-colors hover:text-white focus-visible:text-white focus-visible:outline-none"
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
