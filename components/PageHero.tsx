import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

type Crumb = { label: string; href?: string };

/**
 * Shared banner for every interior content page (About, Contact, Privacy,
 * Terms, Refunds) — the same flat navy treatment as the homepage's dark
 * sections, so these pages read as native extensions of the site rather
 * than bolted-on static pages.
 *
 * Two deliberate choices here, both matching the homepage:
 *
 * 1. Entrance is the CSS `hero-rise` animation, not a JS scroll-reveal. This
 *    used to wrap its content in `<Reveal>`, whose hidden→visible state is
 *    gated on an IntersectionObserver firing; when it doesn't, the banner is
 *    a blank navy box with no title. That is the wrong failure mode for the
 *    first thing on the page — and a scroll reveal is meaningless here anyway,
 *    since this content is above the fold on load. `hero-rise` animates *from*
 *    a hidden state via `backwards` fill, so the resting state is visible and
 *    no-JS / headless / hidden-tab all render the finished banner.
 *
 * 2. Flat `primary-800`, not a gradient. The old
 *    `from-primary-800 via-primary-900 to-primary-900` was a sheen across a
 *    flat navy band with nothing behind it to shade — decoration, which
 *    PRODUCT.md's anti-references rule out. Photo scrims elsewhere on the site
 *    stay, because those gradients do a job: making text legible over an image.
 */
export default function PageHero({
  title,
  lead,
  breadcrumbs,
}: {
  title: ReactNode;
  lead?: ReactNode;
  breadcrumbs: Crumb[];
}) {
  return (
    <section className="bg-primary-800 py-12 sm:py-16">
      <div className="container-page">
        <nav aria-label="Breadcrumb" className="hero-rise">
          <ol className="flex flex-wrap items-center gap-2 t-label-3 text-primary-200">
            {breadcrumbs.map((c, i) => (
              <li key={c.label} className="flex items-center gap-2">
                {i > 0 && (
                  <ChevronRight
                    className="h-3.5 w-3.5 text-primary-300"
                    aria-hidden="true"
                  />
                )}
                {c.href ? (
                  <Link
                    href={c.href}
                    className="rounded-xs transition-colors hover:text-text-on-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
                  >
                    {c.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="text-text-on-dark">
                    {c.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <h1 className="hero-rise hero-rise-2 t-h1 mt-6 max-w-3xl text-balance text-text-on-dark">
          {title}
        </h1>
        {lead && (
          <p className="hero-rise hero-rise-3 t-body-lg mt-4 max-w-2xl text-pretty text-primary-100">
            {lead}
          </p>
        )}
      </div>
    </section>
  );
}
