# Delta Spec - csv-import (Sprint 4)

## ADDED Requirements

### Requirement: Pre-validacao de arquivo
O sistema SHALL validar extensao e estrutura minima antes do parse completo.

#### Scenario: CSV fora do padrao
- WHEN colunas obrigatorias nao estao presentes
- THEN o fluxo e interrompido com orientacao de correcao

### Requirement: Controle de importacao
O sistema SHALL importar apenas linhas explicitamente selecionadas.

#### Scenario: Selecao parcial
- WHEN o usuario desmarca linhas no preview
- THEN somente as linhas selecionadas sao persistidas
