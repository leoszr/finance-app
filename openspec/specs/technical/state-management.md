# Tecnico: state-management

## Objetivo
Definir fronteira clara entre estado de servidor, estado global de UI e estado local.

## Estrategia
- TanStack Query para dados do Supabase.
- Zustand para estado global de interface (filtros, mes selecionado).
- React Hook Form + Zod para estado e validacao de formularios.

## Convencoes de query
- Query key inclui dominio, usuario e parametro relevante de periodo.
- Toda mutation invalida caches dependentes.
- Erros exibem acao explicita `Tentar novamente`.

## Comportamentos obrigatorios
- Toda tela de dados mostra loading e erro.
- Mutations retornam feedback via toast (sucesso/erro).
- Sem duplicar server state no Zustand.

## Boas praticas
- Hooks por dominio em `lib/hooks`.
- Componentes finos com logica pesada nos hooks.
- Manter consistencia de tipos compartilhados em `lib/types/index.ts`.
