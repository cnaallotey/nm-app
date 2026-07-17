import { NextRequest, NextResponse } from "next/server";

// FormDrop endpoint for the Vloid waitlist. Submitting server-side avoids the
// browser CORS preflight (the endpoint has no OPTIONS handler) and lets us ask
// FormDrop for a JSON response instead of its default HTML "thanks" page.
const FORMDROP_URL = "https://formdrop.clientra.tech/f/8jrutg8e";

const USE_CASES = new Set([
  "Feedback collection",
  "Renewal reminders",
  "Dispute follow-ups",
  "Other",
]);

const VOLUMES = new Set(["<100", "100-500", "500-2000", "2000+"]);

function isEmail(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) &&
    value.length <= 254
  );
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  if (!isEmail(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 422 }
    );
  }

  // Honeypot — bots fill hidden fields. Pretend success and drop silently.
  if (typeof body._gotcha === "string" && body._gotcha.trim().length > 0) {
    return NextResponse.json({ success: true });
  }

  const useCase =
    typeof body.use_case === "string" && USE_CASES.has(body.use_case)
      ? body.use_case
      : "";
  const useCaseOther =
    typeof body.use_case_other === "string"
      ? body.use_case_other.trim().slice(0, 200)
      : "";
  const monthlyCalls =
    typeof body.monthly_calls === "string" && VOLUMES.has(body.monthly_calls)
      ? body.monthly_calls
      : "";
  const variant = typeof body.variant === "string" ? body.variant : "";

  // Field names are human-readable because they land in the FormDrop inbox as-is.
  const payload: Record<string, string> = {
    email,
    "What would you use this for?":
      useCase === "Other" && useCaseOther
        ? `Other — ${useCaseOther}`
        : useCase,
    "Calls per month": monthlyCalls,
    source: "vloid.clientra.tech waitlist",
    variant,
  };

  try {
    const res = await fetch(FORMDROP_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Ask FormDrop to return JSON instead of its HTML confirmation page.
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "We couldn't save your spot just now — please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Network error — please try again in a moment." },
      { status: 502 }
    );
  }
}
