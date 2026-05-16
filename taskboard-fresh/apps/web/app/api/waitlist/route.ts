// Waitlist signup — App Router route handler.
//
// Served by Next itself (the next.config `afterFiles` rewrite only proxies
// /api/* paths that have NO filesystem route, so this is never sent to the
// Express API). Ships independently of the offline-blocked backend.
//
// Storage: Resend "audience" (doubles as the launch mailing list).
//   - RESEND_API_KEY + RESEND_AUDIENCE_ID set  → real Resend Contacts call
//   - either missing                           → stub: log + return success
//     (so the whole flow is testable offline / in dev with no creds)

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Body = { email?: unknown };

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const email =
    typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

  if (!email || !EMAIL_RE.test(email) || email.length > 254) {
    return Response.json(
      { error: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;

  // Stub mode — no creds. Log and accept so the UX is verifiable offline.
  if (!apiKey || !audienceId) {
    console.log(`📝 [waitlist:stub] ${email} (set RESEND_API_KEY + RESEND_AUDIENCE_ID to persist)`);
    return Response.json({ ok: true, stub: true });
  }

  try {
    const res = await fetch(
      `https://api.resend.com/audiences/${audienceId}/contacts`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, unsubscribed: false }),
      },
    );

    if (res.ok) {
      return Response.json({ ok: true });
    }

    const detail = (await res.json().catch(() => ({}))) as {
      message?: string;
      name?: string;
    };

    // Already-on-the-list is a friendly success, not an error.
    if (
      res.status === 409 ||
      /already exist/i.test(detail.message ?? "") ||
      detail.name === "conflict"
    ) {
      return Response.json({ ok: true, alreadyJoined: true });
    }

    console.error("[waitlist] Resend error", res.status, detail);
    return Response.json(
      { error: "Could not join the waitlist. Please try again." },
      { status: 502 },
    );
  } catch (err) {
    console.error("[waitlist] network error", err);
    return Response.json(
      { error: "Could not join the waitlist. Please try again." },
      { status: 502 },
    );
  }
}
