# Roadmap

## Fase 1: MVP Visual Funcional Sem IA Real

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

## Fase 3: Autenticação E Histórico Com Supabase

### Entregas

- Login de usuário.
- Persistência de campanhas.
- Histórico de planos gerados.
- Regras básicas de acesso aos dados.
- Estrutura inicial de tabelas e políticas.

### Riscos

- Modelagem prematura de dados.
- Políticas de acesso mal configuradas.
- Complexidade de autenticação antes de validar uso real.

### Critérios De Conclusão

- Usuário autenticado acessa apenas seus dados.
- Campanhas são salvas e recuperadas corretamente.
- Variáveis de ambiente documentadas.
- Fluxo sem login continua tratado, se necessário.

## Fase 4: Versão SaaS Inicial

### Entregas

- Dashboard simples.
- Limites de uso por plano.
- Melhor organização do histórico.
- Página de conta ou preferências.
- Primeira estrutura para cobrança, se fizer sentido.

### Riscos

- Monetização antes de validação de valor.
- Aumento de escopo em painel administrativo.
- Necessidade de suporte e recuperação de conta.

### Critérios De Conclusão

- Usuário consegue criar, revisar e reutilizar campanhas.
- Limites de uso estão claros.
- Jornada principal continua simples.
- Métricas básicas de uso estão definidas.

## Fase 5: Integrações Futuras Com Meta Ads

### Entregas

- Estudo de permissões e políticas da Meta.
- Conexão assistida com conta de anúncios.
- Leitura de métricas, se permitido.
- Sugestões baseadas em dados reais.
- Possível criação assistida de campanhas.

### Riscos

- Complexidade e instabilidade de APIs externas.
- Revisão de permissões pela Meta.
- Responsabilidade sobre alterações em campanhas reais.
- Erros com orçamento real do usuário.

### Critérios De Conclusão

- Escopo de permissões validado.
- Usuário entende e autoriza qualquer ação externa.
- Nenhuma alteração real é feita sem confirmação explícita.
- Logs e mensagens de erro são claros.
