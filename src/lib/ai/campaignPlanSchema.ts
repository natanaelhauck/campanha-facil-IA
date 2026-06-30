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
        "Resumo específico em até duas frases, usando dados do negócio e apresentando o plano como ponto de partida.",
    },
    recommendedObjective: {
      type: "string",
      description:
        "Objetivo recomendado em linguagem simples e coerente com o canal; para Meta com WhatsApp, priorizar mensagens ou conversas.",
    },
    suggestedAudience: {
      type: "string",
      description:
        "Público sugerido, com região e orientação conservadora, evitando segmentação estreita demais.",
    },
    budgetGuidance: {
      type: "string",
      description:
        "Orientação conservadora que cita o orçamento informado e recomenda observar os primeiros dias antes de alterar a verba.",
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
            description:
              "Usar Texto 1, Texto 2 e Texto 3, respectivamente e sem repetir.",
          },
          text: {
            type: "string",
            description:
              "Texto adaptado à oferta, com até 300 caracteres, CTA claro, sem exagero ou promessa. Texto 1 é direto; Texto 2 destaca benefício ou diferencial; Texto 3 convida levemente para uma conversa no canal informado.",
          },
        },
      },
    },
    creativeIdeas: {
      type: "array",
      minItems: 3,
      maxItems: 4,
      description:
        "Ideias simples de fotos ou vídeos reais que o pequeno negócio consiga produzir.",
      items: {
        type: "string",
      },
    },
    setupSteps: {
      type: "array",
      minItems: 4,
      maxItems: 6,
      description:
        "Etapas operacionais simples: objetivo, região, orçamento informado, poucos criativos e acompanhamento de mensagens, custo e qualidade.",
      items: {
        type: "string",
      },
    },
    prePublishChecklist: {
      type: "array",
      minItems: 5,
      maxItems: 6,
      description:
        "Verificações práticas antes de publicar, incluindo canal, atendimento, oferta, criativo, orçamento e público ou localização.",
      items: {
        type: "string",
      },
    },
    followUpPlan: {
      type: "array",
      minItems: 3,
      maxItems: 3,
      description:
        "Acompanhamento na ordem 3, 7 e 14 dias, sem aumento automático de orçamento.",
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
      minItems: 5,
      maxItems: 5,
      description:
        "Exatamente cinco ações concretas em ordem de execução. Não incluir estudo genérico, aprendizado sobre ferramentas ou revisão de políticas.",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["title", "description"],
        properties: {
          title: {
            type: "string",
            description: "Ação curta iniciada por um verbo.",
          },
          description: {
            type: "string",
            description:
              "Instrução específica e executável, relacionada aos dados do negócio.",
          },
        },
      },
    },
    disclaimer: {
      type: "string",
      description:
        "Aviso claro de que o plano é inicial, precisa ser revisado e não garante vendas, lucro, aprovação ou performance.",
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
