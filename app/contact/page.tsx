import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import ContactForm from "@/components/ContactForm";
import { FacebookIcon, InstagramIcon, XIcon } from "@/components/SocialIcons";
import { Reveal, Stagger, StaggerItem } from "@/components/motion-primitives";
import { BUSINESS, SITE_URL } from "@/lib/seo";
import { WHATSAPP_URL } from "@/lib/links";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Wicket Travel — call or WhatsApp +44 7417 564704, email info@wickettravel.com, or send us a message. We're here to help with your flight booking.",
  alternates: { canonical: "/contact" },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/contact`,
    title: "Contact Wicket Travel",
    description:
      "Call, WhatsApp, email or send us a message — Wicket Travel is here to help with your flight booking.",
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Contact", item: `${SITE_URL}/contact` },
  ],
};

const FULL_ADDRESS = `${BUSINESS.streetAddress}, ${BUSINESS.addressLocality}, ${BUSINESS.addressRegion}, ${BUSINESS.postalCode}, UK`;

const SOCIALS = [
  { icon: XIcon, label: "X (Twitter)", href: BUSINESS.sameAs[0] },
  { icon: InstagramIcon, label: "Instagram", href: BUSINESS.sameAs[1] },
  { icon: FacebookIcon, label: "Facebook", href: BUSINESS.sameAs[2] },
];

export default function ContactPage() {
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
          eyebrow="Get in touch"
          title="We're here to help, day or night."
          lead="Questions about a fare, an existing booking, or just want to talk to a real person before you pay? Reach us however suits you best."
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
        />

        <section className="section bg-white">
          <div className="container-page grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Contact details */}
            <div>
              <Reveal>
                <span className="t-eyebrow text-accent-600">Ways to reach us</span>
                <h2 className="t-h2 mt-3 text-navy-900">Talk to a real person</h2>
              </Reveal>

              <Stagger className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <StaggerItem>
                  <a
                    href={`tel:${BUSINESS.phone}`}
                    className="card card-hover group flex h-full items-start gap-4 p-6"
                  >
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-navy-50 text-navy-700 transition-colors duration-300 group-hover:bg-accent-500 group-hover:text-white">
                      <Phone className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block text-sm font-bold text-navy-900">Call us</span>
                      <span className="mt-1 block text-sm text-slate-600">{BUSINESS.phoneDisplay}</span>
                      <span className="mt-1 block text-xs font-semibold text-emerald-700">Available 24/7</span>
                    </span>
                  </a>
                </StaggerItem>

                <StaggerItem>
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card card-hover group flex h-full items-start gap-4 p-6"
                  >
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-navy-50 text-navy-700 transition-colors duration-300 group-hover:bg-accent-500 group-hover:text-white">
                      <MessageCircle className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block text-sm font-bold text-navy-900">WhatsApp us</span>
                      <span className="mt-1 block text-sm text-slate-600">{BUSINESS.phoneDisplay}</span>
                      <span className="mt-1 block text-xs font-semibold text-emerald-700">Fastest response</span>
                    </span>
                  </a>
                </StaggerItem>

                <StaggerItem>
                  <a
                    href={`mailto:${BUSINESS.email}`}
                    className="card card-hover group flex h-full items-start gap-4 p-6"
                  >
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-navy-50 text-navy-700 transition-colors duration-300 group-hover:bg-accent-500 group-hover:text-white">
                      <Mail className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block text-sm font-bold text-navy-900">Email us</span>
                      <span className="mt-1 block break-all text-sm text-slate-600">{BUSINESS.email}</span>
                      <span className="mt-1 block text-xs font-semibold text-slate-500">Reply within 1 business day</span>
                    </span>
                  </a>
                </StaggerItem>

                <StaggerItem>
                  <div className="card flex h-full items-start gap-4 p-6">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-navy-50 text-navy-700">
                      <MapPin className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block text-sm font-bold text-navy-900">Our office</span>
                      <span className="mt-1 block text-sm text-slate-600">{FULL_ADDRESS}</span>
                    </span>
                  </div>
                </StaggerItem>
              </Stagger>

              <Reveal delay={0.1} className="mt-4">
                <div className="card flex items-start gap-4 p-6">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-navy-50 text-navy-700">
                    <Clock className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-sm font-bold text-navy-900">Support hours</span>
                    <span className="mt-1 block text-sm text-slate-600">
                      Phone &amp; WhatsApp: available 24/7. Email and enquiry
                      forms: answered within 1 business day.
                    </span>
                  </span>
                </div>
              </Reveal>

              {/* Map */}
              <Reveal delay={0.15} className="mt-8">
                <div className="overflow-hidden rounded-2xl border border-slate-200/80 shadow-sm">
                  <iframe
                    title="Map showing the Wicket Travel Limited office area in Hounslow, London"
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(
                      FULL_ADDRESS
                    )}&z=15&output=embed`}
                    className="h-72 w-full sm:h-80"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(FULL_ADDRESS)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-sm font-semibold text-navy-800 underline decoration-accent-400 decoration-2 underline-offset-2 hover:text-accent-600"
                >
                  Open in Google Maps
                </a>
              </Reveal>

              {/* Socials */}
              <Reveal delay={0.2} className="mt-8">
                <p className="text-sm font-bold text-navy-900">Follow us</p>
                <div className="mt-3 flex items-center gap-3">
                  {SOCIALS.map(({ icon: Icon, label, href }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="grid h-10 w-10 place-items-center rounded-full bg-navy-50 text-navy-700 transition-colors hover:bg-accent-500 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500 focus-visible:ring-offset-2"
                    >
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </a>
                  ))}
                </div>
              </Reveal>
            </div>

            {/* Form */}
            <Reveal delay={0.1}>
              <div className="card p-6 sm:p-8">
                <h2 className="t-h3 text-xl text-navy-900">Send us a message</h2>
                <p className="t-small mt-2 text-slate-600">
                  Fill in the form and it&apos;ll open in your email app,
                  ready to send straight to our team.
                </p>
                <div className="mt-6">
                  <ContactForm />
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
