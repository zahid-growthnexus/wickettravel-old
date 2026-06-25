"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion-primitives";
import { useI18n } from "@/lib/i18n";

type Destination = {
  city: string;
  country: string;
  tag: string;
  img: string;
};

const DESTINATIONS: Destination[] = [
  {
    city: "Paris",
    country: "France",
    tag: "Return flights",
    img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=80",
  },
  {
    city: "Tokyo",
    country: "Japan",
    tag: "Return flights",
    img: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=900&q=80",
  },
  {
    city: "Santorini",
    country: "Greece",
    tag: "Return flights",
    img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=900&q=80",
  },
  {
    city: "New York",
    country: "United States",
    tag: "Return flights",
    img: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=900&q=80",
  },
  {
    city: "Dubai",
    country: "UAE",
    tag: "Return flights",
    img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=80",
  },
  {
    city: "Bali",
    country: "Indonesia",
    tag: "Return flights",
    img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=80",
  },
];

function Card({ d }: { d: Destination }) {
  const reduce = useReducedMotion();
  return (
    <motion.a
      href="#top"
      whileHover={reduce ? undefined : { y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="group relative block aspect-[4/5] overflow-hidden rounded-2xl shadow-sm ring-1 ring-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500 focus-visible:ring-offset-2"
    >
      <Image
        src={d.img}
        alt={`${d.city}, ${d.country}`}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/15 to-transparent" />

      <span className="absolute right-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-navy-800 shadow-sm">
        Best fares
      </span>

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5">
        <div>
          <h3 className="t-h3 text-xl text-white">{d.city}</h3>
          <p className="t-small text-navy-100">{d.country}</p>
          <p className="mt-1 text-xs font-semibold text-accent-300">{d.tag}</p>
        </div>
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-colors group-hover:bg-accent-500">
          <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>
    </motion.a>
  );
}

export default function PopularDestinations() {
  const { t } = useI18n();
  return (
    <section id="destinations" className="section scroll-mt-16 bg-white">
      <div className="container-page">
        <Reveal className="section-lead text-center">
          <span className="t-eyebrow text-accent-600">{t("dest.eyebrow")}</span>
          <h2 className="t-h2 mt-3 text-navy-900">{t("dest.title")}</h2>
          <p className="t-body mt-4 text-slate-600">
            Trending routes flown with the world&apos;s leading airlines. Tap a
            destination to search the best available fares.
          </p>
        </Reveal>

        <Stagger
          amount={0.15}
          className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {DESTINATIONS.map((d) => (
            <StaggerItem key={d.city}>
              <Card d={d} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
