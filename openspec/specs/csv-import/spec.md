# Capability: csv-import

## Purpose

Definir os requisitos de importacao de transacoes via CSV com revisao antes da confirmacao.

## Requirements

### Requirement: Upload e validacao de CSV
O sistema SHALL aceitar apenas arquivos CSV do formato esperado.

#### Scenario: Arquivo invalido
- WHEN o arquivo nao segue estrutura Nubank
- THEN o sistema bloqueia importacao e exibe orientacao

### Requirement: Pre-visualizacao editavel
O sistema SHALL permitir revisar linhas antes de importar.

#### Scenario: Revisao de linhas
- WHEN o parse e concluido
- THEN a lista mostra data, descricao, valor e categoria
- AND o usuario pode selecionar/deselecionar linhas

### Requirement: Importacao em lote
O sistema SHALL inserir transacoes selecionadas com origem CSV.

#### Scenario: Importar selecionadas
- WHEN todas as linhas selecionadas possuem categoria
- THEN os registros sao criados com `source = 'csv_nubank'`
