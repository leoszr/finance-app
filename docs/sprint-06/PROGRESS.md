# Progresso — Sprint 06 — CRUD de transações

## Resumo

- Status geral: done
- Branch: `feature/sprint-06-transactions-crud`
- Commit final sugerido: `feat(transactions): add income and expense crud`

## Entregue nesta sprint

- Tela de transações substituiu o estado vazio em `app/(tabs)/transactions.tsx`.
- `TransactionsManager` permite listar, criar, editar e excluir receitas/despesas.
- Formulário valida conta, categoria, tipo, data e valor via repositório local.
- Categorias são filtradas pelo tipo; trocar tipo limpa categoria incompatível.
- Lista mostra descrição, categoria, conta, data e valor com sinal/cor por tipo.

## Progresso por task

### T0601 — Criar tela de listagem de transações

- Status: done
- Feature: Tela de listagem de transações

#### Desenvolvido

- Listagem de transações recentes ordenada pelo repositório.
- Estado vazio quando não há transações.
- Linha mostra descrição, categoria, conta, data e valor.

#### Evidências

- `src/features/transactions/TransactionsManager.tsx`
- `app/(tabs)/transactions.tsx`
- `src/tests/features-sprint06.test.tsx`

#### Pendências

- Nenhuma.

### T0602 — Criar formulário de nova transação

- Status: done
- Feature: Formulário de nova transação

#### Desenvolvido

- Formulário para tipo, valor, conta, categoria, data e descrição opcional.
- Persistência via `createTransactionsRepository`.

#### Evidências

- `src/features/transactions/TransactionsManager.tsx`
- Teste: cria despesa e recarrega lista.

#### Pendências

- Nenhuma.

### T0603 — Criar edição de transação

- Status: done
- Feature: Edição de transação

#### Desenvolvido

- Ação Editar carrega dados existentes no formulário.
- Salvamento chama update e atualiza lista.

#### Evidências

- `src/features/transactions/TransactionsManager.tsx`
- Teste: edita descrição de transação.

#### Pendências

- Nenhuma.

### T0604 — Criar exclusão de transação

- Status: done
- Feature: Exclusão de transação

#### Desenvolvido

- Ação Excluir pede confirmação via `Alert` e remove no repositório local.
- Lista atualiza após exclusão.

#### Evidências

- `src/features/transactions/TransactionsManager.tsx`
- Teste: confirma exclusão mockada e verifica repositório vazio.

#### Pendências

- Nenhuma.

### T0605 — Criar validação cruzada de tipo e categoria

- Status: done
- Feature: Validação cruzada de tipo e categoria

#### Desenvolvido

- UI lista só categorias compatíveis com o tipo escolhido.
- Troca de tipo limpa categoria selecionada.
- Repositório bloqueia categoria incompatível.

#### Evidências

- `src/features/transactions/TransactionsManager.tsx`
- `src/db/repositories/transactionsRepository.ts`
- Teste: bloqueia categoria de despesa em receita.

#### Pendências

- Nenhuma.

## Testes executados

- `npm run typecheck` — passou.
- `npm run lint` — passou.
- `npm test -- --runInBand src/tests/features-sprint06.test.tsx` — passou.
- `npm test -- --runInBand` — passou: 18 suítes, 68 testes.

## Decisões técnicas

- Manter CRUD em um manager único nesta sprint para escopo pequeno e revisável.
- Usar botões simples para seleção de conta/categoria até existir navegação/form screen dedicada.
- Não adicionar dependências novas.

## Problemas / riscos encontrados

- Ainda não há picker mobile refinado para data/conta/categoria; aceito como tradeoff da sprint.

## Próximo passo

- Revisar Sprint 06 e, se aceito, commitar com `feat(transactions): add income and expense crud`.
