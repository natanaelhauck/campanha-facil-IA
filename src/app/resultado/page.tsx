"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/Button";
import { Header } from "@/components/Header";
import { createMockCampaignPlan } from "@/data/mockCampaignResult";
import { isCampaignPlanResult } from "@/lib/campaignPlanValidation";
import type {
  CampaignFormData,
  CampaignPlanResult,
  CampaignPlanSource,
} from "@/types/campaign";

const campaignStorageKey = "campaign-form-data";
const campaignPlanStorageKey = "campaign-plan-result";
const campaignPlanSourceStorageKey = "campaign-plan-source";
type CopyStatus = "idle" | "copied" | "error";

function parseCampaignForm(value: string | null): CampaignFormData | null {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value) as Partial<CampaignFormData>;

    if (!parsed || typeof parsed !== "object") {
      return null;
    }

    return {
      businessName: parsed.businessName ?? "",
      businessType: parsed.businessType ?? "",
      region: parsed.region ?? "",
      offer: parsed.offer ?? "",
      goal: parsed.goal ?? "",
      dailyBudget: parsed.dailyBudget ?? "",
      audience: parsed.audience ?? "",
      differentiator: parsed.differentiator ?? "",
      mainChannel: parsed.mainChannel ?? "",
      experienceLevel: parsed.experienceLevel ?? "",
    };
  } catch {
    return null;
  }
}

function display(value: string, fallback: string) {
  return value.trim() || fallback;
}

function parseCampaignPlan(value: string | null): CampaignPlanResult | null {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value) as unknown;
    return isCampaignPlanResult(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function parsePlanSource(value: string | null): CampaignPlanSource | null {
  return value === "ai" || value === "mock" ? value : null;
}

function ResultSection({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm md:p-6">
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-xl font-bold text-stone-950">{title}</h2>
      <div className="mt-4 text-sm leading-6 text-stone-700">{children}</div>
    </section>
  );
}

function CopyableAdText({ index, text }: { index: number; text: string }) {
  const [status, setStatus] = useState<CopyStatus>("idle");

  async function copyText() {
    try {
      await navigator.clipboard.writeText(text);
      setStatus("copied");
      window.setTimeout(() => setStatus("idle"), 2000);
    } catch {
      setStatus("error");
      window.setTimeout(() => setStatus("idle"), 2500);
    }
  }

  const buttonText =
    status === "copied"
      ? "Copiado"
      : status === "error"
        ? "Não copiado"
        : "Copiar texto";

  return (
    <article className="rounded-lg border border-stone-200 bg-stone-50 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
            Texto {index}
          </p>
          <p className="mt-2 text-sm leading-6 text-stone-800">{text}</p>
        </div>
        <button
          type="button"
          onClick={copyText}
          className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-md border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-900 transition hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2"
        >
          {buttonText}
        </button>
      </div>
      {status === "error" ? (
        <p className="mt-3 text-xs text-amber-800">
          Não foi possível copiar automaticamente. Selecione o texto e copie
          manualmente.
        </p>
      ) : null}
    </article>
  );
}

function EmptyResult() {
  return (
    <main className="min-h-screen bg-[#f7f8f5]">
      <Header />
      <section className="mx-auto max-w-3xl px-5 py-16">
        <div className="rounded-lg border border-stone-200 bg-white p-7 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-800">
            Nenhum plano encontrado
          </p>
          <h1 className="mt-3 text-3xl font-bold text-stone-950">
            Crie uma campanha para ver o resultado
          </h1>
          <p className="mt-4 text-sm leading-6 text-stone-700">
            Não encontramos dados salvos neste navegador. Volte ao formulário e
            preencha as informações básicas para gerar um plano inicial.
          </p>
          <div className="mt-6">
            <Button href="/criar-campanha">Criar campanha</Button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function ResultPage() {
  const [form, setForm] = useState<CampaignFormData | null>(null);
  const [savedPlan, setSavedPlan] = useState<CampaignPlanResult | null>(null);
  const [planSource, setPlanSource] = useState<CampaignPlanSource | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    queueMicrotask(() => {
      const savedForm = localStorage.getItem(campaignStorageKey);
      setForm(parseCampaignForm(savedForm));
      setSavedPlan(
        parseCampaignPlan(localStorage.getItem(campaignPlanStorageKey)),
      );
      setPlanSource(
        parsePlanSource(localStorage.getItem(campaignPlanSourceStorageKey)),
      );
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#f7f8f5]">
        <Header />
        <section className="mx-auto max-w-3xl px-5 py-16">
          <div className="rounded-lg border border-stone-200 bg-white p-7 shadow-sm">
            <p className="text-sm text-stone-700">Carregando plano inicial...</p>
          </div>
        </section>
      </main>
    );
  }

  if (!form) {
    return <EmptyResult />;
  }

  const businessName = display(form.businessName, "seu negócio");
  const businessType = display(form.businessType, "negócio local");
  const region = display(form.region, "sua região");
  const offer = display(form.offer, "produto ou serviço anunciado");
  const goal = display(form.goal, "receber contatos qualificados");
  const dailyBudget = display(form.dailyBudget, "orçamento inicial informado");
  const audience = display(form.audience, "pessoas com interesse na oferta");
  const mainChannel = display(form.mainChannel, "canal principal");
  const experienceLevel = display(form.experienceLevel, "não informado");
  const plan = savedPlan ?? createMockCampaignPlan(form);
  const effectivePlanSource: CampaignPlanSource = savedPlan
    ? (planSource ?? "mock")
    : "mock";
  const sourceLabel =
    effectivePlanSource === "ai"
      ? "Plano gerado com IA"
      : effectivePlanSource === "mock"
        ? "Plano inicial de demonstração"
        : "Plano inicial";

  const planHighlights = [
    {
      title: "Objetivo",
      value: goal,
      description: plan.recommendedObjective,
    },
    {
      title: "Público",
      value: audience,
      description: plan.suggestedAudience,
    },
    {
      title: "Orçamento",
      value: dailyBudget,
      description: plan.budgetGuidance,
    },
  ];

  return (
    <main id="topo" className="min-h-screen bg-[#f7f8f5]">
      <Header />
      <section className="mx-auto max-w-5xl px-5 py-10">
        <div className="mb-6 rounded-xl border border-stone-200 bg-white p-5 shadow-sm md:p-7">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-emerald-800">
                {sourceLabel}
              </p>
              <h1 className="mt-3 max-w-3xl text-3xl font-bold leading-tight text-stone-950 md:text-4xl">
                Resultado para {businessName}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-700">
                Um roteiro simples para organizar a primeira campanha, revisar
                a oferta e acompanhar os primeiros contatos sem prometer
                resultado garantido.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
              <Button href="/criar-campanha" variant="secondary">
                Ajustar informações
              </Button>
              <Button href="#proximos-passos" variant="secondary">
                Ver próximos passos
              </Button>
            </div>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            <div className="rounded-lg bg-emerald-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-900">
                Negócio
              </p>
              <p className="mt-2 text-sm font-bold text-stone-950">
                {businessType}
              </p>
              <p className="mt-1 text-xs leading-5 text-stone-600">{region}</p>
            </div>
            <div className="rounded-lg bg-stone-100 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                Objetivo
              </p>
              <p className="mt-2 text-sm font-bold text-stone-950">{goal}</p>
              <p className="mt-1 text-xs leading-5 text-stone-600">
                Canal principal: {mainChannel}
              </p>
            </div>
            <div className="rounded-lg bg-amber-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-900">
                Verba informada
              </p>
              <p className="mt-2 text-sm font-bold text-stone-950">
                {dailyBudget}
              </p>
              <p className="mt-1 text-xs leading-5 text-stone-600">
                Nível: {experienceLevel}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950">
          {plan.disclaimer}
        </div>

        <div className="grid gap-5">
          <ResultSection
            title="O que fazer primeiro"
            eyebrow="Próximos passos recomendados"
          >
            <div id="proximos-passos" className="grid gap-3 md:grid-cols-5">
              {plan.nextSteps.map((step, index) => (
                <article
                  key={step.title}
                  className="rounded-lg border border-stone-200 bg-stone-50 p-4"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-700 text-sm font-bold text-white">
                    {index + 1}
                  </span>
                  <h3 className="mt-3 text-sm font-bold text-stone-950">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-xs leading-5 text-stone-600">
                    {step.description}
                  </p>
                </article>
              ))}
            </div>
          </ResultSection>

          <ResultSection title="Resumo do plano">
            <div className="grid gap-4 md:grid-cols-[1fr_1fr]">
              <p>{plan.summary}</p>
              <p>
                Dados usados: <strong>{businessName}</strong>,{" "}
                <strong>{businessType}</strong>, <strong>{offer}</strong>,{" "}
                <strong>{region}</strong>, canal <strong>{mainChannel}</strong>{" "}
                e experiência <strong>{experienceLevel}</strong>.
              </p>
            </div>
          </ResultSection>

          <div className="grid gap-5 md:grid-cols-3">
            {planHighlights.map((item) => (
              <article
                key={item.title}
                className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
                  {item.title}
                </p>
                <h2 className="mt-2 text-lg font-bold leading-snug text-stone-950">
                  {item.value}
                </h2>
                <p className="mt-3 text-sm leading-6 text-stone-700">
                  {item.description}
                </p>
              </article>
            ))}
          </div>

          <ResultSection
            title="Textos de anúncio"
            eyebrow="Use como ponto de partida"
          >
            <div className="grid gap-3">
              {plan.adTexts.map((adText, index) => (
                <CopyableAdText
                  key={`${adText.title}-${adText.text}`}
                  index={index + 1}
                  text={adText.text}
                />
              ))}
            </div>
          </ResultSection>

          <ResultSection title="Ideias de criativos">
            <div className="grid gap-3 md:grid-cols-2">
              {plan.creativeIdeas.map((idea) => (
                <div
                  key={idea}
                  className="rounded-lg border border-stone-200 bg-stone-50 p-4"
                >
                  <p>{idea}</p>
                </div>
              ))}
            </div>
          </ResultSection>

          <ResultSection title="Passo a passo">
            <ol className="grid gap-3">
              {plan.setupSteps.map((step, index) => (
                <li
                  key={step}
                  className="flex gap-3 rounded-lg bg-stone-50 p-4"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-stone-900 text-xs font-bold text-white">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </ResultSection>

          <ResultSection title="Checklist antes de publicar">
            <ul className="grid gap-3 md:grid-cols-2">
              {plan.prePublishChecklist.map((item) => (
                <li key={item} className="flex gap-3 rounded-lg bg-stone-50 p-4">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border border-emerald-700 text-xs font-bold text-emerald-800">
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </ResultSection>

          <ResultSection title="Acompanhamento em 3, 7 e 14 dias">
            <div className="grid gap-4 md:grid-cols-3">
              {plan.followUpPlan.map((period) => (
                <div key={period.period} className="rounded-lg bg-stone-50 p-4">
                  <h3 className="text-base font-bold text-stone-950">
                    {period.period}
                  </h3>
                  <ul className="mt-3 grid gap-2">
                    {period.actions.map((action) => (
                      <li
                        key={action}
                        className="border-l-2 border-emerald-700 pl-3"
                      >
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </ResultSection>

          <div className="flex flex-col gap-3 rounded-lg border border-stone-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-6 text-stone-700">
              Quer revisar alguma informação antes de configurar a campanha?
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button href="/criar-campanha" variant="secondary">
                Ajustar informações
              </Button>
              <Button href="#topo" variant="secondary">
                Voltar ao topo
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
