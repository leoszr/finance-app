# Sprint 05 — Cadastro de contas e categorias

## Objetivo

Permitir que o usuário configure a base financeira antes de registrar transações.

## Entrega da sprint

- Branch: `feature/sprint-05-accounts-categories`
- Commit final sugerido: `feat(finance): add accounts and categories management`
- Fase do plano: `Fase 6 — Gestão financeira básica`
- Resultado deve ser pequeno, revisável e testável.

## Regras da sprint

- [ ] Criar uma feature branch para a sprint.
- [ ] Manter as alterações coesas ao objetivo da sprint.
- [ ] Atualizar ou criar testes junto com a implementação.
- [ ] Executar `npm test` e `npm run lint` antes do commit final.
- [ ] Não adicionar backend, Supabase, PostgreSQL, Java backend, API externa, IA ou sync automático.
- [ ] Atualizar `docs/sprint-05/PROGRESS.md` com evidências reais.

## Tasks

### T0501 — Criar tela de listagem de contas

- Status: todo
- Feature: Tela de listagem de contas
- Plano: `PLAN.md` > `Fase 6 — Gestão financeira básica`
- Dependências: T0404

#### Requisitos funcionais

- [ ] Mostrar contas cadastradas.
- [ ] Lista todas as contas.
- [ ] Mostra nome, tipo e saldo inicial.
- [ ] Mostra estado vazio.
- [ ] Botão de adicionar conta visível.

#### Requisitos técnicos

- [ ] Usar repositórios locais para persistência.
- [ ] Mostrar erros de validação próximos aos campos.
- [ ] Bloquear exclusões que quebrem integridade financeira.

#### Arquivos prováveis

- `src/features/accounts/`
- `src/hooks/useAccounts.ts`
- `src/features/categories/`

#### Passos sugeridos

1. Ler os arquivos prováveis e confirmar a estrutura existente.
2. Implementar somente o necessário para a feature desta task.
3. Adicionar ou atualizar testes específicos da task.
4. Rodar testes e lint.
5. Registrar evidências em `docs/sprint-05/PROGRESS.md`.

#### Critérios de aceite

- [ ] Lista todas as contas.
- [ ] Mostra nome, tipo e saldo inicial.
- [ ] Mostra estado vazio.
- [ ] Botão de adicionar conta visível.

#### Testes e verificação

- [ ] Adicionar teste cobrindo `Criar tela de listagem de contas` em arquivo de teste da sprint.
- [ ] Cobrir pelo menos: Lista todas as contas.
- [ ] Executar `npm test` com a suíte atualizada.
- [ ] Executar `npm run lint` sem erros novos.

### T0502 — Criar formulário de conta

- Status: todo
- Feature: Formulário de conta
- Plano: `PLAN.md` > `Fase 6 — Gestão financeira básica`
- Dependências: T0501

#### Requisitos funcionais

- [ ] Criar e editar contas.
- [ ] Usuário informa nome.
- [ ] Usuário escolhe tipo.
- [ ] Usuário informa saldo inicial.
- [ ] Formulário salva no SQLite.
- [ ] Validações aparecem na tela.

#### Requisitos técnicos

- [ ] Usar repositórios locais para persistência.
- [ ] Mostrar erros de validação próximos aos campos.
- [ ] Bloquear exclusões que quebrem integridade financeira.
- [ ] Separar estado do formulário, validação e chamada ao repositório.

#### Arquivos prováveis

- `src/features/accounts/`
- `src/hooks/useAccounts.ts`
- `src/features/categories/`

#### Passos sugeridos

1. Ler os arquivos prováveis e confirmar a estrutura existente.
2. Implementar somente o necessário para a feature desta task.
3. Adicionar ou atualizar testes específicos da task.
4. Rodar testes e lint.
5. Registrar evidências em `docs/sprint-05/PROGRESS.md`.

#### Critérios de aceite

- [ ] Usuário informa nome.
- [ ] Usuário escolhe tipo.
- [ ] Usuário informa saldo inicial.
- [ ] Formulário salva no SQLite.
- [ ] Validações aparecem na tela.

#### Testes e verificação

- [ ] Adicionar teste cobrindo `Criar formulário de conta` em arquivo de teste da sprint.
- [ ] Cobrir pelo menos: Usuário informa nome.
- [ ] Executar `npm test` com a suíte atualizada.
- [ ] Executar `npm run lint` sem erros novos.

### T0503 — Criar exclusão de conta

- Status: todo
- Feature: Exclusão de conta
- Plano: `PLAN.md` > `Fase 6 — Gestão financeira básica`
- Dependências: T0502

#### Requisitos funcionais

- [ ] Permitir excluir contas sem transações.
- [ ] Usuário exclui conta sem transações.
- [ ] Usuário não exclui conta com transações.
- [ ] Mensagem explica bloqueio.

#### Requisitos técnicos

- [ ] Usar repositórios locais para persistência.
- [ ] Mostrar erros de validação próximos aos campos.
- [ ] Bloquear exclusões que quebrem integridade financeira.
- [ ] Pedir confirmação quando houver remoção de dados.

#### Arquivos prováveis

- `src/features/accounts/`
- `src/hooks/useAccounts.ts`
- `src/features/transactions/`
- `src/hooks/useTransactions.ts`
- `src/features/categories/`

#### Passos sugeridos

1. Ler os arquivos prováveis e confirmar a estrutura existente.
2. Implementar somente o necessário para a feature desta task.
3. Adicionar ou atualizar testes específicos da task.
4. Rodar testes e lint.
5. Registrar evidências em `docs/sprint-05/PROGRESS.md`.

#### Critérios de aceite

- [ ] Usuário exclui conta sem transações.
- [ ] Usuário não exclui conta com transações.
- [ ] Mensagem explica bloqueio.

#### Testes e verificação

- [ ] Adicionar teste cobrindo `Criar exclusão de conta` em arquivo de teste da sprint.
- [ ] Cobrir pelo menos: Usuário exclui conta sem transações.
- [ ] Executar `npm test` com a suíte atualizada.
- [ ] Executar `npm run lint` sem erros novos.

### T0504 — Criar tela de listagem de categorias

- Status: todo
- Feature: Tela de listagem de categorias
- Plano: `PLAN.md` > `Fase 6 — Gestão financeira básica`
- Dependências: T0503

#### Requisitos funcionais

- [ ] Mostrar categorias cadastradas.
- [ ] Lista categorias de receita.
- [ ] Lista categorias de despesa.
- [ ] Mostra nome e tipo.
- [ ] Mostra estado vazio.

#### Requisitos técnicos

- [ ] Usar repositórios locais para persistência.
- [ ] Mostrar erros de validação próximos aos campos.
- [ ] Bloquear exclusões que quebrem integridade financeira.

#### Arquivos prováveis

- `src/features/categories/`
- `src/hooks/useCategories.ts`
- `src/features/accounts/`

#### Passos sugeridos

1. Ler os arquivos prováveis e confirmar a estrutura existente.
2. Implementar somente o necessário para a feature desta task.
3. Adicionar ou atualizar testes específicos da task.
4. Rodar testes e lint.
5. Registrar evidências em `docs/sprint-05/PROGRESS.md`.

#### Critérios de aceite

- [ ] Lista categorias de receita.
- [ ] Lista categorias de despesa.
- [ ] Mostra nome e tipo.
- [ ] Mostra estado vazio.

#### Testes e verificação

- [ ] Adicionar teste cobrindo `Criar tela de listagem de categorias` em arquivo de teste da sprint.
- [ ] Cobrir pelo menos: Lista categorias de receita.
- [ ] Executar `npm test` com a suíte atualizada.
- [ ] Executar `npm run lint` sem erros novos.

### T0505 — Criar formulário de categoria

- Status: todo
- Feature: Formulário de categoria
- Plano: `PLAN.md` > `Fase 6 — Gestão financeira básica`
- Dependências: T0504

#### Requisitos funcionais

- [ ] Criar e editar categorias.
- [ ] Usuário informa nome.
- [ ] Usuário escolhe tipo.
- [ ] Usuário pode escolher uma cor entre opções predefinidas.
- [ ] Salva no SQLite.
- [ ] Validações aparecem na tela.

#### Requisitos técnicos

- [ ] Usar repositórios locais para persistência.
- [ ] Mostrar erros de validação próximos aos campos.
- [ ] Bloquear exclusões que quebrem integridade financeira.
- [ ] Separar estado do formulário, validação e chamada ao repositório.

#### Arquivos prováveis

- `src/features/categories/`
- `src/hooks/useCategories.ts`
- `src/features/accounts/`

#### Passos sugeridos

1. Ler os arquivos prováveis e confirmar a estrutura existente.
2. Implementar somente o necessário para a feature desta task.
3. Adicionar ou atualizar testes específicos da task.
4. Rodar testes e lint.
5. Registrar evidências em `docs/sprint-05/PROGRESS.md`.

#### Critérios de aceite

- [ ] Usuário informa nome.
- [ ] Usuário escolhe tipo.
- [ ] Usuário pode escolher uma cor entre opções predefinidas.
- [ ] Salva no SQLite.
- [ ] Validações aparecem na tela.

#### Testes e verificação

- [ ] Adicionar teste cobrindo `Criar formulário de categoria` em arquivo de teste da sprint.
- [ ] Cobrir pelo menos: Usuário informa nome.
- [ ] Executar `npm test` com a suíte atualizada.
- [ ] Executar `npm run lint` sem erros novos.

### T0506 — Criar exclusão de categoria

- Status: todo
- Feature: Exclusão de categoria
- Plano: `PLAN.md` > `Fase 6 — Gestão financeira básica`
- Dependências: T0501, T0502, T0503, T0504, T0505

#### Requisitos funcionais

- [ ] Permitir excluir categoria sem transações.
- [ ] Usuário exclui categoria sem uso.
- [ ] Usuário não exclui categoria usada.
- [ ] Mensagem explica bloqueio.

#### Requisitos técnicos

- [ ] Usar repositórios locais para persistência.
- [ ] Mostrar erros de validação próximos aos campos.
- [ ] Bloquear exclusões que quebrem integridade financeira.
- [ ] Pedir confirmação quando houver remoção de dados.

#### Arquivos prováveis

- `src/features/categories/`
- `src/hooks/useCategories.ts`
- `src/features/transactions/`
- `src/hooks/useTransactions.ts`
- `src/features/accounts/`

#### Passos sugeridos

1. Ler os arquivos prováveis e confirmar a estrutura existente.
2. Implementar somente o necessário para a feature desta task.
3. Adicionar ou atualizar testes específicos da task.
4. Rodar testes e lint.
5. Registrar evidências em `docs/sprint-05/PROGRESS.md`.

#### Critérios de aceite

- [ ] Usuário exclui categoria sem uso.
- [ ] Usuário não exclui categoria usada.
- [ ] Mensagem explica bloqueio.

#### Testes e verificação

- [ ] Adicionar teste cobrindo `Criar exclusão de categoria` em arquivo de teste da sprint.
- [ ] Cobrir pelo menos: Usuário exclui categoria sem uso.
- [ ] Executar `npm test` com a suíte atualizada.
- [ ] Executar `npm run lint` sem erros novos.

## Testes da sprint

- [ ] Teste de criação de conta via formulário.
- [ ] Teste de criação de categoria via formulário.
- [ ] Teste de validação de campos obrigatórios.
- [ ] Teste de bloqueio de exclusão.
- [ ] Teste de atualização da lista após salvar.
- [ ] `npm test` passa.
- [ ] `npm run lint` passa.

## Checklist final

- [ ] App abre sem tela branca.
- [ ] `npm test` passa com os testes adicionados na sprint.
- [ ] `npm run lint` passa sem erros.
- [ ] Não há chamada de rede para dados financeiros.
- [ ] Não há dependência proibida adicionada.
- [ ] `docs/sprint-05/PROGRESS.md` descreve o que foi entregue.
