import { NextResponse } from "next/server";
import { generateCampaignPlan } from "@/lib/ai/generateCampaignPlan";
import type { CampaignFormData } from "@/types/campaign";

const requiredFields: Array<keyof CampaignFormData> = [
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

function isValidPayload(value: unknown): value is CampaignFormData {
  if (!value || typeof value !== "object") {
    return false;
  }

  const payload = value as Partial<CampaignFormData>;

  return requiredFields.every((field) => {
    const fieldValue = payload[field];
    return typeof fieldValue === "string" && fieldValue.trim().length > 0;
  });
}

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Não foi possível ler os dados enviados.",
      },
      { status: 400 },
    );
  }

  if (!isValidPayload(payload)) {
    return NextResponse.json(
      {
        success: false,
        error: "Preencha todos os campos obrigatórios antes de gerar o plano.",
      },
      { status: 400 },
    );
  }

  const result = await generateCampaignPlan(payload);

  return NextResponse.json({
    success: true,
    data: result.data,
    source: result.source,
    warning: result.warning,
  });
}
