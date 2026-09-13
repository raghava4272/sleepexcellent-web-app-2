import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export type Profile = {
  id: string;
  email: string;
  role: "customer" | "staff" | "admin";
};

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
  if (!profile) return null;

  const initialAdminEmail = process.env.INITIAL_ADMIN_EMAIL?.trim().toLowerCase();
  const isInitialAdmin = Boolean(initialAdminEmail && profile.email.toLowerCase() === initialAdminEmail);
  return profile.role === "admin" || profile.role === "staff" || isInitialAdmin ? profile : null;
}
