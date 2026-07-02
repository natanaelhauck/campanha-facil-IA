"use client";

import {
  FormEvent,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { Header } from "@/components/Header";
import { Input } from "@/components/Input";
import { Select } from "@/components/Select";
import { Textarea } from "@/components/Textarea";
import {
  addCampaignPlanToHistory,
  campaignFormStorageKey,
  campaignPlanProviderStorageKey,
  campaignPlanSourceStorageKey,
  campaignPlanStorageKey,
} from "@/lib/campaignPlanHistory";
import {
  getSafeCampaignAnalyticsContext,
  trackEvent,
  type AnalyticsErrorCategory,
} from "@/lib/analytics";
import type {
  CampaignFormData,
  CampaignGenerationResponse,
} from "@/types/campaign";

const initialForm: CampaignFormData = {
  businessName: "",
  businessType: "",
  region: "",
  offer: "",
  goal: "",
  dailyBudget: "",
  audience: "",
  differentiator: "",
  mainChannel: "",
  experienceLevel: "",
};

function parseSavedForm(value: string | null): CampaignFormData | null {
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

function FormSection({
  number,
  title,
  description,
  children,
}: {
  number: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm md:p-6">
      <div className="mb-5 flex gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-emerald-700 text-sm font-bold text-white">
          {number}
        </span>
        <div>
          <h2 className="text-lg font-bold text-stone-950">{title}</h2>
          <p className="mt-1 text-sm leading-6 text-stone-600">
            {description}
          </p>
        </div>
      </div>
      <div className="grid gap-5 md:grid-cols-2">{children}</div>
    </section>
  );
}

export default function CreateCampaignPage() {
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const hasTrackedFormStart = useRef(false);
  const router = useRouter();

  useEffect(() => {
    if (!hasTrackedFormStart.current) {
      hasTrackedFormStart.current = true;
      trackEvent("campaign_form_started");
    }

    queueMicrotask(() => {
      const savedForm = parseSavedForm(
        localStorage.getItem(campaignFormStorageKey),
      );

      if (savedForm) {
        setForm(savedForm);
      }
    });
  }, []);

  function updateField(field: keyof CampaignFormData, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError("");
    setIsSubmitting(true);
    const safeCampaignContext = getSafeCampaignAnalyticsContext(
      form.mainChannel,
      form.experienceLevel,
    );
    let errorCategory: AnalyticsErrorCategory = "unknown";

    trackEvent("campaign_form_submitted", safeCampaignContext);

    try {
      let response: Response;

      try {
        response = await fetch("/api/generate-campaign", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        });
      } catch {
        errorCategory = "network";
        throw new Error("Falha de rede.");
      }

      const result = (await response.json()) as CampaignGenerationResponse;

      if (!response.ok || !result.success || !result.data || !result.source) {
        errorCategory =
          response.status === 429
            ? "rate_limited"
            : response.status >= 500
              ? "provider"
              : "validation";
        throw new Error(result.error ?? "Erro ao gerar plano.");
      }

      const effectiveProvider =
        result.provider ?? (result.source === "ai" ? "openai" : "mock");

      errorCategory = "storage";
      localStorage.setItem(campaignFormStorageKey, JSON.stringify(form));
      localStorage.setItem(campaignPlanStorageKey, JSON.stringify(result.data));
      localStorage.setItem(campaignPlanSourceStorageKey, result.source);
      localStorage.setItem(campaignPlanProviderStorageKey, effectiveProvider);
      addCampaignPlanToHistory(localStorage, {
        formData: form,
        planResult: result.data,
        source: result.source,
        provider: effectiveProvider,
      });
      trackEvent("campaign_plan_generated", {
        ...safeCampaignContext,
        source: result.source,
        provider: effectiveProvider,
        resultStatus: "success",
      });
      router.push("/resultado");
    } catch {
      trackEvent("campaign_plan_generation_failed", {
        ...safeCampaignContext,
        resultStatus: "failure",
        errorCategory,
      });
      setSubmitError(
        "Não foi possível gerar o plano agora. Confira sua conexão e tente novamente.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f8f5]">
      <Header />
      <section className="mx-auto max-w-4xl px-5 py-10">
        <div className="mb-8 rounded-xl border border-stone-200 bg-white p-5 shadow-sm md:p-7">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-800">
            Criar campanha
          </p>
          <h1 className="mt-3 max-w-3xl text-3xl font-bold leading-tight text-stone-950 md:text-4xl">
            Conte o básico e receba um plano inicial
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-700">
            Responda com palavras simples. Use estimativas quando não tiver
            certeza; a ideia é organizar um primeiro roteiro para revisar antes
            de anunciar.
          </p>
          <div className="mt-5 grid gap-3 text-sm text-stone-700 md:grid-cols-3">
            <div className="rounded-lg bg-emerald-50 p-4">
              Leva poucos minutos
            </div>
            <div className="rounded-lg bg-stone-100 p-4">
              Não conecta conta de anúncios
            </div>
            <div className="rounded-lg bg-amber-50 p-4">
              Gera orientação inicial
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-5">
          <FormSection
            number="1"
            title="Sobre o negócio"
            description="Comece com o nome e o tipo de negócio para o plano falar da sua realidade."
          >
            <Input
              label="Nome do negócio"
              name="businessName"
              helpText="Use o nome que seus clientes já conhecem."
              value={form.businessName}
              onChange={(event) =>
                updateField("businessName", event.target.value)
              }
              required
            />
            <Input
              label="Tipo de negócio"
              name="businessType"
              placeholder="Ex: pizzaria, salão de beleza, clínica, oficina"
              helpText="Escreva o segmento de forma direta, sem termos técnicos."
              value={form.businessType}
              onChange={(event) =>
                updateField("businessType", event.target.value)
              }
              required
            />
          </FormSection>

          <FormSection
            number="2"
            title="Oferta da campanha"
            description="Escolha uma oferta principal para deixar a mensagem mais clara."
          >
            <Input
              label="Produto ou serviço anunciado"
              name="offer"
              placeholder="Ex: almoço executivo, limpeza de sofá, consulta inicial"
              helpText="Evite colocar tudo que vende. Comece por uma oferta específica."
              value={form.offer}
              onChange={(event) => updateField("offer", event.target.value)}
              required
            />
            <Textarea
              label="Diferencial da empresa"
              name="differentiator"
              value={form.differentiator}
              onChange={(event) =>
                updateField("differentiator", event.target.value)
              }
              placeholder="Ex: entrega rápida, atendimento humanizado, preço acessível"
              helpText="Conte por que alguém deveria escolher você em vez de outra opção."
              required
            />
          </FormSection>

          <FormSection
            number="3"
            title="Público e região"
            description="Diga onde você atende e quem costuma ter mais interesse na oferta."
          >
            <Input
              label="Cidade ou região atendida"
              name="region"
              placeholder="Ex: Curitiba e região metropolitana"
              helpText="Pode ser uma cidade, bairro, região ou área de entrega."
              value={form.region}
              onChange={(event) => updateField("region", event.target.value)}
              required
            />
            <Textarea
              label="Quem você quer alcançar"
              name="audience"
              value={form.audience}
              onChange={(event) => updateField("audience", event.target.value)}
              placeholder="Ex: moradores próximos, famílias com crianças, pequenos empresários"
              helpText="Pense em quem compra, onde vive e qual problema quer resolver."
              required
            />
          </FormSection>

          <FormSection
            number="4"
            title="Configuração inicial"
            description="Escolha o objetivo, o canal e uma verba que caiba no caixa por alguns dias."
          >
            <Select
              label="O que você quer conseguir primeiro?"
              name="goal"
              value={form.goal}
              onChange={(event) => updateField("goal", event.target.value)}
              placeholder="Escolha o primeiro objetivo"
              helpText="Pense no próximo passo que você quer que a pessoa tome."
              options={[
                "Receber mensagens no WhatsApp",
                "Levar pessoas para o Instagram",
                "Levar pessoas para o site",
                "Atrair visitas para a loja física",
                "Divulgar uma oferta local",
              ]}
              required
            />
            <Select
              label="Canal principal para receber interessados"
              name="mainChannel"
              value={form.mainChannel}
              onChange={(event) =>
                updateField("mainChannel", event.target.value)
              }
              placeholder="Escolha o canal principal"
              helpText="Escolha o canal em que você consegue responder melhor."
              options={["WhatsApp", "Instagram", "Site", "Loja física"]}
              required
            />
            <Input
              label="Orçamento diário aproximado"
              name="dailyBudget"
              placeholder="Ex: R$ 20 por dia"
              helpText="Use um valor que possa manter por alguns dias para observar os sinais."
              value={form.dailyBudget}
              onChange={(event) =>
                updateField("dailyBudget", event.target.value)
              }
              required
            />
            <Select
              label="Sua experiência com anúncios"
              name="experienceLevel"
              value={form.experienceLevel}
              onChange={(event) =>
                updateField("experienceLevel", event.target.value)
              }
              placeholder="Escolha o nível mais próximo"
              helpText="Isso ajuda o plano a usar uma orientação mais adequada."
              options={[
                "Nunca anunciei",
                "Já tentei algumas vezes",
                "Anuncio com frequência",
              ]}
              required
            />
          </FormSection>

          <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm md:p-6">
            <p className="mb-4 max-w-2xl text-sm leading-6 text-stone-600">
              O plano gerado é uma orientação inicial com base nas suas
              respostas. Se a IA não estiver configurada, o sistema usa um
              fallback simulado para manter o fluxo funcionando.
            </p>
            {submitError ? (
              <p className="mb-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-950">
                {submitError}
              </p>
            ) : null}
            <Button
              type="submit"
              className="w-full sm:w-auto"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Gerando plano..." : "Gerar plano inicial"}
            </Button>
          </div>
        </form>
      </section>
    </main>
  );
}
