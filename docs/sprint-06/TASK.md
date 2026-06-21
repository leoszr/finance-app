# Sprint 06 — CRUD de transações

## Objetivo

Permitir registrar, editar e excluir receitas e despesas.

## Entrega da sprint

- Branch: `feature/sprint-06-transactions-crud`
- Commit final sugerido: `feat(transactions): add income and expense crud`
- Fase do plano: `Fase 6 — Gestão financeira básica`
- Resultado deve ser pequeno, revisável e testável.

## Regras da sprint

- [x] Criar uma feature branch para a sprint.
- [x] Manter as alterações coesas ao objetivo da sprint.
- [x] Atualizar ou criar testes junto com a implementação.
- [x] Executar `npm test` e `npm run lint` antes do commit final.
- [x] Não adicionar backend, Supabase, PostgreSQL, Java backend, API externa, IA ou sync automático.
- [x] Atualizar `docs/sprint-06/PROGRESS.md` com evidências reais.

## Tasks

### T0601 — Criar tela de listagem de transações

- Status: done
- Feature: Tela de listagem de transações
- Plano: `PLAN.md` > `Fase 6 — Gestão financeira básica`
- Dependências: T0506

#### Requisitos funcionais

- [ ] Mostrar transações recentes.
- [x] Lista transações ordenadas por data.
- [x] Mostra descrição, categoria, conta, data e valor.
- [x] Receitas e despesas visualmente distinguíveis.
- [x] Estado vazio quando não há transações.

#### Requisitos técnicos

- [x] Persistir transações via repositório local.
- [x] Validar tipo, categoria, conta, data e valor antes de salvar.
- [x] Manter receitas e despesas visualmente distinguíveis.

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

- [x] Lista transações ordenadas por data.
- [x] Mostra descrição, categoria, conta, data e valor.
- [x] Receitas e despesas visualmente distinguíveis.
- [x] Estado vazio quando não há transações.

#### Testes e verificação

- [x] Adicionar teste cobrindo `Criar tela de listagem de transações` em arquivo de teste da sprint.
- [x] Cobrir pelo menos: Lista transações ordenadas por data.
- [x] Executar `npm test` com a suíte atualizada.
- [x] Executar `npm run lint` sem erros novos.

### T0602 — Criar formulário de nova transação

- Status: done
- Feature: Formulário de nova transação
- Plano: `PLAN.md` > `Fase 6 — Gestão financeira básica`
- Dependências: T0601

#### Requisitos funcionais

- [ ] Permitir inserir receita ou despesa.
- [x] Usuário escolhe tipo.
- [x] Usuário informa valor.
- [x] Usuário escolhe conta.
- [x] Usuário escolhe categoria compatível com o tipo.
- [x] Usuário informa data.
- [x] Descrição opcional.
- [x] Salva no SQLite.

#### Requisitos técnicos

- [x] Persistir transações via repositório local.
- [x] Validar tipo, categoria, conta, data e valor antes de salvar.
- [x] Manter receitas e despesas visualmente distinguíveis.
- [x] Separar estado do formulário, validação e chamada ao repositório.

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

- [x] Usuário escolhe tipo.
- [x] Usuário informa valor.
- [x] Usuário escolhe conta.
- [x] Usuário escolhe categoria compatível com o tipo.
- [x] Usuário informa data.
- [x] Descrição opcional.
- [x] Salva no SQLite.

#### Testes e verificação

- [x] Adicionar teste cobrindo `Criar formulário de nova transação` em arquivo de teste da sprint.
- [x] Cobrir pelo menos: Usuário escolhe tipo.
- [x] Executar `npm test` com a suíte atualizada.
- [x] Executar `npm run lint` sem erros novos.

### T0603 — Criar edição de transação

- Status: done
- Feature: Edição de transação
- Plano: `PLAN.md` > `Fase 6 — Gestão financeira básica`
- Dependências: T0602

#### Requisitos funcionais

- [ ] Permitir alterar transação existente.
- [x] Formulário carrega dados existentes.
- [x] Usuário altera campos.
- [x] Alteração persiste no SQLite.
- [x] Lista reflete atualização.

#### Requisitos técnicos

- [x] Persistir transações via repositório local.
- [x] Validar tipo, categoria, conta, data e valor antes de salvar.
- [x] Manter receitas e despesas visualmente distinguíveis.

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

- [x] Formulário carrega dados existentes.
- [x] Usuário altera campos.
- [x] Alteração persiste no SQLite.
- [x] Lista reflete atualização.

#### Testes e verificação

- [x] Adicionar teste cobrindo `Criar edição de transação` em arquivo de teste da sprint.
- [x] Cobrir pelo menos: Formulário carrega dados existentes.
- [x] Executar `npm test` com a suíte atualizada.
- [x] Executar `npm run lint` sem erros novos.

### T0604 — Criar exclusão de transação

- Status: done
- Feature: Exclusão de transação
- Plano: `PLAN.md` > `Fase 6 — Gestão financeira básica`
- Dependências: T0603

#### Requisitos funcionais

- [ ] Permitir remover transação.
- [x] Usuário confirma exclusão.
- [x] Transação removida do SQLite.
- [x] Lista atualiza após exclusão.

#### Requisitos técnicos

- [x] Persistir transações via repositório local.
- [x] Validar tipo, categoria, conta, data e valor antes de salvar.
- [x] Manter receitas e despesas visualmente distinguíveis.
- [x] Pedir confirmação quando houver remoção de dados.

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

- [x] Usuário confirma exclusão.
- [x] Transação removida do SQLite.
- [x] Lista atualiza após exclusão.

#### Testes e verificação

- [x] Adicionar teste cobrindo `Criar exclusão de transação` em arquivo de teste da sprint.
- [x] Cobrir pelo menos: Usuário confirma exclusão.
- [x] Executar `npm test` com a suíte atualizada.
- [x] Executar `npm run lint` sem erros novos.

### T0605 — Criar validação cruzada de tipo e categoria

- Status: done
- Feature: Validação cruzada de tipo e categoria
- Plano: `PLAN.md` > `Fase 6 — Gestão financeira básica`
- Dependências: T0604

#### Requisitos funcionais

- [ ] Impedir inconsistências.
- [x] Despesa só aceita categoria de despesa.
- [x] Receita só aceita categoria de receita.
- [x] Troca de tipo limpa categoria incompatível.
- [x] Tentativa inválida bloqueada.

#### Requisitos técnicos

- [x] Persistir transações via repositório local.
- [x] Validar tipo, categoria, conta, data e valor antes de salvar.
- [x] Manter receitas e despesas visualmente distinguíveis.

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

- [x] Despesa só aceita categoria de despesa.
- [x] Receita só aceita categoria de receita.
- [x] Troca de tipo limpa categoria incompatível.
- [x] Tentativa inválida bloqueada.

#### Testes e verificação

- [x] Adicionar teste cobrindo `Criar validação cruzada de tipo e categoria` em arquivo de teste da
  sprint.
- [x] Cobrir pelo menos: Despesa só aceita categoria de despesa.
- [x] Executar `npm test` com a suíte atualizada.
- [x] Executar `npm run lint` sem erros novos.

## Testes da sprint

- [x] Teste de criação de receita.
- [x] Teste de criação de despesa.
- [x] Teste de edição.
- [x] Teste de exclusão.
- [x] Teste de categoria incompatível.
- [x] Teste de persistência após recarregar dados.
- [x] `npm test` passa.
- [x] `npm run lint` passa.

## Checklist final

- [x] App abre sem tela branca.
- [x] `npm test` passa com os testes adicionados na sprint.
- [x] `npm run lint` passa sem erros.
- [x] Não há chamada de rede para dados financeiros.
- [x] Não há dependência proibida adicionada.
- [x] `docs/sprint-06/PROGRESS.md` descreve o que foi entregue.
