# Estado Atual Do Projeto

## Visão Atual

O **Campanha Fácil IA** é um MVP web para ajudar pequenos negócios brasileiros e pessoas leigas em anúncios a organizar um plano inicial de campanha para Meta Ads, Instagram, Facebook e WhatsApp.

A versão atual não usa IA real. Ela gera um plano simulado e personalizado localmente com base nas respostas do formulário.

## Stack

- Next.js
- TypeScript
- App Router
- Tailwind CSS
- ESLint
- `localStorage` para persistência temporária no navegador

## Funcionalidades Existentes

- Home em `/` com proposta de valor, prévia do plano, benefícios, seção "Para quem é" e "Como funciona".
- Formulário guiado em `/criar-campanha`, organizado por seções.
- Salvamento dos dados do formulário no `localStorage` com a chave `campaign-form-data`.
- Carregamento dos dados salvos ao voltar de `/resultado` para ajustar informações.
- Resultado em `/resultado` com plano inicial simulado/personalizado.
- Estado vazio amigável em `/resultado` quando não há dados salvos.
- Textos de anúncio com botão para copiar.
- Próximos passos, checklist, ideias de criativos e acompanhamento em 3, 7 e 14 dias.
- Botões de rolagem por âncora com `scrollIntoView`, funcionando repetidamente.
- Layout responsivo validado manualmente em largura mobile.

## Funcionalidades Que Ainda Não Existem

- OpenAI API.
- Supabase.
- Login.
- Banco de dados.
- Backend próprio.
- Histórico de campanhas.
- Exportação para PDF.
- Publicação automática de campanhas.
- Integração com Meta Ads API.
- Cobrança, planos pagos ou painel SaaS completo.

## Fluxo Principal

1. Usuário acessa `/`.
2. Clica em `Criar minha campanha` ou `Começar`.
3. Preenche o formulário guiado em `/criar-campanha`.
4. O formulário salva os dados no `localStorage`.
5. O usuário é redirecionado para `/resultado`.
6. `/resultado` lê os dados salvos e exibe o plano inicial simulado.
7. O usuário pode copiar textos de anúncio, revisar próximos passos e acompanhar checklist.
8. O usuário pode clicar em `Ajustar informações` para voltar ao formulário com os dados preenchidos.

## Principais Decisões

- Começar sem IA real para validar fluxo, estrutura e utilidade do produto.
- Usar `localStorage` no MVP para evitar backend e banco de dados cedo demais.
- Não prometer venda, lucro, performance ou aprovação de anúncios.
- Tratar o plano gerado como orientação inicial.
- Evoluir em commits pequenos e focados.
- Validar lint, build e fluxo manual antes de commitar.

## Próximos Passos Recomendados

- Definir o formato esperado do plano gerado por IA.
- Criar endpoint server-side para OpenAI API quando a Fase 2 começar.
- Planejar limites de uso e custo por geração.
- Implementar fallback amigável para falhas da IA.
- Validar respostas antes de exibir na UI.
- Revisar mensagens de orientação para evitar promessa exagerada.

## Comandos Úteis

```bash
npm install
npm run dev
npm run lint
npm run build
git status --short --branch
```

## Estado Atual De Validação

Últimos checkpoints visuais validaram:

- Home em desktop e mobile.
- CTA `Criar minha campanha`.
- CTA `Começar` no header.
- Botão `Ver como funciona` com rolagem repetida.
- Formulário guiado com preenchimento e persistência.
- Resultado personalizado com dados do formulário.
- Botões `Copiar texto`.
- Botões `Ver próximos passos` e `Voltar ao topo`.
- `npm run lint` passando.
- `npm run build` passando.
