# Decisões Do Projeto

## Começar Sem API Da Meta

A integração com Meta Ads foi adiada porque envolve permissões, revisão de plataforma, risco de ações em campanhas reais e maior complexidade operacional.

Decisão atual: primeiro validar a utilidade do plano guiado.

## Começar Sem Supabase

Supabase foi planejado para fases futuras. No MVP, não há login nem histórico persistente em banco.

Decisão atual: usar `localStorage` para manter o fluxo simples e validar a experiência.

## Começar Com Resultado Simulado E Personalizado

A primeira versão não usa IA real. O resultado combina dados do formulário com textos mockados.

Decisão atual: validar estrutura, copy e utilidade do fluxo antes de pagar por geração com IA.

## Usar Next.js, TypeScript E Tailwind

Next.js permite evoluir para APIs server-side e deploy web moderno. TypeScript melhora segurança de tipos. Tailwind acelera ajustes visuais sem criar um design system pesado cedo demais.

## Não Prometer Resultado Garantido

Anúncios dependem de oferta, público, criativo, verba, atendimento, concorrência e execução. O produto deve falar em orientação inicial e acompanhamento, nunca em garantia de venda ou performance.

## Evoluir Em Etapas Pequenas

Cada avanço deve ter escopo claro, validação local e commit próprio. Isso facilita continuidade com Codex, outros agentes e colaboradores humanos.

## Validar Antes De Commit

Lint e build devem passar antes de cada commit. Fluxos que afetam usuário também precisam de teste manual.
