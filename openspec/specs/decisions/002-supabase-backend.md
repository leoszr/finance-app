# ADR 002 - Supabase como backend

## Status
Aceito

## Contexto
O MVP requer autenticacao, banco relacional e seguranca com baixo custo operacional.

## Decisao
Adotar Supabase para Auth, PostgreSQL, RLS e funcoes de apoio.

## Racional
- RLS nativo para isolamento por usuario.
- Integracao rapida com Next.js e TypeScript.
- Menor overhead de infraestrutura para o MVP.

## Consequencias
- Modelo de dados e politicas ficam centrados em migrations SQL.
- Necessidade de disciplina para nao usar `service_role` no cliente.
