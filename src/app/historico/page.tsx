"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { Header } from "@/components/Header";
import {
  readCampaignPlanHistory,
  removeCampaignPlanFromHistory,
  restoreCampaignPlanFromHistory,
} from "@/lib/campaignPlanHistory";
import type { CampaignPlanHistoryItem } from "@/types/campaign";

function formatHistoryDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getSourceLabel(item: CampaignPlanHistoryItem) {
  if (item.source === "mock") {
    return "Demonstração";
  }

  return item.provider === "gemini" ? "IA · Gemini" : "IA · OpenAI";
}

export default function CampaignHistoryPage() {
  const [history, setHistory] = useState<CampaignPlanHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [restoreError, setRestoreError] = useState("");
  const router = useRouter();

  useEffect(() => {
    queueMicrotask(() => {
      setHistory(readCampaignPlanHistory(localStorage));
      setIsLoading(false);
    });
  }, []);

  function openPlan(item: CampaignPlanHistoryItem) {
    setRestoreError("");

    if (!restoreCampaignPlanFromHistory(localStorage, item)) {
      setRestoreError(
        "Não foi possível abrir este plano. Verifique o espaço do navegador e tente novamente.",
      );
      return;
    }

    router.push("/resultado");
  }

  function deletePlan(id: string) {
    setRestoreError("");
    setHistory(removeCampaignPlanFromHistory(localStorage, id));
  }

  return (
    <main className="min-h-screen bg-[#f7f8f5]">
      <Header />

      <section className="mx-auto max-w-5xl px-5 py-10 md:py-14">
        <div className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm">
          <div className="grid gap-6 bg-stone-950 p-6 text-white md:grid-cols-[1fr_auto] md:items-end md:p-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200">
                Arquivo local
              </p>
              <h1 className="mt-3 text-3xl font-bold leading-tight md:text-4xl">
                Histórico de planos
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-300">
                Retome campanhas anteriores sem preencher tudo novamente.
                Seus planos ficam somente neste navegador.
              </p>
            </div>
            <Button
              href="/criar-campanha"
              className="bg-emerald-600 hover:bg-emerald-500"
            >
              Criar novo plano
            </Button>
          </div>

          <div className="border-t border-amber-200 bg-amber-50 px-6 py-4 text-sm leading-6 text-amber-950 md:px-8">
            Não há conta ou sincronização nesta versão. Limpar os dados do
            navegador pode apagar todo o histórico.
          </div>
        </div>

        {restoreError ? (
          <p
            role="alert"
            className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950"
          >
            {restoreError}
          </p>
        ) : null}

        {isLoading ? (
          <div className="mt-6 rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-stone-600">Carregando histórico...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-stone-300 bg-white p-8 text-center shadow-sm md:p-12">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-lg font-bold text-emerald-800">
              0
            </span>
            <h2 className="mt-5 text-xl font-bold text-stone-950">
              Nenhum plano salvo ainda
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-stone-600">
              Gere uma campanha e ela aparecerá aqui para você consultar,
              ajustar ou abrir novamente.
            </p>
            <Button href="/criar-campanha" className="mt-6">
              Criar meu primeiro plano
            </Button>
          </div>
        ) : (
          <div className="mt-6">
            <div className="mb-4 flex items-center justify-between gap-4">
              <p className="text-sm font-semibold text-stone-700">
                {history.length}{" "}
                {history.length === 1 ? "plano salvo" : "planos salvos"}
              </p>
              <p className="text-xs text-stone-500">Mais recentes primeiro</p>
            </div>

            <div className="grid gap-4">
              {history.map((item, index) => (
                <article
                  key={item.id}
                  className="grid overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm md:grid-cols-[5rem_1fr_auto]"
                >
                  <div className="flex items-center justify-center bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-900 md:py-6">
                    #{String(history.length - index).padStart(2, "0")}
                  </div>

                  <div className="min-w-0 p-5 md:p-6">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-700">
                        {getSourceLabel(item)}
                      </span>
                      <time
                        dateTime={item.createdAt}
                        className="text-xs text-stone-500"
                      >
                        {formatHistoryDate(item.createdAt)}
                      </time>
                    </div>

                    <h2 className="mt-3 truncate text-xl font-bold text-stone-950">
                      {item.businessName}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-stone-600">
                      {item.objective || "Objetivo não informado"}
                      {item.formData.mainChannel
                        ? ` · ${item.formData.mainChannel}`
                        : ""}
                    </p>
                  </div>

                  <div className="flex gap-3 border-t border-stone-200 p-5 md:flex-col md:justify-center md:border-l md:border-t-0">
                    <Button
                      type="button"
                      onClick={() => openPlan(item)}
                      className="flex-1 whitespace-nowrap md:flex-none"
                    >
                      Abrir plano
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => deletePlan(item.id)}
                      className="flex-1 whitespace-nowrap text-red-700 hover:border-red-300 hover:bg-red-50 md:flex-none"
                    >
                      Excluir
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
