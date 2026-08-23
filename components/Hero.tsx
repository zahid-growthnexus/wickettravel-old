"use client";

import Image from "next/image";
import { Headset, ShieldCheck, Star } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { BUSINESS } from "@/lib/seo";
import FlightSearch from "@/components/FlightSearch";

/* Proof points, not decoration: each one is a claim already made elsewhere on
   the site (the rating feeds the JSON-LD, the fee promise and 24/7 line are the
   agency's standing commitments). Rendered as a plain inline row rather than
   chips or stat tiles — the hero's weight belongs to the search widget. */
const PROOF = [
  {
    icon: Star,
    text: `${BUSINESS.ratingValue}/5 from ${BUSINESS.reviewCount.toLocaleString("en-GB")} reviews`,
  },
  { icon: ShieldCheck, text: "No hidden booking fees" },
  { icon: Headset, text: "Real UK agents, 24/7" },
];

export default function Hero() {
  const { t } = useI18n();

  return (
    /* -mt-16 pulls the section up under the transparent header (h-16), so the
       photograph runs to the very top of the page instead of starting below a
       white bar. The header re-solidifies on scroll. */
    <section
      id="top"
      className="relative isolate -mt-16 overflow-hidden pb-12 pt-24 lg:pb-16 lg:pt-32"
    >
      {/* An airliner on final approach, silhouetted against a low sun with the
          cabin windows lit. Chosen over the usual wing-above-the-clouds frame
          for three reasons: the subject sits high and right, which is the part
          of the canvas this layout leaves open; the sky carries the accent in
          camera, so the palette is photographed rather than filtered on; and it
          is an arrival, which is the picture this audience is flying for. */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="https://images.unsplash.com/photo-1581012771300-224937651c42?auto=format&fit=crop&w=2400&q=80"
          alt="An airliner on final approach at sunset, cabin windows lit against a gold sky"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[58%_42%]"
        />
        {/* Scrim in three passes: darken from the left so the left-aligned copy
            clears 4.5:1 while the runway lights stay legible on the right;
            deepen the top so the overlaid nav reads; deepen the base so the
            search panel sits on ground rather than floating. */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/94 from-18% via-primary-900/60 via-58% to-primary-900/15" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary-900/50 via-transparent via-30% to-primary-900/55" />
      </div>

      <div className="container-page">
        <div className="max-w-2xl">
          <h1 className="hero-rise t-display-2 text-balance text-text-on-dark">
            {t("hero.title")}
            <span className="block">{t("hero.accent")}</span>
          </h1>
          <p className="hero-rise hero-rise-2 t-body-lg mt-4 max-w-xl text-pretty text-primary-100">
            {t("hero.subline")}
          </p>

          <ul className="hero-rise hero-rise-3 mt-4 flex lg:mt-6 flex-wrap items-center gap-x-6 gap-y-3">
            {PROOF.map(({ icon: Icon, text }) => (
              <li
                key={text}
                className="flex items-center gap-2 t-label-2 text-text-on-dark"
              >
                <Icon
                  className="h-4 w-4 shrink-0 text-accent-400"
                  aria-hidden="true"
                />
                {text}
              </li>
            ))}
          </ul>
        </div>

        {/* The search widget is the hero's call to action — a marketplace's
            primary control, not an afterthought below the copy. */}
        <div className="hero-rise hero-rise-4 mt-8">
          <FlightSearch />
        </div>
      </div>
    </section>
  );
}
