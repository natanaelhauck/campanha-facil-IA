# Estado Atual Do Projeto

## Visão Atual

O **Campanha Fácil IA** é um MVP web para ajudar pequenos negócios brasileiros e pessoas leigas em anúncios a organizar um plano inicial de campanha para Meta Ads, Instagram, Facebook e WhatsApp.

A versão atual já tem uma camada de IA real no backend do Next.js com OpenAI e Gemini. Sem provedor real configurado, o sistema usa fallback mock e mantém o fluxo funcionando.

## Direção Estratégica Atual

O projeto quer ser uma camada guiada, simples e segura para pequenos negócios e pessoas leigas organizarem campanhas antes de investir dinheiro.

Ele não quer ser, neste momento, uma ferramenta técnica avançada para gestores de tráfego nem apenas mais um conector de Meta Ads.

A existência de MCPs, conectores e APIs capazes de operar contas de anúncio não invalida o produto, porque o diferencial pretendido está na experiência, na educação, na linguagem simples e na redução de risco para quem ainda não sabe por onde começar.

Meta Ads MCP/API pode ser infraestrutura futura para leitura de dados, diagnóstico e ações assistidas, sempre com consentimento e confirmação humana antes de qualquer alteração real.

Próximos passos recomendados: consolidar a geração real de plano com IA, depois avançar para diagnóstico por métricas inseridas manualmente e só então avaliar integrações com contas de anúncio.

## Stack

- Next.js
- TypeScript
- App Router
- Tailwind CSS
- ESLint
- OpenAI SDK no backend
- `localStorage` para persistência temporária no navegador

## Funcionalidades Existentes

- Home em `/` com proposta de valor, prévia do plano, benefícios, seção "Para quem é" e "Como funciona".
- Formulário guiado em `/criar-campanha`, organizado por seções.
- Salvamento dos dados do formulário no `localStorage` com a chave `campaign-form-data`.
- Chamada para `POST /api/generate-campaign` ao enviar o formulário.
- Seleção segura por `AI_PROVIDER`: `mock`, `openai` ou `gemini`, com padrão `mock`.
- Geração com OpenAI Responses API ou Google Gemini API quando o provedor e a chave estão configurados.
- Modelos configuráveis por `OPENAI_MODEL` e `GEMINI_MODEL`.
- Limite conservador de saída por `OPENAI_MAX_OUTPUT_TOKENS`, com padrão 1800.
- Validação de payload com campos obrigatórios, limites por campo e limite total de entrada.
- Fallback mock automático quando não há chave, quando a IA está desabilitada ou quando a geração falha.
- Diagnóstico seguro em desenvolvimento com motivo do fallback, sem expor chave, payload ou resposta bruta.
- Chamadas OpenAI sem retries automáticos, evitando novas tentativas em erros como cota insuficiente.
- Salvamento do plano gerado no `localStorage` com a chave `campaign-plan-result`.
- Salvamento da origem do plano com a chave `campaign-plan-source`.
- Salvamento do provedor efetivo com a chave `campaign-plan-provider`.
- Carregamento dos dados salvos ao voltar de `/resultado` para ajustar informações.
- Resultado em `/resultado` usando o plano salvo ou fallback local quando necessário.
- Indicação discreta da origem do plano: IA ou demonstração.
- Estado vazio amigável em `/resultado` quando não há dados salvos.
- Textos de anúncio com botão para copiar.
- Próximos passos, checklist, ideias de criativos e acompanhamento em 3, 7 e 14 dias.
- Botões de rolagem por âncora com `scrollIntoView`, funcionando repetidamente.
- Layout responsivo validado manualmente em largura mobile.

## Funcionalidades Que Ainda Não Existem

- Supabase.
- Login.
- Banco de dados.
- Histórico de campanhas.
- Exportação para PDF.
- Publicação automática de campanhas.
- Integração com Meta Ads API.
- Cobrança, planos pagos ou painel SaaS completo.

## Fluxo Principal

1. Usuário acessa `/`.
2. Clica em `Criar minha campanha` ou `Começar`.
3. Preenche o formulário guiado em `/criar-campanha`.
4. O formulário chama `POST /api/generate-campaign`.
5. O endpoint seleciona o provedor configurado, gera o plano com IA quando possível ou retorna fallback mock.
6. O client salva formulário, plano e origem no `localStorage`.
7. O usuário é redirecionado para `/resultado`.
8. `/resultado` lê o plano salvo e exibe o plano inicial personalizado.
9. O usuário pode copiar textos de anúncio, revisar próximos passos e acompanhar checklist.
10. O usuário pode clicar em `Ajustar informações` para voltar ao formulário com os dados preenchidos.

## Principais Decisões

- Adicionar IA real primeiro no backend, sem expor chave no frontend.
- Manter OpenAI e Gemini atrás do mesmo contrato de resultado e validação.
- Usar `mock` como provedor padrão para impedir chamadas acidentais.
- Manter fallback mock para desenvolvimento, falhas e ausência de chave.
- Usar `localStorage` no MVP para evitar backend e banco de dados cedo demais.
- Não prometer venda, lucro, performance ou aprovação de anúncios.
- Tratar o plano gerado como orientação inicial.
- Evoluir em commits pequenos e focados.
- Validar lint, build e fluxo manual antes de commitar.

## Próximos Passos Recomendados

- Regularizar a cota/faturamento do projeto OpenAI usado no desenvolvimento.
- Repetir um único teste de geração real após a cota estar disponível.
- Ajustar prompt e schema a partir de exemplos reais.
- Planejar limites de uso e custo por geração antes de liberar publicamente.
- Implementar limite por usuário/IP em fase futura.
- Melhorar observabilidade sem registrar dados sensíveis.
- Revisar mensagens de orientação para evitar promessa exagerada.

## Comandos Úteis

```bash
npm install
npm run dev
npm run lint
npm run build
git status --short --branch
```

Para testar IA real localmente, copie `.env.example` para `.env.local`, escolha `AI_PROVIDER` e configure somente a chave do provedor escolhido. Use `GEMINI_API_KEY` para Gemini. Sem configuração explícita, o modo mock é esperado.

## Estado Atual De Validação

Últimos checkpoints visuais validaram:

- Home em desktop e mobile.
- CTA `Criar minha campanha`.
- CTA `Começar` no header.
- Botão `Ver como funciona` com rolagem repetida.
- Formulário guiado com preenchimento e persistência.
- Resultado personalizado com dados do formulário e plano salvo.
- Fallback mock sem `OPENAI_API_KEY`.
- Fallback mock com Gemini sem chave ou indisponível.
- Modo mock forçado com `AI_GENERATION_ENABLED=false`.
- Tentativa real chegando à OpenAI e retornando `429 insufficient_quota`, com fallback seguro.
- Geração real com `gemini-2.5-flash`, retornando `source: ai`, `provider: gemini` e plano validado.
- Botões `Copiar texto`.
- Botões `Ver próximos passos` e `Voltar ao topo`.
- `npm run lint` passando.
- `npm run build` passando.
