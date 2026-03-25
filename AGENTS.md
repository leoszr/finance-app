# AGENTS.md - Build Agent Routing Guide (OpenSpec)

This file is the first checkpoint for any coding agent in this repository.

Goal: before implementing a task, load only the relevant OpenSpec artifacts for that sprint/feature.

## OpenSpec-First Workflow

1. Identify active sprint change in OpenSpec.
2. Load the change artifacts (`proposal`, `design`, `tasks`, `specs`) for that sprint.
3. Implement one task at a time from `tasks.md`.
4. Keep docs and code aligned.

Use these commands:

```bash
npx @fission-ai/openspec@latest list --json
npx @fission-ai/openspec@latest status --change <change-name> --json
npx @fission-ai/openspec@latest instructions apply --change <change-name> --json
```

## Source of Truth

- OpenSpec folder: `openspec/`
- Capability specs: `openspec/specs/<capability>/spec.md`
- Sprint changes: `openspec/changes/<sprint-change>/`
- Legacy reference (deep docs): `specs/`
- Original monolith spec: `finance-app-specs.md`

## What To Load Before Coding

Always load in this order:

1. `openspec/changes/<sprint>/tasks.md`
2. `openspec/changes/<sprint>/design.md`
3. `openspec/changes/<sprint>/specs/**/spec.md`
4. `openspec/specs/<capability>/spec.md`
5. Only if needed: `openspec/specs/technical/*.md`

Do not load all docs by default.

## Sprint-to-Docs Routing Matrix

### Sprint 0 (`sprint-0-setup`)
- Primary capability: `authentication`
- Load:
  - `openspec/changes/sprint-0-setup/tasks.md`
  - `openspec/specs/authentication/spec.md`
  - `openspec/specs/technical/security-rls.md`
  - `openspec/specs/technical/architecture.md`

### Sprint 1 (`sprint-1-transactions`)
- Primary capability: `transactions`
- Load:
  - `openspec/changes/sprint-1-transactions/tasks.md`
  - `openspec/specs/transactions/spec.md`
  - `openspec/specs/technical/state-management.md`
  - `openspec/specs/technical/api-integration.md`

### Sprint 2 (`sprint-2-dashboard`)
- Primary capability: `dashboard`
- Load:
  - `openspec/changes/sprint-2-dashboard/tasks.md`
  - `openspec/specs/dashboard/spec.md`
  - `openspec/specs/technical/state-management.md`

### Sprint 3 (`sprint-3-goals-budgets`)
- Primary capabilities: `budgets`, `goals`
- Load:
  - `openspec/changes/sprint-3-goals-budgets/tasks.md`
  - `openspec/specs/budgets/spec.md`
  - `openspec/specs/goals/spec.md`
  - `openspec/specs/technical/state-management.md`

### Sprint 4 (`sprint-4-csv-import`)
- Primary capability: `csv-import`
- Load:
  - `openspec/changes/sprint-4-csv-import/tasks.md`
  - `openspec/specs/csv-import/spec.md`
  - `openspec/specs/transactions/spec.md`

### Sprint 5 (`sprint-5-investments`)
- Primary capability: `investments`
- Load:
  - `openspec/changes/sprint-5-investments/tasks.md`
  - `openspec/specs/investments/spec.md`
  - `openspec/specs/technical/api-integration.md`

### Sprint 6 (`sprint-6-export`)
- Primary capabilities: `export`, `transactions`
- Load:
  - `openspec/changes/sprint-6-export/tasks.md`
  - `openspec/specs/export/spec.md`
  - `openspec/specs/transactions/spec.md`

### Sprint 7 (`sprint-7-polish`)
- Cross-cutting: quality, UX polish, smoke tests
- Load:
  - `openspec/changes/sprint-7-polish/tasks.md`
  - Any affected capability spec(s)
  - `openspec/specs/technical/pwa-config.md`
  - `openspec/specs/technical/security-rls.md`

## Task-to-Capability Map

- TASK-001..TASK-006 -> `authentication` (+ technical)
- TASK-007..TASK-010 -> `transactions`
- TASK-011..TASK-014 -> `dashboard`
- TASK-015..TASK-017 -> `budgets`, `goals`
- TASK-018..TASK-019 -> `csv-import`
- TASK-020..TASK-024 -> `investments`
- TASK-025..TASK-027 -> `export` (+ `transactions` filters)
- TASK-028..TASK-030 -> cross-cutting (load impacted specs only)

## Coding Guidelines (Keep Inline)

### TypeScript
- Strict mode required.
- Do not use `any`.
- Do not use `as unknown as`.
- Reuse domain types from `lib/types/index.ts`.

### Imports
- External libs first.
- Internal aliases (`@/`) second.
- Relative imports last.

### Naming
- Components: `PascalCase`.
- Hooks: `useSomething` in `camelCase`.
- Utils: `kebab-case.ts`.
- DB fields/tables: `snake_case`.

### Forms and Errors
- Forms: React Hook Form + Zod.
- Show inline validation in pt-BR.
- Handle loading/error for every data fetch.
- Use retry button (`Tentar novamente`) in error states.

### UX Conventions
- Mobile-first at 375px.
- Forms in `Sheet` (not full-screen modal).
- Destructive confirm with `AlertDialog`.
- Toast for success/error feedback.

### Security
- RLS mandatory for all user tables.
- Never use `service_role` on client.
- Standard policy: `auth.uid() = user_id`.
- Migrations are immutable.

## Build/Test Commands

```bash
npm run dev
npm run build
npm run lint
npm run start
```

Single-test pattern (when tests exist):

```bash
npm test -- <test-file-path>
npx playwright test <test-file>
```

## OpenSpec Commands for Daily Use

```bash
npx @fission-ai/openspec@latest list
npx @fission-ai/openspec@latest list --specs
npx @fission-ai/openspec@latest show <item>
npx @fission-ai/openspec@latest validate <item>
npx @fission-ai/openspec@latest status --change <change-name>
npx @fission-ai/openspec@latest instructions apply --change <change-name> --json
```

## Hard Rules for Build Agents

1. Never start coding before reading the relevant sprint `tasks.md`.
2. Never load unrelated feature specs.
3. Update task checkboxes immediately after each completed item.
4. Keep implementation scoped to current task.
5. Preserve pt-BR for all user-facing text.
6. Run `npm run build` before marking a task done.

## Related Docs

- OpenSpec usage guide: `openspec/HOW-TO-USE-OPENSPEC.md`
- OpenSpec project context: `openspec/project.md`
- OpenSpec agent guide: `openspec/AGENTS.md`

Last updated: March 2026
