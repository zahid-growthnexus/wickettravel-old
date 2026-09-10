import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ChevronRight,
  EyeOff,
  HandHeart,
  Handshake,
  MessageCircle,
  PhoneCall,
  Plus,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AssistFamilyCarousels from "@/components/AssistFamilyCarousels";
import ParentsEnquiryForm from "@/components/ParentsEnquiryForm";
import { Reveal, Stagger, StaggerItem } from "@/components/motion-primitives";
import {
  AREA_SERVED_UK,
  BUSINESS,
  OG_BASE,
  ORGANIZATION_ID,
  SITE_URL,
  TWITTER_BASE,
} from "@/lib/seo";
import { WHATSAPP_URL } from "@/lib/links";

/**
 * /parents-tickets — the dedicated home for Parents Tickets.
 *
 * The service was only ever retired from the *homepage* (components/
 * ParentsBanner.tsx now points at the phone instead); the portal endpoints it
 * always used were never removed, so this page revives the real thing rather
 * than rebuilding a lookalike:
 *
 *   • the form posts JSON to /api/parent-ticket   (components/ParentsEnquiryForm)
 *   • the board reads /api/parent-ticket/public   (components/ParentsBoard)
 *
 * Both are live, same-origin relays onto the Wicket Travel portal. Nothing on
 * this page is mocked — an empty feed renders the empty state, not invented
 * listings.
 *
 * The one thing this page has to get right is the privacy mechanic, so it is
 * stated in three separate places rather than once: in both "how it works"
 * columns, beside the consent checkbox itself, and in the FAQ. A visitor who
 * reads only one of the three still learns that nothing is published unless
 * they tick the box, and that a person here makes every introduction.
 *
 * The only money anywhere on this page is the amount a poster sets themselves
 * (£0–100, the API's own range) — Wicket Travel neither charges for this nor
 * takes a cut, and no company price appears.
 *
 * The hero is written out rather than reusing <PageHero> for the same reason
 * /visa does: it needs a CTA pair and a photograph. Every token is PageHero's.
 */

/* Renamed from "Parents Tickets" to "Assist Family" (the public-facing name
   only). The route stays /parents-tickets on purpose — it's already in the
   sitemap, JSON-LD @id chain and llms.txt with real indexing history, and
   changing the URL itself would need a 301 redirect to avoid throwing that
   away. Component/file names, the enquiry_type API contract and the
   /api/parent-ticket relay are untouched for the same reason: they're wired
   to the live portal backend, not display copy. */
export const metadata: Metadata = {
  title: "Assist Family",
  description:
    "Flying an elderly relative alone? We connect families with trusted travellers already going the same way. Contact details are never published — we introduce you.",
  alternates: { canonical: "/parents-tickets" },
  openGraph: {
    ...OG_BASE,
    url: `${SITE_URL}/parents-tickets`,
    title: "Assist Family | Travel Companions for Elderly Relatives",
    description:
      "Post the journey, we find someone already flying that route, and a real person makes the introduction. Free to post, no account needed, contact details never published.",
  },
  twitter: {
    ...TWITTER_BASE,
    title: "Assist Family | Travel Companions for Elderly Relatives",
    description:
      "Post the journey, we find a traveller already on that route, and a coordinator makes the introduction. Nothing is published unless you ask for it.",
  },
};

const REQUESTER_STEPS = [
  {
    title: "Tell us the journey",
    body: "The route, roughly when they fly, what they would find hard on their own, and the amount you would like to offer. It takes a couple of minutes and costs nothing.",
  },
  {
    title: "We look for someone going the same way",
    body: "A coordinator here reads your post and checks it against travellers already booked on that route — and against the community board. Nothing is matched by an algorithm.",
  },
  {
    title: "We introduce you, and you agree the rest",
    body: "Once both sides say yes, we put you in touch and stay reachable through the trip. The amount is settled directly between you and the helper.",
  },
];

const TRAVELLER_STEPS = [
  {
    title: "Tell us where you're already flying",
    body: "Your route, roughly when, how many people you could keep company and what you're happy to help with — meeting at check-in, staying together through security, handing over at arrivals.",
  },
  {
    title: "We check your post and look for a family",
    body: "A coordinator reviews every offer by hand and lines it up against families asking for that route. You're never contacted by strangers off the back of it.",
  },
  {
    title: "We make the introduction",
    body: "If a family is a good fit, we introduce you both and you take it from there. Anything you asked for is paid to you directly by the family — we don't take a cut.",
  },
];

const FAQ = [
  {
    question: "How are helpers checked before a match is made?",
    answer:
      "Every post — from both sides — is read by a Wicket Travel coordinator before anything happens with it. We speak to the traveller, confirm they are genuinely booked on the route they have posted, and talk the family through who they would be travelling with before any introduction is made. We are honest about the limits of that: this is a human review by our team, not a criminal-records or DBS check, and we do not claim to have vetted anyone beyond it. Families always make the final call themselves, and we will happily arrange a phone call between both sides before anyone commits.",
  },
  {
    question: "How does the payment work between the two of you?",
    answer:
      "Directly, and entirely between the two of you. The family names the amount they are offering when they post (or the traveller names what they are asking), and the two sides confirm it between themselves once we have introduced them. Wicket Travel does not hold the money, process it, add to it or take a cut of it — there is no fee to post on this board and no charge for the introduction. If an amount is not right for you, say so before you agree; nobody is committed to anything until both sides are happy.",
  },
  {
    question: "What happens if nobody is flying that route yet?",
    answer:
      "Your post stays with our team and we keep looking — routes fill up as people book, so a quiet week is normal rather than a dead end. If you asked for it to appear on the community board, it also stays visible there so a traveller can find it directly. If your dates get close and we still have nobody suitable, we will tell you plainly rather than leaving you waiting, and we can look at airline-operated assistance for the flight instead.",
  },
  {
    question: "Is any of my information ever made public?",
    answer:
      "Only if you tick the community-board box, and even then only a shortened version: your first name and last initial, the route, the travel date and airline, any languages, the amount, and the short description of what is needed or offered — enough for a traveller to recognise their own flight, and no more. Your phone number, email address, surname, your relative's name and anything you wrote in the notes are never published; the feed on this page is built from the same shortened data whether you are a stranger or the person who posted it. Leave the box unticked and nothing at all appears publicly. Either way nobody can contact you off a listing, and no contact details are exchanged until both sides have agreed.",
  },
  {
    question: "How do I change or remove my post?",
    answer:
      "Call or WhatsApp us on the number on this page with the reference you were given when you posted, and we will update it or take it down. There is no account to log into and no self-service dashboard — the same person who reads your post is the one who edits or removes it, usually the same day. Withdrawing a post at any point, for any reason, is completely fine and nothing is charged.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "@id": `${SITE_URL}/parents-tickets#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        {
          "@type": "ListItem",
          position: 2,
          name: "Assist Family",
          item: `${SITE_URL}/parents-tickets`,
        },
      ],
    },
    {
      /* Describes the introduction service Wicket Travel actually runs — the
         coordination and the match. Deliberately no `offers` node: the only
         money involved is the amount a family or traveller sets between
         themselves, which is not a Wicket Travel price and must not be
         published as one. */
      "@type": "Service",
      "@id": `${SITE_URL}/parents-tickets#service`,
      name: "Assist Family travel companion matching",
      serviceType: "Travel companion introduction service",
      url: `${SITE_URL}/parents-tickets`,
      description:
        "Wicket Travel connects families whose elderly relative is flying alone with travellers already booked on the same route. A coordinator reads every post by hand and makes every introduction; contact details are never published, and no personal detail appears publicly unless the poster asks for it.",
      provider: { "@id": ORGANIZATION_ID },
      areaServed: AREA_SERVED_UK,
      audience: {
        "@type": "Audience",
        audienceType:
          "Families of elderly passengers flying alone, and travellers willing to accompany them",
      },
      availableChannel: {
        "@type": "ServiceChannel",
        serviceUrl: `${SITE_URL}/parents-tickets#post-to-the-board`,
        servicePhone: {
          "@type": "ContactPoint",
          telephone: BUSINESS.phone,
          contactType: "customer service",
          areaServed: "GB",
          availableLanguage: ["English", "Hindi", "Urdu", "Arabic"],
        },
      },
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}/parents-tickets#faq`,
      mainEntity: FAQ.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
  ],
};

/** One side of "How it works" — same shell twice, only the tone badge differs. */
function SideColumn({
  badge,
  badgeClass,
  icon: Icon,
  title,
  lead,
  steps,
  privacy,
}: {
  badge: string;
  badgeClass: string;
  icon: typeof Users;
  title: string;
  lead: string;
  steps: { title: string; body: string }[];
  privacy: string;
}) {
  return (
    <div className="card flex h-full flex-col p-6 sm:p-8">
      <span className={`pill ${badgeClass}`}>
        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
        {badge}
      </span>
      <h3 className="t-h3 mt-4 text-primary-800">{title}</h3>
      <p className="t-body-sm mt-2 text-text-secondary">{lead}</p>

      <ol className="mt-6 space-y-5">
        {steps.map((step, i) => (
          <li key={step.title} className="flex gap-4">
            <span
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary-050 t-label-2 text-primary-700"
              aria-hidden="true"
            >
              {i + 1}
            </span>
            <span>
              <span className="block t-label-1 text-primary-800">
                {step.title}
              </span>
              <span className="mt-1 block t-body-sm text-text-secondary">
                {step.body}
              </span>
            </span>
          </li>
        ))}
      </ol>

      {/* The privacy mechanic, stated in full on BOTH sides — not once, shared. */}
      <p className="mt-auto flex gap-3 rounded-md bg-primary-050 px-4 py-4 t-body-sm text-primary-800 sm:mt-8">
        <EyeOff className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        <span>{privacy}</span>
      </p>
    </div>
  );
}

export default function ParentsTicketsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Header />
      <main className="flex-1">
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary-800 via-primary-900 to-primary-900 py-12 sm:py-16">
          <div className="container-page relative">
            <Reveal>
              <nav aria-label="Breadcrumb">
                <ol className="flex flex-wrap items-center gap-2 t-label-3 text-primary-200">
                  <li>
                    <Link
                      href="/"
                      className="rounded-xs transition-colors hover:text-text-on-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
                    >
                      Home
                    </Link>
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight
                      className="h-3.5 w-3.5 text-primary-500"
                      aria-hidden="true"
                    />
                    <span aria-current="page" className="text-text-on-dark">
                      Assist Family
                    </span>
                  </li>
                </ol>
              </nav>
            </Reveal>

            <div className="mt-8 grid items-center gap-10 lg:grid-cols-[1fr_auto] lg:gap-16">
              <Reveal>
                <h1 className="t-h1 max-w-2xl text-text-on-dark">
                  When you can&rsquo;t be at the airport yourself, someone kind
                  can be.
                </h1>
                <p className="t-body-lg mt-4 max-w-xl text-primary-100">
                  Assist Family connects families whose elderly relative is
                  flying alone with a trusted traveller already going the same
                  way — for an amount the family sets themselves. A real person
                  here reads every post and makes every introduction.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <a
                    href="#post-to-the-board"
                    className="inline-flex items-center justify-center gap-3 rounded-full bg-accent-500 px-8 py-4 t-label-1 text-text-on-dark shadow-e2 shadow-accent-500/30 transition-colors hover:bg-accent-600 active:bg-accent-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-900"
                  >
                    Post to the board
                    <ArrowRight className="h-5 w-5" aria-hidden="true" />
                  </a>
                  <a
                    href="#community-board"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-neutral-000/20 bg-neutral-000/5 px-8 py-4 t-label-2 text-text-on-dark transition-colors hover:bg-neutral-000/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-000/60 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-900"
                  >
                    <Search className="h-4 w-4" aria-hidden="true" />
                    See who&rsquo;s posted
                  </a>
                </div>

                <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-neutral-000/5 px-4 py-2 t-label-3 text-primary-100 ring-1 ring-neutral-000/10">
                  <ShieldCheck className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  Free to post · No account needed · Contact details never
                  published
                </p>
              </Reveal>

              <Reveal delay={0.1} className="hidden lg:block">
                <div className="relative h-80 w-[26rem] overflow-hidden rounded-lg ring-1 ring-neutral-000/15">
                  <Image
                    src="/support/airport-companion.jpg"
                    alt="Two travellers walking together through an airport terminal"
                    fill
                    sizes="416px"
                    className="object-cover"
                  />
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── How it works — two sides, one page ───────────────────────── */}
        <section
          id="how-it-works"
          aria-labelledby="parents-how-heading"
          className="section scroll-mt-16 bg-neutral-000"
        >
          <div className="container-page">
            <Reveal className="section-lead text-center">
              <h2 id="parents-how-heading" className="t-h2 text-primary-800">
                Two sides, one board
              </h2>
              <p className="t-body mt-4 text-text-secondary">
                Families post the journey they need covered. Travellers post the
                one they are already taking. Our team is what joins the two — and
                the only thing that ever exchanges a contact detail.
              </p>
            </Reveal>

            <Stagger className="mt-12 grid gap-6 lg:grid-cols-2">
              <StaggerItem className="h-full">
                <SideColumn
                  badge="I need help"
                  badgeClass="bg-accent-100 text-accent-700"
                  icon={Users}
                  title="For families"
                  lead="Your mother, father or grandparent is flying alone and you would rather they were not."
                  steps={REQUESTER_STEPS}
                  privacy="Your contact details are never shown publicly. Only if you tick the consent box does anything appear on the community board, and then only a shortened version — first name and last initial, the route, the date and airline, and your amount. Your phone number, email address, surname, your relative's name and your notes stay with our team, and nobody can message you off a listing: every introduction is made by a person at Wicket Travel."
                />
              </StaggerItem>
              <StaggerItem className="h-full">
                <SideColumn
                  badge="I want to help"
                  badgeClass="bg-primary-050 text-primary-700"
                  icon={HandHeart}
                  title="For travellers"
                  lead="You are already flying that route and are happy to keep someone company along the way."
                  steps={TRAVELLER_STEPS}
                  privacy="Your contact details are never shown publicly either. Only if you tick the consent box does your offer appear on the board, and then only in short — first name and last initial, the route, the date and airline, and the amount you are asking. Your phone number, email address, surname and notes stay with our team, and families reach you through Wicket Travel rather than directly off a listing."
                />
              </StaggerItem>
            </Stagger>
          </div>
        </section>

        {/* ── The real form ────────────────────────────────────────────── */}
        <section
          id="post-to-the-board"
          aria-labelledby="parents-form-heading"
          className="section scroll-mt-16 bg-sand-500"
        >
          <div className="container-page grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start lg:gap-12">
            <Reveal>
              <div className="card overflow-hidden">
                <div className="bg-primary-800 px-6 py-6 sm:px-8">
                  <h2 id="parents-form-heading" className="t-h3 text-text-on-dark">
                    Post to the community board
                  </h2>
                  <p className="mt-2 flex items-center gap-2 t-body-sm text-primary-100">
                    <Handshake className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    One form, either side. A coordinator reads every post by
                    hand.
                  </p>
                </div>
                <div className="px-6 py-6 sm:px-8 sm:py-8">
                  <ParentsEnquiryForm />
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.1} className="lg:sticky lg:top-24">
              <div className="card p-6 sm:p-8">
                <h3 className="t-h4 text-primary-800">
                  What is public, and what is not
                </h3>
                <dl className="mt-5 space-y-5">
                  <div>
                    <dt className="t-label-2 text-primary-800">
                      Shown on the board — only if you tick the box
                    </dt>
                    <dd className="t-body-sm mt-1 text-text-secondary">
                      Your first name and last initial, the route, the travel
                      date and airline, any languages, the amount, and the short
                      description of the help needed or offered.
                    </dd>
                  </div>
                  <div>
                    <dt className="t-label-2 text-primary-800">
                      Never shown, on either side
                    </dt>
                    <dd className="t-body-sm mt-1 text-text-secondary">
                      Your phone number, email address, surname, your
                      relative&rsquo;s name and your notes to our team.
                    </dd>
                  </div>
                  <div>
                    <dt className="t-label-2 text-primary-800">
                      How anyone reaches you
                    </dt>
                    <dd className="t-body-sm mt-1 text-text-secondary">
                      Through us, once both sides have agreed. No one can
                      message you off a listing.
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="card mt-4 p-6 sm:p-8">
                <h3 className="t-h4 text-primary-800">
                  Would rather just talk it through?
                </h3>
                <p className="t-body-sm mt-2 text-text-secondary">
                  Our team answers 24/7 and can take the whole thing over the
                  phone — no form, no account.
                </p>
                <div className="mt-5 flex flex-col gap-3">
                  <a
                    href={`tel:${BUSINESS.phone}`}
                    className="btn btn-secondary w-full"
                  >
                    <PhoneCall className="h-4 w-4" aria-hidden="true" />
                    {BUSINESS.phoneDisplay}
                  </a>
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline w-full"
                  >
                    <MessageCircle className="h-4 w-4" aria-hidden="true" />
                    Message us on WhatsApp
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── The live board, as two carousels ─────────────────────────── */}
        <section
          id="community-board"
          aria-labelledby="parents-board-heading"
          className="section scroll-mt-16 bg-neutral-000"
        >
          <div className="container-page">
            <Reveal className="section-lead text-center">
              <h2 id="parents-board-heading" className="t-h2 text-primary-800">
                Open on the board right now
              </h2>
              <p className="t-body mt-4 text-text-secondary">
                Scroll through who&rsquo;s already posted, or tap a card for the
                full detail. Recognise a route you are flying? Ask us for the
                introduction.
              </p>
            </Reveal>

            <div className="mt-12">
              <AssistFamilyCarousels />
            </div>
          </div>
        </section>

        {/* ── Trust & verification FAQ ─────────────────────────────────── */}
        <section
          id="faq"
          aria-labelledby="parents-faq-heading"
          className="section scroll-mt-16 bg-sand-500"
        >
          <div className="container-page">
            <div className="section-lead text-center">
              <h2 id="parents-faq-heading" className="t-h2 text-primary-800">
                Trust, money and privacy
              </h2>
              <p className="t-body mt-4 text-text-on-sand">
                The questions people ask before they hand a family member&rsquo;s
                journey to someone else — answered plainly, including where our
                checks stop.
              </p>
            </div>

            <div className="mx-auto mt-12 max-w-3xl divide-y divide-neutral-300 overflow-hidden rounded-lg border border-neutral-300/80 bg-neutral-000 shadow-e1">
              {FAQ.map((item) => (
                <details key={item.question} className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-6 text-left font-bold text-primary-800 transition-colors hover:bg-primary-050/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 [&::-webkit-details-marker]:hidden">
                    <span className="t-body">{item.question}</span>
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary-050 text-primary-700 transition-all duration-200 group-open:rotate-45 group-open:bg-accent-500 group-open:text-text-on-dark">
                      <Plus className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </summary>
                  <div className="px-6 pb-6 pt-0 text-text-secondary">
                    <p className="t-body-sm">{item.answer}</p>
                  </div>
                </details>
              ))}
            </div>

            <div className="mt-10 text-center">
              <a href="#post-to-the-board" className="btn btn-primary px-8 py-4">
                Post to the board
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </a>
              {/* Internal link to the flight funnel — the ticket itself still
                  has to be booked, and nothing else on this page pointed at it. */}
              <p className="t-body-sm mt-6 text-text-on-sand">
                Their ticket not booked yet?{" "}
                <Link
                  href="/flights"
                  className="t-label-2 text-primary-800 underline decoration-accent-400 decoration-2 underline-offset-2 hover:text-accent-600"
                >
                  Search flights from the UK
                </Link>{" "}
                first, then post the journey here.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
