import { createMockCampaignPlan } from "@/data/mockCampaignResult";
import type {
  CampaignAIProvider,
  CampaignFallbackReason,
  CampaignFormData,
  CampaignPlanResult,
  CampaignPlanSource,
} from "@/types/campaign";
import {
  getProviderModel,
  type ProviderGenerationResult,
} from "./campaignPlanProvider";
import { generateCampaignPlanWithGemini } from "./generateCampaignPlanWithGemini";
import { generateCampaignPlanWithOpenAI } from "./generateCampaignPlanWithOpenAI";

type GenerationDebug = {
  provider: CampaignAIProvider;
  fallbackReason?: CampaignFallbackReason;
  model: string;
  generationEnabled: boolean;
  apiStatus?: number;
  apiCode?: string;
  responseStatus?: string;
  incompleteReason?: string;
};

type GenerateCampaignPlanResponse = {
  data: CampaignPlanResult;
  source: CampaignPlanSource;
  provider: CampaignAIProvider;
  warning?: string;
  debug: GenerationDebug;
};

type ProviderSelection = {
  provider: CampaignAIProvider;
  invalid: boolean;
};

function getProviderSelection(): ProviderSelection {
  const configuredProvider = process.env.AI_PROVIDER?.trim().toLowerCase();

  if (!configuredProvider) {
    return {
      provider: "mock",
      invalid: false,
    };
  }

  if (
    configuredProvider === "mock" ||
    configuredProvider === "openai" ||
    configuredProvider === "gemini"
  ) {
    return {
      provider: configuredProvider,
      invalid: false,
    };
  }

  return {
    provider: "mock",
    invalid: true,
  };
}

function isGenerationEnabled() {
  return process.env.AI_GENERATION_ENABLED !== "false";
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
  debug: GenerationDebug,
  warning?: string,
): GenerateCampaignPlanResponse {
  logGeneration(debug, "mock");

  return {
    data: createMockCampaignPlan(form),
    source: "mock",
    provider: "mock",
    warning,
    debug,
  };
}

function providerResultToDebug(
  result: ProviderGenerationResult,
  generationEnabled: boolean,
): GenerationDebug {
  if (result.ok) {
    return {
      provider: result.provider,
      model: result.model,
      generationEnabled,
      responseStatus: result.responseStatus,
    };
  }

  return {
    provider: result.provider,
    model: result.model,
    generationEnabled,
    fallbackReason: result.fallbackReason,
    apiStatus: result.apiStatus,
    apiCode: result.apiCode,
    responseStatus: result.responseStatus,
    incompleteReason: result.incompleteReason,
  };
}

async function generateWithProvider(
  provider: Exclude<CampaignAIProvider, "mock">,
  form: CampaignFormData,
) {
  return provider === "openai"
    ? generateCampaignPlanWithOpenAI(form)
    : generateCampaignPlanWithGemini(form);
}

export async function generateCampaignPlan(
  form: CampaignFormData,
): Promise<GenerateCampaignPlanResponse> {
  const selection = getProviderSelection();
  const generationEnabled = isGenerationEnabled();
  const model = getProviderModel(selection.provider);

  if (selection.invalid) {
    return fallbackMock(
      form,
      {
        provider: "mock",
        model,
        generationEnabled,
        fallbackReason: "invalid_provider",
      },
      "Provedor de IA inválido. Usando plano simulado local.",
    );
  }

  if (selection.provider === "mock") {
    return fallbackMock(form, {
      provider: "mock",
      model,
      generationEnabled,
    });
  }

  if (!generationEnabled) {
    return fallbackMock(
      form,
      {
        provider: selection.provider,
        model,
        generationEnabled,
        fallbackReason: "disabled",
      },
      "Geração por IA desabilitada. Usando plano simulado local.",
    );
  }

  const result = await generateWithProvider(selection.provider, form);
  const debug = providerResultToDebug(result, generationEnabled);

  if (!result.ok) {
    return fallbackMock(form, debug, result.warning);
  }

  logGeneration(debug, "ai");

  return {
    data: result.data,
    source: "ai",
    provider: result.provider,
    debug,
  };
}
