import { Star } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Trustpilot-style trust signal (text + green stars treatment).
 * Avoids using Trustpilot's trademarked logo file; the green star is the
 * recognizable convention. `compact` drops the review count for tight spaces.
 */
export default function TrustpilotBadge({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <a
      href="#newsletter"
      className={cn(
        "group inline-flex items-center gap-2 rounded-lg px-1.5 py-1 transition-colors hover:bg-navy-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500",
        className
      )}
      aria-label="Rated Excellent 4.8 out of 5 on Trustpilot"
    >
      <span className="text-xs font-bold text-navy-900">
        Excellent <span className="tabular-nums">4.8</span>
      </span>
      <span className="flex gap-0.5" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className="grid h-4 w-4 place-items-center rounded-[3px] bg-[#00b67a]"
          >
            <Star className="h-3 w-3 fill-white text-white" />
          </span>
        ))}
      </span>
      <span className="text-xs font-bold text-navy-900">Trustpilot</span>
      {!compact && (
        <span className="hidden text-xs font-medium text-slate-500 xl:inline">
          12,480 reviews
        </span>
      )}
    </a>
  );
}
