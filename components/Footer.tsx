import type { SVGProps } from "react";
import Image from "next/image";
import { Award, Globe2, Lock, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import PaymentTrustBadges from "@/components/PaymentTrustBadges";
import { HOLIDAYS_URL } from "@/lib/links";

/* Official brand marks (Simple Icons) — lucide-react no longer ships brand logos. */
function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
    </svg>
  );
}
function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0Zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227a3.81 3.81 0 0 1-.899 1.382 3.744 3.744 0 0 1-1.38.896c-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421a3.716 3.716 0 0 1-1.379-.899 3.644 3.644 0 0 1-.9-1.38c-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03Zm0 3.678a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm7.846-10.405a1.441 1.441 0 0 1-2.88 0 1.44 1.44 0 0 1 2.88 0Z" />
    </svg>
  );
}
function XIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
  );
}
const COLUMNS = [
  {
    title: "Explore",
    links: ["Flights", "Hotels", "Car Rental", "Deals", "Travel guides"],
  },
  {
    title: "Company",
    links: ["About us", "How it works", "Partners", "Careers", "Press"],
  },
  {
    title: "Support",
    links: ["Help center", "Contact us", "Manage booking", "Refunds", "FAQs"],
  },
];

const SOCIALS = [
  { icon: XIcon, label: "X (Twitter)", href: "https://x.com/WicketTravel" },
  {
    icon: InstagramIcon,
    label: "Instagram",
    href: "https://www.instagram.com/wickettravel/",
  },
  {
    icon: FacebookIcon,
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61581927811628&sk=followers",
  },
];

/* Trust / certification badges. These are clean labeled placeholder slots —
   drop official IATA / ATOL / ISO seal artwork into /public and swap the icon
   for an <img> when you have licensed assets. We never fabricate an official
   seal. */
const CERTS = [
  { icon: Globe2, label: "IATA", sub: "Accredited agent" },
  { icon: ShieldCheck, label: "ATOL", sub: "Protected bookings" },
  { icon: Award, label: "ISO 27001", sub: "Secure data" },
  { icon: Lock, label: "PCI DSS", sub: "Secure payments" },
];

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-navy-100">
      <div className="container-page py-16">
        <div className="grid grid-cols-2 gap-10 lg:grid-cols-5">
          {/* Brand + contact */}
          <div className="col-span-2">
            {/* White-recolored logo variant: the navy artwork would vanish on
                the navy-950 footer, so mark + "Wicket" are flipped to white
                while the orange "Travel" is kept as-is. */}
            <Image
              src="/logo-white.png"
              alt="Wicket Travel"
              width={144}
              height={48}
              className="h-11 w-auto"
            />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-navy-200">
              We book trusted airline tickets at the best available fares —
              connecting you to the world&apos;s leading carriers, with no hidden
              booking fees.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-accent-400" aria-hidden="true" />
                <a href="mailto:info@wickettravel.com" className="hover:text-white">
                  info@wickettravel.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-accent-400" aria-hidden="true" />
                <a href="tel:+447417564704" className="hover:text-white">
                  +44 7417 564704
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="h-4 w-4 shrink-0 text-accent-400" aria-hidden="true" />
                <span>Lampton Avenue, Hounslow, London, TW3 4EW, UK.</span>
              </li>
            </ul>
          </div>

          {/* Link columns */}
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-bold uppercase tracking-wide text-white">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-3 text-sm">
                {col.links.map((link) => {
                  // Hotels & car rentals live on the holidays site — open externally.
                  const isHolidays = link === "Hotels" || link === "Car Rental";
                  return (
                    <li key={link}>
                      <a
                        href={isHolidays ? HOLIDAYS_URL : "#"}
                        {...(isHolidays
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                        className="text-navy-200 transition-colors hover:text-white focus-visible:outline-none focus-visible:text-white"
                      >
                        {link}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Certifications / trust badges */}
        <div className="mt-12 border-t border-white/10 pt-8">
          <h3 className="text-center text-xs font-bold uppercase tracking-[0.18em] text-navy-300">
            Booking you can trust
          </h3>
          <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {CERTS.map(({ icon: Icon, label, sub }) => (
              <li
                key={label}
                className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3 ring-1 ring-white/10"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white/10 text-accent-400">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-bold text-white">{label}</span>
                  <span className="block truncate text-xs text-navy-300">{sub}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Payment + trust badges */}
        <div className="mt-8 border-t border-white/10 pt-8">
          <PaymentTrustBadges />
        </div>

        {/* Socials */}
        <div className="mt-8 flex items-center gap-3">
          {SOCIALS.map(({ icon: Icon, label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="grid h-10 w-10 place-items-center rounded-full bg-white/5 text-navy-100 transition-colors hover:bg-accent-500 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
            </a>
          ))}
        </div>

        {/* Legal links — centered on mobile, right-aligned on desktop (as before) */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 border-t border-white/10 pt-8 text-xs text-navy-300 sm:justify-end">
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <li>
              <a href="#" className="hover:text-white">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Terms of Service
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Cookie Settings
              </a>
            </li>
          </ul>
        </div>

        {/* Copyright — centered, directly above the company registration line */}
        <p className="mt-6 text-center text-xs text-navy-300">
          © {new Date().getFullYear()} Wicket Travel Ltd. All rights reserved.
        </p>

        {/* Company registration — centered, soft white */}
        <p className="mt-2 text-center text-sm text-white">
          Wicket Travel Limited Reg: 17001759, UK
        </p>
      </div>
    </footer>
  );
}
