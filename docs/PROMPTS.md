# Histórico Resumido De Prompts

Este arquivo registra as principais tarefas já executadas para facilitar continuidade em novos chats ou por outros agentes.

## Criação Do MVP

Objetivo: inicializar o projeto Next.js com TypeScript, App Router, Tailwind CSS e ESLint; criar home, formulário de campanha e página de resultado simulado.

Modo recomendado: manter escopo pequeno, sem IA real, Supabase, login ou banco de dados.

Resultado: projeto inicial criado, componentes reutilizáveis adicionados, home criada, `/criar-campanha` com formulário guiado, `/resultado` com plano simulado e README inicial.

Commit: `feat: inicia MVP do Campanha Fácil IA`

## Melhoria De Textos E Fluxo

Objetivo: corrigir acentuação, melhorar copy, tornar o fluxo mais profissional e personalizar melhor o resultado.

Modo recomendado: não adicionar IA real nem backend; melhorar experiência mantendo simplicidade.

Resultado: textos revisados, home mais clara, formulário com textos de ajuda, resultado reorganizado por seções, aviso de orientação sem garantia e uso de `localStorage`.

Commit: `feat: melhora fluxo guiado e textos do MVP`

## Correção Do Bug De localStorage Em /resultado

Objetivo: corrigir erro causado por leitura do plano em `/resultado` com `useSyncExternalStore`.

Modo recomendado: usar abordagem simples com `useState` e `useEffect`, parse seguro e estado amigável quando não houver dados.

Resultado: removido `useSyncExternalStore`, chave de storage padronizada como `campaign-form-data`, parse com `try/catch`, estado de carregamento curto, estado vazio sem quebrar a página e teste manual validado.

Commit: `fix: corrige leitura do plano no resultado`

Validações: `npm run lint`, `npm run build` e teste manual de `/resultado` com e sem dados no `localStorage`.

## Documentação Base Do Projeto

Objetivo: registrar regras de trabalho, visão de produto, decisões técnicas, roadmap, testes e histórico para facilitar continuidade com Codex, outros chats e colaboradores.

Principais mudanças: adicionados `AGENTS.md` e arquivos em `docs/` com contexto de produto, decisões, roadmap, contexto técnico, testes e histórico resumido de prompts.

Commit relacionado: `c1fa82d docs: adiciona documentação base do projeto`

Validações: revisão manual da documentação e `git status`.

## Melhoria Visual Da Página /resultado

Objetivo: tornar a página de resultado mais clara, acionável e profissional para pessoas leigas, sem adicionar IA real.

Principais mudanças: topo com resumo do plano, aviso de orientação sem garantia, seção "O que fazer primeiro", cards mais escaneáveis para objetivo/público/orçamento, textos de anúncio copiáveis, listas visuais para criativos, passo a passo, checklist e acompanhamento.

Commit relacionado: `7931677 style: melhora experiência visual do resultado`

Validações: `npm run lint`, `npm run build` e teste manual do fluxo com dados salvos, estado vazio, botão "Copiar texto" e layout mobile.

## Correção Da Rolagem Dos Botões De Âncora

Objetivo: corrigir links como "Ver como funciona", "Ver próximos passos" e "Voltar ao topo" para funcionarem repetidamente mesmo quando a URL já contém o mesmo hash.

Principais mudanças: `Button` passou a tratar links internos com hash em client-side, usando `event.preventDefault()`, `document.getElementById()` e `scrollIntoView({ behavior: "smooth" })`; o alvo de próximos passos foi padronizado como `proximos-passos`.

Commit relacionado: `9ce9285 fix: corrige rolagem dos botões de âncora`

Validações: `npm run lint`, `npm run build` e teste manual automatizado em navegador para cliques repetidos em `#como-funciona`, `#proximos-passos` e `#topo`.

## Melhoria Visual Do Formulário /criar-campanha

Objetivo: transformar o formulário em uma experiência mais guiada, clara e profissional para usuários leigos.

Principais mudanças: campos organizados em quatro seções, copy mais simples, `Select` com `helpText`, microcopy antes do botão principal e carregamento seguro dos dados salvos no `localStorage` ao voltar de `/resultado`.

Commit relacionado: `420d1f1 style: melhora formulário guiado da campanha`

Validações: `npm run lint`, `npm run build` e teste manual de preenchimento, geração do resultado, retorno por "Ajustar informações", preservação de dados, edição e responsividade mobile.

## Melhoria Visual Da Página Inicial

Objetivo: fazer a home parecer mais um produto real, confiável e simples para pequenos negócios, sem prometer resultado garantido.

Principais mudanças: hero com proposta de valor mais direta, microcopy de confiança, prévia mais rica do plano, benefícios focados em dores reais, seção "Para quem é" e passos de "Como funciona" mais práticos.

Commit relacionado: `f3be5d1 style: melhora página inicial do MVP`

Validações: `npm run lint`, `npm run build` e teste manual de CTA principal, CTA do header, rolagem repetida para "Como funciona", abertura de `/criar-campanha`, abertura de `/resultado` e responsividade mobile.
