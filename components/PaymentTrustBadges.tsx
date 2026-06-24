"use client";

import { useState } from "react";
import { BadgeCheck, Lock, ShieldCheck } from "lucide-react";

/**
 * Payment + trust badges.
 * Payment logos load from the official Simple Icons CDN client-side. If any
 * logo fails to load (CDN/network/trademark removal), the chip falls back to a
 * clean labeled placeholder — never a fabricated or distorted logo. Drop an
 * official asset into /public and swap the <img src> when you have one.
 */
const PAYMENTS = [
  { slug: "visa", label: "Visa" },
  { slug: "mastercard", label: "Mastercard" },
  { slug: "americanexpress", label: "Amex" },
  { slug: "paypal", label: "PayPal" },
  { slug: "applepay", label: "Apple Pay" },
  { slug: "googlepay", label: "Google Pay" },
];

const TRUST = [
  { icon: Lock, label: "SSL Secured" },
  { icon: ShieldCheck, label: "Best-Price Guarantee" },
  { icon: BadgeCheck, label: "Protected Booking" },
];

function PaymentChip({ slug, label }: { slug: string; label: string }) {
  const [failed, setFailed] = useState(false);
  return (
    <span
      className="grid h-9 min-w-[3.25rem] place-items-center rounded-md bg-white px-2.5 shadow-sm"
      title={label}
    >
      {failed ? (
        <span className="text-xs font-bold text-navy-900">{label}</span>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`https://cdn.simpleicons.org/${slug}`}
          alt={label}
          width={28}
          height={18}
          loading="lazy"
          className="h-[18px] w-auto object-contain"
          onError={() => setFailed(true)}
        />
      )}
    </span>
  );
}

export default function PaymentTrustBadges() {
  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
      {/* Trust badges */}
      <ul className="flex flex-wrap items-center gap-2.5">
        {TRUST.map(({ icon: Icon, label }) => (
          <li
            key={label}
            className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 text-xs font-semibold text-navy-100 ring-1 ring-white/10"
          >
            <Icon className="h-4 w-4 text-accent-400" aria-hidden="true" />
            {label}
          </li>
        ))}
      </ul>

      {/* Payment logos */}
      <div className="flex flex-wrap items-center gap-2.5">
        <span className="text-xs font-medium text-navy-300">We accept</span>
        {PAYMENTS.map((p) => (
          <PaymentChip key={p.slug} slug={p.slug} label={p.label} />
        ))}
      </div>
    </div>
  );
}
