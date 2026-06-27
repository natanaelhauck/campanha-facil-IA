# Campanha Fácil IA

MVP de uma aplicação web para ajudar pequenos negócios e pessoas leigas em anúncios a montar um plano inicial de campanha para Meta Ads, Instagram, Facebook e WhatsApp.

## Stack

- Next.js
- TypeScript
- App Router
- Tailwind CSS
- ESLint
- OpenAI SDK no backend do Next.js

## Como rodar localmente

```bash
npm install
npm run dev
```

Depois acesse `http://localhost:3000`.

## Configuração Da IA

Copie `.env.example` para `.env.local` e preencha a chave quando quiser testar geração real:

```bash
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4.1-mini
OPENAI_MAX_OUTPUT_TOKENS=1800
AI_GENERATION_ENABLED=true
```

Não versione `.env.local` nem chaves reais. Sem `OPENAI_API_KEY`, ou com `AI_GENERATION_ENABLED=false`, o endpoint usa fallback mock e o fluxo continua funcionando.

O modelo padrão de desenvolvimento é `gpt-4.1-mini`. Ajuste `OPENAI_MODEL` se sua conta usar outro modelo disponível.

Em desenvolvimento, a resposta do endpoint inclui um bloco `debug` sem dados sensíveis, com modelo, estado da geração e motivo do fallback. Um erro `429` com código `insufficient_quota` indica falta de cota ou faturamento disponível no projeto OpenAI; nesse caso, o sistema mantém o plano de demonstração.

## Scripts úteis

```bash
npm run lint
npm run build
```

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

## Próximos passos planejados

- Testar e calibrar a geração real com OpenAI API.
- Definir limites simples de uso e custo para chamadas de IA.
- Adicionar Supabase para salvar campanhas.
- Implementar login e histórico do usuário.
- Evoluir o resultado com mais personalização por segmento.
