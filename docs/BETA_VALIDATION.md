# Validação Beta Controlada

## Objetivo

Validar se o Campanha Fácil IA ajuda pessoas leigas em anúncios a sair de informações soltas para um plano inicial que elas entendem e conseguem usar.

O beta deve responder principalmente:

- o formulário é simples de preencher;
- o resultado parece específico para o negócio;
- os próximos passos são compreensíveis;
- o pacote ajuda a tomar uma ação concreta;
- o usuário entende que o plano é orientativo e precisa de revisão;
- existe interesse em voltar, pedir ajuda ou recomendar a ferramenta.

O objetivo não é provar aumento de vendas ou performance de anúncios nesta fase.

## Perfil De Usuários Para Testar

Priorize de 5 a 10 participantes com perfis próximos do público pretendido:

- donos ou responsáveis por pequenos negócios brasileiros;
- pessoas que vendem pelo WhatsApp, Instagram, site ou loja física;
- iniciantes ou usuários com poucas tentativas em tráfego pago;
- pessoas que têm uma oferta real para usar no teste;
- diferentes segmentos locais, como alimentação, beleza, serviços, saúde, oficinas e comércio.

Evite concentrar todos os testes em gestores profissionais de tráfego. Eles podem contribuir, mas não representam o usuário principal.

## Como Conduzir O Teste

1. Explique que o produto está em beta e que não existe resposta certa.
2. Peça para a pessoa usar um negócio e uma oferta reais, sem inserir dados sensíveis.
3. Observe sem ensinar onde clicar, a menos que ela fique totalmente bloqueada.
4. Peça para pensar em voz alta durante formulário e resultado.
5. Confirme se ela consegue copiar o plano, baixar o PDF e encontrar o histórico.
6. Faça as perguntas abaixo somente depois da exploração.
7. Registre padrões, não apenas opiniões isoladas.

O plano é orientação inicial. O teste não deve incentivar publicação ou investimento sem revisão do próprio usuário.

## Perguntas Depois Do Teste

- Em uma frase, o que você acha que esta ferramenta faz?
- Qual parte do plano foi mais útil?
- Qual parte pareceu genérica, confusa ou desnecessária?
- Teve alguma pergunta do formulário que você não soube responder?
- Você saberia qual primeiro passo executar depois de ler o resultado?
- O que você ainda precisaria para configurar uma campanha com segurança?
- Você copiaria o plano, baixaria o PDF ou compartilharia com alguém?
- Você voltaria para criar outro plano? Em qual situação?
- Você pediria ajuda para configurar? Que tipo de ajuda?
- O que faria você confiar mais ou menos no resultado?
- Quanto tempo ou esforço essa ferramenta economizou?

Evite perguntar apenas “você gostou?”. Prefira exemplos concretos do que a pessoa entendeu, tentou e faria em seguida.

## Sinais De Interesse

- conclui o formulário sem ajuda relevante;
- lê mais de uma seção do resultado;
- copia o plano ou baixa o PDF;
- abre o histórico ou ajusta informações;
- pergunta como usar o plano em uma campanha real;
- envia feedback específico;
- pede ajuda para configurar;
- quer testar outra oferta ou outro negócio;
- indica espontaneamente outra pessoa que teria o mesmo problema.

## Sinais De Confusão

- não consegue explicar o que o produto entrega;
- espera que a campanha seja publicada automaticamente;
- interpreta o plano como garantia de venda;
- não entende a diferença entre objetivo, canal e público;
- abandona o formulário por não saber estimar informações;
- ignora o resultado por parecer longo ou genérico;
- não sabe qual ação executar primeiro;
- acredita que histórico local significa conta ou sincronização;
- procura integração com Meta Ads que ainda não existe.

## Métricas Manuais

Use uma planilha simples, sem copiar conteúdo sensível do formulário ou do plano.

| Métrica | Como registrar |
| --- | --- |
| Testes iniciados | Quantidade de participantes que abriram o fluxo |
| Formulários concluídos | Quantidade que chegou ao resultado |
| Tempo até o resultado | Faixa aproximada, não precisa gravar sessão |
| Testes com ajuda | Quantidade que precisou de intervenção |
| Plano compreendido | Sim, parcialmente ou não |
| Ação útil realizada | Cópia, PDF, histórico, ajuste ou nenhuma |
| Feedback enviado | Sim ou não |
| Pedido de ajuda | Sim ou não |
| Interesse em retornar | Sim, talvez ou não |
| Principal bloqueio | Categoria curta e não identificável |

Não registre nome do negócio, cidade, oferta, público, orçamento, conteúdo do plano ou respostas livres em analytics. Anotações de entrevista devem ter acesso restrito e somente o contexto necessário.

## Canais De Feedback

Os botões do produto são opcionais e configurados por:

```bash
NEXT_PUBLIC_FEEDBACK_URL=
NEXT_PUBLIC_HELP_URL=
```

Os destinos podem ser Google Forms, `wa.me`, formulário externo ou página de contato. Como são variáveis públicas, nunca devem conter chave, token, dado pessoal ou parâmetro secreto.

O produto apenas abre o destino em nova aba. Nenhum dado do formulário ou do plano é anexado automaticamente.

## Próximos Passos Após O Feedback

1. Agrupar observações por problema: formulário, clareza, utilidade, confiança ou execução.
2. Separar frequência de gravidade; um problema raro pode ser crítico.
3. Corrigir primeiro bloqueios que impedem entender ou concluir o fluxo.
4. Validar cada mudança com poucos usuários antes de ampliar o beta.
5. Calibrar os planos com exemplos reais sem adicionar promessas de resultado.
6. Decidir se pedido de ajuda merece um processo manual antes de qualquer automação.
7. Só priorizar login, persistência remota, pagamento ou integrações quando o uso real justificar.
8. Registrar decisões e critérios de conclusão no roadmap.

## Critério Inicial Para Avançar

Considere ampliar o beta quando a maioria dos participantes:

- concluir o formulário sem intervenção;
- explicar corretamente o caráter orientativo;
- identificar pelo menos uma parte útil;
- saber qual próximo passo executar;
- não confundir a ferramenta com publicação automática de anúncios.
