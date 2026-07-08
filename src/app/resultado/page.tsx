"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Button } from "@/components/Button";
import { BetaFeedbackCard } from "@/components/BetaFeedbackCard";
import { Header } from "@/components/Header";
import { createMockCampaignPlan } from "@/data/mockCampaignResult";
import { trackEvent } from "@/lib/analytics";
import {
  campaignFormStorageKey,
  campaignPlanSourceStorageKey,
  campaignPlanStorageKey,
} from "@/lib/campaignPlanHistory";
import { isCampaignPlanResult } from "@/lib/campaignPlanValidation";
import {
  formatCampaignPlanText,
  formatCreativeBriefing,
  formatSevenDayActionPlan,
} from "@/lib/formatCampaignPlanText";
import type {
  CampaignCreative,
  CampaignDraft,
  CampaignFormData,
  CampaignPlanResult,
  CampaignPlanSource,
  CampaignSevenDayActionPlanItem,
} from "@/types/campaign";

type CopyStatus = "idle" | "copied" | "error";
type PdfStatus = "idle" | "generating" | "downloaded" | "error";
type ResultSectionId =
  | "configuracao"
  | "whatsapp"
  | "metricas"
  | "checklist"
  | "acompanhamento"
  | "plano-completo"
  | "ideias-criativos"
  | "passo-a-passo";

const collapsibleResultSectionIds = new Set<string>([
  "configuracao",
  "whatsapp",
  "metricas",
  "checklist",
  "acompanhamento",
  "plano-completo",
  "ideias-criativos",
  "passo-a-passo",
]);

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
      communicationTone: parsed.communicationTone ?? "",
      hasVisualAssets: parsed.hasVisualAssets ?? "",
      hasWhatsappResponder: parsed.hasWhatsappResponder ?? "",
      currentChallenge: parsed.currentChallenge ?? "",
    };
  } catch {
    return null;
  }
}

function display(value: string, fallback: string) {
  return value.trim() || fallback;
}

function optionalDisplay(value: string | undefined, fallback: string) {
  return value?.trim() || fallback;
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

function isResultSectionId(value: string): value is ResultSectionId {
  return collapsibleResultSectionIds.has(value);
}

function buildCampaignDraft(
  form: CampaignFormData,
  plan: CampaignPlanResult,
): CampaignDraft {
  const setup = plan.campaignSetupGuide;
  const primaryCreative = plan.creativePack?.[0];
  const firstAdText = plan.adTexts[0];
  const firstNextStep = plan.nextSteps[0];
  const creativeBrief = [
    primaryCreative?.readyToUseBriefing,
    primaryCreative?.sceneGuide,
    primaryCreative?.visualIdea,
    plan.creativeIdeas[0],
  ].find((value) => value?.trim());

  return {
    platform: "meta_ads",
    objective: optionalDisplay(
      setup?.objective || plan.recommendedObjective || form.goal,
      "Revisar objetivo da campanha",
    ),
    audience: optionalDisplay(
      setup?.audience || plan.suggestedAudience || form.audience,
      "Público a revisar antes de publicar",
    ),
    location: optionalDisplay(
      setup?.location || form.region,
      "Região informada no briefing",
    ),
    budget: optionalDisplay(
      setup?.initialBudget || plan.budgetGuidance || form.dailyBudget,
      "Orçamento inicial informado",
    ),
    duration: optionalDisplay(
      setup?.durationSuggestion,
      "Teste inicial de 7 dias antes de decidir ajustes",
    ),
    placements: optionalDisplay(
      setup?.channel || form.mainChannel,
      "Meta Ads com canal principal informado",
    ),
    adCopy: optionalDisplay(
      firstAdText?.text,
      "Escolha um texto de anúncio antes de publicar.",
    ),
    creativeBrief: optionalDisplay(
      creativeBrief,
      "Produza uma imagem ou vídeo simples mostrando a oferta real.",
    ),
    whatsappScript: plan.whatsappScript?.firstReply,
    safetyNotes: [
      plan.disclaimer,
      setup?.whatNotToChangeEarly,
      "Revise tudo antes de publicar. Este rascunho não conecta nem altera campanhas reais.",
    ].filter((note): note is string => Boolean(note?.trim())),
    nextSteps: [
      firstNextStep
        ? `${firstNextStep.title}: ${firstNextStep.description}`
        : "Revise objetivo, público, orçamento, anúncio e criativo.",
      ...(plan.sevenDayActionPlan?.[0]?.tasks ?? []),
    ].slice(0, 5),
  };
}

function formatCampaignDraftText(draft: CampaignDraft) {
  return [
    "CAMPANHA PRONTA PARA REVISÃO",
    `Plataforma: ${draft.platform}`,
    `Objetivo: ${draft.objective}`,
    `Público: ${draft.audience}`,
    `Localização: ${draft.location}`,
    `Orçamento: ${draft.budget}`,
    `Duração: ${draft.duration}`,
    `Canal/posicionamento: ${draft.placements}`,
    "",
    "Texto principal do anúncio:",
    draft.adCopy,
    "",
    "Criativo principal:",
    draft.creativeBrief,
    ...(draft.whatsappScript
      ? ["", "Primeira resposta no WhatsApp:", draft.whatsappScript]
      : []),
    "",
    "Próximas ações:",
    ...draft.nextSteps.map((step, index) => `${index + 1}. ${step}`),
    "",
    "Cuidados:",
    ...draft.safetyNotes.map((note) => `- ${note}`),
  ].join("\n");
}

function ResultSection({
  id,
  title,
  eyebrow,
  children,
  collapsible = false,
  isOpen = true,
  onToggle,
}: {
  id?: string;
  title: string;
  eyebrow?: string;
  children: ReactNode;
  collapsible?: boolean;
  isOpen?: boolean;
  onToggle?: (expanded: boolean) => void;
}) {
  const contentId = id ? `${id}-conteudo` : undefined;

  return (
    <section
      id={id}
      className="scroll-mt-4 rounded-lg border border-stone-200 bg-white p-5 shadow-sm md:p-6"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          {eyebrow ? (
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="text-xl font-bold text-stone-950">{title}</h2>
        </div>

        {collapsible ? (
          <button
            type="button"
            aria-expanded={isOpen}
            aria-controls={contentId}
            aria-label={`${isOpen ? "Ocultar" : "Mostrar"} ${title}`}
            onClick={() => onToggle?.(!isOpen)}
            className="inline-flex min-h-9 shrink-0 items-center justify-center rounded-md border border-stone-300 bg-white px-3 py-2 text-xs font-semibold text-stone-900 transition hover:border-emerald-700 hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2"
          >
            <span aria-hidden="true" className="mr-2 text-base leading-none">
              {isOpen ? "-" : "+"}
            </span>
            {isOpen ? "Ocultar" : "Mostrar"}
          </button>
        ) : null}
      </div>

      <div
        id={contentId}
        hidden={collapsible && !isOpen}
        className="mt-4 text-sm leading-6 text-stone-700"
      >
        {children}
      </div>
    </section>
  );
}

function CopyButton({
  text,
  idleLabel,
  copiedLabel = "Copiado",
  prominent = false,
  onCopied,
}: {
  text: string;
  idleLabel: string;
  copiedLabel?: string;
  prominent?: boolean;
  onCopied?: () => void;
}) {
  const [status, setStatus] = useState<CopyStatus>("idle");

  async function copyText() {
    try {
      await navigator.clipboard.writeText(text);
      onCopied?.();
      setStatus("copied");
      window.setTimeout(() => setStatus("idle"), 2000);
    } catch {
      setStatus("error");
      window.setTimeout(() => setStatus("idle"), 2500);
    }
  }

  const buttonText =
    status === "copied"
      ? copiedLabel
      : status === "error"
        ? "Não copiado"
        : idleLabel;

  return (
    <div className={prominent ? "w-full shrink-0" : "shrink-0"}>
      <button
        type="button"
        onClick={copyText}
        aria-live="polite"
        className={
          prominent
            ? "inline-flex min-h-11 w-full items-center justify-center rounded-md bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2"
            : "inline-flex min-h-9 items-center justify-center rounded-md border border-stone-300 bg-white px-3 py-2 text-xs font-semibold text-stone-900 transition hover:border-emerald-700 hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2"
        }
      >
        {buttonText}
      </button>
      {status === "error" ? (
        <p className="mt-2 max-w-48 text-xs leading-5 text-amber-800">
          Selecione e copie manualmente.
        </p>
      ) : null}
    </div>
  );
}

function PdfDownloadButton({
  text,
  businessName,
  onDownloaded,
}: {
  text: string;
  businessName: string;
  onDownloaded?: () => void;
}) {
  const [status, setStatus] = useState<PdfStatus>("idle");

  async function downloadPdf() {
    try {
      setStatus("generating");
      const { downloadCampaignPlanPdf } = await import(
        "@/lib/downloadCampaignPlanPdf"
      );
      await downloadCampaignPlanPdf(text, businessName);
      onDownloaded?.();
      setStatus("downloaded");
      window.setTimeout(() => setStatus("idle"), 2500);
    } catch {
      setStatus("error");
      window.setTimeout(() => setStatus("idle"), 3000);
    }
  }

  const buttonText =
    status === "generating"
      ? "Preparando PDF..."
      : status === "downloaded"
        ? "PDF baixado"
        : status === "error"
          ? "Não foi possível baixar"
          : "Baixar PDF";

  return (
    <div className="w-full shrink-0">
      <button
        type="button"
        onClick={downloadPdf}
        disabled={status === "generating"}
        aria-live="polite"
        className="inline-flex min-h-11 w-full items-center justify-center rounded-md border border-emerald-700 bg-white px-5 py-3 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2 disabled:cursor-wait disabled:opacity-70"
      >
        {buttonText}
      </button>
      {status === "error" ? (
        <p className="mt-2 max-w-52 text-xs leading-5 text-amber-800">
          Tente novamente ou copie o plano em texto.
        </p>
      ) : null}
    </div>
  );
}

function CopyableAdText({ index, text }: { index: number; text: string }) {
  return (
    <article className="rounded-lg border border-stone-200 bg-stone-50 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
            Texto {index}
          </p>
          <p className="mt-2 text-sm leading-6 text-stone-800">{text}</p>
        </div>
        <CopyButton text={text} idleLabel="Copiar texto" />
      </div>
    </article>
  );
}

function DraftReviewCard({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "neutral" | "strong";
}) {
  return (
    <article
      className={
        tone === "strong"
          ? "rounded-lg border border-emerald-200 bg-emerald-50 p-4"
          : "rounded-lg border border-stone-200 bg-white p-4"
      }
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
        {label}
      </p>
      <p className="mt-2 text-sm font-bold leading-6 text-stone-950">
        {value}
      </p>
    </article>
  );
}

function CampaignLaunchSteps({ steps }: { steps: string[] }) {
  return (
    <ol className="grid gap-3 md:grid-cols-5">
      {steps.slice(0, 5).map((step, index) => (
        <li key={step} className="rounded-lg border border-stone-200 bg-white p-4">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-stone-900 text-xs font-bold text-white">
            {index + 1}
          </span>
          <p className="mt-3 text-xs leading-5 text-stone-700">{step}</p>
        </li>
      ))}
    </ol>
  );
}

function PrimaryCreativeSummary({
  creative,
  fallbackIdea,
  onBriefingCopied,
}: {
  creative?: CampaignCreative;
  fallbackIdea: string;
  onBriefingCopied?: () => void;
}) {
  const briefingText = creative
    ? formatCreativeBriefing(creative, 1)
    : fallbackIdea;

  return (
    <article className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
            Produção do anúncio
          </p>
          <h2 className="mt-2 text-xl font-bold text-stone-950">
            Criativo principal recomendado
          </h2>
          <h3 className="mt-1 text-base font-bold text-stone-800">
            {creative?.title ?? "Produza uma peça simples com a oferta"}
          </h3>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-700">
            {creative?.sceneGuide ?? creative?.visualIdea ?? fallbackIdea}
          </p>
        </div>
        <CopyButton
          text={briefingText}
          idleLabel="Copiar briefing do criativo"
          copiedLabel="Briefing copiado"
          onCopied={onBriefingCopied}
        />
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <DraftReviewCard
          label="Formato"
          value={creative?.format ?? "Imagem ou vídeo simples"}
        />
        <DraftReviewCard
          label="Texto na peça"
          value={creative?.textOnCreative ?? "Mostre a oferta principal"}
        />
        <DraftReviewCard
          label="Chamada"
          value={creative?.callToAction ?? "Chamar no WhatsApp"}
          tone="strong"
        />
      </div>

      {creative?.avoid?.length ? (
        <p className="mt-4 border-l-2 border-amber-500 pl-3 text-xs leading-5 text-stone-600">
          <strong className="text-stone-900">Evite:</strong>{" "}
          {creative.avoid[0]}
        </p>
      ) : null}
    </article>
  );
}

function CreativePackCard({
  creative,
  index,
  onBriefingCopied,
}: {
  creative: CampaignCreative;
  index: number;
  onBriefingCopied?: () => void;
}) {
  const briefingText = formatCreativeBriefing(creative, index);

  return (
    <article className="overflow-hidden rounded-xl border border-stone-200 bg-stone-50">
      <div className="border-b border-stone-200 bg-stone-900 p-4 text-white">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-200">
            Criativo {index}
          </p>
          <span className="rounded-full border border-white/20 px-3 py-1 text-xs text-stone-200">
            {creative.format}
          </span>
        </div>
        <h3 className="mt-2 text-lg font-bold">{creative.title}</h3>
      </div>

      <div className="grid gap-4 p-4">
        {creative.goal ? (
          <div className="rounded-lg border border-stone-200 bg-white p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
              Objetivo da peça
            </p>
            <p className="mt-1 text-sm leading-6 text-stone-800">
              {creative.goal}
            </p>
          </div>
        ) : null}

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
            Cena principal
          </p>
          <p className="mt-1 text-sm leading-6 text-stone-800">
            {creative.visualIdea}
          </p>
        </div>

        {creative.sceneGuide ? (
          <div className="rounded-lg border border-stone-200 bg-white p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
              Como montar a cena
            </p>
            <p className="mt-1 text-sm leading-6 text-stone-800">
              {creative.sceneGuide}
            </p>
          </div>
        ) : null}

        {creative.requiredAssets?.length ? (
          <div className="rounded-lg border border-stone-200 bg-white p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
              Materiais
            </p>
            <ul className="mt-2 grid gap-2 text-sm leading-6 text-stone-800">
              {creative.requiredAssets.map((asset) => (
                <li key={asset} className="border-l-2 border-stone-300 pl-3">
                  {asset}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {creative.recordingSteps?.length ? (
          <div className="rounded-lg border border-stone-200 bg-white p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
              Passos de produção
            </p>
            <ol className="mt-2 grid gap-2 text-sm leading-6 text-stone-800">
              {creative.recordingSteps.map((step, stepIndex) => (
                <li key={step} className="flex gap-2">
                  <span className="font-bold text-emerald-800">
                    {stepIndex + 1}.
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        ) : null}

        {creative.canvaLayoutTip ? (
          <div className="rounded-lg border border-stone-200 bg-white p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
              Montagem no Canva
            </p>
            <p className="mt-1 text-sm leading-6 text-stone-800">
              {creative.canvaLayoutTip}
            </p>
          </div>
        ) : null}

        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-900">
            Texto na peça
          </p>
          <p className="mt-1 font-bold text-stone-950">
            “{creative.textOnCreative}”
          </p>
        </div>

        <div className="rounded-lg border border-stone-200 bg-white p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
            Legenda pronta
          </p>
          <p className="mt-2 text-sm leading-6 text-stone-800">
            {creative.caption}
          </p>
          <div className="mt-3 flex items-center justify-between gap-3">
            <p className="text-xs font-semibold text-emerald-800">
              CTA: {creative.callToAction}
            </p>
            <CopyButton text={creative.caption} idleLabel="Copiar legenda" />
          </div>
        </div>

        {creative.avoid?.length ? (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-900">
              Evite
            </p>
            <ul className="mt-2 grid gap-2 text-xs leading-5 text-amber-950">
              {creative.avoid.map((item) => (
                <li key={item} className="border-l-2 border-amber-500 pl-3">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {creative.readyToUseBriefing ? (
          <div className="rounded-lg border border-stone-200 bg-white p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
              Briefing pronto
            </p>
            <p className="mt-2 text-sm leading-6 text-stone-800">
              {creative.readyToUseBriefing}
            </p>
          </div>
        ) : null}

        <div className="rounded-lg border border-dashed border-stone-300 bg-white p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
            Prompt visual
          </p>
          <p className="mt-2 text-xs leading-5 text-stone-700">
            {creative.aiImagePrompt}
          </p>
          <div className="mt-3 flex justify-end">
            <CopyButton
              text={creative.aiImagePrompt}
              idleLabel="Copiar prompt"
            />
          </div>
        </div>

        <p className="border-l-2 border-amber-500 pl-3 text-xs leading-5 text-stone-600">
          <strong className="text-stone-900">Dica de produção:</strong>{" "}
          {creative.productionTip}
        </p>

        <CopyButton
          text={briefingText}
          idleLabel="Copiar briefing do criativo"
          copiedLabel="Briefing copiado"
          onCopied={onBriefingCopied}
        />
      </div>
    </article>
  );
}

function SevenDayActionPlanCard({
  item,
}: {
  item: CampaignSevenDayActionPlanItem;
}) {
  return (
    <article className="rounded-lg border border-stone-200 bg-stone-50 p-4">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-stone-900 text-xs font-bold text-white">
          {item.day.replace("Dia ", "")}
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
            {item.day}
          </p>
          <h3 className="mt-1 text-base font-bold text-stone-950">
            {item.title}
          </h3>
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
            Objetivo
          </p>
          <p className="mt-1 text-sm leading-6 text-stone-800">
            {item.objective}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
            Tarefas
          </p>
          <ul className="mt-2 grid gap-2 text-sm leading-6 text-stone-800">
            {item.tasks.map((task) => (
              <li key={task} className="border-l-2 border-emerald-700 pl-3">
                {task}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-md border border-emerald-200 bg-white p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
            Entrega esperada
          </p>
          <p className="mt-1 text-sm leading-6 text-stone-800">
            {item.expectedOutcome}
          </p>
        </div>

        <p className="border-l-2 border-amber-500 pl-3 text-xs leading-5 text-stone-600">
          <strong className="text-stone-900">Cuidado:</strong> {item.warning}
        </p>
      </div>
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
  const [expandedSections, setExpandedSections] = useState<
    Partial<Record<ResultSectionId, boolean>>
  >({});

  useEffect(() => {
    queueMicrotask(() => {
      const savedForm = localStorage.getItem(campaignFormStorageKey);
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
  const optionalBriefingDetails = [
    form.communicationTone ? `tom ${form.communicationTone}` : "",
    form.hasVisualAssets ? form.hasVisualAssets : "",
    form.hasWhatsappResponder ? form.hasWhatsappResponder : "",
    form.currentChallenge ? `dificuldade: ${form.currentChallenge}` : "",
  ].filter(Boolean);
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
  const setupGuideItems = plan.campaignSetupGuide
    ? [
        ["Objetivo", plan.campaignSetupGuide.objective],
        ["Canal", plan.campaignSetupGuide.channel],
        ["Orçamento inicial", plan.campaignSetupGuide.initialBudget],
        ["Localização", plan.campaignSetupGuide.location],
        ["Público", plan.campaignSetupGuide.audience],
        ["Duração sugerida", plan.campaignSetupGuide.durationSuggestion],
      ]
    : [];
  const whatsappReplies = plan.whatsappScript
    ? [
        ["Primeira resposta", plan.whatsappScript.firstReply],
        ["Quando perguntarem o preço", plan.whatsappScript.priceReply],
        ["Quando houver dúvida", plan.whatsappScript.objectionReply],
        ["Para encaminhar o pedido", plan.whatsappScript.closingReply],
        ["Follow-up sem insistência", plan.whatsappScript.followUpReply],
      ]
    : [];
  const fullPlanText = formatCampaignPlanText(form, plan);
  const campaignDraft = buildCampaignDraft(form, plan);
  const campaignDraftText = formatCampaignDraftText(campaignDraft);
  const primaryCreative = plan.creativePack?.[0];
  const primaryNextAction = plan.nextSteps[0]?.title ?? "Revisar campanha";
  const publishSteps = [
    `Revise o público: ${campaignDraft.audience}`,
    "Copie a configuração da campanha pronta.",
    "Copie o texto do anúncio que combina melhor com a oferta.",
    "Prepare a imagem ou vídeo do criativo principal.",
    "Publique no Gerenciador de Anúncios e acompanhe sem aumentar verba no impulso.",
  ];
  const sevenDayActionPlanText = plan.sevenDayActionPlan
    ? formatSevenDayActionPlan(plan.sevenDayActionPlan)
    : "";
  const isResultSectionOpen = (
    sectionId: ResultSectionId,
    defaultOpen = false,
  ) => expandedSections[sectionId] ?? defaultOpen;
  const setResultSectionOpen = (
    sectionId: ResultSectionId,
    expanded: boolean,
  ) => {
    setExpandedSections((current) => ({
      ...current,
      [sectionId]: expanded,
    }));
    trackEvent("result_section_toggled", {
      sectionId,
      expanded,
    });

    if (sectionId === "plano-completo" && expanded) {
      trackEvent("result_full_plan_opened", {
        source: effectivePlanSource,
      });
    }
  };
  const openResultSection = (target: string) => {
    if (isResultSectionId(target) && !isResultSectionOpen(target)) {
      setResultSectionOpen(target, true);
    }
  };
  const quickNavigation = [
    { label: "Campanha", target: "campanha-pronta" },
    { label: "Passos", target: "passos-publicar" },
    { label: "Textos", target: "textos-anuncio" },
    { label: "Criativo", target: "criativo-principal" },
    { label: "Plano completo", target: "plano-completo" },
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
                Campanha pronta para revisão
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-700">
                Rascunho para <strong>{businessName}</strong>: revise objetivo,
                público, orçamento, anúncio e próximo passo antes de publicar.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
              <CopyButton
                text={campaignDraftText}
                idleLabel="Copiar campanha pronta"
                copiedLabel="Campanha copiada"
                prominent
                onCopied={() =>
                  trackEvent("campaign_draft_copied", {
                    source: effectivePlanSource,
                  })
                }
              />
              <Button
                href="/criar-campanha"
                variant="secondary"
                onNavigate={() =>
                  trackEvent("campaign_adjust_clicked", {
                    source: effectivePlanSource,
                  })
                }
              >
                Ajustar informações
              </Button>
              <Button
                href="#passos-publicar"
                variant="secondary"
                onNavigate={() =>
                  trackEvent("result_primary_action_clicked", {
                    source: effectivePlanSource,
                  })
                }
              >
                Ver próximos passos
              </Button>
            </div>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <DraftReviewCard
              label="Objetivo"
              value={campaignDraft.objective}
              tone="strong"
            />
            <DraftReviewCard label="Público" value={campaignDraft.audience} />
            <DraftReviewCard
              label="Orçamento"
              value={campaignDraft.budget}
            />
            <DraftReviewCard
              label="Próxima ação"
              value={primaryNextAction}
              tone="strong"
            />
          </div>
        </div>

        <nav
          aria-label="Navegação rápida do plano"
          className="mb-6 rounded-lg border border-stone-200 bg-white p-3 shadow-sm"
        >
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center">
            <span className="col-span-2 px-2 text-xs font-semibold uppercase tracking-wide text-stone-500 sm:mr-1">
              Ir para
            </span>
            {quickNavigation.map((item) => (
              <Button
                key={item.target}
                href={`#${item.target}`}
                variant="secondary"
                className="min-h-9 px-3 py-2 text-xs"
                onNavigate={() => openResultSection(item.target)}
              >
                {item.label}
              </Button>
            ))}
          </div>
        </nav>

        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950">
          {plan.disclaimer}
        </div>

        <div className="grid gap-5">
          <ResultSection
            id="campanha-pronta"
            title="Revisão completa da campanha"
            eyebrow="Rascunho estruturado para Meta Ads"
          >
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              <DraftReviewCard
                label="Objetivo da campanha"
                value={campaignDraft.objective}
                tone="strong"
              />
              <DraftReviewCard
                label="Público recomendado"
                value={campaignDraft.audience}
              />
              <DraftReviewCard
                label="Região"
                value={campaignDraft.location}
              />
              <DraftReviewCard
                label="Orçamento"
                value={campaignDraft.budget}
              />
              <DraftReviewCard
                label="Duração"
                value={campaignDraft.duration}
              />
              <DraftReviewCard
                label="Canal/posicionamento"
                value={campaignDraft.placements}
              />
              <DraftReviewCard
                label="CTA principal"
                value={primaryCreative?.callToAction ?? "Chamar no WhatsApp"}
              />
              <DraftReviewCard
                label="Próxima ação"
                value={campaignDraft.nextSteps[0]}
                tone="strong"
              />
            </div>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <CopyButton
                text={campaignDraftText}
                idleLabel="Copiar campanha pronta"
                copiedLabel="Campanha copiada"
                onCopied={() =>
                  trackEvent("campaign_draft_copied", {
                    source: effectivePlanSource,
                  })
                }
              />
              <Button
                href="#plano-completo"
                variant="secondary"
                onNavigate={() => openResultSection("plano-completo")}
              >
                Ver plano completo
              </Button>
            </div>
          </ResultSection>

          <ResultSection
            id="passos-publicar"
            title="Passos para colocar no ar"
            eyebrow="No máximo 5 ações"
          >
            <CampaignLaunchSteps steps={publishSteps} />
          </ResultSection>

          <ResultSection
            id="textos-anuncio"
            title="Textos principais do anúncio"
            eyebrow="Escolha um para começar"
          >
            <div className="grid gap-3">
              {plan.adTexts.slice(0, 3).map((adText, index) => (
                <CopyableAdText
                  key={`${adText.title}-${adText.text}`}
                  index={index + 1}
                  text={adText.text}
                />
              ))}
            </div>
          </ResultSection>

          <div id="criativo-principal" className="scroll-mt-4">
            <PrimaryCreativeSummary
              creative={primaryCreative}
              fallbackIdea={campaignDraft.creativeBrief}
              onBriefingCopied={() =>
                trackEvent("creative_briefing_copied", {
                  source: effectivePlanSource,
                })
              }
            />
          </div>

          <ResultSection
            id="plano-completo"
            title="Material de apoio"
            eyebrow="Plano completo, PDF e detalhes"
            collapsible
            isOpen={isResultSectionOpen("plano-completo")}
            onToggle={(expanded) =>
              setResultSectionOpen("plano-completo", expanded)
            }
          >
            <div className="mb-5 grid gap-3 sm:grid-cols-2">
              <CopyButton
                text={fullPlanText}
                idleLabel="Copiar plano completo"
                copiedLabel="Plano copiado"
                prominent
                onCopied={() =>
                  trackEvent("campaign_plan_copied", {
                    source: effectivePlanSource,
                  })
                }
              />
              <PdfDownloadButton
                text={fullPlanText}
                businessName={businessName}
                onDownloaded={() =>
                  trackEvent("campaign_pdf_downloaded", {
                    source: effectivePlanSource,
                  })
                }
              />
            </div>

          <ResultSection
            id="proximos-passos"
            title="O que fazer primeiro"
            eyebrow="Próximos passos recomendados"
          >
            <div className="grid gap-3 md:grid-cols-5">
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

          {plan.sevenDayActionPlan ? (
            <ResultSection
              id="plano-7-dias"
              title="Plano de ação de 7 dias"
              eyebrow="Rotina prática para executar"
            >
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <p className="max-w-3xl text-sm leading-6 text-stone-600">
                  Use como roteiro da primeira semana. Revise cada tarefa antes
                  de executar e mantenha decisões de verba conservadoras.
                </p>
                <CopyButton
                  text={sevenDayActionPlanText}
                  idleLabel="Copiar plano de ação"
                  copiedLabel="Plano de ação copiado"
                  onCopied={() =>
                    trackEvent("action_plan_copied", {
                      source: effectivePlanSource,
                    })
                  }
                />
              </div>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {plan.sevenDayActionPlan.map((item) => (
                  <SevenDayActionPlanCard
                    key={`${item.day}-${item.title}`}
                    item={item}
                  />
                ))}
              </div>
            </ResultSection>
          ) : null}

          <ResultSection title="Resumo do plano">
            <div className="grid gap-4 md:grid-cols-[1fr_1fr]">
              <p>{plan.summary}</p>
              <p>
                Dados usados: <strong>{businessName}</strong>,{" "}
                <strong>{businessType}</strong>, <strong>{offer}</strong>,{" "}
                <strong>{region}</strong>, canal <strong>{mainChannel}</strong>{" "}
                e experiência <strong>{experienceLevel}</strong>
                {optionalBriefingDetails.length > 0
                  ? `, com ${optionalBriefingDetails.join(", ")}.`
                  : "."}
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

          {plan.campaignSetupGuide ? (
            <ResultSection
              id="configuracao"
              title="Configuração sugerida da campanha"
              eyebrow="Ficha pronta para consultar"
              collapsible
              isOpen={isResultSectionOpen("configuracao")}
              onToggle={(expanded) =>
                setResultSectionOpen("configuracao", expanded)
              }
            >
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {setupGuideItems.map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-lg border border-stone-200 bg-stone-50 p-4"
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
                      {label}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-stone-800">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-amber-900">
                  Evite mudar cedo
                </p>
                <p className="mt-2 text-sm leading-6 text-amber-950">
                  {plan.campaignSetupGuide.whatNotToChangeEarly}
                </p>
              </div>
            </ResultSection>
          ) : null}

          {plan.creativePack ? (
            <ResultSection
              id="criativos"
              title="Pacote de criativos"
              eyebrow="Briefings para produzir — nenhuma imagem foi gerada"
            >
              <p className="mb-4 max-w-3xl text-sm leading-6 text-stone-600">
                Use as ideias com fotos reais, no Canva, com um designer ou em
                uma futura ferramenta de imagem. Revise textos e detalhes antes
                de publicar.
              </p>
              <div className="grid gap-4 lg:grid-cols-3">
                {plan.creativePack.map((creative, index) => (
                  <CreativePackCard
                    key={`${creative.title}-${creative.format}`}
                    creative={creative}
                    index={index + 1}
                    onBriefingCopied={() =>
                      trackEvent("creative_briefing_copied", {
                        source: effectivePlanSource,
                      })
                    }
                  />
                ))}
              </div>
            </ResultSection>
          ) : null}

          <ResultSection
            title="Textos de anúncio"
            eyebrow="Use como ponto de partida"
            id="textos-completos"
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

          {plan.whatsappScript ? (
            <ResultSection
              id="whatsapp"
              title="Roteiro de atendimento no WhatsApp"
              eyebrow="Respostas para adaptar antes de enviar"
              collapsible
              isOpen={isResultSectionOpen("whatsapp")}
              onToggle={(expanded) =>
                setResultSectionOpen("whatsapp", expanded)
              }
            >
              <div className="grid gap-3 md:grid-cols-2">
                {whatsappReplies.map(([label, reply], index) => (
                  <article
                    key={label}
                    className={`rounded-lg border border-stone-200 bg-stone-50 p-4 ${
                      index === whatsappReplies.length - 1
                        ? "md:col-span-2"
                        : ""
                    }`}
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
                          {label}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-stone-800">
                          {reply}
                        </p>
                      </div>
                      <CopyButton text={reply} idleLabel="Copiar resposta" />
                    </div>
                  </article>
                ))}
              </div>
            </ResultSection>
          ) : null}

          <ResultSection
            id={plan.creativePack ? "ideias-criativos" : "criativos"}
            title="Ideias de criativos"
            collapsible={Boolean(plan.creativePack)}
            isOpen={
              plan.creativePack
                ? isResultSectionOpen("ideias-criativos")
                : true
            }
            onToggle={(expanded) =>
              setResultSectionOpen("ideias-criativos", expanded)
            }
          >
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

          <ResultSection
            id="passo-a-passo"
            title="Passo a passo"
            collapsible
            isOpen={isResultSectionOpen("passo-a-passo")}
            onToggle={(expanded) =>
              setResultSectionOpen("passo-a-passo", expanded)
            }
          >
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

          <ResultSection
            id="checklist"
            title="Checklist antes de publicar"
            collapsible
            isOpen={isResultSectionOpen("checklist")}
            onToggle={(expanded) =>
              setResultSectionOpen("checklist", expanded)
            }
          >
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

          {plan.simpleMetricsGuide ? (
            <ResultSection
              id="metricas"
              title="Métricas simples para acompanhar"
              eyebrow="Leia os sinais antes de mexer na verba"
              collapsible
              isOpen={isResultSectionOpen("metricas")}
              onToggle={(expanded) =>
                setResultSectionOpen("metricas", expanded)
              }
            >
              <div className="grid gap-4 lg:grid-cols-3">
                <div className="rounded-lg border border-stone-200 bg-stone-50 p-4">
                  <h3 className="font-bold text-stone-950">O que observar</h3>
                  <ul className="mt-3 grid gap-2">
                    {plan.simpleMetricsGuide.metricsToWatch.map((metric) => (
                      <li
                        key={metric}
                        className="border-l-2 border-stone-400 pl-3"
                      >
                        {metric}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                  <h3 className="font-bold text-emerald-950">Bons sinais</h3>
                  <ul className="mt-3 grid gap-2">
                    {plan.simpleMetricsGuide.goodSigns.map((sign) => (
                      <li key={sign} className="flex gap-2 text-emerald-950">
                        <span aria-hidden="true">+</span>
                        <span>{sign}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                  <h3 className="font-bold text-amber-950">
                    Sinais de atenção
                  </h3>
                  <ul className="mt-3 grid gap-2">
                    {plan.simpleMetricsGuide.warningSigns.map((sign) => (
                      <li key={sign} className="flex gap-2 text-amber-950">
                        <span aria-hidden="true">!</span>
                        <span>{sign}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="rounded-lg border border-stone-200 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                    Quando esperar
                  </p>
                  <p className="mt-2 text-sm leading-6 text-stone-800">
                    {plan.simpleMetricsGuide.whenToWait}
                  </p>
                </div>
                <div className="rounded-lg border border-stone-200 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                    Quando ajustar
                  </p>
                  <p className="mt-2 text-sm leading-6 text-stone-800">
                    {plan.simpleMetricsGuide.whenToAdjust}
                  </p>
                </div>
              </div>
            </ResultSection>
          ) : null}

          </ResultSection>

          <BetaFeedbackCard />

          <ResultSection
            id="acompanhamento"
            title="Acompanhamento em 3, 7 e 14 dias"
            collapsible
            isOpen={isResultSectionOpen("acompanhamento")}
            onToggle={(expanded) =>
              setResultSectionOpen("acompanhamento", expanded)
            }
          >
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
              <Button
                href="/criar-campanha"
                variant="secondary"
                onNavigate={() =>
                  trackEvent("campaign_adjust_clicked", {
                    source: effectivePlanSource,
                  })
                }
              >
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
