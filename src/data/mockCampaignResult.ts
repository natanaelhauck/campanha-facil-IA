import type { CampaignFormData, CampaignPlanResult } from "@/types/campaign";

function display(value: string | undefined, fallback: string) {
  return value?.trim() || fallback;
}

export const mockCampaignResult: CampaignPlanResult = {
  summary:
    "Plano inicial simulado para organizar objetivo, público, orçamento, textos, criativos e rotina de acompanhamento antes de investir.",
  recommendedObjective:
    "Priorize um objetivo que gere contato direto, como mensagens ou conversas qualificadas, especialmente quando o negócio ainda está testando a campanha.",
  suggestedAudience:
    "Pessoas próximas da cidade ou região informada, com interesses relacionados ao tipo de negócio e comportamento de compra local.",
  budgetGuidance:
    "Comece com um orçamento diário baixo e consistente por pelo menos 7 dias, ajustando depois conforme o custo por contato e a qualidade das conversas.",
  adTexts: [
    {
      title: "Texto 1",
      text: "Precisa resolver isso com praticidade? Fale com a gente e receba uma orientação simples.",
    },
    {
      title: "Texto 2",
      text: "Atendimento local, direto e sem complicação. Conheça nossa solução e tire suas dúvidas.",
    },
    {
      title: "Texto 3",
      text: "Quer saber se esta oferta faz sentido para você? Chame pelo WhatsApp e converse com a gente.",
    },
  ],
  creativeIdeas: [
    "Foto real do produto, equipe ou ambiente, com texto curto destacando o principal benefício.",
    "Vídeo vertical simples mostrando bastidores, demonstração rápida ou o atendimento acontecendo.",
    "Imagem com prova social: depoimento curto, avaliação de cliente ou resultado entregue.",
  ],
  setupSteps: [
    "Abra o Gerenciador de Anúncios da Meta e escolha criar uma nova campanha.",
    "Selecione o objetivo de mensagens ou conversas e defina a região de atendimento.",
    "Use o orçamento diário informado sem configurações avançadas.",
    "Publique com poucos textos, fotos ou vídeos reais e uma chamada clara para contato.",
    "Acompanhe mensagens, custo por contato e qualidade das conversas nos primeiros dias.",
  ],
  prePublishChecklist: [
    "O WhatsApp, Instagram, site ou endereço informado está funcionando.",
    "A oferta está clara e fácil de entender.",
    "O criativo mostra o produto, serviço ou benefício principal.",
    "O orçamento diário cabe no caixa do negócio por pelo menos 7 dias.",
    "Existe uma pessoa pronta para responder os contatos gerados.",
  ],
  followUpPlan: [
    {
      period: "3 dias",
      actions: [
        "Verifique se a campanha está recebendo impressões, cliques e contatos.",
        "Leia as primeiras conversas para identificar dúvidas comuns.",
      ],
    },
    {
      period: "7 dias",
      actions: [
        "Compare custo por contato e qualidade das conversas.",
        "Pause textos ou criativos com baixo retorno e mantenha os melhores.",
      ],
    },
    {
      period: "14 dias",
      actions: [
        "Decida se mantém, ajusta ou pausa a campanha conforme o custo e a qualidade dos contatos.",
        "Teste um novo criativo ou considere aumentar a verba apenas se os sinais forem consistentes.",
      ],
    },
  ],
  nextSteps: [
    {
      title: "Revise a oferta",
      description:
        "Confirme se a oferta está clara, fácil de entender e com uma chamada simples para contato.",
    },
    {
      title: "Prepare o canal principal",
      description:
        "Confira se o WhatsApp, Instagram, site ou endereço está pronto para receber interessados.",
    },
    {
      title: "Separe criativos reais",
      description:
        "Use fotos ou vídeos simples que mostrem o produto, serviço ou principal benefício.",
    },
    {
      title: "Configure com verba controlada",
      description:
        "Comece com orçamento baixo e acompanhe alguns dias antes de aumentar o investimento.",
    },
    {
      title: "Acompanhe os contatos",
      description:
        "Observe dúvidas frequentes, qualidade das conversas e sinais comerciais antes de fazer ajustes maiores.",
    },
  ],
  disclaimer:
    "Este plano é uma orientação inicial. Ele não garante vendas, lucro, aprovação de anúncios ou performance.",
};

export function createMockCampaignPlan(
  form: Partial<CampaignFormData>,
): CampaignPlanResult {
  const businessName = display(form.businessName, "seu negócio");
  const businessType = display(form.businessType, "negócio local");
  const region = display(form.region, "sua região");
  const offer = display(form.offer, "produto ou serviço anunciado");
  const goal = display(form.goal, "receber contatos qualificados");
  const dailyBudget = display(form.dailyBudget, "orçamento inicial informado");
  const audience = display(form.audience, "pessoas com interesse na oferta");
  const differentiator = display(form.differentiator, "atendimento confiável");
  const mainChannel = display(form.mainChannel, "canal principal");
  const experienceLevel = display(form.experienceLevel, "não informado");

  return {
    ...mockCampaignResult,
    summary: `Plano inicial para ${businessName}, um ${businessType} em ${region}, com foco em divulgar ${offer} e gerar ${goal} pelo canal ${mainChannel}.`,
    recommendedObjective: `Para o objetivo informado, ${goal}, comece com uma campanha focada em contato direto pelo ${mainChannel}. ${mockCampaignResult.recommendedObjective}`,
    suggestedAudience: `Use como base: ${audience}. Inclua ${region} e evite segmentações muito estreitas no primeiro teste. ${mockCampaignResult.suggestedAudience}`,
    budgetGuidance: `Orçamento informado: ${dailyBudget}. ${mockCampaignResult.budgetGuidance}`,
    adTexts: [
      {
        title: "Texto 1",
        text: `${businessName} ajuda quem procura ${offer} em ${region}. Fale pelo ${mainChannel} e tire suas dúvidas de forma simples.`,
      },
      {
        title: "Texto 2",
        text: `Está buscando ${offer}? Conheça o atendimento da ${businessName} e veja como o diferencial "${differentiator}" pode ajudar.`,
      },
      {
        title: "Texto 3",
        text: `Quer saber mais sobre ${offer}? Chame a ${businessName} pelo ${mainChannel} e converse com a gente sem compromisso.`,
      },
    ],
    creativeIdeas: [
      `Mostre ${offer} em uma imagem real, destacando ${differentiator}.`,
      ...mockCampaignResult.creativeIdeas,
    ],
    prePublishChecklist: [
      `O canal principal (${mainChannel}) está pronto para receber contatos.`,
      ...mockCampaignResult.prePublishChecklist,
    ],
    nextSteps: [
      {
        title: "Revise a oferta",
        description: `Confirme se "${offer}" está claro, com benefício fácil de entender e uma chamada simples para contato.`,
      },
      {
        title: `Prepare o ${mainChannel}`,
        description:
          "Confira se o canal está funcionando, com alguém pronto para responder os primeiros contatos.",
      },
      {
        title: "Separe criativos reais",
        description: `Use fotos ou vídeos simples que mostrem ${offer} e reforcem ${differentiator}.`,
      },
      {
        title: "Configure com verba controlada",
        description: `Comece com ${dailyBudget} e acompanhe por alguns dias antes de aumentar o investimento.`,
      },
      {
        title: "Acompanhe as conversas",
        description:
          "Observe dúvidas frequentes, qualidade dos contatos e sinais comerciais antes de fazer ajustes maiores.",
      },
    ],
    disclaimer: `Plano inicial orientativo para o nível de experiência "${experienceLevel}". Ele não garante vendas, lucro, aprovação de anúncios ou performance.`,
  };
}
