# Sprint 01 — Banco local SQLite e migrations

## Objetivo

Adicionar persistência local com SQLite e criar o schema inicial.

## Entrega da sprint

- Branch: `feature/sprint-01-local-database`
- Commit final sugerido: `feat(db): add local sqlite schema and migrations`
- Fase do plano: `Fase 2 — Persistência local`
- Resultado deve ser pequeno, revisável e testável.

## Regras da sprint

- [ ] Criar uma feature branch para a sprint.
- [ ] Manter as alterações coesas ao objetivo da sprint.
- [ ] Atualizar ou criar testes junto com a implementação.
- [ ] Executar `npm test` e `npm run lint` antes do commit final.
- [ ] Não adicionar backend, Supabase, PostgreSQL, Java backend, API externa, IA ou sync automático.
- [ ] Atualizar `docs/sprint-01/PROGRESS.md` com evidências reais.

## Tasks

### T0101 — Instalar SQLite e Drizzle

- Status: todo
- Feature: SQLite e Drizzle
- Plano: `PLAN.md` > `Fase 2 — Persistência local`
- Dependências: T0005

#### Requisitos funcionais

- [ ] Adicionar camada local de banco.
- [ ] `expo-sqlite` instalado.
- [ ] `drizzle-orm` instalado.
- [ ] App compila sem erro.
- [ ] Nenhuma configuração de backend adicionada.

#### Requisitos técnicos

- [ ] Usar SQLite local via Expo.
- [ ] Usar Drizzle para schema e queries tipadas.
- [ ] Guardar dinheiro somente como inteiro em centavos.

#### Arquivos prováveis

- `package.json`
- `app.json`
- `src/db/client.ts`
- `src/db/schema.ts`

#### Passos sugeridos

1. Ler os arquivos prováveis e confirmar a estrutura existente.
2. Implementar somente o necessário para a feature desta task.
3. Adicionar ou atualizar testes específicos da task.
4. Rodar testes e lint.
5. Registrar evidências em `docs/sprint-01/PROGRESS.md`.

#### Critérios de aceite

- [ ] `expo-sqlite` instalado.
- [ ] `drizzle-orm` instalado.
- [ ] App compila sem erro.
- [ ] Nenhuma configuração de backend adicionada.

#### Testes e verificação

- [ ] Executar `npm install`.
- [ ] Importar `expo-sqlite` e `drizzle-orm` em teste smoke.
- [ ] Adicionar teste cobrindo `Instalar SQLite e Drizzle` em arquivo de teste da sprint.
- [ ] Cobrir pelo menos: `expo-sqlite` instalado.
- [ ] Executar `npm test` com a suíte atualizada.
- [ ] Executar `npm run lint` sem erros novos.

### T0102 — Criar schema de contas

- Status: todo
- Feature: Schema de contas
- Plano: `PLAN.md` > `Fase 2 — Persistência local`
- Dependências: T0101

#### Requisitos funcionais

- [ ] Criar tabela `accounts`.
- [ ] Campos mínimos: `id`, `name`, `type`, `currency`, `initial_balance_cents`, `created_at`,
  `updated_at`.
- [ ] `name` obrigatório.
- [ ] `currency` padrão `BRL`.
- [ ] Valores monetários usam inteiro.

#### Requisitos técnicos

- [ ] Usar SQLite local via Expo.
- [ ] Usar Drizzle para schema e queries tipadas.
- [ ] Guardar dinheiro somente como inteiro em centavos.

#### Arquivos prováveis

- `src/db/schema.ts`
- `src/types/finance.ts`
- `src/tests/db/accountsSchema.test.ts`
- `src/features/accounts/`
- `src/hooks/useAccounts.ts`
- `src/db/client.ts`

#### Passos sugeridos

1. Ler os arquivos prováveis e confirmar a estrutura existente.
2. Implementar somente o necessário para a feature desta task.
3. Adicionar ou atualizar testes específicos da task.
4. Rodar testes e lint.
5. Registrar evidências em `docs/sprint-01/PROGRESS.md`.

#### Critérios de aceite

- [ ] Campos mínimos: `id`, `name`, `type`, `currency`, `initial_balance_cents`, `created_at`,
  `updated_at`.
- [ ] `name` obrigatório.
- [ ] `currency` padrão `BRL`.
- [ ] Valores monetários usam inteiro.

#### Testes e verificação

- [ ] Testar `accounts.initial_balance_cents` como inteiro.
- [ ] Testar `currency` padrão `BRL`.
- [ ] Adicionar teste cobrindo `Criar schema de contas` em arquivo de teste da sprint.
- [ ] Cobrir pelo menos: Campos mínimos: `id`, `name`, `type`, `currency`, `initial_balance_cents`,
  `created_at`, `updated_at`.
- [ ] Executar `npm test` com a suíte atualizada.
- [ ] Executar `npm run lint` sem erros novos.

### T0103 — Criar schema de categorias

- Status: todo
- Feature: Schema de categorias
- Plano: `PLAN.md` > `Fase 2 — Persistência local`
- Dependências: T0102

#### Requisitos funcionais

- [ ] Criar tabela `categories`.
- [ ] Campos mínimos: `id`, `name`, `type`, `color`, `icon`, `created_at`, `updated_at`.
- [ ] `type` aceita `income` ou `expense`.
- [ ] `name` obrigatório.
- [ ] Sem categorias padrão obrigatórias.

#### Requisitos técnicos

- [ ] Usar SQLite local via Expo.
- [ ] Usar Drizzle para schema e queries tipadas.
- [ ] Guardar dinheiro somente como inteiro em centavos.

#### Arquivos prováveis

- `src/db/schema.ts`
- `src/tests/db/categoriesSchema.test.ts`
- `src/features/categories/`
- `src/hooks/useCategories.ts`
- `src/db/client.ts`

#### Passos sugeridos

1. Ler os arquivos prováveis e confirmar a estrutura existente.
2. Implementar somente o necessário para a feature desta task.
3. Adicionar ou atualizar testes específicos da task.
4. Rodar testes e lint.
5. Registrar evidências em `docs/sprint-01/PROGRESS.md`.

#### Critérios de aceite

- [ ] Campos mínimos: `id`, `name`, `type`, `color`, `icon`, `created_at`, `updated_at`.
- [ ] `type` aceita `income` ou `expense`.
- [ ] `name` obrigatório.
- [ ] Sem categorias padrão obrigatórias.

#### Testes e verificação

- [ ] Testar tipos `income` e `expense`.
- [ ] Testar `name` obrigatório.
- [ ] Adicionar teste cobrindo `Criar schema de categorias` em arquivo de teste da sprint.
- [ ] Cobrir pelo menos: Campos mínimos: `id`, `name`, `type`, `color`, `icon`, `created_at`,
  `updated_at`.
- [ ] Executar `npm test` com a suíte atualizada.
- [ ] Executar `npm run lint` sem erros novos.

### T0104 — Criar schema de transações

- Status: todo
- Feature: Schema de transações
- Plano: `PLAN.md` > `Fase 2 — Persistência local`
- Dependências: T0103

#### Requisitos funcionais

- [ ] Criar tabela `transactions`.
- [ ] Campos mínimos: `id`, `account_id`, `category_id`, `type`, `amount_cents`, `description`,
  `transaction_date`, `created_at`, `updated_at`.
- [ ] `type` aceita `income` ou `expense`.
- [ ] `amount_cents` obrigatório.
- [ ] `account_id` referencia `accounts`.
- [ ] `category_id` referencia `categories`.

#### Requisitos técnicos

- [ ] Usar SQLite local via Expo.
- [ ] Usar Drizzle para schema e queries tipadas.
- [ ] Guardar dinheiro somente como inteiro em centavos.

#### Arquivos prováveis

- `src/db/schema.ts`
- `src/tests/db/transactionsSchema.test.ts`
- `src/features/transactions/`
- `src/hooks/useTransactions.ts`
- `src/db/client.ts`

#### Passos sugeridos

1. Ler os arquivos prováveis e confirmar a estrutura existente.
2. Implementar somente o necessário para a feature desta task.
3. Adicionar ou atualizar testes específicos da task.
4. Rodar testes e lint.
5. Registrar evidências em `docs/sprint-01/PROGRESS.md`.

#### Critérios de aceite

- [ ] Campos mínimos: `id`, `account_id`, `category_id`, `type`, `amount_cents`, `description`,
  `transaction_date`, `created_at`, `updated_at`.
- [ ] `type` aceita `income` ou `expense`.
- [ ] `amount_cents` obrigatório.
- [ ] `account_id` referencia `accounts`.
- [ ] `category_id` referencia `categories`.

#### Testes e verificação

- [ ] Testar FKs de conta e categoria.
- [ ] Testar `amount_cents` obrigatório e inteiro.
- [ ] Adicionar teste cobrindo `Criar schema de transações` em arquivo de teste da sprint.
- [ ] Cobrir pelo menos: Campos mínimos: `id`, `account_id`, `category_id`, `type`, `amount_cents`,
  `description`, `transaction_date`, `created_at`, `updated_at`.
- [ ] Executar `npm test` com a suíte atualizada.
- [ ] Executar `npm run lint` sem erros novos.

### T0105 — Criar schema de configurações

- Status: todo
- Feature: Schema de configurações
- Plano: `PLAN.md` > `Fase 2 — Persistência local`
- Dependências: T0104

#### Requisitos funcionais

- [ ] Permitir configurações locais futuras.
- [ ] Tabela `settings` criada.
- [ ] Chave única por configuração.
- [ ] Valores armazenados como string.

#### Requisitos técnicos

- [ ] Usar SQLite local via Expo.
- [ ] Usar Drizzle para schema e queries tipadas.
- [ ] Guardar dinheiro somente como inteiro em centavos.

#### Arquivos prováveis

- `src/db/schema.ts`
- `src/tests/db/settingsSchema.test.ts`
- `src/features/settings/`
- `src/hooks/useSettings.ts`
- `src/db/client.ts`

#### Passos sugeridos

1. Ler os arquivos prováveis e confirmar a estrutura existente.
2. Implementar somente o necessário para a feature desta task.
3. Adicionar ou atualizar testes específicos da task.
4. Rodar testes e lint.
5. Registrar evidências em `docs/sprint-01/PROGRESS.md`.

#### Critérios de aceite

- [ ] Tabela `settings` criada.
- [ ] Chave única por configuração.
- [ ] Valores armazenados como string.

#### Testes e verificação

- [ ] Testar chave única.
- [ ] Testar leitura de valor string.
- [ ] Adicionar teste cobrindo `Criar schema de configurações` em arquivo de teste da sprint.
- [ ] Cobrir pelo menos: Tabela `settings` criada.
- [ ] Executar `npm test` com a suíte atualizada.
- [ ] Executar `npm run lint` sem erros novos.

### T0106 — Criar inicialização do banco

- Status: todo
- Feature: Inicialização do banco
- Plano: `PLAN.md` > `Fase 2 — Persistência local`
- Dependências: T0101, T0102, T0103, T0104, T0105

#### Requisitos funcionais

- [ ] Garantir inicialização do banco ao abrir o app.
- [ ] Banco inicializa na abertura do app.
- [ ] Migrations aplicadas.
- [ ] Falha de inicialização mostra erro controlado.
- [ ] App não quebra em tela branca.

#### Requisitos técnicos

- [ ] Usar SQLite local via Expo.
- [ ] Usar Drizzle para schema e queries tipadas.
- [ ] Guardar dinheiro somente como inteiro em centavos.

#### Arquivos prováveis

- `src/db/initDatabase.ts`
- `src/db/migrations/`
- `app/_layout.tsx`
- `src/tests/db/initDatabase.test.ts`
- `src/db/schema.ts`
- `src/db/client.ts`

#### Passos sugeridos

1. Ler os arquivos prováveis e confirmar a estrutura existente.
2. Implementar somente o necessário para a feature desta task.
3. Adicionar ou atualizar testes específicos da task.
4. Rodar testes e lint.
5. Registrar evidências em `docs/sprint-01/PROGRESS.md`.

#### Critérios de aceite

- [ ] Banco inicializa na abertura do app.
- [ ] Migrations aplicadas.
- [ ] Falha de inicialização mostra erro controlado.
- [ ] App não quebra em tela branca.

#### Testes e verificação

- [ ] Inicializar banco vazio e aplicar migrations.
- [ ] Simular falha e validar erro controlado.
- [ ] Adicionar teste cobrindo `Criar inicialização do banco` em arquivo de teste da sprint.
- [ ] Cobrir pelo menos: Banco inicializa na abertura do app.
- [ ] Executar `npm test` com a suíte atualizada.
- [ ] Executar `npm run lint` sem erros novos.

## Testes da sprint

- [ ] Teste de criação do schema.
- [ ] Teste de inicialização do banco.
- [ ] Teste de inserção e leitura básica.
- [ ] Teste garantindo que valores monetários são inteiros.
- [ ] `npm test` passa.
- [ ] `npm run lint` passa.

## Checklist final

- [ ] App abre sem tela branca.
- [ ] `npm test` passa com os testes adicionados na sprint.
- [ ] `npm run lint` passa sem erros.
- [ ] Não há chamada de rede para dados financeiros.
- [ ] Não há dependência proibida adicionada.
- [ ] `docs/sprint-01/PROGRESS.md` descreve o que foi entregue.
