# Tecnico: api-integration

## Objetivo
Padronizar integracao de APIs internas e externas do produto.

## Fontes de dados
- Supabase como backend principal para CRUD de dominio.
- RPCs para operacoes de banco que exigem logica consolidada.
- Proxy interno para API externa do Banco Central quando necessario.

## Regras de integracao
- Toda chamada deve tratar loading e erro.
- Mensagens de erro para usuario em pt-BR.
- Requisicoes externas devem ter estrategia de cache.
- Falhas transitórias devem oferecer retry.

## Autenticacao
- Fluxo OAuth Google via Supabase Auth.
- Sessao obrigatoria para endpoints de dominio.
- Middleware garante protecao de rotas privadas.

## Observabilidade minima
- Logar falhas tecnicas relevantes em ambiente de execucao.
- Evitar expor detalhes sensiveis de erro para o usuario final.
