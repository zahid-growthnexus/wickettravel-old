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
 * The load-bearing detail is the flat top. In the source, the stroke and the
 * disc are clipped against the same horizontal edge, so the stems do NOT end in
 * visible round caps — they are sheared off level, and the ember reads as a
 * dome sitting flush on that cut. Reproduced by putting that edge on the
 * viewBox: an outermost <svg> clips to its viewport, so the caps overhanging the
 * top and left are trimmed exactly as the artwork trims them. The disc likewise
 * becomes the circular segment left below the cut — which also keeps this
 * component free of SVG ids, and ids are document-global while this mark renders
 * in the header, the drawer and the footer at once.
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
      viewBox="0 0 16.7701 12.5201"
      overflow="hidden"
      className={className}
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M-0.2852 1.2813 L3.9531 11.25 L7.582 3.8008 L11.0859 11.25 L14.9531 -0.6367"
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
