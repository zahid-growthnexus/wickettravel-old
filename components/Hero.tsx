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
    /* -mt-20 pulls the section up under the transparent header (now padding-
       sized, not a fixed h-16), so the photograph runs to the very top of the
       page instead of starting below a white bar. The image layer below then
       overscans a further -top-12 past the section's own edge as a buffer —
       header height only has to be roughly matched, not pixel-perfect, so a
       few extra px of nav content never reopens that gap. The header
       re-solidifies on scroll. */
    <section
      id="top"
      className="relative isolate -mt-20 overflow-hidden pb-10 pt-24 lg:pb-12"
    >
      {/* A wing over a mountain range from the cabin window — the view a
          traveller actually buys. The wing sweeps from centre to lower right,
          so the subject sits on the half of the canvas this layout leaves open,
          and the sky is bright enough to carry a firm scrim on the copy side
          without going muddy. */}
      <div className="absolute inset-x-0 -top-12 bottom-0 -z-10">
        <Image
          src="https://images.unsplash.com/photo-1686525500473-346b74e11316?auto=format&fit=crop&w=2400&q=80"
          alt="An aircraft wing over a green mountain range, seen from the cabin window"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[55%_50%]"
        />
        {/* Scrim in three passes: darken from the left so the left-aligned copy
            clears 4.5:1 while the runway lights stay legible on the right;
            deepen the top so the overlaid nav reads; deepen the base so the
            search panel sits on ground rather than floating. */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/95 from-22% via-primary-900/70 via-60% to-primary-900/30" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary-900/60 via-transparent via-35% to-primary-900/35" />
      </div>

      <div className="container-page">
        <div className="max-w-xl">
          <h1 className="hero-rise t-display-3 text-balance text-text-on-dark">
            {t("hero.title")}
            <span className="block">{t("hero.accent")}</span>
          </h1>
          <p className="hero-rise hero-rise-2 t-body mt-3 max-w-lg text-pretty text-primary-100">
            {t("hero.subline")}
          </p>

          <ul className="hero-rise hero-rise-3 mt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
            {PROOF.map(({ icon: Icon, text }) => (
              <li
                key={text}
                className="flex items-center gap-2 t-body-sm text-text-on-dark"
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
        <div className="hero-rise hero-rise-4 mt-6">
          <FlightSearch />
        </div>
      </div>
    </section>
  );
}
