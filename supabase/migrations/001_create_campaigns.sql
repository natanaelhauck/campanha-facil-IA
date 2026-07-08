create extension if not exists "pgcrypto";

create table if not exists public.campaigns (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  form_data jsonb not null,
  plan jsonb not null,
  source text,
  provider text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists campaigns_user_id_idx
  on public.campaigns(user_id);

create index if not exists campaigns_user_created_at_idx
  on public.campaigns(user_id, created_at desc);

create or replace function public.set_campaigns_updated_at()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists campaigns_set_updated_at on public.campaigns;

create trigger campaigns_set_updated_at
before update on public.campaigns
for each row
execute function public.set_campaigns_updated_at();

alter table public.campaigns enable row level security;

drop policy if exists "Users can read own campaigns" on public.campaigns;
create policy "Users can read own campaigns"
on public.campaigns
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "Users can insert own campaigns" on public.campaigns;
create policy "Users can insert own campaigns"
on public.campaigns
for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists "Users can update own campaigns" on public.campaigns;
create policy "Users can update own campaigns"
on public.campaigns
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "Users can delete own campaigns" on public.campaigns;
create policy "Users can delete own campaigns"
on public.campaigns
for delete
to authenticated
using (user_id = auth.uid());
