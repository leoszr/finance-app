create or replace function public.ensure_default_categories_for_current_user()
returns void
language plpgsql
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Usuario nao autenticado';
  end if;

  insert into public.categories (user_id, name, kind, color, icon)
  values
    (auth.uid(), 'Salario', 'income', '#16a34a', 'Wallet'),
    (auth.uid(), 'Freelance', 'income', '#15803d', 'Briefcase'),
    (auth.uid(), 'Investimentos', 'income', '#166534', 'TrendingUp'),
    (auth.uid(), 'Moradia', 'expense', '#1d4ed8', 'Home'),
    (auth.uid(), 'Alimentacao', 'expense', '#9333ea', 'Utensils'),
    (auth.uid(), 'Transporte', 'expense', '#ea580c', 'Car'),
    (auth.uid(), 'Saude', 'expense', '#dc2626', 'HeartPulse'),
    (auth.uid(), 'Educacao', 'expense', '#0284c7', 'GraduationCap'),
    (auth.uid(), 'Lazer', 'expense', '#f59e0b', 'Gamepad2'),
    (auth.uid(), 'Assinaturas', 'expense', '#7c3aed', 'Tv'),
    (auth.uid(), 'Reserva', 'investment', '#0f766e', 'PiggyBank')
  on conflict (user_id, name) do nothing;
end;
$$;

grant execute on function public.ensure_default_categories_for_current_user() to authenticated;
