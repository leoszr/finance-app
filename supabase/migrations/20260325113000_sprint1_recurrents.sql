create table if not exists public.recurrents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete restrict,
  type text not null check (type in ('income', 'expense')),
  amount numeric(14, 2) not null check (amount > 0),
  description text not null,
  day_of_month int not null check (day_of_month between 1 and 31),
  active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.recurrents enable row level security;

drop policy if exists "recurrents_select_own" on public.recurrents;
create policy "recurrents_select_own"
  on public.recurrents
  for select
  using (auth.uid() = user_id);

drop policy if exists "recurrents_insert_own" on public.recurrents;
create policy "recurrents_insert_own"
  on public.recurrents
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "recurrents_update_own" on public.recurrents;
create policy "recurrents_update_own"
  on public.recurrents
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "recurrents_delete_own" on public.recurrents;
create policy "recurrents_delete_own"
  on public.recurrents
  for delete
  using (auth.uid() = user_id);

drop trigger if exists recurrents_set_updated_at on public.recurrents;
create trigger recurrents_set_updated_at
before update on public.recurrents
for each row execute function public.set_updated_at();
