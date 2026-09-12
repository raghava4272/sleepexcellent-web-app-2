import "server-only";

import { createClient } from "@supabase/supabase-js";
import { getSupabaseServiceConfig } from "./config";

export function createSupabaseAdminClient() {
  const config = getSupabaseServiceConfig();
  return createClient(config.NEXT_PUBLIC_SUPABASE_URL, config.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
