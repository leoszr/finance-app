create extension if not exists "pgcrypto";

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  kind text not null check (kind in ('income', 'expense', 'investment')),
  color text not null default '#334155',
  icon text not null default 'Circle',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (user_id, name)
);

alter table public.categories enable row level security;

drop policy if exists "categories_select_own" on public.categories;
create policy "categories_select_own"
  on public.categories
  for select
  using (auth.uid() = user_id);

drop policy if exists "categories_insert_own" on public.categories;
create policy "categories_insert_own"
  on public.categories
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "categories_update_own" on public.categories;
create policy "categories_update_own"
  on public.categories
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "categories_delete_own" on public.categories;
create policy "categories_delete_own"
  on public.categories
  for delete
  using (auth.uid() = user_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists categories_set_updated_at on public.categories;
create trigger categories_set_updated_at
before update on public.categories
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user_default_categories()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.categories (user_id, name, kind, color, icon)
  values
    (new.id, 'Salario', 'income', '#16a34a', 'Wallet'),
    (new.id, 'Freelance', 'income', '#15803d', 'Briefcase'),
    (new.id, 'Investimentos', 'income', '#166534', 'TrendingUp'),
    (new.id, 'Moradia', 'expense', '#1d4ed8', 'Home'),
    (new.id, 'Alimentacao', 'expense', '#9333ea', 'Utensils'),
    (new.id, 'Transporte', 'expense', '#ea580c', 'Car'),
    (new.id, 'Saude', 'expense', '#dc2626', 'HeartPulse'),
    (new.id, 'Educacao', 'expense', '#0284c7', 'GraduationCap'),
    (new.id, 'Lazer', 'expense', '#f59e0b', 'Gamepad2'),
    (new.id, 'Assinaturas', 'expense', '#7c3aed', 'Tv'),
    (new.id, 'Reserva', 'investment', '#0f766e', 'PiggyBank')
  on conflict (user_id, name) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user_default_categories();
