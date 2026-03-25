# Delta Spec - dashboard (Sprint 2)

## ADDED Requirements

### Requirement: Comparativo multi-mes
O sistema SHALL mostrar tendencia de receitas e despesas nos ultimos 6 meses.

#### Scenario: Dados historicos disponiveis
- WHEN o usuario abre a secao de comparativo
- THEN ve linhas separadas de receita e despesa por mes

### Requirement: Recorte de transacoes recentes
O dashboard SHALL apresentar uma lista curta para acesso rapido.

#### Scenario: Exibir ultimas operacoes
- WHEN o dashboard e carregado
- THEN no maximo 5 transacoes recentes sao mostradas
