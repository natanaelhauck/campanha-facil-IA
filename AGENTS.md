# Instruções Para Agentes

Este repositório contém o MVP do **Campanha Fácil IA**, uma aplicação web para ajudar pequenos negócios brasileiros e pessoas leigas em anúncios a montar um plano inicial de campanha para Meta Ads, Instagram, Facebook e WhatsApp.

## Objetivo Do Produto

O produto deve guiar o usuário por perguntas simples e transformar as respostas em um plano inicial de campanha. A versão atual pode gerar o plano com um resultado simulado local ou com IA real no backend do Next.js, usando OpenAI ou Gemini. Ainda não há banco de dados, autenticação, cobrança nem integração com contas reais de anúncios.

## Stack Atual

- Next.js
- TypeScript
- App Router
- Tailwind CSS
- ESLint
- OpenAI SDK no backend do Next.js
- Google GenAI SDK no backend do Next.js
- Armazenamento temporário no navegador com `localStorage`

## Provedores De IA

- `AI_PROVIDER=mock` usa o resultado simulado local e deve ser o padrão em desenvolvimento, testes automatizados e validações que não exigem IA real.
- `AI_PROVIDER=openai` usa a OpenAI quando `OPENAI_API_KEY` está configurada no servidor.
- `AI_PROVIDER=gemini` usa o Gemini quando `GEMINI_API_KEY` está configurada no servidor.
- A seleção e o fallback dos provedores ficam no backend. Nunca exponha chaves ou chamadas autenticadas no cliente.
- Não faça chamadas reais de IA sem necessidade explícita, pois elas podem consumir cota e gerar custo.
- `.env.local` é local e não deve ser lido, impresso, exposto ou commitado. Use `.env.example` apenas como referência de nomes de variáveis.

## Regras De Trabalho

- Mantenha o escopo pequeno, incremental e fácil de revisar.
- Não refatore o projeto inteiro sem necessidade direta.
- Prefira código simples e legível para o estágio atual do MVP.
- Preserve o fluxo existente: home, `/criar-campanha` e `/resultado`.
- Não adicione dependências sem justificativa clara.
- Não altere layout, copy ou comportamento quando a tarefa for apenas técnica ou documental.
- Use português do Brasil em textos de produto e documentação.
- Não transforme o produto em uma ferramenta técnica para gestores avançados de tráfego.
- Preserve o foco em pequenos negócios brasileiros e pessoas leigas em anúncios.
- Não antecipe integração com Meta Ads, MCPs ou APIs sem planejamento explícito.
- Preserve os provedores `mock`, `openai` e `gemini`, o fallback seguro e o contrato atual do plano ao alterar a camada de IA.
- Não implemente ações automáticas que possam gastar dinheiro, publicar anúncios ou alterar campanhas reais sem confirmação humana explícita.
- Trate futuras integrações com Meta Ads como infraestrutura de apoio, não como o coração inicial do produto.

## Como Rodar O Projeto

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000`.

## Validações Obrigatórias Antes De Commit

```bash
npm run lint
npm run build
git status --short --branch
```

Corrija qualquer erro de lint ou build antes de commitar.

## Política De Commits

- Faça commits pequenos e focados.
- Use mensagens no padrão convencional quando possível.
- Só crie commit depois que lint e build passarem.
- Não inclua arquivos temporários, perfis de navegador, logs ou artefatos de build.

## Ainda Não Fazer

- Não implementar Supabase.
- Não implementar login.
- Não criar banco de dados.
- Não integrar Meta Ads API.
- Não criar cobrança, planos pagos ou painel SaaS completo.
- Não prometer geração automática de campanha real dentro da Meta.

## Segurança, Custos E Promessas

- Não exponha chaves de API no cliente.
- Não versione `.env.local` nem qualquer chave real.
- Use `AI_PROVIDER=mock` por padrão para desenvolvimento e testes, salvo quando um teste real for solicitado explicitamente.
- Evolua as integrações de IA considerando custo por requisição, limites de uso e logs mínimos sem dados sensíveis.
- Evite promessas de resultado garantido em anúncios.
- Trate o plano gerado como orientação inicial, não como garantia de venda, lucro ou performance.
- Futuras integrações com Meta Ads devem respeitar permissões, políticas da plataforma e consentimento do usuário.
- Qualquer ação futura em conta real de anúncios deve exigir revisão e confirmação humana antes de executar.
- Não automatize orçamento, publicação, pausa ou edição de campanha real sem consentimento claro, específico e registrado.

## Orientação De Escopo

O projeto deve evoluir por etapas pequenas: consolidar a IA real, adicionar limites e observabilidade, avaliar persistência/autenticação, evoluir para um SaaS inicial e somente depois considerar integrações. Cada etapa deve ter critérios de conclusão claros e validação do fluxo principal em modo mock.
