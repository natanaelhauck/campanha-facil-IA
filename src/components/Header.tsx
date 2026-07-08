"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  getSupabaseAuthState,
  signOutOfSupabase,
  subscribeToSupabaseAuthChanges,
  type SupabaseAuthState,
} from "@/lib/supabase/auth";
import { Button } from "./Button";

function getShortAccountLabel(email: string | undefined) {
  if (!email) {
    return "Minha conta";
  }

  const [name, domain] = email.split("@");

  if (!name || !domain) {
    return "Minha conta";
  }

  return `${name.slice(0, 10)}@${domain.split(".")[0]}`;
}

export function Header() {
  const [authState, setAuthState] = useState<SupabaseAuthState>({
    isEnabled: false,
    isLoggedIn: false,
  });

  useEffect(() => {
    let isMounted = true;

    getSupabaseAuthState().then((state) => {
      if (isMounted) {
        setAuthState(state);
      }
    });

    const unsubscribe = subscribeToSupabaseAuthChanges((state) => {
      if (isMounted) {
        setAuthState(state);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  async function handleSignOut() {
    const signedOut = await signOutOfSupabase();

    if (signedOut) {
      setAuthState({
        isEnabled: authState.isEnabled,
        isLoggedIn: false,
      });
    }
  }

  return (
    <header className="border-b border-stone-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" className="text-base font-bold text-stone-950">
          Campanha Fácil IA
        </Link>
        <nav
          aria-label="Navegação principal"
          className="flex items-center gap-2 sm:gap-3"
        >
          <Link
            href="/historico"
            className="text-xs font-medium text-stone-600 transition hover:text-stone-950 sm:text-sm"
          >
            Histórico
          </Link>
          <Link
            href="/criar-campanha"
            className="hidden text-sm font-medium text-stone-700 hover:text-stone-950 sm:inline"
          >
            Criar campanha
          </Link>
          {authState.isLoggedIn ? (
            <div className="flex items-center gap-2">
              <span className="hidden max-w-36 truncate text-xs font-medium text-stone-600 md:inline">
                {getShortAccountLabel(authState.userEmail)}
              </span>
              <button
                type="button"
                onClick={handleSignOut}
                className="text-xs font-semibold text-stone-700 transition hover:text-stone-950"
              >
                Sair
              </button>
            </div>
          ) : (
            <Link
              href="/entrar"
              className="text-xs font-medium text-stone-600 transition hover:text-stone-950 sm:text-sm"
            >
              Entrar
            </Link>
          )}
          <Button href="/criar-campanha" className="px-4 py-2">
            Começar
          </Button>
        </nav>
      </div>
    </header>
  );
}
