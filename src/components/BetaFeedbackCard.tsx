"use client";

import { trackEvent } from "@/lib/analytics";

function getSafePublicUrl(value: string | undefined) {
  const configuredUrl = value?.trim();

  if (!configuredUrl) {
    return null;
  }

  try {
    const url = new URL(configuredUrl);
    return url.protocol === "https:" || url.protocol === "http:"
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}

const feedbackUrl = getSafePublicUrl(
  process.env.NEXT_PUBLIC_FEEDBACK_URL,
);
const helpUrl = getSafePublicUrl(process.env.NEXT_PUBLIC_HELP_URL);

export function BetaFeedbackCard() {
  if (!feedbackUrl && !helpUrl) {
    return null;
  }

  return (
    <section className="overflow-hidden rounded-xl border border-emerald-200 bg-emerald-950 text-white shadow-sm">
      <div className="grid gap-5 p-5 md:grid-cols-[1fr_auto] md:items-center md:p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-200">
            Validação beta
          </p>
          <h2 className="mt-2 text-xl font-bold">Esse plano foi útil?</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-emerald-50/80">
            Conte o que ajudou ou onde você travou. Nenhum dado do formulário
            ou do plano é enviado automaticamente.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row md:justify-end">
          {feedbackUrl ? (
            <a
              href={feedbackUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("feedback_clicked")}
              className="inline-flex min-h-11 items-center justify-center rounded-md bg-emerald-300 px-5 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:ring-offset-2 focus:ring-offset-emerald-950"
            >
              Enviar feedback
            </a>
          ) : null}
          {helpUrl ? (
            <a
              href={helpUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("help_clicked")}
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-emerald-700 bg-transparent px-5 py-3 text-sm font-semibold text-white transition hover:border-emerald-400 hover:bg-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-emerald-950"
            >
              Quero ajuda para configurar
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
