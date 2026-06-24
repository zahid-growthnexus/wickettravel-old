"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  BadgeCheck,
  Headset,
  Lock,
  ShieldCheck,
  Tags,
} from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion-primitives";
import { useI18n } from "@/lib/i18n";

const FEATURES = [
  {
    icon: Tags,
    title: "Transparent pricing",
    copy: "The price you compare is the price you pay. No surprise fees at checkout — ever.",
  },
  {
    icon: Lock,
    title: "Bank-level security",
    copy: "Every search is encrypted with 256-bit SSL. We never sell or store your card details.",
  },
  {
    icon: BadgeCheck,
    title: "Verified partners only",
    copy: "We redirect you to vetted airlines, hotels and rental firms — never an unknown reseller.",
  },
  {
    icon: Headset,
    title: "24/7 human support",
    copy: "Real people, around the clock, in 12 languages — whenever your plans need a hand.",
  },
];

export default function BestPriceGuarantee() {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  return (
    <section className="section bg-mist">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-3xl bg-navy-900 p-6 sm:p-12 lg:p-16">
          {/* Decorative glow */}
          <motion.div
            aria-hidden="true"
            className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-accent-500/20 blur-3xl"
            animate={reduce ? undefined : { scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={
              reduce
                ? undefined
                : { duration: 9, repeat: Infinity, ease: "easeInOut" }
            }
          />

          <div className="relative grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
            {/* Left — promise */}
            <Reveal>
              <span className="t-eyebrow text-accent-400">{t("guar.eyebrow")}</span>
              <h2 className="t-h2 mt-3 text-white">{t("guar.title")}</h2>
              <p className="t-body-lg mt-4 max-w-md text-navy-100">
                We&apos;re on your side, not the seller&apos;s. From the first
                search to the final redirect, every step is built to protect your
                money and your data.
              </p>

              <div className="mt-8 inline-flex items-center gap-4 rounded-2xl bg-white/10 p-5 ring-1 ring-white/15 backdrop-blur-sm">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-accent-500 text-white">
                  <ShieldCheck className="h-7 w-7" aria-hidden="true" />
                </span>
                <div>
                  <div className="text-lg font-extrabold text-white">{t("guar.badge")}</div>
                  <p className="t-small text-navy-100">
                    Find it cheaper elsewhere? We&apos;ll help you match it.
                  </p>
                </div>
              </div>
            </Reveal>

            {/* Right — feature grid */}
            <Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {FEATURES.map(({ icon: Icon, title, copy }) => (
                <StaggerItem
                  key={title}
                  className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10 transition-colors duration-300 hover:bg-white/10"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-navy-50/10 text-accent-300">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="t-h3 mt-4 text-white">{title}</h3>
                  <p className="t-small mt-1.5 text-navy-200">{copy}</p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </div>
    </section>
  );
}
