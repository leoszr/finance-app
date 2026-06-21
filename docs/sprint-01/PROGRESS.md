# Progresso — Sprint 01 — Banco local SQLite e migrations

## Resumo

- Status geral: concluído
- Branch: `feature/sprint-01-local-database`
- Commit final sugerido: `feat(db): add local sqlite schema and migrations`

## Entregue nesta sprint

- Dependências locais adicionadas: `expo-sqlite` e `drizzle-orm`.
- Camada `src/db` criada com client SQLite/Drizzle, schema tipado e migration inicial.
- Tabelas locais criadas por migration: `accounts`, `categories`, `transactions`, `settings`; índices para consultas de transações.
- Inicialização do banco conectada em `app/_layout.tsx` com erro controlado.
- Testes da sprint adicionados em `src/tests/db/`.

## Progresso por task

### T0101 — Instalar SQLite e Drizzle

- Status: done
- Feature: SQLite e Drizzle

#### Desenvolvido

- `expo-sqlite` e `drizzle-orm` instalados.
- `src/db/client.ts` criado com `openDatabaseSync` e `drizzle`.

#### Evidências

- Arquivos: `package.json`, `package-lock.json`, `src/db/client.ts`.
- Teste: `src/tests/db/schema.test.ts` cobre dependências instaladas.

#### Pendências

- Nenhuma.

### T0102 — Criar schema de contas

- Status: done
- Feature: Schema de contas

#### Desenvolvido

- Tabela `accounts` com `id`, `name`, `type`, `currency`, `initial_balance_cents`, `created_at`, `updated_at`.
- `currency` padrão `BRL`; dinheiro em centavos inteiros.

#### Evidências

- Arquivos: `src/db/schema.ts`, `src/db/migrations/0001_initial.ts`, `src/types/finance.ts`.
- Teste: `src/tests/db/schema.test.ts`.

#### Pendências

- Nenhuma.

### T0103 — Criar schema de categorias

- Status: done
- Feature: Schema de categorias

#### Desenvolvido

- Tabela `categories` com `id`, `name`, `type`, `color`, `icon`, `created_at`, `updated_at`.
- `type` limitado a `income` ou `expense` na migration.

#### Evidências

- Arquivos: `src/db/schema.ts`, `src/db/migrations/0001_initial.ts`.
- Teste: `src/tests/db/schema.test.ts`.

#### Pendências

- Nenhuma.

### T0104 — Criar schema de transações

- Status: done
- Feature: Schema de transações

#### Desenvolvido

- Tabela `transactions` com FKs para `accounts` e `categories`.
- `amount_cents` obrigatório e inteiro; `type` limitado a `income` ou `expense`.

#### Evidências

- Arquivos: `src/db/schema.ts`, `src/db/migrations/0001_initial.ts`.
- Teste: `src/tests/db/schema.test.ts`.

#### Pendências

- Nenhuma.

### T0105 — Criar schema de configurações

- Status: done
- Feature: Schema de configurações

#### Desenvolvido

- Tabela `settings` com chave única e valor string.

#### Evidências

- Arquivos: `src/db/schema.ts`, `src/db/migrations/0001_initial.ts`.
- Teste: `src/tests/db/schema.test.ts`.

#### Pendências

- Nenhuma.

### T0106 — Criar inicialização do banco

- Status: done
- Feature: Inicialização do banco

#### Desenvolvido

- `applyMigrations` e `initDatabase` criados.
- `app/_layout.tsx` chama inicialização ao abrir app e só renderiza rotas após o banco estar pronto.
- Falha retorna erro controlado e renderiza mensagem, sem tela branca.

#### Evidências

- Arquivos: `src/db/initDatabase.ts`, `app/_layout.tsx`, `src/db/migrations/0001_initial.ts`.
- Teste: `src/tests/db/initDatabase.test.ts`.

#### Pendências

- Nenhuma.

## Testes executados

- `npm install` — executado; dependências instaladas.
- `npm test` — passou: 4 suites, 14 testes.
- `npm run lint` — passou sem warnings.
- `npm run typecheck` — passou.

## Decisões técnicas

- Migration inicial mantida em SQL explícito para aplicação simples via `expo-sqlite`; `PRAGMA foreign_keys` roda antes da transação e DDL roda em transação.
- Drizzle usado para schema tipado e client local; SQLite abre de forma lazy para erro controlado.
- Valores monetários modelados em campos `*_cents` como `INTEGER`.

## Problemas / riscos encontrados

- `npm install` reportou 36 vulnerabilidades moderadas em dependências transitivas existentes; não alterado por estar fora do escopo da sprint.

## Próximo passo

- Revisar diff e fazer commit sugerido: `feat(db): add local sqlite schema and migrations`.
