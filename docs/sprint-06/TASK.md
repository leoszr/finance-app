# Sprint 06 — CRUD de transações

## Objetivo

Permitir registrar, editar e excluir receitas e despesas.

## Entrega da sprint

- Branch: `feature/sprint-06-transactions-crud`
- Commit final sugerido: `feat(transactions): add income and expense crud`
- Fase do plano: `Fase 6 — Gestão financeira básica`
- Resultado deve ser pequeno, revisável e testável.

## Regras da sprint

- [ ] Criar uma feature branch para a sprint.
- [ ] Manter as alterações coesas ao objetivo da sprint.
- [ ] Atualizar ou criar testes junto com a implementação.
- [ ] Executar `npm test` e `npm run lint` antes do commit final.
- [ ] Não adicionar backend, Supabase, PostgreSQL, Java backend, API externa, IA ou sync automático.
- [ ] Atualizar `docs/sprint-06/PROGRESS.md` com evidências reais.

## Tasks

### T0601 — Criar tela de listagem de transações

- Status: todo
- Feature: Tela de listagem de transações
- Plano: `PLAN.md` > `Fase 6 — Gestão financeira básica`
- Dependências: T0506

#### Requisitos funcionais

- [ ] Mostrar transações recentes.
- [ ] Lista transações ordenadas por data.
- [ ] Mostra descrição, categoria, conta, data e valor.
- [ ] Receitas e despesas visualmente distinguíveis.
- [ ] Estado vazio quando não há transações.

#### Requisitos técnicos

- [ ] Persistir transações via repositório local.
- [ ] Validar tipo, categoria, conta, data e valor antes de salvar.
- [ ] Manter receitas e despesas visualmente distinguíveis.

#### Arquivos prováveis

- `src/features/transactions/`
- `src/hooks/useTransactions.ts`
- `src/features/transactions/TransactionListScreen.tsx`
- `src/features/transactions/TransactionFormScreen.tsx`
- `src/tests/features/transactions/`

#### Passos sugeridos

1. Ler os arquivos prováveis e confirmar a estrutura existente.
2. Implementar somente o necessário para a feature desta task.
3. Adicionar ou atualizar testes específicos da task.
4. Rodar testes e lint.
5. Registrar evidências em `docs/sprint-06/PROGRESS.md`.

#### Critérios de aceite

- [ ] Lista transações ordenadas por data.
- [ ] Mostra descrição, categoria, conta, data e valor.
- [ ] Receitas e despesas visualmente distinguíveis.
- [ ] Estado vazio quando não há transações.

#### Testes e verificação

- [ ] Adicionar teste cobrindo `Criar tela de listagem de transações` em arquivo de teste da sprint.
- [ ] Cobrir pelo menos: Lista transações ordenadas por data.
- [ ] Executar `npm test` com a suíte atualizada.
- [ ] Executar `npm run lint` sem erros novos.

### T0602 — Criar formulário de nova transação

- Status: todo
- Feature: Formulário de nova transação
- Plano: `PLAN.md` > `Fase 6 — Gestão financeira básica`
- Dependências: T0601

#### Requisitos funcionais

- [ ] Permitir inserir receita ou despesa.
- [ ] Usuário escolhe tipo.
- [ ] Usuário informa valor.
- [ ] Usuário escolhe conta.
- [ ] Usuário escolhe categoria compatível com o tipo.
- [ ] Usuário informa data.
- [ ] Descrição opcional.
- [ ] Salva no SQLite.

#### Requisitos técnicos

- [ ] Persistir transações via repositório local.
- [ ] Validar tipo, categoria, conta, data e valor antes de salvar.
- [ ] Manter receitas e despesas visualmente distinguíveis.
- [ ] Separar estado do formulário, validação e chamada ao repositório.

#### Arquivos prováveis

- `src/features/transactions/`
- `src/hooks/useTransactions.ts`
- `src/features/transactions/TransactionListScreen.tsx`
- `src/features/transactions/TransactionFormScreen.tsx`
- `src/tests/features/transactions/`

#### Passos sugeridos

1. Ler os arquivos prováveis e confirmar a estrutura existente.
2. Implementar somente o necessário para a feature desta task.
3. Adicionar ou atualizar testes específicos da task.
4. Rodar testes e lint.
5. Registrar evidências em `docs/sprint-06/PROGRESS.md`.

#### Critérios de aceite

- [ ] Usuário escolhe tipo.
- [ ] Usuário informa valor.
- [ ] Usuário escolhe conta.
- [ ] Usuário escolhe categoria compatível com o tipo.
- [ ] Usuário informa data.
- [ ] Descrição opcional.
- [ ] Salva no SQLite.

#### Testes e verificação

- [ ] Adicionar teste cobrindo `Criar formulário de nova transação` em arquivo de teste da sprint.
- [ ] Cobrir pelo menos: Usuário escolhe tipo.
- [ ] Executar `npm test` com a suíte atualizada.
- [ ] Executar `npm run lint` sem erros novos.

### T0603 — Criar edição de transação

- Status: todo
- Feature: Edição de transação
- Plano: `PLAN.md` > `Fase 6 — Gestão financeira básica`
- Dependências: T0602

#### Requisitos funcionais

- [ ] Permitir alterar transação existente.
- [ ] Formulário carrega dados existentes.
- [ ] Usuário altera campos.
- [ ] Alteração persiste no SQLite.
- [ ] Lista reflete atualização.

#### Requisitos técnicos

- [ ] Persistir transações via repositório local.
- [ ] Validar tipo, categoria, conta, data e valor antes de salvar.
- [ ] Manter receitas e despesas visualmente distinguíveis.

#### Arquivos prováveis

- `src/features/transactions/`
- `src/hooks/useTransactions.ts`
- `src/features/transactions/TransactionListScreen.tsx`
- `src/features/transactions/TransactionFormScreen.tsx`
- `src/tests/features/transactions/`

#### Passos sugeridos

1. Ler os arquivos prováveis e confirmar a estrutura existente.
2. Implementar somente o necessário para a feature desta task.
3. Adicionar ou atualizar testes específicos da task.
4. Rodar testes e lint.
5. Registrar evidências em `docs/sprint-06/PROGRESS.md`.

#### Critérios de aceite

- [ ] Formulário carrega dados existentes.
- [ ] Usuário altera campos.
- [ ] Alteração persiste no SQLite.
- [ ] Lista reflete atualização.

#### Testes e verificação

- [ ] Adicionar teste cobrindo `Criar edição de transação` em arquivo de teste da sprint.
- [ ] Cobrir pelo menos: Formulário carrega dados existentes.
- [ ] Executar `npm test` com a suíte atualizada.
- [ ] Executar `npm run lint` sem erros novos.

### T0604 — Criar exclusão de transação

- Status: todo
- Feature: Exclusão de transação
- Plano: `PLAN.md` > `Fase 6 — Gestão financeira básica`
- Dependências: T0603

#### Requisitos funcionais

- [ ] Permitir remover transação.
- [ ] Usuário confirma exclusão.
- [ ] Transação removida do SQLite.
- [ ] Lista atualiza após exclusão.

#### Requisitos técnicos

- [ ] Persistir transações via repositório local.
- [ ] Validar tipo, categoria, conta, data e valor antes de salvar.
- [ ] Manter receitas e despesas visualmente distinguíveis.
- [ ] Pedir confirmação quando houver remoção de dados.

#### Arquivos prováveis

- `src/features/transactions/`
- `src/hooks/useTransactions.ts`
- `src/features/transactions/TransactionListScreen.tsx`
- `src/features/transactions/TransactionFormScreen.tsx`
- `src/tests/features/transactions/`

#### Passos sugeridos

1. Ler os arquivos prováveis e confirmar a estrutura existente.
2. Implementar somente o necessário para a feature desta task.
3. Adicionar ou atualizar testes específicos da task.
4. Rodar testes e lint.
5. Registrar evidências em `docs/sprint-06/PROGRESS.md`.

#### Critérios de aceite

- [ ] Usuário confirma exclusão.
- [ ] Transação removida do SQLite.
- [ ] Lista atualiza após exclusão.

#### Testes e verificação

- [ ] Adicionar teste cobrindo `Criar exclusão de transação` em arquivo de teste da sprint.
- [ ] Cobrir pelo menos: Usuário confirma exclusão.
- [ ] Executar `npm test` com a suíte atualizada.
- [ ] Executar `npm run lint` sem erros novos.

### T0605 — Criar validação cruzada de tipo e categoria

- Status: todo
- Feature: Validação cruzada de tipo e categoria
- Plano: `PLAN.md` > `Fase 6 — Gestão financeira básica`
- Dependências: T0604

#### Requisitos funcionais

- [ ] Impedir inconsistências.
- [ ] Despesa só aceita categoria de despesa.
- [ ] Receita só aceita categoria de receita.
- [ ] Troca de tipo limpa categoria incompatível.
- [ ] Tentativa inválida bloqueada.

#### Requisitos técnicos

- [ ] Persistir transações via repositório local.
- [ ] Validar tipo, categoria, conta, data e valor antes de salvar.
- [ ] Manter receitas e despesas visualmente distinguíveis.

#### Arquivos prováveis

- `src/features/categories/`
- `src/hooks/useCategories.ts`
- `src/features/transactions/`
- `src/hooks/useTransactions.ts`

#### Passos sugeridos

1. Ler os arquivos prováveis e confirmar a estrutura existente.
2. Implementar somente o necessário para a feature desta task.
3. Adicionar ou atualizar testes específicos da task.
4. Rodar testes e lint.
5. Registrar evidências em `docs/sprint-06/PROGRESS.md`.

#### Critérios de aceite

- [ ] Despesa só aceita categoria de despesa.
- [ ] Receita só aceita categoria de receita.
- [ ] Troca de tipo limpa categoria incompatível.
- [ ] Tentativa inválida bloqueada.

#### Testes e verificação

- [ ] Adicionar teste cobrindo `Criar validação cruzada de tipo e categoria` em arquivo de teste da
  sprint.
- [ ] Cobrir pelo menos: Despesa só aceita categoria de despesa.
- [ ] Executar `npm test` com a suíte atualizada.
- [ ] Executar `npm run lint` sem erros novos.

## Testes da sprint

- [ ] Teste de criação de receita.
- [ ] Teste de criação de despesa.
- [ ] Teste de edição.
- [ ] Teste de exclusão.
- [ ] Teste de categoria incompatível.
- [ ] Teste de persistência após recarregar dados.
- [ ] `npm test` passa.
- [ ] `npm run lint` passa.

## Checklist final

- [ ] App abre sem tela branca.
- [ ] `npm test` passa com os testes adicionados na sprint.
- [ ] `npm run lint` passa sem erros.
- [ ] Não há chamada de rede para dados financeiros.
- [ ] Não há dependência proibida adicionada.
- [ ] `docs/sprint-06/PROGRESS.md` descreve o que foi entregue.
