# Plano da Próxima Sprint

## Contexto validado do projeto

- Branch atual: `sprint-2-dashboard` (não estamos na `main`).
- Estado do Git: há mudanças locais não commitadas e arquivo removido localmente:
  - `AGENTS.md` (deleted)
  - `app/(app)/dashboard/page.tsx` (modified)
  - `app/(app)/transacoes/page.tsx` (modified)
  - `package.json` / `package-lock.json` (modified)
  - `progress.md` (modified)
  - `supabase/migrations/20260325115000_sprint1_recurrents_rpc.sql` (modified)
  - novos arquivos/pastas não rastreados em `components/charts`, `components/dashboard`, `supabase/migrations/...`
- Qualidade técnica validada agora:
  - `npm run lint` ✅
  - `npm run build` ✅

## Diagnóstico

1. A Sprint 2 aparenta estar funcional tecnicamente (build/lint OK e componentes de dashboard presentes).
2. A branch `main` e `sprint-2-dashboard` já divergem no histórico recente (mensagens e commits diferentes).
3. Existe inconsistência de documentação de progresso:
   - `progress.md` indica Sprint 2 como concluída.
   - `specs/PROGRESS.md` está desatualizado (0%).
4. Não é seguro fazer merge agora com working tree suja, pois pode levar mudanças acidentais para `main`.

## Decisão recomendada

**Não fazer merge imediato.**
Primeiro estabilizar a branch e consolidar escopo da Sprint 2; depois abrir PR para `main`.

## Plano de execução (próxima sprint = Sprint 3: Goals & Budgets)

### Fase 1 — Higiene e fechamento da Sprint 2

- [x] Revisar diffs de todos arquivos alterados localmente e separar o que é da Sprint 2 vs ruído.
- [x] Restaurar `AGENTS.md` caso a remoção tenha sido acidental.
- [x] Decidir sobre `supabase/.temp/` (normalmente não versionar; atualizar `.gitignore` se necessário).
- [x] Validar migration nova `supabase/migrations/20260328200242_new-migration.sql`:
  - confirmar propósito,
  - nome semântico,
  - ordem correta,
  - sem quebrar ambiente existente.
- [x] Consolidar documentação de status:
  - alinhar `progress.md` e `specs/PROGRESS.md`.
- [ ] Commit final da Sprint 2 com escopo limpo.
- [ ] Abrir PR `sprint-2-dashboard -> main` com checklist de validação.

### Fase 2 — Merge controlado

- [ ] Atualizar branch local com remoto (`fetch` + rebase/merge conforme estratégia do time).
- [ ] Resolver conflitos (esperado em `progress.md` e páginas de app).
- [ ] Reexecutar validação após conflitos:
  - `npm run lint`
  - `npm run build`
- [ ] Aprovar PR e realizar squash merge na `main`.
- [ ] Criar branch da próxima sprint a partir da `main` atualizada.

### Fase 3 — Início da Sprint 3 (TASK-015..TASK-017)

- [x] Implementar hooks `useBudgets` e `useGoals` (CRUD + cálculos de progresso).
- [x] Criar página `/metas` com seções:
  - Orçamentos do mês,
  - Meta mensal,
  - Metas com objetivo.
- [x] Criar formulários `BudgetForm` e `GoalForm` com Zod e UX mobile (sheet/drawer).
- [x] Incluir estados de loading/erro/retry consistentes.
- [x] Validar regras críticas:
  - não permitir orçamento duplicado por categoria/mês,
  - metas concluídas com badge,
  - prazos futuros obrigatórios para metas finais.

## Critérios de pronto da próxima sprint

- [x] TASK-015, TASK-016, TASK-017 concluídas conforme OpenSpec.
- [x] Build e lint verdes.
- [x] Documentação de progresso atualizada nos 2 arquivos (`progress.md` e `specs/PROGRESS.md`).
- [ ] PR com descrição de contexto (por que) + evidências de validação.

## Riscos e mitigação

- **Risco**: merge prematuro com mudanças não intencionais.
  - **Mitigação**: limpeza de working tree + commits pequenos por tema.
- **Risco**: migrations conflitantes entre branches.
  - **Mitigação**: revisar naming/ordem e testar ambiente limpo antes do merge.
- **Risco**: divergência de documentação de status.
  - **Mitigação**: padronizar fonte de verdade após cada sprint.

## Próxima ação imediata sugerida

1. Fazer triagem dos arquivos modificados e staged commit do que realmente pertence à Sprint 2.
2. Abrir PR para `main` (não merge direto local).
3. Após merge aprovado, iniciar Sprint 3 em nova branch derivada de `main`.
