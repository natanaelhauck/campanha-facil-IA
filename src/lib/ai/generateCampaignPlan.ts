import OpenAI from "openai";
import { createMockCampaignPlan } from "@/data/mockCampaignResult";
import { isCampaignPlanResult } from "@/lib/campaignPlanValidation";
import type {
  CampaignFallbackReason,
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
  debug: GenerationDebug;
};

type GenerationDebug = {
  fallbackReason?: CampaignFallbackReason;
  model: string;
  generationEnabled: boolean;
  apiStatus?: number;
  apiCode?: string;
  responseStatus?: string;
  incompleteReason?: string;
};

const defaultOpenAIModel = "gpt-4.1-mini";
const defaultMaxOutputTokens = 1800;
const minMaxOutputTokens = 800;
const maxMaxOutputTokens = 4000;

function isGenerationEnabled() {
  return process.env.AI_GENERATION_ENABLED !== "false";
}

type PlanParseResult =
  | {
      ok: true;
      data: CampaignPlanResult;
    }
  | {
      ok: false;
      reason: "invalid_json" | "validation_failed";
    };

function safeParsePlan(value: string): PlanParseResult {
  let parsed: unknown;

  try {
    parsed = JSON.parse(value) as unknown;
  } catch {
    return {
      ok: false,
      reason: "invalid_json",
    };
  }

  if (!isCampaignPlanResult(parsed)) {
    return {
      ok: false,
      reason: "validation_failed",
    };
  }

  return {
    ok: true,
    data: parsed,
  };
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

function hasRefusal(response: unknown) {
  if (!response || typeof response !== "object") {
    return false;
  }

  const output = (response as { output?: unknown }).output;

  if (!Array.isArray(output)) {
    return false;
  }

  return output.some((item) => {
    if (!item || typeof item !== "object") {
      return false;
    }

    const content = (item as { content?: unknown }).content;

    return (
      Array.isArray(content) &&
      content.some(
        (contentItem) =>
          Boolean(contentItem) &&
          typeof contentItem === "object" &&
          (contentItem as { type?: unknown }).type === "refusal",
      )
    );
  });
}

function logGeneration(debug: GenerationDebug, source: CampaignPlanSource) {
  if (process.env.NODE_ENV !== "development") {
    return;
  }

  console.info("[campaign-ai]", {
    source,
    ...debug,
  });
}

function fallbackMock(
  form: CampaignFormData,
  warning: string,
  debug: GenerationDebug,
): GenerateCampaignPlanResponse {
  logGeneration(debug, "mock");

  return {
    data: createMockCampaignPlan(form),
    source: "mock",
    warning,
    debug,
  };
}

export async function generateCampaignPlan(
  form: CampaignFormData,
): Promise<GenerateCampaignPlanResponse> {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = getOpenAIModel();
  const generationEnabled = isGenerationEnabled();
  const baseDebug = {
    model,
    generationEnabled,
  };

  if (!apiKey) {
    return fallbackMock(
      form,
      "OPENAI_API_KEY ausente. Usando plano simulado local.",
      {
        ...baseDebug,
        fallbackReason: "missing_key",
      },
    );
  }

  if (!generationEnabled) {
    return fallbackMock(
      form,
      "Geração por IA desabilitada. Usando plano simulado local.",
      {
        ...baseDebug,
        fallbackReason: "disabled",
      },
    );
  }

  try {
    if (process.env.NODE_ENV === "development") {
      console.info("[campaign-ai]", {
        event: "request_started",
        hasApiKey: true,
        model,
        generationEnabled,
      });
    }

    const client = new OpenAI({
      apiKey,
      maxRetries: 0,
    });
    const response = await client.responses.create({
      model,
      instructions:
        "Você gera planos iniciais de campanha seguros e práticos para pequenos negócios brasileiros. Nunca prometa resultado garantido.",
      input: buildCampaignPrompt(form),
      max_output_tokens: getMaxOutputTokens(),
      text: {
        format: campaignPlanResponseFormat,
      },
      store: false,
    });

    if (response.status !== "completed") {
      return fallbackMock(
        form,
        "A IA não concluiu o plano. Usando plano simulado local.",
        {
          ...baseDebug,
          fallbackReason: "incomplete_response",
          responseStatus: response.status,
          incompleteReason: response.incomplete_details?.reason,
        },
      );
    }

    if (hasRefusal(response)) {
      return fallbackMock(
        form,
        "A IA não pôde gerar este plano. Usando plano simulado local.",
        {
          ...baseDebug,
          fallbackReason: "refusal",
          responseStatus: response.status,
        },
      );
    }

    const outputText = extractOutputText(response);

    if (!outputText.trim()) {
      return fallbackMock(
        form,
        "A IA retornou uma resposta vazia. Usando plano simulado local.",
        {
          ...baseDebug,
          fallbackReason: "empty_response",
          responseStatus: response.status,
        },
      );
    }

    const parsedPlan = safeParsePlan(outputText);

    if (!parsedPlan.ok) {
      return fallbackMock(
        form,
        "A IA retornou um formato inesperado. Usando plano simulado local.",
        {
          ...baseDebug,
          fallbackReason: parsedPlan.reason,
          responseStatus: response.status,
        },
      );
    }

    const debug = {
      ...baseDebug,
      responseStatus: response.status,
    };
    logGeneration(debug, "ai");

    return {
      data: parsedPlan.data,
      source: "ai",
      debug,
    };
  } catch (error) {
    const fallbackReason: CampaignFallbackReason =
      error instanceof OpenAI.APIError &&
      error.status === 429 &&
      error.code === "insufficient_quota"
        ? "quota_exceeded"
        : "api_error";
    const apiError =
      error instanceof OpenAI.APIError
        ? {
            apiStatus: error.status,
            apiCode: error.code ?? error.type,
          }
        : {};

    return fallbackMock(
      form,
      "Não foi possível gerar o plano com IA agora. Usando plano simulado local.",
      {
        ...baseDebug,
        fallbackReason,
        ...apiError,
      },
    );
  }
}
