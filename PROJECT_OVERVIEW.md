# Project Overview

> Documentacao reconstruida a partir do estado atual do codigo apos remocao dos docs anteriores.

## Produto
Aplicativo de controle financeiro pessoal, mobile-first, focado em uso diario. Cobre autenticacao, transacoes, dashboard, metas, orcamentos, investimentos, importacao CSV e exportacao de historico.

## Stack atual
- Next.js `15.5.14`
- React `18.3.1`
- TypeScript `5.7.2`
- Supabase SSR `0.5.2`
- Supabase JS `2.49.8`
- TanStack Query `5.59.16`
- Zustand `5.0.1`
- React Hook Form `7.53.2`
- Zod `3.23.8`
- Tailwind CSS `3.4.17`
- shadcn/ui + Radix Alert Dialog
- Recharts `3.8.1`
- jsPDF `4.2.1`
- xlsx `0.18.5`

## Estrutura funcional
### Autenticacao
- Login com Google em `app/auth/login/page.tsx`
- Callback OAuth em `app/auth/callback/route.ts`
- Protecao de rotas via `middleware.ts` e `lib/supabase/middleware.ts`
- Clientes Supabase em `lib/supabase/client.ts` e `lib/supabase/server.ts`
- UX de sessao encerrada: rotas protegidas redirecionam para `/login` com aviso de relogin quando cookies de auth anteriores existem

### App principal
Rotas principais expostas na navegacao inferior:
- `/dashboard`
- `/transacoes`
- `/transacoes/importar`
- `/metas`
- `/investimentos`

### Modulos implementados
- **Dashboard**: resumo mensal, categorias, ultimas transacoes, comparativo de 6 meses
- **Transacoes**: listagem, CRUD, filtros por periodo, resumo mensal, recorrencias
- **Importacao CSV**: fluxo em etapas para CSV do Nubank com validacao e preview
- **Metas e orcamentos**: cadastro, progresso, alertas de consumo e prazo
- **Investimentos**: carteira, resumo por tipo, calculadora com taxas do BCB
- **Exportacao**: PDF e XLSX de transacoes filtradas
- **Resumo semanal**: Edge Function para envio de email com resumo financeiro

## Arquitetura
- App Router com layout protegido em `app/(app)/layout.tsx`
- Shell mobile-first com `components/layout/bottom-nav.tsx`
- Estado remoto via React Query
- Estado global de UI via Zustand
- Persistencia em Supabase PostgreSQL com RLS
- RPCs e migrations em `supabase/migrations/`
- Integracao externa com Banco Central via `app/api/bcb-proxy/route.ts`

## Backend / dados
Migrations existentes cobrem:
- autenticacao e categorias padrao
- transacoes
- recorrencias + RPC de geracao
- metas e orcamentos
- categorias padrao para usuarios existentes
- investimentos
- agendamento de resumo semanal

## PWA / offline
- Manifesto em `public/manifest.webmanifest`
- Service Worker em `public/sw.js`
- Registro no cliente em `components/pwa-register.tsx`
- Fallback offline em `app/offline/page.tsx`

## Validacao disponivel
Scripts atuais em `package.json`:
- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`

## Limites atuais visiveis no repo
- Nao ha suite de testes automatizados no repositorio
- Nao ha CI/workflows de validacao visiveis em `.github`
- Parte da configuracao de ambiente usada por Edge Function depende de variaveis fora do app web
- Expiracao real de sessao em 30 dias depende de configuracao externa do Supabase Auth (`Sessions` + revisao de `JWT expiry`), nao apenas do codigo do app
