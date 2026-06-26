import OpenAI from "openai";
import { createMockCampaignPlan } from "@/data/mockCampaignResult";
import type {
  CampaignFormData,
  CampaignPlanResult,
  CampaignPlanSource,
} from "@/types/campaign";
import { buildCampaignPrompt } from "./buildCampaignPrompt";
import { campaignPlanResponseFormat } from "./campaignPlanSchema";

type GenerateCampaignPlanResponse = {
  data: CampaignPlanResult;
  source: CampaignPlanSource;
  warning?: string;
};

type UnknownRecord = Record<string, unknown>;

function isGenerationEnabled() {
  return process.env.AI_GENERATION_ENABLED !== "false";
}

function isRecord(value: unknown): value is UnknownRecord {
  return Boolean(value) && typeof value === "object";
}

function isStringArray(value: unknown, minItems = 1) {
  return (
    Array.isArray(value) &&
    value.length >= minItems &&
    value.every((item) => typeof item === "string" && item.trim().length > 0)
  );
}

function isAdTextArray(value: unknown) {
  return (
    Array.isArray(value) &&
    value.length === 3 &&
    value.every(
      (item) =>
        isRecord(item) &&
        typeof item.title === "string" &&
        typeof item.text === "string",
    )
  );
}

function isNextStepArray(value: unknown) {
  return (
    Array.isArray(value) &&
    value.length >= 3 &&
    value.length <= 5 &&
    value.every(
      (item) =>
        isRecord(item) &&
        typeof item.title === "string" &&
        typeof item.description === "string",
    )
  );
}

function isFollowUpPlan(value: unknown) {
  const allowedPeriods = new Set(["3 dias", "7 dias", "14 dias"]);

  return (
    Array.isArray(value) &&
    value.length === 3 &&
    value.every(
      (item) =>
        isRecord(item) &&
        typeof item.period === "string" &&
        allowedPeriods.has(item.period) &&
        isStringArray(item.actions, 2),
    )
  );
}

function isCampaignPlan(value: unknown): value is CampaignPlanResult {
  return (
    isRecord(value) &&
    typeof value.summary === "string" &&
    typeof value.recommendedObjective === "string" &&
    typeof value.suggestedAudience === "string" &&
    typeof value.budgetGuidance === "string" &&
    isAdTextArray(value.adTexts) &&
    isStringArray(value.creativeIdeas, 3) &&
    isStringArray(value.setupSteps, 4) &&
    isStringArray(value.prePublishChecklist, 5) &&
    isFollowUpPlan(value.followUpPlan) &&
    isNextStepArray(value.nextSteps) &&
    typeof value.disclaimer === "string"
  );
}

function safeParsePlan(value: string): CampaignPlanResult | null {
  try {
    const parsed = JSON.parse(value) as unknown;
    return isCampaignPlan(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function fallbackMock(
  form: CampaignFormData,
  warning: string,
): GenerateCampaignPlanResponse {
  return {
    data: createMockCampaignPlan(form),
    source: "mock",
    warning,
  };
}

export async function generateCampaignPlan(
  form: CampaignFormData,
): Promise<GenerateCampaignPlanResponse> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return fallbackMock(
      form,
      "OPENAI_API_KEY ausente. Usando plano simulado local.",
    );
  }

  if (!isGenerationEnabled()) {
    return fallbackMock(
      form,
      "Geração por IA desabilitada. Usando plano simulado local.",
    );
  }

  try {
    const client = new OpenAI({ apiKey });
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5.5",
      instructions:
        "Você gera planos iniciais de campanha seguros e práticos para pequenos negócios brasileiros. Nunca prometa resultado garantido.",
      input: buildCampaignPrompt(form),
      text: {
        format: campaignPlanResponseFormat,
        verbosity: "medium",
      },
      store: false,
    });

    const plan = safeParsePlan(response.output_text);

    if (!plan) {
      return fallbackMock(
        form,
        "A IA retornou um formato inesperado. Usando plano simulado local.",
      );
    }

    return {
      data: plan,
      source: "ai",
    };
  } catch {
    return fallbackMock(
      form,
      "Não foi possível gerar o plano com IA agora. Usando plano simulado local.",
    );
  }
}
