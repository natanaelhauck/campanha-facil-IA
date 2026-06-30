import { ApiError, GoogleGenAI } from "@google/genai";
import type { CampaignFallbackReason, CampaignFormData } from "@/types/campaign";
import { buildCampaignPrompt } from "./buildCampaignPrompt";
import {
  getProviderModel,
  parseCampaignPlanJson,
  type ProviderGenerationResult,
} from "./campaignPlanProvider";
import { campaignPlanSchema } from "./campaignPlanSchema";

const maxOutputTokens = 1800;
const refusalReasons = new Set([
  "SAFETY",
  "RECITATION",
  "BLOCKLIST",
  "PROHIBITED_CONTENT",
  "SPII",
  "IMAGE_SAFETY",
]);

function getThinkingConfig(model: string) {
  return model.startsWith("gemini-2.5-flash")
    ? {
        thinkingBudget: 0,
      }
    : undefined;
}

export async function generateCampaignPlanWithGemini(
  form: CampaignFormData,
): Promise<ProviderGenerationResult> {
  const provider = "gemini";
  const model = getProviderModel(provider);
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return {
      ok: false,
      provider,
      model,
      fallbackReason: "missing_key",
      warning: "GEMINI_API_KEY ausente. Usando plano simulado local.",
    };
  }

  try {
    const client = new GoogleGenAI({ apiKey });
    const response = await client.models.generateContent({
      model,
      contents: buildCampaignPrompt(form),
      config: {
        systemInstruction:
          "Você gera planos iniciais de campanha seguros e práticos para pequenos negócios brasileiros. Nunca prometa resultado garantido.",
        responseMimeType: "application/json",
        responseJsonSchema: campaignPlanSchema,
        maxOutputTokens,
        temperature: 0.4,
        thinkingConfig: getThinkingConfig(model),
      },
    });

    const finishReason = response.candidates?.[0]?.finishReason;
    const promptBlockReason = response.promptFeedback?.blockReason;

    if (finishReason === "MAX_TOKENS") {
      return {
        ok: false,
        provider,
        model,
        fallbackReason: "incomplete_response",
        warning: "A IA não concluiu o plano. Usando plano simulado local.",
        responseStatus: finishReason,
        incompleteReason: "max_output_tokens",
      };
    }

    if (
      promptBlockReason ||
      (finishReason && refusalReasons.has(finishReason))
    ) {
      return {
        ok: false,
        provider,
        model,
        fallbackReason: "refusal",
        warning:
          "A IA não pôde gerar este plano. Usando plano simulado local.",
        responseStatus: promptBlockReason ?? finishReason,
      };
    }

    const outputText = response.text;

    if (!outputText?.trim()) {
      return {
        ok: false,
        provider,
        model,
        fallbackReason: "empty_response",
        warning:
          "A IA retornou uma resposta vazia. Usando plano simulado local.",
        responseStatus: finishReason,
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
        responseStatus: finishReason,
      };
    }

    return {
      ok: true,
      data: parsedPlan.data,
      provider,
      model,
      responseStatus: finishReason,
    };
  } catch (error) {
    const fallbackReason: CampaignFallbackReason =
      error instanceof ApiError && error.status === 429
        ? "quota_exceeded"
        : error instanceof ApiError &&
            (error.status === 401 || error.status === 403)
          ? "authentication_error"
          : error instanceof ApiError && error.status === 404
            ? "model_not_available"
            : "api_error";

    return {
      ok: false,
      provider,
      model,
      fallbackReason,
      warning:
        "Não foi possível gerar o plano com Gemini agora. Usando plano simulado local.",
      ...(error instanceof ApiError ? { apiStatus: error.status } : {}),
    };
  }
}
