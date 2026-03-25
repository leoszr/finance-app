# Tecnico: architecture

## Objetivo
Definir a arquitetura base do Finance App para orientar implementacao por sprint.

## Stack padrao
- Frontend: Next.js 14 (App Router) + TypeScript strict.
- UI: Tailwind + shadcn/ui.
- Dados/Auth: Supabase (PostgreSQL, OAuth Google, RLS).
- Estado: TanStack Query (server state) + Zustand (ui state).
- Deploy: Vercel.

## Organizacao recomendada
- `app/(auth)` para rotas publicas.
- `app/(app)` para rotas protegidas.
- `components/ui` para base visual.
- `lib/hooks` para acesso a dados por dominio.
- `lib/types/index.ts` como fonte unica de tipos de dominio.

## Regras arquiteturais
- Separar apresentacao, regra de negocio e acesso a dados.
- Nunca acessar tabelas de outro usuario fora de regras RLS.
- Fluxos de dados com loading/error em toda query.
- Mobile-first como padrao de layout.

## Fluxo de request (alto nivel)
1. UI dispara hook de dominio.
2. Hook consulta Supabase via TanStack Query.
3. Banco aplica RLS automaticamente.
4. Cache e invalidacoes mantem UI sincronizada.

## Guardrails
- Nao usar `any`.
- Nao duplicar tipos de dominio fora de `lib/types/index.ts`.
- Nao acoplar componente de UI direto a query SQL.
