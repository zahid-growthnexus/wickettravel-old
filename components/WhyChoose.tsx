"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Gauge, Layers, PiggyBank, Scale } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion-primitives";
import { useI18n } from "@/lib/i18n";

const VALUES = [
  {
    icon: Layers,
    title: "500+ sites, one search",
    body: "We query hundreds of airlines, hotels and rental partners at once so you never have to open ten tabs again.",
  },
  {
    icon: Scale,
    title: "Unbiased results",
    body: "We rank by genuine value, not by who pays us most. The cheapest, best option always comes first.",
  },
  {
    icon: Gauge,
    title: "Real-time prices",
    body: "Fares change by the minute. Our live data means the price you see is the price that's actually available.",
  },
  {
    icon: PiggyBank,
    title: "Travelers save up to 40%",
    body: "By comparing every provider and sending you direct, we routinely cut the cost of a typical trip.",
  },
];

function ValueCard({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof Scale;
  title: string;
  body: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      whileHover={reduce ? undefined : { y: -6 }}
      whileTap={reduce ? undefined : { scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="card card-hover group h-full p-6 sm:p-7"
    >
      <span className="grid h-12 w-12 place-items-center rounded-xl bg-navy-50 text-navy-700 transition-colors duration-300 group-hover:bg-accent-500 group-hover:text-white">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </span>
      <h3 className="t-h3 mt-5 text-navy-900">{title}</h3>
      <p className="t-small mt-2 text-slate-600">{body}</p>
    </motion.div>
  );
}

export default function WhyChoose() {
  const { t } = useI18n();
  return (
    <section className="section bg-mist">
      <div className="container-page">
        <Reveal className="section-lead text-center">
          <span className="t-eyebrow text-accent-600">{t("why.eyebrow")}</span>
          <h2 className="t-h2 mt-3 text-navy-900">{t("why.title")}</h2>
          <p className="t-body mt-4 text-slate-600">
            We built a comparison engine that works for you, not the seller.
            Here&apos;s what millions of travelers count on us for.
          </p>
        </Reveal>

        <Stagger className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v) => (
            <StaggerItem key={v.title} className="h-full">
              <ValueCard {...v} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
