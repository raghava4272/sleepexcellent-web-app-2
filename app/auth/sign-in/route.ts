import { NextRequest, NextResponse } from "next/server";
import { createHash, randomBytes } from "node:crypto";
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
  const redirectTo = new URL("/auth/callback", request.url);
  redirectTo.searchParams.set("next", next);
  const verifier = randomBytes(48).toString("base64url");
  const challenge = createHash("sha256").update(verifier).digest("base64url");
  const authorizeUrl = new URL("/auth/v1/authorize", config.NEXT_PUBLIC_SUPABASE_URL);
  authorizeUrl.searchParams.set("provider", "google");
  authorizeUrl.searchParams.set("redirect_to", redirectTo.toString());
  authorizeUrl.searchParams.set("code_challenge", challenge);
  authorizeUrl.searchParams.set("code_challenge_method", "s256");

  const response = NextResponse.redirect(authorizeUrl);
  response.cookies.set("sleepexcellent-oauth-verifier", verifier, {
    httpOnly: true,
    secure: request.nextUrl.protocol === "https:",
    sameSite: "lax",
    path: "/",
    maxAge: 10 * 60,
  });
  return response;
}
