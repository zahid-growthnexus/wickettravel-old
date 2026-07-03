import { Plus } from "lucide-react";
import { FAQ_ITEMS } from "@/lib/faq";

/**
 * Homepage FAQ — real questions about booking cheap flights from the UK, fares,
 * trust and support. Native <details>/<summary> gives an accessible, zero-JS
 * accordion. Content mirrors the FAQPage JSON-LD in app/page.tsx so the rich
 * result always matches what visitors read. On-brand navy/white + accent.
 */
export default function Faq() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="section scroll-mt-16 bg-white"
    >
      <div className="container-page">
        <div className="section-lead text-center">
          <span className="t-eyebrow text-accent-600">Frequently asked questions</span>
          <h2 id="faq-heading" className="t-h2 mt-3 text-navy-900">
            Booking cheap flights from the UK, answered
          </h2>
          <p className="t-body mt-4 text-slate-600">
            Everything you need to know about finding the best airline ticket
            deals with Wicket Travel — trusted carriers, honest fares and 24/7
            support.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-3xl divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          {FAQ_ITEMS.map((item) => (
            <details key={item.question} className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-left font-bold text-navy-900 transition-colors hover:bg-navy-50/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500 [&::-webkit-details-marker]:hidden">
                <span className="t-body">{item.question}</span>
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-navy-50 text-navy-700 transition-all duration-200 group-open:rotate-45 group-open:bg-accent-500 group-open:text-white">
                  <Plus className="h-4 w-4" aria-hidden="true" />
                </span>
              </summary>
              <div className="px-6 pb-6 pt-0 text-slate-600">
                <p className="t-small">{item.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
