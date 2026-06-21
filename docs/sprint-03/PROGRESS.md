# Progresso — Sprint 03 — Repositórios locais

## Resumo

- Status geral: concluído
- Branch: `feature/sprint-03-local-repositories`
- Commit final sugerido: `feat(db): add local repositories for finance entities`

## Entregue nesta sprint

- Repositórios locais para contas, categorias, transações e configurações.
- Acesso SQLite centralizado em `src/db/repositories/`.
- Testes unitários de CRUD, links obrigatórios, compatibilidade tipo/categoria e regras de integridade com fake database.

## Progresso por task

### T0301 — Criar `accountsRepository`

- Status: done
- Feature: `accountsRepository`

#### Desenvolvido

- `createAccount()`, `getAccounts()`, `getAccountById()`, `updateAccount()`, `deleteAccount()`.
- Delete bloqueado quando há transações associadas; ID inexistente retorna erro controlado.

#### Evidências

- Arquivos: `src/db/repositories/accountsRepository.ts`, `src/tests/repositories/accountsRepository.test.ts`.
- Testes cobrem CRUD e bloqueio de delete.

#### Pendências

- Nenhuma.

### T0302 — Criar `categoriesRepository`

- Status: done
- Feature: `categoriesRepository`

#### Desenvolvido

- `createCategory()`, `getCategories()`, `getCategoriesByType()`, `updateCategory()`, `deleteCategory()`.
- Delete bloqueado quando há transações associadas; ID inexistente retorna erro controlado.

#### Evidências

- Arquivos: `src/db/repositories/categoriesRepository.ts`, `src/tests/repositories/categoriesRepository.test.ts`.
- Testes cobrem listagem por tipo, update, delete e bloqueio.

#### Pendências

- Nenhuma.

### T0303 — Criar `transactionsRepository`

- Status: done
- Feature: `transactionsRepository`

#### Desenvolvido

- `createTransaction()`, `getTransactions()`, `getTransactionsByMonth()`, `getTransactionById()`, `updateTransaction()`, `deleteTransaction()`.
- Leitura mensal usa `getMonthRange()` validado; create/update validam existência de conta/categoria e tipo compatível.

#### Evidências

- Arquivos: `src/db/repositories/transactionsRepository.ts`, `src/tests/repositories/transactionsRepository.test.ts`.
- Testes cobrem criação de receita/despesa, listagem mensal, update e delete.

#### Pendências

- Nenhuma.

### T0304 — Criar `settingsRepository`

- Status: done
- Feature: `settingsRepository`

#### Desenvolvido

- `getSetting()`, `setSetting()`, `deleteSetting()`.
- `setSetting()` cria ou atualiza via upsert.
- Chave inexistente retorna `null`; chave vazia é rejeitada.

#### Evidências

- Arquivos: `src/db/repositories/settingsRepository.ts`, `src/tests/repositories/settingsRepository.test.ts`.
- Testes cobrem set/get/update/delete e retorno `null`.

#### Pendências

- Nenhuma.

## Testes executados

- `npm test` — passou: 13 suites, 44 testes.
- `npm run lint` — passou sem warnings.
- `npm run typecheck` — passou.

## Decisões técnicas

- Repositórios recebem `RepositoryDatabase` injetável para testes sem tocar SQLite nativo no Jest.
- Singleton de repositório não é criado no import para evitar abrir SQLite fora do fluxo controlado.
- Regras de integridade de delete e links de transação são checadas no repositório antes da escrita.

## Problemas / riscos encontrados

- Branch criada a partir da sprint anterior; consolidar/mergear sprints anteriores antes do PR final se necessário.

## Próximo passo

- Revisar diff e fazer commit sugerido: `feat(db): add local repositories for finance entities`.
