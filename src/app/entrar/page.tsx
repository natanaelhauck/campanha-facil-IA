"use client";

import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/Button";
import { Header } from "@/components/Header";
import { trackEvent } from "@/lib/analytics";
import { createOptionalSupabaseBrowserClient } from "@/lib/supabase/client";
import { isSupabaseEnabled } from "@/lib/supabase/isSupabaseEnabled";

type LoginStatus = "idle" | "sending" | "sent" | "error";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<LoginStatus>("idle");
  const [message, setMessage] = useState("");
  const supabaseEnabled = isSupabaseEnabled();

  useEffect(() => {
    trackEvent("auth_page_viewed");
  }, []);

  async function requestMagicLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabaseEnabled) {
      return;
    }

    const supabase = createOptionalSupabaseBrowserClient();

    if (!supabase) {
      setStatus("error");
      setMessage("Login ainda não está habilitado neste ambiente.");
      return;
    }

    setStatus("sending");
    setMessage("");

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/historico`,
      },
    });

    if (error) {
      setStatus("error");
      setMessage(
        "Não foi possível enviar o link de acesso. Confira o e-mail e tente novamente.",
      );
      return;
    }

    trackEvent("login_magic_link_requested");
    setStatus("sent");
    setMessage(
      "Enviamos um link de acesso. Abra seu e-mail neste dispositivo para entrar.",
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f8f5]">
      <Header />

      <section className="mx-auto max-w-xl px-5 py-10 md:py-16">
        <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-800">
            Conta opcional
          </p>
          <h1 className="mt-3 text-3xl font-bold leading-tight text-stone-950">
            Entrar no Campanha Fácil IA
          </h1>
          <p className="mt-3 text-sm leading-6 text-stone-600">
            Nesta fase, o login serve para preparar o salvamento de campanhas
            em nuvem. O modo visitante continua funcionando normalmente.
          </p>

          {!supabaseEnabled ? (
            <div
              role="status"
              className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950"
            >
              Login ainda não está habilitado neste ambiente.
            </div>
          ) : (
            <form className="mt-6 grid gap-4" onSubmit={requestMagicLink}>
              <label
                htmlFor="email"
                className="text-sm font-semibold text-stone-900"
              >
                E-mail
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="min-h-12 rounded-md border border-stone-300 bg-white px-4 text-sm text-stone-950 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20"
                placeholder="voce@empresa.com.br"
              />
              <Button type="submit" disabled={status === "sending"}>
                {status === "sending" ? "Enviando..." : "Enviar magic link"}
              </Button>
            </form>
          )}

          {message ? (
            <p
              role={status === "error" ? "alert" : "status"}
              className={`mt-4 rounded-lg border p-4 text-sm leading-6 ${
                status === "error"
                  ? "border-amber-200 bg-amber-50 text-amber-950"
                  : "border-emerald-200 bg-emerald-50 text-emerald-950"
              }`}
            >
              {message}
            </p>
          ) : null}

          <div className="mt-6 border-t border-stone-200 pt-5">
            <Button href="/criar-campanha" variant="secondary">
              Continuar como visitante
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
