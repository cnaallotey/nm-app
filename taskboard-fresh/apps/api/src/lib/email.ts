/**
 * Email transport. STUBBED by default.
 *
 * EMAIL_MODE=stub   → log the email to the console (no network, no key needed).
 * EMAIL_MODE=resend → send via Resend (requires RESEND_API_KEY).
 *
 * Callers use `sendEmail()` and never touch the provider directly, so the
 * stub→Resend swap is a single env flip with zero call-site changes.
 */
type SendArgs = { to: string; subject: string; html: string };

const EMAIL_MODE = process.env.EMAIL_MODE ?? "stub";
const EMAIL_FROM = process.env.EMAIL_FROM ?? "noreply@taskboard.app";

let resendClient: { emails: { send: (a: Record<string, unknown>) => Promise<unknown> } } | null =
  null;

function getResend() {
  if (resendClient) return resendClient;
  // Lazy require so the dependency is only needed when actually sending.
  const { Resend } = require("resend") as typeof import("resend");
  resendClient = new Resend(process.env.RESEND_API_KEY) as unknown as typeof resendClient;
  return resendClient!;
}

export async function sendEmail({ to, subject, html }: SendArgs): Promise<void> {
  if (EMAIL_MODE === "stub") {
    console.log(
      `\n📧 [email:stub] to=${to}\n   from=${EMAIL_FROM}\n   subject=${subject}\n   html=${html.slice(
        0,
        160,
      )}${html.length > 160 ? "…" : ""}\n`,
    );
    return;
  }

  await getResend().emails.send({ from: EMAIL_FROM, to, subject, html });
}
