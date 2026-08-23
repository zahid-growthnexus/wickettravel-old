import { cn } from "@/lib/cn";
import BrandMark from "@/components/BrandMark";

/**
 * The full lockup: the mark IS the W, so the wordmark that follows it reads
 * "icket Travel". Per the guidelines' "04 — THE JOIN": mark height is exactly
 * the cap height of the wordmark, the two share one colour, and the gap is a
 * hair under a stem's sidebearing — nothing more.
 *
 * The wordmark is set in the site's own Manrope rather than the guidelines'
 * Poppins: that document specifies the *portal's* typeface, and pulling a
 * second geometric sans onto the marketing site to render six words would cost
 * a font load and put two near-identical grotesques side by side.
 *
 * `aria-label` on the surrounding link carries the real name; every visual part
 * here is decorative so screen readers never hear "icket Travel".
 */
export default function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center", className)} aria-hidden="true">
      <BrandMark className="h-[0.7em] w-auto" />
      <span className="pl-[0.018em] font-sans text-[1em] font-extrabold leading-none tracking-[-0.022em]">
        icket Travel
      </span>
    </span>
  );
}
