"use client";

import { Send } from "lucide-react";
import { Reveal } from "@/components/motion-primitives";
import { useI18n } from "@/lib/i18n";

export default function Newsletter() {
  const { t } = useI18n();

  return (
    <section id="newsletter" className="section scroll-mt-16 bg-sand-500">
      <div className="container-page">
        <Reveal>
          <div className="relative overflow-hidden rounded-lg bg-primary-800 px-6 py-12 shadow-e3 sm:px-12 sm:py-16">
            {/* Decorative accents */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-br from-primary-800 via-primary-800 to-primary-900"
            />

            <div className="relative mx-auto max-w-2xl text-center">
              <h2 className="t-h2 text-text-on-dark">{t("news.title")}</h2>
              <p className="t-body-lg mx-auto mt-4 max-w-xl text-primary-100">{t("news.lead")}</p>

              <form
                className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
                onSubmit={(e) => e.preventDefault()}
              >
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  placeholder={t("news.placeholder")}
                  className="h-12 w-full rounded-full border border-neutral-000/20 bg-neutral-000 px-6 t-label-2 text-primary-800 placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-400"
                />
                <button
                  type="submit"
                  className="btn btn-primary h-12 shrink-0 px-6 focus-visible:ring-offset-primary-800"
                >
                  <Send className="h-4 w-4" aria-hidden="true" />
                  {t("news.button")}
                </button>
              </form>
              <p className="mt-4 t-caption text-primary-100">
                By subscribing you agree to our Privacy Policy. Unsubscribe
                anytime.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
