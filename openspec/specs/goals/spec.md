# Capability: goals

## Purpose

Definir os requisitos para criacao e acompanhamento de metas financeiras.

## Requirements

### Requirement: Criacao de metas
O sistema SHALL permitir metas de economia mensal e metas de valor final.

#### Scenario: Meta com objetivo final
- WHEN o usuario cria meta `final_target` com prazo futuro
- THEN a meta e persistida com `current_amount = 0`

### Requirement: Evolucao da meta
O sistema SHALL permitir adicionar aportes e recalcular progresso.

#### Scenario: Adicionar valor
- WHEN o usuario adiciona valor positivo
- THEN `current_amount` e incrementado
- AND o percentual de progresso e atualizado

### Requirement: Conclusao e arquivamento
O sistema SHALL sinalizar metas concluídas e permitir inativacao.

#### Scenario: Meta atingida
- WHEN `current_amount >= target_amount`
- THEN a UI marca meta como concluida
