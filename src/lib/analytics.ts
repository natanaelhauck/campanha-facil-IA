import type {
  CampaignAIProvider,
  CampaignPlanSource,
} from "@/types/campaign";

const analyticsEventNames = [
  "campaign_form_started",
  "campaign_form_submitted",
  "campaign_plan_generated",
  "campaign_plan_generation_failed",
  "campaign_plan_copied",
  "creative_briefing_copied",
  "action_plan_copied",
  "campaign_pdf_downloaded",
  "campaign_history_opened",
  "campaign_history_item_opened",
  "campaign_history_item_deleted",
  "campaign_adjust_clicked",
  "beta_page_viewed",
  "feedback_clicked",
  "help_clicked",
] as const;

export type AnalyticsEventName = (typeof analyticsEventNames)[number];
export type AnalyticsErrorCategory =
  | "network"
  | "validation"
  | "rate_limited"
  | "provider"
  | "storage"
  | "unknown";

type AnalyticsChannel =
  | "whatsapp"
  | "instagram"
  | "site"
  | "physical_store"
  | "unknown";

type AnalyticsExperienceLevel =
  | "never"
  | "tried"
  | "frequent"
  | "unknown";

type AnalyticsCommunicationTone =
  | "simple"
  | "professional"
  | "fun"
  | "premium"
  | "warm"
  | "unknown";

type AnalyticsVisualAssets = "yes" | "no" | "partial" | "unknown";

type AnalyticsProperties = {
  source?: CampaignPlanSource;
  provider?: CampaignAIProvider;
  channel?: AnalyticsChannel;
  experienceLevel?: AnalyticsExperienceLevel;
  communicationTone?: AnalyticsCommunicationTone;
  hasVisualAssets?: AnalyticsVisualAssets;
  hasHistoryItem?: boolean;
  resultStatus?: "success" | "failure";
  errorCategory?: AnalyticsErrorCategory;
};

const eventNameSet = new Set<string>(analyticsEventNames);

function normalizeChannel(value: string): AnalyticsChannel {
  const channels: Record<string, AnalyticsChannel> = {
    WhatsApp: "whatsapp",
    Instagram: "instagram",
    Site: "site",
    "Loja física": "physical_store",
  };

  return channels[value] ?? "unknown";
}

function normalizeExperienceLevel(
  value: string,
): AnalyticsExperienceLevel {
  const levels: Record<string, AnalyticsExperienceLevel> = {
    "Nunca anunciei": "never",
    "Já tentei algumas vezes": "tried",
    "Anuncio com frequência": "frequent",
  };

  return levels[value] ?? "unknown";
}

function normalizeCommunicationTone(
  value: string | undefined,
): AnalyticsCommunicationTone {
  const tones: Record<string, AnalyticsCommunicationTone> = {
    "Simples e direto": "simple",
    "Profissional": "professional",
    "Divertido": "fun",
    "Premium": "premium",
    "Acolhedor": "warm",
  };

  return value ? (tones[value] ?? "unknown") : "unknown";
}

function normalizeVisualAssets(
  value: string | undefined,
): AnalyticsVisualAssets {
  const assetStatus: Record<string, AnalyticsVisualAssets> = {
    "Sim, tenho fotos ou vídeos": "yes",
    "Tenho pouco material": "partial",
    "Ainda não tenho": "no",
  };

  return value ? (assetStatus[value] ?? "unknown") : "unknown";
}

export function getSafeCampaignAnalyticsContext(
  channel: string,
  experienceLevel: string,
  communicationTone?: string,
  hasVisualAssets?: string,
) {
  return {
    channel: normalizeChannel(channel),
    experienceLevel: normalizeExperienceLevel(experienceLevel),
    communicationTone: normalizeCommunicationTone(communicationTone),
    hasVisualAssets: normalizeVisualAssets(hasVisualAssets),
  } satisfies AnalyticsProperties;
}

function sanitizeProperties(properties: AnalyticsProperties) {
  const safeProperties: Record<string, string | boolean> = {};

  if (properties.source === "ai" || properties.source === "mock") {
    safeProperties.source = properties.source;
  }

  if (
    properties.provider === "mock" ||
    properties.provider === "openai" ||
    properties.provider === "gemini"
  ) {
    safeProperties.provider = properties.provider;
  }

  if (
    properties.channel === "whatsapp" ||
    properties.channel === "instagram" ||
    properties.channel === "site" ||
    properties.channel === "physical_store" ||
    properties.channel === "unknown"
  ) {
    safeProperties.channel = properties.channel;
  }

  if (
    properties.experienceLevel === "never" ||
    properties.experienceLevel === "tried" ||
    properties.experienceLevel === "frequent" ||
    properties.experienceLevel === "unknown"
  ) {
    safeProperties.experienceLevel = properties.experienceLevel;
  }

  if (
    properties.communicationTone === "simple" ||
    properties.communicationTone === "professional" ||
    properties.communicationTone === "fun" ||
    properties.communicationTone === "premium" ||
    properties.communicationTone === "warm" ||
    properties.communicationTone === "unknown"
  ) {
    safeProperties.communicationTone = properties.communicationTone;
  }

  if (
    properties.hasVisualAssets === "yes" ||
    properties.hasVisualAssets === "no" ||
    properties.hasVisualAssets === "partial" ||
    properties.hasVisualAssets === "unknown"
  ) {
    safeProperties.hasVisualAssets = properties.hasVisualAssets;
  }

  if (typeof properties.hasHistoryItem === "boolean") {
    safeProperties.hasHistoryItem = properties.hasHistoryItem;
  }

  if (
    properties.resultStatus === "success" ||
    properties.resultStatus === "failure"
  ) {
    safeProperties.resultStatus = properties.resultStatus;
  }

  if (
    properties.errorCategory === "network" ||
    properties.errorCategory === "validation" ||
    properties.errorCategory === "rate_limited" ||
    properties.errorCategory === "provider" ||
    properties.errorCategory === "storage" ||
    properties.errorCategory === "unknown"
  ) {
    safeProperties.errorCategory = properties.errorCategory;
  }

  return safeProperties;
}

export function trackEvent(
  eventName: AnalyticsEventName,
  properties: AnalyticsProperties = {},
) {
  if (
    process.env.NODE_ENV !== "development" ||
    !eventNameSet.has(eventName)
  ) {
    return;
  }

  console.info("[analytics]", {
    event: eventName,
    properties: sanitizeProperties(properties),
  });
}
