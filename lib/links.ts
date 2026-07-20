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

/** Sign in / sign up and quote requests go to the booking portal on its
 *  branded custom domain (opens in the same tab). */
export const PORTAL_LOGIN_URL = "https://www.portal.wickettravel.com/login";

/** Flight searches hand off to the portal's booking wizard (same tab); the
 *  widget appends the traveler's entries as query params to pre-fill it. */
export const PORTAL_BOOKING_URL =
  "https://www.portal.wickettravel.com/customer/book";

/** WhatsApp deep link — +44 7417 564704 (opens in a new tab). */
export const WHATSAPP_URL = "https://wa.me/447417564704";
