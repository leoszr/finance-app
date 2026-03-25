# Capability: dashboard

## Purpose

Definir os requisitos de visualizacao de resumo financeiro e graficos do mes.

## Requirements

### Requirement: Resumo financeiro mensal
O dashboard SHALL exibir receitas, despesas e saldo do mes selecionado.

#### Scenario: Carregar dashboard com dados
- WHEN existem transacoes no mes
- THEN os cards mostram totais corretos
- AND o saldo usa destaque positivo/negativo

### Requirement: Gastos por categoria
O dashboard SHALL mostrar distribuicao de despesas por categoria.

#### Scenario: Exibir grafico de pizza
- WHEN ha despesas no mes
- THEN o grafico apresenta categorias e percentuais

### Requirement: Ultimas transacoes
O dashboard SHALL mostrar acesso rapido as transacoes recentes.

#### Scenario: Lista resumida
- WHEN o dashboard e aberto
- THEN as 5 transacoes mais recentes sao exibidas

### Requirement: Estado vazio
O dashboard SHALL tratar ausencia de dados sem quebrar a UX.

#### Scenario: Mes sem despesas
- WHEN nao ha despesas no periodo
- THEN o modulo de distribuicao mostra estado vazio explicito
