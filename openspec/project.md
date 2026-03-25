# Finance App - Contexto de Projeto (OpenSpec)

## Visao
Aplicativo de controle financeiro pessoal, mobile-first, com foco em uso diario por casal. O produto cobre autenticacao, transacoes, dashboard, metas/orcamentos, investimentos, importacao CSV e exportacao de extratos.

## Objetivo do MVP
- Permitir registro rapido de receitas e despesas.
- Dar visao clara do mes atual (resumo e categorias de gasto).
- Apoiar planejamento financeiro (orcamentos e metas).
- Evitar retrabalho com importacao CSV e recorrencias.

## Stack
- Frontend: Next.js 14 (App Router) + TypeScript strict.
- UI: Tailwind + shadcn/ui.
- Dados e Auth: Supabase (PostgreSQL + RLS + OAuth Google).
- Estado: TanStack Query (server state) e Zustand (UI global).
- Deploy: Vercel.

## Principios
- Mobile-first em 375px.
- Textos de UI em pt-BR.
- Seguranca por padrao: RLS em tabelas de usuario.
- Reuso de tipos em `lib/types/index.ts`.
- Formularios com React Hook Form + Zod.

## Estrutura OpenSpec
- Capabilities canonicas: `openspec/specs/<capability>/spec.md`.
- Mudancas por sprint: `openspec/changes/<sprint>/` com `proposal.md`, `design.md`, `tasks.md` e deltas em `specs/**/spec.md`.
- Referencia legada mantida em `specs/` e `finance-app-specs.md`.

## Convencoes de Execucao
- Sempre iniciar por `tasks.md` da sprint ativa.
- Implementar uma tarefa por vez e marcar checkbox imediatamente.
- Rodar `npm run build` antes de concluir tarefa.
