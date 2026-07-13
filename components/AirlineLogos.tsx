"use client";

import { useState } from "react";
import { useReducedMotion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/motion-primitives";
import { useI18n } from "@/lib/i18n";

/**
 * Trust strip of real airline logos so travelers know these are the carriers
 * they can book here. Logos load by IATA code from the avs.io airline-logo CDN.
 * If a logo fails to load (network/CDN/trademark), the slot falls back to a
 * clean labeled placeholder — we never fabricate or distort a logo.
 * The strip auto-scrolls right-to-left in a seamless loop (two copies of the
 * track); hover pauses it, and reduced motion swaps in a static scrollable row.
 */
const AIRLINES = [
  { code: "BA", name: "British Airways" },
  { code: "VS", name: "Virgin Atlantic" },
  { code: "AI", name: "Air India" },
  { code: "6E", name: "IndiGo" },
  { code: "EK", name: "Emirates" },
  { code: "QR", name: "Qatar Airways" },
  { code: "GF", name: "Gulf Air" },
  { code: "EY", name: "Etihad Airways" },
  { code: "LH", name: "Lufthansa" },
];

function LogoSlot({ code, name }: { code: string; name: string }) {
  const [failed, setFailed] = useState(false);
  return (
    <div
      className="flex h-20 w-44 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 shadow-sm transition-shadow duration-300 hover:shadow-md sm:w-48"
      title={name}
    >
      {failed ? (
        <span className="text-center text-sm font-bold leading-tight text-navy-800">
          {name}
        </span>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`https://pics.avs.io/200/80/${code}.png`}
          alt={`${name} logo`}
          width={120}
          height={48}
          loading="lazy"
          className="h-12 w-auto max-w-full object-contain"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}

export default function AirlineLogos() {
  const { t } = useI18n();
  const reduce = useReducedMotion();

  const row = (ariaHidden: boolean) => (
    <div
      aria-hidden={ariaHidden || undefined}
      className="flex shrink-0 items-center gap-4 pr-4"
    >
      {AIRLINES.map((a) => (
        <LogoSlot key={`${ariaHidden ? "dup-" : ""}${a.code}`} {...a} />
      ))}
    </div>
  );

  return (
    <section className="overflow-hidden bg-white py-14 sm:py-16">
      <div className="container-page">
        <Reveal className="text-center">
          <span className="t-eyebrow text-accent-600">{t("trust.eyebrow")}</span>
          <h2 className="t-h2 mt-3 text-navy-900">{t("trust.line")}</h2>
        </Reveal>
      </div>

      <Reveal delay={0.05} className="mt-10">
        {reduce ? (
          <div className="flex gap-4 overflow-x-auto px-5 pb-2 sm:px-8">
            {AIRLINES.map((a) => (
              <LogoSlot key={a.code} {...a} />
            ))}
          </div>
        ) : (
          <div className="marquee overflow-hidden" aria-label="Our airline partners">
            <div className="marquee-track [--marquee-duration:40s]">
              {row(false)}
              {row(true)}
            </div>
          </div>
        )}
      </Reveal>

      <div className="container-page">
        <Reveal
          delay={0.1}
          className="mt-8 flex items-center justify-center gap-2 text-sm font-semibold text-slate-600"
        >
          <ShieldCheck className="h-4 w-4 text-accent-500" aria-hidden="true" />
          Trusted airline tickets at the best available fares
        </Reveal>
      </div>
    </section>
  );
}
