import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { getSupabasePublicConfig } from "@/lib/supabase/config";

function safeNextPath(value: FormDataEntryValue | null) {
  const path = typeof value === "string" ? value : null;
  return path?.startsWith("/") && !path.startsWith("//") ? path : "/";
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = safeNextPath(formData.get("next"));
  const redirectUrl = new URL("/auth/login", request.url);
  redirectUrl.searchParams.set("next", next);
  if (!email || !password) {
    redirectUrl.searchParams.set("error", "missing_credentials");
    return NextResponse.redirect(redirectUrl, 303);
  }

  const response = NextResponse.redirect(new URL(next, request.url), 303);
  const config = getSupabasePublicConfig();
  const supabase = createServerClient(config.NEXT_PUBLIC_SUPABASE_URL, config.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: { getAll: () => request.cookies.getAll(), setAll: (items) => items.forEach(({ name, value, options }) => response.cookies.set(name, value, options)) },
  });
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    redirectUrl.searchParams.set("error", "invalid_credentials");
    return NextResponse.redirect(redirectUrl, 303);
  }
  return response;
}
