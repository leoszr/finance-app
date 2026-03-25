# Tecnico: database-schema

## Objetivo
Registrar o modelo de dados canonicamente usado pelo produto.

## Entidades principais
- `categories`: categorias por usuario (receita, despesa, investimento).
- `transactions`: lancamentos financeiros.
- `recurrents`: templates de recorrencia mensal.
- `budgets`: limite mensal por categoria.
- `goals`: metas de economia.
- `investments`: investimentos de renda fixa no MVP.

## Convencoes
- Chaves primarias UUID.
- Campos de ownership com `user_id`.
- Datas financeiras em campos de data/mes conforme caso de uso.
- Valores monetarios com precisao decimal (nao float).

## Integridade
- FKs obrigatorias para vinculo com categoria quando aplicavel.
- Constraints para validar tipo e faixa de valor.
- Indices focados em consultas por `user_id` e periodo mensal.

## Recorrencias
- Geracao mensal deve evitar duplicidade no mesmo mes.
- Transacoes geradas por recorrencia devem ser rastreaveis por origem.

## Evolucao
- Migrations sao imutaveis.
- Toda alteracao de schema entra em nova migration.
