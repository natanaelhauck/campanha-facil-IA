# Changelog

Todas as mudanças relevantes do projeto serão resumidas neste arquivo.

## MVP Visual Funcional

### MVP Inicial

- Projeto Next.js criado com TypeScript, App Router, Tailwind CSS e ESLint.
- Criadas as rotas `/`, `/criar-campanha` e `/resultado`.
- Adicionados componentes básicos reutilizáveis.
- Implementado fluxo inicial com `localStorage`.

### Melhoria De Textos E Fluxo

- Textos revisados em português do Brasil.
- Fluxo principal ficou mais claro para usuários leigos.
- Resultado passou a exibir plano simulado com personalização local.
- Avisos de orientação sem garantia foram reforçados.

### Correção Do Resultado E localStorage

- Corrigida a leitura do plano em `/resultado`.
- Padronizada a chave `campaign-form-data`.
- Adicionado parse seguro e estado vazio amigável.

### Documentação Base

- Adicionado `AGENTS.md`.
- Criados documentos em `docs/` para produto, roadmap, decisões, contexto técnico, testes e histórico de prompts.

### Melhoria Visual Do Resultado

- Página `/resultado` reorganizada com hierarquia visual mais clara.
- Adicionados próximos passos recomendados, cards de resumo, checklist e acompanhamento.
- Textos de anúncio passaram a ter botão de copiar.

### Correção De Âncoras

- Botões de rolagem com hash passaram a usar `scrollIntoView`.
- Corrigidos cliques repetidos em `Ver como funciona`, `Ver próximos passos` e `Voltar ao topo`.

### Melhoria Visual Do Formulário

- `/criar-campanha` passou a ser um formulário guiado por seções.
- Dados salvos agora são carregados ao ajustar informações.
- Textos de ajuda foram refinados para usuários leigos.

### Melhoria Visual Da Home

- Página inicial ganhou hero mais claro, prévia mais rica do produto e microcopy de confiança.
- Benefícios foram ajustados para dores reais de pequenos negócios.
- Adicionada seção curta de posicionamento e passos mais práticos em `Como funciona`.
