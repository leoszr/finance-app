# Sprint 03 — Repositórios locais

## Objetivo

Criar a camada que lê e escreve no SQLite sem misturar SQL direto nas telas.

## Entrega da sprint

- Branch: `feature/sprint-03-local-repositories`
- Commit final sugerido: `feat(db): add local repositories for finance entities`
- Fase do plano: `Fase 4 — Repositórios locais`
- Resultado deve ser pequeno, revisável e testável.

## Regras da sprint

- [ ] Criar uma feature branch para a sprint.
- [ ] Manter as alterações coesas ao objetivo da sprint.
- [ ] Atualizar ou criar testes junto com a implementação.
- [ ] Executar `npm test` e `npm run lint` antes do commit final.
- [ ] Não adicionar backend, Supabase, PostgreSQL, Java backend, API externa, IA ou sync automático.
- [ ] Atualizar `docs/sprint-03/PROGRESS.md` com evidências reais.

## Tasks

### T0301 — Criar `accountsRepository`

- Status: todo
- Feature: `accountsRepository`
- Plano: `PLAN.md` > `Fase 4 — Repositórios locais`
- Dependências: T0205

#### Requisitos funcionais

- [ ] Centralizar operações de contas.
- [ ] Métodos: `createAccount()`, `getAccounts()`, `getAccountById()`, `updateAccount()`,
  `deleteAccount()`.
- [ ] Cria conta válida.
- [ ] Lista contas ordenadas por criação.
- [ ] Atualiza nome, tipo e saldo inicial.
- [ ] Exclui conta apenas sem transações associadas.

#### Requisitos técnicos

- [ ] Centralizar acesso ao SQLite em repositórios.
- [ ] Não escrever SQL direto em telas ou componentes.
- [ ] Validar integridade antes de remover entidades usadas.

#### Arquivos prováveis

- `src/db/repositories/accountsRepository.ts`
- `src/tests/repositories/accountsRepository.test.ts`
- `src/features/accounts/`
- `src/hooks/useAccounts.ts`
- `src/db/repositories/categoriesRepository.ts`

#### Passos sugeridos

1. Ler os arquivos prováveis e confirmar a estrutura existente.
2. Implementar somente o necessário para a feature desta task.
3. Adicionar ou atualizar testes específicos da task.
4. Rodar testes e lint.
5. Registrar evidências em `docs/sprint-03/PROGRESS.md`.

#### Critérios de aceite

- [ ] Métodos: `createAccount()`, `getAccounts()`, `getAccountById()`, `updateAccount()`,
  `deleteAccount()`.
- [ ] Cria conta válida.
- [ ] Lista contas ordenadas por criação.
- [ ] Atualiza nome, tipo e saldo inicial.
- [ ] Exclui conta apenas sem transações associadas.

#### Testes e verificação

- [ ] Testar CRUD de conta.
- [ ] Testar bloqueio de delete com transação associada.
- [ ] Adicionar teste cobrindo `Criar `accountsRepository`` em arquivo de teste da sprint.
- [ ] Cobrir pelo menos: Métodos: `createAccount()`, `getAccounts()`, `getAccountById()`,
  `updateAccount()`, `deleteAccount()`.
- [ ] Executar `npm test` com a suíte atualizada.
- [ ] Executar `npm run lint` sem erros novos.

### T0302 — Criar `categoriesRepository`

- Status: todo
- Feature: `categoriesRepository`
- Plano: `PLAN.md` > `Fase 4 — Repositórios locais`
- Dependências: T0301

#### Requisitos funcionais

- [ ] Centralizar operações de categorias.
- [ ] Métodos: `createCategory()`, `getCategories()`, `getCategoriesByType()`, `updateCategory()`,
  `deleteCategory()`.
- [ ] Cria categoria válida.
- [ ] Lista categorias por tipo.
- [ ] Atualiza nome, cor e ícone.
- [ ] Exclui categoria apenas sem transações associadas.

#### Requisitos técnicos

- [ ] Centralizar acesso ao SQLite em repositórios.
- [ ] Não escrever SQL direto em telas ou componentes.
- [ ] Validar integridade antes de remover entidades usadas.

#### Arquivos prováveis

- `src/db/repositories/categoriesRepository.ts`
- `src/tests/repositories/categoriesRepository.test.ts`
- `src/features/categories/`
- `src/hooks/useCategories.ts`
- `src/db/repositories/accountsRepository.ts`

#### Passos sugeridos

1. Ler os arquivos prováveis e confirmar a estrutura existente.
2. Implementar somente o necessário para a feature desta task.
3. Adicionar ou atualizar testes específicos da task.
4. Rodar testes e lint.
5. Registrar evidências em `docs/sprint-03/PROGRESS.md`.

#### Critérios de aceite

- [ ] Métodos: `createCategory()`, `getCategories()`, `getCategoriesByType()`, `updateCategory()`,
  `deleteCategory()`.
- [ ] Cria categoria válida.
- [ ] Lista categorias por tipo.
- [ ] Atualiza nome, cor e ícone.
- [ ] Exclui categoria apenas sem transações associadas.

#### Testes e verificação

- [ ] Testar listagem por tipo.
- [ ] Testar bloqueio de delete com transação associada.
- [ ] Adicionar teste cobrindo `Criar `categoriesRepository`` em arquivo de teste da sprint.
- [ ] Cobrir pelo menos: Métodos: `createCategory()`, `getCategories()`, `getCategoriesByType()`,
  `updateCategory()`, `deleteCategory()`.
- [ ] Executar `npm test` com a suíte atualizada.
- [ ] Executar `npm run lint` sem erros novos.

### T0303 — Criar `transactionsRepository`

- Status: todo
- Feature: `transactionsRepository`
- Plano: `PLAN.md` > `Fase 4 — Repositórios locais`
- Dependências: T0302

#### Requisitos funcionais

- [ ] Centralizar operações de transações.
- [ ] Métodos: `createTransaction()`, `getTransactions()`, `getTransactionsByMonth()`,
  `getTransactionById()`, `updateTransaction()`, `deleteTransaction()`.
- [ ] Cria receita.
- [ ] Cria despesa.
- [ ] Lista por mês.
- [ ] Edita transação existente.
- [ ] Exclui transação existente.

#### Requisitos técnicos

- [ ] Centralizar acesso ao SQLite em repositórios.
- [ ] Não escrever SQL direto em telas ou componentes.
- [ ] Validar integridade antes de remover entidades usadas.

#### Arquivos prováveis

- `src/db/repositories/transactionsRepository.ts`
- `src/tests/repositories/transactionsRepository.test.ts`
- `src/features/transactions/`
- `src/hooks/useTransactions.ts`
- `src/db/repositories/accountsRepository.ts`
- `src/db/repositories/categoriesRepository.ts`

#### Passos sugeridos

1. Ler os arquivos prováveis e confirmar a estrutura existente.
2. Implementar somente o necessário para a feature desta task.
3. Adicionar ou atualizar testes específicos da task.
4. Rodar testes e lint.
5. Registrar evidências em `docs/sprint-03/PROGRESS.md`.

#### Critérios de aceite

- [ ] Métodos: `createTransaction()`, `getTransactions()`, `getTransactionsByMonth()`,
  `getTransactionById()`, `updateTransaction()`, `deleteTransaction()`.
- [ ] Cria receita.
- [ ] Cria despesa.
- [ ] Lista por mês.
- [ ] Edita transação existente.
- [ ] Exclui transação existente.

#### Testes e verificação

- [ ] Testar criação de receita e despesa.
- [ ] Testar listagem por mês e update/delete.
- [ ] Adicionar teste cobrindo `Criar `transactionsRepository`` em arquivo de teste da sprint.
- [ ] Cobrir pelo menos: Métodos: `createTransaction()`, `getTransactions()`,
  `getTransactionsByMonth()`, `getTransactionById()`, `updateTransaction()`, `deleteTransaction()`.
- [ ] Executar `npm test` com a suíte atualizada.
- [ ] Executar `npm run lint` sem erros novos.

### T0304 — Criar `settingsRepository`

- Status: todo
- Feature: `settingsRepository`
- Plano: `PLAN.md` > `Fase 4 — Repositórios locais`
- Dependências: T0303

#### Requisitos funcionais

- [ ] Salvar e recuperar configurações locais.
- [ ] Métodos: `getSetting()`, `setSetting()`, `deleteSetting()`.
- [ ] Salva configuração.
- [ ] Atualiza configuração existente.
- [ ] Recupera por chave.
- [ ] Retorna `null` quando não existe.

#### Requisitos técnicos

- [ ] Centralizar acesso ao SQLite em repositórios.
- [ ] Não escrever SQL direto em telas ou componentes.
- [ ] Validar integridade antes de remover entidades usadas.

#### Arquivos prováveis

- `src/db/repositories/settingsRepository.ts`
- `src/tests/repositories/settingsRepository.test.ts`
- `src/features/settings/`
- `src/hooks/useSettings.ts`
- `src/db/repositories/accountsRepository.ts`
- `src/db/repositories/categoriesRepository.ts`

#### Passos sugeridos

1. Ler os arquivos prováveis e confirmar a estrutura existente.
2. Implementar somente o necessário para a feature desta task.
3. Adicionar ou atualizar testes específicos da task.
4. Rodar testes e lint.
5. Registrar evidências em `docs/sprint-03/PROGRESS.md`.

#### Critérios de aceite

- [ ] Métodos: `getSetting()`, `setSetting()`, `deleteSetting()`.
- [ ] Salva configuração.
- [ ] Atualiza configuração existente.
- [ ] Recupera por chave.
- [ ] Retorna `null` quando não existe.

#### Testes e verificação

- [ ] Testar set/get/delete.
- [ ] Testar retorno `null` para chave inexistente.
- [ ] Adicionar teste cobrindo `Criar `settingsRepository`` em arquivo de teste da sprint.
- [ ] Cobrir pelo menos: Métodos: `getSetting()`, `setSetting()`, `deleteSetting()`.
- [ ] Executar `npm test` com a suíte atualizada.
- [ ] Executar `npm run lint` sem erros novos.

## Testes da sprint

- [ ] Testes de CRUD de contas.
- [ ] Testes de CRUD de categorias.
- [ ] Testes de CRUD de transações.
- [ ] Teste impedindo excluir conta com transações.
- [ ] Teste impedindo excluir categoria com transações.
- [ ] Teste de leitura mensal de transações.
- [ ] `npm test` passa.
- [ ] `npm run lint` passa.

## Checklist final

- [ ] App abre sem tela branca.
- [ ] `npm test` passa com os testes adicionados na sprint.
- [ ] `npm run lint` passa sem erros.
- [ ] Não há chamada de rede para dados financeiros.
- [ ] Não há dependência proibida adicionada.
- [ ] `docs/sprint-03/PROGRESS.md` descreve o que foi entregue.
