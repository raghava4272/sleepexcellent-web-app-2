import { Webhook } from "https://esm.sh/standardwebhooks@1.0.0";

type SendSmsHookPayload = {
  user?: { phone?: string };
  sms?: { otp?: string };
};

function requiredEnv(name: string) {
  const value = Deno.env.get(name)?.trim();
  if (!value) throw new Error(`${name} is not configured`);
  return value;
}

function verifyHook(payload: string, headers: Headers): SendSmsHookPayload {
  const secrets = requiredEnv("SEND_SMS_HOOK_SECRET").split("|");
  let lastError: unknown;

  for (const configuredSecret of secrets) {
    try {
      const secret = configuredSecret.trim().replace(/^v1,whsec_/, "");
      return new Webhook(secret).verify(payload, Object.fromEntries(headers)) as SendSmsHookPayload;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError instanceof Error ? lastError : new Error("Invalid hook signature");
}

function indianMobile(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (/^[6-9]\d{9}$/.test(digits)) return `91${digits}`;
  if (/^91[6-9]\d{9}$/.test(digits)) return digits;
  throw new Error("Only valid Indian mobile numbers are supported");
}

Deno.serve(async (request) => {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "content-type": "application/json", allow: "POST" },
    });
  }

  try {
    const rawPayload = await request.text();
    const event = verifyHook(rawPayload, request.headers);
    const otp = event.sms?.otp?.trim();
    const phone = event.user?.phone?.trim();
    if (!otp || !/^\d{4,9}$/.test(otp) || !phone) throw new Error("The Supabase SMS hook payload is incomplete");

    const authKey = requiredEnv("MSG91_AUTH_KEY");
    const templateId = requiredEnv("MSG91_TEMPLATE_ID");
    const otpVariable = Deno.env.get("MSG91_OTP_VARIABLE")?.trim() || "OTP";
    if (!/^[A-Za-z][A-Za-z0-9_]*$/.test(otpVariable)) throw new Error("MSG91_OTP_VARIABLE is invalid");

    const response = await fetch("https://control.msg91.com/api/v5/flow", {
      method: "POST",
      headers: {
        accept: "application/json",
        authkey: authKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        template_id: templateId,
        realTimeResponse: "1",
        recipients: [{ mobiles: indianMobile(phone), [otpVariable]: otp }],
      }),
    });

    const responseText = await response.text();
    let result: { type?: string; message?: unknown } = {};
    try {
      result = JSON.parse(responseText) as typeof result;
    } catch {
      // A non-JSON provider response is handled as a failure below.
    }

    if (!response.ok || result.type === "error") {
      console.error("MSG91 rejected an OTP request", { status: response.status, providerMessage: result.message ?? "Invalid response" });
      return new Response(JSON.stringify({ error: "OTP delivery failed" }), {
        status: 502,
        headers: { "content-type": "application/json" },
      });
    }

    return new Response("{}", { status: 200, headers: { "content-type": "application/json" } });
  } catch (error) {
    console.error("MSG91 SMS hook failed", error instanceof Error ? error.message : "Unknown error");
    return new Response(JSON.stringify({ error: "OTP delivery failed" }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
});
