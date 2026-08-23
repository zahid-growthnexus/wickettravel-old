"use client";

import Image from"next/image";
import { motion, useReducedMotion } from"framer-motion";
import { ArrowRight, Car, Hotel, Luggage, Plane } from"lucide-react";
import { Reveal, Stagger, StaggerItem } from"@/components/motion-primitives";
import { useI18n } from"@/lib/i18n";
import { HOLIDAYS_URL } from"@/lib/links";

type Category = {
  icon: typeof Plane;
  titleKey: string;
  title: string;
  copy: string;
  cta: string;
  href: string;
  external?: boolean;
  img: string;
};

const CATEGORIES: Category[] = [
  {
    icon: Plane,
    titleKey:"nav.flights",
    title:"Flights",
    copy:"Book trusted-airline tickets at the best available fares — direct, with no hidden fees.",
    cta:"Search flights",
    href:"#top",
    img:"https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=900&q=80",
  },
  {
    icon: Hotel,
    titleKey:"nav.hotels",
    title:"Hotels",
    copy:"From boutique stays to 5-star resorts — explore stays on our holidays site.",
    cta:"Find hotels",
    href: HOLIDAYS_URL,
    external: true,
    img:"https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80",
  },
  {
    icon: Car,
    titleKey:"nav.cars",
    title:"Car Rentals",
    copy:"Pick up at 30,000+ locations with free cancellation — book on our holidays site.",
    cta:"Rent a car",
    href: HOLIDAYS_URL,
    external: true,
    img:"https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=900&q=80",
  },
  {
    icon: Luggage,
    titleKey:"cat.packages",
    title:"Packages",
    copy:"Pair your trusted-airline flight with a stay and a car for a seamless trip.",
    cta:"Build a package",
    href: HOLIDAYS_URL,
    external: true,
    img:"https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=900&q=80",
  },
];

function CategoryCard({ c }: { c: Category }) {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const Icon = c.icon;
  return (
    <motion.a
      href={c.href}
      {...(c.external ? { target:"_blank", rel:"noopener noreferrer" } : {})}
      whileHover={reduce ? undefined : { y: -6 }}
      transition={{ type:"spring", stiffness: 300, damping: 22 }}
      className="group relative flex aspect-[3/4] flex-col justify-end overflow-hidden rounded-lg shadow-e1 ring-1 ring-primary-900/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
    >
      <Image
        src={c.img}
        alt={`${c.title} — explore travel options`}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-primary-900/90 via-primary-900/35 to-primary-900/5" />

      <div className="relative p-6">
        <span className="inline-grid h-11 w-11 place-items-center rounded-md bg-neutral-000/15 text-text-on-dark backdrop-blur-sm transition-colors duration-300 group-hover:bg-accent-500">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <h3 className="t-h3 mt-4 t-body-lg text-text-on-dark">{t(c.titleKey)}</h3>
        <p className="t-body-sm mt-2 text-primary-100">{c.copy}</p>
        <span className="mt-4 inline-flex items-center gap-2 t-label-2 text-accent-200 transition-colors group-hover:text-accent-200">
          {c.cta}
          <ArrowRight
            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
            aria-hidden="true"
          />
        </span>
      </div>
    </motion.a>
  );
}

export default function TravelByCategory() {
  const { t } = useI18n();
  return (
    <section className="section bg-sand-500">
      <div className="container-page">
        <Reveal className="section-lead text-center">
          <span className="t-overline text-accent-600">{t("cat.eyebrow")}</span>
          <h2 className="t-h2 mt-3 text-primary-800">{t("cat.title")}</h2>
          <p className="t-body mt-4 text-text-on-sand">{t("cat.lead")}</p>
        </Reveal>

        <Stagger
          amount={0.15}
          className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {CATEGORIES.map((c) => (
            <StaggerItem key={c.title}>
              <CategoryCard c={c} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
