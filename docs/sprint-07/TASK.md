# Sprint 07 — Filtros, busca e visão mensal

## Objetivo

Melhorar navegação sobre transações e permitir análise por mês.

## Entrega da sprint

- Branch: `feature/sprint-07-transactions-filtering`
- Commit final sugerido: `feat(transactions): add monthly filters and search`
- Fase do plano: `Fase 7 — Consulta mensal e dashboard`
- Resultado deve ser pequeno, revisável e testável.

## Regras da sprint

- [ ] Criar uma feature branch para a sprint.
- [ ] Manter as alterações coesas ao objetivo da sprint.
- [ ] Atualizar ou criar testes junto com a implementação.
- [ ] Executar `npm test` e `npm run lint` antes do commit final.
- [ ] Não adicionar backend, Supabase, PostgreSQL, Java backend, API externa, IA ou sync automático.
- [ ] Atualizar `docs/sprint-07/PROGRESS.md` com evidências reais.

## Tasks

### T0701 — Criar seletor de mês

- Status: todo
- Feature: Seletor de mês
- Plano: `PLAN.md` > `Fase 7 — Consulta mensal e dashboard`
- Dependências: T0605

#### Requisitos funcionais

- [ ] Filtrar transações por mês.
- [ ] Usuário vê mês atual por padrão.
- [ ] Usuário vai para mês anterior.
- [ ] Usuário vai para mês seguinte.
- [ ] Lista atualiza conforme o mês.

#### Requisitos técnicos

- [ ] Aplicar filtros em dados locais.
- [ ] Combinar mês, tipo, conta e busca sem perder consistência.
- [ ] Recalcular totais a partir do recorte filtrado.

#### Arquivos prováveis

- `src/features/transactions/`
- `src/hooks/useTransactions.ts`
- `src/lib/month.ts`
- `src/features/transactions/filters/`
- `src/hooks/useTransactionFilters.ts`

#### Passos sugeridos

1. Ler os arquivos prováveis e confirmar a estrutura existente.
2. Implementar somente o necessário para a feature desta task.
3. Adicionar ou atualizar testes específicos da task.
4. Rodar testes e lint.
5. Registrar evidências em `docs/sprint-07/PROGRESS.md`.

#### Critérios de aceite

- [ ] Usuário vê mês atual por padrão.
- [ ] Usuário vai para mês anterior.
- [ ] Usuário vai para mês seguinte.
- [ ] Lista atualiza conforme o mês.

#### Testes e verificação

- [ ] Adicionar teste cobrindo `Criar seletor de mês` em arquivo de teste da sprint.
- [ ] Cobrir pelo menos: Usuário vê mês atual por padrão.
- [ ] Executar `npm test` com a suíte atualizada.
- [ ] Executar `npm run lint` sem erros novos.

### T0702 — Criar filtro por tipo

- Status: todo
- Feature: Filtro por tipo
- Plano: `PLAN.md` > `Fase 7 — Consulta mensal e dashboard`
- Dependências: T0701

#### Requisitos funcionais

- [ ] Filtrar receitas e despesas.
- [ ] Filtro Todos mostra tudo.
- [ ] Filtro Receitas mostra apenas receitas.
- [ ] Filtro Despesas mostra apenas despesas.
- [ ] Filtro combina com mês selecionado.

#### Requisitos técnicos

- [ ] Aplicar filtros em dados locais.
- [ ] Combinar mês, tipo, conta e busca sem perder consistência.
- [ ] Recalcular totais a partir do recorte filtrado.

#### Arquivos prováveis

- `src/features/transactions/filters/`
- `src/lib/transactionFilters.ts`
- `src/hooks/useTransactionFilters.ts`

#### Passos sugeridos

1. Ler os arquivos prováveis e confirmar a estrutura existente.
2. Implementar somente o necessário para a feature desta task.
3. Adicionar ou atualizar testes específicos da task.
4. Rodar testes e lint.
5. Registrar evidências em `docs/sprint-07/PROGRESS.md`.

#### Critérios de aceite

- [ ] Filtro Todos mostra tudo.
- [ ] Filtro Receitas mostra apenas receitas.
- [ ] Filtro Despesas mostra apenas despesas.
- [ ] Filtro combina com mês selecionado.

#### Testes e verificação

- [ ] Adicionar teste cobrindo `Criar filtro por tipo` em arquivo de teste da sprint.
- [ ] Cobrir pelo menos: Filtro Todos mostra tudo.
- [ ] Executar `npm test` com a suíte atualizada.
- [ ] Executar `npm run lint` sem erros novos.

### T0703 — Criar filtro por conta

- Status: todo
- Feature: Filtro por conta
- Plano: `PLAN.md` > `Fase 7 — Consulta mensal e dashboard`
- Dependências: T0702

#### Requisitos funcionais

- [ ] Filtrar transações de uma conta específica.
- [ ] Usuário escolhe uma conta.
- [ ] Lista mostra apenas transações daquela conta.
- [ ] Opção Todas as contas restaura lista completa.

#### Requisitos técnicos

- [ ] Aplicar filtros em dados locais.
- [ ] Combinar mês, tipo, conta e busca sem perder consistência.
- [ ] Recalcular totais a partir do recorte filtrado.

#### Arquivos prováveis

- `src/features/accounts/`
- `src/hooks/useAccounts.ts`
- `src/features/transactions/`
- `src/hooks/useTransactions.ts`
- `src/features/transactions/filters/`
- `src/lib/transactionFilters.ts`
- `src/hooks/useTransactionFilters.ts`

#### Passos sugeridos

1. Ler os arquivos prováveis e confirmar a estrutura existente.
2. Implementar somente o necessário para a feature desta task.
3. Adicionar ou atualizar testes específicos da task.
4. Rodar testes e lint.
5. Registrar evidências em `docs/sprint-07/PROGRESS.md`.

#### Critérios de aceite

- [ ] Usuário escolhe uma conta.
- [ ] Lista mostra apenas transações daquela conta.
- [ ] Opção Todas as contas restaura lista completa.

#### Testes e verificação

- [ ] Adicionar teste cobrindo `Criar filtro por conta` em arquivo de teste da sprint.
- [ ] Cobrir pelo menos: Usuário escolhe uma conta.
- [ ] Executar `npm test` com a suíte atualizada.
- [ ] Executar `npm run lint` sem erros novos.

### T0704 — Criar busca por descrição

- Status: todo
- Feature: Busca por descrição
- Plano: `PLAN.md` > `Fase 7 — Consulta mensal e dashboard`
- Dependências: T0703

#### Requisitos funcionais

- [ ] Encontrar transações por texto.
- [ ] Busca filtra por descrição.
- [ ] Busca ignora maiúsculas/minúsculas.
- [ ] Busca combina com mês, tipo e conta.

#### Requisitos técnicos

- [ ] Aplicar filtros em dados locais.
- [ ] Combinar mês, tipo, conta e busca sem perder consistência.
- [ ] Recalcular totais a partir do recorte filtrado.

#### Arquivos prováveis

- `src/features/transactions/`
- `src/hooks/useTransactions.ts`
- `src/features/transactions/filters/`
- `src/lib/transactionFilters.ts`
- `src/hooks/useTransactionFilters.ts`

#### Passos sugeridos

1. Ler os arquivos prováveis e confirmar a estrutura existente.
2. Implementar somente o necessário para a feature desta task.
3. Adicionar ou atualizar testes específicos da task.
4. Rodar testes e lint.
5. Registrar evidências em `docs/sprint-07/PROGRESS.md`.

#### Critérios de aceite

- [ ] Busca filtra por descrição.
- [ ] Busca ignora maiúsculas/minúsculas.
- [ ] Busca combina com mês, tipo e conta.

#### Testes e verificação

- [ ] Adicionar teste cobrindo `Criar busca por descrição` em arquivo de teste da sprint.
- [ ] Cobrir pelo menos: Busca filtra por descrição.
- [ ] Executar `npm test` com a suíte atualizada.
- [ ] Executar `npm run lint` sem erros novos.

### T0705 — Criar resumo da lista filtrada

- Status: todo
- Feature: Resumo da lista filtrada
- Plano: `PLAN.md` > `Fase 7 — Consulta mensal e dashboard`
- Dependências: T0704

#### Requisitos funcionais

- [ ] Mostrar totais do recorte atual.
- [ ] Mostra total de receitas.
- [ ] Mostra total de despesas.
- [ ] Mostra saldo do período filtrado.
- [ ] Atualiza quando filtros mudam.

#### Requisitos técnicos

- [ ] Aplicar filtros em dados locais.
- [ ] Combinar mês, tipo, conta e busca sem perder consistência.
- [ ] Recalcular totais a partir do recorte filtrado.

#### Arquivos prováveis

- `src/features/transactions/filters/`
- `src/hooks/useTransactionFilters.ts`
- `src/lib/transactionFilters.ts`
- `src/tests/features/transactions/filters.test.ts`

#### Passos sugeridos

1. Ler os arquivos prováveis e confirmar a estrutura existente.
2. Implementar somente o necessário para a feature desta task.
3. Adicionar ou atualizar testes específicos da task.
4. Rodar testes e lint.
5. Registrar evidências em `docs/sprint-07/PROGRESS.md`.

#### Critérios de aceite

- [ ] Mostra total de receitas.
- [ ] Mostra total de despesas.
- [ ] Mostra saldo do período filtrado.
- [ ] Atualiza quando filtros mudam.

#### Testes e verificação

- [ ] Adicionar teste cobrindo `Criar resumo da lista filtrada` em arquivo de teste da sprint.
- [ ] Cobrir pelo menos: Mostra total de receitas.
- [ ] Executar `npm test` com a suíte atualizada.
- [ ] Executar `npm run lint` sem erros novos.

## Testes da sprint

- [ ] Teste de filtro por mês.
- [ ] Teste de filtro por tipo.
- [ ] Teste de filtro por conta.
- [ ] Teste de busca.
- [ ] Teste combinando todos os filtros.
- [ ] Teste do resumo filtrado.
- [ ] `npm test` passa.
- [ ] `npm run lint` passa.

## Checklist final

- [ ] App abre sem tela branca.
- [ ] `npm test` passa com os testes adicionados na sprint.
- [ ] `npm run lint` passa sem erros.
- [ ] Não há chamada de rede para dados financeiros.
- [ ] Não há dependência proibida adicionada.
- [ ] `docs/sprint-07/PROGRESS.md` descreve o que foi entregue.
