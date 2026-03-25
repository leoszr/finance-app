# ADR 001 - Next.js 14 App Router

## Status
Aceito

## Contexto
O produto precisa de base web moderna, SSR/CSR e deploy simples com boa DX.

## Decisao
Adotar Next.js 14 com App Router como framework principal.

## Racional
- Suporte nativo a layouts aninhados e middleware.
- Boa integracao com Supabase no modelo SSR/App Router.
- Fluxo de deploy simples na Vercel.

## Consequencias
- Estrutura por route groups (`(auth)` e `(app)`).
- Dependencia do ecossistema Next para convencoes de rota/render.
