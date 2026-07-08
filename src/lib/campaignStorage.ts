import { isCampaignPlanResult } from "@/lib/campaignPlanValidation";
import {
  campaignPlanHistoryLimit,
  isAIProvider,
  isCampaignFormData,
  isPlanSource,
  readCampaignPlanHistory,
  removeCampaignPlanFromHistory,
} from "@/lib/campaignPlanHistory";
import { createOptionalSupabaseBrowserClient } from "@/lib/supabase/client";
import type {
  CampaignAIProvider,
  CampaignFormData,
  CampaignPlanHistoryItem,
  CampaignPlanResult,
  CampaignPlanSource,
} from "@/types/campaign";

export type CampaignStorageMode = "local" | "cloud";

export type CampaignHistoryLoadResult = {
  mode: CampaignStorageMode;
  items: CampaignPlanHistoryItem[];
  isCloudEnabled: boolean;
  isAuthenticated: boolean;
  userEmail?: string;
  error?: string;
};

export type CloudSaveResult =
  | { ok: true; id: string }
  | {
      ok: false;
      reason: "unavailable" | "not_authenticated" | "failed";
      message: string;
    };

type SaveCampaignInput = {
  formData: CampaignFormData;
  planResult: CampaignPlanResult;
  source: CampaignPlanSource;
  provider: CampaignAIProvider;
};

type CloudCampaignRow = {
  id: string;
  title: string | null;
  form_data: unknown;
  plan: unknown;
  source: unknown;
  provider: unknown;
  created_at: string | null;
};

function localHistoryResult(storage: Storage): CampaignHistoryLoadResult {
  return {
    mode: "local",
    items: readCampaignPlanHistory(storage),
    isCloudEnabled: false,
    isAuthenticated: false,
  };
}

function mapCloudCampaignRow(
  row: CloudCampaignRow,
): CampaignPlanHistoryItem | null {
  if (
    typeof row.id !== "string" ||
    !isCampaignFormData(row.form_data) ||
    !isCampaignPlanResult(row.plan)
  ) {
    return null;
  }

  return {
    id: row.id,
    createdAt: row.created_at ?? new Date().toISOString(),
    businessName:
      row.form_data.businessName.trim() || row.title || "Campanha sem nome",
    objective: row.form_data.goal,
    source: isPlanSource(row.source) ? row.source : "mock",
    provider: isAIProvider(row.provider) ? row.provider : "mock",
    formData: row.form_data,
    planResult: row.plan,
  };
}

async function getAuthenticatedCloudClient() {
  const supabase = createOptionalSupabaseBrowserClient();

  if (!supabase) {
    return {
      supabase: null,
      user: null,
      isCloudEnabled: false,
    };
  }

  const { data, error } = await supabase.auth.getUser();

  return {
    supabase,
    user: error ? null : data.user,
    isCloudEnabled: true,
  };
}

export async function loadCampaignHistory(
  storage: Storage,
): Promise<CampaignHistoryLoadResult> {
  const { supabase, user, isCloudEnabled } =
    await getAuthenticatedCloudClient();

  if (!supabase) {
    return localHistoryResult(storage);
  }

  if (!user) {
    return {
      ...localHistoryResult(storage),
      isCloudEnabled,
    };
  }

  const { data, error } = await supabase
    .from("campaigns")
    .select("id,title,form_data,plan,source,provider,created_at")
    .order("created_at", { ascending: false })
    .limit(campaignPlanHistoryLimit);

  if (error) {
    return {
      mode: "local",
      items: readCampaignPlanHistory(storage),
      isCloudEnabled,
      isAuthenticated: true,
      userEmail: user.email,
      error:
        "Não foi possível carregar o histórico em nuvem. Mostrando o histórico deste navegador.",
    };
  }

  return {
    mode: "cloud",
    items: ((data ?? []) as CloudCampaignRow[])
      .map(mapCloudCampaignRow)
      .filter((item): item is CampaignPlanHistoryItem => Boolean(item)),
    isCloudEnabled,
    isAuthenticated: true,
    userEmail: user.email,
  };
}

export async function deleteCampaignHistoryItem(
  storage: Storage,
  mode: CampaignStorageMode,
  id: string,
) {
  if (mode === "local") {
    return {
      ok: true,
      items: removeCampaignPlanFromHistory(storage, id),
    };
  }

  const { supabase, user } = await getAuthenticatedCloudClient();

  if (!supabase || !user) {
    return {
      ok: false,
      items: readCampaignPlanHistory(storage),
    };
  }

  const { error } = await supabase
    .from("campaigns")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return {
      ok: false,
      items: null,
    };
  }

  return {
    ok: true,
    items: null,
  };
}

export async function saveCampaignToCloud(
  input: SaveCampaignInput,
): Promise<CloudSaveResult> {
  const { supabase, user } = await getAuthenticatedCloudClient();

  if (!supabase) {
    return {
      ok: false,
      reason: "unavailable",
      message: "Salvar na conta ainda não está habilitado neste ambiente.",
    };
  }

  if (!user) {
    return {
      ok: false,
      reason: "not_authenticated",
      message: "Entre na sua conta para salvar esta campanha em nuvem.",
    };
  }

  const { data, error } = await supabase
    .from("campaigns")
    .insert({
      user_id: user.id,
      title: input.formData.businessName.trim() || "Campanha sem nome",
      form_data: input.formData,
      plan: input.planResult,
      source: input.source,
      provider: input.provider,
    })
    .select("id")
    .single();

  if (error || typeof data?.id !== "string") {
    return {
      ok: false,
      reason: "failed",
      message: "Não foi possível salvar a campanha agora. Tente novamente.",
    };
  }

  return {
    ok: true,
    id: data.id,
  };
}
