import { isCampaignPlanResult } from "@/lib/campaignPlanValidation";
import type {
  CampaignAIProvider,
  CampaignFormData,
  CampaignPlanHistoryItem,
  CampaignPlanResult,
  CampaignPlanSource,
} from "@/types/campaign";

export const campaignFormStorageKey = "campaign-form-data";
export const campaignPlanStorageKey = "campaign-plan-result";
export const campaignPlanSourceStorageKey = "campaign-plan-source";
export const campaignPlanProviderStorageKey = "campaign-plan-provider";
export const campaignPlanHistoryStorageKey = "campaign-plan-history";
export const campaignPlanHistoryLimit = 10;

const formFields: Array<keyof CampaignFormData> = [
  "businessName",
  "businessType",
  "region",
  "offer",
  "goal",
  "dailyBudget",
  "audience",
  "differentiator",
  "mainChannel",
  "experienceLevel",
];

type AddCampaignPlanHistoryInput = {
  formData: CampaignFormData;
  planResult: CampaignPlanResult;
  source: CampaignPlanSource;
  provider: CampaignAIProvider;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isCampaignFormData(value: unknown): value is CampaignFormData {
  return (
    isRecord(value) &&
    formFields.every((field) => typeof value[field] === "string")
  );
}

function isPlanSource(value: unknown): value is CampaignPlanSource {
  return value === "ai" || value === "mock";
}

function isAIProvider(value: unknown): value is CampaignAIProvider {
  return value === "mock" || value === "openai" || value === "gemini";
}

function isHistoryItem(value: unknown): value is CampaignPlanHistoryItem {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    value.id.length > 0 &&
    value.id.length <= 100 &&
    typeof value.createdAt === "string" &&
    !Number.isNaN(Date.parse(value.createdAt)) &&
    typeof value.businessName === "string" &&
    value.businessName.length > 0 &&
    value.businessName.length <= 80 &&
    typeof value.objective === "string" &&
    value.objective.length <= 80 &&
    isPlanSource(value.source) &&
    isAIProvider(value.provider) &&
    isCampaignFormData(value.formData) &&
    isCampaignPlanResult(value.planResult)
  );
}

function createHistoryId() {
  return (
    globalThis.crypto?.randomUUID?.() ??
    `${Date.now()}-${Math.random().toString(36).slice(2)}`
  );
}

export function readCampaignPlanHistory(storage: Storage) {
  try {
    const value = storage.getItem(campaignPlanHistoryStorageKey);

    if (!value) {
      return [];
    }

    const parsed = JSON.parse(value) as unknown;

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .slice(0, 100)
      .filter(isHistoryItem)
      .slice(0, campaignPlanHistoryLimit);
  } catch {
    return [];
  }
}

export function addCampaignPlanToHistory(
  storage: Storage,
  input: AddCampaignPlanHistoryInput,
) {
  try {
    const historyItem: CampaignPlanHistoryItem = {
      id: createHistoryId(),
      createdAt: new Date().toISOString(),
      businessName: input.formData.businessName,
      objective: input.formData.goal,
      source: input.source,
      provider: input.provider,
      formData: input.formData,
      planResult: input.planResult,
    };
    const nextHistory = [
      historyItem,
      ...readCampaignPlanHistory(storage),
    ].slice(0, campaignPlanHistoryLimit);

    storage.setItem(
      campaignPlanHistoryStorageKey,
      JSON.stringify(nextHistory),
    );

    return historyItem;
  } catch {
    return null;
  }
}

export function removeCampaignPlanFromHistory(storage: Storage, id: string) {
  const currentHistory = readCampaignPlanHistory(storage);
  const nextHistory = currentHistory.filter((item) => item.id !== id);

  try {
    storage.setItem(
      campaignPlanHistoryStorageKey,
      JSON.stringify(nextHistory),
    );
    return nextHistory;
  } catch {
    return currentHistory;
  }
}

export function restoreCampaignPlanFromHistory(
  storage: Storage,
  item: CampaignPlanHistoryItem,
) {
  try {
    storage.setItem(
      campaignFormStorageKey,
      JSON.stringify(item.formData),
    );
    storage.setItem(
      campaignPlanStorageKey,
      JSON.stringify(item.planResult),
    );
    storage.setItem(campaignPlanSourceStorageKey, item.source);
    storage.setItem(campaignPlanProviderStorageKey, item.provider);

    return true;
  } catch {
    return false;
  }
}
