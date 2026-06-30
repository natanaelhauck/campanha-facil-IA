# Contexto Técnico

## Stack Atual

- Next.js com App Router.
- TypeScript.
- Tailwind CSS.
- ESLint.
- React Client Components para páginas que acessam `localStorage`.
- Rota backend no App Router para geração de plano.
- SDKs de OpenAI e Gemini usados apenas no servidor.

## Estrutura De Pastas Atual

```text
src/
  app/
    api/generate-campaign/route.ts
    criar-campanha/page.tsx
    resultado/page.tsx
    globals.css
    layout.tsx
    page.tsx
  components/
    Button.tsx
    CampaignResultSection.tsx
    Card.tsx
    Header.tsx
    Input.tsx
    Select.tsx
    Textarea.tsx
  data/mockCampaignResult.ts
  lib/ai/
    buildCampaignPrompt.ts
    campaignPlanSchema.ts
    generateCampaignPlan.ts
  types/campaign.ts
```

## Fluxo Atual Completo

1. O usuário acessa `/`.
2. A home apresenta a proposta de valor, uma prévia do plano, benefícios e a seção `#como-funciona`.
3. O usuário clica em `Criar minha campanha` ou `Começar`.
4. Em `/criar-campanha`, preenche um formulário guiado por seções: negócio, oferta, público/região e configuração inicial.
5. Ao enviar, o formulário chama `POST /api/generate-campaign`.
6. A rota valida os campos obrigatórios e chama o serviço de geração.
7. O serviço lê `AI_PROVIDER` e seleciona `mock`, `openai` ou `gemini`.
8. Com um provedor real selecionado e `AI_GENERATION_ENABLED` diferente de `false`, o serviço tenta gerar um pacote estruturado. Chave ausente, geração desabilitada, resposta incompleta ou erro retornam fallback mock compatível.
9. O client salva os dados do formulário, o plano gerado e a origem do plano no `localStorage`.
10. O usuário é redirecionado para `/resultado`.
11. A página de resultado lê o plano salvo no client. Se não houver plano salvo, mantém fallback local com base nos dados do formulário.
12. O usuário pode clicar em `Ajustar informações` para voltar ao formulário com os dados anteriores carregados.

## Uso Atual De localStorage

As chaves atuais são:

- `campaign-form-data`: dados preenchidos no formulário.
- `campaign-plan-result`: plano retornado pelo endpoint ou fallback mock.
- `campaign-plan-source`: origem do plano, `ai` ou `mock`.
- `campaign-plan-provider`: provedor efetivo do plano, `openai`, `gemini` ou `mock`.

O `localStorage` é usado apenas como persistência temporária do MVP. Ele não substitui banco de dados e não deve ser usado para dados sensíveis.

Em `/criar-campanha`, a leitura acontece no client com `useEffect`, parse seguro e preenchimento do formulário quando há dados válidos. Isso permite editar informações anteriores ao voltar de `/resultado`.

Em `/resultado`, a leitura também acontece no client, com `useEffect`, `try/catch` no `JSON.parse` e estado amigável quando os dados não existem ou são inválidos. A página prioriza `campaign-plan-result` quando ele existe. Planos antigos sem o pacote de execução continuam válidos; as novas seções são opcionais na leitura e não são renderizadas quando ausentes.

## Geração Com IA

A camada de provedores fica em `src/lib/ai/` e `src/app/api/generate-campaign/route.ts`.

- `buildCampaignPrompt.ts` monta instruções em português do Brasil para um pacote com configuração, três briefings criativos, roteiro de atendimento, métricas simples, orçamento conservador e nenhuma promessa de resultado.
- `campaignPlanSchema.ts` exige três textos de anúncio, cinco próximos passos, acompanhamento em 3, 7 e 14 dias e as quatro seções do pacote de execução.
- `generateCampaignPlan.ts` seleciona `mock`, OpenAI ou Gemini e centraliza o fallback.
- `generateCampaignPlanWithOpenAI.ts` usa OpenAI Responses API com Structured Outputs.
- `generateCampaignPlanWithGemini.ts` usa `@google/genai`, `generateContent`, JSON Schema e validação local.
- `campaignPlanProvider.ts` contém o contrato comum, modelos padrão e parse seguro do plano.
- `campaignPlanValidation.ts` aceita planos legados sem as novas seções para leitura do `localStorage`, mas exige o pacote completo nas respostas novas dos providers. Também valida quantidades, limites e promessas claras.
- A rota `POST /api/generate-campaign` aceita dados do formulário, limita tamanho do payload, valida campos obrigatórios, normaliza textos e retorna `{ success, data, source, provider, warning }`.
- Em `development`, a rota também retorna `debug` com provedor tentado, modelo, geração habilitada, status da API e motivo do fallback. Esse bloco não é retornado em produção.
- O cliente OpenAI usa `maxRetries: 0`. Assim, erros de cota, autenticação ou configuração caem imediatamente no fallback e não geram tentativas reais adicionais automáticas.

Variáveis esperadas:

```bash
AI_PROVIDER=mock
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

## Comportamentos Client-Side Atuais

- O componente `Button` trata links internos com hash usando `scrollIntoView({ behavior: "smooth" })`, para que botões como `Ver como funciona`, `Ver próximos passos` e `Voltar ao topo` funcionem repetidamente.
- A página `/resultado` usa `navigator.clipboard.writeText` para copiar textos de anúncio, legendas, prompts visuais e respostas do WhatsApp, com feedback simples de sucesso ou erro.
- O formulário em `/criar-campanha` usa validação HTML simples com campos obrigatórios.
- O envio do formulário mantém a chave `campaign-form-data` compatível com `/resultado` e adiciona o plano salvo quando a API responde.

## O Que Ainda Não Existe

- Não há Supabase.
- Não há login.
- Não há banco de dados.
- Não há histórico de campanhas.
- Não há exportação para PDF.
- Não há publicação automática de campanhas.
- Não há integração com Meta Ads API.
- Não há geração real de imagens; `aiImagePrompt` é apenas um briefing textual.
- Não há cobrança, planos pagos ou painel SaaS completo.

## Limites Da Base Atual De IA

A Fase 2 inicial adiciona somente a base backend para geração de plano. Ainda não há persistência, autenticação, limite por usuário, painel de histórico, cobrança, integração com Meta Ads ou publicação automática.

Pontos ainda pendentes para amadurecer a IA:

- Continuar calibrando prompt e formato com amostras reais de diferentes tipos de negócio.
- Definir limite de uso e custo por geração.
- Melhorar logs sem armazenar dados sensíveis.
- Criar fallback e mensagens para indisponibilidade prolongada.
- Ampliar testes automatizados da validação semântica antes de uso em produção.
- Implementar limite por usuário/IP em fase futura com autenticação, middleware ou camada de infraestrutura.

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
