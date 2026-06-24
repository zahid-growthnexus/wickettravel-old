"use client";

import { Search, GitCompareArrows, PlaneTakeoff } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion-primitives";
import { useI18n } from "@/lib/i18n";

const STEPS = [
  {
    icon: Search,
    step: "01",
    title: "Search",
    body: "Tell us where and when. We instantly query hundreds of airlines, hotels and rental partners at once.",
  },
  {
    icon: GitCompareArrows,
    step: "02",
    title: "Compare",
    body: "See every option side by side — sorted by price, with no hidden fees clouding the real cost.",
  },
  {
    icon: PlaneTakeoff,
    step: "03",
    title: "Get the best deal",
    body: "Pick the winner and we send you straight to the provider to book at their lowest rate. Done.",
  },
];

export default function HowItWorks() {
  const { t } = useI18n();
  return (
    <section id="how-it-works" className="section scroll-mt-16 bg-navy-900">
      <div className="container-page">
        <Reveal className="section-lead text-center">
          <span className="t-eyebrow text-accent-400">{t("how.eyebrow")}</span>
          <h2 className="t-h2 mt-3 text-white">{t("how.title")}</h2>
          <p className="t-body mt-4 text-navy-100">
            No accounts, no clutter, no pressure. Just the cheapest way to your
            next trip.
          </p>
        </Reveal>

        <Stagger className="relative mt-14 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
          {/* Connecting line on desktop */}
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-transparent via-white/15 to-transparent md:block"
          />
          {STEPS.map(({ icon: Icon, step, title, body }) => (
            <StaggerItem key={step} className="relative text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-accent-500 text-white shadow-lg shadow-accent-500/30 ring-8 ring-navy-900">
                <Icon className="h-7 w-7" aria-hidden="true" />
              </div>
              <div className="mt-5 text-sm font-bold tracking-widest text-accent-400">
                STEP {step}
              </div>
              <h3 className="t-h3 mt-2 text-xl text-white">{title}</h3>
              <p className="t-small mx-auto mt-2 max-w-xs text-navy-100">{body}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
