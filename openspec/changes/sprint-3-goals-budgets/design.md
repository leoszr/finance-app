# Design - Sprint 3 Goals Budgets

## Escopo tecnico
- Hooks `useBudgets` e `useGoals` com calculos de progresso.
- Pagina unificada de metas e orcamentos em abas/secoes.
- Formularios dedicados para criar/editar entidades.

## Decisoes
- Orcamento restrito a categorias de despesa.
- Meta `final_target` exige deadline.
- Exclusao de meta via inativacao (`active = false`).

## Validacoes
- Constraint de unicidade por categoria/mes respeitada.
- Percentual de progresso sempre calculado com base em dados atuais.
