# Roadmap

## Fase 1: MVP Guiado Sem Conta Conectada

Status: concluída como primeira versão visual funcional. Deve continuar recebendo pequenos ajustes de copy, documentação, acessibilidade e validação manual, mas o fluxo principal já está operacional.

### Entregas Concluídas

- Página inicial explicando a proposta.
- Página inicial com hero, prévia do plano, benefícios, seção "Para quem é" e "Como funciona".
- Formulário guiado em `/criar-campanha`, organizado por seções.
- Carregamento dos dados salvos ao voltar de `/resultado` para ajustar informações.
- Resultado simulado em `/resultado`, com plano inicial personalizado.
- Personalização local com `localStorage`.
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
- Home, formulário e resultado são responsivos.
- `npm run lint` e `npm run build` passam.
- Fluxo principal validado manualmente.

### Antes Da IA Real

- Manter documentação atualizada.
- Revisar manualmente copy de orientação para evitar promessa de resultado.
- Definir formato esperado de resposta da IA antes de implementar endpoint.
- Definir limites básicos de uso/custo para chamadas de IA.
- Planejar fallback quando a geração real falhar.

## Fase 2: IA Real Com OpenAI API

### Entregas

- Endpoint server-side para gerar plano com IA.
- Prompt estruturado com dados do formulário.
- Formato de resposta previsível para preencher seções do resultado.
- Tratamento de erros e limites de resposta.
- Avisos claros sobre orientação e ausência de garantia.
- Possível modo de fallback quando a IA falhar.
- Limites simples de uso para controlar custo.

### Riscos

- Custo por uso sem limite.
- Respostas inconsistentes ou longas demais.
- Exposição indevida de chave de API no cliente.
- Promessas exageradas de resultado.
- Prompt injection ou entradas maliciosas no formulário.
- Falta de validação do formato retornado pela IA.
- Falha da API sem fallback amigável.
- Logs excessivos com dados sensíveis do usuário.

### Critérios De Conclusão

- Chave de API usada apenas no servidor.
- Plano gerado com tempo de resposta aceitável.
- Erros tratados de forma amigável.
- Custo e limites documentados.
- Resposta validada antes de exibir na UI.
- Fallback funcionando quando a IA falhar.
- Lint, build e teste manual passam.

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

## Fase Futura: SaaS, Histórico E Persistência

Supabase, autenticação, histórico, limites de uso e eventual cobrança continuam possíveis, mas devem entrar quando houver validação de valor e necessidade clara de uso recorrente.

Essa fase não deve antecipar integrações complexas nem transformar o produto em painel avançado antes de consolidar a experiência guiada.
