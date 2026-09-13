import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function requireAuthenticatedUser(request?: Request) {
  const authorization = request?.headers.get("authorization");
  const accessToken = authorization?.startsWith("Bearer ") ? authorization.slice(7) : null;
  if (accessToken) {
    try {
      const { data: { user } } = await createSupabaseAdminClient().auth.getUser(accessToken);
      if (user) return user;
    } catch {
      // A stale browser token must not prevent the valid HTTP-only session
      // cookie from authenticating the same request below.
    }
  }
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("AUTH_REQUIRED");
  }

  return user;
}
