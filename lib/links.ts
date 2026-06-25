/**
 * Wicket Travel is a flights-focused experience. Hotels (and any non-flight
 * holiday product) are handled on the sister site, so every hotel touchpoint
 * routes here and opens in a new tab.
 */
export const HOLIDAYS_URL = "https://www.wickettravelholidays.com/";

/** Standard props for any anchor that should open the holidays site safely. */
export const externalLinkProps = {
  href: HOLIDAYS_URL,
  target: "_blank",
  rel: "noopener noreferrer",
} as const;
