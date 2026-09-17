import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { getSupabasePublicConfig } from "@/lib/supabase/config";

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

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = safeNextPath(formData.get("next"));
  const modal = formData.get("modal") === "1";
  const redirectUrl = registerRedirect(request, next, modal);
  if (!email || password.length < 8) {
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
  const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: confirmUrl.toString() } });
  if (error) {
    redirectUrl.searchParams.set("error", "invalid_registration");
  } else {
    redirectUrl.searchParams.set("message", "Check your inbox for the verification link, then sign in.");
  }
  return NextResponse.redirect(redirectUrl, 303);
}
