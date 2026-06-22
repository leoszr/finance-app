# Progresso — Sprint 09 — Relatórios locais

## Resumo

- Status geral: concluída
- Branch: `feature/sprint-09-local-reports`
- Commit final sugerido: `feat(reports): add local monthly reports`
- Relatório mensal local implementado sem backend, IA, API externa ou dependência nova.

## Entregue nesta sprint

- Tela de relatórios conectada à aba `Relatórios`.
- Mês selecionável com resumo do período.
- Query local em SQLite para relatório mensal, transações, categorias e comparação com mês anterior.
- Resumo textual por regras locais.
- Testes da sprint em `src/tests/features-sprint09.test.tsx`.

## Progresso por task

### T0901 — Criar tela de relatórios

- Status: done
- Feature: Tela de relatórios

#### Desenvolvido

- `app/(tabs)/reports.tsx` agora renderiza `ReportScreen`.
- `ReportScreen` carrega dados locais, troca mês e trata mês sem dados.

#### Evidências

- `src/features/reports/ReportScreen.tsx`
- `app/(tabs)/reports.tsx`
- `src/tests/features-sprint09.test.tsx`

#### Pendências

- Nenhuma.

### T0902 — Criar tabela de transações do relatório

- Status: done
- Feature: Tabela de transações do relatório

#### Desenvolvido

- Lista do período com data, descrição, categoria, conta e valor.
- Ordenação por data desc/id desc vinda da query local.

#### Evidências

- `src/db/queries/reportQueries.ts`
- `src/features/reports/ReportScreen.tsx`
- `src/tests/features-sprint09.test.tsx`

#### Pendências

- Nenhuma.

### T0903 — Criar seção de categorias

- Status: done
- Feature: Seção de categorias

#### Desenvolvido

- Agrupamento local de despesas por categoria.
- Total e percentual sobre despesas, ordenado do maior para o menor.

#### Evidências

- `src/db/queries/reportQueries.ts`
- `src/tests/features-sprint09.test.tsx`

#### Pendências

- Nenhuma.

### T0904 — Criar comparação com mês anterior

- Status: done
- Feature: Comparação com mês anterior

#### Desenvolvido

- Cálculo de receitas/despesas anteriores, diferença absoluta e percentual.
- Mês anterior sem dados retorna percentual sem base.

#### Evidências

- `src/db/queries/reportQueries.ts`
- `src/features/reports/ReportScreen.tsx`
- `src/tests/features-sprint09.test.tsx`

#### Pendências

- Nenhuma.

### T0905 — Criar resumo textual automático local

- Status: done
- Feature: Resumo textual automático local

#### Desenvolvido

- `buildLocalReportSummary` gera texto por regras locais.
- Cobre aumento, redução, ausência de dados e mês anterior vazio.

#### Evidências

- `src/lib/reportSummary.ts`
- `src/tests/features-sprint09.test.tsx`

#### Pendências

- Nenhuma.

## Testes executados

- `npm test -- --runInBand src/tests/features-sprint09.test.tsx` — passou.
- `npm test -- --runInBand` — 21 suítes, 85 testes passaram.
- `npm run lint` — passou.
- `npm run typecheck` — passou.

## Decisões técnicas

- Sem dependência nova: relatório renderizado com componentes nativos e cálculo local.
- Query monta joins em memória sobre dados locais para manter compatível com fake DB dos testes.
- Ajustes pós-review: troca de mês limpa relatório em voo; resumo textual trata queda a zero e usa diferenças absolutas no texto.

## Problemas / riscos encontrados

- Nenhum bloqueio.

## Próximo passo

- Iniciar Sprint 10 — Geração de PDF local.
