# Testes E Validação

## Comandos De Validação

Antes de commit, rode:

```bash
npm run lint
npm run build
npm run test:e2e
git status --short --branch
```

## Configuração De Ambiente

Para o teste padrão de desenvolvimento, não é necessário ter chave de API. Com `AI_PROVIDER=mock`, o endpoint retorna um plano mockado compatível.

Para testar geração real, crie um `.env.local` local, nunca commitado:

```bash
AI_PROVIDER=mock
AI_REQUEST_TIMEOUT_MS=30000
AI_RATE_LIMIT_ENABLED=true
AI_RATE_LIMIT_MAX_REQUESTS=10
AI_RATE_LIMIT_WINDOW_MS=60000
OPENAI_API_KEY=sua-chave-local
OPENAI_MODEL=gpt-4.1-mini
OPENAI_MAX_OUTPUT_TOKENS=4200
GEMINI_API_KEY=sua-chave-local
GEMINI_MODEL=gemini-2.5-flash
AI_GENERATION_ENABLED=true
NEXT_PUBLIC_FEEDBACK_URL=
NEXT_PUBLIC_HELP_URL=
```

Escolha apenas o provedor que deseja testar:

```bash
AI_PROVIDER=mock
AI_PROVIDER=openai
AI_PROVIDER=gemini
```

Para desabilitar geração real mesmo com um provedor e uma chave configurados:

```bash
AI_GENERATION_ENABLED=false
```

O padrão é `mock`. A variável correta da chave Gemini é `GEMINI_API_KEY`. O build e o fluxo mock não dependem de chave ou modelo válido.

## Testes E2E Automatizados

A suíte versionada usa `@playwright/test` e fica em `tests/e2e/`. Na primeira configuração da máquina, instale o navegador gerenciado pelo Playwright:

```bash
npx playwright install chromium
```

Execute os testes em modo headless:

```bash
npm run test:e2e
```

Para acompanhar a execução com o navegador visível:

```bash
npm run test:e2e:headed
```

O `playwright.config.ts` inicia o Next.js em `http://127.0.0.1:3100`, não reutiliza outro servidor e sobrescreve o ambiente com `AI_PROVIDER=mock`, `AI_GENERATION_ENABLED=false` e chaves vazias. Também configura URLs públicas fictícias para validar os CTAs e reduz o rate limit para cinco requisições por IP no cenário específico de segurança. Assim, a suíte não depende de `.env.local` e não faz chamadas reais para OpenAI ou Gemini.

Os cenários atuais cobrem:

- fluxo completo da home ao resultado;
- preenchimento dos campos opcionais do briefing ampliado;
- resposta da API com `source` e `provider` iguais a `mock`;
- painel `Campanha pronta para revisão` com resumo acionável da campanha;
- material de apoio com plano completo, PDF e detalhes longos;
- pacote com três criativos e as principais seções dentro do material de apoio;
- guia de produção nos três criativos e cópia do briefing completo;
- plano de ação de 7 dias e cópia da rotina completa;
- cópia da campanha pronta e abertura do plano completo pela navegação rápida;
- cópia do plano completo e feedback visual;
- download do PDF;
- retorno ao formulário com dados persistidos, incluindo tom, fotos/vídeos, disponibilidade no WhatsApp e dificuldade atual;
- edição e regeneração do resultado;
- viewport mobile de 390 px sem overflow horizontal;
- disponibilidade da navegação rápida no mobile.
- abertura de seção recolhida pela navegação rápida no mobile.
- rejeição de body acima de 8 KB antes da geração;
- bloqueio por rate limit com status `429` e header `Retry-After`.
- criação de registros no histórico local;
- abertura e restauração de um plano anterior;
- exclusão individual até chegar ao estado vazio;
- estado vazio com histórico ausente ou JSON corrompido.
- presença dos links globais de Privacidade e Termos;
- carregamento e conteúdo essencial de `/privacidade` e `/termos`;
- aviso orientativo e ausência de garantia na tela e no texto copiado.
- resposta segura e sem cache de `/api/health`;
- metadata `noindex`/`nofollow` e bloqueio em `/robots.txt`.
- carregamento de `/beta` e acesso pelo rodapé;
- presença dos CTAs quando as duas URLs públicas estão configuradas;
- abertura dos canais externos em nova aba com `noopener` e `noreferrer`;
- presença dos CTAs também no resultado mock.

Os E2E validam comportamento de produto e não dependem dos logs internos de analytics.

Quando `NEXT_PUBLIC_FEEDBACK_URL` ou `NEXT_PUBLIC_HELP_URL` estiver vazia, o botão correspondente não deve ser renderizado. Se ambas estiverem vazias, o card inteiro fica oculto. Use apenas URLs HTTP(S); valores inválidos também são ignorados.

## Como Validar Analytics Local

- Rode o projeto em `development`.
- Abra o console do navegador e percorra formulário, resultado e histórico.
- Confirme que as mensagens `[analytics]` usam somente eventos documentados.
- Confirme que propriedades contêm apenas enums, booleanos e categorias genéricas.
- Não devem aparecer nome do negócio, cidade, oferta, público, dificuldade atual, orçamento ou conteúdo textual.
- Em build de produção, `trackEvent` deve permanecer no-op.
- Não existe requisição de rede para PostHog ou outro provedor nesta fase.

Relatórios, traces, screenshots e vídeos produzidos pelo Playwright são artefatos locais ignorados pelo Git.

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
10. Confirme que `campaign-plan-provider` contém o provedor efetivo.
11. Em modo mock, confirme que `campaign-plan-source` e `campaign-plan-provider` são `mock`.
12. Clique em `Ajustar informações` e confirme que volta para `/criar-campanha`.
13. Confirme que os dados anteriores aparecem preenchidos.
14. Edite uma informação, gere o plano novamente e confirme que `/resultado` reflete a alteração.
15. Acesse `/historico` e confirme que as duas gerações aparecem com as mais recentes primeiro.
16. Abra um plano, volte ao histórico e exclua os itens.

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
- Confirme que os campos opcionais estão indicados como opcionais e usam selects.
- Confirme que campos obrigatórios usam validação HTML.
- Preencha exemplos realistas.
- Envie o formulário.
- Confirme que a chave `campaign-form-data` foi salva no `localStorage`.
- Confirme que a rota `POST /api/generate-campaign` respondeu com sucesso.
- Com `AI_PROVIDER=mock`, confirme que o fluxo usa o plano de demonstração e continua sem erro.
- Confirme que payloads muito longos recebem erro amigável e não geram plano.
- Depois de gerar o resultado, clique em `Ajustar informações`.
- Confirme que `/criar-campanha` abre com os dados anteriores preenchidos.
- Edite um campo e gere novamente o plano.

## Como Testar /resultado Com localStorage

Após enviar o formulário:

- Confirme que a página mostra o nome do negócio.
- Confirme que oferta, cidade/região, objetivo, orçamento, público, diferencial, canal, experiência e campos opcionais preenchidos aparecem no plano quando úteis.
- Confirme que o resultado usa `campaign-plan-result` quando essa chave existe.
- Se `campaign-plan-result` estiver inválido, confirme que a página usa fallback local e não quebra.
- Confirme que o aviso de orientação sem garantia está visível.
- Confirme que não há tela de erro do Next.js.
- Confirme que `Campanha pronta para revisão`, `Passos para colocar no ar`, `Textos principais do anúncio` e `Criativo principal recomendado` ficam visíveis no primeiro contato.
- Confirme que `Material de apoio` fica recolhido por padrão e abre pelo botão `Mostrar` ou pela navegação rápida.
- Confirme que `Configuração sugerida da campanha`, `Roteiro de atendimento no WhatsApp`, `Métricas simples para acompanhar`, `Checklist antes de publicar`, `Plano de ação de 7 dias` e `Pacote de criativos` continuam disponíveis dentro do material de apoio.
- Clique em `Ver próximos passos`, volte manualmente o scroll e clique novamente.
- Confirme que a rolagem funciona repetidamente.
- Clique em `Copiar campanha pronta` e confirme o feedback `Campanha copiada`.
- Abra `Material de apoio`, clique em `Copiar plano completo` e confirme o feedback `Plano copiado`.
- Cole o conteúdo em um editor de texto e confirme nome do negócio, dados do briefing, aviso orientativo, resumo, configuração, próximos passos, plano de ação de 7 dias, textos, criativos, materiais, passos de produção, erros a evitar, prompts, WhatsApp, checklist, métricas e acompanhamento.
- Confirme que o texto copiado não contém JSON nem informações técnicas de provider/source.
- Clique em `Baixar PDF`, aguarde o feedback `PDF baixado` e confirme que o arquivo foi salvo com o nome do negócio.
- Abra o PDF e confira título, aviso orientativo, seções separadas, quebras de linha, acentos, múltiplas páginas e rodapés.
- Confirme que palavras como `Pizzaria`, `WhatsApp`, `bairro` e `orçamento` aparecem inteiras e que há espaços naturais depois de pontuação.
- Confirme que o PDF contém as mesmas seções principais do texto completo, sem JSON, provider/source ou promessa de resultado.
- Use a navegação rápida para `Campanha`, `Passos`, `Textos`, `Criativo` e `Plano completo`.
- Volte manualmente e clique novamente em cada destino para confirmar que a rolagem funciona mesmo com o mesmo hash na URL.
- Confirme que atalhos para seções recolhidas abrem o conteúdo antes de rolar.
- Clique em pelo menos um botão `Copiar texto` e confirme o feedback `Copiado` ou o erro amigável.
- Confirme que as seções `Configuração sugerida da campanha`, `Pacote de criativos`, `Roteiro de atendimento no WhatsApp` e `Métricas simples para acompanhar` aparecem no plano novo.
- Confirme que o pacote contém exatamente três criativos e informa que nenhuma imagem foi gerada.
- Confirme que o plano de ação contém exatamente sete dias e que `Copiar plano de ação` funciona.
- Copie uma legenda, um prompt visual, um briefing completo de criativo e uma resposta do WhatsApp; confirme o feedback `Copiado` ou `Briefing copiado`.
- Confirme que não há recomendação automática para aumentar verba.
- Clique em `Voltar ao topo`, role manualmente para baixo e clique novamente.
- Confirme que a rolagem para o topo funciona repetidamente.

## Como Testar Compatibilidade Com Plano Antigo

1. Gere um plano mock novo e copie o valor de `campaign-plan-result`.
2. Em uma cópia do objeto, remova `campaignSetupGuide`, `creativePack`, `whatsappScript`, `simpleMetricsGuide` e `sevenDayActionPlan`.
3. Salve o objeto antigo novamente em `campaign-plan-result`.
4. Recarregue `/resultado`.

Resultado esperado:

- As seções antigas continuam renderizando.
- As quatro seções novas ficam ocultas.
- A navegação rápida omite configuração, WhatsApp e métricas ausentes, mantendo os destinos de criativos e checklist.
- `Copiar plano completo` continua funcionando e omite os blocos opcionais ausentes.
- `Baixar PDF` continua funcionando e gera o documento sem os blocos opcionais ausentes.
- A página não usa fallback por ausência exclusiva desses campos e não apresenta erro.
- `Ajustar informações`, `Ver próximos passos`, cópia de textos e `Voltar ao topo` continuam funcionando.
- A seção `Plano de ação de 7 dias` fica oculta quando ausente.

## Como Testar Compatibilidade Com Formulário Antigo

1. Salve em `campaign-form-data` um objeto sem `communicationTone`, `hasVisualAssets`, `hasWhatsappResponder` e `currentChallenge`.
2. Abra `/criar-campanha`.
3. Confirme que os campos antigos aparecem preenchidos.
4. Confirme que os novos campos opcionais aparecem vazios.
5. Gere o plano em modo mock e confirme que `/resultado`, histórico, cópia e PDF continuam funcionando.

## Como Testar /resultado Sem localStorage

No navegador, limpe o storage do site ou execute no console:

```js
localStorage.removeItem("campaign-form-data");
localStorage.removeItem("campaign-plan-result");
localStorage.removeItem("campaign-plan-source");
localStorage.removeItem("campaign-plan-provider");
localStorage.removeItem("campaign-plan-history");
```

Depois acesse `http://localhost:3000/resultado`.

Resultado esperado:

- A página deve mostrar `Nenhum plano encontrado`.
- Deve haver um botão para voltar e criar uma campanha.
- A página não deve quebrar.

## Como Testar /historico

- Com o storage vazio, acesse `/historico` e confirme `Nenhum plano salvo ainda`.
- Gere um plano e confirme que ele aparece com nome, data, origem, objetivo e canal.
- Gere mais um plano alterando o nome do negócio e confirme que o novo item aparece primeiro.
- Clique em `Abrir plano` e confirme que `/resultado` mostra o negócio escolhido.
- Volte ao histórico, clique em `Excluir` e confirme que apenas o item selecionado desaparece.
- Exclua todos os itens e confirme o retorno ao estado vazio.
- Salve um texto inválido em `campaign-plan-history`, recarregue e confirme que a página não quebra.
- Confirme que o histórico contém no máximo os 10 planos mais recentes.
- Limpar dados do site deve apagar o histórico; não existe sincronização ou recuperação por conta nesta versão.

## Como Testar Páginas Legais

- Acesse `/` e confirme que o rodapé contém links discretos para `Privacidade` e `Termos`.
- Abra `/privacidade` e confirme as informações sobre dados do formulário, histórico no navegador, envio ao provedor real, analytics externo inativo e dados sensíveis.
- Abra `/termos` e confirme o caráter orientativo, a ausência de garantia, a revisão antes de publicar, a responsabilidade do usuário e a ausência de integração com Meta Ads.
- Verifique as duas páginas em desktop e mobile.
- Confirme que o header e os links legais permitem continuar a navegação pelo produto.

## Como Testar /beta E Os CTAs

- Abra `/beta` pelo link `Programa beta` no rodapé.
- Confirme proposta, público, quatro passos de teste, aviso sem garantia e próximos recursos possíveis.
- Com as duas variáveis públicas vazias, confirme que não há card de feedback.
- Configure URLs de teste sem segredo, reinicie o servidor e confirme os dois botões.
- Confirme que os links abrem em nova aba e não incluem dados do formulário ou do plano.
- Gere um plano mock e confirme o mesmo card em `/resultado`.
- Em desenvolvimento, confirme os eventos `beta_page_viewed`, `feedback_clicked` e `help_clicked` sem propriedades sensíveis.

## Como Testar Prontidão De Deploy

- Acesse `/api/health` e confirme status `200`.
- Confirme que o JSON contém somente `status`, `app`, `timestamp` e `environment`.
- Confirme que não aparecem provider, modelo, chave ou qualquer outra variável de ambiente.
- Confirme que o header `Cache-Control` contém `no-store`.
- Acesse `/` e confirme a meta `robots` com `noindex` e `nofollow`.
- Acesse `/robots.txt` e confirme `Disallow: /` enquanto o beta não deve ser indexado.

## Como Testar Modo IA Real

Use apenas uma chave de desenvolvimento em `.env.local`.

- Escolha `AI_PROVIDER=openai` e configure `OPENAI_API_KEY`, ou escolha `AI_PROVIDER=gemini` e configure `GEMINI_API_KEY`.
- Rode `npm run dev`.
- Preencha `/criar-campanha` com dados realistas.
- Envie o formulário.
- Confirme que `/resultado` abre sem erro.
- Confirme que `campaign-plan-source` é `ai` quando a API responde no formato esperado.
- Confirme que `campaign-plan-provider` corresponde a `openai` ou `gemini`.
- Confirme que o texto continua em português do Brasil, simples, orientativo e sem promessa de venda ou resultado garantido.
- Confirme que existem exatamente cinco próximos passos, todos com ações concretas, sem instruções vagas como aprender sobre anúncios ou revisar políticas.
- Confirme que os três textos cumprem papéis diferentes: abordagem direta, benefício ou diferencial e convite leve para conversa.
- Confirme que as quatro novas seções vieram preenchidas, que `creativePack` contém exatamente três itens e que `sevenDayActionPlan` contém exatamente sete dias.
- Confirme que os prompts visuais são briefings, sem afirmar que imagens foram geradas.
- Confirme que as respostas de WhatsApp não inventam preço, desconto ou urgência.
- Confirme que as métricas são explicadas em linguagem simples.
- Confirme que o passo a passo usa região, orçamento e poucos criativos, sem exigir configurações avançadas.
- Confirme que o checklist é verificável e que o acompanhamento aparece na ordem 3, 7 e 14 dias.
- Aos 14 dias, confirme que o plano propõe uma decisão baseada em custo e qualidade dos contatos, sem aumento automático de verba.
- Confirme que `OPENAI_MAX_OUTPUT_TOKENS` comporta o pacote estruturado antes de testar com tráfego real.

Se a API falhar, o comportamento esperado é fallback mock com `campaign-plan-source` igual a `mock`.

Timeouts também devem resultar em fallback mock com `fallbackReason: "timeout"` no debug de desenvolvimento. OpenAI e Gemini estão configurados sem retry automático para evitar chamadas adicionais e custo duplicado.

Para Gemini, faça no máximo uma geração real por rodada de validação. Confira previamente no Google AI Studio a disponibilidade do modelo e os limites do projeto; cotas gratuitas podem mudar.

Em desenvolvimento, inspecione o campo `debug` da resposta de `POST /api/generate-campaign` ou o log `[campaign-ai]`. O diagnóstico mostra apenas metadados seguros. Não deve registrar chave, headers, payload, resposta completa ou stack trace.

Se o debug mostrar `fallbackReason: "quota_exceeded"`, `apiStatus: 429` e `apiCode: "insufficient_quota"`, regularize a cota ou o faturamento do projeto OpenAI antes de repetir o teste real. O SDK está configurado sem retries automáticos para evitar chamadas adicionais nesse cenário.

## Como Testar Responsividade

- Reduza a largura do navegador ou use DevTools em largura próxima de 390px.
- Verifique `/`, `/criar-campanha` e `/resultado`.
- Confirme que não há overflow horizontal.
- Confirme que botões, cards, inputs, selects e textareas continuam legíveis.
- Em `/resultado`, confirme que a navegação rápida quebra em duas colunas e que `Copiar plano completo` e `Baixar PDF` ocupam a largura disponível sem causar overflow.
- Confirme que os CTAs principais continuam acessíveis.

## Cuidados Antes De Commit E Push

- Não versionar `.next/`, logs, screenshots, perfis temporários de navegador ou arquivos de teste manual.
- Não versionar `playwright-report/`, `test-results/` ou `blob-report/`.
- Verificar `git status --short --branch`.
- Revisar o diff para garantir que a mudança está dentro do escopo.
- Rodar lint, build e `npm run test:e2e`.
- Só commitar se as validações passarem.
