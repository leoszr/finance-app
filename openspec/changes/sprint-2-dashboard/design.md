# Design - Sprint 2 Dashboard

## Escopo tecnico
- Hook agregador `useDashboard`.
- Componente de pizza para despesas por categoria.
- Componente de comparativo dos ultimos 6 meses.
- Estados vazios e skeletons especificos.

## Decisoes
- Agregacao principal no cliente com dados ja filtrados por mes.
- Reuso de tipos de dominio para evitar duplicacao.
- Exibir no maximo 5 transacoes recentes no dashboard.

## Validacoes
- Totais de receitas/despesas/saldo coerentes com transacoes.
- Comportamento claro quando nao ha despesas.
