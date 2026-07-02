"use client";

import Image from "next/image";
import { ArrowRight, ArrowUpRight, BadgeCheck, Headphones, ShieldCheck, Sparkles } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion-primitives";
import { HOLIDAYS_URL } from "@/lib/links";

/**
 * "Meet Wicket Travel Holidays" — introduces the sister brand so every
 * hotels/cars/packages redirect on this page has context. The section bridges
 * both identities: our navy design system carries the layout, while the
 * Holidays brand supplies the accents — its logo (served locally from
 * /public/holidays) and the sunset-amber → coral + ocean-blue palette sampled
 * from that logo. Sits right before the hotels & resorts collection, which
 * shows the properties themselves; this section is about the brand.
 */

const SUNSET_GRADIENT = "linear-gradient(100deg, #febb38 0%, #f78839 55%, #f1573b 100%)";

const TRUST_CUES = [
  { icon: Sparkles, label: "Handpicked stays" },
  { icon: ShieldCheck, label: "Best-price promise" },
  { icon: Headphones, label: "24/7 support" },
] as const;

export default function SisterBrand() {
  return (
    <section
      aria-labelledby="sister-brand-heading"
      className="section relative overflow-hidden bg-navy-950"
    >
      {/* Bridge hairline: our navy flowing into the Holidays sunset + ocean hues */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-navy-500 via-[#f78839] to-[#188dd3]"
      />
      {/* Ambient brand glows — sunset behind the story, ocean behind the collage */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#f78839]/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -right-24 h-[28rem] w-[28rem] rounded-full bg-[#188dd3]/15 blur-3xl"
      />

      <div className="container-page relative">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-10">
          {/* Brand story */}
          <Stagger amount={0.2} className="lg:col-span-6">
            <StaggerItem>
              <span className="t-eyebrow inline-flex items-center gap-2 text-[#febb38]">
                <span
                  aria-hidden="true"
                  className="h-1.5 w-6 rounded-full"
                  style={{ background: SUNSET_GRADIENT }}
                />
                Part of the Wicket family
              </span>
            </StaggerItem>

            <StaggerItem>
              <h2 id="sister-brand-heading" className="t-h2 mt-4 text-white">
                Meet{" "}
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: SUNSET_GRADIENT }}
                >
                  Wicket Travel Holidays
                </span>
              </h2>
            </StaggerItem>

            <StaggerItem>
              <p className="t-body-lg mt-5 max-w-xl text-navy-100">
                Flights are our craft — everything around them belongs to our
                dedicated holidays brand. Handpicked hotels and resorts, tailored
                packages and car rentals, with the same best-price promise you
                already trust.
              </p>
            </StaggerItem>

            <StaggerItem>
              <ul className="mt-7 flex flex-wrap gap-2.5">
                {TRUST_CUES.map(({ icon: Icon, label }) => (
                  <li
                    key={label}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-navy-100"
                  >
                    <Icon className="h-4 w-4 text-[#febb38]" aria-hidden="true" />
                    {label}
                  </li>
                ))}
              </ul>
            </StaggerItem>

            <StaggerItem>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href={HOLIDAYS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 text-sm font-bold text-navy-950 shadow-lg shadow-[#f1573b]/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#f1573b]/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#febb38] focus-visible:ring-offset-2 focus-visible:ring-offset-navy-950"
                  style={{ background: SUNSET_GRADIENT }}
                >
                  Explore Wicket Travel Holidays
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
                <a
                  href="#hotels"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 py-3 text-sm font-bold text-white transition-colors duration-200 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-950"
                >
                  Browse hotels & resorts
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </StaggerItem>

            <StaggerItem>
              <p className="mt-6 inline-flex items-center gap-2 text-sm text-navy-200">
                <BadgeCheck className="h-4 w-4 shrink-0 text-[#188dd3]" aria-hidden="true" />
                Operated by the same team behind Wicket Travel.
              </p>
            </StaggerItem>
          </Stagger>

          {/* Resort collage + brand lockup */}
          <Stagger amount={0.2} className="lg:col-span-6">
            <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
              <div className="relative aspect-[7/6]">
                <StaggerItem
                  distance={28}
                  className="absolute right-0 top-0 h-[74%] w-[76%] overflow-hidden rounded-[1.75rem] shadow-2xl ring-1 ring-white/15"
                >
                  <Image
                    src="/hotels/maldives-overwater.jpg"
                    alt="Overwater villas in the Maldives from the Wicket Travel Holidays collection"
                    fill
                    sizes="(max-width: 1024px) 76vw, 38vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/30 to-transparent" />
                </StaggerItem>

                <StaggerItem
                  distance={28}
                  className="absolute bottom-[14%] left-0 h-[54%] w-[46%]"
                >
                  {/* Rotation lives on this wrapper so framer's transform animation can't reset it */}
                  <div className="relative h-full w-full -rotate-2 overflow-hidden rounded-[1.75rem] shadow-2xl ring-[6px] ring-navy-950">
                    <Image
                      src="/hotels/santorini-suites.jpg"
                      alt="Cliffside suites in Santorini from the Wicket Travel Holidays collection"
                      fill
                      sizes="(max-width: 1024px) 46vw, 23vw"
                      className="object-cover"
                    />
                  </div>
                </StaggerItem>

                {/* Brand lockup card — the logo sits on white so its palm mark stays crisp */}
                <StaggerItem
                  distance={28}
                  className="absolute bottom-0 right-0 max-w-[min(100%,20rem)]"
                >
                  <div className="flex items-center gap-3.5 rounded-2xl border border-white/15 bg-white/10 p-3.5 shadow-2xl backdrop-blur-md">
                    <span className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-white p-1.5 shadow-sm">
                      <Image
                        src="/holidays/wicket-travel-holidays-logo.png"
                        alt="Wicket Travel Holidays logo"
                        width={44}
                        height={38}
                        className="h-auto w-full object-contain"
                      />
                    </span>
                    <span>
                      <span className="block text-sm font-extrabold leading-tight text-white">
                        Wicket Travel Holidays
                      </span>
                      <span className="mt-0.5 block text-xs font-medium text-navy-100">
                        Hotels · Resorts · Packages · Car rentals
                      </span>
                    </span>
                  </div>
                </StaggerItem>
              </div>
            </div>

            <Reveal delay={0.25} className="mt-6 text-center lg:text-left">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-navy-300">
                One family · two specialists — flights here, holidays there
              </p>
            </Reveal>
          </Stagger>
        </div>
      </div>
    </section>
  );
}
