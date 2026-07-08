# Campanha Fácil IA

MVP de uma aplicação web para ajudar pequenos negócios e pessoas leigas em anúncios a montar um plano inicial de campanha para Meta Ads, Instagram, Facebook e WhatsApp.

## Stack

- Next.js
- TypeScript
- App Router
- Tailwind CSS
- ESLint
- Playwright para testes E2E
- OpenAI SDK no backend do Next.js
- Google GenAI SDK no backend do Next.js

## Como rodar localmente

```bash
npm install
npm run dev
```

Depois acesse `http://localhost:3000`.

## Histórico Local E Nuvem Opcional

Cada geração concluída é adicionada ao histórico disponível em `/historico`. Os 10 planos mais recentes ficam salvos na chave `campaign-plan-history` do `localStorage`, junto com formulário, resultado, origem e provedor.

O modo visitante continua usando somente o navegador atual: limpar os dados do site pode apagar os planos salvos. A base opcional de Supabase/Auth permite preparar salvamento em nuvem quando configurada, mas fica desligada por padrão e não substitui o histórico local.

## Briefing Da Campanha

O formulário em `/criar-campanha` coleta os campos essenciais do plano: negócio, tipo, oferta principal, diferencial, público ideal, região, objetivo, canal, orçamento diário e experiência com anúncios.

Também existem campos opcionais e estruturados para melhorar a personalização sem exigir texto longo: tom de comunicação, disponibilidade de fotos ou vídeos, disponibilidade para responder WhatsApp e principal dificuldade atual. Dados antigos salvos no `localStorage` continuam válidos; campos opcionais ausentes são tratados como vazios.

## Guia De Criativos

O `creativePack` gera exatamente três briefings de criativos. Cada briefing orienta objetivo da peça, cena, materiais necessários, passos de foto ou gravação, montagem simples no Canva ou editor similar, texto da peça, legenda, CTA, erros a evitar e um briefing pronto para copiar.

Nenhuma imagem real é gerada nesta fase. O pacote serve como guia prático para produzir com celular, Canva, designer ou futura ferramenta de imagem, sempre com revisão humana antes de publicar.

## Plano De Ação De 7 Dias

O resultado também inclui um plano de ação de 7 dias, com tarefas simples para revisar a oferta, preparar o canal, produzir criativos, organizar materiais, configurar a campanha, acompanhar sinais e decidir se mantém, ajusta ou pausa.

Esse plano é orientativo e não recomenda aumento automático de orçamento. Ele aparece no resultado, no texto completo copiado e no PDF quando está disponível.

## Configuração Da IA

Copie `.env.example` para `.env.local` e preencha a chave quando quiser testar geração real:

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
NEXT_PUBLIC_SUPABASE_ENABLED=false
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Não versione `.env.local` nem chaves reais. A variável correta do Gemini é `GEMINI_API_KEY`.

Use `AI_PROVIDER=mock` para executar sem API, `AI_PROVIDER=openai` para OpenAI ou `AI_PROVIDER=gemini` para Gemini. O padrão seguro, inclusive quando a variável está ausente, é `mock`. Se o provedor escolhido estiver sem chave, estiver desabilitado ou falhar, o endpoint usa fallback mock e o fluxo continua funcionando.

Os modelos padrão são `gpt-4.1-mini` e `gemini-2.5-flash`, ambos configuráveis. O Gemini está disponível como alternativa de teste; limites gratuitos e disponibilidade dependem do projeto e do modelo e devem ser conferidos no [Google AI Studio](https://aistudio.google.com/).

## Supabase Opcional

`/entrar` oferece uma base de login por magic link quando `NEXT_PUBLIC_SUPABASE_ENABLED=true` e URL/anon key estão configuradas. Sem essas variáveis, a página mostra um aviso amigável e o app segue em modo visitante.

Quando Supabase está habilitado e o usuário está logado, `/resultado` permite salvar a campanha na conta e `/historico` lista as campanhas em nuvem. Usuários visitantes, ambientes sem Supabase e usuários não logados continuam usando `localStorage`.

Consulte [Setup opcional do Supabase](docs/SUPABASE_SETUP.md) para criar a tabela `campaigns`, ativar RLS, configurar magic link e definir variáveis na Vercel. Não use service role key no frontend.

Em desenvolvimento, a resposta do endpoint inclui um bloco `debug` sem dados sensíveis, com modelo, estado da geração e motivo do fallback. Um erro `429` com código `insufficient_quota` indica falta de cota ou faturamento disponível no projeto OpenAI; nesse caso, o sistema mantém o plano de demonstração.

## Segurança E Controle De Custo

- Chamadas OpenAI e Gemini usam timeout configurável entre 5 e 60 segundos, com padrão de 30 segundos.
- Os dois provedores executam uma única tentativa por geração, evitando custo duplicado por retry automático.
- O endpoint limita o body a 8 KB, valida campos e restringe o total útil informado pelo usuário.
- Campos opcionais de briefing são usados no prompt e no mock somente quando preenchidos; o sistema não inventa informações ausentes.
- Um rate limit em memória permite 10 requisições por IP a cada 60 segundos por padrão.
- O rate limit é apenas uma proteção local por processo. Em produção serverless, múltiplas instâncias não compartilham contadores; antes do beta público, use uma camada distribuída ou o rate limit da plataforma.
- Dados do formulário são tratados como contexto não confiável no prompt e a resposta continua sujeita ao schema e à validação local.

Consulte a [revisão de segurança](docs/SECURITY_REVIEW.md) para riscos residuais e decisões.

## Preparação Para Deploy

O projeto possui páginas simples de Privacidade e Termos, links legais globais e um checklist de configuração para um futuro beta.

Consulte [Preparação para deploy e beta público](docs/DEPLOYMENT.md) antes de configurar qualquer ambiente publicado. O documento cobre variáveis, modos mock/OpenAI/Gemini, segredos, validações, reversão e o bloqueio atual do rate limit em memória.

Para Vercel, o checklist também documenta os defaults do Next.js, Node.js `24.x`, variáveis por ambiente e validação pós-deploy de `/api/health`. Nenhum deploy é realizado pelos scripts do repositório.

Para um preview ou smoke test, mantenha `AI_PROVIDER=mock` e `AI_GENERATION_ENABLED=false`. Antes de liberar IA real em múltiplas instâncias ou serverless, é obrigatório adicionar rate limit distribuído ou proteção equivalente da plataforma. O beta permanece com `noindex`/`nofollow` até uma decisão explícita de indexação.

## Validação Beta

A página `/beta` explica como participar da validação controlada. Em `/resultado`, os canais opcionais de feedback e ajuda aparecem somente quando estas variáveis públicas contêm URLs HTTP(S) válidas:

```bash
NEXT_PUBLIC_FEEDBACK_URL=
NEXT_PUBLIC_HELP_URL=
```

Elas podem apontar para Google Forms, `wa.me`, formulário externo ou página de contato. Nunca coloque chaves, tokens ou dados sensíveis nessas variáveis. Os links abrem em nova aba e não enviam automaticamente dados do formulário ou do plano.

O roteiro para entrevistas, sinais de interesse, sinais de confusão e métricas manuais está em [Validação beta controlada](docs/BETA_VALIDATION.md).

## Scripts úteis

```bash
npm run lint
npm run build
npm run test:e2e
npm run test:e2e:headed
```

Na primeira configuração da máquina, instale o Chromium gerenciado pelo Playwright com `npx playwright install chromium`. Os testes E2E iniciam o Next.js em uma porta dedicada e forçam `AI_PROVIDER=mock`, sem usar OpenAI ou Gemini.

## Documentação

- [Instruções para agentes](AGENTS.md)
- [Estado atual do projeto](docs/CURRENT_STATE.md)
- [Changelog](CHANGELOG.md)
- [Produto](docs/PRODUCT.md)
- [Roadmap](docs/ROADMAP.md)
- [Contexto técnico](docs/TECHNICAL_CONTEXT.md)
- [Decisões](docs/DECISIONS.md)
- [Histórico de prompts](docs/PROMPTS.md)
- [Testes e validação](docs/TESTING.md)
- [Analytics e privacidade](docs/ANALYTICS.md)
- [Preparação para deploy](docs/DEPLOYMENT.md)
- [Validação beta controlada](docs/BETA_VALIDATION.md)
- [Setup opcional do Supabase](docs/SUPABASE_SETUP.md)

## Próximos passos planejados

- Testar e calibrar a geração real com o provedor escolhido.
- Adotar rate limit distribuído e limites de custo antes do beta público com IA real.
- Validar a base opcional de Supabase com usuários recorrentes antes de migrar qualquer histórico local.
- Evoluir login e histórico por usuário somente se a recorrência justificar.
- Evoluir o resultado com mais personalização por segmento.
