# Testes E Validação

## Comandos De Validação

Antes de commit, rode:

```bash
npm run lint
npm run build
git status --short --branch
```

## Configuração De Ambiente

Para o teste padrão de desenvolvimento, não é necessário ter `OPENAI_API_KEY`. Sem chave, o endpoint retorna um plano mockado compatível.

Para testar geração real, crie um `.env.local` local, nunca commitado:

```bash
OPENAI_API_KEY=sua-chave-local
OPENAI_MODEL=gpt-4.1-mini
OPENAI_MAX_OUTPUT_TOKENS=1800
AI_GENERATION_ENABLED=true
```

Para forçar o modo mock mesmo com chave configurada:

```bash
AI_GENERATION_ENABLED=false
```

Se sua conta não tiver acesso ao modelo configurado, ajuste `OPENAI_MODEL` para um modelo disponível. O build e o fluxo mock não dependem de modelo válido.

## Checklist Manual Do Fluxo Principal

1. Rode o servidor local:

   ```bash
   npm run dev
   ```

2. Acesse `http://localhost:3000`.
3. Clique em `Criar minha campanha`.
4. Preencha o formulário com dados simples.
5. Clique em `Gerar plano inicial`.
6. Confirme que o botão mostra estado de carregamento enquanto o plano é gerado.
7. Confirme que `/resultado` abre sem erro.
8. Confirme que o resultado mostra dados personalizados do formulário.
9. Confirme que o plano salvo aparece no `localStorage` com as chaves `campaign-plan-result` e `campaign-plan-source`.
10. Em modo sem chave, confirme que `campaign-plan-source` é `mock`.
11. Clique em `Ajustar informações` e confirme que volta para `/criar-campanha`.
12. Confirme que os dados anteriores aparecem preenchidos.
13. Edite uma informação, gere o plano novamente e confirme que `/resultado` reflete a alteração.

## Como Testar A Home

- Acesse `http://localhost:3000`.
- Confirme que a página mostra a proposta do Campanha Fácil IA e uma prévia do plano.
- Clique em `Criar minha campanha` e confirme que abre `/criar-campanha`.
- Volte para `/`.
- Clique em `Ver como funciona` e confirme que a página rola até a seção correta.
- Role manualmente para cima e clique em `Ver como funciona` novamente.
- Confirme que a rolagem funciona repetidamente.
- Clique em `Começar` no header e confirme que abre `/criar-campanha`.

## Como Testar /criar-campanha

- Verifique se o formulário está organizado por seções.
- Confirme que todos os campos principais estão visíveis.
- Confirme que campos obrigatórios usam validação HTML.
- Preencha exemplos realistas.
- Envie o formulário.
- Confirme que a chave `campaign-form-data` foi salva no `localStorage`.
- Confirme que a rota `POST /api/generate-campaign` respondeu com sucesso.
- Sem `OPENAI_API_KEY`, confirme que o fluxo usa fallback mock e continua sem erro.
- Confirme que payloads muito longos recebem erro amigável e não geram plano.
- Depois de gerar o resultado, clique em `Ajustar informações`.
- Confirme que `/criar-campanha` abre com os dados anteriores preenchidos.
- Edite um campo e gere novamente o plano.

## Como Testar /resultado Com localStorage

Após enviar o formulário:

- Confirme que a página mostra o nome do negócio.
- Confirme que oferta, cidade/região, objetivo, orçamento, público, diferencial, canal e experiência aparecem no plano.
- Confirme que o resultado usa `campaign-plan-result` quando essa chave existe.
- Se `campaign-plan-result` estiver inválido, confirme que a página usa fallback local e não quebra.
- Confirme que o aviso de orientação sem garantia está visível.
- Confirme que não há tela de erro do Next.js.
- Confirme que a seção `O que fazer primeiro` está visível.
- Clique em `Ver próximos passos`, volte manualmente o scroll e clique novamente.
- Confirme que a rolagem funciona repetidamente.
- Clique em pelo menos um botão `Copiar texto` e confirme o feedback `Copiado` ou o erro amigável.
- Clique em `Voltar ao topo`, role manualmente para baixo e clique novamente.
- Confirme que a rolagem para o topo funciona repetidamente.

## Como Testar /resultado Sem localStorage

No navegador, limpe o storage do site ou execute no console:

```js
localStorage.removeItem("campaign-form-data");
localStorage.removeItem("campaign-plan-result");
localStorage.removeItem("campaign-plan-source");
```

Depois acesse `http://localhost:3000/resultado`.

Resultado esperado:

- A página deve mostrar `Nenhum plano encontrado`.
- Deve haver um botão para voltar e criar uma campanha.
- A página não deve quebrar.

## Como Testar Modo IA Real

Use apenas uma chave de desenvolvimento em `.env.local`.

- Configure `OPENAI_API_KEY`.
- Rode `npm run dev`.
- Preencha `/criar-campanha` com dados realistas.
- Envie o formulário.
- Confirme que `/resultado` abre sem erro.
- Confirme que `campaign-plan-source` é `ai` quando a API responde no formato esperado.
- Confirme que o texto continua em português do Brasil, simples, orientativo e sem promessa de venda ou resultado garantido.
- Confirme que `OPENAI_MAX_OUTPUT_TOKENS` está em um valor conservador antes de testar com tráfego real.

Se a API falhar, o comportamento esperado é fallback mock com `campaign-plan-source` igual a `mock`.

Em desenvolvimento, inspecione o campo `debug` da resposta de `POST /api/generate-campaign` ou o log `[campaign-ai]`. O diagnóstico mostra apenas metadados seguros. Não deve registrar chave, headers, payload, resposta completa ou stack trace.

Se o debug mostrar `fallbackReason: "quota_exceeded"`, `apiStatus: 429` e `apiCode: "insufficient_quota"`, regularize a cota ou o faturamento do projeto OpenAI antes de repetir o teste real. O SDK está configurado sem retries automáticos para evitar chamadas adicionais nesse cenário.

## Como Testar Responsividade

- Reduza a largura do navegador ou use DevTools em largura próxima de 390px.
- Verifique `/`, `/criar-campanha` e `/resultado`.
- Confirme que não há overflow horizontal.
- Confirme que botões, cards, inputs, selects e textareas continuam legíveis.
- Confirme que os CTAs principais continuam acessíveis.

## Cuidados Antes De Commit E Push

- Não versionar `.next/`, logs, screenshots, perfis temporários de navegador ou arquivos de teste manual.
- Verificar `git status --short --branch`.
- Revisar o diff para garantir que a mudança está dentro do escopo.
- Rodar lint e build.
- Só commitar se as validações passarem.
