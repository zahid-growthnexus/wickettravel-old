/* Server component: no hooks or client-only APIs remain after the scroll-reveal
   wrapper and the CTA's scale gesture were removed. */
import { MessageCircle, PhoneCall, Sparkles } from "lucide-react";
import { WHATSAPP_URL } from "@/lib/links";

const PHONE_DISPLAY = "+44 7417 564704";
const PHONE_TEL = "+447417564704";

/**
 * Parents Tickets — marketing banner only. The community board and enquiry
 * form are retired for now; enquiries come in by phone or WhatsApp, where a
 * real person arranges the introduction.
 */
export default function ParentsBanner() {
  return (
    <section
      id="parents-tickets"
      className="section scroll-mt-16 bg-neutral-000"
      aria-labelledby="parents-tickets-heading"
    >
      <div className="container-page">
        {/* Flat navy — same reasoning as CallUsBand's banner. */}
        <div className="relative overflow-hidden rounded-lg bg-primary-800 shadow-e3 shadow-primary-900/30 ring-1 ring-neutral-000/10">
          <div className="relative grid items-center gap-8 px-6 py-10 sm:px-10 sm:py-12 lg:grid-cols-[1fr_auto] lg:gap-12">
            <div className="text-center lg:text-left">
              <h2 id="parents-tickets-heading" className="t-h2 text-text-on-dark">
                Travelling with elderly parents, made easier
              </h2>
              <p className="t-body-lg mx-auto mt-4 max-w-xl text-primary-200 lg:mx-0">
                We connect families who need someone to accompany an elderly
                parent with trusted travellers already going the same way — and
                our team personally arranges every introduction.
              </p>
              <p className="mt-6 flex items-center justify-center gap-2 t-label-2 text-primary-200 lg:justify-start">
                <Sparkles className="h-4 w-4 shrink-0 text-accent-400" aria-hidden="true" />
                A warm, human service — no accounts, no fees to enquire.
              </p>
            </div>

            <div className="flex shrink-0 flex-col items-center gap-3">
              {/* Plain anchor — scale hover/tap dropped, see CallUsBand. */}
              <a
                href={`tel:${PHONE_TEL}`}
                className="inline-flex items-center gap-3 rounded-full bg-accent-500 px-8 py-4 t-label-1 text-text-on-dark shadow-e2 shadow-accent-500/30 transition-colors hover:bg-accent-600 active:bg-accent-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-800"
                aria-label={`Call us about Parents Tickets on ${PHONE_DISPLAY}`}
              >
                <PhoneCall className="h-5 w-5" aria-hidden="true" />
                {PHONE_DISPLAY}
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 t-label-2 text-primary-100 transition-colors hover:text-text-on-dark focus-visible:text-text-on-dark focus-visible:outline-none"
              >
                <MessageCircle className="h-4 w-4 text-success" aria-hidden="true" />
                Or message us on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
