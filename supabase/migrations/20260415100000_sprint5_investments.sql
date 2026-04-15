do $$
begin
  if not exists (
    select 1
    from pg_type
    where typname = 'investment_type'
      and typnamespace = 'public'::regnamespace
  ) then
    create type public.investment_type as enum (
      'cdb',
      'tesouro_direto',
      'lci',
      'lca',
      'poupanca',
      'outros_renda_fixa'
    );
  end if;
end
$$;

create table if not exists public.investments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null,
  type public.investment_type not null,
  institution text not null,
  invested_amount numeric(12, 2) not null check (invested_amount > 0),
  rate_type text not null check (rate_type in ('fixed', 'cdi_pct', 'selic_pct', 'ipca_plus')),
  rate_value numeric(8, 4) not null check (rate_value > 0),
  start_date date not null,
  maturity_date date,
  notes text,
  active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint investments_maturity_after_start check (
    maturity_date is null or maturity_date > start_date
  )
);

alter table public.investments enable row level security;

drop policy if exists "investments_select_own" on public.investments;
create policy "investments_select_own"
  on public.investments
  for select
  using (auth.uid() = user_id);

drop policy if exists "investments_insert_own" on public.investments;
create policy "investments_insert_own"
  on public.investments
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "investments_update_own" on public.investments;
create policy "investments_update_own"
  on public.investments
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "investments_delete_own" on public.investments;
create policy "investments_delete_own"
  on public.investments
  for delete
  using (auth.uid() = user_id);

create index if not exists investments_user_id_active_idx
  on public.investments (user_id, active, created_at desc);

create index if not exists investments_user_id_type_idx
  on public.investments (user_id, type);

drop trigger if exists investments_set_updated_at on public.investments;
create trigger investments_set_updated_at
before update on public.investments
for each row execute function public.set_updated_at();
