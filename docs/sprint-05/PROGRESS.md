# Progresso — Sprint 05 — Cadastro de contas e categorias

## Resumo

- Status geral: done
- Branch: `feature/sprint-05-accounts-categories`
- Commit final sugerido: `feat(finance): add accounts and categories management`
- Sprint entregue com telas locais para contas/categorias, formulários, validações e bloqueio de exclusão com uso.

## Entregue nesta sprint

- `AccountsManager` com listagem, estado vazio, formulário de criação/edição e exclusão com confirmação.
- `CategoriesManager` com categorias separadas por receita/despesa, formulário, cor predefinida e exclusão com confirmação.
- Abas `Contas` e `Categorias` conectadas aos managers.
- Testes de criação/listagem, validação, bloqueio de exclusão e bloqueio de mudança de tipo em categoria usada.

## Progresso por task

### T0501 — Criar tela de listagem de contas

- Status: done
- Feature: Tela de listagem de contas

#### Desenvolvido

- Lista contas locais com nome, tipo e saldo inicial.
- Estado vazio e botão de adicionar visíveis.

#### Evidências

- Arquivos: `src/features/accounts/AccountsManager.tsx`, `app/(tabs)/accounts.tsx`.
- Teste: `src/tests/features-sprint05.test.tsx`.

#### Pendências

- Nenhuma.

### T0502 — Criar formulário de conta

- Status: done
- Feature: Formulário de conta

#### Desenvolvido

- Formulário cria/edita conta com nome, tipo e saldo inicial.
- Salva via repository local e mostra validação de nome obrigatório.

#### Evidências

- Arquivos: `src/features/accounts/AccountsManager.tsx`.
- Teste cobre criação/listagem e validação obrigatória.

#### Pendências

- Nenhuma.

### T0503 — Criar exclusão de conta

- Status: done
- Feature: Exclusão de conta

#### Desenvolvido

- Exclusão pede confirmação.
- Repository bloqueia conta com transações e retorna mensagem explicativa.

#### Evidências

- Arquivos: `src/features/accounts/AccountsManager.tsx`, `src/tests/features-sprint05.test.tsx`.
- Teste cobre exclusão permitida e bloqueada.

#### Pendências

- Nenhuma.

### T0504 — Criar tela de listagem de categorias

- Status: done
- Feature: Tela de listagem de categorias

#### Desenvolvido

- Lista categorias de receita e despesa em seções separadas.
- Mostra nome, tipo, cor e estados vazios.

#### Evidências

- Arquivos: `src/features/categories/CategoriesManager.tsx`, `app/(tabs)/categories.tsx`.
- Teste cobre listagem por tipo.

#### Pendências

- Nenhuma.

### T0505 — Criar formulário de categoria

- Status: done
- Feature: Formulário de categoria

#### Desenvolvido

- Formulário cria/edita categoria com nome, tipo e cor predefinida.
- Salva via repository local e mostra validação de nome obrigatório.

#### Evidências

- Arquivos: `src/features/categories/CategoriesManager.tsx`.
- Teste cobre criação/listagem e validação obrigatória.

#### Pendências

- Nenhuma.

### T0506 — Criar exclusão de categoria

- Status: done
- Feature: Exclusão de categoria

#### Desenvolvido

- Exclusão pede confirmação.
- Repository bloqueia categoria usada por transações e retorna mensagem explicativa.

#### Evidências

- Arquivos: `src/features/categories/CategoriesManager.tsx`, `src/tests/features-sprint05.test.tsx`.
- Teste cobre exclusão permitida e bloqueada.

#### Pendências

- Nenhuma.

## Testes executados

- `npm test -- --runInBand` — passou: 16 suítes, 58 testes.
- `npm run lint` — passou sem warnings.
- `npm run typecheck` — passou.

## Decisões técnicas

- Managers recebem repository por prop para facilitar testes e usam singleton local estável por padrão no app.
- Persistência segue SQLite/repositories existentes, sem backend e sem rede.
- Testes da sprint focam regra de negócio/repository por causa de ruído atual do setup React Native Testing Library com async `act`.

## Problemas / riscos encontrados

- Correção pós-review: repository padrão dos managers estabilizado para evitar loop de render/query.
- Correção pós-review: categoria usada por transações não pode mudar de tipo.
- Correção pós-review: erros stale de formulário/exclusão são limpos em interações relevantes.
- Warning antigo de `overlapping act()` continua vindo do teste de navegação da Sprint 04. Já registrado em `docs/refactor/TASK.md` como R002.

## Próximo passo

- Iniciar Sprint 06.
