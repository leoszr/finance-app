# Tecnico: security-rls

## Objetivo
Padronizar seguranca de dados por usuario no banco e na aplicacao.

## Politica obrigatoria
- Todas as tabelas de usuario DEVEM ter RLS habilitado.
- Politica padrao: `auth.uid() = user_id`.

## Regras praticas
- Cliente usa apenas chave anonima do Supabase.
- Nunca expor `service_role` no frontend.
- Middleware protege rotas privadas e renova sessao.
- Sem sessao valida, rotas privadas redirecionam para login.

## Autorizacao
- A verificacao principal e feita no banco via RLS.
- Validacoes de formulario no frontend complementam UX, nao substituem RLS.

## Checklist de seguranca
- RLS ativo em todas as tabelas de dominio.
- Policy criada para SELECT/INSERT/UPDATE/DELETE conforme padrao.
- Testes de isolamento entre usuarios antes de liberar sprint.
