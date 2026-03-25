# Delta Spec - export (Sprint 6)

## ADDED Requirements

### Requirement: Extrato com resumo
A exportacao SHALL incluir resumo financeiro junto da listagem.

#### Scenario: Gerar PDF mensal
- WHEN o usuario exporta um mes com transacoes
- THEN o PDF contem cards/tabela de resumo e detalhes das linhas

### Requirement: Planilha estruturada
A exportacao SHALL gerar arquivo Excel com separacao de abas.

#### Scenario: Gerar XLSX mensal
- WHEN o usuario escolhe Excel
- THEN o arquivo contem abas `Transacoes` e `Resumo`
