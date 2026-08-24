/**
 * The Wicket "W" — one continuous path, turned into a W, with the ember
 * terminus marking the arrival.
 *
 * Geometry is lifted exactly from the vector artwork in the brand guidelines
 * (logos.pdf, "03 — ICON ONLY"): a five-point polyline stroked with round caps
 * and joins, plus an ember disc at the top-right terminus. Coordinates are the
 * source values translated so the visual bounding box — round caps included —
 * starts at 0,0.
 *
 * Drawn uncut: the stems keep their round caps and the ember stays a whole
 * disc, matching the construction diagram in the guidelines ("One continuous
 * path, turned into a W"). The icon-only tiles in that same document shear the
 * mark against a horizontal edge, but at header size that shear reads as a
 * rendering fault rather than a deliberate cut, so the viewBox here is the full
 * visual bounding box — round caps and disc included — and nothing is clipped.
 *
 * The stroke is `currentColor`, so the lockup's rule that "mark and letters
 * share one colour" holds automatically: set the colour on the parent and both
 * follow. `ember={false}` gives the single-colour variant.
 */
export default function BrandMark({
  className,
  ember = true,
}: {
  className?: string;
  ember?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 18.3253 14.427"
      overflow="hidden"
      className={className}
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M1.2701 3.1881 L5.5084 13.1568 L9.1373 5.7076 L12.6412 13.1568 L16.5084 1.2701"
        stroke="currentColor"
        strokeWidth="2.5403"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {ember && (
        <path
          d="M13.1126 0 A1.875 1.875 0 0 0 16.6774 0 Z"
          fill="var(--color-brand-ember)"
        />
      )}
    </svg>
  );
}
