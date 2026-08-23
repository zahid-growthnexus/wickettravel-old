import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { FacebookIcon, InstagramIcon, XIcon } from "@/components/SocialIcons";
import { HOLIDAYS_URL } from "@/lib/links";

/** Internal routes wired up for the footer's link columns — everything else
 *  in COLUMNS stays a "#" placeholder until that page exists. */
const ROUTES: Record<string, string> = {
  "About us": "/about",
  "Contact us": "/contact",
  Refunds: "/refunds",
};

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
                  const route = ROUTES[link];
                  const className =
                    "text-navy-200 transition-colors hover:text-white focus-visible:outline-none focus-visible:text-white";
                  return (
                    <li key={link}>
                      {isHolidays ? (
                        <a
                          href={HOLIDAYS_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={className}
                        >
                          {link}
                        </a>
                      ) : route ? (
                        <Link href={route} className={className}>
                          {link}
                        </Link>
                      ) : (
                        <a href="#" className={className}>
                          {link}
                        </a>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Socials */}
        <div className="mt-12 flex items-center gap-3 border-t border-white/10 pt-8">
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
              <Link href="/privacy" className="hover:text-white">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-white">
                Terms of Service
              </Link>
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
