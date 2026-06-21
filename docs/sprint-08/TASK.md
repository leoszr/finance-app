# Sprint 08 — Dashboard financeiro

## Objetivo

Criar uma tela inicial útil com indicadores do mês.

## Entrega da sprint

- Branch: `feature/sprint-08-dashboard`
- Commit final sugerido: `feat(dashboard): add monthly financial overview`
- Fase do plano: `Fase 7 — Consulta mensal e dashboard`
- Resultado deve ser pequeno, revisável e testável.

## Regras da sprint

- [x] Criar uma feature branch para a sprint.
- [x] Manter as alterações coesas ao objetivo da sprint.
- [x] Atualizar ou criar testes junto com a implementação.
- [x] Executar `npm test` e `npm run lint` antes do commit final.
- [x] Não adicionar backend, Supabase, PostgreSQL, Java backend, API externa, IA ou sync automático.
- [x] Atualizar `docs/sprint-08/PROGRESS.md` com evidências reais.

## Tasks

### T0801 — Criar queries de resumo mensal

- Status: done
- Feature: Queries de resumo mensal
- Plano: `PLAN.md` > `Fase 7 — Consulta mensal e dashboard`
- Dependências: T0705

#### Requisitos funcionais

- [x] Calcular totais do mês.
- [x] Calcula receitas do mês.
- [x] Calcula despesas do mês.
- [x] Calcula saldo do mês.
- [x] Calcula saldo total por conta.
- [x] Calcula maior categoria de despesa.
- [x] Cálculos usam dados reais do SQLite.

#### Requisitos técnicos

- [x] Calcular indicadores a partir do SQLite local.
- [x] Formatar valores monetários com helpers do domínio.
- [x] Exibir estado vazio quando não houver dados.

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

- [x] Calcula receitas do mês.
- [x] Calcula despesas do mês.
- [x] Calcula saldo do mês.
- [x] Calcula saldo total por conta.
- [x] Calcula maior categoria de despesa.
- [x] Cálculos usam dados reais do SQLite.

#### Testes e verificação

- [x] Adicionar teste cobrindo `Criar queries de resumo mensal` em arquivo de teste da sprint.
- [x] Cobrir pelo menos: Calcula receitas do mês.
- [x] Executar `npm test` com a suíte atualizada.
- [x] Executar `npm run lint` sem erros novos.

### T0802 — Criar cards de resumo

- Status: done
- Feature: Cards de resumo
- Plano: `PLAN.md` > `Fase 7 — Consulta mensal e dashboard`
- Dependências: T0801

#### Requisitos funcionais

- [x] Mostrar indicadores principais.
- [x] Card de receitas.
- [x] Card de despesas.
- [x] Card de saldo mensal.
- [x] Card de saldo total.
- [x] Valores formatados em BRL.

#### Requisitos técnicos

- [x] Calcular indicadores a partir do SQLite local.
- [x] Formatar valores monetários com helpers do domínio.
- [x] Exibir estado vazio quando não houver dados.

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

- [x] Card de receitas.
- [x] Card de despesas.
- [x] Card de saldo mensal.
- [x] Card de saldo total.
- [x] Valores formatados em BRL.

#### Testes e verificação

- [x] Adicionar teste cobrindo `Criar cards de resumo` em arquivo de teste da sprint.
- [x] Cobrir pelo menos: Card de receitas.
- [x] Executar `npm test` com a suíte atualizada.
- [x] Executar `npm run lint` sem erros novos.

### T0803 — Criar lista de maiores gastos por categoria

- Status: done
- Feature: Lista de maiores gastos por categoria
- Plano: `PLAN.md` > `Fase 7 — Consulta mensal e dashboard`
- Dependências: T0802

#### Requisitos funcionais

- [x] Mostrar ranking de despesas.
- [x] Agrupa despesas por categoria.
- [x] Ordena do maior para o menor.
- [x] Mostra pelo menos top 5.
- [x] Ignora receitas.

#### Requisitos técnicos

- [x] Calcular indicadores a partir do SQLite local.
- [x] Formatar valores monetários com helpers do domínio.
- [x] Exibir estado vazio quando não houver dados.

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

- [x] Agrupa despesas por categoria.
- [x] Ordena do maior para o menor.
- [x] Mostra pelo menos top 5.
- [x] Ignora receitas.

#### Testes e verificação

- [x] Adicionar teste cobrindo `Criar lista de maiores gastos por categoria` em arquivo de teste da
  sprint.
- [x] Cobrir pelo menos: Agrupa despesas por categoria.
- [x] Executar `npm test` com a suíte atualizada.
- [x] Executar `npm run lint` sem erros novos.

### T0804 — Criar gráfico básico por categoria

- Status: done
- Feature: Gráfico básico por categoria
- Plano: `PLAN.md` > `Fase 7 — Consulta mensal e dashboard`
- Dependências: T0803

#### Requisitos funcionais

- [x] Visualizar distribuição de gastos.
- [x] Gráfico usa dados locais.
- [x] Mostra categorias de despesa.
- [x] Estado vazio sem despesas.
- [x] Não depende de internet.

#### Requisitos técnicos

- [x] Calcular indicadores a partir do SQLite local.
- [x] Formatar valores monetários com helpers do domínio.
- [x] Exibir estado vazio quando não houver dados.
- [x] Renderizar fallback textual quando gráfico não tiver dados.

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

- [x] Gráfico usa dados locais.
- [x] Mostra categorias de despesa.
- [x] Estado vazio sem despesas.
- [x] Não depende de internet.

#### Testes e verificação

- [x] Adicionar teste cobrindo `Criar gráfico básico por categoria` em arquivo de teste da sprint.
- [x] Cobrir pelo menos: Gráfico usa dados locais.
- [x] Executar `npm test` com a suíte atualizada.
- [x] Executar `npm run lint` sem erros novos.

### T0805 — Criar gráfico receita x despesa

- Status: done
- Feature: Gráfico receita x despesa
- Plano: `PLAN.md` > `Fase 7 — Consulta mensal e dashboard`
- Dependências: T0804

#### Requisitos funcionais

- [x] Comparar entradas e saídas.
- [x] Mostra receita total.
- [x] Mostra despesa total.
- [x] Usa mês selecionado.
- [x] Atualiza ao mudar mês.

#### Requisitos técnicos

- [x] Calcular indicadores a partir do SQLite local.
- [x] Formatar valores monetários com helpers do domínio.
- [x] Exibir estado vazio quando não houver dados.
- [x] Renderizar fallback textual quando gráfico não tiver dados.

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

- [x] Mostra receita total.
- [x] Mostra despesa total.
- [x] Usa mês selecionado.
- [x] Atualiza ao mudar mês.

#### Testes e verificação

- [x] Adicionar teste cobrindo `Criar gráfico receita x despesa` em arquivo de teste da sprint.
- [x] Cobrir pelo menos: Mostra receita total.
- [x] Executar `npm test` com a suíte atualizada.
- [x] Executar `npm run lint` sem erros novos.

## Testes da sprint

- [x] Teste das queries de resumo.
- [x] Teste de ranking de categorias.
- [x] Teste de cálculo de saldo.
- [x] Teste de dashboard sem transações.
- [x] Teste de dashboard com receitas e despesas.
- [x] `npm test` passa.
- [x] `npm run lint` passa.

## Checklist final

- [x] App abre sem tela branca.
- [x] `npm test` passa com os testes adicionados na sprint.
- [x] `npm run lint` passa sem erros.
- [x] Não há chamada de rede para dados financeiros.
- [x] Não há dependência proibida adicionada.
- [x] `docs/sprint-08/PROGRESS.md` descreve o que foi entregue.
