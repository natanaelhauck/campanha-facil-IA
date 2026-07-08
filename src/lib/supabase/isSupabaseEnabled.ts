export type SupabaseBrowserConfig = {
  enabled: boolean;
  url: string;
  anonKey: string;
};

export function getSupabaseBrowserConfig(): SupabaseBrowserConfig {
  const flagEnabled = process.env.NEXT_PUBLIC_SUPABASE_ENABLED === "true";
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "";

  return {
    enabled: flagEnabled && url.length > 0 && anonKey.length > 0,
    url,
    anonKey,
  };
}

export function isSupabaseEnabled() {
  return getSupabaseBrowserConfig().enabled;
}
