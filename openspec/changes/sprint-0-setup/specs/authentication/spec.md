# Delta Spec - authentication (Sprint 0)

## ADDED Requirements

### Requirement: Sessao e controle de acesso
O sistema SHALL estabelecer sessao apos OAuth e bloquear rotas privadas sem autenticacao.

#### Scenario: Middleware em rota privada
- WHEN a requisicao chega sem sessao valida
- THEN o middleware redireciona para `/login`

### Requirement: Provisionamento de categorias padrao
O sistema SHALL provisionar categorias padrao no primeiro acesso.

#### Scenario: Usuario novo autenticado
- WHEN ocorre o primeiro login
- THEN categorias default sao criadas para o `user_id`
