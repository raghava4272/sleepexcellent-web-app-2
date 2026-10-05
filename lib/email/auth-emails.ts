import "server-only";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function brandedAuthEmailIsConfigured() {
  return Boolean(process.env.RESEND_API_KEY?.trim() && process.env.ORDER_EMAIL_FROM?.trim());
}

export async function sendSignupVerificationEmail({ email, fullName, verificationUrl }: { email: string; fullName: string; verificationUrl: string }) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.ORDER_EMAIL_FROM?.trim();
  if (!apiKey || !from) throw new Error("Branded authentication email is not configured.");

  const html = `<!doctype html><html><body style="margin:0;background:#f8f4ec;color:#171717;font-family:Arial,sans-serif"><div style="max-width:640px;margin:0 auto;padding:32px 20px"><div style="background:#fff;border:1px solid #d6c8b5;padding:32px"><p style="margin:0 0 24px;color:#9d6b36;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase">SleepExcellent</p><h1 style="font-family:Georgia,serif;font-size:30px;margin:0 0 12px">Verify your email address</h1><p style="color:#555;line-height:26px">Hello ${escapeHtml(fullName)}, confirm your email address to finish creating your SleepExcellent account.</p><p style="margin:28px 0"><a href="${escapeHtml(verificationUrl)}" style="display:inline-block;background:#171717;color:#fff;padding:13px 20px;text-decoration:none;font-weight:700">Verify email address</a></p><p style="color:#666;font-size:13px;line-height:21px">If you did not request this account, you can ignore this email.</p></div><p style="color:#666;font-size:12px;line-height:20px;text-align:center">Sleep better. Live better.<br>Questions? Call +91 90442 57999 or email sleepexcellent999@gmail.com</p></div></body></html>`;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [email], subject: "Verify your SleepExcellent account", html }),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Resend rejected a signup email (${response.status}): ${await response.text()}`);
}
