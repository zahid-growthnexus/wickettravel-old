import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Reveal } from "@/components/motion-primitives";
import type { ReactNode } from "react";

type Crumb = { label: string; href?: string };

/**
 * Shared banner for every interior content page (About, Contact, Privacy,
 * Terms, Refunds) — same navy gradient treatment as the homepage's dark
 * sections, so these pages read as native extensions of the site rather
 * than bolted-on static pages.
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
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-800 via-primary-900 to-primary-900 py-12 sm:py-16">

      <div className="container-page relative">
        <Reveal>
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2 t-label-3 text-primary-300">
              {breadcrumbs.map((c, i) => (
                <li key={c.label} className="flex items-center gap-2">
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

          <h1 className="t-h1 mt-6 max-w-3xl text-text-on-dark">{title}</h1>
          {lead && (
            <p className="t-body-lg mt-4 max-w-2xl text-primary-100">{lead}</p>
          )}
        </Reveal>
      </div>
    </section>
  );
}
