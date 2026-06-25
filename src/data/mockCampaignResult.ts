import type { CampaignResult } from "@/types/campaign";

export const mockCampaignResult: CampaignResult = {
  recommendedObjective: "Mensagens no WhatsApp para gerar conversas com pessoas prontas para comprar.",
  suggestedAudience:
    "Pessoas próximas da cidade ou região informada, com interesses relacionados ao tipo de negócio e comportamento de compra local.",
  initialBudget:
    "Comece com um orçamento diário baixo e consistente por pelo menos 7 dias, ajustando depois conforme o custo por conversa.",
  adTexts: [
    "Precisa resolver isso hoje? Fale com a gente no WhatsApp e receba uma orientação simples em poucos minutos.",
    "Atendimento local, direto e sem complicação. Conheça nossa solução e tire suas dúvidas pelo WhatsApp.",
    "Oferta especial para quem está na região. Chame agora e veja como podemos ajudar.",
  ],
  creativeIdeas: [
    "Foto real do produto, equipe ou ambiente, com texto curto destacando o principal benefício.",
    "Video vertical simples mostrando antes e depois, bastidores ou demonstração rápida.",
    "Imagem com prova social: depoimento curto, avaliação de cliente ou resultado entregue.",
  ],
  setupSteps: [
    "Abra o Gerenciador de Anuncios da Meta e escolha criar uma nova campanha.",
    "Selecione o objetivo recomendado e defina a região de atendimento.",
    "Configure o público usando interesses amplos e linguagem simples.",
    "Adicione os textos e criativos, mantendo uma chamada clara para o canal principal.",
    "Publique com orçamento controlado e acompanhe os primeiros resultados diariamente.",
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
        "Verifique se a campanha está recebendo impressões e cliques.",
        "Leia as primeiras conversas para identificar dúvidas comuns.",
      ],
    },
    {
      period: "7 dias",
      actions: [
        "Compare custo por conversa e qualidade dos contatos.",
        "Pause textos ou criativos com baixo retorno e mantenha os melhores.",
      ],
    },
    {
      period: "14 dias",
      actions: [
        "Aumente o orçamento aos poucos se houver retorno comercial.",
        "Teste um novo criativo usando aprendizados das primeiras conversas.",
      ],
    },
  ],
};
