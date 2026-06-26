import OpenAI from "openai";
import { createMockCampaignPlan } from "@/data/mockCampaignResult";
import { isCampaignPlanResult } from "@/lib/campaignPlanValidation";
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

const defaultOpenAIModel = "gpt-4.1-mini";
const defaultMaxOutputTokens = 1800;
const minMaxOutputTokens = 800;
const maxMaxOutputTokens = 4000;

function isGenerationEnabled() {
  return process.env.AI_GENERATION_ENABLED !== "false";
}

function safeParsePlan(value: string): CampaignPlanResult | null {
  try {
    const parsed = JSON.parse(value) as unknown;
    return isCampaignPlanResult(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function getOpenAIModel() {
  return process.env.OPENAI_MODEL?.trim() || defaultOpenAIModel;
}

function getMaxOutputTokens() {
  const rawValue = Number.parseInt(
    process.env.OPENAI_MAX_OUTPUT_TOKENS ?? "",
    10,
  );

  if (!Number.isFinite(rawValue)) {
    return defaultMaxOutputTokens;
  }

  return Math.min(Math.max(rawValue, minMaxOutputTokens), maxMaxOutputTokens);
}

function extractOutputText(response: unknown) {
  if (!response || typeof response !== "object") {
    return "";
  }

  const outputText = (response as { output_text?: unknown }).output_text;

  if (typeof outputText === "string" && outputText.trim()) {
    return outputText;
  }

  const output = (response as { output?: unknown }).output;

  if (!Array.isArray(output)) {
    return "";
  }

  return output
    .flatMap((item) => {
      if (!item || typeof item !== "object") {
        return [];
      }

      const content = (item as { content?: unknown }).content;

      if (!Array.isArray(content)) {
        return [];
      }

      return content
        .map((contentItem) => {
          if (!contentItem || typeof contentItem !== "object") {
            return "";
          }

          const text = (contentItem as { text?: unknown }).text;
          return typeof text === "string" ? text : "";
        })
        .filter(Boolean);
    })
    .join("");
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
      model: getOpenAIModel(),
      instructions:
        "Você gera planos iniciais de campanha seguros e práticos para pequenos negócios brasileiros. Nunca prometa resultado garantido.",
      input: buildCampaignPrompt(form),
      max_output_tokens: getMaxOutputTokens(),
      text: {
        format: campaignPlanResponseFormat,
        verbosity: "medium",
      },
      store: false,
    });

    const plan = safeParsePlan(extractOutputText(response));

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
