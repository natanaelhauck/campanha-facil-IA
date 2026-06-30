export type CampaignFormData = {
  businessName: string;
  businessType: string;
  region: string;
  offer: string;
  goal: string;
  dailyBudget: string;
  audience: string;
  differentiator: string;
  mainChannel: string;
  experienceLevel: string;
};

export type CampaignPlanSource = "ai" | "mock";

export type CampaignAIProvider = "mock" | "openai" | "gemini";

export type CampaignFallbackReason =
  | "missing_key"
  | "disabled"
  | "invalid_provider"
  | "quota_exceeded"
  | "authentication_error"
  | "model_not_available"
  | "api_error"
  | "incomplete_response"
  | "refusal"
  | "empty_response"
  | "invalid_json"
  | "validation_failed";

export type CampaignPlanText = {
  title: string;
  text: string;
};

export type CampaignPlanAction = {
  title: string;
  description: string;
};

export type CampaignFollowUpPeriod = {
  period: "3 dias" | "7 dias" | "14 dias";
  actions: string[];
};

export type CampaignSetupGuide = {
  objective: string;
  channel: string;
  initialBudget: string;
  location: string;
  audience: string;
  durationSuggestion: string;
  whatNotToChangeEarly: string;
};

export type CampaignCreative = {
  title: string;
  format: string;
  visualIdea: string;
  textOnCreative: string;
  caption: string;
  callToAction: string;
  aiImagePrompt: string;
  productionTip: string;
};

export type CampaignWhatsappScript = {
  firstReply: string;
  priceReply: string;
  objectionReply: string;
  closingReply: string;
  followUpReply: string;
};

export type CampaignSimpleMetricsGuide = {
  metricsToWatch: string[];
  goodSigns: string[];
  warningSigns: string[];
  whenToWait: string;
  whenToAdjust: string;
};

export type CampaignPlanResult = {
  summary: string;
  recommendedObjective: string;
  suggestedAudience: string;
  budgetGuidance: string;
  adTexts: CampaignPlanText[];
  creativeIdeas: string[];
  setupSteps: string[];
  prePublishChecklist: string[];
  followUpPlan: CampaignFollowUpPeriod[];
  nextSteps: CampaignPlanAction[];
  disclaimer: string;
  campaignSetupGuide?: CampaignSetupGuide;
  creativePack?: CampaignCreative[];
  whatsappScript?: CampaignWhatsappScript;
  simpleMetricsGuide?: CampaignSimpleMetricsGuide;
};

export type CampaignGenerationResponse = {
  success: boolean;
  data?: CampaignPlanResult;
  source?: CampaignPlanSource;
  provider?: CampaignAIProvider;
  warning?: string;
  error?: string;
  debug?: {
    provider: CampaignAIProvider;
    fallbackReason?: CampaignFallbackReason;
    model: string;
    generationEnabled: boolean;
    apiStatus?: number;
    apiCode?: string;
    responseStatus?: string;
    incompleteReason?: string;
  };
};

export type CampaignResult = CampaignPlanResult;
