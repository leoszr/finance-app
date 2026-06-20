# Sprint 09 — Relatórios locais

## Objetivo

Criar relatório mensal dentro do app, sem PDF ainda.

## Entrega da sprint

- Branch: `feature/sprint-09-local-reports`
- Commit final sugerido: `feat(reports): add local monthly reports`
- Fase do plano: `Fase 8 — Relatórios e PDF`
- Resultado deve ser pequeno, revisável e testável.

## Regras da sprint

- [ ] Criar uma feature branch para a sprint.
- [ ] Manter as alterações coesas ao objetivo da sprint.
- [ ] Atualizar ou criar testes junto com a implementação.
- [ ] Executar `npm test` e `npm run lint` antes do commit final.
- [ ] Não adicionar backend, Supabase, PostgreSQL, Java backend, API externa, IA ou sync automático.
- [ ] Atualizar `docs/sprint-09/PROGRESS.md` com evidências reais.

## Tasks

### T0901 — Criar tela de relatórios

- Status: todo
- Feature: Tela de relatórios
- Plano: `PLAN.md` > `Fase 8 — Relatórios e PDF`
- Dependências: T0805

#### Requisitos funcionais

- [ ] Centralizar análise mensal.
- [ ] Tela acessível pela navegação.
- [ ] Mês selecionável.
- [ ] Mostra resumo do período.
- [ ] Usa dados do SQLite.

#### Requisitos técnicos

- [ ] Gerar relatório somente com regras locais.
- [ ] Não chamar IA, backend ou API externa.
- [ ] Tratar mês sem dados e mês anterior sem dados.

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

- [ ] Tela acessível pela navegação.
- [ ] Mês selecionável.
- [ ] Mostra resumo do período.
- [ ] Usa dados do SQLite.

#### Testes e verificação

- [ ] Adicionar teste cobrindo `Criar tela de relatórios` em arquivo de teste da sprint.
- [ ] Cobrir pelo menos: Tela acessível pela navegação.
- [ ] Executar `npm test` com a suíte atualizada.
- [ ] Executar `npm run lint` sem erros novos.

### T0902 — Criar tabela de transações do relatório

- Status: todo
- Feature: Tabela de transações do relatório
- Plano: `PLAN.md` > `Fase 8 — Relatórios e PDF`
- Dependências: T0901

#### Requisitos funcionais

- [ ] Mostrar transações do período.
- [ ] Mostra data.
- [ ] Mostra descrição.
- [ ] Mostra categoria.
- [ ] Mostra conta.
- [ ] Mostra valor.
- [ ] Ordena por data.

#### Requisitos técnicos

- [ ] Gerar relatório somente com regras locais.
- [ ] Não chamar IA, backend ou API externa.
- [ ] Tratar mês sem dados e mês anterior sem dados.

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

- [ ] Mostra data.
- [ ] Mostra descrição.
- [ ] Mostra categoria.
- [ ] Mostra conta.
- [ ] Mostra valor.
- [ ] Ordena por data.

#### Testes e verificação

- [ ] Adicionar teste cobrindo `Criar tabela de transações do relatório` em arquivo de teste da
  sprint.
- [ ] Cobrir pelo menos: Mostra data.
- [ ] Executar `npm test` com a suíte atualizada.
- [ ] Executar `npm run lint` sem erros novos.

### T0903 — Criar seção de categorias

- Status: todo
- Feature: Seção de categorias
- Plano: `PLAN.md` > `Fase 8 — Relatórios e PDF`
- Dependências: T0902

#### Requisitos funcionais

- [ ] Resumir gastos por categoria.
- [ ] Agrupa despesas por categoria.
- [ ] Mostra valor total.
- [ ] Mostra percentual sobre despesas.
- [ ] Ordena do maior para o menor.

#### Requisitos técnicos

- [ ] Gerar relatório somente com regras locais.
- [ ] Não chamar IA, backend ou API externa.
- [ ] Tratar mês sem dados e mês anterior sem dados.

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

- [ ] Agrupa despesas por categoria.
- [ ] Mostra valor total.
- [ ] Mostra percentual sobre despesas.
- [ ] Ordena do maior para o menor.

#### Testes e verificação

- [ ] Adicionar teste cobrindo `Criar seção de categorias` em arquivo de teste da sprint.
- [ ] Cobrir pelo menos: Agrupa despesas por categoria.
- [ ] Executar `npm test` com a suíte atualizada.
- [ ] Executar `npm run lint` sem erros novos.

### T0904 — Criar comparação com mês anterior

- Status: todo
- Feature: Comparação com mês anterior
- Plano: `PLAN.md` > `Fase 8 — Relatórios e PDF`
- Dependências: T0903

#### Requisitos funcionais

- [ ] Mostrar variação mensal.
- [ ] Calcula receita do mês anterior.
- [ ] Calcula despesa do mês anterior.
- [ ] Mostra diferença absoluta.
- [ ] Mostra diferença percentual.
- [ ] Trata mês anterior sem dados.

#### Requisitos técnicos

- [ ] Gerar relatório somente com regras locais.
- [ ] Não chamar IA, backend ou API externa.
- [ ] Tratar mês sem dados e mês anterior sem dados.

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

- [ ] Calcula receita do mês anterior.
- [ ] Calcula despesa do mês anterior.
- [ ] Mostra diferença absoluta.
- [ ] Mostra diferença percentual.
- [ ] Trata mês anterior sem dados.

#### Testes e verificação

- [ ] Adicionar teste cobrindo `Criar comparação com mês anterior` em arquivo de teste da sprint.
- [ ] Cobrir pelo menos: Calcula receita do mês anterior.
- [ ] Executar `npm test` com a suíte atualizada.
- [ ] Executar `npm run lint` sem erros novos.

### T0905 — Criar resumo textual automático local

- Status: todo
- Feature: Resumo textual automático local
- Plano: `PLAN.md` > `Fase 8 — Relatórios e PDF`
- Dependências: T0904

#### Requisitos funcionais

- [ ] Gerar observações sem IA.
- [ ] Texto gerado por regras locais.
- [ ] Não chama API externa.
- [ ] Cobre aumento, redução e ausência de dados.
- [ ] Usa valores reais do relatório.

#### Requisitos técnicos

- [ ] Gerar relatório somente com regras locais.
- [ ] Não chamar IA, backend ou API externa.
- [ ] Tratar mês sem dados e mês anterior sem dados.

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

- [ ] Texto gerado por regras locais.
- [ ] Não chama API externa.
- [ ] Cobre aumento, redução e ausência de dados.
- [ ] Usa valores reais do relatório.

#### Testes e verificação

- [ ] Adicionar teste cobrindo `Criar resumo textual automático local` em arquivo de teste da
  sprint.
- [ ] Cobrir pelo menos: Texto gerado por regras locais.
- [ ] Executar `npm test` com a suíte atualizada.
- [ ] Executar `npm run lint` sem erros novos.

## Testes da sprint

- [ ] Teste de agrupamento por categoria.
- [ ] Teste de percentual por categoria.
- [ ] Teste de comparação mensal.
- [ ] Teste de relatório sem dados.
- [ ] Teste de resumo textual por regras locais.
- [ ] `npm test` passa.
- [ ] `npm run lint` passa.

## Checklist final

- [ ] App abre sem tela branca.
- [ ] `npm test` passa com os testes adicionados na sprint.
- [ ] `npm run lint` passa sem erros.
- [ ] Não há chamada de rede para dados financeiros.
- [ ] Não há dependência proibida adicionada.
- [ ] `docs/sprint-09/PROGRESS.md` descreve o que foi entregue.
