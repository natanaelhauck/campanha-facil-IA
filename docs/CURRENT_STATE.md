# Estado Atual Do Projeto

## Visão Atual

O **Campanha Fácil IA** é um MVP web para ajudar pequenos negócios brasileiros e pessoas leigas em anúncios a montar um pacote inicial de execução para Meta Ads, Instagram, Facebook e WhatsApp.

A versão atual já tem uma camada de IA real no backend do Next.js com OpenAI e Gemini. O resultado inclui configuração sugerida, briefings de criativos, roteiro de WhatsApp e métricas simples. Sem provedor real configurado, o sistema usa fallback mock e mantém o fluxo funcionando.

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
- Playwright Test
- OpenAI SDK no backend
- Google GenAI SDK no backend
- `localStorage` para persistência temporária no navegador

## Funcionalidades Existentes

- Home em `/` com proposta de valor, prévia do plano, benefícios, seção "Para quem é" e "Como funciona".
- Formulário guiado em `/criar-campanha`, organizado por seções.
- Briefing ampliado com oferta principal, diferencial, público ideal, região, canal, orçamento, experiência, objetivo, tom de comunicação, fotos/vídeos disponíveis, disponibilidade para WhatsApp e principal dificuldade atual.
- Novos campos de briefing são estruturados e opcionais quando possível, preservando um fluxo simples para pessoas leigas.
- Salvamento dos dados do formulário no `localStorage` com a chave `campaign-form-data`.
- Chamada para `POST /api/generate-campaign` ao enviar o formulário.
- Seleção segura por `AI_PROVIDER`: `mock`, `openai` ou `gemini`, com padrão `mock`.
- Geração com OpenAI Responses API ou Google Gemini API quando o provedor e a chave estão configurados.
- Modelos configuráveis por `OPENAI_MODEL` e `GEMINI_MODEL`.
- Limite de saída por `OPENAI_MAX_OUTPUT_TOKENS`, com padrão 4200 para comportar o pacote estruturado.
- Validação de payload com campos obrigatórios, campos opcionais de briefing, limites por campo e limite total de entrada.
- Validação do plano com três textos de anúncio, cinco próximos passos concretos, acompanhamento ordenado em 3, 7 e 14 dias e rejeição de promessas ou orientações vagas.
- Fallback mock automático quando não há chave, quando a IA está desabilitada ou quando a geração falha.
- Diagnóstico seguro em desenvolvimento com motivo do fallback, sem expor chave, payload ou resposta bruta.
- Chamadas OpenAI sem retries automáticos, evitando novas tentativas em erros como cota insuficiente.
- Chamadas OpenAI e Gemini com timeout configurável e uma única tentativa por geração.
- Body limitado a 8 KB durante a leitura, content type JSON obrigatório e limites por campo mantidos.
- Rate limit em memória por cliente, com resposta `429` e `Retry-After` ao exceder a janela.
- Prompt com delimitação explícita de dados não confiáveis, filtragem de campos vazios e validação estrutural da saída.
- Salvamento do plano gerado no `localStorage` com a chave `campaign-plan-result`.
- Salvamento da origem do plano com a chave `campaign-plan-source`.
- Salvamento do provedor efetivo com a chave `campaign-plan-provider`.
- Histórico local em `/historico`, salvo na chave `campaign-plan-history` e limitado aos 10 planos mais recentes.
- Cada item do histórico preserva formulário, plano, data, negócio, objetivo, origem e provedor.
- Ações para abrir um plano anterior, restaurando o estado atual, e excluir itens individualmente.
- Leitura defensiva do histórico: conteúdo ausente, inválido ou corrompido resulta em estado vazio sem quebrar a interface.
- Carregamento dos dados salvos ao voltar de `/resultado` para ajustar informações.
- Resultado em `/resultado` usando o plano salvo ou fallback local quando necessário.
- Indicação discreta da origem do plano: IA ou demonstração.
- Estado vazio amigável em `/resultado` quando não há dados salvos.
- Bloco `Comece por aqui` em `/resultado`, com orientação curta para copiar o plano, revisar próximos passos, produzir criativos, seguir os 7 dias e baixar PDF.
- Organização de `/resultado` com seções recolhíveis acessíveis, mantendo abertos os blocos principais e recolhendo conteúdos de consulta para reduzir rolagem.
- Textos de anúncio com botão para copiar.
- Próximos passos, checklist, ideias de criativos e acompanhamento em 3, 7 e 14 dias.
- Plano de ação de 7 dias com tarefas práticas, entrega esperada e cuidado de cada dia.
- Configuração sugerida da campanha com objetivo, canal, verba, região, público e duração do primeiro teste.
- Pacote com três briefings de criativos, incluindo legenda, prompt visual e dica de produção.
- Guia prático de produção em cada criativo, com objetivo, cena, materiais, passos, dica de Canva, erros a evitar e briefing pronto para copiar.
- Roteiro de atendimento no WhatsApp com respostas copiáveis.
- Guia simples de métricas, bons sinais, alertas e momento de esperar ou ajustar.
- Ação `Copiar plano completo`, que formata o pacote em texto simples para WhatsApp, Google Docs, Notion ou e-mail.
- Ação `Copiar plano de ação`, que copia somente a rotina de 7 dias sem dados técnicos.
- Ação `Baixar PDF`, que exporta o mesmo conteúdo em um documento paginado e organizado diretamente no navegador.
- Navegação rápida em `/resultado` para textos, configuração, criativos, WhatsApp, métricas, checklist e acompanhamento, exibindo apenas seções disponíveis quando aplicável e abrindo seções recolhidas antes de rolar.
- Compatibilidade com dados antigos no `localStorage`: campos opcionais de briefing ausentes viram vazio e planos antigos continuam renderizando sem erro.
- Botões de rolagem por âncora com `scrollIntoView`, funcionando repetidamente.
- Layout responsivo validado manualmente em largura mobile.
- Suíte E2E versionada com fluxo principal desktop e validação mobile em 390 px.
- Ambiente E2E isolado, com servidor dedicado e `AI_PROVIDER=mock` forçado.
- Cenários E2E para payload excessivo e rate limit, sem chamadas externas.
- Camada interna de analytics com 16 eventos tipados, whitelist de propriedades e nenhum envio externo.
- Analytics aceita apenas enums seguros para canal, experiência, tom de comunicação e disponibilidade de fotos/vídeos; textos livres do briefing continuam proibidos.
- Logs de analytics somente em desenvolvimento; produção permanece no-op.
- Página `/beta` com proposta, público, roteiro de teste, aviso orientativo, feedback e próximos recursos possíveis.
- Link discreto para o programa beta no rodapé.
- CTAs opcionais de feedback e ajuda em `/resultado`, controlados por URLs públicas e sem envio automático do plano.
- Páginas legais simples em `/privacidade` e `/termos`, com links globais discretos.
- Política de privacidade explicando dados do formulário, `localStorage`, uso de provedores reais, ausência de analytics externo e cuidado com dados sensíveis.
- Termos deixando claro o caráter orientativo, a ausência de garantia, a revisão humana e a inexistência de integração com Meta Ads.
- Checklist de configuração e validação para futuro deploy em `docs/DEPLOYMENT.md`.
- Rota `GET /api/health` com resposta mínima, ambiente normalizado e sem cache.
- Runtime Node.js explícito nas rotas server-side e Node.js `24.x` fixado para builds.
- Metadata de beta com `noindex`/`nofollow` e `/robots.txt` bloqueando indexação por enquanto.
- Roteiro de validação com perfil de participantes, perguntas, sinais e métricas manuais em `docs/BETA_VALIDATION.md`.

## Funcionalidades Que Ainda Não Existem

- Supabase.
- Login.
- Banco de dados.
- Histórico sincronizado entre dispositivos ou associado a usuário.
- Publicação automática de campanhas.
- Integração com Meta Ads API.
- Geração real de imagens; os criativos atuais são briefings e prompts para produção futura.
- Cobrança, planos pagos ou painel SaaS completo.
- Provedor externo de analytics, autocapture ou gravação de sessão.

## Fluxo Principal

1. Usuário acessa `/`.
2. Clica em `Criar minha campanha` ou `Começar`.
3. Preenche o formulário guiado em `/criar-campanha`.
4. O formulário chama `POST /api/generate-campaign`.
5. O endpoint seleciona o provedor configurado, gera o plano com IA quando possível ou retorna fallback mock.
6. O client salva formulário, plano e origem no `localStorage`.
7. O usuário é redirecionado para `/resultado`.
8. `/resultado` lê o plano salvo e exibe o pacote de execução personalizado.
9. O usuário pode copiar itens isolados, copiar o plano completo em texto, baixar o pacote em PDF e navegar diretamente entre as principais seções.
10. O usuário pode clicar em `Ajustar informações` para voltar ao formulário com os dados preenchidos.
11. Cada geração bem-sucedida também entra no histórico local, mantendo no máximo 10 itens.
12. Em `/historico`, o usuário pode abrir um plano anterior ou excluí-lo.

## Principais Decisões

- Adicionar IA real primeiro no backend, sem expor chave no frontend.
- Manter OpenAI e Gemini atrás do mesmo contrato de resultado e validação.
- Usar `mock` como provedor padrão para impedir chamadas acidentais.
- Manter fallback mock para desenvolvimento, falhas e ausência de chave.
- Usar `localStorage` no MVP para evitar backend e banco de dados cedo demais.
- Manter o histórico exclusivamente local nesta fase, sem simular conta ou sincronização.
- Centralizar analytics em uma camada interna e proibir texto livre ou identificação do negócio.
- Não prometer venda, lucro, performance ou aprovação de anúncios.
- Tratar o pacote gerado como orientação inicial que precisa de revisão humana.
- Evoluir em commits pequenos e focados.
- Validar lint, build e fluxo manual antes de commitar.

## Próximos Passos Recomendados

- Regularizar a cota/faturamento do projeto OpenAI usado no desenvolvimento.
- Repetir um único teste de geração real após a cota estar disponível.
- Calibrar o prompt refinado com amostras de diferentes tipos de negócio e combinações do briefing ampliado.
- Planejar limites de uso e custo por geração antes de liberar publicamente.
- Implementar limite por usuário/IP em fase futura.
- Melhorar observabilidade sem registrar dados sensíveis.
- Avaliar PostHog somente após definir política de privacidade, retenção e consentimento aplicável.
- Adotar rate limit distribuído ou da plataforma antes do beta público; o contador atual não é compartilhado entre instâncias serverless.
- Revisar identificação da empresa e canal de contato nas páginas legais quando essas informações existirem.
- Criar testes automatizados específicos para regras de qualidade do plano.
- Avaliar geração real de imagens somente em fase futura, com custo e revisão explícitos.

## Comandos Úteis

```bash
npm install
npm run dev
npm run lint
npm run build
npm run test:e2e
git status --short --branch
```

Para testar IA real localmente, copie `.env.example` para `.env.local`, escolha `AI_PROVIDER` e configure somente a chave do provedor escolhido. Use `GEMINI_API_KEY` para Gemini. Sem configuração explícita, o modo mock é esperado.

## Estado Atual De Validação

Últimos checkpoints visuais validaram:

- Home em desktop e mobile.
- CTA `Criar minha campanha`.
- CTA `Começar` no header.
- Botão `Ver como funciona` com rolagem repetida.
- Formulário guiado com preenchimento, campos opcionais do briefing e persistência.
- Resultado personalizado com dados do formulário e plano salvo.
- Fallback mock sem `OPENAI_API_KEY`.
- Fallback mock com Gemini sem chave ou indisponível.
- Modo mock forçado com `AI_GENERATION_ENABLED=false`.
- Tentativa real chegando à OpenAI e retornando `429 insufficient_quota`, com fallback seguro.
- Geração real com `gemini-2.5-flash`, retornando `source: ai`, `provider: gemini` e plano validado.
- Botões `Copiar texto`.
- Pacote de execução mock com três criativos, roteiro de WhatsApp e métricas simples.
- Cópia de legenda, prompt visual e resposta do WhatsApp.
- Cópia do briefing completo de cada criativo com materiais, passos e erros a evitar.
- Cópia do plano de ação de 7 dias com feedback `Plano de ação copiado`.
- Cópia do plano completo com feedback `Plano copiado`, dados do briefing e as principais seções em texto simples.
- Download do plano em PDF paginado, legível e sem dados técnicos do provider.
- Seções recolhíveis de `/resultado`, incluindo abertura manual e abertura pela navegação rápida.
- Navegação rápida e repetida entre as principais seções do resultado.
- Plano antigo sem as quatro novas seções renderizando sem erro.
- Resultado responsivo sem overflow horizontal em largura de 390px.
- Botões `Ver próximos passos` e `Voltar ao topo`.
- Testes E2E do fluxo principal, cópia, PDF, persistência, regeneração e navegação mobile passando em Chromium.
- Testes de segurança do endpoint para body acima do limite e bloqueio `429` passando em mock.
- Histórico local validado em E2E com criação, listagem, restauração, exclusão, estado vazio e conteúdo corrompido.
- Links legais e carregamento de `/privacidade` e `/termos` validados em E2E.
- `npm run lint` passando.
- `npm run build` passando.
- `npm run test:e2e` passando.
