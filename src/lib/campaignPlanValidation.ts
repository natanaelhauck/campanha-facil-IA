import type { CampaignPlanResult } from "@/types/campaign";

type UnknownRecord = Record<string, unknown>;
type CurrentCampaignPlanResult = CampaignPlanResult &
  Required<
    Pick<
      CampaignPlanResult,
      | "campaignSetupGuide"
      | "creativePack"
      | "whatsappScript"
      | "simpleMetricsGuide"
    >
  >;

function isRecord(value: unknown): value is UnknownRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isBoundedString(value: unknown, maxLength: number) {
  return isString(value) && value.length <= maxLength;
}

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function isStringArray(
  value: unknown,
  minItems: number,
  maxItems?: number,
): value is string[] {
  return (
    Array.isArray(value) &&
    value.length >= minItems &&
    (maxItems === undefined || value.length <= maxItems) &&
    value.every(isString)
  );
}

function isBoundedStringArray(
  value: unknown,
  minItems: number,
  maxItems: number,
  maxLength: number,
) {
  return (
    isStringArray(value, minItems, maxItems) &&
    value.every((item) => item.length <= maxLength)
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
    value.length >= 3 &&
    value.length <= 5 &&
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

function isCampaignSetupGuide(value: unknown) {
  return (
    isRecord(value) &&
    isBoundedString(value.objective, 180) &&
    isBoundedString(value.channel, 120) &&
    isBoundedString(value.initialBudget, 180) &&
    isBoundedString(value.location, 160) &&
    isBoundedString(value.audience, 220) &&
    isBoundedString(value.durationSuggestion, 180) &&
    isBoundedString(value.whatNotToChangeEarly, 220)
  );
}

function hasProductionGuideFields(item: UnknownRecord) {
  return (
    isBoundedString(item.goal, 120) &&
    isBoundedString(item.sceneGuide, 260) &&
    isBoundedStringArray(item.requiredAssets, 2, 4, 80) &&
    isBoundedString(item.canvaLayoutTip, 220) &&
    isBoundedStringArray(item.recordingSteps, 2, 4, 120) &&
    isBoundedStringArray(item.avoid, 2, 4, 110) &&
    isBoundedString(item.readyToUseBriefing, 360)
  );
}

function isCreativePack(value: unknown, requireProductionGuide = false) {
  return (
    Array.isArray(value) &&
    value.length === 3 &&
    value.every(
      (item) =>
        isRecord(item) &&
        isBoundedString(item.title, 60) &&
        isBoundedString(item.format, 60) &&
        isBoundedString(item.visualIdea, 220) &&
        isBoundedString(item.textOnCreative, 100) &&
        isBoundedString(item.caption, 300) &&
        isBoundedString(item.callToAction, 80) &&
        isBoundedString(item.aiImagePrompt, 300) &&
        isBoundedString(item.productionTip, 220) &&
        (!requireProductionGuide || hasProductionGuideFields(item)),
    )
  );
}

function isWhatsappScript(value: unknown) {
  return (
    isRecord(value) &&
    isBoundedString(value.firstReply, 240) &&
    isBoundedString(value.priceReply, 240) &&
    isBoundedString(value.objectionReply, 240) &&
    isBoundedString(value.closingReply, 240) &&
    isBoundedString(value.followUpReply, 240)
  );
}

function isSimpleMetricsGuide(value: unknown) {
  return (
    isRecord(value) &&
    isStringArray(value.metricsToWatch, 3, 5) &&
    value.metricsToWatch.every((item) => item.length <= 180) &&
    isStringArray(value.goodSigns, 2, 4) &&
    value.goodSigns.every((item) => item.length <= 180) &&
    isStringArray(value.warningSigns, 2, 4) &&
    value.warningSigns.every((item) => item.length <= 180) &&
    isBoundedString(value.whenToWait, 220) &&
    isBoundedString(value.whenToAdjust, 220)
  );
}

function isOptionalSection(
  value: unknown,
  validator: (section: unknown) => boolean,
) {
  return value === undefined || validator(value);
}

function hasUnsafePromise(value: string) {
  const normalized = normalizeText(value);
  const unsafePatterns = [
    /\bgaranta\b/,
    /\bgarantimos\b/,
    /\bgarantir\s+(?:vendas?|clientes?|lucro|resultados?|performance)\b/,
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

function collectPlanStrings(value: unknown): string[] {
  if (typeof value === "string") {
    return [value];
  }

  if (Array.isArray(value)) {
    return value.flatMap(collectPlanStrings);
  }

  if (!isRecord(value)) {
    return [];
  }

  return Object.entries(value).flatMap(([key, item]) =>
    key === "disclaimer" ? [] : collectPlanStrings(item),
  );
}

function hasUnsafeContent(value: UnknownRecord) {
  return collectPlanStrings(value).some(hasUnsafePromise);
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
    isOptionalSection(value.campaignSetupGuide, isCampaignSetupGuide) &&
    isOptionalSection(value.creativePack, isCreativePack) &&
    isOptionalSection(value.whatsappScript, isWhatsappScript) &&
    isOptionalSection(value.simpleMetricsGuide, isSimpleMetricsGuide) &&
    !hasVagueNextStep(value.nextSteps) &&
    !hasUnsafeContent(value)
  );
}

export function isCurrentCampaignPlanResult(
  value: unknown,
): value is CurrentCampaignPlanResult {
  return (
    isCampaignPlanResult(value) &&
    value.nextSteps.length === 5 &&
    isCampaignSetupGuide(value.campaignSetupGuide) &&
    isCreativePack(value.creativePack, true) &&
    isWhatsappScript(value.whatsappScript) &&
    isSimpleMetricsGuide(value.simpleMetricsGuide)
  );
}
