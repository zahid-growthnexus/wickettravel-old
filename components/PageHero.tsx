import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Reveal } from "@/components/motion-primitives";
import type { ReactNode } from "react";

type Crumb = { label: string; href?: string };

/**
 * Shared banner for every interior content page (About, Contact, Privacy,
 * Terms, Refunds) — same navy gradient + accent glow treatment as the
 * homepage's dark sections (CallUsBand / DubaiVisa), so these pages read as
 * native extensions of the site rather than bolted-on static pages.
 */
export default function PageHero({
  eyebrow,
  title,
  lead,
  breadcrumbs,
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  breadcrumbs: Crumb[];
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-800 via-primary-900 to-primary-900 py-14 sm:py-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-accent-500/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-28 -left-16 h-64 w-64 rounded-full bg-primary-500/20 blur-3xl"
      />

      <div className="container-page relative">
        <Reveal>
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1.5 t-label-3 text-primary-300">
              {breadcrumbs.map((c, i) => (
                <li key={c.label} className="flex items-center gap-1.5">
                  {i > 0 && (
                    <ChevronRight
                      className="h-3.5 w-3.5 text-primary-500"
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

          <span className="t-overline mt-6 inline-flex items-center gap-2 text-accent-400">
            <span
              className="h-1.5 w-1.5 rounded-full bg-accent-400"
              aria-hidden="true"
            />
            {eyebrow}
          </span>
          <h1 className="t-h2 mt-3 max-w-3xl text-text-on-dark">{title}</h1>
          {lead && (
            <p className="t-body-lg mt-4 max-w-2xl text-primary-100">{lead}</p>
          )}
        </Reveal>
      </div>
    </section>
  );
}
