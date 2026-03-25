# Capability: transactions

## Purpose

Definir o comportamento de cadastro, listagem, recorrencia e seguranca de transacoes financeiras.

## Requirements

### Requirement: CRUD de transacoes
O sistema SHALL permitir criar, listar, editar e excluir transacoes do usuario autenticado.

#### Scenario: Criar transacao manual
- WHEN o usuario envia formulario valido
- THEN a transacao e persistida com `source = 'manual'`
- AND o resumo mensal e atualizado

### Requirement: Listagem mensal
O sistema SHALL listar transacoes por mes com ordenacao por data decrescente.

#### Scenario: Navegar entre meses
- WHEN o usuario seleciona outro mes
- THEN somente transacoes daquele periodo sao exibidas

### Requirement: Recorrencias
O sistema SHALL suportar recorrencias e gerar lancamentos do mes automaticamente.

#### Scenario: Geracao no login
- WHEN existe recorrencia ativa ainda nao gerada no mes atual
- THEN o sistema cria a transacao correspondente
- AND marca `is_recurring = true`

### Requirement: Seguranca por usuario
O sistema SHALL garantir isolamento por `user_id` via RLS.

#### Scenario: Tentativa de acesso cruzado
- WHEN um usuario tenta acessar transacao de outro
- THEN nenhuma linha e retornada
