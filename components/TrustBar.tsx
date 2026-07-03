"use client";

import { ShieldCheck } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion-primitives";

const STATS = [
  { value: "2M+", label: "Travelers flown" },
  { value: "60+", label: "Trusted airlines" },
  { value: "120+", label: "Countries served" },
  { value: "4.8★", label: "Average traveler rating" },
];

export default function TrustBar() {
  return (
    <section className="bg-white py-14 sm:py-16">
      <div className="container-page">
        <Reveal className="card overflow-hidden">
          <h2 className="sr-only">
            Trusted by millions of UK travelers booking cheap flights
          </h2>
          {/* Stats band */}
          <Stagger className="grid grid-cols-2 sm:grid-cols-4" amount={0.3}>
            {STATS.map((s, i) => (
              <StaggerItem
                key={s.label}
                className={[
                  "px-6 py-7 text-center sm:py-9",
                  i === 1 || i === 3 ? "border-l border-slate-200" : "",
                  i === 2 || i === 3 ? "border-t border-slate-200" : "",
                  "sm:border-t-0",
                  i !== 0 ? "sm:border-l sm:border-slate-200" : "sm:border-l-0",
                ].join(" ")}
              >
                <div className="text-3xl font-extrabold tracking-tight text-navy-800 sm:text-4xl">
                  {s.value}
                </div>
                <div className="mt-1 text-sm font-medium text-slate-600">
                  {s.label}
                </div>
              </StaggerItem>
            ))}
          </Stagger>

          {/* Promise band */}
          <div className="flex flex-col items-center gap-4 border-t border-slate-200 bg-mist/60 px-6 py-6 text-center sm:flex-row sm:justify-center sm:gap-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-navy-800 shadow-sm ring-1 ring-slate-200">
              <ShieldCheck
                className="h-4 w-4 text-accent-500"
                aria-hidden="true"
              />
              Best available fares from the world&apos;s most trusted airlines
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
