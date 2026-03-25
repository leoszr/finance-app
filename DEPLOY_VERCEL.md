# Deploy inicial na Vercel (Sprint 0 - TASK 6.1)

Este guia fecha o passo de deploy inicial com Supabase Auth + Google OAuth.

## 1) Importar projeto na Vercel

1. Acesse Vercel e clique em **Add New Project**.
2. Selecione o repositório `finance-app`.
3. Framework: **Next.js**.
4. Root Directory: `./` (raiz do repo).

## 2) Configurar variaveis de ambiente na Vercel

Configure para **Production** e **Preview**:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Opcional (compativel com fallback do codigo):

- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

## 3) Primeiro deploy

1. Clique em **Deploy**.
2. Copie a URL publica gerada pela Vercel (ex: `https://seu-app.vercel.app`).

## 4) Atualizar URLs no Supabase Auth

No Supabase > Authentication > URL Configuration:

- `Site URL`: `https://seu-app.vercel.app`
- `Redirect URLs` deve incluir:
  - `http://localhost:3000/auth/callback`
  - `https://seu-app.vercel.app/auth/callback`

## 5) Atualizar Google OAuth (se necessario)

No Google Cloud OAuth Client (Web Application):

- Authorized JavaScript origins:
  - `http://localhost:3000`
  - `https://seu-app.vercel.app`

O redirect URI do Google para Supabase **permanece**:

- `https://gcnwkxjrqlerlvqrhyda.supabase.co/auth/v1/callback`

## 6) Validacao de producao

1. Abra `https://seu-app.vercel.app/login`.
2. Clique em **Entrar com Google**.
3. Verifique redirect para `/dashboard`.
4. Verifique que `/dashboard` sem sessao redireciona para `/login`.
5. Verifique logout funcionando.

## 7) Fechamento da TASK 6.1

Depois da validacao:

- marcar `6.1 Configurar deploy inicial na Vercel` como concluida em
  `openspec/changes/sprint-0-setup/tasks.md`.
