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
};

export type CampaignGenerationResponse = {
  success: boolean;
  data?: CampaignPlanResult;
  source?: CampaignPlanSource;
  warning?: string;
  error?: string;
};

export type CampaignResult = CampaignPlanResult;
