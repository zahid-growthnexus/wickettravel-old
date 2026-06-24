"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion-primitives";
import { useI18n } from "@/lib/i18n";

type Review = {
  name: string;
  location: string;
  rating: number;
  text: string;
  trip: string;
  avatar: string;
};

const REVIEWS: Review[] = [
  {
    name: "Amara Okafor",
    location: "London, UK",
    rating: 5,
    trip: "Flight to Lisbon",
    text: "Found a return flight £60 cheaper than anywhere else I checked. The comparison was instant and there were genuinely no hidden fees at checkout.",
    avatar:
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=160&q=80",
  },
  {
    name: "Daniel Reyes",
    location: "Austin, USA",
    rating: 5,
    trip: "Hotel in Tokyo",
    text: "I booked a ryokan for a week and saved enough to add two extra nights. Wicket sent me straight to the hotel's own site for the best rate.",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80",
  },
  {
    name: "Sofia Bianchi",
    location: "Milan, Italy",
    rating: 5,
    trip: "Car rental in LA",
    text: "Comparing rental cars usually drives me mad. This was effortless — clear prices, free cancellation flagged up front. I'll never book any other way.",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&q=80",
  },
];

function ReviewCard({ r }: { r: Review }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      whileHover={reduce ? undefined : { y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="card card-hover flex h-full flex-col p-7"
    >
      <Quote className="h-8 w-8 text-navy-100" aria-hidden="true" />
      <div
        className="mt-3 flex gap-0.5"
        aria-label={`${r.rating} out of 5 stars`}
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={
              i < r.rating
                ? "h-4 w-4 fill-accent-400 text-accent-400"
                : "h-4 w-4 text-slate-200"
            }
            aria-hidden="true"
          />
        ))}
      </div>
      <p className="t-small mt-4 flex-1 text-slate-700">
        &ldquo;{r.text}&rdquo;
      </p>
      <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-5">
        <Image
          src={r.avatar}
          alt={`${r.name}'s profile photo`}
          width={44}
          height={44}
          className="h-11 w-11 rounded-full object-cover"
        />
        <div>
          <div className="text-sm font-bold text-navy-900">{r.name}</div>
          <div className="text-xs text-slate-500">
            {r.location} · {r.trip}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Testimonials() {
  const { t } = useI18n();
  return (
    <section className="section bg-white">
      <div className="container-page">
        <Reveal className="section-lead text-center">
          <span className="t-eyebrow text-accent-600">{t("rev.eyebrow")}</span>
          <h2 className="t-h2 mt-3 text-navy-900">{t("rev.title")}</h2>
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="flex gap-0.5" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="h-5 w-5 fill-accent-400 text-accent-400"
                />
              ))}
            </div>
            <span className="text-sm font-semibold text-slate-600">
              4.8 / 5 average from 64,000+ reviews
            </span>
          </div>
        </Reveal>

        <Stagger className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {REVIEWS.map((r) => (
            <StaggerItem key={r.name} className="h-full">
              <ReviewCard r={r} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
