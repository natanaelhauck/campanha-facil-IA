import { NextResponse } from "next/server";
import { generateCampaignPlan } from "@/lib/ai/generateCampaignPlan";
import type { CampaignFormData } from "@/types/campaign";

type ValidationResult =
  | {
      ok: true;
      data: CampaignFormData;
    }
  | {
      ok: false;
      error: string;
      status: number;
    };

const maxRequestBodyLength = 8_000;
const maxTotalInputLength = 1_500;

const fieldLimits: Record<keyof CampaignFormData, number> = {
  businessName: 80,
  businessType: 80,
  region: 100,
  offer: 140,
  goal: 80,
  dailyBudget: 60,
  audience: 400,
  differentiator: 300,
  mainChannel: 40,
  experienceLevel: 40,
};

const fieldLabels: Record<keyof CampaignFormData, string> = {
  businessName: "nome do negócio",
  businessType: "tipo de negócio",
  region: "cidade ou região",
  offer: "produto ou serviço anunciado",
  goal: "objetivo da campanha",
  dailyBudget: "orçamento diário",
  audience: "público desejado",
  differentiator: "diferencial da empresa",
  mainChannel: "canal principal",
  experienceLevel: "experiência com anúncios",
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function normalizeCampaignPayload(value: unknown): ValidationResult {
  if (!value || typeof value !== "object") {
    return {
      ok: false,
      error: "Envie os dados do formulário em um formato válido.",
      status: 400,
    };
  }

  const payload = value as Record<keyof CampaignFormData, unknown>;
  const normalized = {} as CampaignFormData;
  let totalLength = 0;

  for (const field of Object.keys(fieldLimits) as Array<keyof CampaignFormData>) {
    const fieldValue = payload[field];

    if (typeof fieldValue !== "string" || fieldValue.trim().length === 0) {
      return {
        ok: false,
        error: "Preencha todos os campos obrigatórios antes de gerar o plano.",
        status: 400,
      };
    }

    const normalizedValue = fieldValue.trim().replace(/\s+/g, " ");
    const maxLength = fieldLimits[field];

    if (normalizedValue.length > maxLength) {
      return {
        ok: false,
        error: `O campo ${fieldLabels[field]} está longo demais. Resuma a informação antes de gerar o plano.`,
        status: 400,
      };
    }

    totalLength += normalizedValue.length;
    normalized[field] = normalizedValue;
  }

  if (totalLength > maxTotalInputLength) {
    return {
      ok: false,
      error:
        "As informações enviadas estão longas demais. Resuma os campos principais e tente novamente.",
      status: 400,
    };
  }

  return {
    ok: true,
    data: normalized,
  };
}

export async function POST(request: Request) {
  let payload: unknown;

  try {
    const body = await request.text();

    if (body.length > maxRequestBodyLength) {
      return NextResponse.json(
        {
          success: false,
          error:
            "As informações enviadas estão longas demais. Resuma o formulário e tente novamente.",
        },
        { status: 413 },
      );
    }

    payload = JSON.parse(body) as unknown;
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Não foi possível ler os dados enviados.",
      },
      { status: 400 },
    );
  }

  if (!isRecord(payload)) {
    return NextResponse.json(
      {
        success: false,
        error: "Envie os dados do formulário em um formato válido.",
      },
      { status: 400 },
    );
  }

  const validation = normalizeCampaignPayload(payload);

  if (!validation.ok) {
    return NextResponse.json(
      {
        success: false,
        error: validation.error,
      },
      { status: validation.status },
    );
  }

  const result = await generateCampaignPlan(validation.data);
  const debug =
    process.env.NODE_ENV === "development" ? result.debug : undefined;

  return NextResponse.json({
    success: true,
    data: result.data,
    source: result.source,
    provider: result.provider,
    warning: result.warning,
    debug,
  });
}
