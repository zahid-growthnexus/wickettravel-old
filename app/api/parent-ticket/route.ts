/**
 * Same-origin relay for the Parents Tickets lead form. The portal's public API
 * only allows a fixed list of browser origins (CORS), so the client posts here
 * and we forward server-side — works from any domain the site is served on.
 * Mirrors app/api/visa-enquiry so both lead forms behave identically.
 * No secrets involved: the portal endpoint is public and validates server-side.
 */

const PORTAL_ENDPOINT =
  "https://wicket-travel-portal.vercel.app/api/parent-ticket";

export async function POST(request: Request) {
  let body: string;
  try {
    // The client sends a JSON string (no file uploads on this form).
    body = await request.text();
  } catch {
    return Response.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 }
    );
  }

  try {
    const upstream = await fetch(PORTAL_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      signal: AbortSignal.timeout(55_000),
    });
    const text = await upstream.text();
    return new Response(text, {
      status: upstream.status,
      headers: {
        "Content-Type":
          upstream.headers.get("content-type") ?? "application/json",
      },
    });
  } catch {
    return Response.json(
      { ok: false, error: "Could not reach the Parents Tickets service." },
      { status: 502 }
    );
  }
}
