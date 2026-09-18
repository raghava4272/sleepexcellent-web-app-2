import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { getSupabasePublicConfig } from "@/lib/supabase/config";

// Signing out must be an explicit submission, never a prefetched GET.
export async function POST(request: NextRequest) {
  const next = request.nextUrl.searchParams.get("next") === "/auth/login" ? "/auth/login" : "/";
  const response = NextResponse.redirect(new URL(next, request.url), 303);
  const config = getSupabasePublicConfig();
  const supabase = createServerClient(config.NEXT_PUBLIC_SUPABASE_URL, config.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: { getAll: () => request.cookies.getAll(), setAll: (items) => items.forEach(({ name, value, options }) => response.cookies.set(name, value, { ...options, path: options.path ?? "/" })) },
  });
  await supabase.auth.signOut();
  return response;
}
