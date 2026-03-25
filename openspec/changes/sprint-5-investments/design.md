# Design - Sprint 5 Investments

## Escopo tecnico
- Hook `useInvestments` e resumo por tipo.
- Tela de investimentos com abas portfolio/calculadora.
- API route `/api/bcb-proxy` com cache para Selic/CDI/IPCA.
- Utilitario de juros compostos.

## Decisoes
- Delecao logica para investimento (`active = false`).
- Taxa efetiva anual calculada no cliente para simulacao.
- Reutilizar componentes de grafico existentes.

## Validacoes
- Valores de simulacao coerentes com formula composta.
- Erro da API BCB tratado sem quebrar calculadora.
