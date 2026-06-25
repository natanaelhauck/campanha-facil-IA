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
