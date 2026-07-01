# Revisão De Segurança E Controle De Custo

## Resumo Executivo

A revisão do endpoint de geração não encontrou vulnerabilidade crítica ou alta no escopo analisado. A implementação já mantinha chaves no servidor, validava entrada e saída, evitava retry na OpenAI e restringia logs detalhados ao ambiente de desenvolvimento.

Foram corrigidos riscos de timeout ausente, retries padrão do Gemini, leitura integral de body excessivo, ausência de limite de frequência e separação insuficientemente explícita entre instruções e dados do usuário.

O principal risco residual é operacional: o rate limit atual vive somente na memória de cada processo e não oferece uma cota global em produção serverless.

## Achados Médios

### SEC-001 — Rate Limit Não Distribuído

Status: mitigado parcialmente.

O limite em memória está implementado em `src/lib/ai/campaignRateLimit.ts:67` e aplicado antes da leitura do body em `src/app/api/generate-campaign/route.ts:157`. Ele reduz abuso em desenvolvimento, servidor único e por instância aquecida.

Reinícios, escalonamento horizontal e múltiplas regiões mantêm contadores independentes. Além disso, `x-forwarded-for` em `src/lib/ai/campaignRateLimit.ts:39` só deve ser usado quando o proxy de entrada for confiável e sobrescrever headers enviados pelo cliente.

Decisão: manter a proteção simples nesta fase, mas exigir rate limit da plataforma ou armazenamento distribuído antes do beta público. Depois de autenticação, a chave deve considerar usuário e não somente IP.

### SEC-002 — Advisory Moderado Transitivo Do PostCSS

Status: aceito temporariamente.

`npm audit` reporta `GHSA-qx2v-qp2m-jg93`, XSS na serialização de CSS do PostCSS anterior a 8.5.10. A dependência vulnerável é transitiva ao Next.js 16.2.9.

O único reparo sugerido pelo npm usa `npm audit fix --force` e instalaria Next.js 9.3.3, uma alteração incompatível e insegura para este projeto.

Decisão: não aplicar `--force`, acompanhar uma atualização segura do Next.js/PostCSS e repetir o audit em atualizações de dependências.

## Achados Corrigidos

### SEC-003 — Chamadas Sem Timeout Explícito

Corrigido em `src/lib/ai/campaignPlanProvider.ts:46`, com padrão de 30 segundos e intervalo permitido entre 5 e 60 segundos. OpenAI usa esse valor em `src/lib/ai/generateCampaignPlanWithOpenAI.ts:127` e Gemini em `src/lib/ai/generateCampaignPlanWithGemini.ts:54`.

Timeouts recebem `fallbackReason: "timeout"` sem expor mensagens brutas do SDK.

### SEC-004 — Retry Padrão Do Gemini

Corrigido em `src/lib/ai/generateCampaignPlanWithGemini.ts:56`. O SDK estava sujeito ao padrão de até cinco tentativas; agora `attempts` é 1. A OpenAI já usava `maxRetries: 0` em `src/lib/ai/generateCampaignPlanWithOpenAI.ts:126`.

### SEC-005 — Body Lido Integralmente Antes Do Limite

Corrigido em `src/app/api/generate-campaign/route.ts:50`. A rota verifica `Content-Length` quando presente e interrompe a leitura do stream acima de 8 KB. Limites por campo e total útil permanecem em `src/app/api/generate-campaign/route.ts:101`.

### SEC-006 — Prompt Injection Nos Campos

Mitigado em `src/lib/ai/buildCampaignPrompt.ts:4` e `src/lib/ai/buildCampaignPrompt.ts:52`. Os dados agora são delimitados como conteúdo não confiável tanto na instrução de sistema quanto no prompt.

Essa defesa não é absoluta. O modelo não possui ferramentas capazes de publicar, gastar dinheiro ou acessar contas reais, e toda saída continua sujeita a schema e validação local.

### SEC-007 — Exposição De Diagnóstico

Já estava protegido. Logs operacionais são emitidos somente em desenvolvimento em `src/lib/ai/generateCampaignPlan.ts:72`, sem payload, chave, header ou stack trace. O endpoint só envia `debug` em desenvolvimento em `src/app/api/generate-campaign/route.ts:239`.

## Validação

- Testes E2E usam `AI_PROVIDER=mock`, chaves vazias e geração real desabilitada.
- `tests/e2e/api-security.spec.ts` verifica rejeição de body excessivo e bloqueio por frequência.
- Nenhuma chamada real de OpenAI ou Gemini faz parte da validação automatizada.
