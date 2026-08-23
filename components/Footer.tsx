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
      <div className="container-page py-12 lg:py-14">
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-5">
          {/* Brand + contact + socials */}
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
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-navy-200">
              We book trusted airline tickets at the best available fares —
              connecting you to the world&apos;s leading carriers, with no hidden
              booking fees.
            </p>
            <ul className="mt-5 space-y-2.5 text-sm">
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

            {/* Socials sit with the brand block rather than on their own row —
                keeps the footer compact and fills the space beside the columns. */}
            <div className="mt-6 flex items-center gap-3">
              {SOCIALS.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="grid h-9 w-9 place-items-center rounded-full bg-white/5 text-navy-100 transition-colors hover:bg-accent-500 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
                >
                  <Icon className="h-4.5 w-4.5" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-bold uppercase tracking-wide text-white">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm">
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

        {/* One bottom bar: legal identity on the left, policy links on the right.
            Stacks and centres on mobile. */}
        <div className="mt-10 flex flex-col items-center gap-4 border-t border-white/10 pt-6 text-xs text-navy-300 sm:flex-row sm:justify-between">
          <p className="text-center sm:text-left">
            © {new Date().getFullYear()} Wicket Travel Ltd. All rights reserved.
            <span className="mx-2 hidden text-white/20 sm:inline">|</span>
            <span className="mt-1 block text-navy-200 sm:mt-0 sm:inline">
              Wicket Travel Limited Reg: 17001759, UK
            </span>
          </p>
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <li>
              <Link href="/privacy" className="transition-colors hover:text-white">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="transition-colors hover:text-white">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
