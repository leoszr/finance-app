# Capability: authentication

## Purpose

Definir os requisitos de autenticacao, sessao e controle de acesso para usuarios do app.

## Requirements

### Requirement: Login com Google
O sistema SHALL autenticar usuarios via Google OAuth usando Supabase Auth.

#### Scenario: Login bem-sucedido
- WHEN o usuario clica em "Entrar com Google" e conclui autorizacao
- THEN a sessao e criada
- AND o usuario e redirecionado para `/dashboard`

### Requirement: Protecao de rotas
O sistema SHALL bloquear rotas privadas para usuarios sem sessao valida.

#### Scenario: Acesso sem autenticacao
- WHEN um usuario nao autenticado acessa `/dashboard`
- THEN ele e redirecionado para `/login`

### Requirement: Provisionamento inicial
O sistema SHALL criar categorias padrao no primeiro login.

#### Scenario: Primeiro acesso
- WHEN um novo usuario conclui o primeiro login
- THEN 11 categorias padrao sao criadas para seu `user_id`

### Requirement: Logout
O sistema SHALL encerrar sessao e limpar estado local.

#### Scenario: Sair da aplicacao
- WHEN o usuario confirma logout
- THEN a sessao e encerrada
- AND o acesso a rotas privadas volta a exigir login
