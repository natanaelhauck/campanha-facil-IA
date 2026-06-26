export const campaignPlanSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "summary",
    "recommendedObjective",
    "suggestedAudience",
    "budgetGuidance",
    "adTexts",
    "creativeIdeas",
    "setupSteps",
    "prePublishChecklist",
    "followUpPlan",
    "nextSteps",
    "disclaimer",
  ],
  properties: {
    summary: {
      type: "string",
      description:
        "Resumo curto do plano inicial, usando dados do negócio e sem prometer resultado.",
    },
    recommendedObjective: {
      type: "string",
      description:
        "Objetivo recomendado explicado em linguagem simples para pequenos negócios.",
    },
    suggestedAudience: {
      type: "string",
      description:
        "Público sugerido, com região e orientação conservadora, evitando segmentação estreita demais.",
    },
    budgetGuidance: {
      type: "string",
      description:
        "Orientação de orçamento conservadora, respeitando o valor informado pelo usuário.",
    },
    adTexts: {
      type: "array",
      minItems: 3,
      maxItems: 3,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["title", "text"],
        properties: {
          title: {
            type: "string",
            description: "Título curto, como Texto 1, Texto 2 ou Texto 3.",
          },
          text: {
            type: "string",
            description:
              "Texto de anúncio em português do Brasil, simples e sem promessa garantida.",
          },
        },
      },
    },
    creativeIdeas: {
      type: "array",
      minItems: 3,
      maxItems: 4,
      items: {
        type: "string",
      },
    },
    setupSteps: {
      type: "array",
      minItems: 4,
      maxItems: 6,
      items: {
        type: "string",
      },
    },
    prePublishChecklist: {
      type: "array",
      minItems: 5,
      maxItems: 6,
      items: {
        type: "string",
      },
    },
    followUpPlan: {
      type: "array",
      minItems: 3,
      maxItems: 3,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["period", "actions"],
        properties: {
          period: {
            type: "string",
            enum: ["3 dias", "7 dias", "14 dias"],
          },
          actions: {
            type: "array",
            minItems: 2,
            maxItems: 3,
            items: {
              type: "string",
            },
          },
        },
      },
    },
    nextSteps: {
      type: "array",
      minItems: 3,
      maxItems: 5,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["title", "description"],
        properties: {
          title: {
            type: "string",
          },
          description: {
            type: "string",
          },
        },
      },
    },
    disclaimer: {
      type: "string",
      description:
        "Aviso claro de que o plano é orientativo e não garante vendas, lucro ou performance.",
    },
  },
} as const;

export const campaignPlanResponseFormat = {
  type: "json_schema" as const,
  name: "campaign_plan_result",
  description:
    "Plano inicial de campanha para pequenos negócios brasileiros, com linguagem simples e sem promessa de resultado garantido.",
  strict: true,
  schema: campaignPlanSchema,
};
