# Sprint 09 — Relatórios locais

## Objetivo

Criar relatório mensal dentro do app, sem PDF ainda.

## Entrega da sprint

- Branch: `feature/sprint-09-local-reports`
- Commit final sugerido: `feat(reports): add local monthly reports`
- Fase do plano: `Fase 8 — Relatórios e PDF`
- Resultado deve ser pequeno, revisável e testável.

## Regras da sprint

- [x] Criar uma feature branch para a sprint.
- [x] Manter as alterações coesas ao objetivo da sprint.
- [x] Atualizar ou criar testes junto com a implementação.
- [x] Executar `npm test` e `npm run lint` antes do commit final.
- [x] Não adicionar backend, Supabase, PostgreSQL, Java backend, API externa, IA ou sync automático.
- [x] Atualizar `docs/sprint-09/PROGRESS.md` com evidências reais.

## Tasks

### T0901 — Criar tela de relatórios

- Status: done
- Feature: Tela de relatórios
- Plano: `PLAN.md` > `Fase 8 — Relatórios e PDF`
- Dependências: T0805

#### Requisitos funcionais

- [x] Centralizar análise mensal.
- [x] Tela acessível pela navegação.
- [x] Mês selecionável.
- [x] Mostra resumo do período.
- [x] Usa dados do SQLite.

#### Requisitos técnicos

- [x] Gerar relatório somente com regras locais.
- [x] Não chamar IA, backend ou API externa.
- [x] Tratar mês sem dados e mês anterior sem dados.

#### Arquivos prováveis

- `src/features/reports/`
- `src/db/queries/reportQueries.ts`
- `src/features/reports/ReportScreen.tsx`
- `src/lib/reportSummary.ts`
- `src/tests/features/reports/`

#### Passos sugeridos

1. Ler os arquivos prováveis e confirmar a estrutura existente.
2. Implementar somente o necessário para a feature desta task.
3. Adicionar ou atualizar testes específicos da task.
4. Rodar testes e lint.
5. Registrar evidências em `docs/sprint-09/PROGRESS.md`.

#### Critérios de aceite

- [x] Tela acessível pela navegação.
- [x] Mês selecionável.
- [x] Mostra resumo do período.
- [x] Usa dados do SQLite.

#### Testes e verificação

- [x] Adicionar teste cobrindo `Criar tela de relatórios` em arquivo de teste da sprint.
- [x] Cobrir pelo menos: Tela acessível pela navegação.
- [x] Executar `npm test` com a suíte atualizada.
- [x] Executar `npm run lint` sem erros novos.

### T0902 — Criar tabela de transações do relatório

- Status: done
- Feature: Tabela de transações do relatório
- Plano: `PLAN.md` > `Fase 8 — Relatórios e PDF`
- Dependências: T0901

#### Requisitos funcionais

- [x] Mostrar transações do período.
- [x] Mostra data.
- [x] Mostra descrição.
- [x] Mostra categoria.
- [x] Mostra conta.
- [x] Mostra valor.
- [x] Ordena por data.

#### Requisitos técnicos

- [x] Gerar relatório somente com regras locais.
- [x] Não chamar IA, backend ou API externa.
- [x] Tratar mês sem dados e mês anterior sem dados.

#### Arquivos prováveis

- `src/features/transactions/`
- `src/hooks/useTransactions.ts`
- `src/features/reports/`
- `src/db/queries/reportQueries.ts`

#### Passos sugeridos

1. Ler os arquivos prováveis e confirmar a estrutura existente.
2. Implementar somente o necessário para a feature desta task.
3. Adicionar ou atualizar testes específicos da task.
4. Rodar testes e lint.
5. Registrar evidências em `docs/sprint-09/PROGRESS.md`.

#### Critérios de aceite

- [x] Mostra data.
- [x] Mostra descrição.
- [x] Mostra categoria.
- [x] Mostra conta.
- [x] Mostra valor.
- [x] Ordena por data.

#### Testes e verificação

- [x] Adicionar teste cobrindo `Criar tabela de transações do relatório` em arquivo de teste da
  sprint.
- [x] Cobrir pelo menos: Mostra data.
- [x] Executar `npm test` com a suíte atualizada.
- [x] Executar `npm run lint` sem erros novos.

### T0903 — Criar seção de categorias

- Status: done
- Feature: Seção de categorias
- Plano: `PLAN.md` > `Fase 8 — Relatórios e PDF`
- Dependências: T0902

#### Requisitos funcionais

- [x] Resumir gastos por categoria.
- [x] Agrupa despesas por categoria.
- [x] Mostra valor total.
- [x] Mostra percentual sobre despesas.
- [x] Ordena do maior para o menor.

#### Requisitos técnicos

- [x] Gerar relatório somente com regras locais.
- [x] Não chamar IA, backend ou API externa.
- [x] Tratar mês sem dados e mês anterior sem dados.

#### Arquivos prováveis

- `src/features/categories/`
- `src/hooks/useCategories.ts`
- `src/features/reports/`
- `src/db/queries/reportQueries.ts`

#### Passos sugeridos

1. Ler os arquivos prováveis e confirmar a estrutura existente.
2. Implementar somente o necessário para a feature desta task.
3. Adicionar ou atualizar testes específicos da task.
4. Rodar testes e lint.
5. Registrar evidências em `docs/sprint-09/PROGRESS.md`.

#### Critérios de aceite

- [x] Agrupa despesas por categoria.
- [x] Mostra valor total.
- [x] Mostra percentual sobre despesas.
- [x] Ordena do maior para o menor.

#### Testes e verificação

- [x] Adicionar teste cobrindo `Criar seção de categorias` em arquivo de teste da sprint.
- [x] Cobrir pelo menos: Agrupa despesas por categoria.
- [x] Executar `npm test` com a suíte atualizada.
- [x] Executar `npm run lint` sem erros novos.

### T0904 — Criar comparação com mês anterior

- Status: done
- Feature: Comparação com mês anterior
- Plano: `PLAN.md` > `Fase 8 — Relatórios e PDF`
- Dependências: T0903

#### Requisitos funcionais

- [x] Mostrar variação mensal.
- [x] Calcula receita do mês anterior.
- [x] Calcula despesa do mês anterior.
- [x] Mostra diferença absoluta.
- [x] Mostra diferença percentual.
- [x] Trata mês anterior sem dados.

#### Requisitos técnicos

- [x] Gerar relatório somente com regras locais.
- [x] Não chamar IA, backend ou API externa.
- [x] Tratar mês sem dados e mês anterior sem dados.

#### Arquivos prováveis

- `src/lib/month.ts`
- `src/features/reports/`
- `src/db/queries/reportQueries.ts`

#### Passos sugeridos

1. Ler os arquivos prováveis e confirmar a estrutura existente.
2. Implementar somente o necessário para a feature desta task.
3. Adicionar ou atualizar testes específicos da task.
4. Rodar testes e lint.
5. Registrar evidências em `docs/sprint-09/PROGRESS.md`.

#### Critérios de aceite

- [x] Calcula receita do mês anterior.
- [x] Calcula despesa do mês anterior.
- [x] Mostra diferença absoluta.
- [x] Mostra diferença percentual.
- [x] Trata mês anterior sem dados.

#### Testes e verificação

- [x] Adicionar teste cobrindo `Criar comparação com mês anterior` em arquivo de teste da sprint.
- [x] Cobrir pelo menos: Calcula receita do mês anterior.
- [x] Executar `npm test` com a suíte atualizada.
- [x] Executar `npm run lint` sem erros novos.

### T0905 — Criar resumo textual automático local

- Status: done
- Feature: Resumo textual automático local
- Plano: `PLAN.md` > `Fase 8 — Relatórios e PDF`
- Dependências: T0904

#### Requisitos funcionais

- [x] Gerar observações sem IA.
- [x] Texto gerado por regras locais.
- [x] Não chama API externa.
- [x] Cobre aumento, redução e ausência de dados.
- [x] Usa valores reais do relatório.

#### Requisitos técnicos

- [x] Gerar relatório somente com regras locais.
- [x] Não chamar IA, backend ou API externa.
- [x] Tratar mês sem dados e mês anterior sem dados.

#### Arquivos prováveis

- `src/features/reports/`
- `src/db/queries/reportQueries.ts`
- `src/features/reports/ReportScreen.tsx`
- `src/lib/reportSummary.ts`
- `src/tests/features/reports/`

#### Passos sugeridos

1. Ler os arquivos prováveis e confirmar a estrutura existente.
2. Implementar somente o necessário para a feature desta task.
3. Adicionar ou atualizar testes específicos da task.
4. Rodar testes e lint.
5. Registrar evidências em `docs/sprint-09/PROGRESS.md`.

#### Critérios de aceite

- [x] Texto gerado por regras locais.
- [x] Não chama API externa.
- [x] Cobre aumento, redução e ausência de dados.
- [x] Usa valores reais do relatório.

#### Testes e verificação

- [x] Adicionar teste cobrindo `Criar resumo textual automático local` em arquivo de teste da
  sprint.
- [x] Cobrir pelo menos: Texto gerado por regras locais.
- [x] Executar `npm test` com a suíte atualizada.
- [x] Executar `npm run lint` sem erros novos.

## Testes da sprint

- [x] Teste de agrupamento por categoria.
- [x] Teste de percentual por categoria.
- [x] Teste de comparação mensal.
- [x] Teste de relatório sem dados.
- [x] Teste de resumo textual por regras locais.
- [x] `npm test` passa.
- [x] `npm run lint` passa.

## Checklist final

- [x] App abre sem tela branca.
- [x] `npm test` passa com os testes adicionados na sprint.
- [x] `npm run lint` passa sem erros.
- [x] Não há chamada de rede para dados financeiros.
- [x] Não há dependência proibida adicionada.
- [x] `docs/sprint-09/PROGRESS.md` descreve o que foi entregue.
