# Delta Spec - dashboard (Sprint 7)

## ADDED Requirements

### Requirement: Resiliencia de carregamento
As telas do dashboard SHALL exibir estados de loading e erro consistentes.

#### Scenario: Falha na busca de dados
- WHEN a consulta principal falha
- THEN a tela mostra mensagem em pt-BR
- AND disponibiliza acao `Tentar novamente`
