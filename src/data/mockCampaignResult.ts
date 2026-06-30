import type { CampaignFormData, CampaignPlanResult } from "@/types/campaign";

function display(value: string | undefined, fallback: string) {
  return value?.trim() || fallback;
}

function fit(value: string, maxLength: number) {
  return value.length <= maxLength
    ? value
    : `${value.slice(0, maxLength - 1).trimEnd()}…`;
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
  campaignSetupGuide: {
    objective:
      "Use uma campanha de mensagens ou conversas para facilitar o contato direto.",
    channel:
      "Leve a pessoa para o canal em que alguém consegue responder com rapidez.",
    initialBudget:
      "Use o orçamento diário informado e mantenha o valor estável no primeiro teste.",
    location:
      "Selecione apenas a cidade, os bairros ou a área realmente atendida.",
    audience:
      "Comece com um público local simples e relacionado à oferta, sem filtros demais.",
    durationSuggestion:
      "Observe por pelo menos 7 dias, se o orçamento couber no caixa.",
    whatNotToChangeEarly:
      "Evite trocar público, criativo e orçamento ao mesmo tempo nos primeiros dias.",
  },
  creativePack: [
    {
      title: "Oferta em destaque",
      format: "Feed quadrado",
      visualIdea:
        "Foto real e bem iluminada do produto ou serviço em uso, com o principal benefício visível.",
      textOnCreative: "Uma solução simples perto de você",
      caption:
        "Conheça uma opção local para resolver o que você precisa com atendimento direto. Fale com a gente e tire suas dúvidas.",
      callToAction: "Enviar mensagem",
      aiImagePrompt:
        "Foto publicitária realista de um pequeno negócio brasileiro, luz natural, ambiente organizado, produto ou serviço em destaque, sem textos e sem marcas inventadas.",
      productionTip:
        "Fotografe perto de uma janela, limpe o fundo e evite colocar muito texto sobre a imagem.",
    },
    {
      title: "Bastidores reais",
      format: "Story/Reels vertical",
      visualIdea:
        "Vídeo curto mostrando três momentos: preparação, detalhe do trabalho e resultado final.",
      textOnCreative: "Veja como preparamos tudo",
      caption:
        "Um pouco dos bastidores para você conhecer nosso cuidado de perto. Quer saber mais? Chame para conversar.",
      callToAction: "Falar no WhatsApp",
      aiImagePrompt:
        "Sequência vertical realista de bastidores de um pequeno negócio brasileiro, equipe trabalhando, detalhes do processo, luz natural e aparência autêntica.",
      productionTip:
        "Grave três cenas de 2 a 3 segundos com o celular na vertical e use movimentos lentos.",
    },
    {
      title: "Diferencial explicado",
      format: "Vídeo curto",
      visualIdea:
        "Pessoa da equipe olhando para a câmera e explicando em uma frase o principal diferencial.",
      textOnCreative: "Atendimento simples e direto",
      caption:
        "Se você valoriza atendimento claro e próximo, conheça nossa proposta. Envie uma mensagem para entender como funciona.",
      callToAction: "Tirar uma dúvida",
      aiImagePrompt:
        "Retrato realista de uma pessoa de pequeno negócio brasileiro falando com a câmera, ambiente de trabalho ao fundo, expressão acolhedora e iluminação natural.",
      productionTip:
        "Apoie o celular, grave em local silencioso e fale uma frase por vez sem decorar um texto longo.",
    },
  ],
  whatsappScript: {
    firstReply:
      "Olá! Obrigado pela mensagem. Você quer saber mais sobre a oferta ou já tem alguma dúvida específica?",
    priceReply:
      "Claro! O valor é [informe o valor]. Se quiser, explico o que está incluído e vejo se atende ao que você procura.",
    objectionReply:
      "Entendo sua dúvida. O que você gostaria de comparar ou confirmar antes de decidir?",
    closingReply:
      "Se fizer sentido para você, posso orientar o próximo passo por aqui, sem compromisso.",
    followUpReply:
      "Olá! Passando apenas para saber se ficou alguma dúvida. Se não for o momento, tudo bem.",
  },
  simpleMetricsGuide: {
    metricsToWatch: [
      "Impressões: quantas vezes o anúncio apareceu para alguém.",
      "Cliques: quantas pessoas tocaram no anúncio para saber mais.",
      "Conversas: quantos contatos reais começaram pelo canal escolhido.",
      "Custo por conversa: quanto foi gasto, em média, por contato iniciado.",
      "Qualidade dos contatos: quantas conversas têm interesse real na oferta.",
    ],
    goodSigns: [
      "As pessoas fazem perguntas relacionadas à oferta anunciada.",
      "Os contatos vêm da região atendida e avançam na conversa.",
    ],
    warningSigns: [
      "Há cliques, mas quase ninguém inicia uma conversa.",
      "Os contatos não entendem a oferta ou estão fora da região.",
    ],
    whenToWait:
      "Espere quando a campanha ainda tem poucos dias ou poucas conversas para comparar.",
    whenToAdjust:
      "Ajuste primeiro a oferta, o criativo ou o atendimento quando os contatos repetirem a mesma dúvida.",
  },
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
    campaignSetupGuide: {
      objective: fit(
        `Criar uma campanha simples para ${goal}, com foco em ${offer}.`,
        180,
      ),
      channel: fit(
        `Direcionar os interessados para ${mainChannel}, onde o atendimento deve continuar.`,
        120,
      ),
      initialBudget: fit(
        `Começar com ${dailyBudget} e manter esse valor estável durante o primeiro teste.`,
        180,
      ),
      location: fit(`Anunciar somente em ${region} e na área atendida.`, 160),
      audience: fit(
        `Usar como ponto de partida ${audience}, sem adicionar filtros demais.`,
        220,
      ),
      durationSuggestion:
        "Observar por pelo menos 7 dias, se o valor total couber no caixa.",
      whatNotToChangeEarly:
        "Não trocar público, criativo e orçamento ao mesmo tempo nos primeiros dias.",
    },
    creativePack: [
      {
        title: "Oferta em destaque",
        format: "Feed quadrado",
        visualIdea: fit(
          `Fotografe ${offer} em uma situação real e destaque visualmente ${differentiator}.`,
          220,
        ),
        textOnCreative: fit(`Conheça ${offer}`, 100),
        caption: fit(
          `${businessName} apresenta ${offer} para quem está em ${region}. ${differentiator}. Fale pelo ${mainChannel} e tire suas dúvidas.`,
          300,
        ),
        callToAction: fit(`Falar pelo ${mainChannel}`, 80),
        aiImagePrompt: fit(
          `Foto publicitária realista de ${offer} em um pequeno negócio brasileiro, luz natural, aparência autêntica, contexto de ${businessType}, sem texto e sem marcas inventadas.`,
          300,
        ),
        productionTip:
          "Use uma foto real perto de uma janela, com fundo limpo e o produto ou serviço como foco.",
      },
      {
        title: "Bastidores da oferta",
        format: "Story/Reels vertical",
        visualIdea: fit(
          `Grave três cenas curtas mostrando a preparação, um detalhe e a entrega de ${offer}.`,
          220,
        ),
        textOnCreative: "Veja como preparamos tudo",
        caption: fit(
          `Veja um pouco do cuidado da ${businessName} com ${offer}. Quer entender como funciona? Converse com a gente pelo ${mainChannel}.`,
          300,
        ),
        callToAction: fit(`Chamar no ${mainChannel}`, 80),
        aiImagePrompt: fit(
          `Sequência vertical realista dos bastidores de ${offer}, equipe de pequeno negócio brasileiro trabalhando, detalhes do processo, luz natural e sem textos.`,
          300,
        ),
        productionTip:
          "Grave na vertical três cenas de 2 a 3 segundos e mantenha o celular firme.",
      },
      {
        title: "Diferencial explicado",
        format: "Vídeo curto",
        visualIdea: fit(
          `Uma pessoa da ${businessName} explica em uma frase por que ${differentiator} faz diferença para quem procura ${offer}.`,
          220,
        ),
        textOnCreative: fit(differentiator, 100),
        caption: fit(
          `Procurando ${offer} em ${region}? Conheça como a ${businessName} trabalha e envie uma mensagem para tirar suas dúvidas.`,
          300,
        ),
        callToAction: "Tirar uma dúvida",
        aiImagePrompt: fit(
          `Retrato realista de profissional de ${businessType} falando com a câmera, ambiente de trabalho ao fundo, expressão acolhedora, luz natural e sem texto.`,
          300,
        ),
        productionTip:
          "Apoie o celular, grave em local silencioso e explique o diferencial em até 15 segundos.",
      },
    ],
    whatsappScript: {
      firstReply: fit(
        `Olá! Obrigado por chamar a ${businessName}. Você quer saber mais sobre ${offer} ou tem uma dúvida específica?`,
        240,
      ),
      priceReply: fit(
        `Claro! O valor de ${offer} é [informe o valor]. Posso explicar o que está incluído e confirmar se atende ao que você procura.`,
        240,
      ),
      objectionReply: fit(
        `Entendo sua dúvida sobre ${offer}. O que você gostaria de comparar ou confirmar antes de decidir?`,
        240,
      ),
      closingReply: fit(
        `Se fizer sentido para você, posso orientar agora o próximo passo para solicitar ${offer}, sem compromisso.`,
        240,
      ),
      followUpReply: fit(
        `Olá! Passando apenas para saber se ficou alguma dúvida sobre ${offer}. Se não for o momento, tudo bem.`,
        240,
      ),
    },
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
