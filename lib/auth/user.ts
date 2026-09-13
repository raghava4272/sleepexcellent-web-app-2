import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function requireAuthenticatedUser() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("AUTH_REQUIRED");
  }

  return user;
}
