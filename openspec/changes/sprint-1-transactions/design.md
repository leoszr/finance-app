# Design - Sprint 1 Transactions

## Escopo tecnico
- Hook central `useTransactions` com TanStack Query.
- Formularios com RHF + Zod para criacao/edicao.
- Pagina de transacoes com navegacao mensal.
- CRUD de recorrencias e RPC de geracao mensal.

## Decisoes
- Manter `amount` sempre positivo, tipo define sinal na UI.
- Tratar erro e loading em todas as consultas.
- Usar `Sheet` no mobile para formularios.

## Validacoes
- Mutations invalidam cache de dashboard/transacoes.
- Nao ha duplicacao de geracao recorrente no mesmo mes.
