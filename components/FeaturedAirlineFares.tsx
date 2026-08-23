"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Plane } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion-primitives";
import { useI18n } from "@/lib/i18n";

/**
 * Featured airlines grid. Each card pairs an aspirational aviation photo with
 * the airline's REAL logo (avs.io by IATA code). If a logo fails to load we
 * fall back to a clean labeled chip — we never fabricate or distort a logo.
 * Routes use soft, number-free fare language (we don't handle pricing here).
 */
type Airline = {
  code: string;
  name: string;
  title: string;
  routes: string[];
  img: string;
};

const AIRLINES: Airline[] = [
  {
    code:"EK",
    name:"Emirates",
    title:"Fly with Emirates",
    routes: ["Dubai — best available fares","Bangkok — starting from low fares"],
    img:"https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=900&q=80",
  },
  {
    code:"QR",
    name:"Qatar Airways",
    title:"Discover with Qatar Airways",
    routes: ["Doha — best available fares","Maldives — starting from low fares"],
    img:"https://images.unsplash.com/photo-1556388158-158ea5ccacbd?auto=format&fit=crop&w=900&q=80",
  },
  {
    code:"BA",
    name:"British Airways",
    title:"Travel with British Airways",
    routes: ["New York — best available fares","Cape Town — starting from low fares"],
    img:"https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=900&q=80",
  },
  {
    code:"AI",
    name:"Air India",
    title:"Journey with Air India",
    routes: ["Delhi — best available fares","Mumbai — starting from low fares"],
    img:"https://images.unsplash.com/photo-1474302770737-173ee21bab63?auto=format&fit=crop&w=900&q=80",
  },
  {
    code:"VS",
    name:"Virgin Atlantic",
    title:"Soar with Virgin Atlantic",
    routes: ["Orlando — best available fares","Las Vegas — starting from low fares"],
    img:"https://images.unsplash.com/photo-1542296332-2e4473faf563?auto=format&fit=crop&w=900&q=80",
  },
  {
    code:"EY",
    name:"Etihad Airways",
    title:"Explore with Etihad",
    routes: ["Abu Dhabi — best available fares","Sydney — starting from low fares"],
    img:"https://images.unsplash.com/photo-1517479149777-5f3b1511d5ad?auto=format&fit=crop&w=900&q=80",
  },
  {
    code:"GF",
    name:"Gulf Air",
    title:"Connect with Gulf Air",
    routes: ["Bahrain — best available fares","Manila — starting from low fares"],
    img:"https://images.unsplash.com/photo-1530521954074-e64f6810b32d?auto=format&fit=crop&w=900&q=80",
  },
  {
    code:"LH",
    name:"Lufthansa",
    title:"Fly with Lufthansa",
    routes: ["Frankfurt — best available fares","Munich — starting from low fares"],
    img:"https://images.unsplash.com/photo-1577185816322-21f2a92b1342?auto=format&fit=crop&w=900&q=80",
  },
];

function AirlineLogo({ code, name }: { code: string; name: string }) {
  const [failed, setFailed] = useState(false);
  return (
    <span
      className="inline-grid h-12 min-w-[3.5rem] place-items-center rounded-md bg-neutral-000 px-3 shadow-e2 ring-1 ring-primary-900/5"
      title={name}
    >
      {failed ? (
        <span className="t-label-3  text-primary-800">{name}</span>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`https://pics.avs.io/200/80/${code}.png`}
          alt={`${name} logo`}
          width={88}
          height={32}
          loading="lazy"
          className="h-8 w-auto max-w-[5.5rem] object-contain"
          onError={() => setFailed(true)}
        />
      )}
    </span>
  );
}

function FareCard({ a }: { a: Airline }) {
  const reduce = useReducedMotion();
  const { t } = useI18n();
  return (
    <motion.a
      href="#top"
      whileHover={reduce ? undefined : { y: -6 }}
      transition={{ type:"spring", stiffness: 300, damping: 22 }}
      className="card card-hover group flex h-full flex-col overflow-hidden"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={a.img}
          alt={`Flights with ${a.name} from the UK at the best available fares`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900/55 via-primary-900/10 to-transparent" />
        <div className="absolute bottom-3 left-3">
          <AirlineLogo code={a.code} name={a.name} />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="t-h3 t-body-lg text-primary-800">{a.title}</h3>
        <ul className="mt-3 space-y-2">
          {a.routes.map((r) => (
            <li key={r} className="flex items-center gap-2 t-body-sm text-text-secondary">
              <Plane className="h-3.5 w-3.5 shrink-0 -rotate-45 text-accent-500" aria-hidden="true" />
              {r}
            </li>
          ))}
        </ul>
        <span className="mt-6 inline-flex items-center gap-2 t-label-2 text-accent-600 transition-colors group-hover:text-accent-500">
          {t("fares.cta")}
          <ArrowRight
            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
            aria-hidden="true"
          />
        </span>
      </div>
    </motion.a>
  );
}

export default function FeaturedAirlineFares() {
  const { t } = useI18n();
  return (
    <section id="deals" className="section scroll-mt-16 bg-neutral-000">
      <div className="container-page">
        <Reveal className="section-lead text-center">
          <h2 className="t-h2 text-primary-800">{t("fares.title")}</h2>
          <p className="t-body mt-4 text-text-secondary">{t("fares.lead")}</p>
        </Reveal>

        <Stagger
          amount={0.1}
          className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {AIRLINES.map((a) => (
            <StaggerItem key={a.code} className="h-full">
              <FareCard a={a} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
