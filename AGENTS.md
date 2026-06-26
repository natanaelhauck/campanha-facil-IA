# Instruções Para Agentes

Este repositório contém o MVP do **Campanha Fácil IA**, uma aplicação web para ajudar pequenos negócios brasileiros e pessoas leigas em anúncios a montar um plano inicial de campanha para Meta Ads, Instagram, Facebook e WhatsApp.

## Objetivo Do Produto

O produto deve guiar o usuário por perguntas simples e transformar as respostas em um plano inicial de campanha. A versão atual gera um resultado simulado e personalizado localmente, sem IA real, backend, banco de dados ou integrações externas.

## Stack Atual

- Next.js
- TypeScript
- App Router
- Tailwind CSS
- ESLint
- Armazenamento temporário no navegador com `localStorage`

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

- Não implementar OpenAI API.
- Não implementar Supabase.
- Não implementar login.
- Não criar banco de dados.
- Não integrar Meta Ads API.
- Não criar cobrança, planos pagos ou painel SaaS completo.
- Não prometer geração automática de campanha real dentro da Meta.

## Segurança, Custos E Promessas

- Não exponha chaves de API no cliente.
- Planeje futuras integrações de IA considerando custo por requisição, limites de uso e logs mínimos.
- Evite promessas de resultado garantido em anúncios.
- Trate o plano gerado como orientação inicial, não como garantia de venda, lucro ou performance.
- Futuras integrações com Meta Ads devem respeitar permissões, políticas da plataforma e consentimento do usuário.
- Qualquer ação futura em conta real de anúncios deve exigir revisão e confirmação humana antes de executar.
- Não automatize orçamento, publicação, pausa ou edição de campanha real sem consentimento claro, específico e registrado.

## Orientação De Escopo

O projeto deve evoluir por etapas pequenas: MVP simples, IA real, persistência/autenticação, SaaS inicial e integrações. Cada etapa deve ter critérios de conclusão claros e validação manual do fluxo principal.
