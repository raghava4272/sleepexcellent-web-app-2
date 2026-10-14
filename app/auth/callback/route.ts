import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { getSupabasePublicConfig } from "@/lib/supabase/config";

function safeNextPath(value: string | null) {
  return value?.startsWith("/") && !value.startsWith("//") ? value : "/";
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = safeNextPath(requestUrl.searchParams.get("next"));
  const response = NextResponse.redirect(new URL(next, requestUrl.origin));

  if (!code) return response;

  const config = getSupabasePublicConfig();
  const supabase = createServerClient(config.NEXT_PUBLIC_SUPABASE_URL, config.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          // Supabase SSR requires getAll() to observe every cookie written by
          // setAll() during the same request. Keep the request and outgoing
          // response in sync while the PKCE code is exchanged.
          request.cookies.set(name, value);
          response.cookies.set(name, value, { ...options, path: options.path ?? "/" });
        });
      },
    },
  });

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    console.error("Google OAuth callback exchange failed", {
      code: error.code,
      status: error.status,
      message: error.message,
    });
    const loginUrl = new URL("/auth/login", requestUrl.origin);
    loginUrl.searchParams.set("next", next);
    loginUrl.searchParams.set("error", "oauth_callback_failed");
    return NextResponse.redirect(loginUrl);
  }

  return response;
}
