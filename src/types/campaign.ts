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

export type CampaignResult = {
  recommendedObjective: string;
  suggestedAudience: string;
  initialBudget: string;
  adTexts: string[];
  creativeIdeas: string[];
  setupSteps: string[];
  prePublishChecklist: string[];
  followUpPlan: {
    period: string;
    actions: string[];
  }[];
};
