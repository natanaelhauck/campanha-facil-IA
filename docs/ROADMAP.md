# Roadmap

## Fase 1: MVP Guiado Sem Conta Conectada

Status: concluída como primeira versão visual funcional. Deve continuar recebendo pequenos ajustes de copy, documentação, acessibilidade e validação manual, mas o fluxo principal já está operacional.

### Entregas Concluídas

- Página inicial explicando a proposta.
- Página inicial com hero, prévia do plano, benefícios, seção "Para quem é" e "Como funciona".
- Formulário guiado em `/criar-campanha`, organizado por seções.
- Briefing ampliado com campos estruturados para tom de comunicação, fotos/vídeos disponíveis, disponibilidade no WhatsApp e dificuldade atual.
- Carregamento dos dados salvos ao voltar de `/resultado` para ajustar informações.
- Resultado simulado em `/resultado`, com plano inicial personalizado.
- Plano de ação de 7 dias para guiar a primeira semana depois da geração.
- Personalização local com `localStorage`.
- Histórico local com até 10 planos, abertura e exclusão individual.
- Base opcional de Supabase/Auth desligada por padrão, preservando modo visitante.
- `/entrar` com magic link quando Supabase está habilitado e aviso amigável quando desligado.
- Estrutura `campaigns` com RLS documentada para futuro histórico em nuvem.
- Textos de anúncio copiáveis.
- Próximos passos, checklist e acompanhamento em `/resultado`.
- Botões de rolagem por âncora funcionando repetidamente.
- Componentes reutilizáveis básicos.
- Documentação base do projeto.
- Checkpoint de documentação do estado atual.

### Riscos Atuais

- Usuário interpretar o resultado simulado como recomendação definitiva.
- Fluxo ficar genérico demais para segmentos específicos.
- Falta de persistência real limitar uso recorrente.
- Ajustes visuais futuros aumentarem escopo antes de validar uso real.

### Critérios De Conclusão Atendidos

- Formulário salva dados no navegador.
- Resultado exibe informações personalizadas.
- Estado sem dados em `/resultado` funciona.
- Formulário recarrega dados salvos ao ajustar informações.
- Histórico local tolera conteúdo ausente ou corrompido.
- Home, formulário e resultado são responsivos.
- `npm run lint`, `npm run build` e `npm run test:e2e` passam.
- Fluxo principal e histórico local validados automaticamente.

### Transição Para IA Real

- Manter documentação atualizada.
- Revisar manualmente copy de orientação para evitar promessa de resultado.
- Definir formato esperado de resposta da IA.
- Definir limites básicos de uso/custo para chamadas de IA.
- Planejar fallback quando a geração real falhar.

## Fase 2: IA Real Com OpenAI API

Status: em evolução. A base técnica funciona com OpenAI, Gemini e fallback mock, e o resultado avançou de plano inicial para pacote de execução. Ainda faltam calibração com mais segmentos e limites de uso antes de considerar a fase concluída.

### Entregas Concluídas Nesta Base Inicial

- Endpoint server-side para gerar plano com IA.
- Prompt estruturado com dados do formulário.
- Formato de resposta previsível para preencher seções do resultado.
- Tratamento de erros com fallback mock.
- Avisos claros sobre orientação e ausência de garantia.
- Modo de fallback quando a chave está ausente, a geração está desabilitada ou a IA falha.
- Chave da OpenAI restrita ao servidor.
- Configuração sugerida da campanha em formato consultável.
- Três guias de criativos com objetivo, cena, materiais, passos de produção, dica de Canva, legenda, CTA, prompt visual, erros a evitar e briefing copiável.
- Roteiro de atendimento no WhatsApp com respostas copiáveis.
- Guia simples de métricas e sinais para esperar ou ajustar.
- Plano de ação de 7 dias gerado junto com o pacote, sem aumento automático de orçamento.
- Leitura compatível de planos antigos salvos sem as novas seções.
- Prompt e mock usando os novos campos do briefing quando preenchidos, sem inventar dados ausentes.

### Entregas Pendentes

- Calibrar prompt e schema com diferentes tipos de negócio.
- Definir limites simples de uso para controlar custo.
- Melhorar validação e observabilidade sem registrar dados sensíveis.
- Definir política de erro para indisponibilidade prolongada da API.

### Riscos

- Custo por uso sem limite.
- Respostas inconsistentes, incompletas ou longas demais.
- Exposição indevida de chave de API no cliente.
- Promessas exageradas de resultado.
- Prompt injection ou entradas maliciosas no formulário.
- Falta de validação do formato retornado pela IA.
- Falha da API sem fallback amigável.
- Logs excessivos com dados sensíveis do usuário.
- Uso público sem limite de frequência ou proteção contra abuso.

### Critérios De Conclusão

- Chave de API usada apenas no servidor.
- Plano gerado com tempo de resposta aceitável.
- Erros tratados de forma amigável.
- Custo e limites documentados.
- Resposta validada antes de exibir na UI.
- Fallback funcionando quando a IA falhar.
- Lint, build e teste manual passam.

### Preparação De Analytics Com Privacidade

Status: camada interna concluída, sem provedor externo.

- Eventos principais do funil foram definidos em um contrato único.
- Apenas propriedades enumeradas e não identificáveis são aceitas.
- Nenhum nome, localização, oferta, público ou texto livre é registrado.
- Em produção, tracking permanece desabilitado.
- PostHog ou alternativa futura depende de política de privacidade, retenção e revisão de consentimento.

## Preparação Para Beta Público

Status: base documental e legal concluída, sem deploy realizado. A liberação com IA real continua condicionada a proteção distribuída contra abuso e controle operacional de custo.

### Entregas Concluídas

- Página `/privacidade` com explicação simples sobre formulário, `localStorage`, provedores de IA, analytics e dados sensíveis.
- Página `/termos` com caráter orientativo, ausência de garantia, revisão humana e responsabilidade pela campanha real.
- Links legais globais e discretos.
- Checklist de ambiente, segredos, validação, liberação e reversão em `docs/DEPLOYMENT.md`.
- `.env.example` revisado com todos os provedores e controles atuais.
- Cobertura E2E para links e carregamento das páginas legais.

### Bloqueios Antes Da Liberação Com IA Real

- Substituir ou complementar o rate limit em memória com uma camada distribuída ou proteção da plataforma.
- Definir alertas e limites de custo/cota no provedor escolhido.
- Revisar os textos legais com os dados reais da operação e da empresa quando estiverem disponíveis.
- Executar smoke test do artefato em ambiente de preview usando mock.

### Fora Do Escopo Desta Preparação

- Deploy real.
- Login obrigatório, migração automática de histórico local ou área de conta completa.
- Meta Ads API.
- PostHog ou outro analytics externo.

## Validação Beta Controlada

Status: base de recrutamento e feedback concluída; entrevistas e observação com usuários reais devem acontecer em rodadas pequenas.

### Entregas Concluídas

- Página `/beta` explicando proposta, público, roteiro de teste, limites e próximos recursos possíveis.
- Link discreto para o programa beta no rodapé.
- CTAs opcionais para feedback e pedido de ajuda, sem anexar dados do plano.
- Variáveis públicas separadas para os dois canais.
- Eventos internos `beta_page_viewed`, `feedback_clicked` e `help_clicked`, ainda sem envio externo.
- Documento `docs/BETA_VALIDATION.md` com método, perguntas, sinais e métricas manuais.
- Cobertura E2E para a página e para os links configurados.

### Próximas Decisões Baseadas Em Evidência

- Identificar onde participantes abandonam ou precisam de ajuda.
- Priorizar clareza e utilidade antes de ampliar funcionalidades.
- Validar se existe demanda recorrente por ajuda para configuração.
- Decidir se login, persistência remota ou pagamento resolvem um problema observado.

### Limites

- Nenhum botão envia formulário ou plano automaticamente.
- Analytics externo continua desativado.
- Feedback pode ser coletado em canal externo configurado manualmente.
- Recursos planejados na página beta não representam compromisso de entrega.

## Fase Futura: Geração Assistida De Imagens

### Entregas Planejadas

- Transformar briefings visuais aprovados em imagens, sem assumir publicação automática.
- Permitir revisão do prompt, do resultado e da marca antes de usar o criativo.
- Controlar custo, quantidade de variações e armazenamento dos arquivos.

### Limites Atuais

- O campo `aiImagePrompt` é somente texto para Canva, designer ou futura IA de imagem.
- Nenhuma imagem é criada, enviada ou publicada pela versão atual.
- A integração só deve avançar depois de validar utilidade, custo e revisão humana.

## Fase 3: Diagnóstico Manual Por Métricas Informadas

### Entregas

- Formulário simples para o usuário informar métricas manualmente.
- Diagnóstico inicial com base em gastos, cliques, contatos, custo por contato e qualidade das conversas.
- Recomendações de leitura simples: manter, pausar, revisar oferta, ajustar criativo ou acompanhar por mais tempo.
- Explicações educativas sobre sinais básicos de campanha.
- Avisos claros de que a análise depende dos dados informados pelo usuário.

### Riscos

- Usuário informar métricas incorretas ou incompletas.
- Produto parecer diagnóstico definitivo.
- Recomendações ficarem genéricas demais.
- Linguagem técnica confundir usuários leigos.

### Critérios De Conclusão

- Usuário entende quais métricas precisa inserir.
- Diagnóstico aparece com linguagem simples.
- Nenhuma recomendação promete venda, lucro ou performance.
- Lint, build e teste manual passam.

## Fase 4: Leitura De Dados Via Integração, Com Consentimento

### Entregas

- Estudo de permissões, políticas e escopo mínimo de leitura da Meta.
- Conexão assistida com conta de anúncios, apenas com consentimento explícito.
- Leitura de dados para diagnóstico, sem alterar campanhas.
- Mensagens claras sobre quais dados serão lidos e por quê.
- Tratamento de tokens, expiração, revogação e erros de permissão.

### Riscos

- Permissões mal dimensionadas.
- Falhas na segurança de tokens.
- Usuário não entender o que está autorizando.
- Dependência de APIs externas instáveis.
- Leitura de dados ser interpretada como garantia de resultado.

### Critérios De Conclusão

- Escopo de permissões validado.
- Consentimento explícito antes da conexão.
- Nenhuma ação real é feita na conta.
- Tokens tratados com segurança.
- Diagnóstico continua compreensível para leigos.

## Fase 5: Ações Assistidas Com Aprovação Humana

### Entregas

- Sugestões de alterações baseadas em plano, diagnóstico e dados reais.
- Revisão humana obrigatória antes de publicar, pausar, alterar orçamento ou editar campanha.
- Confirmações claras para qualquer ação que possa gastar dinheiro ou alterar campanhas reais.
- Logs mínimos de ações solicitadas e confirmadas.
- Possível uso de Meta Ads MCP/API como infraestrutura, se a estratégia e as permissões estiverem maduras.

### Riscos

- Ações automáticas em contas de anúncio sem entendimento do usuário.
- Alteração indevida de orçamento, público, criativo ou status da campanha.
- Promessa indevida de resultado.
- Responsabilidade operacional sobre verba real.
- Tokens e permissões com escopo amplo demais.
- Falta de trilha clara de consentimento.

### Critérios De Conclusão

- Nenhuma publicação ou alteração acontece sem confirmação humana.
- Usuário entende o impacto de cada ação antes de confirmar.
- Permissões são mínimas para o escopo proposto.
- Erros são tratados de forma clara.
- A experiência continua guiada para pequenos negócios, não técnica para gestores avançados.

## Fase Futura: SaaS, Sincronização E Persistência Remota

O histórico local atende ao MVP sem conta. A base opcional de Supabase/Auth já prepara magic link, tabela `campaigns` com RLS e salvamento manual da campanha na conta quando habilitado. Sincronização ampla entre dispositivos, migração automática de histórico local, limites por usuário e eventual cobrança continuam possíveis, mas devem entrar quando houver validação de valor e necessidade clara de uso recorrente.

Essa fase não deve antecipar integrações complexas nem transformar o produto em painel avançado antes de consolidar a experiência guiada.
