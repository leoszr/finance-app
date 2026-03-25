# ADR 004 - TanStack Query para server state

## Status
Aceito

## Contexto
O app possui consultas e mutacoes frequentes com necessidade de cache e invalidacao previsiveis.

## Decisao
Adotar TanStack Query para gerenciamento de estado de servidor.

## Racional
- Simplifica loading/error/retry por query.
- Estrutura invalidao de cache apos mutacoes.
- Reduz boilerplate em comparacao a fetch manual.

## Consequencias
- Hooks de dominio devem padronizar query keys.
- Necessidade de estrategia clara de invalidacao e estados de erro.
