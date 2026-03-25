# Design - Sprint 0 Setup

## Escopo tecnico
- Base Next.js App Router com providers globais.
- Supabase como backend com RLS por `auth.uid() = user_id`.
- OAuth Google e protecao de rotas via middleware.
- Layout autenticado com BottomNav.
- PWA com manifest e service worker.

## Decisoes
- Priorizar auth e seguranca antes de features.
- Manter padrao mobile-first desde o inicio.
- Preparar estrutura de pastas para hooks, forms e specs.

## Validacoes
- Login/logout funcionando ponta a ponta.
- Rotas privadas bloqueadas sem sessao.
- `npm run build` sem erros.
