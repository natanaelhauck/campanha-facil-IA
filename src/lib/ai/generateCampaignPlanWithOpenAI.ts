import OpenAI from "openai";
import type { CampaignFallbackReason, CampaignFormData } from "@/types/campaign";
import { buildCampaignPrompt } from "./buildCampaignPrompt";
import {
  getProviderModel,
  parseCampaignPlanJson,
  type ProviderGenerationResult,
} from "./campaignPlanProvider";
import { campaignPlanResponseFormat } from "./campaignPlanSchema";

const defaultMaxOutputTokens = 1800;
const minMaxOutputTokens = 800;
const maxMaxOutputTokens = 4000;

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

export async function generateCampaignPlanWithOpenAI(
  form: CampaignFormData,
): Promise<ProviderGenerationResult> {
  const provider = "openai";
  const model = getProviderModel(provider);
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return {
      ok: false,
      provider,
      model,
      fallbackReason: "missing_key",
      warning: "OPENAI_API_KEY ausente. Usando plano simulado local.",
    };
  }

  try {
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
      return {
        ok: false,
        provider,
        model,
        fallbackReason: "incomplete_response",
        warning: "A IA não concluiu o plano. Usando plano simulado local.",
        responseStatus: response.status,
        incompleteReason: response.incomplete_details?.reason,
      };
    }

    if (hasRefusal(response)) {
      return {
        ok: false,
        provider,
        model,
        fallbackReason: "refusal",
        warning:
          "A IA não pôde gerar este plano. Usando plano simulado local.",
        responseStatus: response.status,
      };
    }

    const outputText = extractOutputText(response);

    if (!outputText.trim()) {
      return {
        ok: false,
        provider,
        model,
        fallbackReason: "empty_response",
        warning:
          "A IA retornou uma resposta vazia. Usando plano simulado local.",
        responseStatus: response.status,
      };
    }

    const parsedPlan = parseCampaignPlanJson(outputText);

    if (!parsedPlan.ok) {
      return {
        ok: false,
        provider,
        model,
        fallbackReason: parsedPlan.reason,
        warning:
          "A IA retornou um formato inesperado. Usando plano simulado local.",
        responseStatus: response.status,
      };
    }

    return {
      ok: true,
      data: parsedPlan.data,
      provider,
      model,
      responseStatus: response.status,
    };
  } catch (error) {
    const fallbackReason: CampaignFallbackReason =
      error instanceof OpenAI.APIError &&
      error.status === 429 &&
      error.code === "insufficient_quota"
        ? "quota_exceeded"
        : error instanceof OpenAI.APIError && error.status === 401
          ? "authentication_error"
          : error instanceof OpenAI.APIError && error.status === 404
            ? "model_not_available"
            : "api_error";
    const apiError =
      error instanceof OpenAI.APIError
        ? {
            apiStatus: error.status,
            apiCode: error.code ?? error.type,
          }
        : {};

    return {
      ok: false,
      provider,
      model,
      fallbackReason,
      warning:
        "Não foi possível gerar o plano com OpenAI agora. Usando plano simulado local.",
      ...apiError,
    };
  }
}
