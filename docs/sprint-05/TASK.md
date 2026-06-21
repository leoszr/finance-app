# Sprint 05 — Cadastro de contas e categorias

## Objetivo

Permitir que o usuário configure a base financeira antes de registrar transações.

## Entrega da sprint

- Branch: `feature/sprint-05-accounts-categories`
- Commit final sugerido: `feat(finance): add accounts and categories management`
- Fase do plano: `Fase 6 — Gestão financeira básica`
- Resultado deve ser pequeno, revisável e testável.

## Regras da sprint

- [x] Criar uma feature branch para a sprint.
- [x] Manter as alterações coesas ao objetivo da sprint.
- [x] Atualizar ou criar testes junto com a implementação.
- [x] Executar `npm test` e `npm run lint` antes do commit final.
- [x] Não adicionar backend, Supabase, PostgreSQL, Java backend, API externa, IA ou sync automático.
- [x] Atualizar `docs/sprint-05/PROGRESS.md` com evidências reais.

## Tasks

### T0501 — Criar tela de listagem de contas

- Status: done
- Feature: Tela de listagem de contas
- Plano: `PLAN.md` > `Fase 6 — Gestão financeira básica`
- Dependências: T0404

#### Requisitos funcionais

- [x] Mostrar contas cadastradas.
- [x] Lista todas as contas.
- [x] Mostra nome, tipo e saldo inicial.
- [x] Mostra estado vazio.
- [x] Botão de adicionar conta visível.

#### Requisitos técnicos

- [x] Usar repositórios locais para persistência.
- [x] Mostrar erros de validação próximos aos campos.
- [x] Bloquear exclusões que quebrem integridade financeira.

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

- [x] Lista todas as contas.
- [x] Mostra nome, tipo e saldo inicial.
- [x] Mostra estado vazio.
- [x] Botão de adicionar conta visível.

#### Testes e verificação

- [x] Adicionar teste cobrindo `Criar tela de listagem de contas` em arquivo de teste da sprint.
- [x] Cobrir pelo menos: Lista todas as contas.
- [x] Executar `npm test` com a suíte atualizada.
- [x] Executar `npm run lint` sem erros novos.

### T0502 — Criar formulário de conta

- Status: done
- Feature: Formulário de conta
- Plano: `PLAN.md` > `Fase 6 — Gestão financeira básica`
- Dependências: T0501

#### Requisitos funcionais

- [x] Criar e editar contas.
- [x] Usuário informa nome.
- [x] Usuário escolhe tipo.
- [x] Usuário informa saldo inicial.
- [x] Formulário salva no SQLite.
- [x] Validações aparecem na tela.

#### Requisitos técnicos

- [x] Usar repositórios locais para persistência.
- [x] Mostrar erros de validação próximos aos campos.
- [x] Bloquear exclusões que quebrem integridade financeira.
- [x] Separar estado do formulário, validação e chamada ao repositório.

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

- [x] Usuário informa nome.
- [x] Usuário escolhe tipo.
- [x] Usuário informa saldo inicial.
- [x] Formulário salva no SQLite.
- [x] Validações aparecem na tela.

#### Testes e verificação

- [x] Adicionar teste cobrindo `Criar formulário de conta` em arquivo de teste da sprint.
- [x] Cobrir pelo menos: Usuário informa nome.
- [x] Executar `npm test` com a suíte atualizada.
- [x] Executar `npm run lint` sem erros novos.

### T0503 — Criar exclusão de conta

- Status: done
- Feature: Exclusão de conta
- Plano: `PLAN.md` > `Fase 6 — Gestão financeira básica`
- Dependências: T0502

#### Requisitos funcionais

- [x] Permitir excluir contas sem transações.
- [x] Usuário exclui conta sem transações.
- [x] Usuário não exclui conta com transações.
- [x] Mensagem explica bloqueio.

#### Requisitos técnicos

- [x] Usar repositórios locais para persistência.
- [x] Mostrar erros de validação próximos aos campos.
- [x] Bloquear exclusões que quebrem integridade financeira.
- [x] Pedir confirmação quando houver remoção de dados.

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

- [x] Usuário exclui conta sem transações.
- [x] Usuário não exclui conta com transações.
- [x] Mensagem explica bloqueio.

#### Testes e verificação

- [x] Adicionar teste cobrindo `Criar exclusão de conta` em arquivo de teste da sprint.
- [x] Cobrir pelo menos: Usuário exclui conta sem transações.
- [x] Executar `npm test` com a suíte atualizada.
- [x] Executar `npm run lint` sem erros novos.

### T0504 — Criar tela de listagem de categorias

- Status: done
- Feature: Tela de listagem de categorias
- Plano: `PLAN.md` > `Fase 6 — Gestão financeira básica`
- Dependências: T0503

#### Requisitos funcionais

- [x] Mostrar categorias cadastradas.
- [x] Lista categorias de receita.
- [x] Lista categorias de despesa.
- [x] Mostra nome e tipo.
- [x] Mostra estado vazio.

#### Requisitos técnicos

- [x] Usar repositórios locais para persistência.
- [x] Mostrar erros de validação próximos aos campos.
- [x] Bloquear exclusões que quebrem integridade financeira.

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

- [x] Lista categorias de receita.
- [x] Lista categorias de despesa.
- [x] Mostra nome e tipo.
- [x] Mostra estado vazio.

#### Testes e verificação

- [x] Adicionar teste cobrindo `Criar tela de listagem de categorias` em arquivo de teste da sprint.
- [x] Cobrir pelo menos: Lista categorias de receita.
- [x] Executar `npm test` com a suíte atualizada.
- [x] Executar `npm run lint` sem erros novos.

### T0505 — Criar formulário de categoria

- Status: done
- Feature: Formulário de categoria
- Plano: `PLAN.md` > `Fase 6 — Gestão financeira básica`
- Dependências: T0504

#### Requisitos funcionais

- [x] Criar e editar categorias.
- [x] Usuário informa nome.
- [x] Usuário escolhe tipo.
- [x] Usuário pode escolher uma cor entre opções predefinidas.
- [x] Salva no SQLite.
- [x] Validações aparecem na tela.

#### Requisitos técnicos

- [x] Usar repositórios locais para persistência.
- [x] Mostrar erros de validação próximos aos campos.
- [x] Bloquear exclusões que quebrem integridade financeira.
- [x] Separar estado do formulário, validação e chamada ao repositório.

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

- [x] Usuário informa nome.
- [x] Usuário escolhe tipo.
- [x] Usuário pode escolher uma cor entre opções predefinidas.
- [x] Salva no SQLite.
- [x] Validações aparecem na tela.

#### Testes e verificação

- [x] Adicionar teste cobrindo `Criar formulário de categoria` em arquivo de teste da sprint.
- [x] Cobrir pelo menos: Usuário informa nome.
- [x] Executar `npm test` com a suíte atualizada.
- [x] Executar `npm run lint` sem erros novos.

### T0506 — Criar exclusão de categoria

- Status: done
- Feature: Exclusão de categoria
- Plano: `PLAN.md` > `Fase 6 — Gestão financeira básica`
- Dependências: T0501, T0502, T0503, T0504, T0505

#### Requisitos funcionais

- [x] Permitir excluir categoria sem transações.
- [x] Usuário exclui categoria sem uso.
- [x] Usuário não exclui categoria usada.
- [x] Mensagem explica bloqueio.

#### Requisitos técnicos

- [x] Usar repositórios locais para persistência.
- [x] Mostrar erros de validação próximos aos campos.
- [x] Bloquear exclusões que quebrem integridade financeira.
- [x] Pedir confirmação quando houver remoção de dados.

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

- [x] Usuário exclui categoria sem uso.
- [x] Usuário não exclui categoria usada.
- [x] Mensagem explica bloqueio.

#### Testes e verificação

- [x] Adicionar teste cobrindo `Criar exclusão de categoria` em arquivo de teste da sprint.
- [x] Cobrir pelo menos: Usuário exclui categoria sem uso.
- [x] Executar `npm test` com a suíte atualizada.
- [x] Executar `npm run lint` sem erros novos.

## Testes da sprint

- [x] Teste de criação de conta via formulário.
- [x] Teste de criação de categoria via formulário.
- [x] Teste de validação de campos obrigatórios.
- [x] Teste de bloqueio de exclusão.
- [x] Teste de atualização da lista após salvar.
- [x] `npm test` passa.
- [x] `npm run lint` passa.

## Checklist final

- [x] App abre sem tela branca.
- [x] `npm test` passa com os testes adicionados na sprint.
- [x] `npm run lint` passa sem erros.
- [x] Não há chamada de rede para dados financeiros.
- [x] Não há dependência proibida adicionada.
- [x] `docs/sprint-05/PROGRESS.md` descreve o que foi entregue.
