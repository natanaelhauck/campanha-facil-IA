# Contexto Técnico

## Stack Atual

- Next.js com App Router.
- TypeScript.
- Tailwind CSS.
- ESLint.
- React Client Components para páginas que acessam `localStorage`.
- Rota backend no App Router para geração de plano.
- OpenAI SDK usado apenas no servidor.

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
7. Se `OPENAI_API_KEY` estiver configurada e `AI_GENERATION_ENABLED` não for `false`, o serviço tenta gerar o plano com OpenAI Responses API e saída estruturada.
8. Se a chave estiver ausente, a geração estiver desabilitada ou ocorrer erro/formato inesperado, o serviço retorna fallback mock compatível.
9. O client salva os dados do formulário, o plano gerado e a origem do plano no `localStorage`.
10. O usuário é redirecionado para `/resultado`.
11. A página de resultado lê o plano salvo no client. Se não houver plano salvo, mantém fallback local com base nos dados do formulário.
12. O usuário pode clicar em `Ajustar informações` para voltar ao formulário com os dados anteriores carregados.

## Uso Atual De localStorage

As chaves atuais são:

- `campaign-form-data`: dados preenchidos no formulário.
- `campaign-plan-result`: plano retornado pelo endpoint ou fallback mock.
- `campaign-plan-source`: origem do plano, `ai` ou `mock`.

O `localStorage` é usado apenas como persistência temporária do MVP. Ele não substitui banco de dados e não deve ser usado para dados sensíveis.

Em `/criar-campanha`, a leitura acontece no client com `useEffect`, parse seguro e preenchimento do formulário quando há dados válidos. Isso permite editar informações anteriores ao voltar de `/resultado`.

Em `/resultado`, a leitura também acontece no client, com `useEffect`, `try/catch` no `JSON.parse` e estado amigável quando os dados não existem ou são inválidos. A página prioriza `campaign-plan-result` quando ele existe.

## Geração Com OpenAI

A primeira base de IA real fica em `src/lib/ai/` e `src/app/api/generate-campaign/route.ts`.

- `buildCampaignPrompt.ts` monta instruções em português do Brasil com foco em pequenos negócios, linguagem simples, WhatsApp/Instagram quando fizer sentido e nenhuma promessa de resultado.
- `campaignPlanSchema.ts` define o formato estruturado esperado do plano.
- `generateCampaignPlan.ts` decide entre OpenAI e fallback mock, valida o JSON retornado e nunca envia detalhes sensíveis de erro ao frontend.
- A rota `POST /api/generate-campaign` aceita dados do formulário, valida campos obrigatórios e retorna `{ success, data, source, warning }`.

Variáveis esperadas:

```bash
OPENAI_API_KEY=
OPENAI_MODEL=gpt-5.5
AI_GENERATION_ENABLED=true
```

`.env.local` deve ficar local e ignorado pelo Git. Sem chave real, o modo mock continua funcionando.

## Comportamentos Client-Side Atuais

- O componente `Button` trata links internos com hash usando `scrollIntoView({ behavior: "smooth" })`, para que botões como `Ver como funciona`, `Ver próximos passos` e `Voltar ao topo` funcionem repetidamente.
- A página `/resultado` usa `navigator.clipboard.writeText` para copiar textos de anúncio, com feedback simples de sucesso ou erro.
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
- Não há cobrança, planos pagos ou painel SaaS completo.

## Limites Da Base Atual De IA

A Fase 2 inicial adiciona somente a base backend para geração de plano. Ainda não há persistência, autenticação, limite por usuário, painel de histórico, cobrança, integração com Meta Ads ou publicação automática.

Pontos ainda pendentes para amadurecer a IA:

- Calibrar prompt e formato com testes reais.
- Definir limite de uso e custo por geração.
- Melhorar logs sem armazenar dados sensíveis.
- Criar fallback e mensagens para indisponibilidade prolongada.
- Avaliar validação mais rígida do payload e do plano antes de uso em produção.

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
