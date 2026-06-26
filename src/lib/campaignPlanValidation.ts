import type { CampaignPlanResult } from "@/types/campaign";

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return Boolean(value) && typeof value === "object";
}

function isString(value: unknown) {
  return typeof value === "string" && value.trim().length > 0;
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
      (item) => isRecord(item) && isString(item.title) && isString(item.text),
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
        isString(item.description),
    )
  );
}

function isFollowUpPlan(value: unknown) {
  const allowedPeriods = new Set(["3 dias", "7 dias", "14 dias"]);

  return (
    Array.isArray(value) &&
    value.length === 3 &&
    value.every(
      (item) =>
        isRecord(item) &&
        typeof item.period === "string" &&
        allowedPeriods.has(item.period) &&
        isStringArray(item.actions, 2, 3),
    )
  );
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
    isString(value.disclaimer)
  );
}
