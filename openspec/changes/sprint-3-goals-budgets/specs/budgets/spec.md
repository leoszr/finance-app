# Delta Spec - budgets (Sprint 3)

## ADDED Requirements

### Requirement: Limite por categoria
O sistema SHALL aplicar limite mensal por categoria de despesa.

#### Scenario: Categoria excedida
- WHEN o gasto acumulado passa de 100% do limite
- THEN o status muda para `exceeded` com destaque visual
