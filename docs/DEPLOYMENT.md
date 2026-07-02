# Preparação Para Deploy E Beta Público

Este documento descreve a configuração necessária para preparar um ambiente publicado. Ele não registra nem autoriza um deploy real.

## Pré-requisitos

- Runtime Node.js compatível com a versão atual do Next.js.
- Instalação reproduzível com `npm ci`.
- Build com `npm run build`.
- Processo de produção com `npm run start`.
- HTTPS e domínio configurados pela plataforma de hospedagem.
- Segredos configurados somente no ambiente do servidor.
- Proteção de frequência distribuída ou oferecida pela plataforma antes de liberar IA real em um beta público.

O build e o fluxo em modo mock não dependem de chaves de IA.

## Variáveis De Ambiente

| Variável | Valor recomendado inicial | Uso |
| --- | --- | --- |
| `AI_PROVIDER` | `mock` | Seleciona `mock`, `gemini` ou `openai`. Valor ausente ou inválido cai no modo mock. |
| `AI_GENERATION_ENABLED` | `true` | Permite geração real quando um provedor real e sua chave estão configurados. Use `false` como trava operacional. |
| `AI_REQUEST_TIMEOUT_MS` | `30000` | Timeout dos provedores. O código limita o valor entre 5.000 e 60.000 ms. |
| `AI_RATE_LIMIT_ENABLED` | `true` | Mantém o rate limit local por processo. Não substitui uma proteção distribuída. |
| `AI_RATE_LIMIT_MAX_REQUESTS` | `10` | Quantidade local permitida por identificador na janela. |
| `AI_RATE_LIMIT_WINDOW_MS` | `60000` | Janela do rate limit local em milissegundos. |
| `GEMINI_API_KEY` | vazio em mock | Segredo do Gemini, usado somente no servidor. |
| `GEMINI_MODEL` | `gemini-2.5-flash` | Modelo Gemini configurado para geração. Confirme a disponibilidade no projeto antes da liberação. |
| `OPENAI_API_KEY` | vazio em mock | Segredo da OpenAI, usado somente no servidor. |
| `OPENAI_MODEL` | `gpt-4.1-mini` | Modelo OpenAI configurado para geração. Confirme acesso e disponibilidade antes da liberação. |
| `OPENAI_MAX_OUTPUT_TOKENS` | `4200` | Limite de saída da OpenAI; o código aceita de 3.000 a 6.000 tokens. |

Use `.env.example` como referência. `.env.local` é apenas local, está ignorado pelo Git e nunca deve ser copiado para documentação, logs ou commits.

## Modos De Operação

### Mock

```bash
AI_PROVIDER=mock
AI_GENERATION_ENABLED=true
```

Não requer chave e não chama OpenAI ou Gemini. É o modo obrigatório para build, testes automatizados, smoke tests iniciais e ambientes que não precisam de IA real.

### Gemini

```bash
AI_PROVIDER=gemini
AI_GENERATION_ENABLED=true
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.5-flash
```

Configure `GEMINI_API_KEY` no cofre de segredos da plataforma. Não use prefixo público, não envie a chave ao navegador e não mantenha a chave em arquivo versionado.

### OpenAI

```bash
AI_PROVIDER=openai
AI_GENERATION_ENABLED=true
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4.1-mini
OPENAI_MAX_OUTPUT_TOKENS=4200
```

Configure `OPENAI_API_KEY` no cofre de segredos da plataforma. A chave deve existir somente no ambiente server-side.

Se um provedor real estiver sem chave, desabilitado, indisponível ou retornar um plano inválido, o endpoint usa o fallback mock. `AI_GENERATION_ENABLED=false` funciona como trava para impedir chamadas reais sem remover a configuração.

## Configuração Recomendada Para O Beta

1. Validar primeiro um ambiente de preview com `AI_PROVIDER=mock`.
2. Manter analytics externo desativado; PostHog não faz parte desta preparação.
3. Para um beta com IA real, escolher apenas um provedor por ambiente, configurar explicitamente o modelo e manter somente a chave necessária.
4. Definir alertas e limites de orçamento/cota no provedor escolhido.
5. Manter timeout de 30 segundos como ponto inicial e sem retries automáticos.
6. Proteger `POST /api/generate-campaign` com rate limit distribuído, gateway ou recurso equivalente da plataforma.
7. Registrar apenas metadados operacionais seguros, nunca payload, resposta completa, chave, headers ou conteúdo do plano.
8. Manter `/privacidade` e `/termos` acessíveis em todas as páginas.

## Limite Do Rate Limit Atual

O rate limit atual vive na memória de cada processo. Reinícios apagam os contadores, e múltiplas instâncias ou funções serverless não compartilham estado. Portanto, ele é útil em desenvolvimento e como proteção parcial de uma única instância, mas não é suficiente para controlar abuso ou custo em um beta público distribuído.

Antes de liberar geração real ao público, configure uma camada distribuída ou a proteção da plataforma. Sem essa proteção, mantenha o ambiente público em modo mock ou restrito.

## Cuidados Com Segredos

- Nunca use `NEXT_PUBLIC_` em chaves da OpenAI ou do Gemini.
- Configure segredos separadamente para preview e produção.
- Dê acesso às chaves somente a quem administra o ambiente.
- Revogue e substitua imediatamente qualquer chave exposta.
- Não leia, imprima ou copie `.env.local` durante validações.
- Não inclua chaves em screenshots, traces, logs, tickets ou respostas de erro.

## Checklist Antes De Publicar

### Código E Conteúdo

- [ ] Confirmar que `/`, `/criar-campanha`, `/resultado`, `/historico`, `/privacidade` e `/termos` carregam.
- [ ] Confirmar que os links legais aparecem de forma discreta em todas as páginas.
- [ ] Confirmar que `/resultado`, texto copiado e PDF dizem que o plano é orientativo e não garante resultado.
- [ ] Revisar textos legais e informações de contato/empresa quando esses dados existirem.
- [ ] Confirmar que Meta Ads continua sem integração e que nenhuma ação real pode ser executada.

### Ambiente E Segurança

- [ ] Definir `AI_PROVIDER` explicitamente.
- [ ] Manter `AI_PROVIDER=mock` em testes e smoke tests.
- [ ] Configurar somente a chave do provedor real escolhido.
- [ ] Confirmar que nenhuma chave aparece no bundle do cliente, logs ou repositório.
- [ ] Configurar HTTPS, headers e domínio na plataforma.
- [ ] Configurar rate limit distribuído antes de liberar IA real ao público.
- [ ] Definir limites de custo, cota e alertas no provedor de IA.
- [ ] Confirmar política de retenção dos logs da plataforma sem dados sensíveis.

### Validação

- [ ] Executar `npm ci`.
- [ ] Executar `npm run lint`.
- [ ] Executar `npm run build`.
- [ ] Executar `npm run test:e2e` com o ambiente forçado para mock.
- [ ] Executar smoke test em preview usando mock.
- [ ] Verificar layout em desktop e mobile.
- [ ] Verificar criação, cópia, PDF, histórico local e exclusão do histórico.
- [ ] Revisar `git status --short --branch` e garantir que `.env.local`, skills, relatórios e artefatos não serão publicados.

### Liberação E Reversão

- [ ] Registrar a versão ou o commit aprovado.
- [ ] Definir responsável por acompanhar erros e custo durante o beta.
- [ ] Ter uma forma rápida de definir `AI_GENERATION_ENABLED=false` ou `AI_PROVIDER=mock`.
- [ ] Documentar como reverter para a última versão estável.

## O Que Não Faz Parte Deste Deploy

- Supabase, banco de dados ou persistência remota.
- Login ou autenticação.
- Integração ou publicação no Meta Ads.
- PostHog ou outro analytics externo.
- Cobrança ou planos pagos.
