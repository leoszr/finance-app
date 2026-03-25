# AGENTS.md - Agent Guide

How coding agents should operate in this repository.

## Purpose

- Use OpenSpec as source of truth.
- Implement one task at a time.
- Keep changes scoped, secure, and traceable.

## Main Docs

- `openspec/project.md`
- `openspec/HOW-TO-USE-OPENSPEC.md`
- `openspec/AGENTS.md`
- `openspec/specs/<capability>/spec.md`
- `openspec/changes/<sprint>/tasks.md`
- `openspec/changes/<sprint>/design.md`

## Sprint Workflow

1. Identify active sprint.
2. Create sprint branch.
3. Read `tasks.md` first.
4. Read `design.md` and deltas.
5. Implement only current task.
6. Validate lint/build/tests.
7. Update checkbox in `tasks.md`.
8. Commit task (`1 task = 1 commit`).
9. On sprint completion, update `progress.md`.

## Branch Rules

- Format: `sprint-<number>-<slug>`
- Examples: `sprint-0-setup`, `sprint-1-transactions`

```bash
git checkout main
git pull
git checkout -b sprint-1-transactions
```

## Commit Rules

- Each `tasks.md` item must be a separate commit.
- Never bundle multiple tasks in one commit.
- Start commit message with task id.

```bash
git commit -m "TASK-1.1: implement useTransactions hook"
```

## Build / Lint / Run

From `package.json`:

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Test Commands (Single Test)

Current state:

- No `test` script is defined yet.

Use these patterns when tests exist:

```bash
npm test -- <file-or-pattern>
npx vitest run <file-or-pattern>
npx jest <file-or-pattern>
npx playwright test <file-or-pattern>
```

## OpenSpec CLI

```bash
npx @fission-ai/openspec@latest list
npx @fission-ai/openspec@latest list --specs
npx @fission-ai/openspec@latest status --change <change-name>
npx @fission-ai/openspec@latest status --change <change-name> --json
npx @fission-ai/openspec@latest instructions apply --change <change-name> --json
npx @fission-ai/openspec@latest show <item>
npx @fission-ai/openspec@latest validate <item>
```

## Read Order Before Coding

1. `openspec/changes/<sprint>/tasks.md`
2. `openspec/changes/<sprint>/design.md`
3. `openspec/changes/<sprint>/specs/**/spec.md`
4. `openspec/specs/<capability>/spec.md`
5. `openspec/specs/technical/*.md` if needed

Avoid loading unrelated specs by default.

## TypeScript Rules

- `strict: true` is mandatory.
- Do not use `any`.
- Do not use `as unknown as`.
- Avoid unsafe assertions.
- Reuse types from `lib/types/index.ts`.
- Type return values for public/domain functions.

## Import Rules

Order imports as:

1) external libraries
2) internal alias imports (`@/`)
3) relative imports

- Avoid circular dependencies.
- Remove unused imports.

## Formatting and Structure

- Follow existing style and `npm run lint`.
- Use 2-space indentation.
- Prefer short cohesive functions.
- Prefer early return.
- Avoid dead code and unnecessary comments.

## Naming Conventions

- Components: `PascalCase`
- Hooks: `useXxx` in camelCase
- Utility files: `kebab-case.ts`
- SQL tables/fields: `snake_case`
- Env vars: `UPPER_SNAKE_CASE`

## Forms and Error Handling

- Forms: React Hook Form + Zod.
- User messages in pt-BR.
- Every query/mutation handles loading and error.
- Error states include retry (`Tentar novamente`).
- Server-side failures return controlled responses.

## UX Conventions

- Mobile-first at 375px.
- Keep UI text in pt-BR.
- Use `AlertDialog` for destructive actions.
- Use toast feedback for success/error.
- Prefer `Sheet` for forms when applicable.

## Security and Data Rules

- RLS required on user-owned tables.
- Never use `service_role` on client.
- Baseline ownership policy: `auth.uid() = user_id`.
- Migrations are immutable.
- Never commit secrets.

## Progress Rule

- Update `progress.md` when sprint is completed.
- Include status, completed/total, percentage, and date.

```bash
npx @fission-ai/openspec@latest status --change <sprint-name> --json
```

## Cursor and Copilot Rules

No custom rule files were found:

- `.cursor/rules/`
- `.cursorrules`
- `.github/copilot-instructions.md`

If these files are added later, their instructions become mandatory.

## Task Checklist

- Correct sprint branch
- Scope limited to current task
- `npm run lint` executed
- `npm run build` executed
- Checkbox updated in `tasks.md`
- One commit for the task

## Sprint Checklist

- All sprint tasks checked
- OpenSpec status validated
- `progress.md` updated

Last updated: March 2026
