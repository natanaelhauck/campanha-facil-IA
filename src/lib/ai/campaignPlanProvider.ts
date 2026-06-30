import { isCurrentCampaignPlanResult } from "@/lib/campaignPlanValidation";
import type {
  CampaignAIProvider,
  CampaignFallbackReason,
  CampaignPlanResult,
} from "@/types/campaign";

export type LiveAIProvider = Exclude<CampaignAIProvider, "mock">;

export type ProviderGenerationResult =
  | {
      ok: true;
      data: CampaignPlanResult;
      provider: LiveAIProvider;
      model: string;
      responseStatus?: string;
    }
  | {
      ok: false;
      provider: LiveAIProvider;
      model: string;
      fallbackReason: CampaignFallbackReason;
      warning: string;
      apiStatus?: number;
      apiCode?: string;
      responseStatus?: string;
      incompleteReason?: string;
    };

export type PlanParseResult =
  | {
      ok: true;
      data: CampaignPlanResult;
    }
  | {
      ok: false;
      reason: "invalid_json" | "validation_failed";
    };

export const defaultOpenAIModel = "gpt-4.1-mini";
export const defaultGeminiModel = "gemini-2.5-flash";

export function getProviderModel(provider: CampaignAIProvider) {
  if (provider === "openai") {
    return process.env.OPENAI_MODEL?.trim() || defaultOpenAIModel;
  }

  if (provider === "gemini") {
    return process.env.GEMINI_MODEL?.trim() || defaultGeminiModel;
  }

  return "local-mock";
}

export function parseCampaignPlanJson(value: string): PlanParseResult {
  let parsed: unknown;

  try {
    parsed = JSON.parse(value) as unknown;
  } catch {
    return {
      ok: false,
      reason: "invalid_json",
    };
  }

  if (!isCurrentCampaignPlanResult(parsed)) {
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
