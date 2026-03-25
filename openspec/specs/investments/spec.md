# Capability: investments

## Purpose

Definir os requisitos do modulo de investimentos, consolidacao e simulacao.

## Requirements

### Requirement: Cadastro de investimentos
O sistema SHALL registrar investimentos de renda fixa com tipo, taxa e instituicao.

#### Scenario: Criar investimento
- WHEN o usuario preenche formulario valido
- THEN o investimento e salvo como ativo

### Requirement: Visao de portfolio
O sistema SHALL consolidar total investido e distribuicao por tipo.

#### Scenario: Exibir portfolio
- WHEN existem investimentos ativos
- THEN o total investido e mostrado
- AND a distribuicao por tipo e calculada

### Requirement: Calculadora de projecao
O sistema SHALL simular rendimento com juros compostos.

#### Scenario: Simulacao com taxa manual
- WHEN o usuario define aporte, taxa anual e prazo
- THEN o sistema retorna valor final, total investido e rendimento

### Requirement: Taxas de referencia
O sistema SHALL consultar Selic/CDI/IPCA via proxy interno.

#### Scenario: Buscar taxa do BCB
- WHEN a calculadora usa fonte Banco Central
- THEN a taxa atual e retornada com cache
