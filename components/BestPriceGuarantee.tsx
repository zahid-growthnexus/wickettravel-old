"use client";

import {
  BadgeCheck,
  Headset,
  Lock,
  ShieldCheck,
  Tags,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";

const FEATURES = [
  {
    icon: Tags,
    title: "Transparent pricing",
    copy: "The fare you see is the fare you pay. No surprise booking fees at checkout — ever.",
  },
  {
    icon: Lock,
    title: "Bank-level security",
    copy: "Every search is encrypted with 256-bit SSL. We never sell or store your card details.",
  },
  {
    icon: BadgeCheck,
    title: "Verified airlines only",
    copy: "We connect you to vetted, fully-licensed airlines — never an unknown reseller.",
  },
  {
    icon: Headset,
    title: "24/7 human support",
    copy: "Real people, around the clock, in 12 languages — whenever your plans need a hand.",
  },
];

export default function BestPriceGuarantee() {
  const { t } = useI18n();
  return (
    <section className="section bg-sand-500">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-lg bg-primary-800 p-8 sm:p-12 lg:p-16">
          <div className="relative grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
            {/* Left — promise */}
            <div>
              <h2 className="t-h2 text-text-on-dark">{t("guar.title")}</h2>
              <p className="t-body-lg mt-4 max-w-md text-primary-100">
                We&apos;re on your side, not the seller&apos;s. From the first
                search to the final redirect, every step is built to protect your
                money and your data.
              </p>

              <div className="mt-8 inline-flex items-center gap-4 rounded-lg bg-neutral-000/10 p-6 ring-1 ring-neutral-000/15 backdrop-blur-sm">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-md bg-accent-500 text-text-on-dark">
                  <ShieldCheck className="h-7 w-7" aria-hidden="true" />
                </span>
                <div>
                  <div className="t-h4 text-text-on-dark">{t("guar.badge")}</div>
                  <p className="t-body-sm text-primary-100">
                    Find it cheaper elsewhere? We&apos;ll help you match it.
                  </p>
                </div>
              </div>
            </div>

            {/* Right — feature grid. No hover tint on the tiles: they are not
                links or controls, and a surface that lights up under the pointer
                promises a click target that isn't there. */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {FEATURES.map(({ icon: Icon, title, copy }) => (
                <div
                  key={title}
                  className="rounded-lg bg-neutral-000/5 p-6 ring-1 ring-neutral-000/10"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-md bg-primary-050/10 text-accent-200">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="t-h3 mt-4 text-text-on-dark">{title}</h3>
                  <p className="t-body-sm mt-2 text-primary-200">{copy}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
