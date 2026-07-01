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
const defaultRequestTimeoutMs = 30_000;
const minRequestTimeoutMs = 5_000;
const maxRequestTimeoutMs = 60_000;

export function getAIRequestTimeoutMs() {
  const configuredTimeout = Number.parseInt(
    process.env.AI_REQUEST_TIMEOUT_MS ?? "",
    10,
  );

  if (!Number.isFinite(configuredTimeout)) {
    return defaultRequestTimeoutMs;
  }

  return Math.min(
    Math.max(configuredTimeout, minRequestTimeoutMs),
    maxRequestTimeoutMs,
  );
}

export function isAIRequestTimeoutError(error: unknown) {
  if (!(error instanceof Error)) {
    return false;
  }

  return (
    error.name === "AbortError" ||
    error.name === "TimeoutError" ||
    /timed?\s*out|timeout/i.test(error.message)
  );
}

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
