import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Headset,
  HeartHandshake,
  Lightbulb,
  PiggyBank,
  ScrollText,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import SisterBrand from "@/components/SisterBrand";
import { Reveal, Stagger, StaggerItem } from "@/components/motion-primitives";
import { BUSINESS, SITE_URL, UK_DEPARTURES } from "@/lib/seo";
import { PORTAL_LOGIN_URL } from "@/lib/links";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Wicket Travel Limited compares and books trusted airline tickets at the best available fares from the UK. Learn who we are, what we stand for and why travelers choose us.",
  alternates: { canonical: "/about" },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/about`,
    title: "About Wicket Travel | Trusted Airline Tickets from the UK",
    description:
      "Who we are, what we do and why travelers trust Wicket Travel for the best available airline ticket fares from the UK.",
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "About", item: `${SITE_URL}/about` },
  ],
};

const VALUES = [
  {
    icon: ScrollText,
    title: "Honesty, always",
    body: "The fare we quote is the fare you pay. We explain exactly what's included and never bury surprise charges in the small print.",
  },
  {
    icon: HeartHandshake,
    title: "People, not tickets",
    body: "Behind every booking is a real traveler — a family visiting home, a student starting a new term. We treat every enquiry that way.",
  },
  {
    icon: Sparkles,
    title: "Reliability you can plan around",
    body: "Real-time fares from licensed carriers, clear confirmations and a team that answers when a schedule changes.",
  },
  {
    icon: Lightbulb,
    title: "Always improving",
    body: "We listen to every review — good or bad — and use it to make the next booking faster and fairer.",
  },
];

const WHY_CHOOSE = [
  {
    icon: PiggyBank,
    title: "Best available fares",
    body: "We compare live pricing across the world's leading airlines so you see the best fare genuinely on offer for your route.",
  },
  {
    icon: ShieldCheck,
    title: "Trusted carriers only",
    body: "Every ticket is issued on a fully-licensed, recognized airline — British Airways, Emirates, Qatar Airways and more.",
  },
  {
    icon: Users,
    title: "No hidden fees",
    body: "No surprise booking fees sprung on you at checkout. What you're quoted is what you pay.",
  },
  {
    icon: Headset,
    title: "24/7 human support",
    body: "A real person picks up — by phone, WhatsApp or email — whenever your plans need a hand, day or night.",
  },
];

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Header />
      <main className="flex-1">
        <PageHero
          eyebrow="About Wicket Travel"
          title="Trusted airline tickets, honest fares."
          lead="We compare fares across the world's leading airlines and connect you straight to the best deal from the UK — no reseller mark-ups, no hidden fees, just a straightforward way to book your next flight."
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
        />

        {/* Who we are & what we do */}
        <section className="section bg-neutral-000">
          <div className="container-page grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <span className="t-overline text-accent-600">Who we are</span>
              <h2 className="t-h2 mt-3 text-primary-800">
                A UK flight-booking service built around one job: the best fare, done right
              </h2>
              <div className="t-body mt-6 space-y-4 text-text-secondary">
                <p>
                  <strong className="font-bold text-primary-800">
                    {BUSINESS.legalName}
                  </strong>{" "}
                  (company registration {BUSINESS.registration}) is a UK-based
                  airline ticket booking service. We compare fares across
                  trusted, fully-licensed carriers and help travelers from
                  across the UK — from {UK_DEPARTURES[0]} to {UK_DEPARTURES[2]}{" "}
                  and beyond — find and book the best available price for
                  their route.
                </p>
                <p>
                  Flights are our craft and our sole focus at Wicket Travel.
                  Whether you&apos;re flying home to see family, booking a
                  once-a-year holiday or arranging last-minute business
                  travel, our team compares live pricing, checks availability
                  and takes you straight through to book — with a real person
                  on hand if you need one.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg shadow-e3 shadow-primary-800/10 ring-1 ring-neutral-300/60">
                <Image
                  src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80"
                  alt="View from an airplane window above the clouds"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
          </div>
        </section>

        {/* Mission & values */}
        <section className="section bg-sand-500">
          <div className="container-page">
            <Reveal className="section-lead text-center">
              <span className="t-overline text-accent-600">Our mission &amp; values</span>
              <h2 className="t-h2 mt-3 text-primary-800">
                What guides every fare we find
              </h2>
              <p className="t-body mt-4 text-text-on-sand">
                Our mission is simple: make booking a trusted airline ticket
                from the UK fast, fair and stress-free — every single time.
              </p>
            </Reveal>

            <Stagger className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {VALUES.map((v) => (
                <StaggerItem key={v.title} className="h-full">
                  <div className="card card-hover group h-full p-8">
                    <span className="grid h-12 w-12 place-items-center rounded-md bg-primary-050 text-primary-700 transition-colors duration-300 group-hover:bg-accent-500 group-hover:text-text-on-dark">
                      <v.icon className="h-6 w-6" aria-hidden="true" />
                    </span>
                    <h3 className="t-h3 mt-6 text-primary-800">{v.title}</h3>
                    <p className="t-body-sm mt-2 text-text-secondary">{v.body}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>

        {/* Why choose us */}
        <section className="section bg-neutral-000">
          <div className="container-page">
            <Reveal className="section-lead text-center">
              <span className="t-overline text-accent-600">Why choose us</span>
              <h2 className="t-h2 mt-3 text-primary-800">
                Four reasons travelers keep coming back
              </h2>
            </Reveal>

            <Stagger className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {WHY_CHOOSE.map((v) => (
                <StaggerItem key={v.title} className="h-full">
                  <div className="card card-hover group h-full p-8">
                    <span className="grid h-12 w-12 place-items-center rounded-md bg-primary-050 text-primary-700 transition-colors duration-300 group-hover:bg-accent-500 group-hover:text-text-on-dark">
                      <v.icon className="h-6 w-6" aria-hidden="true" />
                    </span>
                    <h3 className="t-h3 mt-6 text-primary-800">{v.title}</h3>
                    <p className="t-body-sm mt-2 text-text-secondary">{v.body}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>

        {/* Sister brand */}
        <SisterBrand />

        {/* Trust signals */}
        <section className="section bg-sand-500">
          <div className="container-page">
            <div className="mx-auto max-w-3xl text-center">
              <span className="t-overline text-accent-600">Booking with confidence</span>
              <h2 className="t-h2 mt-3 text-primary-800">
                Real reviews, real protection
              </h2>
            </div>

            <Stagger className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2">
              <StaggerItem>
                <div className="card h-full p-8 text-center">
                  <span className="mx-auto flex w-fit gap-1" aria-hidden="true">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className="grid h-7 w-7 place-items-center rounded-xs bg-[#00b67a]">
                        <Star className="h-4 w-4 fill-neutral-000 text-text-on-dark" />
                      </span>
                    ))}
                  </span>
                  <p className="mt-4 t-h3 text-primary-800">
                    {BUSINESS.ratingValue} out of 5
                  </p>
                  <p className="t-body-sm mt-1 text-text-secondary">
                    Rated &ldquo;Excellent&rdquo; from {BUSINESS.reviewCount.toLocaleString()}+ reviews on Trustpilot
                  </p>
                  <a
                    href={BUSINESS.sameAs[3]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block t-label-2 text-primary-800 underline decoration-accent-400 decoration-2 underline-offset-2 hover:text-accent-600"
                  >
                    Read our reviews on Trustpilot
                  </a>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="card h-full p-8">
                  <span className="grid h-12 w-12 place-items-center rounded-md bg-primary-050 text-primary-700">
                    <ShieldCheck className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <h3 className="t-h3 mt-6 text-primary-800">Booking protection, made clear</h3>
                  <p className="t-body-sm mt-2 text-text-secondary">
                    Many flight bookings include industry-standard financial
                    protections, such as ATOL-style cover, depending on the
                    airline and how you pay. We&apos;ll always tell you plainly
                    what protection applies to your booking before you part
                    with any money.
                  </p>
                </div>
              </StaggerItem>
            </Stagger>
          </div>
        </section>

        {/* CTA */}
        <section className="section bg-neutral-000">
          <div className="container-page">
            <Reveal className="relative overflow-hidden rounded-lg bg-gradient-to-br from-primary-800 via-primary-800 to-primary-900 px-6 py-12 text-center shadow-e3 shadow-primary-900/30 ring-1 ring-neutral-000/10 sm:px-10 sm:py-16">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-accent-500/20 blur-3xl"
              />
              <div className="relative mx-auto max-w-xl">
                <h2 className="t-h2 text-text-on-dark">Ready to find your fare?</h2>
                <p className="t-body mt-4 text-primary-100">
                  Search live prices from the UK&apos;s most trusted airlines, or
                  tell us your dates and let our team find the best deal for
                  you.
                </p>
                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Link href="/" className="btn btn-primary h-12 w-full px-8 sm:w-auto">
                    Search flights
                  </Link>
                  <a
                    href={PORTAL_LOGIN_URL}
                    className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-neutral-000/20 bg-neutral-000/5 px-8 t-label-2 text-text-on-dark transition-colors duration-200 hover:bg-neutral-000/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-000/60 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-800 sm:w-auto"
                  >
                    Get a quote
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
