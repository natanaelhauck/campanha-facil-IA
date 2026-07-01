import type {
  CampaignFormData,
  CampaignPlanResult,
} from "@/types/campaign";

function valueOrFallback(value: string | undefined, fallback: string) {
  return value?.trim() || fallback;
}

function addSection(
  sections: string[],
  title: string,
  lines: Array<string | undefined>,
) {
  const content = lines.filter(
    (line): line is string => Boolean(line?.trim()),
  );

  if (content.length > 0) {
    sections.push(`${title}\n${content.join("\n")}`);
  }
}

function list(items: string[] | undefined, marker = "-") {
  return items?.map((item) => `${marker} ${item}`) ?? [];
}

export function formatCampaignPlanText(
  form: Partial<CampaignFormData> | null | undefined,
  plan: CampaignPlanResult,
) {
  const businessName = valueOrFallback(form?.businessName, "Seu negócio");
  const sections = [
    `PLANO INICIAL DE CAMPANHA — ${businessName}`,
    "Aviso: este é um plano inicial orientativo. Revise as informações antes de publicar. O conteúdo não garante vendas, lucro ou performance.",
  ];

  addSection(sections, "RESUMO", [plan.summary]);

  const setup = plan.campaignSetupGuide;
  addSection(sections, "CONFIGURAÇÃO SUGERIDA", [
    `Objetivo recomendado: ${plan.recommendedObjective}`,
    `Público sugerido: ${plan.suggestedAudience}`,
    `Orientação de orçamento: ${plan.budgetGuidance}`,
    setup ? `Objetivo da campanha: ${setup.objective}` : undefined,
    setup ? `Canal: ${setup.channel}` : undefined,
    setup ? `Orçamento inicial: ${setup.initialBudget}` : undefined,
    setup ? `Localização: ${setup.location}` : undefined,
    setup ? `Público: ${setup.audience}` : undefined,
    setup ? `Duração sugerida: ${setup.durationSuggestion}` : undefined,
    setup
      ? `Evite mudar cedo: ${setup.whatNotToChangeEarly}`
      : undefined,
  ]);

  addSection(
    sections,
    "PRÓXIMOS PASSOS",
    plan.nextSteps?.map(
      (step, index) => `${index + 1}. ${step.title}: ${step.description}`,
    ) ?? [],
  );

  addSection(
    sections,
    "TEXTOS DE ANÚNCIO",
    plan.adTexts?.map(
      (adText, index) =>
        `${index + 1}. ${adText.title || `Texto ${index + 1}`}\n${adText.text}`,
    ) ?? [],
  );

  addSection(
    sections,
    "PACOTE DE CRIATIVOS",
    plan.creativePack?.flatMap((creative, index) => [
      `${index + 1}. ${creative.title} — ${creative.format}`,
      `Ideia visual: ${creative.visualIdea}`,
      `Texto na peça: ${creative.textOnCreative}`,
      `Legenda: ${creative.caption}`,
      `Chamada para ação: ${creative.callToAction}`,
      `Dica de produção: ${creative.productionTip}`,
    ]) ?? [],
  );

  addSection(
    sections,
    "PROMPTS VISUAIS",
    plan.creativePack?.map(
      (creative, index) =>
        `${index + 1}. ${creative.title}\n${creative.aiImagePrompt}`,
    ) ?? [],
  );

  const whatsapp = plan.whatsappScript;
  addSection(sections, "ROTEIRO DE WHATSAPP", [
    whatsapp ? `Primeira resposta: ${whatsapp.firstReply}` : undefined,
    whatsapp ? `Resposta sobre preço: ${whatsapp.priceReply}` : undefined,
    whatsapp ? `Resposta a objeção: ${whatsapp.objectionReply}` : undefined,
    whatsapp ? `Encaminhamento do pedido: ${whatsapp.closingReply}` : undefined,
    whatsapp ? `Acompanhamento: ${whatsapp.followUpReply}` : undefined,
  ]);

  addSection(
    sections,
    "IDEIAS DE CRIATIVOS",
    list(plan.creativeIdeas),
  );
  addSection(
    sections,
    "PASSO A PASSO",
    plan.setupSteps?.map((step, index) => `${index + 1}. ${step}`) ?? [],
  );
  addSection(
    sections,
    "CHECKLIST ANTES DE PUBLICAR",
    list(plan.prePublishChecklist, "[ ]"),
  );

  const metrics = plan.simpleMetricsGuide;
  addSection(sections, "MÉTRICAS SIMPLES", [
    ...(metrics?.metricsToWatch?.map((item) => `- Observe: ${item}`) ?? []),
    ...(metrics?.goodSigns?.map((item) => `- Bom sinal: ${item}`) ?? []),
    ...(metrics?.warningSigns?.map(
      (item) => `- Sinal de atenção: ${item}`,
    ) ?? []),
    metrics ? `Quando esperar: ${metrics.whenToWait}` : undefined,
    metrics ? `Quando ajustar: ${metrics.whenToAdjust}` : undefined,
  ]);

  addSection(
    sections,
    "ACOMPANHAMENTO EM 3, 7 E 14 DIAS",
    plan.followUpPlan?.flatMap((period) => [
      `${period.period}:`,
      ...period.actions.map((action) => `- ${action}`),
    ]) ?? [],
  );

  return sections.join("\n\n");
}
