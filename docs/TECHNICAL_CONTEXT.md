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

## Fluxo Atual Do Formulário

1. O usuário acessa `/criar-campanha`.
2. Preenche dados do negócio, oferta, público, orçamento e canal principal.
3. Ao enviar, os dados são serializados em JSON.
4. O JSON é salvo no `localStorage`.
5. O usuário é redirecionado para `/resultado`.
6. A página de resultado lê os dados salvos e monta um plano simulado personalizado.

## Uso Atual De localStorage

A chave atual é `campaign-form-data`.

O `localStorage` é usado apenas como persistência temporária do MVP. Ele não substitui banco de dados e não deve ser usado para dados sensíveis.

Em `/resultado`, a leitura deve acontecer no client, com `useEffect`, `try/catch` no `JSON.parse` e estado amigável quando os dados não existem ou são inválidos.

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
