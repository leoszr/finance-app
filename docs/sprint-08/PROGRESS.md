# Progresso — Sprint 08 — Dashboard financeiro

## Resumo

- Status geral: concluída
- Branch: `feature/sprint-08-dashboard`
- Commit final sugerido: `feat(dashboard): add monthly financial overview`
- Dashboard mensal implementado com SQLite local, cards, rankings e gráficos textuais sem dependência nova.

## Entregue nesta sprint

- Queries de resumo mensal em `src/db/queries/dashboardQueries.ts`.
- Dashboard em `src/features/dashboard/DashboardManager.tsx` e `app/(tabs)/dashboard.tsx`.
- Cards em `src/components/finance/SummaryCard.tsx`.
- Barras locais em `src/components/charts/BarRow.tsx`.
- Refresh automático do dashboard quando contas/categorias/transações mudam via `src/lib/dataEvents.ts`.
- Testes em `src/tests/features-sprint08.test.tsx`.

## Progresso por task

### T0801 — Criar queries de resumo mensal

- Status: done
- Feature: Queries de resumo mensal

#### Desenvolvido

- Totais mensais de receitas, despesas, saldo mensal, saldo total por conta e maior categoria de despesa.
- Cálculos a partir do repositório SQLite local.

#### Evidências

- `src/db/queries/dashboardQueries.ts`
- `src/tests/features-sprint08.test.tsx`

#### Pendências

- Nenhuma.

### T0802 — Criar cards de resumo

- Status: done
- Feature: Cards de resumo

#### Desenvolvido

- Cards de receitas, despesas, saldo mensal e saldo total com BRL.

#### Evidências

- `src/components/finance/SummaryCard.tsx`
- `src/features/dashboard/DashboardManager.tsx`

#### Pendências

- Nenhuma.

### T0803 — Criar lista de maiores gastos por categoria

- Status: done
- Feature: Lista de maiores gastos por categoria

#### Desenvolvido

- Ranking top 5 de despesas por categoria, ordenado do maior para o menor e ignorando receitas.

#### Evidências

- `src/db/queries/dashboardQueries.ts`
- `src/tests/features-sprint08.test.tsx`

#### Pendências

- Nenhuma.

### T0804 — Criar gráfico básico por categoria

- Status: done
- Feature: Gráfico básico por categoria

#### Desenvolvido

- Gráfico local em barras por categoria, com fallback textual sem despesas.

#### Evidências

- `src/components/charts/BarRow.tsx`
- `src/features/dashboard/DashboardManager.tsx`

#### Pendências

- Nenhuma.

### T0805 — Criar gráfico receita x despesa

- Status: done
- Feature: Gráfico receita x despesa

#### Desenvolvido

- Comparação mensal de receita x despesa com botões de mês anterior/próximo.

#### Evidências

- `src/features/dashboard/DashboardManager.tsx`
- `src/tests/features-sprint08.test.tsx`

#### Pendências

- Nenhuma.

## Testes executados

- `npm test -- --runInBand src/tests/features-sprint08.test.tsx` — passou.
- `npm test -- --runInBand` — 20 suites, 81 testes passaram.
- `npm run lint` — passou.
- `npm run typecheck` — passou.

## Decisões técnicas

- Sem biblioteca de gráfico nova; barras em React Native cobrem o aceite.
- Refresh por evento de repositório em vez de hook de foco, evitando dependência de contexto de navegação nos testes.
- Saldo total por conta usa saldo inicial + todas as transações locais.

## Problemas / riscos encontrados

- `expo-sqlite` não abre no ambiente Jest padrão; `DashboardManager` captura falha do backend local para não quebrar smoke test sem mock.

## Próximo passo

- Sprint 09.
