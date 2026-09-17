import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { getSupabasePublicConfig } from "@/lib/supabase/config";

function safeNextPath(value: FormDataEntryValue | null) {
  const path = typeof value === "string" ? value : null;
  return path?.startsWith("/") && !path.startsWith("//") ? path : "/";
}

function loginRedirect(request: NextRequest, next: string, modal: boolean) {
  const url = modal ? new URL(next, request.url) : new URL("/auth/login", request.url);
  if (modal) url.searchParams.set("auth", "login");
  else url.searchParams.set("next", next);
  return url;
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = safeNextPath(formData.get("next"));
  const modal = formData.get("modal") === "1";
  const redirectUrl = loginRedirect(request, next, modal);
  if (!email || !password) {
    redirectUrl.searchParams.set("error", "missing_credentials");
    return NextResponse.redirect(redirectUrl, 303);
  }

  const response = NextResponse.redirect(new URL(next, request.url), 303);
  const config = getSupabasePublicConfig();
  const supabase = createServerClient(config.NEXT_PUBLIC_SUPABASE_URL, config.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: { getAll: () => request.cookies.getAll(), setAll: (items) => items.forEach(({ name, value, options }) => response.cookies.set(name, value, { ...options, path: options.path ?? "/" })) },
  });
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    redirectUrl.searchParams.set("error", "invalid_credentials");
    return NextResponse.redirect(redirectUrl, 303);
  }
  return response;
}
