import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseBrowserConfig } from "./isSupabaseEnabled";

let cachedClient: SupabaseClient | null = null;

export function createOptionalSupabaseBrowserClient() {
  const config = getSupabaseBrowserConfig();

  if (!config.enabled) {
    return null;
  }

  cachedClient ??= createClient(config.url, config.anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });

  return cachedClient;
}
