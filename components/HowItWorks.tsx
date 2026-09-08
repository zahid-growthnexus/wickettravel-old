"use client";

import { Search, Plane, PlaneTakeoff } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const STEPS = [
  {
    icon: Search,
    step: "01",
    title: "Search",
    body: "Tell us where and when. We instantly pull the best available fares across the world's leading airlines.",
  },
  {
    icon: Plane,
    step: "02",
    title: "Choose your airline",
    body: "Pick the trusted carrier and fare that suit you — clear options, no hidden fees clouding the real cost.",
  },
  {
    icon: PlaneTakeoff,
    step: "03",
    title: "Book & fly",
    body: "Confirm your trusted airline ticket at the best available fare and you're all set. Done.",
  },
];

export default function HowItWorks() {
  const { t } = useI18n();
  return (
    <section id="how-it-works" className="section scroll-mt-16 bg-primary-800">
      <div className="container-page">
        <div className="section-lead text-center">
          <h2 className="t-h2 text-text-on-dark">{t("how.title")}</h2>
          <p className="t-body mt-4 text-primary-100">
            No accounts, no clutter, no pressure. Just trusted airline tickets at
            the best available fares.
          </p>
        </div>

        <div className="relative mt-12 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
          {/* Connecting line on desktop. This gradient stays: it is a mask, not
              decoration — the rule has to dissolve at both ends so it reads as
              linking the three step markers rather than as a stray hairline
              colliding with the container edges. A flat rule cannot do that. */}
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-transparent via-neutral-000/15 to-transparent md:block"
          />
          {STEPS.map(({ icon: Icon, step, title, body }) => (
            <div key={step} className="relative text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-lg bg-accent-500 text-text-on-dark shadow-e2 shadow-accent-500/30 ring-8 ring-primary-800">
                <Icon className="h-7 w-7" aria-hidden="true" />
              </div>
              <div className="mt-6 t-label-2 text-accent-400">
                STEP {step}
              </div>
              <h3 className="t-h3 mt-2 t-body-lg text-text-on-dark">{title}</h3>
              <p className="t-body-sm mx-auto mt-2 max-w-xs text-primary-100">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
