# Contexto Técnico

## Stack Atual

- Next.js com App Router.
- TypeScript.
- Tailwind CSS.
- ESLint.
- Playwright Test para testes E2E versionados.
- jsPDF para geração client-side do documento exportável.
- React Client Components para páginas que acessam `localStorage`.
- Rota backend no App Router para geração de plano.
- SDKs de OpenAI e Gemini usados apenas no servidor.

## Estrutura De Pastas Atual

```text
src/
  app/
    api/health/route.ts
    api/generate-campaign/route.ts
    beta/page.tsx
    criar-campanha/page.tsx
    historico/page.tsx
    privacidade/page.tsx
    resultado/page.tsx
    robots.ts
    termos/page.tsx
    globals.css
    layout.tsx
    page.tsx
  components/
    Button.tsx
    BetaFeedbackCard.tsx
    BetaPageViewTracker.tsx
    CampaignResultSection.tsx
    Card.tsx
    Footer.tsx
    Header.tsx
    Input.tsx
    Select.tsx
    Textarea.tsx
  data/mockCampaignResult.ts
  lib/analytics.ts
  lib/campaignPlanHistory.ts
  lib/downloadCampaignPlanPdf.ts
  lib/formatCampaignPlanText.ts
  lib/ai/
    buildCampaignPrompt.ts
    campaignRateLimit.ts
    campaignPlanSchema.ts
    generateCampaignPlan.ts
  types/campaign.ts
tests/
  e2e/api-security.spec.ts
  e2e/deployment-readiness.spec.ts
  e2e/main-flow.spec.ts
playwright.config.ts
```

## Fluxo Atual Completo

1. O usuário acessa `/`.
2. A home apresenta a proposta de valor, uma prévia do plano, benefícios e a seção `#como-funciona`.
3. O usuário clica em `Criar minha campanha` ou `Começar`.
4. Em `/criar-campanha`, preenche um formulário guiado por seções: negócio/região, oferta, público/dificuldade e configuração inicial.
5. Ao enviar, o formulário chama `POST /api/generate-campaign`.
6. A rota valida os campos obrigatórios e chama o serviço de geração.
7. O serviço lê `AI_PROVIDER` e seleciona `mock`, `openai` ou `gemini`.
8. Com um provedor real selecionado e `AI_GENERATION_ENABLED` diferente de `false`, o serviço tenta gerar um pacote estruturado. Chave ausente, geração desabilitada, resposta incompleta ou erro retornam fallback mock compatível.
9. O client salva os dados do formulário, o plano gerado e a origem do plano no `localStorage`.
10. A mesma geração é adicionada ao histórico local, com limite de 10 itens e leitura tolerante a conteúdo corrompido.
11. O usuário é redirecionado para `/resultado`.
12. A página de resultado lê o plano salvo no client. Se não houver plano salvo, mantém fallback local com base nos dados do formulário.
13. O usuário pode clicar em `Ajustar informações` para voltar ao formulário com os dados anteriores carregados.
14. Em `/historico`, o usuário pode restaurar um item como plano atual ou excluí-lo.

## Uso Atual De localStorage

As chaves atuais são:

- `campaign-form-data`: dados preenchidos no formulário.
- `campaign-plan-result`: plano retornado pelo endpoint ou fallback mock.
- `campaign-plan-source`: origem do plano, `ai` ou `mock`.
- `campaign-plan-provider`: provedor efetivo do plano, `openai`, `gemini` ou `mock`.
- `campaign-plan-history`: array com até 10 planos anteriores, ordenados do mais recente para o mais antigo.

O `localStorage` é usado apenas como persistência temporária do MVP. Ele não substitui banco de dados e não deve ser usado para dados sensíveis.

Em `/criar-campanha`, a leitura acontece no client com `useEffect`, parse seguro e preenchimento do formulário quando há dados válidos. Isso permite editar informações anteriores ao voltar de `/resultado`. Os campos opcionais do briefing usam fallback vazio, então dados antigos sem `communicationTone`, `hasVisualAssets`, `hasWhatsappResponder` ou `currentChallenge` continuam válidos.

Em `/resultado`, a leitura também acontece no client, com `useEffect`, `try/catch` no `JSON.parse` e estado amigável quando os dados não existem ou são inválidos. A página prioriza `campaign-plan-result` quando ele existe. Planos antigos sem o pacote de execução continuam válidos; as novas seções são opcionais na leitura e não são renderizadas quando ausentes.

`campaignPlanHistory.ts` centraliza as chaves atuais e valida cada item do histórico antes de usá-lo. Entradas inválidas são descartadas; JSON corrompido vira uma lista vazia. Ao abrir um item, formulário, plano, origem e provedor voltam para as chaves atuais antes do redirecionamento a `/resultado`.

O histórico é local e pode desaparecer quando o usuário limpa dados do navegador, usa navegação privada ou troca de dispositivo. Ele não representa persistência de conta nem deve armazenar dados sensíveis.

## Geração Com IA

A camada de provedores fica em `src/lib/ai/` e `src/app/api/generate-campaign/route.ts`.

- `buildCampaignPrompt.ts` monta instruções em português do Brasil para um pacote com configuração, três guias de produção de criativos, roteiro de atendimento, métricas simples, orçamento conservador e nenhuma promessa de resultado.
- O prompt envia somente campos preenchidos do formulário e orienta os providers a usar tom de comunicação, fotos/vídeos disponíveis, disponibilidade no WhatsApp e dificuldade atual sem inventar dados ausentes.
- `campaignPlanSchema.ts` exige três textos de anúncio, cinco próximos passos, plano de ação de 7 dias, acompanhamento em 3, 7 e 14 dias, três criativos com guia de produção e as quatro seções do pacote de execução.
- `generateCampaignPlan.ts` seleciona `mock`, OpenAI ou Gemini e centraliza o fallback.
- `generateCampaignPlanWithOpenAI.ts` usa OpenAI Responses API com Structured Outputs.
- `generateCampaignPlanWithGemini.ts` usa `@google/genai`, `generateContent`, JSON Schema e validação local.
- `campaignPlanProvider.ts` contém o contrato comum, modelos padrão e parse seguro do plano.
- `campaignPlanValidation.ts` aceita planos legados sem as novas seções para leitura do `localStorage`, mas exige o pacote completo nas respostas novas dos providers. Também valida quantidades, limites e promessas claras.
- A rota `POST /api/generate-campaign` aceita dados do formulário, limita tamanho do payload, valida campos obrigatórios, normaliza textos, aceita extras opcionais do briefing e retorna `{ success, data, source, provider, warning }`.
- A rota `GET /api/health` retorna somente status, identificador do app, timestamp e ambiente normalizado, com cache desabilitado.
- As duas rotas declaram runtime Node.js explicitamente para manter compatibilidade previsível na Vercel.
- O body é lido como stream até o limite de 8 KB, evitando manter um payload arbitrariamente grande em memória antes da rejeição. A rota aceita somente `application/json`.
- `campaignRateLimit.ts` aplica um limite em memória por identificador de cliente, com padrão de 10 requisições por 60 segundos e no máximo 1.000 buckets ativos.
- Em `development`, a rota também retorna `debug` com provedor tentado, modelo, geração habilitada, status da API e motivo do fallback. Esse bloco não é retornado em produção.
- O cliente OpenAI usa `maxRetries: 0`. Assim, erros de cota, autenticação ou configuração caem imediatamente no fallback e não geram tentativas reais adicionais automáticas.
- OpenAI e Gemini usam `AI_REQUEST_TIMEOUT_MS`, limitado entre 5 e 60 segundos. O Gemini define `retryOptions.attempts=1`, removendo o padrão do SDK de múltiplas tentativas.

Variáveis esperadas:

```bash
AI_PROVIDER=mock
AI_REQUEST_TIMEOUT_MS=30000
AI_RATE_LIMIT_ENABLED=true
AI_RATE_LIMIT_MAX_REQUESTS=10
AI_RATE_LIMIT_WINDOW_MS=60000
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4.1-mini
OPENAI_MAX_OUTPUT_TOKENS=4200
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.5-flash
AI_GENERATION_ENABLED=true
```

`.env.local` deve ficar local e ignorado pelo Git. A variável correta é `GEMINI_API_KEY`; `GEMINI_API_LEY` não é reconhecida. Sem chave real, o modo mock continua funcionando.

`AI_PROVIDER` aceita `mock`, `openai` ou `gemini`. O valor padrão é `mock`, inclusive quando a variável não existe. Os modelos padrão são `gpt-4.1-mini` e `gemini-2.5-flash`, mas a disponibilidade depende de cada conta e projeto.

`OPENAI_MAX_OUTPUT_TOKENS` controla o tamanho máximo da resposta. O serviço aplica um intervalo defensivo entre 3000 e 6000 tokens, com padrão 4200.

O Gemini usa limite de 4200 tokens para comportar o pacote estruturado e desabilita thinking nos modelos `gemini-2.5-flash*`. Limites gratuitos variam por projeto e modelo e devem ser conferidos no Google AI Studio.

Os motivos de fallback distinguem provedor inválido, chave ausente, geração desabilitada, cota insuficiente, autenticação, modelo indisponível, erro de API, resposta incompleta, recusa, resposta vazia, JSON inválido e falha de validação.

Os motivos também distinguem timeout sem expor mensagem bruta, stack trace, chave, header ou payload. Logs e o bloco `debug` continuam restritos a `development` e contêm somente metadados operacionais.

## Segurança E Controle De Custo

- O prompt delimita os dados do usuário como conteúdo não confiável e instrui o modelo a ignorar tentativas de mudar regras, papel ou revelar instruções.
- Essa mitigação não torna modelos imunes a prompt injection. Schema estrito, validação local e ausência de ferramentas com efeitos reais continuam sendo as barreiras principais.
- O limite de body, os limites por campo e o total de 1.800 caracteres reduzem abuso e custo por chamada.
- O timeout limita espera no servidor, mas uma operação já aceita pelo provedor ainda pode gerar cobrança mesmo quando o cliente abandona a resposta.
- O rate limit em memória é útil em desenvolvimento, servidor único e como proteção parcial por instância aquecida.
- Em serverless, reinícios e múltiplas instâncias mantêm contadores independentes. `x-forwarded-for` só é confiável quando o proxy de entrada remove valores enviados diretamente pelo cliente.
- Antes do beta público, o rate limit deve migrar para gateway ou armazenamento distribuído, com chave por usuário quando houver autenticação. A implementação atual não deve ser tratada como proteção completa de produção.

## Comportamentos Client-Side Atuais

- `analytics.ts` oferece `trackEvent` com nomes e propriedades tipados, sanitização por whitelist, log seguro somente em `development` e no-op em `production`.
- O componente `Button` trata links internos com hash usando `scrollIntoView({ behavior: "smooth" })`, para que botões como `Ver como funciona`, `Ver próximos passos` e `Voltar ao topo` funcionem repetidamente.
- A página `/resultado` usa `navigator.clipboard.writeText` para copiar o plano completo, textos de anúncio, legendas, prompts visuais e respostas do WhatsApp, com feedback simples de sucesso ou erro.
- A página `/resultado` usa seções recolhíveis acessíveis para conteúdos de consulta. O cabeçalho da seção continua visível, o botão usa `aria-expanded`/`aria-controls` e a navegação rápida abre o destino antes de rolar.
- Cada criativo também possui um botão para copiar o briefing completo de produção, incluindo cena, materiais, passos, Canva e erros a evitar.
- O plano de ação de 7 dias possui seção própria, aparece no texto/PDF e pode ser copiado sem registrar tarefas em analytics.
- `formatCampaignPlanText.ts` transforma formulário e `CampaignPlanResult` em texto simples organizado. Seções opcionais ausentes são omitidas, sem JSON ou identificação técnica de provider/source.
- `downloadCampaignPlanPdf.ts` recebe o texto já formatado, cria um PDF A4 com quebra de linhas, múltiplas páginas, títulos e rodapés e inicia o download no navegador.
- O módulo de PDF e o `jsPDF` são carregados por import dinâmico somente quando o usuário solicita o download, evitando custo no carregamento inicial da página.
- A navegação rápida de `/resultado` aponta para IDs estáveis e inclui somente seções presentes no plano quando aplicável. Os destinos usam o mesmo comportamento repetível de rolagem suave do componente `Button` e preservam compatibilidade com planos antigos.
- O formulário em `/criar-campanha` usa validação HTML simples com campos obrigatórios e selects opcionais para sinais do briefing ampliado.
- O envio do formulário mantém a chave `campaign-form-data` compatível com `/resultado` e adiciona o plano salvo quando a API responde.
- O envio também adiciona uma cópia validável ao histórico local sem impedir o fluxo principal caso essa gravação secundária falhe.

## Analytics Interno

A instrumentação atual não usa SDK externo, cookies ou persistência. Os eventos cobrem formulário, geração, cópia, PDF, histórico, ajuste de informações, abertura de seções do resultado e interações da validação beta.

As únicas propriedades aceitas são origem, provedor, canal normalizado, nível de experiência normalizado, tom de comunicação normalizado, disponibilidade de fotos/vídeos normalizada, identificador técnico de seção do resultado, estado aberto/recolhido, presença de histórico, status do resultado e categoria genérica de erro. Nome do negócio, localização, oferta, público, dificuldade atual, orçamento e qualquer texto livre são proibidos.

A proteção existe em dois níveis: o tipo `AnalyticsProperties` restringe os pontos de chamada e `sanitizeProperties` reconstrói uma whitelist antes de qualquer log. Uma futura integração com PostHog deve ser implementada apenas dentro de `trackEvent` e preservar essas regras.

`BetaFeedbackCard` lê somente `NEXT_PUBLIC_FEEDBACK_URL` e `NEXT_PUBLIC_HELP_URL`, aceita URLs HTTP(S), abre o destino em nova aba e não anexa dados do plano. `BetaPageViewTracker` registra a abertura de `/beta` sem propriedades.

## Páginas Legais E Preparação De Deploy

`/privacidade` e `/termos` são Server Components estáticos, sem coleta adicional de dados. O `Footer` é renderizado pelo layout raiz e mantém os dois links disponíveis em todas as rotas.

`docs/DEPLOYMENT.md` centraliza variáveis de ambiente, modos de provedor, cuidados com segredos, configuração recomendada, checklist de publicação e reversão. Nenhum script do projeto realiza deploy.

O rate limit atual continua local ao processo. Para um beta público com IA real em múltiplas instâncias ou serverless, uma proteção distribuída ou da plataforma é requisito operacional.

A metadata raiz identifica a versão como beta e usa `noindex`/`nofollow`. `robots.ts` também bloqueia crawling enquanto não houver decisão explícita de indexação pública.

## O Que Ainda Não Existe

- Não há Supabase.
- Não há login.
- Não há banco de dados.
- Não há histórico remoto, sincronizado ou associado a usuário.
- Não há publicação automática de campanhas.
- Não há integração com Meta Ads API.
- Não há geração real de imagens; `aiImagePrompt` é apenas um briefing textual.
- Não há cobrança, planos pagos ou painel SaaS completo.

## Testes E2E

A suíte em `tests/e2e/main-flow.spec.ts` usa `@playwright/test` com Chromium. Ela protege o fluxo principal em desktop, incluindo formulário com briefing ampliado, resposta mock, resultado, aviso orientativo, três criativos, plano de ação de 7 dias, seções recolhíveis, cópia do briefing de criativo, seções do pacote, cópia, PDF, persistência dos novos campos, edição, regeneração, histórico local e páginas legais.

Um segundo cenário usa viewport de 390 px para verificar overflow horizontal, acesso à navegação rápida e abertura de seção recolhida pelo atalho. A suíte também valida criação, restauração, exclusão, estado vazio e JSON corrompido no histórico. `api-security.spec.ts` valida o limite de body e o bloqueio temporário por frequência. `deployment-readiness.spec.ts` valida `/api/health`, ausência de campos extras, cache desabilitado e bloqueio de indexação. O `playwright.config.ts` inicia um servidor dedicado na porta 3100 com `AI_PROVIDER=mock`, geração real desabilitada e chaves de provedores vazias. O servidor não é reutilizado, evitando que os testes se conectem acidentalmente a uma instância configurada com IA real.

Os comandos disponíveis são `npm run test:e2e` para execução headless e `npm run test:e2e:headed` para execução com navegador visível. O Chromium precisa ser instalado uma vez por máquina com `npx playwright install chromium`.

## Limites Da Base Atual De IA

A Fase 2 inicial adiciona a base backend para geração de plano e persistência temporária no navegador. Ainda não há persistência remota, autenticação, limite por usuário, histórico sincronizado, cobrança, integração com Meta Ads ou publicação automática.

Pontos ainda pendentes para amadurecer a IA:

- Continuar calibrando prompt e formato com amostras reais de diferentes tipos de negócio.
- Definir limite de uso e custo por geração.
- Melhorar logs sem armazenar dados sensíveis.
- Criar fallback e mensagens para indisponibilidade prolongada.
- Ampliar testes automatizados da validação semântica antes de uso em produção.
- Implementar limite por usuário/IP em fase futura com autenticação, middleware ou camada de infraestrutura.
- Substituir o rate limit em memória por uma camada distribuída antes do beta público.

## Pontos Planejados Para Supabase

- Usuários.
- Campanhas salvas.
- Resultados gerados.
- Histórico de versões do plano.
- Políticas de acesso por usuário.

## Decisões Técnicas Importantes

- Next.js foi escolhido para permitir evolução natural para rotas server-side.
- TypeScript reduz risco em dados compartilhados entre formulário e resultado.
- Tailwind CSS mantém a interface simples e rápida de evoluir.
- `localStorage` foi escolhido para o MVP por simplicidade.
- `useSyncExternalStore` não deve ser usado para ler o plano atual, pois parsing de JSON no snapshot pode gerar objetos novos e causar renderizações problemáticas.
- O resultado pode vir da IA ou do fallback mock e nunca deve ser apresentado como recomendação garantida.
