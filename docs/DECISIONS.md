# Decisões Do Projeto

## Começar Sem API Da Meta

A integração com Meta Ads foi adiada porque envolve permissões, revisão de plataforma, risco de ações em campanhas reais e maior complexidade operacional.

Decisão atual: primeiro validar a utilidade do plano guiado.

## Continuar Mesmo Com MCPs E Conectores De Meta Ads

Existem MCPs, conectores e APIs que podem permitir a IAs operar contas de anúncio, ler relatórios, auditar campanhas, criar estruturas e executar ações via linguagem natural.

Isso não invalida o **Campanha Fácil IA**.

Decisão atual: diferenciar o produto pela experiência guiada para pequenos negócios e pessoas leigas, não apenas pela existência de uma integração técnica.

O produto deve continuar com a estratégia "leigo primeiro":

- linguagem simples;
- orientação passo a passo;
- foco em WhatsApp, Instagram e pequenos negócios brasileiros;
- segurança antes de automação;
- explicação clara do que revisar antes de investir;
- nenhuma promessa de venda, lucro ou performance.

MCP/API da Meta pode ser considerada como camada futura de infraestrutura para leitura de dados, diagnóstico e ações assistidas. Não deve ser tratada como prioridade imediata nem como o coração inicial do produto.

Qualquer futura ação que publique campanha, altere orçamento, pause anúncios ou modifique campanhas reais deve exigir confirmação humana explícita.

## Começar Sem Supabase

Supabase foi planejado para fases futuras. No MVP, não há login nem histórico persistente em banco.

Decisão atual: usar `localStorage` para manter o fluxo simples e validar a experiência.

## Começar Com Resultado Simulado E Evoluir Para IA Real

A primeira versão não usava IA real. O resultado combinava dados do formulário com textos mockados para validar estrutura, copy e utilidade antes de pagar por geração com IA.

Decisão atual: adicionar OpenAI API apenas no backend, manter fallback mock quando não houver chave ou quando a geração falhar, e não expor detalhes técnicos ou chaves no frontend.

## Usar Next.js, TypeScript E Tailwind

Next.js permite evoluir para APIs server-side e deploy web moderno. TypeScript melhora segurança de tipos. Tailwind acelera ajustes visuais sem criar um design system pesado cedo demais.

## Não Prometer Resultado Garantido

Anúncios dependem de oferta, público, criativo, verba, atendimento, concorrência e execução. O produto deve falar em orientação inicial e acompanhamento, nunca em garantia de venda ou performance.

## Evoluir Em Etapas Pequenas

Cada avanço deve ter escopo claro, validação local e commit próprio. Isso facilita continuidade com Codex, outros agentes e colaboradores humanos.

## Validar Antes De Commit

Lint e build devem passar antes de cada commit. Fluxos que afetam usuário também precisam de teste manual.
