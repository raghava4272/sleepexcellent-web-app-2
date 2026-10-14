import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { getSupabasePublicConfig } from "@/lib/supabase/config";

function safeNextPath(value: string | null) {
  return value?.startsWith("/") && !value.startsWith("//") ? value : "/";
}

async function googleProviderIsEnabled(url: string, anonKey: string) {
  try {
    const response = await fetch(`${url}/auth/v1/settings`, {
      cache: "no-store",
      headers: { apikey: anonKey },
    });
    if (!response.ok) return false;
    const settings = await response.json() as { external?: { google?: boolean } };
    return settings.external?.google === true;
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  const config = getSupabasePublicConfig();
  const next = safeNextPath(request.nextUrl.searchParams.get("next"));
  if (!await googleProviderIsEnabled(config.NEXT_PUBLIC_SUPABASE_URL, config.NEXT_PUBLIC_SUPABASE_ANON_KEY)) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("next", next);
    loginUrl.searchParams.set("error", "google_unavailable");
    return NextResponse.redirect(loginUrl);
  }
  const response = NextResponse.redirect(new URL("/", request.url));
  const supabase = createServerClient(config.NEXT_PUBLIC_SUPABASE_URL, config.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });
  const redirectTo = new URL("/auth/callback", request.url);
  redirectTo.searchParams.set("next", next);
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: redirectTo.toString() },
  });

  if (error || !data.url) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("next", next);
    loginUrl.searchParams.set("error", "google_unavailable");
    return NextResponse.redirect(loginUrl);
  }

  // signInWithOAuth stores the PKCE verifier on `response`. Preserve those
  // cookies on the provider redirect so the callback can exchange its code
  // for a session after Google sends the customer back.
  response.headers.set("Location", data.url);
  return response;
}
