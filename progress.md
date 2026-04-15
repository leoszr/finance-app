# Progress - Finance App

Tracking of all sprint completion status.

## Current Stage

- **Current branch**: `sprint-4-csv-import`
- **Current sprint**: Sprint 5 - Investments (next)
- **Last merged PR**: #7 (`sprint-3-goals-budgets` -> `main`)

## Sprint Summary

| Sprint | Status | Completed | Total | Progress |
|--------|--------|-----------|-------|----------|
| sprint-0-setup | completed | 9 | 9 | 100% |
| sprint-1-transactions | completed | 8 | 8 | 100% |
| sprint-2-dashboard | completed | 7 | 7 | 100% |
| sprint-3-goals-budgets | completed | 7 | 7 | 100% |
| sprint-4-csv-import | completed | 7 | 7 | 100% |
| sprint-5-investments | pending | 0 | 8 | 0% |
| sprint-6-export | pending | 0 | 7 | 0% |
| sprint-7-polish | pending | 0 | 8 | 0% |

## Overall Progress

- **Completed**: 38 tasks
- **Total**: 61 tasks
- **Percentage**: 62.3%

## Sprint Details

### Sprint 0 - Setup (completed)
- [x] 1.1 Inicializar projeto Next.js 14 com TypeScript strict
- [x] 1.2 Configurar dependencias base (UI, estado, validacao)
- [x] 2.1 Configurar Supabase (migrations iniciais e RLS)
- [x] 2.2 Configurar Google OAuth no ambiente
- [x] 3.1 Implementar login/callback/middleware/logout
- [x] 4.1 Implementar layout mobile com BottomNav
- [x] 5.1 Configurar PWA (manifest e icones)
- [x] 6.1 Configurar deploy inicial na Vercel
- [x] 6.2 Rodar `npm run build` e registrar validacao

Validacao OpenSpec:
- `npx @fission-ai/openspec@latest status --change sprint-0-setup --json`
- Resultado: `isComplete: true`

### Sprint 1 - Transactions (completed)
- [x] 1.1 Criar hook `useTransactions` (query + mutations)
- [x] 1.2 Criar hook `useCategories` para formularios
- [x] 2.1 Implementar `TransactionForm` com validacao pt-BR
- [x] 2.2 Implementar pagina de transacoes com resumo mensal
- [x] 3.1 Implementar CRUD de recorrencias
- [x] 3.2 Integrar RPC de geracao de recorrencias no login
- [x] 4.1 Garantir loading/erro com botao `Tentar novamente`
- [x] 4.2 Rodar `npm run build` e registrar validacao

Validacao OpenSpec:
- `npx @fission-ai/openspec@latest status --change sprint-1-transactions --json`
- Resultado: `isComplete: true`
- Data: 2026-03-25

### Sprint 2 - Dashboard (completed)
- [x] TASK-011..TASK-014 - See `openspec/changes/sprint-2-dashboard/tasks.md`

Validacao local:
- `npm run lint` ✅
- `npm run build` ✅
- Data: 2026-03-28

### Sprint 3 - Goals & Budgets (completed)
- [x] TASK-015..TASK-017 - See `openspec/changes/sprint-3-goals-budgets/tasks.md`

Validacao local:
- `npm run lint` ✅
- `npm run build` ✅
- Data: 2026-04-02

### Sprint 4 - CSV Import (completed)
- [x] TASK-018..TASK-019 - See `openspec/changes/sprint-4-csv-import/tasks.md`

Validacao local:
- `npm run lint` ✅
- `npm run build` ✅
- Data: 2026-04-02

### Sprint 5 - Investments (pending)
- [ ] TASK-020..TASK-024 - See `openspec/changes/sprint-5-investments/tasks.md`

### Sprint 6 - Export (pending)
- [ ] TASK-025..TASK-027 - See `openspec/changes/sprint-6-export/tasks.md`

### Sprint 7 - Polish (pending)
- [ ] TASK-028..TASK-030 - See `openspec/changes/sprint-7-polish/tasks.md`

---

**Note**: Update this file after completing each sprint using:
```bash
npx @fission-ai/openspec@latest status --change <sprint-name> --json
```
