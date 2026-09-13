"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export async function customerAuthHeaders(): Promise<Record<string, string>> {
  const { data: { session } } = await createSupabaseBrowserClient().auth.getSession();
  return session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {};
}
