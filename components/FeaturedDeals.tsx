"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Car, Hotel, Plane, Star } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion-primitives";
import { cn } from "@/lib/cn";
import { useI18n } from "@/lib/i18n";

type DealType = "Flight" | "Hotel" | "Car";

type Deal = {
  type: DealType;
  title: string;
  subtitle: string;
  detail: string;
  price: string;
  unit: string;
  old?: string;
  badge?: string;
  rating?: string;
  img: string;
};

const TYPE_META: Record<DealType, { icon: typeof Plane; color: string }> = {
  Flight: { icon: Plane, color: "bg-navy-600" },
  Hotel: { icon: Hotel, color: "bg-accent-500" },
  Car: { icon: Car, color: "bg-emerald-600" },
};

const DEALS: Deal[] = [
  {
    type: "Flight",
    title: "London → Lisbon",
    subtitle: "Direct · 2h 45m",
    detail: "Round-trip, departing Oct 14",
    price: "$89",
    unit: "round-trip",
    old: "$146",
    badge: "Save 39%",
    img: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=900&q=80",
  },
  {
    type: "Hotel",
    title: "Azure Bay Resort",
    subtitle: "Amalfi Coast, Italy",
    detail: "5-star · breakfast included",
    price: "$132",
    unit: "per night",
    old: "$210",
    badge: "Top rated",
    rating: "4.9",
    img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80",
  },
  {
    type: "Car",
    title: "Compact SUV",
    subtitle: "Lisbon Airport (LIS)",
    detail: "Unlimited mileage · free cancellation",
    price: "$28",
    unit: "per day",
    old: "$45",
    badge: "Save 37%",
    img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80",
  },
  {
    type: "Flight",
    title: "New York → Cancún",
    subtitle: "1 stop · 6h 10m",
    detail: "Round-trip, departing Nov 02",
    price: "$214",
    unit: "round-trip",
    old: "$329",
    badge: "Save 35%",
    img: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=900&q=80",
  },
  {
    type: "Hotel",
    title: "Kyoto Garden Ryokan",
    subtitle: "Kyoto, Japan",
    detail: "Traditional suite · onsen access",
    price: "$98",
    unit: "per night",
    old: "$155",
    badge: "Top rated",
    rating: "4.8",
    img: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=900&q=80",
  },
  {
    type: "Car",
    title: "Convertible",
    subtitle: "Los Angeles (LAX)",
    detail: "Unlimited mileage · GPS included",
    price: "$54",
    unit: "per day",
    old: "$79",
    badge: "Popular",
    img: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=80",
  },
];

function DealCard({ deal }: { deal: Deal }) {
  const reduce = useReducedMotion();
  const { icon: Icon, color } = TYPE_META[deal.type];

  return (
    <motion.article
      whileHover={reduce ? undefined : { y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="card card-hover group flex h-full flex-col overflow-hidden"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={deal.img}
          alt={deal.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <span
          className={cn(
            "absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold text-white shadow-sm",
            color
          )}
        >
          <Icon className="h-3.5 w-3.5" aria-hidden="true" />
          {deal.type}
        </span>
        {deal.badge && (
          <span className="absolute right-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-accent-600 shadow-sm">
            {deal.badge}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="t-h3 text-navy-900">{deal.title}</h3>
          {deal.rating && (
            <span className="inline-flex items-center gap-1 rounded-md bg-navy-50 px-2 py-0.5 text-xs font-bold text-navy-800">
              <Star
                className="h-3.5 w-3.5 fill-accent-400 text-accent-400"
                aria-hidden="true"
              />
              {deal.rating}
            </span>
          )}
        </div>
        <p className="mt-1 text-sm font-medium text-slate-600">
          {deal.subtitle}
        </p>
        <p className="mt-1 text-xs text-slate-500">{deal.detail}</p>

        <div className="mt-4 flex items-end justify-between border-t border-slate-100 pt-4">
          <div>
            {deal.old && (
              <span className="text-xs font-medium text-slate-400 line-through">
                {deal.old}
              </span>
            )}
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-navy-900">
                {deal.price}
              </span>
              <span className="text-xs font-medium text-slate-500">
                {deal.unit}
              </span>
            </div>
          </div>
          <button
            type="button"
            className="rounded-full bg-navy-800 px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-accent-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500 focus-visible:ring-offset-2"
          >
            View deal
          </button>
        </div>
      </div>
    </motion.article>
  );
}

export default function FeaturedDeals() {
  const { t } = useI18n();
  return (
    <section id="deals" className="section scroll-mt-16 bg-white">
      <div className="container-page">
        <Reveal className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <span className="t-eyebrow text-accent-600">{t("deals.eyebrow")}</span>
            <h2 className="t-h2 mt-3 text-navy-900">{t("deals.title")}</h2>
            <p className="t-body mt-4 text-slate-600">
              A live mix of the best flight, hotel and car-rental prices our
              partners are offering right now.
            </p>
          </div>
          <a href="#deals" className="btn-outline shrink-0 px-5 py-2.5">
            {t("deals.viewAll")}
          </a>
        </Reveal>

        <Stagger
          amount={0.1}
          className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {DEALS.map((deal) => (
            <StaggerItem key={`${deal.type}-${deal.title}`} className="h-full">
              <DealCard deal={deal} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
