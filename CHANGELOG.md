# Changelog

Todas as mudanças relevantes do projeto serão resumidas neste arquivo.

## Estratégia

### Posicionamento Frente A MCPs E Conectores Meta Ads

- Registrada a decisão de não posicionar o Campanha Fácil IA como apenas mais um conector técnico de Meta Ads.
- Reforçado o foco em camada guiada, simples e segura para pequenos negócios e pessoas leigas.
- Meta Ads MCP/API passa a ser tratado como possível infraestrutura futura para leitura de dados, diagnóstico e ações assistidas.
- Documentada a exigência de consentimento e confirmação humana antes de qualquer ação que possa alterar campanhas reais ou gastar dinheiro.

## Fase 2: Base De IA Real

### Usabilidade Do Pacote De Execução

- Adicionada ação para copiar o plano completo em texto simples, com feedback de sucesso e tratamento de erro.
- O texto copiado reúne as seções disponíveis do pacote e omite blocos ausentes em planos antigos.
- Adicionada navegação rápida e responsiva para configuração, criativos, WhatsApp, métricas e checklist.
- Padronizados IDs estáveis nas principais seções, mantendo a rolagem suave em cliques repetidos.

### Pacote De Execução Da Campanha

- O resultado evoluiu de plano inicial para pacote com configuração sugerida, três briefings de criativos, roteiro de WhatsApp e guia simples de métricas.
- Legendas, prompts visuais e respostas de atendimento passaram a ter ações de cópia.
- Os prompts de imagem são apenas briefings; nenhuma imagem real é gerada nesta fase.
- Planos antigos no `localStorage` continuam renderizando sem as novas seções.
- OpenAI e Gemini passaram a exigir o pacote completo, mantendo fallback mock para respostas incompletas.

### Qualidade Dos Planos Gerados

- Refinado o prompt compartilhado por OpenAI e Gemini para gerar orientações mais práticas, específicas e adequadas a pessoas leigas.
- Padronizados três papéis para textos de anúncio, cinco próximos passos concretos e acompanhamento em 3, 7 e 14 dias.
- Reforçadas as regras de orçamento conservador, prioridade ao canal informado e ausência de aumento automático de verba.
- Adicionada validação local contra promessas claras e próximos passos vagos, mantendo fallback mock para respostas inválidas.
- Atualizado o plano mock para refletir as mesmas orientações operacionais.

### Gemini Como Provedor Alternativo

- Adicionada dependência oficial `@google/genai`.
- Criado provedor Gemini com saída JSON estruturada e validação pelo contrato `CampaignPlanResult`.
- Adicionada seleção por `AI_PROVIDER`, mantendo OpenAI e fallback mock.
- Definido `mock` como padrão seguro para evitar chamadas acidentais.
- Adicionado registro do provedor efetivo em `campaign-plan-provider`.

### OpenAI API Com Fallback Mock

- Adicionada dependência oficial `openai`.
- Criado endpoint `POST /api/generate-campaign` para gerar o plano no backend do Next.js.
- Adicionados prompt builder, schema de saída estruturada e serviço de geração com OpenAI Responses API.
- Criado fallback mock quando `OPENAI_API_KEY` está ausente, quando `AI_GENERATION_ENABLED=false` ou quando a geração falha.
- O formulário passou a salvar dados, plano gerado e origem do resultado no `localStorage`.
- A página `/resultado` passou a priorizar o plano salvo e manter fallback local quando necessário.
- Criado `.env.example` sem chave real.

## MVP Visual Funcional

### MVP Inicial

- Projeto Next.js criado com TypeScript, App Router, Tailwind CSS e ESLint.
- Criadas as rotas `/`, `/criar-campanha` e `/resultado`.
- Adicionados componentes básicos reutilizáveis.
- Implementado fluxo inicial com `localStorage`.

### Melhoria De Textos E Fluxo

- Textos revisados em português do Brasil.
- Fluxo principal ficou mais claro para usuários leigos.
- Resultado passou a exibir plano simulado com personalização local.
- Avisos de orientação sem garantia foram reforçados.

### Correção Do Resultado E localStorage

- Corrigida a leitura do plano em `/resultado`.
- Padronizada a chave `campaign-form-data`.
- Adicionado parse seguro e estado vazio amigável.

### Documentação Base

- Adicionado `AGENTS.md`.
- Criados documentos em `docs/` para produto, roadmap, decisões, contexto técnico, testes e histórico de prompts.

### Melhoria Visual Do Resultado

- Página `/resultado` reorganizada com hierarquia visual mais clara.
- Adicionados próximos passos recomendados, cards de resumo, checklist e acompanhamento.
- Textos de anúncio passaram a ter botão de copiar.

### Correção De Âncoras

- Botões de rolagem com hash passaram a usar `scrollIntoView`.
- Corrigidos cliques repetidos em `Ver como funciona`, `Ver próximos passos` e `Voltar ao topo`.

### Melhoria Visual Do Formulário

- `/criar-campanha` passou a ser um formulário guiado por seções.
- Dados salvos agora são carregados ao ajustar informações.
- Textos de ajuda foram refinados para usuários leigos.

### Melhoria Visual Da Home

- Página inicial ganhou hero mais claro, prévia mais rica do produto e microcopy de confiança.
- Benefícios foram ajustados para dores reais de pequenos negócios.
- Adicionada seção curta de posicionamento e passos mais práticos em `Como funciona`.
