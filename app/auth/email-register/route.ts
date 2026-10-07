import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { getSupabasePublicConfig } from "@/lib/supabase/config";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { brandedAuthEmailIsConfigured, sendSignupVerificationEmail } from "@/lib/email/auth-emails";

function safeNextPath(value: FormDataEntryValue | null) {
  const path = typeof value === "string" ? value : null;
  return path?.startsWith("/") && !path.startsWith("//") ? path : "/";
}

function registerRedirect(request: NextRequest, next: string, modal: boolean) {
  const url = modal ? new URL(next, request.url) : new URL("/auth/register", request.url);
  if (modal) url.searchParams.set("auth", "signup");
  else url.searchParams.set("next", next);
  return url;
}

function registrationErrorCode(code?: string, status?: number) {
  if (code === "user_already_exists" || code === "email_exists") return "email_exists";
  if (code === "over_email_send_rate_limit" || status === 429) return "email_rate_limit";
  return "invalid_registration";
}

function indianPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.length === 10 ? `+91${digits}` : digits.length === 12 && digits.startsWith("91") ? `+${digits}` : null;
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const fullName = String(formData.get("fullName") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const pincode = String(formData.get("pincode") ?? "").trim();
  const next = safeNextPath(formData.get("next"));
  const modal = formData.get("modal") === "1";
  const returnTo = safeNextPath(formData.get("returnTo") ?? next);
  const redirectUrl = registerRedirect(request, modal ? returnTo : next, modal);
  if (!email || password.length < 8 || !fullName || !/^[0-9+ ]{10,15}$/.test(phone) || !/^\d{6}$/.test(pincode)) {
    redirectUrl.searchParams.set("error", "invalid_registration");
    return NextResponse.redirect(redirectUrl, 303);
  }

  const response = NextResponse.redirect(redirectUrl, 303);
  const config = getSupabasePublicConfig();
  const supabase = createServerClient(config.NEXT_PUBLIC_SUPABASE_URL, config.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: { getAll: () => request.cookies.getAll(), setAll: (items) => items.forEach(({ name, value, options }) => response.cookies.set(name, value, { ...options, path: options.path ?? "/" })) },
  });
  const confirmUrl = new URL("/auth/callback", request.url);
  confirmUrl.searchParams.set("next", next);
  const metadata = { full_name: fullName, phone, pincode };
  const authPhone = indianPhone(phone);

  if (brandedAuthEmailIsConfigured()) {
    const admin = createSupabaseAdminClient();
    const { data, error } = await admin.auth.admin.generateLink({ type: "signup", email, password, options: { data: metadata, redirectTo: confirmUrl.toString() } });
    if (error || !data.properties?.action_link) {
      redirectUrl.searchParams.set("error", registrationErrorCode(error?.code, error?.status));
      return NextResponse.redirect(redirectUrl, 303);
    }
    if (data.user?.id && authPhone) {
      const { error: phoneError } = await admin.auth.admin.updateUserById(data.user.id, { phone: authPhone });
      if (phoneError) {
        await admin.auth.admin.deleteUser(data.user.id);
        redirectUrl.searchParams.set("error", "phone_in_use");
        return NextResponse.redirect(redirectUrl, 303);
      }
    }
    try {
      await sendSignupVerificationEmail({ email, fullName, verificationUrl: data.properties.action_link });
      redirectUrl.searchParams.set("message", "Check your inbox for the SleepExcellent verification link, then sign in.");
    } catch (emailError) {
      console.error("Could not send signup verification email", emailError);
      if (data.user?.id) await admin.auth.admin.deleteUser(data.user.id);
      redirectUrl.searchParams.set("error", "email_delivery_failed");
    }
    return NextResponse.redirect(redirectUrl, 303);
  }

  const { data, error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: confirmUrl.toString(), data: metadata } });
  if (!error && data.user?.id && authPhone) {
    const admin = createSupabaseAdminClient();
    const { error: phoneError } = await admin.auth.admin.updateUserById(data.user.id, { phone: authPhone });
    if (phoneError) {
      await admin.auth.admin.deleteUser(data.user.id);
      redirectUrl.searchParams.set("error", "phone_in_use");
    }
  }
  if (error) redirectUrl.searchParams.set("error", registrationErrorCode(error.code, error.status));
  else if (!redirectUrl.searchParams.has("error")) redirectUrl.searchParams.set("message", "Check your inbox for the verification link, then sign in.");
  return NextResponse.redirect(redirectUrl, 303);
}
