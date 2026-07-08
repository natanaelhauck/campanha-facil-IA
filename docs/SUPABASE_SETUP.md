# Setup opcional do Supabase

O Supabase e opcional nesta fase. Se as variaveis publicas nao estiverem
configuradas, o Campanha Fácil IA continua funcionando em modo visitante com
historico local no navegador.

## 1. Criar projeto

1. Crie um projeto no Supabase.
2. Copie a URL publica do projeto.
3. Copie apenas a `anon public key`.
4. Nao use `service_role` no frontend, na Vercel ou em variaveis
   `NEXT_PUBLIC_*`.

## 2. Criar tabela

Execute o SQL em `supabase/migrations/001_create_campaigns.sql` no editor SQL
do Supabase ou pelo fluxo de migrations do projeto.

A tabela `campaigns` salva:

- `user_id` vinculado a `auth.users`;
- briefing em `form_data`;
- plano completo em `plan`;
- origem e provider da geracao;
- datas de criacao e atualizacao.

O SQL ativa RLS e cria politicas para que cada usuario autenticado veja,
insira, atualize e delete apenas as proprias campanhas.

## 3. Configurar Authentication

1. No Supabase, abra Authentication.
2. Habilite login por e-mail.
3. Use magic link por e-mail nesta primeira fase.
4. Configure as URLs permitidas para o dominio local e o dominio da Vercel,
   por exemplo:
   - `http://localhost:3000`
   - `https://seu-projeto.vercel.app`
5. Ajuste o template do e-mail se necessario, sem prometer publicacao
   automatica de campanhas.

## 4. Configurar variaveis

Localmente, use `.env.local` se precisar testar com um projeto real. Nao
commite esse arquivo.

```bash
NEXT_PUBLIC_SUPABASE_ENABLED=true
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key-publica
```

Na Vercel, configure as mesmas variaveis em Project Settings > Environment
Variables.

Para manter o modo visitante:

```bash
NEXT_PUBLIC_SUPABASE_ENABLED=false
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## 5. Comportamento esperado

- Supabase desligado: `/entrar` mostra aviso amigavel e o historico usa
  `localStorage`.
- Supabase ligado, usuario sem login: o historico continua local.
- Supabase ligado, usuario logado: `/historico` lista campanhas salvas na
  conta e `/resultado` mostra o botao para salvar a campanha na conta.
- O app nao migra automaticamente o historico local para a nuvem nesta etapa.
- Nenhuma integracao com Meta Ads, pagamento ou WhatsApp automatico e criada
  por esta configuracao.
