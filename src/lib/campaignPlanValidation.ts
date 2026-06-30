import type { CampaignPlanResult } from "@/types/campaign";

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return Boolean(value) && typeof value === "object";
}

function isString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function isStringArray(value: unknown, minItems: number, maxItems?: number) {
  return (
    Array.isArray(value) &&
    value.length >= minItems &&
    (maxItems === undefined || value.length <= maxItems) &&
    value.every(isString)
  );
}

function isAdTextArray(value: unknown) {
  return (
    Array.isArray(value) &&
    value.length === 3 &&
    value.every(
      (item, index) =>
        isRecord(item) &&
        isString(item.title) &&
        normalizeText(item.title).startsWith(`texto ${index + 1}`) &&
        isString(item.text) &&
        item.text.length <= 300,
    )
  );
}

function isNextStepArray(value: unknown) {
  return (
    Array.isArray(value) &&
    value.length === 5 &&
    value.every(
      (item) =>
        isRecord(item) &&
        isString(item.title) &&
        item.title.trim().length >= 4 &&
        isString(item.description) &&
        item.description.trim().length >= 12,
    )
  );
}

function isFollowUpPlan(value: unknown) {
  const expectedPeriods = ["3 dias", "7 dias", "14 dias"];

  return (
    Array.isArray(value) &&
    value.length === 3 &&
    value.every(
      (item, index) =>
        isRecord(item) &&
        item.period === expectedPeriods[index] &&
        isStringArray(item.actions, 2, 3),
    )
  );
}

function hasUnsafePromise(value: string) {
  const normalized = normalizeText(value);
  const unsafePatterns = [
    /\bgaranta\b/,
    /\bgarantimos\b/,
    /\b(?:venda|vendas|cliente|clientes|lucro|lucros|resultado|resultados|performance)\s+garantid[oa]s?\b/,
    /\bresultado\s+certo\b/,
  ];

  return unsafePatterns.some((pattern) => pattern.test(normalized));
}

function hasVagueNextStep(value: unknown) {
  if (!Array.isArray(value)) {
    return true;
  }

  const vaguePatterns = [
    /\b(?:aprenda|estude|pesquise|saiba mais)\s+(?:sobre|como)\b/,
    /\b(?:conheca|entenda)\s+(?:o|a|os|as)?\s*(?:gerenciador|politicas?)\b/,
    /\brevis(?:e|ar)\s+(?:as\s+)?politicas?\s+(?:de\s+)?anuncios\b/,
  ];

  return value.some((item) => {
    if (!isRecord(item) || !isString(item.title) || !isString(item.description)) {
      return true;
    }

    const content = normalizeText(`${item.title} ${item.description}`);
    return vaguePatterns.some((pattern) => pattern.test(content));
  });
}

function hasUnsafeContent(value: UnknownRecord) {
  const content = [
    value.summary,
    value.recommendedObjective,
    value.suggestedAudience,
    value.budgetGuidance,
    ...(Array.isArray(value.adTexts)
      ? value.adTexts.flatMap((item) =>
          isRecord(item) ? [item.title, item.text] : [],
        )
      : []),
    ...(Array.isArray(value.creativeIdeas) ? value.creativeIdeas : []),
    ...(Array.isArray(value.setupSteps) ? value.setupSteps : []),
    ...(Array.isArray(value.prePublishChecklist)
      ? value.prePublishChecklist
      : []),
    ...(Array.isArray(value.followUpPlan)
      ? value.followUpPlan.flatMap((item) =>
          isRecord(item) && Array.isArray(item.actions) ? item.actions : [],
        )
      : []),
    ...(Array.isArray(value.nextSteps)
      ? value.nextSteps.flatMap((item) =>
          isRecord(item) ? [item.title, item.description] : [],
        )
      : []),
  ];

  return content.some((item) => typeof item === "string" && hasUnsafePromise(item));
}

export function isCampaignPlanResult(
  value: unknown,
): value is CampaignPlanResult {
  return (
    isRecord(value) &&
    isString(value.summary) &&
    isString(value.recommendedObjective) &&
    isString(value.suggestedAudience) &&
    isString(value.budgetGuidance) &&
    isAdTextArray(value.adTexts) &&
    isStringArray(value.creativeIdeas, 3, 4) &&
    isStringArray(value.setupSteps, 4, 6) &&
    isStringArray(value.prePublishChecklist, 5, 6) &&
    isFollowUpPlan(value.followUpPlan) &&
    isNextStepArray(value.nextSteps) &&
    isString(value.disclaimer) &&
    !hasVagueNextStep(value.nextSteps) &&
    !hasUnsafeContent(value)
  );
}
