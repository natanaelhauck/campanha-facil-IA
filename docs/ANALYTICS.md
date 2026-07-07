# Analytics E Privacidade

## Estado Atual

O projeto possui uma camada interna em `src/lib/analytics.ts`, sem PostHog ou qualquer outro serviço externo.

- Em `development`, eventos aprovados são exibidos com `console.info`.
- Em `production`, `trackEvent` é um no-op.
- Nenhum evento é salvo no navegador ou enviado pela rede.
- A integração futura deve acontecer dentro dessa camada, sem espalhar SDKs pelos componentes.
- A página pública `/privacidade` informa que analytics externo, autocapture e gravação de sessão não estão ativos.

## Eventos Definidos

| Evento | Momento |
| --- | --- |
| `campaign_form_started` | Abertura do formulário |
| `campaign_form_submitted` | Envio do formulário |
| `campaign_plan_generated` | Plano gerado e salvo com sucesso |
| `campaign_plan_generation_failed` | Falha genérica na geração ou persistência atual |
| `campaign_plan_copied` | Cópia do plano completo |
| `creative_briefing_copied` | Cópia do briefing completo de um criativo |
| `action_plan_copied` | Cópia do plano de ação de 7 dias |
| `campaign_pdf_downloaded` | PDF gerado e baixado |
| `campaign_history_opened` | Abertura do histórico local |
| `campaign_history_item_opened` | Restauração de um plano anterior |
| `campaign_history_item_deleted` | Exclusão de um item do histórico |
| `campaign_adjust_clicked` | Retorno ao formulário para ajustes |
| `beta_page_viewed` | Abertura da página do programa beta |
| `feedback_clicked` | Clique no canal externo de feedback |
| `help_clicked` | Clique no canal externo de pedido de ajuda |

## Propriedades Permitidas

A API tipada e a sanitização em runtime aceitam somente:

- `source`: `ai` ou `mock`;
- `provider`: `mock`, `openai` ou `gemini`;
- `channel`: enum normalizado, sem texto livre;
- `experienceLevel`: enum normalizado, sem texto livre;
- `communicationTone`: enum normalizado, sem texto livre;
- `hasVisualAssets`: enum normalizado, sem texto livre;
- `hasHistoryItem`: booleano;
- `resultStatus`: `success` ou `failure`;
- `errorCategory`: categoria genérica e fechada.

Canal, experiência, tom de comunicação e disponibilidade de fotos/vídeos são transformados em identificadores técnicos como `whatsapp`, `physical_store`, `never`, `frequent`, `fun` ou `partial`. Valores desconhecidos viram `unknown`.

## Dados Proibidos

Nunca registrar em analytics:

- nome do negócio ou da pessoa;
- cidade, bairro ou região;
- produto, serviço ou oferta;
- público desejado;
- diferencial;
- dificuldade atual;
- orçamento informado;
- textos, legendas, prompts ou respostas de WhatsApp;
- conteúdo do plano ou do formulário;
- IDs do histórico;
- chaves, headers, stack traces ou mensagens brutas de provedores.

Os eventos `creative_briefing_copied` e `action_plan_copied` podem receber apenas `source` e não incluem título, legenda, prompt, briefing, tarefas ou qualquer texto do plano. Os três eventos do beta são emitidos sem propriedades. As URLs de destino, conteúdo do plano e informações do formulário não entram no evento.

## Integração Futura

PostHog ou outro provedor pode ser conectado futuramente dentro de `trackEvent`, depois de definir base legal, consentimento quando necessário, retenção e política de privacidade.

Uma integração futura deve manter a whitelist atual, evitar autocapture de formulários e não habilitar gravação de sessão sem revisão específica de privacidade.

Antes de ativar um provedor externo, atualize `/privacidade`, defina retenção e base legal aplicável e revise se consentimento é necessário. Esta preparação não conecta PostHog.
