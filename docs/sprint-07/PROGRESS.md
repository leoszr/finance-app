# Progresso — Sprint 07 — Filtros, busca e visão mensal

## Resumo

- Status geral: done
- Branch: `feature/sprint-07-transactions-filtering`
- Commit final sugerido: `feat(transactions): add monthly filters and search`

## Entregue nesta sprint

- Filtro mensal com mês atual por padrão, mês anterior e mês seguinte.
- Filtro por tipo: todos, receitas e despesas.
- Filtro por conta com opção todas as contas.
- Busca por descrição sem diferenciar maiúsculas/minúsculas.
- Resumo do recorte filtrado com receitas, despesas e saldo.

## Progresso por task

### T0701 — Criar seletor de mês

- Status: done
- Feature: Seletor de mês

#### Desenvolvido

- Seletor mensal em `TransactionsManager`.
- Lista filtra pelo mês atual por padrão e muda com botões anterior/seguinte.

#### Evidências

- `src/features/transactions/TransactionsManager.tsx`
- `src/tests/features-sprint07.test.tsx`

#### Pendências

- Nenhuma.

### T0702 — Criar filtro por tipo

- Status: done
- Feature: Filtro por tipo

#### Desenvolvido

- Filtros todos/receitas/despesas combinados com mês.

#### Evidências

- `src/features/transactions/TransactionsManager.tsx`
- Teste T0702 em `src/tests/features-sprint07.test.tsx`.

#### Pendências

- Nenhuma.

### T0703 — Criar filtro por conta

- Status: done
- Feature: Filtro por conta

#### Desenvolvido

- Filtro por conta e opção todas as contas.

#### Evidências

- `src/features/transactions/TransactionsManager.tsx`
- Teste T0703 em `src/tests/features-sprint07.test.tsx`.

#### Pendências

- Nenhuma.

### T0704 — Criar busca por descrição

- Status: done
- Feature: Busca por descrição

#### Desenvolvido

- Campo de busca por descrição, case-insensitive, combinado com filtros ativos.

#### Evidências

- `src/features/transactions/TransactionsManager.tsx`
- Teste T0704 em `src/tests/features-sprint07.test.tsx`.

#### Pendências

- Nenhuma.

### T0705 — Criar resumo da lista filtrada

- Status: done
- Feature: Resumo da lista filtrada

#### Desenvolvido

- Totais de receitas, despesas e saldo do recorte filtrado.

#### Evidências

- `src/features/transactions/TransactionsManager.tsx`
- Teste T0705 em `src/tests/features-sprint07.test.tsx`.

#### Pendências

- Nenhuma.

## Testes executados

- `npm run typecheck` — passou.
- `npm run lint` — passou.
- `npm test -- --runInBand src/tests/features-sprint07.test.tsx` — passou.
- `npm test -- --runInBand` — passou: 19 suítes, 75 testes.
- `npx expo export --platform ios --output-dir /tmp/finance-app-sprint7-export-check` — passou.

## Decisões técnicas

- Filtros aplicados localmente sobre dados já carregados para manter escopo pequeno.
- Sem nova dependência.
- Virtualização/paginação continua deferida para futura melhoria de performance.

## Problemas / riscos encontrados

- A UI de filtros ainda usa botões simples; pode virar picker/segmented control em sprint de polish.

## Próximo passo

- Revisar Sprint 07 e commitar com `feat(transactions): add monthly filters and search`.
