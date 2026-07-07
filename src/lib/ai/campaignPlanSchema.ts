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
    "campaignSetupGuide",
    "creativePack",
    "whatsappScript",
    "simpleMetricsGuide",
    "sevenDayActionPlan",
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
    campaignSetupGuide: {
      type: "object",
      additionalProperties: false,
      required: [
        "objective",
        "channel",
        "initialBudget",
        "location",
        "audience",
        "durationSuggestion",
        "whatNotToChangeEarly",
      ],
      description:
        "Configuração inicial pronta para consulta, específica para os dados informados e sem opções avançadas.",
      properties: {
        objective: {
          type: "string",
          maxLength: 180,
          description: "Objetivo recomendado explicado em linguagem simples.",
        },
        channel: {
          type: "string",
          maxLength: 120,
          description: "Canal principal e destino esperado do contato.",
        },
        initialBudget: {
          type: "string",
          maxLength: 180,
          description:
            "Orçamento inicial conservador, usando o valor informado.",
        },
        location: {
          type: "string",
          maxLength: 160,
          description: "Localização ou região a configurar.",
        },
        audience: {
          type: "string",
          maxLength: 220,
          description:
            "Público inicial simples, sem segmentação estreita ou técnica.",
        },
        durationSuggestion: {
          type: "string",
          maxLength: 180,
          description:
            "Tempo mínimo sugerido para observar sinais antes de concluir.",
        },
        whatNotToChangeEarly: {
          type: "string",
          maxLength: 220,
          description:
            "Elementos que devem permanecer estáveis nos primeiros dias para permitir comparação.",
        },
      },
    },
    creativePack: {
      type: "array",
      minItems: 3,
      maxItems: 3,
      description:
        "Três briefings de criativos executáveis. São orientações para produção, não imagens geradas.",
      items: {
        type: "object",
        additionalProperties: false,
        required: [
          "title",
          "format",
          "goal",
          "visualIdea",
          "sceneGuide",
          "requiredAssets",
          "canvaLayoutTip",
          "recordingSteps",
          "textOnCreative",
          "caption",
          "callToAction",
          "aiImagePrompt",
          "productionTip",
          "avoid",
          "readyToUseBriefing",
        ],
        properties: {
          title: {
            type: "string",
            maxLength: 60,
            description: "Nome curto que diferencia o criativo.",
          },
          format: {
            type: "string",
            maxLength: 60,
            description:
              "Formato fácil de reconhecer, como Story/Reels vertical, Feed quadrado ou Vídeo curto.",
          },
          goal: {
            type: "string",
            maxLength: 120,
            description:
              "Objetivo prático do criativo, como chamar atenção local, explicar a oferta ou gerar conversa.",
          },
          visualIdea: {
            type: "string",
            maxLength: 220,
            description:
              "Cena específica que a pessoa pode fotografar, gravar ou montar.",
          },
          sceneGuide: {
            type: "string",
            maxLength: 260,
            description:
              "Orientação de enquadramento, luz, cenário e composição para uma pessoa leiga produzir com celular.",
          },
          requiredAssets: {
            type: "array",
            minItems: 2,
            maxItems: 4,
            description:
              "Materiais necessários para produzir o criativo, sem exigir equipamento profissional.",
            items: {
              type: "string",
              maxLength: 80,
            },
          },
          canvaLayoutTip: {
            type: "string",
            maxLength: 220,
            description:
              "Dica simples para montar a peça no Canva ou editor similar, com hierarquia de texto e imagem.",
          },
          recordingSteps: {
            type: "array",
            minItems: 2,
            maxItems: 4,
            description:
              "Passos curtos para fotografar, gravar ou montar o criativo.",
            items: {
              type: "string",
              maxLength: 120,
            },
          },
          textOnCreative: {
            type: "string",
            maxLength: 100,
            description: "Texto curto que aparece sobre a imagem ou vídeo.",
          },
          caption: {
            type: "string",
            maxLength: 300,
            description:
              "Legenda pronta, adaptada à oferta, com CTA leve e sem promessa.",
          },
          callToAction: {
            type: "string",
            maxLength: 80,
            description: "Chamada curta para o canal principal.",
          },
          aiImagePrompt: {
            type: "string",
            maxLength: 300,
            description:
              "Briefing visual em português para Canva, designer ou futura IA de imagem; não afirmar que a imagem foi gerada.",
          },
          productionTip: {
            type: "string",
            maxLength: 220,
            description:
              "Dica prática para produzir o criativo com celular e recursos simples.",
          },
          avoid: {
            type: "array",
            minItems: 2,
            maxItems: 4,
            description:
              "Erros simples a evitar, sem jargão técnico e sem citar políticas avançadas.",
            items: {
              type: "string",
              maxLength: 110,
            },
          },
          readyToUseBriefing: {
            type: "string",
            maxLength: 360,
            description:
              "Resumo pronto para copiar e enviar a quem vai produzir a peça, sem prometer resultado.",
          },
        },
      },
    },
    whatsappScript: {
      type: "object",
      additionalProperties: false,
      required: [
        "firstReply",
        "priceReply",
        "objectionReply",
        "closingReply",
        "followUpReply",
      ],
      description:
        "Respostas curtas e realistas para adaptar no atendimento por WhatsApp, sem pressão enganosa.",
      properties: {
        firstReply: {
          type: "string",
          maxLength: 240,
          description:
            "Primeira resposta: acolher, citar a oferta e fazer uma pergunta simples.",
        },
        priceReply: {
          type: "string",
          maxLength: 240,
          description:
            "Resposta sobre preço sem inventar valores ausentes nem esconder condições.",
        },
        objectionReply: {
          type: "string",
          maxLength: 240,
          description:
            "Resposta respeitosa para dúvida, comparação ou hesitação.",
        },
        closingReply: {
          type: "string",
          maxLength: 240,
          description:
            "Convite leve para o próximo passo, sem criar urgência falsa.",
        },
        followUpReply: {
          type: "string",
          maxLength: 240,
          description:
            "Retorno educado para contato que não respondeu, sem insistência.",
        },
      },
    },
    simpleMetricsGuide: {
      type: "object",
      additionalProperties: false,
      required: [
        "metricsToWatch",
        "goodSigns",
        "warningSigns",
        "whenToWait",
        "whenToAdjust",
      ],
      description:
        "Guia de leitura simples dos primeiros sinais, sem diagnóstico definitivo ou aumento automático de verba.",
      properties: {
        metricsToWatch: {
          type: "array",
          minItems: 3,
          maxItems: 5,
          items: {
            type: "string",
            maxLength: 180,
          },
          description:
            "Métricas explicadas sem jargão, como impressões, cliques, conversas, custo e qualidade dos contatos.",
        },
        goodSigns: {
          type: "array",
          minItems: 2,
          maxItems: 4,
          items: {
            type: "string",
            maxLength: 180,
          },
        },
        warningSigns: {
          type: "array",
          minItems: 2,
          maxItems: 4,
          items: {
            type: "string",
            maxLength: 180,
          },
        },
        whenToWait: {
          type: "string",
          maxLength: 220,
          description:
            "Situação em que ainda é cedo para alterar a campanha.",
        },
        whenToAdjust: {
          type: "string",
          maxLength: 220,
          description:
            "Situação em que faz sentido revisar oferta, atendimento ou criativo antes da verba.",
        },
      },
    },
    sevenDayActionPlan: {
      type: "array",
      minItems: 7,
      maxItems: 7,
      description:
        "Plano simples de execução para os 7 primeiros dias após gerar o plano, sem promessa de resultado e sem aumento automático de orçamento.",
      items: {
        type: "object",
        additionalProperties: false,
        required: [
          "day",
          "title",
          "objective",
          "tasks",
          "expectedOutcome",
          "warning",
        ],
        properties: {
          day: {
            type: "string",
            maxLength: 20,
            description:
              "Dia do plano, usando Dia 1, Dia 2, Dia 3, Dia 4, Dia 5, Dia 6 e Dia 7.",
          },
          title: {
            type: "string",
            maxLength: 70,
            description: "Título curto e prático para o dia.",
          },
          objective: {
            type: "string",
            maxLength: 160,
            description:
              "Objetivo do dia em linguagem simples, ligado ao canal, orçamento, criativos ou atendimento.",
          },
          tasks: {
            type: "array",
            minItems: 2,
            maxItems: 4,
            description:
              "Tarefas curtas e práticas que uma pessoa leiga consegue executar.",
            items: {
              type: "string",
              maxLength: 120,
            },
          },
          expectedOutcome: {
            type: "string",
            maxLength: 160,
            description:
              "Resultado esperado como entrega prática do dia, sem prometer venda, lucro ou performance.",
          },
          warning: {
            type: "string",
            maxLength: 180,
            description:
              "Cuidado do dia, evitando pressa, excesso de mudanças, ações técnicas demais ou aumento automático de verba.",
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
    "Pacote inicial de execução de campanha para pequenos negócios brasileiros, com configuração, criativos, atendimento, métricas e nenhuma promessa de resultado.",
  strict: true,
  schema: campaignPlanSchema,
};
