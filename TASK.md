# Tasks de Implementação

## Convenções

- Status: `todo`, `doing`, `done`, `blocked`.
- Execução detalhada por sprint em `docs/sprint-XX/TASK.md`.
- Progresso resumido por sprint em `docs/sprint-XX/PROGRESS.md`.
- A partir da Sprint 13, trabalhar na branch `dev` e abrir PR de `dev` para `main` ao final de cada sprint.
- Cada sprint deve manter a suíte de testes atualizada e um commit final coeso.

## Índice das Sprints

### Sprint 00 — Fundação do projeto

- Status: done
- Branch: `feature/sprint-00-project-foundation`
- Tasks: `docs/sprint-00/TASK.md`
- Progresso: `docs/sprint-00/PROGRESS.md`

### Sprint 01 — Banco local SQLite e migrations

- Status: done
- Branch: `feature/sprint-01-local-database`
- Tasks: `docs/sprint-01/TASK.md`
- Progresso: `docs/sprint-01/PROGRESS.md`

### Sprint 02 — Camada de domínio financeiro

- Status: done
- Branch: `feature/sprint-02-finance-domain`
- Tasks: `docs/sprint-02/TASK.md`
- Progresso: `docs/sprint-02/PROGRESS.md`

### Sprint 03 — Repositórios locais

- Status: done
- Branch: `feature/sprint-03-local-repositories`
- Tasks: `docs/sprint-03/TASK.md`
- Progresso: `docs/sprint-03/PROGRESS.md`

### Sprint 04 — Navegação principal e layout base

- Status: done
- Branch: `feature/sprint-04-navigation-layout`
- Tasks: `docs/sprint-04/TASK.md`
- Progresso: `docs/sprint-04/PROGRESS.md`

### Sprint 05 — Cadastro de contas e categorias

- Status: done
- Branch: `feature/sprint-05-accounts-categories`
- Tasks: `docs/sprint-05/TASK.md`
- Progresso: `docs/sprint-05/PROGRESS.md`

### Sprint 06 — CRUD de transações

- Status: done
- Branch: `feature/sprint-06-transactions-crud`
- Tasks: `docs/sprint-06/TASK.md`
- Progresso: `docs/sprint-06/PROGRESS.md`

### Sprint 07 — Filtros, busca e visão mensal

- Status: done
- Branch: `feature/sprint-07-transactions-filtering`
- Tasks: `docs/sprint-07/TASK.md`
- Progresso: `docs/sprint-07/PROGRESS.md`

### Sprint 08 — Dashboard financeiro

- Status: done
- Branch: `feature/sprint-08-dashboard`
- Tasks: `docs/sprint-08/TASK.md`
- Progresso: `docs/sprint-08/PROGRESS.md`

### Sprint 09 — Relatórios locais

- Status: done
- Branch: `feature/sprint-09-local-reports`
- Tasks: `docs/sprint-09/TASK.md`
- Progresso: `docs/sprint-09/PROGRESS.md`

### Sprint 10 — Geração de PDF local

- Status: done
- Branch: `feature/sprint-10-pdf-export`
- Tasks: `docs/sprint-10/TASK.md`
- Progresso: `docs/sprint-10/PROGRESS.md`

### Sprint 11 — Exportação e importação de dados

- Status: done
- Branch: `feature/sprint-11-backup-import-export`
- Tasks: `docs/sprint-11/TASK.md`
- Progresso: `docs/sprint-11/PROGRESS.md`

### Sprint 12 — Configurações locais

- Status: done
- Branch: `feature/sprint-12-local-settings`
- Tasks: `docs/sprint-12/TASK.md`
- Progresso: `docs/sprint-12/PROGRESS.md`

### Sprint 13 — Segurança local básica

- Status: done
- Branch: `dev`
- Tasks: `docs/sprint-13/TASK.md`
- Progresso: `docs/sprint-13/PROGRESS.md`

### Sprint 14 — Polimento de experiência mobile

- Status: todo
- Branch: `dev`
- Tasks: `docs/sprint-14/TASK.md`
- Progresso: `docs/sprint-14/PROGRESS.md`

### Sprint 15 — Hardening e release interno

- Status: todo
- Branch: `dev`
- Tasks: `docs/sprint-15/TASK.md`
- Progresso: `docs/sprint-15/PROGRESS.md`

## Critérios Globais de Aceite

- [ ] App abre sem erro.
- [ ] `npm test` passa.
- [ ] `npm run lint` passa.
- [ ] Não há chamada a backend para dados financeiros.
- [ ] Não há dependência de Supabase, PostgreSQL, Java backend, API externa, IA ou sync automático.
- [ ] Alterações são pequenas o suficiente para revisão humana.

## Próxima Task

- Sprint atual: `docs/sprint-13/TASK.md`.
- Começar por T1301 — Adicionar suporte a biometria local.
