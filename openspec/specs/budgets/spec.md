# Capability: budgets

## Purpose

Definir os requisitos de limites mensais por categoria e monitoramento de consumo.

## Requirements

### Requirement: Orcamento por categoria e mes
O sistema SHALL permitir definir limite mensal por categoria de despesa.

#### Scenario: Criar orcamento valido
- WHEN o usuario seleciona categoria de despesa e valor > 0
- THEN o orcamento e salvo para o mes informado

### Requirement: Unicidade por categoria/mes
O sistema SHALL impedir duplicidade de orcamento na mesma categoria e mes.

#### Scenario: Tentar duplicar orcamento
- WHEN ja existe registro para `(user_id, category_id, month)`
- THEN a criacao e rejeitada com erro claro

### Requirement: Progresso de consumo
O sistema SHALL calcular percentual de gasto consumido no mes.

#### Scenario: Exibir barra de progresso
- WHEN ha transacoes de despesa na categoria
- THEN o progresso e atualizado em tempo real
- AND aplica status `ok`, `warning` ou `exceeded`
