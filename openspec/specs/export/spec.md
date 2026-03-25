# Capability: export

## Purpose

Definir os requisitos de exportacao de extratos financeiros em PDF e Excel.

## Requirements

### Requirement: Exportacao PDF
O sistema SHALL gerar extrato mensal em PDF no cliente.

#### Scenario: Exportar PDF do mes
- WHEN ha transacoes no periodo
- THEN o download do arquivo PDF e iniciado
- AND o documento inclui resumo e tabela de transacoes

### Requirement: Exportacao Excel
O sistema SHALL gerar planilha XLSX no cliente.

#### Scenario: Exportar Excel do mes
- WHEN ha transacoes no periodo
- THEN o arquivo XLSX e baixado
- AND contem abas de transacoes e resumo

### Requirement: Estado sem dados
O sistema SHALL evitar exportacao sem transacoes.

#### Scenario: Mes vazio
- WHEN nao ha dados no periodo selecionado
- THEN o botao de exportar fica indisponivel ou mostra erro amigavel
