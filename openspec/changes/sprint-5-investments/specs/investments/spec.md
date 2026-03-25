# Delta Spec - investments (Sprint 5)

## ADDED Requirements

### Requirement: Simulacao com fonte externa
O sistema SHALL usar taxa de referencia do BCB quando configurado pelo usuario.

#### Scenario: Fonte BCB ativa
- WHEN o usuario seleciona Selic/CDI
- THEN a taxa e obtida via proxy interno
- AND aplicada no calculo de projecao

### Requirement: Portfolio ativo
O sistema SHALL considerar apenas investimentos ativos no total consolidado.

#### Scenario: Investimento inativado
- WHEN um registro e marcado como inativo
- THEN ele nao entra em total investido nem distribuicao
