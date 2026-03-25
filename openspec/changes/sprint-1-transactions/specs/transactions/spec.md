# Delta Spec - transactions (Sprint 1)

## ADDED Requirements

### Requirement: Interface mensal de transacoes
O sistema SHALL exibir transacoes por mes com resumo financeiro no topo.

#### Scenario: Mudanca de mes
- WHEN o usuario troca o mes
- THEN a lista e o resumo sao recalculados para o periodo

### Requirement: Recorrencia operacional
O sistema SHALL permitir cadastro de recorrencias ativas/inativas.

#### Scenario: Recorrencia ativa
- WHEN a recorrencia esta ativa e ainda nao foi gerada no mes
- THEN a transacao do mes e criada automaticamente
