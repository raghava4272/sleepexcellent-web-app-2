import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export type Profile = {
  id: string;
  email: string;
  role: "customer" | "staff" | "admin";
};

// Temporary test-mode switch. Set AUTH_REQUIRED=true before enabling real payments or customer data.
export function isAuthRequired() {
  return process.env.AUTH_REQUIRED === "true";
}

export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("id, email, role")
    .eq("id", user.id)
    .maybeSingle();

  return (data as Profile | null) ?? null;
}

export async function getCurrentStaffProfile() {
  const profile = await getCurrentProfile();
  return profile?.role === "admin" || profile?.role === "staff" ? profile : null;
}
