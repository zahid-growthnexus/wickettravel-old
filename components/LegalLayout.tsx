import { AlertTriangle, ChevronDown } from"lucide-react";
import type { ReactNode } from"react";

export type LegalSection = {
  id: string;
  heading: string;
  content: ReactNode;
};

/**
 * TEMPLATE DISCLAIMER (shown to every visitor, not just developers): Privacy,
 * Terms and Refunds are drafted as a well-structured starting point using the
 * business facts we were given. They are NOT legal advice and have NOT been
 * reviewed by a qualified solicitor. Wicket Travel Limited must have a
 * qualified legal professional review and approve this content — and confirm
 * placeholder figures (retention periods, fee amounts, processing times) —
 * before it is relied on in production.
 */
function LegalNotice() {
  return (
    <div
      role="note"
      className="mb-10 flex items-start gap-3 rounded-lg border border-warning bg-warning-surface p-6 sm:p-6"
    >
      <span
        className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-md bg-warning-surface text-warning"
        aria-hidden="true"
      >
        <AlertTriangle className="h-5 w-5" />
      </span>
      <div className="t-body-sm text-warning">
        <p className="font-bold">Template — pending legal review</p>
        <p className="mt-1">
          This page is a professionally structured starting point, not legal
          advice. It has not been reviewed by a qualified lawyer. Please have
          a solicitor review and approve it — and confirm every placeholder
          figure below — before relying on it.
        </p>
      </div>
    </div>
  );
}

/** Paragraph with the shared legal-copy tone. */
export function P({ children }: { children: ReactNode }) {
  return <p className="t-body-sm text-text-secondary">{children}</p>;
}

/** Bulleted list with the shared legal-copy tone. */
export function Ul({ children }: { children: ReactNode }) {
  return (
    <ul className="t-body-sm list-disc space-y-2 pl-6 text-text-secondary marker:text-accent-500">
      {children}
    </ul>
  );
}

/** Inline emphasis for a placeholder the client must confirm before launch. */
export function Placeholder({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-xs bg-warning-surface px-2 py-1 font-bold text-warning">
      {children}
    </span>
  );
}

/** Standard styled text link used inside legal copy (mailto / tel / ICO etc). */
export function LegalLink({
  href,
  children,
  external,
}: {
  href: string;
  children: ReactNode;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external ? { target:"_blank", rel:"noopener noreferrer" } : {})}
      className="font-bold text-primary-800 underline decoration-accent-400 decoration-2 underline-offset-2 hover:text-accent-600"
    >
      {children}
    </a>
  );
}

/**
 * Shared shell for the three legal pages: disclaimer banner,"last updated"
 * date, a jump-to-section table of contents (sticky sidebar on desktop,
 * native <details> dropdown on mobile — both zero-JS), and the sections
 * themselves.
 */
export default function LegalLayout({
  sections,
  lastUpdated,
}: {
  sections: LegalSection[];
  lastUpdated: string;
}) {
  return (
    <div className="section bg-neutral-000">
      <div className="container-page">
        <LegalNotice />
        <p className="mb-8 t-label-3 uppercase text-text-secondary">
          Last updated: {lastUpdated}
        </p>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[240px_1fr] lg:gap-12">
          {/* Desktop table of contents — sticky sidebar */}
          <nav aria-label="On this page" className="hidden lg:block">
            <div className="sticky top-24 rounded-lg border border-neutral-300/80 bg-neutral-050 p-6">
              <p className="t-overline text-primary-700">On this page</p>
              <ul className="mt-4 space-y-1 t-body-sm">
                {sections.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="block rounded-sm px-3 py-2  text-text-secondary transition-colors hover:bg-neutral-000 hover:text-primary-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                    >
                      {s.heading}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          {/* Mobile table of contents — native accordion, zero JS */}
          <details className="card group p-6 lg:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between font-bold text-primary-800 [&::-webkit-details-marker]:hidden">
              On this page
              <ChevronDown
                className="h-4 w-4 shrink-0 text-primary-500 transition-transform duration-200 group-open:rotate-180"
                aria-hidden="true"
              />
            </summary>
            <ul className="mt-4 space-y-1 t-body-sm">
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="block rounded-sm px-3 py-2  text-text-secondary transition-colors hover:bg-primary-050 hover:text-primary-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                  >
                    {s.heading}
                  </a>
                </li>
              ))}
            </ul>
          </details>

          <article className="min-w-0 space-y-12">
            {sections.map((s) => (
              <section key={s.id} id={s.id} className="scroll-mt-24">
                <h2 className="t-h3 t-body-lg text-primary-800">{s.heading}</h2>
                <div className="mt-4 space-y-4">{s.content}</div>
              </section>
            ))}
          </article>
        </div>
      </div>
    </div>
  );
}
