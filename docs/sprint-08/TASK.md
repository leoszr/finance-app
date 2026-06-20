# Sprint 08 — Dashboard financeiro

## Objetivo

Criar uma tela inicial útil com indicadores do mês.

## Entrega da sprint

- Branch: `feature/sprint-08-dashboard`
- Commit final sugerido: `feat(dashboard): add monthly financial overview`
- Fase do plano: `Fase 7 — Consulta mensal e dashboard`
- Resultado deve ser pequeno, revisável e testável.

## Regras da sprint

- [ ] Criar uma feature branch para a sprint.
- [ ] Manter as alterações coesas ao objetivo da sprint.
- [ ] Atualizar ou criar testes junto com a implementação.
- [ ] Executar `npm test` e `npm run lint` antes do commit final.
- [ ] Não adicionar backend, Supabase, PostgreSQL, Java backend, API externa, IA ou sync automático.
- [ ] Atualizar `docs/sprint-08/PROGRESS.md` com evidências reais.

## Tasks

### T0801 — Criar queries de resumo mensal

- Status: todo
- Feature: Queries de resumo mensal
- Plano: `PLAN.md` > `Fase 7 — Consulta mensal e dashboard`
- Dependências: T0705

#### Requisitos funcionais

- [ ] Calcular totais do mês.
- [ ] Calcula receitas do mês.
- [ ] Calcula despesas do mês.
- [ ] Calcula saldo do mês.
- [ ] Calcula saldo total por conta.
- [ ] Calcula maior categoria de despesa.
- [ ] Cálculos usam dados reais do SQLite.

#### Requisitos técnicos

- [ ] Calcular indicadores a partir do SQLite local.
- [ ] Formatar valores monetários com helpers do domínio.
- [ ] Exibir estado vazio quando não houver dados.

#### Arquivos prováveis

- `src/lib/month.ts`
- `src/features/dashboard/`
- `src/db/queries/dashboardQueries.ts`

#### Passos sugeridos

1. Ler os arquivos prováveis e confirmar a estrutura existente.
2. Implementar somente o necessário para a feature desta task.
3. Adicionar ou atualizar testes específicos da task.
4. Rodar testes e lint.
5. Registrar evidências em `docs/sprint-08/PROGRESS.md`.

#### Critérios de aceite

- [ ] Calcula receitas do mês.
- [ ] Calcula despesas do mês.
- [ ] Calcula saldo do mês.
- [ ] Calcula saldo total por conta.
- [ ] Calcula maior categoria de despesa.
- [ ] Cálculos usam dados reais do SQLite.

#### Testes e verificação

- [ ] Adicionar teste cobrindo `Criar queries de resumo mensal` em arquivo de teste da sprint.
- [ ] Cobrir pelo menos: Calcula receitas do mês.
- [ ] Executar `npm test` com a suíte atualizada.
- [ ] Executar `npm run lint` sem erros novos.

### T0802 — Criar cards de resumo

- Status: todo
- Feature: Cards de resumo
- Plano: `PLAN.md` > `Fase 7 — Consulta mensal e dashboard`
- Dependências: T0801

#### Requisitos funcionais

- [ ] Mostrar indicadores principais.
- [ ] Card de receitas.
- [ ] Card de despesas.
- [ ] Card de saldo mensal.
- [ ] Card de saldo total.
- [ ] Valores formatados em BRL.

#### Requisitos técnicos

- [ ] Calcular indicadores a partir do SQLite local.
- [ ] Formatar valores monetários com helpers do domínio.
- [ ] Exibir estado vazio quando não houver dados.

#### Arquivos prováveis

- `src/features/dashboard/`
- `src/db/queries/dashboardQueries.ts`
- `src/components/finance/SummaryCard.tsx`
- `src/components/charts/`
- `src/tests/features/dashboard/`

#### Passos sugeridos

1. Ler os arquivos prováveis e confirmar a estrutura existente.
2. Implementar somente o necessário para a feature desta task.
3. Adicionar ou atualizar testes específicos da task.
4. Rodar testes e lint.
5. Registrar evidências em `docs/sprint-08/PROGRESS.md`.

#### Critérios de aceite

- [ ] Card de receitas.
- [ ] Card de despesas.
- [ ] Card de saldo mensal.
- [ ] Card de saldo total.
- [ ] Valores formatados em BRL.

#### Testes e verificação

- [ ] Adicionar teste cobrindo `Criar cards de resumo` em arquivo de teste da sprint.
- [ ] Cobrir pelo menos: Card de receitas.
- [ ] Executar `npm test` com a suíte atualizada.
- [ ] Executar `npm run lint` sem erros novos.

### T0803 — Criar lista de maiores gastos por categoria

- Status: todo
- Feature: Lista de maiores gastos por categoria
- Plano: `PLAN.md` > `Fase 7 — Consulta mensal e dashboard`
- Dependências: T0802

#### Requisitos funcionais

- [ ] Mostrar ranking de despesas.
- [ ] Agrupa despesas por categoria.
- [ ] Ordena do maior para o menor.
- [ ] Mostra pelo menos top 5.
- [ ] Ignora receitas.

#### Requisitos técnicos

- [ ] Calcular indicadores a partir do SQLite local.
- [ ] Formatar valores monetários com helpers do domínio.
- [ ] Exibir estado vazio quando não houver dados.

#### Arquivos prováveis

- `src/features/categories/`
- `src/hooks/useCategories.ts`
- `src/features/dashboard/`
- `src/db/queries/dashboardQueries.ts`

#### Passos sugeridos

1. Ler os arquivos prováveis e confirmar a estrutura existente.
2. Implementar somente o necessário para a feature desta task.
3. Adicionar ou atualizar testes específicos da task.
4. Rodar testes e lint.
5. Registrar evidências em `docs/sprint-08/PROGRESS.md`.

#### Critérios de aceite

- [ ] Agrupa despesas por categoria.
- [ ] Ordena do maior para o menor.
- [ ] Mostra pelo menos top 5.
- [ ] Ignora receitas.

#### Testes e verificação

- [ ] Adicionar teste cobrindo `Criar lista de maiores gastos por categoria` em arquivo de teste da
  sprint.
- [ ] Cobrir pelo menos: Agrupa despesas por categoria.
- [ ] Executar `npm test` com a suíte atualizada.
- [ ] Executar `npm run lint` sem erros novos.

### T0804 — Criar gráfico básico por categoria

- Status: todo
- Feature: Gráfico básico por categoria
- Plano: `PLAN.md` > `Fase 7 — Consulta mensal e dashboard`
- Dependências: T0803

#### Requisitos funcionais

- [ ] Visualizar distribuição de gastos.
- [ ] Gráfico usa dados locais.
- [ ] Mostra categorias de despesa.
- [ ] Estado vazio sem despesas.
- [ ] Não depende de internet.

#### Requisitos técnicos

- [ ] Calcular indicadores a partir do SQLite local.
- [ ] Formatar valores monetários com helpers do domínio.
- [ ] Exibir estado vazio quando não houver dados.
- [ ] Renderizar fallback textual quando gráfico não tiver dados.

#### Arquivos prováveis

- `src/features/categories/`
- `src/hooks/useCategories.ts`
- `src/components/charts/`
- `src/features/dashboard/`
- `src/db/queries/dashboardQueries.ts`

#### Passos sugeridos

1. Ler os arquivos prováveis e confirmar a estrutura existente.
2. Implementar somente o necessário para a feature desta task.
3. Adicionar ou atualizar testes específicos da task.
4. Rodar testes e lint.
5. Registrar evidências em `docs/sprint-08/PROGRESS.md`.

#### Critérios de aceite

- [ ] Gráfico usa dados locais.
- [ ] Mostra categorias de despesa.
- [ ] Estado vazio sem despesas.
- [ ] Não depende de internet.

#### Testes e verificação

- [ ] Adicionar teste cobrindo `Criar gráfico básico por categoria` em arquivo de teste da sprint.
- [ ] Cobrir pelo menos: Gráfico usa dados locais.
- [ ] Executar `npm test` com a suíte atualizada.
- [ ] Executar `npm run lint` sem erros novos.

### T0805 — Criar gráfico receita x despesa

- Status: todo
- Feature: Gráfico receita x despesa
- Plano: `PLAN.md` > `Fase 7 — Consulta mensal e dashboard`
- Dependências: T0804

#### Requisitos funcionais

- [ ] Comparar entradas e saídas.
- [ ] Mostra receita total.
- [ ] Mostra despesa total.
- [ ] Usa mês selecionado.
- [ ] Atualiza ao mudar mês.

#### Requisitos técnicos

- [ ] Calcular indicadores a partir do SQLite local.
- [ ] Formatar valores monetários com helpers do domínio.
- [ ] Exibir estado vazio quando não houver dados.
- [ ] Renderizar fallback textual quando gráfico não tiver dados.

#### Arquivos prováveis

- `src/components/charts/`
- `src/features/dashboard/`
- `src/db/queries/dashboardQueries.ts`

#### Passos sugeridos

1. Ler os arquivos prováveis e confirmar a estrutura existente.
2. Implementar somente o necessário para a feature desta task.
3. Adicionar ou atualizar testes específicos da task.
4. Rodar testes e lint.
5. Registrar evidências em `docs/sprint-08/PROGRESS.md`.

#### Critérios de aceite

- [ ] Mostra receita total.
- [ ] Mostra despesa total.
- [ ] Usa mês selecionado.
- [ ] Atualiza ao mudar mês.

#### Testes e verificação

- [ ] Adicionar teste cobrindo `Criar gráfico receita x despesa` em arquivo de teste da sprint.
- [ ] Cobrir pelo menos: Mostra receita total.
- [ ] Executar `npm test` com a suíte atualizada.
- [ ] Executar `npm run lint` sem erros novos.

## Testes da sprint

- [ ] Teste das queries de resumo.
- [ ] Teste de ranking de categorias.
- [ ] Teste de cálculo de saldo.
- [ ] Teste de dashboard sem transações.
- [ ] Teste de dashboard com receitas e despesas.
- [ ] `npm test` passa.
- [ ] `npm run lint` passa.

## Checklist final

- [ ] App abre sem tela branca.
- [ ] `npm test` passa com os testes adicionados na sprint.
- [ ] `npm run lint` passa sem erros.
- [ ] Não há chamada de rede para dados financeiros.
- [ ] Não há dependência proibida adicionada.
- [ ] `docs/sprint-08/PROGRESS.md` descreve o que foi entregue.
