# Sprint 07 — Filtros, busca e visão mensal

## Objetivo

Melhorar navegação sobre transações e permitir análise por mês.

## Entrega da sprint

- Branch: `feature/sprint-07-transactions-filtering`
- Commit final sugerido: `feat(transactions): add monthly filters and search`
- Fase do plano: `Fase 7 — Consulta mensal e dashboard`
- Resultado deve ser pequeno, revisável e testável.

## Regras da sprint

- [x] Criar uma feature branch para a sprint.
- [x] Manter as alterações coesas ao objetivo da sprint.
- [x] Atualizar ou criar testes junto com a implementação.
- [x] Executar `npm test` e `npm run lint` antes do commit final.
- [x] Não adicionar backend, Supabase, PostgreSQL, Java backend, API externa, IA ou sync automático.
- [x] Atualizar `docs/sprint-07/PROGRESS.md` com evidências reais.

## Tasks

### T0701 — Criar seletor de mês

- Status: done
- Feature: Seletor de mês
- Plano: `PLAN.md` > `Fase 7 — Consulta mensal e dashboard`
- Dependências: T0605

#### Requisitos funcionais

- [x] Filtrar transações por mês.
- [x] Usuário vê mês atual por padrão.
- [x] Usuário vai para mês anterior.
- [x] Usuário vai para mês seguinte.
- [x] Lista atualiza conforme o mês.

#### Requisitos técnicos

- [x] Aplicar filtros em dados locais.
- [x] Combinar mês, tipo, conta e busca sem perder consistência.
- [x] Recalcular totais a partir do recorte filtrado.

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

- [x] Usuário vê mês atual por padrão.
- [x] Usuário vai para mês anterior.
- [x] Usuário vai para mês seguinte.
- [x] Lista atualiza conforme o mês.

#### Testes e verificação

- [x] Adicionar teste cobrindo `Criar seletor de mês` em arquivo de teste da sprint.
- [x] Cobrir pelo menos: Usuário vê mês atual por padrão.
- [x] Executar `npm test` com a suíte atualizada.
- [x] Executar `npm run lint` sem erros novos.

### T0702 — Criar filtro por tipo

- Status: done
- Feature: Filtro por tipo
- Plano: `PLAN.md` > `Fase 7 — Consulta mensal e dashboard`
- Dependências: T0701

#### Requisitos funcionais

- [x] Filtrar receitas e despesas.
- [x] Filtro Todos mostra tudo.
- [x] Filtro Receitas mostra apenas receitas.
- [x] Filtro Despesas mostra apenas despesas.
- [x] Filtro combina com mês selecionado.

#### Requisitos técnicos

- [x] Aplicar filtros em dados locais.
- [x] Combinar mês, tipo, conta e busca sem perder consistência.
- [x] Recalcular totais a partir do recorte filtrado.

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

- [x] Filtro Todos mostra tudo.
- [x] Filtro Receitas mostra apenas receitas.
- [x] Filtro Despesas mostra apenas despesas.
- [x] Filtro combina com mês selecionado.

#### Testes e verificação

- [x] Adicionar teste cobrindo `Criar filtro por tipo` em arquivo de teste da sprint.
- [x] Cobrir pelo menos: Filtro Todos mostra tudo.
- [x] Executar `npm test` com a suíte atualizada.
- [x] Executar `npm run lint` sem erros novos.

### T0703 — Criar filtro por conta

- Status: done
- Feature: Filtro por conta
- Plano: `PLAN.md` > `Fase 7 — Consulta mensal e dashboard`
- Dependências: T0702

#### Requisitos funcionais

- [x] Filtrar transações de uma conta específica.
- [x] Usuário escolhe uma conta.
- [x] Lista mostra apenas transações daquela conta.
- [x] Opção Todas as contas restaura lista completa.

#### Requisitos técnicos

- [x] Aplicar filtros em dados locais.
- [x] Combinar mês, tipo, conta e busca sem perder consistência.
- [x] Recalcular totais a partir do recorte filtrado.

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

- [x] Usuário escolhe uma conta.
- [x] Lista mostra apenas transações daquela conta.
- [x] Opção Todas as contas restaura lista completa.

#### Testes e verificação

- [x] Adicionar teste cobrindo `Criar filtro por conta` em arquivo de teste da sprint.
- [x] Cobrir pelo menos: Usuário escolhe uma conta.
- [x] Executar `npm test` com a suíte atualizada.
- [x] Executar `npm run lint` sem erros novos.

### T0704 — Criar busca por descrição

- Status: done
- Feature: Busca por descrição
- Plano: `PLAN.md` > `Fase 7 — Consulta mensal e dashboard`
- Dependências: T0703

#### Requisitos funcionais

- [x] Encontrar transações por texto.
- [x] Busca filtra por descrição.
- [x] Busca ignora maiúsculas/minúsculas.
- [x] Busca combina com mês, tipo e conta.

#### Requisitos técnicos

- [x] Aplicar filtros em dados locais.
- [x] Combinar mês, tipo, conta e busca sem perder consistência.
- [x] Recalcular totais a partir do recorte filtrado.

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

- [x] Busca filtra por descrição.
- [x] Busca ignora maiúsculas/minúsculas.
- [x] Busca combina com mês, tipo e conta.

#### Testes e verificação

- [x] Adicionar teste cobrindo `Criar busca por descrição` em arquivo de teste da sprint.
- [x] Cobrir pelo menos: Busca filtra por descrição.
- [x] Executar `npm test` com a suíte atualizada.
- [x] Executar `npm run lint` sem erros novos.

### T0705 — Criar resumo da lista filtrada

- Status: done
- Feature: Resumo da lista filtrada
- Plano: `PLAN.md` > `Fase 7 — Consulta mensal e dashboard`
- Dependências: T0704

#### Requisitos funcionais

- [x] Mostrar totais do recorte atual.
- [x] Mostra total de receitas.
- [x] Mostra total de despesas.
- [x] Mostra saldo do período filtrado.
- [x] Atualiza quando filtros mudam.

#### Requisitos técnicos

- [x] Aplicar filtros em dados locais.
- [x] Combinar mês, tipo, conta e busca sem perder consistência.
- [x] Recalcular totais a partir do recorte filtrado.

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

- [x] Mostra total de receitas.
- [x] Mostra total de despesas.
- [x] Mostra saldo do período filtrado.
- [x] Atualiza quando filtros mudam.

#### Testes e verificação

- [x] Adicionar teste cobrindo `Criar resumo da lista filtrada` em arquivo de teste da sprint.
- [x] Cobrir pelo menos: Mostra total de receitas.
- [x] Executar `npm test` com a suíte atualizada.
- [x] Executar `npm run lint` sem erros novos.

## Testes da sprint

- [x] Teste de filtro por mês.
- [x] Teste de filtro por tipo.
- [x] Teste de filtro por conta.
- [x] Teste de busca.
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
