# Contexto Técnico

## Stack Atual

- Next.js com App Router.
- TypeScript.
- Tailwind CSS.
- ESLint.
- React Client Components para páginas que acessam `localStorage`.
- Sem backend próprio no MVP.

## Estrutura De Pastas Atual

```text
src/
  app/
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
  types/campaign.ts
```

## Fluxo Atual Completo

1. O usuário acessa `/`.
2. A home apresenta a proposta de valor, uma prévia do plano, benefícios e a seção `#como-funciona`.
3. O usuário clica em `Criar minha campanha` ou `Começar`.
4. Em `/criar-campanha`, preenche um formulário guiado por seções: negócio, oferta, público/região e configuração inicial.
5. Ao enviar, os dados são serializados em JSON e salvos no `localStorage`.
6. O usuário é redirecionado para `/resultado`.
7. A página de resultado lê os dados salvos no client e monta um plano inicial simulado/personalizado.
8. O usuário pode clicar em `Ajustar informações` para voltar ao formulário com os dados anteriores carregados.

## Uso Atual De localStorage

A chave atual é `campaign-form-data`.

O `localStorage` é usado apenas como persistência temporária do MVP. Ele não substitui banco de dados e não deve ser usado para dados sensíveis.

Em `/criar-campanha`, a leitura acontece no client com `useEffect`, parse seguro e preenchimento do formulário quando há dados válidos. Isso permite editar informações anteriores ao voltar de `/resultado`.

Em `/resultado`, a leitura também acontece no client, com `useEffect`, `try/catch` no `JSON.parse` e estado amigável quando os dados não existem ou são inválidos.

## Comportamentos Client-Side Atuais

- O componente `Button` trata links internos com hash usando `scrollIntoView({ behavior: "smooth" })`, para que botões como `Ver como funciona`, `Ver próximos passos` e `Voltar ao topo` funcionem repetidamente.
- A página `/resultado` usa `navigator.clipboard.writeText` para copiar textos de anúncio, com feedback simples de sucesso ou erro.
- O formulário em `/criar-campanha` usa validação HTML simples com campos obrigatórios.
- O envio do formulário mantém a chave `campaign-form-data` compatível com `/resultado`.

## O Que Ainda Não Existe

- Não há OpenAI API.
- Não há Supabase.
- Não há login.
- Não há banco de dados.
- Não há backend próprio.
- Não há histórico de campanhas.
- Não há exportação para PDF.
- Não há publicação automática de campanhas.
- Não há integração com Meta Ads API.
- Não há cobrança, planos pagos ou painel SaaS completo.

## Ausência Proposital De Backend

O MVP não possui API, banco de dados, autenticação ou processamento server-side próprio. Essa decisão reduz complexidade e permite validar o fluxo principal antes de adicionar infraestrutura.

## Pontos Planejados Para OpenAI API

- Receber os dados do formulário em rota server-side.
- Validar e normalizar entradas.
- Montar prompt estruturado.
- Chamar OpenAI API no servidor.
- Retornar plano em formato previsível.
- Tratar erros, limites e custos.

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
- O resultado atual é simulado e não deve ser apresentado como recomendação garantida.
