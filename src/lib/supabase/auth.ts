import type { User } from "@supabase/supabase-js";
import { createOptionalSupabaseBrowserClient } from "./client";
import { isSupabaseEnabled } from "./isSupabaseEnabled";

export type SupabaseAuthState = {
  isEnabled: boolean;
  isLoggedIn: boolean;
  userId?: string;
  userEmail?: string;
};

function toAuthState(user: User | null): SupabaseAuthState {
  return {
    isEnabled: isSupabaseEnabled(),
    isLoggedIn: Boolean(user),
    userId: user?.id,
    userEmail: user?.email,
  };
}

export async function getSupabaseAuthState(): Promise<SupabaseAuthState> {
  const supabase = createOptionalSupabaseBrowserClient();

  if (!supabase) {
    return {
      isEnabled: false,
      isLoggedIn: false,
    };
  }

  const { data, error } = await supabase.auth.getUser();

  if (error) {
    return {
      isEnabled: true,
      isLoggedIn: false,
    };
  }

  return toAuthState(data.user);
}

export function subscribeToSupabaseAuthChanges(
  onChange: (state: SupabaseAuthState) => void,
) {
  const supabase = createOptionalSupabaseBrowserClient();

  if (!supabase) {
    return () => {};
  }

  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    onChange(toAuthState(session?.user ?? null));
  });

  return () => data.subscription.unsubscribe();
}

export async function signOutOfSupabase() {
  const supabase = createOptionalSupabaseBrowserClient();

  if (!supabase) {
    return false;
  }

  const { error } = await supabase.auth.signOut();
  return !error;
}
