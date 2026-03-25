alter table public.transactions
add column if not exists recurrent_id uuid references public.recurrents(id) on delete set null;

create unique index if not exists transactions_unique_recurring_month_idx
  on public.transactions (recurrent_id, date_trunc('month', occurred_on))
  where source = 'recurring' and recurrent_id is not null;

create or replace function public.generate_monthly_recurrents()
returns int
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_month_start date := date_trunc('month', current_date)::date;
  v_month_end date := (date_trunc('month', current_date) + interval '1 month - 1 day')::date;
  v_created int := 0;
begin
  if v_user_id is null then
    raise exception 'Usuario nao autenticado';
  end if;

  insert into public.transactions (
    user_id,
    category_id,
    recurrent_id,
    type,
    amount,
    description,
    occurred_on,
    source
  )
  select
    r.user_id,
    r.category_id,
    r.id,
    r.type,
    r.amount,
    r.description,
    make_date(
      extract(year from v_month_start)::int,
      extract(month from v_month_start)::int,
      least(r.day_of_month, extract(day from v_month_end)::int)
    ),
    'recurring'
  from public.recurrents r
  where r.user_id = v_user_id
    and r.active = true
    and not exists (
      select 1
      from public.transactions t
      where t.recurrent_id = r.id
        and date_trunc('month', t.occurred_on) = date_trunc('month', v_month_start)
        and t.source = 'recurring'
    );

  get diagnostics v_created = row_count;
  return v_created;
end;
$$;
