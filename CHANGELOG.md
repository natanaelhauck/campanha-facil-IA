# Changelog

Todas as mudanças relevantes do projeto serão resumidas neste arquivo.

## Base Opcional De Contas E Histórico Em Nuvem

- Adicionada dependência `@supabase/supabase-js` e configuração pública opcional `NEXT_PUBLIC_SUPABASE_ENABLED`, `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Criado cliente Supabase opcional, sem service role e sem inicialização quando a configuração está incompleta.
- Criada página `/entrar` com magic link quando Supabase está habilitado e aviso amigável quando desligado.
- Adicionada abstração `campaignStorage` para manter `localStorage` no modo visitante e usar a tabela `campaigns` quando houver sessão Supabase.
- Atualizado `/historico` para continuar local sem Supabase e listar/remover campanhas em nuvem quando o usuário estiver logado.
- Atualizado `/resultado` com botão opcional `Salvar na conta` apenas para usuários logados.
- Criada migration SQL `supabase/migrations/001_create_campaigns.sql` com RLS por `auth.uid()`.
- Adicionados eventos seguros `auth_page_viewed`, `login_magic_link_requested`, `cloud_campaign_saved`, `cloud_history_opened` e `cloud_campaign_deleted`, sem e-mail ou conteúdo de campanha.
- Atualizados E2E e documentação para validar Supabase desligado e preservar o modo visitante.

## Resultado Como Campanha Guiada

- Transformada a primeira dobra de `/resultado` em um painel de lançamento com `Campanha pronta para revisão`.
- Adicionado tipo `CampaignDraft`, derivado do plano atual, com campos preparados para futura integração Meta Ads sem conexão real.
- O painel agora destaca objetivo, público, região, orçamento, duração, canal, CTA e próxima ação.
- Adicionadas seções abertas para passos de publicação, textos principais do anúncio e criativo principal recomendado.
- O plano completo, PDF e detalhes longos foram movidos para `Material de apoio`, recolhido por padrão.
- Adicionada cópia da campanha pronta com evento seguro `campaign_draft_copied`.
- Adicionados eventos seguros `result_full_plan_opened` e `result_primary_action_clicked`, sem conteúdo sensível.
- E2E atualizado para validar campanha pronta, material de apoio, cópias, PDF e mobile sem overflow.

## Resultado Em Seções Recolhíveis

- Reorganizada a página `/resultado` com um bloco curto `Comece por aqui`.
- Adicionado componente reutilizável de seção recolhível, com botão acessível, `aria-expanded` e `aria-controls`.
- Mantidas abertas por padrão as seções principais: próximos passos, plano de ação de 7 dias, textos de anúncio e pacote de criativos.
- Configuração, WhatsApp, métricas, checklist, passo a passo, ideias secundárias e acompanhamento passaram a poder ficar recolhidos por padrão.
- A navegação rápida abre seções recolhidas antes de rolar para o destino, preservando IDs existentes.
- Adicionado evento interno seguro `result_section_toggled`, sem conteúdo do plano.
- E2E atualizado para validar abertura manual, abertura por atalho, cópias, PDF, histórico e mobile sem overflow.

## Plano De Ação De 7 Dias

- Adicionado `sevenDayActionPlan` ao resultado da campanha, com exatamente sete dias em respostas novas de IA.
- Cada dia inclui título, objetivo, tarefas práticas, entrega esperada e cuidado para evitar decisões apressadas.
- Atualizados schema, validação, prompt e mock para gerar uma rotina simples da primeira semana.
- Adicionada seção `Plano de ação de 7 dias` em `/resultado`, ocultada para planos antigos sem esse campo.
- Adicionado botão `Copiar plano de ação`, com evento seguro `action_plan_copied`.
- O texto completo e o PDF passaram a incluir o plano de ação quando disponível.
- E2E atualizado para validar os sete dias, cópia da rotina, PDF, histórico e mobile sem overflow.

## Guia De Criativos Da Campanha

- Evoluído o `creativePack` para incluir objetivo, guia de cena, materiais necessários, dica de layout no Canva, passos de produção, erros a evitar e briefing pronto para copiar.
- Atualizados schema, validação e prompt para exigir os novos campos em respostas novas, mantendo planos antigos compatíveis.
- Atualizado o mock com exemplos realistas e executáveis para produção com celular e editor simples.
- Melhorada a seção `Pacote de criativos` em `/resultado`, com leitura mais prática e botão `Copiar briefing do criativo`.
- O texto completo e o PDF passaram a incluir o guia de produção de cada criativo.
- Adicionado evento interno seguro `creative_briefing_copied`, sem envio do conteúdo do briefing.
- Atualizado E2E para validar os três criativos, cópia do briefing, PDF, histórico e mobile sem overflow.

## Briefing Mais Completo Da Campanha

- Ampliado o formulário `/criar-campanha` com campos opcionais e estruturados para tom de comunicação, fotos/vídeos disponíveis, disponibilidade para responder WhatsApp e principal dificuldade atual.
- Reorganizadas as seções do formulário para manter o preenchimento simples para pessoas leigas.
- Atualizados tipos, validação do endpoint, parsers de `localStorage` e histórico para preservar dados antigos sem os novos campos.
- Atualizado o prompt compartilhado por OpenAI e Gemini para enviar apenas campos preenchidos e usar o novo briefing sem inventar informações.
- Atualizado o mock para adaptar criativos, WhatsApp, próximos passos e métricas aos novos campos quando informados.
- O texto copiado e o PDF passaram a incluir uma seção de dados do briefing.
- Analytics interno passou a aceitar apenas enums seguros para tom de comunicação e disponibilidade de fotos/vídeos.
- E2E atualizado para preencher o novo formulário, validar resultado, histórico, PDF, preservação ao ajustar informações e mobile sem overflow.

## Validação Beta Controlada

- Criada a página `/beta` com proposta, público, roteiro de teste, limites e próximos recursos possíveis.
- Adicionado link discreto para o programa beta no rodapé.
- Adicionados CTAs opcionais de feedback e ajuda em `/resultado`.
- Criadas `NEXT_PUBLIC_FEEDBACK_URL` e `NEXT_PUBLIC_HELP_URL`, sem envio automático de dados.
- Adicionados os eventos internos `beta_page_viewed`, `feedback_clicked` e `help_clicked`.
- Criado `docs/BETA_VALIDATION.md` com perfil de teste, perguntas, sinais e métricas manuais.
- Atualizado o E2E para validar página beta e canais externos configurados em modo mock.

## Preparação Para Vercel

- Fixada a versão Node.js `24.x` usada no build da plataforma.
- Declarado runtime Node.js nas rotas server-side.
- Criada a rota segura e sem cache `GET /api/health`.
- Atualizada a metadata do app para beta com `noindex` e `nofollow`.
- Adicionado `/robots.txt` bloqueando indexação enquanto o beta não for liberado para busca.
- Documentadas configuração Vercel, variáveis por provedor e validações pós-deploy.
- Adicionados E2E para health check, resposta mínima e bloqueio de indexação.

## Preparação Para Beta Público

### Documentação E Configuração

- Criado `docs/DEPLOYMENT.md` com variáveis, modos mock/OpenAI/Gemini, cuidados com segredos e checklist de publicação e reversão.
- Revisado `.env.example` com os controles atuais de geração, timeout, rate limit, modelos e limite de saída.
- Documentado que o rate limit em memória não protege múltiplas instâncias ou ambientes serverless e deve ser complementado antes do beta com IA real.
- README, estado atual, roadmap, contexto técnico, testes e analytics foram atualizados para refletir a preparação.

### Privacidade E Termos

- Criadas as páginas `/privacidade` e `/termos` em linguagem simples.
- Adicionados links legais discretos no rodapé global.
- A política explica dados do formulário, histórico no navegador, provedores reais, ausência de analytics externo e cuidado com dados sensíveis.
- Os termos reforçam orientação inicial, ausência de garantia, revisão humana, responsabilidade do usuário e inexistência de integração com Meta Ads.
- O E2E passou a verificar links legais, carregamento das páginas e avisos orientativos no resultado e no texto copiado.

## Analytics Com Privacidade

### Camada Interna De Eventos

- Criado `trackEvent` com 10 eventos principais do funil e da utilização do plano.
- Adicionada whitelist tipada e sanitização em runtime para propriedades seguras.
- Canal e experiência são normalizados para enums sem texto livre.
- Nome do negócio, localização, oferta, público e conteúdo do plano não entram nos eventos.
- Em desenvolvimento, eventos são registrados no console; em produção, a função é no-op.
- Formulário, geração, cópia, PDF, histórico e ajuste de informações foram instrumentados.
- PostHog permanece apenas como possibilidade futura, sem SDK ou envio externo.

## Histórico Local

### Planos Anteriores No Navegador

- Adicionada página `/historico` com estado vazio, lista dos planos, origem, data, objetivo e canal.
- Cada geração bem-sucedida salva uma cópia em `campaign-plan-history`, limitada aos 10 itens mais recentes.
- Planos anteriores podem ser restaurados como resultado atual ou excluídos individualmente.
- Conteúdo ausente, legado ou corrompido no histórico não quebra o fluxo atual.
- Adicionado acesso discreto ao histórico na navegação principal.
- A interface esclarece que não há conta ou sincronização e que limpar o navegador pode apagar os planos.
- O E2E passou a cobrir criação, abertura, exclusão e estado vazio do histórico local.

## Qualidade Técnica

### Segurança E Controle De Custo Da IA

- Adicionado timeout configurável e limitado para OpenAI e Gemini.
- Desabilitados retries automáticos nos dois provedores para evitar custo duplicado.
- O endpoint passou a limitar o body durante a leitura e aceitar somente JSON.
- Adicionado rate limit simples em memória, com `429`, `Retry-After` e documentação explícita da limitação em ambientes serverless.
- Reforçada a separação entre instruções do sistema e dados não confiáveis do formulário.
- Adicionados testes E2E para payload excessivo e limite de frequência em modo mock.
- Registrado o advisory moderado transitivo do PostCSS sem aplicar downgrade inseguro sugerido por `npm audit fix --force`.

### Testes E2E Do Fluxo Principal

- Adicionado `@playwright/test` com configuração compatível com o servidor Next.js.
- Criada suíte E2E versionada para formulário, geração mock, resultado, três criativos, seções principais, cópia, PDF, persistência, edição e regeneração.
- Adicionado cenário mobile em 390 px para overflow horizontal e navegação rápida.
- O servidor dos testes usa porta dedicada, força `AI_PROVIDER=mock`, desabilita geração real e não depende de chaves.
- Adicionados scripts para execução headless e com navegador visível.
- Relatórios e artefatos locais do Playwright passaram a ser ignorados pelo Git.

## Estratégia

### Posicionamento Frente A MCPs E Conectores Meta Ads

- Registrada a decisão de não posicionar o Campanha Fácil IA como apenas mais um conector técnico de Meta Ads.
- Reforçado o foco em camada guiada, simples e segura para pequenos negócios e pessoas leigas.
- Meta Ads MCP/API passa a ser tratado como possível infraestrutura futura para leitura de dados, diagnóstico e ações assistidas.
- Documentada a exigência de consentimento e confirmação humana antes de qualquer ação que possa alterar campanhas reais ou gastar dinheiro.

## Fase 2: Base De IA Real

### Usabilidade Do Pacote De Execução

- Adicionada ação para copiar o plano completo em texto simples, com feedback de sucesso e tratamento de erro.
- Adicionada exportação client-side do plano em PDF paginado, reutilizando o conteúdo textual já formatado.
- O gerador de PDF é carregado somente ao clicar e mantém compatibilidade com planos antigos.
- Corrigida a legibilidade do PDF com normalização de pontuação, remoção de caracteres invisíveis e quebra de linha sem separar palavras.
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
