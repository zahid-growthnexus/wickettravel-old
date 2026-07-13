/**
 * Same-origin relay for the Dubai Visa form. The portal's public API only
 * allows a fixed list of browser origins (CORS), so the client posts here and
 * we forward server-side — works from any domain the site is served on.
 * No secrets involved: the portal endpoint is public and validates server-side.
 */

const PORTAL_ENDPOINT =
  "https://wicket-travel-portal.vercel.app/api/visa-enquiry";

export async function POST(request: Request) {
  let form: FormData;
  try {
    // Expects multipart/form-data: a `payload` JSON string plus optional
    // `documents` file parts — the exact shape the portal accepts.
    form = await request.formData();
  } catch {
    return Response.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 }
    );
  }

  try {
    const upstream = await fetch(PORTAL_ENDPOINT, {
      method: "POST",
      body: form,
      signal: AbortSignal.timeout(55_000),
    });
    const body = await upstream.text();
    return new Response(body, {
      status: upstream.status,
      headers: {
        "Content-Type":
          upstream.headers.get("content-type") ?? "application/json",
      },
    });
  } catch {
    return Response.json(
      { ok: false, error: "Could not reach the visa enquiry service." },
      { status: 502 }
    );
  }
}
