# Row Level Security (RLS) — Finance App

**Versão:** 1.0  
**Última atualização:** Março 2026  
**Nível:** Avançado — Database Security

---

## 1. Introdução ao Row Level Security

### 1.1 O Que É RLS?

**Row Level Security** é um mecanismo de segurança nativo do PostgreSQL que permite controlar quais **rows (linhas)** de uma tabela um usuário pode acessar, independentemente das permissões de tabela (GRANT/REVOKE).

**Analogia**:
- **Permissões de tabela** (GRANT): "Você pode ler este livro?"
- **RLS**: "Você pode ler QUAIS PÁGINAS deste livro?"

### 1.2 Por Que RLS é Crítico Neste Projeto?

**Cenário sem RLS**:
```typescript
// ❌ Sem RLS, precisaríamos confiar no código do cliente:
const { data } = await supabase
  .from('transactions')
  .select('*')
  .eq('user_id', userId) // ← Código vulnerável no cliente!

// Atacante pode modificar o request no browser:
.eq('user_id', 'victim-user-id') // ← Acessa dados de outro usuário!
```

**Cenário com RLS**:
```typescript
// ✅ Com RLS, o banco aplica a regra AUTOMATICAMENTE:
const { data } = await supabase
  .from('transactions')
  .select('*')
// RLS adiciona WHERE auth.uid() = user_id SEMPRE

// Atacante tenta modificar:
.eq('user_id', 'victim-user-id')
// Resultado: data = [] (vazio), não levanta erro
```

**RLS = Segurança no banco, não no código do cliente**

### 1.3 Diferença entre RLS e WHERE Clause Manual

| Aspecto | WHERE user_id = ... (manual) | RLS |
|---------|------------------------------|-----|
| **Aplicação** | Código cliente (JavaScript) | Banco de dados (PostgreSQL) |
| **Bypassável?** | ✅ Sim (modificar código) | ❌ Não (imposto pelo banco) |
| **Consistência** | ❌ Precisa lembrar em TODA query | ✅ Automático em TODAS queries |
| **Auditoria** | ❌ Difícil (código espalhado) | ✅ Fácil (uma política centralizada) |
| **Performance** | Similar | Similar (mesmo execution plan) |

---

## 2. Anatomia de uma Política RLS

### 2.1 Estrutura Básica

```sql
CREATE POLICY <nome_da_politica> ON <tabela>
  [AS {PERMISSIVE | RESTRICTIVE}]
  [FOR {ALL | SELECT | INSERT | UPDATE | DELETE}]
  [TO {role_name | PUBLIC | CURRENT_USER}]
  [USING (condição_para_ver_rows)]
  [WITH CHECK (condição_para_criar_rows)];
```

### 2.2 Componentes Explicados

#### 2.2.1 `USING` vs `WITH CHECK`

**`USING`** (cláusula de visibilidade):
- Define quais rows existentes o usuário pode VER e MODIFICAR
- Aplica em: SELECT, UPDATE, DELETE

**`WITH CHECK`** (cláusula de criação):
- Define quais rows o usuário pode CRIAR
- Aplica em: INSERT, UPDATE (para novos valores)

**Exemplo**:
```sql
-- Política: usuário só vê e modifica seus próprios dados
CREATE POLICY "own_data" ON transactions
  USING (auth.uid() = user_id)        -- ← Ver/modificar apenas se auth.uid() = user_id
  WITH CHECK (auth.uid() = user_id);  -- ← Inserir apenas se auth.uid() = user_id
```

**Comportamento**:
```sql
-- ✅ Permitido (USING passa):
SELECT * FROM transactions WHERE user_id = auth.uid();

-- ❌ Bloqueado (USING falha, retorna vazio):
SELECT * FROM transactions WHERE user_id = 'outro-usuario';

-- ✅ Permitido (WITH CHECK passa):
INSERT INTO transactions (user_id, ...) VALUES (auth.uid(), ...);

-- ❌ Bloqueado (WITH CHECK falha, levanta erro):
INSERT INTO transactions (user_id, ...) VALUES ('outro-usuario', ...);
-- ERROR: new row violates row-level security policy for table "transactions"
```

#### 2.2.2 `FOR` Clause

Define quais operações a política afeta:

```sql
-- Política para todas as operações (padrão):
FOR ALL

-- Políticas separadas por operação:
FOR SELECT   -- Apenas leituras
FOR INSERT   -- Apenas inserções
FOR UPDATE   -- Apenas atualizações
FOR DELETE   -- Apenas remoções
```

**Por que separar?**
- Maior granularidade (ex: permitir SELECT mas bloquear DELETE)
- Melhor auditoria (rastrear quem pode fazer o quê)

**Exemplo avançado**:
```sql
-- Usuário pode ler qualquer transação do casal:
CREATE POLICY "read_couple_data" ON transactions
  FOR SELECT
  USING (
    user_id = auth.uid() 
    OR user_id IN (SELECT partner_id FROM couples WHERE user_id = auth.uid())
  );

-- Mas só pode modificar as próprias:
CREATE POLICY "modify_own_data" ON transactions
  FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "delete_own_data" ON transactions
  FOR DELETE
  USING (user_id = auth.uid());
```

#### 2.2.3 `PERMISSIVE` vs `RESTRICTIVE`

**`PERMISSIVE` (padrão)**:
- Políticas são combinadas com **OR**
- Se QUALQUER política permitir, acesso é concedido

**`RESTRICTIVE`**:
- Políticas são combinadas com **AND**
- TODAS as políticas devem permitir

**Exemplo**:
```sql
-- Política 1 (PERMISSIVE): usuário vê seus dados
CREATE POLICY "own_data" ON transactions
  FOR SELECT
  USING (user_id = auth.uid());

-- Política 2 (PERMISSIVE): usuário vê dados do casal
CREATE POLICY "couple_data" ON transactions
  FOR SELECT
  USING (user_id IN (SELECT partner_id FROM couples WHERE user_id = auth.uid()));

-- Resultado: user_id = auth.uid() OR user_id IN (...)
-- ✅ Acesso permitido se QUALQUER condição for verdadeira

-- Política 3 (RESTRICTIVE): apenas transações dos últimos 2 anos
CREATE POLICY "recent_only" ON transactions
  AS RESTRICTIVE
  FOR SELECT
  USING (date >= CURRENT_DATE - INTERVAL '2 years');

-- Resultado final:
-- (own_data OR couple_data) AND recent_only
-- ✅ Acesso permitido se (é seu dado OU do casal) E é recente
```

---

## 3. Políticas RLS do Projeto

### 3.1 Política Padrão (Todas as Tabelas)

```sql
ALTER TABLE <tabela> ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_data" ON <tabela>
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

**Aplicado em**:
- `categories`
- `transactions`
- `recurrents`
- `budgets`
- `goals`
- `investments`

### 3.2 Breakdown da Política

#### 3.2.1 `auth.uid()` Explicado

**O que é `auth.uid()`?**
- Função do Supabase que retorna o **UUID do usuário autenticado**
- Extrai do JWT token enviado no header `Authorization: Bearer <token>`
- Se não houver token válido, retorna `NULL`

**Como funciona?**
```sql
-- Internamente, Supabase faz:
CREATE FUNCTION auth.uid() RETURNS uuid AS $$
  SELECT COALESCE(
    current_setting('request.jwt.claims', true)::json->>'sub',
    NULL
  )::uuid;
$$ LANGUAGE sql STABLE;
```

**Por que é seguro?**
- JWT é assinado com chave secreta (só Supabase pode gerar)
- Impossível forjar um token válido sem a chave
- Token expira (1 hora por padrão, renovado automaticamente)

#### 3.2.2 Fluxo de Validação

```
┌─────────────────────────────────────────────────────────┐
│ 1. Cliente faz request com JWT no header               │
│    Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI... │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 2. Supabase valida JWT (assinatura + expiração)        │
│    - Se inválido: retorna 401 Unauthorized             │
│    - Se válido: extrai user_id do payload              │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 3. PostgreSQL seta variável de sessão                  │
│    SET request.jwt.claims = '{"sub": "user-uuid", ...}'│
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 4. Query executada:                                     │
│    SELECT * FROM transactions;                          │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 5. RLS adiciona filtro automaticamente:                │
│    SELECT * FROM transactions                           │
│    WHERE auth.uid() = user_id;                          │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 6. Resultado retornado ao cliente                      │
│    (apenas rows onde user_id = auth.uid())             │
└─────────────────────────────────────────────────────────┘
```

---

## 4. Testes de Segurança

### 4.1 Setup de Teste

```sql
-- Criar dois usuários de teste:
INSERT INTO auth.users (id, email) VALUES
  ('11111111-1111-1111-1111-111111111111', 'alice@example.com'),
  ('22222222-2222-2222-2222-222222222222', 'bob@example.com');

-- Criar transações para cada um:
INSERT INTO transactions (user_id, category_id, amount, description, date, type) VALUES
  ('11111111-1111-1111-1111-111111111111', 'cat-1', 100, 'Transação de Alice', '2026-03-24', 'expense'),
  ('22222222-2222-2222-2222-222222222222', 'cat-2', 200, 'Transação de Bob', '2026-03-24', 'expense');
```

### 4.2 Teste 1: Isolamento de Dados (SELECT)

```sql
-- Simular que Alice está autenticada:
SET request.jwt.claims = '{"sub": "11111111-1111-1111-1111-111111111111"}';

-- Alice tenta ver suas transações:
SELECT * FROM transactions;
-- ✅ Resultado: 1 row (apenas a dela)
-- | id | user_id | amount | description           |
-- |----|---------|--------|-----------------------|
-- | .. | 111...  | 100    | Transação de Alice    |

-- Alice tenta ver transações de Bob:
SELECT * FROM transactions WHERE user_id = '22222222-2222-2222-2222-222222222222';
-- ✅ Resultado: 0 rows (RLS bloqueia silenciosamente)
-- (Não levanta erro, apenas retorna vazio)
```

### 4.3 Teste 2: Bloqueio de Inserção (INSERT)

```sql
-- Alice tenta inserir transação para si mesma:
INSERT INTO transactions (user_id, category_id, amount, description, date, type)
VALUES ('11111111-1111-1111-1111-111111111111', 'cat-1', 150, 'Nova transação', '2026-03-24', 'expense');
-- ✅ Sucesso (WITH CHECK passa)

-- Alice tenta inserir transação para Bob:
INSERT INTO transactions (user_id, category_id, amount, description, date, type)
VALUES ('22222222-2222-2222-2222-222222222222', 'cat-2', 150, 'Transação falsa', '2026-03-24', 'expense');
-- ❌ ERROR: new row violates row-level security policy for table "transactions"
```

### 4.4 Teste 3: Bloqueio de Atualização (UPDATE)

```sql
-- Alice tenta atualizar sua própria transação:
UPDATE transactions
SET amount = 120
WHERE user_id = '11111111-1111-1111-1111-111111111111';
-- ✅ Sucesso (USING passa)

-- Alice tenta atualizar transação de Bob:
UPDATE transactions
SET amount = 999
WHERE user_id = '22222222-2222-2222-2222-222222222222';
-- ✅ Aparente sucesso, mas 0 rows affected
-- (USING falha, nenhuma row visível para atualizar)
```

### 4.5 Teste 4: Bloqueio de Exclusão (DELETE)

```sql
-- Alice tenta excluir transação de Bob:
DELETE FROM transactions
WHERE user_id = '22222222-2222-2222-2222-222222222222';
-- ✅ Aparente sucesso, mas 0 rows deleted
-- (USING falha, nenhuma row visível para excluir)
```

### 4.6 Teste 5: Usuário Não Autenticado

```sql
-- Limpar sessão (simular usuário não logado):
RESET request.jwt.claims;

-- Tentar acessar dados:
SELECT * FROM transactions;
-- ✅ Resultado: 0 rows
-- (auth.uid() = NULL, não passa em USING)

-- Tentar inserir dados:
INSERT INTO transactions (user_id, ...) VALUES (...);
-- ❌ ERROR: new row violates row-level security policy
```

---

## 5. Políticas Avançadas (Futuro)

### 5.1 Dashboard Consolidado do Casal

```sql
-- Tabela de relacionamentos:
CREATE TABLE couple_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id UUID NOT NULL REFERENCES auth.users(id),
  user2_id UUID NOT NULL REFERENCES auth.users(id),
  status TEXT CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user1_id, user2_id)
);

ALTER TABLE couple_relationships ENABLE ROW LEVEL SECURITY;

-- Política: ver convites enviados ou recebidos
CREATE POLICY "view_own_relationships" ON couple_relationships
  FOR SELECT
  USING (
    user1_id = auth.uid() 
    OR user2_id = auth.uid()
  );

-- Política: apenas user1 pode criar convite
CREATE POLICY "create_invitation" ON couple_relationships
  FOR INSERT
  WITH CHECK (user1_id = auth.uid());

-- Política: apenas user2 pode aceitar/rejeitar
CREATE POLICY "respond_invitation" ON couple_relationships
  FOR UPDATE
  USING (user2_id = auth.uid())
  WITH CHECK (user2_id = auth.uid() AND status IN ('accepted', 'rejected'));
```

### 5.2 Visualização de Transações do Casal

```sql
-- Política ADICIONAL em transactions (não substitui a existente):
CREATE POLICY "view_couple_transactions" ON transactions
  FOR SELECT
  USING (
    -- Condição 1: é sua transação
    user_id = auth.uid()
    
    OR
    
    -- Condição 2: é transação do parceiro E relacionamento está aceito
    EXISTS (
      SELECT 1 FROM couple_relationships cr
      WHERE cr.status = 'accepted'
        AND (
          (cr.user1_id = auth.uid() AND cr.user2_id = transactions.user_id)
          OR
          (cr.user2_id = auth.uid() AND cr.user1_id = transactions.user_id)
        )
    )
  );
```

**Importante**: Esta é uma política **PERMISSIVE** (padrão), então será combinada com **OR** com a política existente `users_own_data`.

**Resultado final**:
```sql
-- Usuário vê rows onde:
(user_id = auth.uid())  -- Política antiga
OR
(user_id = parceiro E relacionamento aceito)  -- Política nova
```

### 5.3 Impedir Modificação de Transações do Parceiro

```sql
-- Política RESTRITIVA: parceiro pode VER mas NÃO modificar
CREATE POLICY "modify_only_own_transactions" ON transactions
  AS RESTRICTIVE  -- ← Força AND com outras políticas
  FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "delete_only_own_transactions" ON transactions
  AS RESTRICTIVE
  FOR DELETE
  USING (user_id = auth.uid());
```

**Resultado**:
- Alice pode **ver** transações de Bob (política PERMISSIVE)
- Alice **não pode modificar** transações de Bob (política RESTRICTIVE)

---

## 6. RLS com Supabase Client

### 6.1 Cliente Anon vs Service Role

**Anon Key** (cliente):
```typescript
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// ✅ RLS APLICADO:
const { data } = await supabase.from('transactions').select('*')
// PostgreSQL adiciona: WHERE auth.uid() = user_id
```

**Service Role Key** (servidor):
```typescript
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

// ⚠️ RLS BYPASSADO:
const { data } = await supabaseAdmin.from('transactions').select('*')
// Retorna TODAS as transações de TODOS os usuários!
```

**Regra de ouro**:
- **NUNCA** expor `SUPABASE_SERVICE_ROLE_KEY` no cliente
- **NUNCA** usar service role em código front-end
- Usar service role **apenas** em Edge Functions/Server Actions

### 6.2 Verificar se RLS Está Ativo

```sql
-- Ver quais tabelas têm RLS habilitado:
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public';

-- Resultado esperado:
-- | tablename      | rowsecurity |
-- |----------------|-------------|
-- | categories     | true        |
-- | transactions   | true        |
-- | recurrents     | true        |
-- | budgets        | true        |
-- | goals          | true        |
-- | investments    | true        |

-- Ver políticas ativas:
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  cmd,
  qual  -- USING expression
FROM pg_policies
WHERE schemaname = 'public';
```

---

## 7. Performance de RLS

### 7.1 RLS Adiciona Overhead?

**Resposta curta**: Mínimo (< 1ms)

**Explain Analyze**:
```sql
-- Sem RLS:
EXPLAIN ANALYZE SELECT * FROM transactions WHERE user_id = '...';
-- Execution Time: 5.234 ms

-- Com RLS (WHERE adicionado automaticamente):
EXPLAIN ANALYZE SELECT * FROM transactions;
-- Execution Time: 5.312 ms
-- (apenas 0.078ms de overhead)
```

**Por quê?**
- RLS adiciona `WHERE auth.uid() = user_id`
- É o mesmo filtro que você adicionaria manualmente
- PostgreSQL otimiza da mesma forma (usa indexes)

### 7.2 Otimizar Queries com RLS

**Má prática**:
```sql
-- ❌ Subquery dentro do USING (lento):
CREATE POLICY "complex_policy" ON transactions
  USING (
    user_id IN (
      SELECT user_id FROM some_complex_view  -- ← Subquery executada para cada row!
    )
  );
```

**Boa prática**:
```sql
-- ✅ Comparação direta (rápido):
CREATE POLICY "simple_policy" ON transactions
  USING (user_id = auth.uid());

-- ✅ EXISTS com index (rápido):
CREATE POLICY "indexed_policy" ON transactions
  USING (
    EXISTS (
      SELECT 1 FROM couple_relationships
      WHERE user1_id = auth.uid() AND user2_id = transactions.user_id
      -- ← Usa index em couple_relationships
    )
  );
```

### 7.3 Monitorar Performance de RLS

```sql
-- Ver queries lentas (pg_stat_statements extension):
SELECT 
  query,
  mean_exec_time,
  calls
FROM pg_stat_statements
WHERE query LIKE '%transactions%'
ORDER BY mean_exec_time DESC
LIMIT 10;
```

---

## 8. Pitfalls Comuns e Como Evitar

### 8.1 Pitfall 1: Esquecer de Habilitar RLS

```sql
-- ❌ Criar tabela sem RLS:
CREATE TABLE new_table (...);

-- ⚠️ PERIGO: Dados acessíveis por QUALQUER usuário autenticado!

-- ✅ Sempre habilitar RLS:
ALTER TABLE new_table ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_data" ON new_table FOR ALL USING (auth.uid() = user_id);
```

**Checklist pós-migration**:
```sql
-- Rodar após criar nova tabela:
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND rowsecurity = false;

-- Se retornar alguma tabela: FIX IMMEDIATELY!
```

### 8.2 Pitfall 2: Política sem `WITH CHECK`

```sql
-- ❌ Apenas USING (vulnerável em INSERT):
CREATE POLICY "read_only" ON transactions
  FOR ALL
  USING (auth.uid() = user_id);
-- Problema: INSERT não tem validação!

-- ✅ Adicionar WITH CHECK:
CREATE POLICY "full_protection" ON transactions
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

### 8.3 Pitfall 3: Confiar em `user_id` do Cliente

```typescript
// ❌ VULNERÁVEL:
const userId = localStorage.getItem('userId') // ← Manipulável!
await supabase.from('transactions').insert({
  user_id: userId,  // ← Atacante pode mudar isso!
  amount: 100,
  ...
})

// ✅ SEGURO:
const { data: { user } } = await supabase.auth.getUser()
await supabase.from('transactions').insert({
  user_id: user.id,  // ← Vem do JWT (não manipulável)
  amount: 100,
  ...
})
// E RLS valida: WITH CHECK (auth.uid() = user_id)
```

### 8.4 Pitfall 4: Foreign Keys sem RLS

```sql
-- ❌ Problema:
-- User A cria transação com category_id de User B
INSERT INTO transactions (user_id, category_id, ...)
VALUES (
  'user-a-id', 
  'category-de-user-b',  -- ← RLS não valida FK!
  ...
);
-- ✅ Inserção bem-sucedida, mas dados inconsistentes

-- ✅ Solução 1: Validar no app (Zod schema)
const schema = z.object({
  category_id: z.string().refine(async (id) => {
    const { data } = await supabase.from('categories').select('id').eq('id', id).single()
    return !!data  // Só permite se categoria existe E pertence ao user (via RLS)
  })
})

-- ✅ Solução 2: Política com EXISTS (futuro)
CREATE POLICY "valid_category" ON transactions
  AS RESTRICTIVE
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM categories 
      WHERE id = transactions.category_id AND user_id = auth.uid()
    )
  );
```

### 8.5 Pitfall 5: Usar Service Role no Cliente

```typescript
// ❌ NUNCA FAZER ISSO:
const supabase = createClient(
  SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY  // ← EXPÕE EM PUBLIC BUNDLE!
)

// Atacante pode:
// 1. Abrir DevTools → Network
// 2. Ver API key no request
// 3. Acessar TODOS os dados de TODOS os usuários

// ✅ Service role APENAS em servidor:
// app/api/admin/route.ts (Edge Function)
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  const supabaseAdmin = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!  // ← Nunca exposto ao cliente
  )
  
  // Admin queries aqui
}
```

---

## 9. Auditoria e Logging

### 9.1 Log de Tentativas de Acesso Bloqueadas

```sql
-- Criar tabela de logs (apenas admin pode escrever):
CREATE TABLE security_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  table_name TEXT,
  operation TEXT,
  attempted_at TIMESTAMPTZ DEFAULT now(),
  blocked BOOLEAN,
  details JSONB
);

-- Trigger para logar INSERT bloqueados:
CREATE OR REPLACE FUNCTION log_rls_violations()
RETURNS TRIGGER AS $$
BEGIN
  -- Se RLS bloquear, NEW.user_id != auth.uid()
  IF NEW.user_id != auth.uid() THEN
    INSERT INTO security_logs (user_id, table_name, operation, blocked, details)
    VALUES (
      auth.uid(),
      TG_TABLE_NAME,
      TG_OP,
      true,
      jsonb_build_object('attempted_user_id', NEW.user_id)
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER log_transactions_insert
  BEFORE INSERT ON transactions
  FOR EACH ROW EXECUTE FUNCTION log_rls_violations();
```

**⚠️ Cuidado**: Triggers aumentam overhead (~10-20ms por insert)

### 9.2 Dashboard de Segurança (Admin)

```sql
-- Ver tentativas de violação nas últimas 24h:
SELECT 
  user_id,
  table_name,
  COUNT(*) as attempts,
  MAX(attempted_at) as last_attempt
FROM security_logs
WHERE blocked = true 
  AND attempted_at >= NOW() - INTERVAL '24 hours'
GROUP BY user_id, table_name
ORDER BY attempts DESC;
```

---

## 10. Testes Automatizados de RLS

### 10.1 Script de Teste (SQL)

```sql
-- tests/rls_tests.sql

-- Setup
BEGIN;
SET client_min_messages TO ERROR;

-- Criar usuários de teste
INSERT INTO auth.users (id, email) VALUES
  ('test-user-1', 'test1@example.com'),
  ('test-user-2', 'test2@example.com');

-- Criar dados de teste
INSERT INTO transactions (user_id, category_id, amount, description, date, type) VALUES
  ('test-user-1', 'cat-1', 100, 'Test 1', '2026-03-24', 'expense'),
  ('test-user-2', 'cat-2', 200, 'Test 2', '2026-03-24', 'expense');

-- TEST 1: Isolamento de SELECT
SET request.jwt.claims = '{"sub": "test-user-1"}';
DO $$
DECLARE
  row_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO row_count FROM transactions;
  ASSERT row_count = 1, 'User 1 should see only 1 transaction';
END $$;

-- TEST 2: Bloqueio de INSERT
DO $$
BEGIN
  INSERT INTO transactions (user_id, category_id, amount, description, date, type)
  VALUES ('test-user-2', 'cat-2', 150, 'Hack', '2026-03-24', 'expense');
  
  RAISE EXCEPTION 'INSERT should have been blocked by RLS';
EXCEPTION
  WHEN insufficient_privilege THEN
    -- Expected
END $$;

-- TEST 3: Usuário não autenticado
RESET request.jwt.claims;
DO $$
DECLARE
  row_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO row_count FROM transactions;
  ASSERT row_count = 0, 'Unauthenticated user should see 0 rows';
END $$;

-- Cleanup
ROLLBACK;
```

**Rodar teste**:
```bash
psql $DATABASE_URL -f tests/rls_tests.sql
# Saída: ROLLBACK (sem erros = testes passaram)
```

### 10.2 Teste com Supabase JS (Jest)

```typescript
// tests/rls.test.ts
import { createClient } from '@supabase/supabase-js'

describe('RLS Tests', () => {
  const supabase1 = createClient(SUPABASE_URL, ANON_KEY)
  const supabase2 = createClient(SUPABASE_URL, ANON_KEY)
  
  let user1: { id: string }
  let user2: { id: string }
  
  beforeAll(async () => {
    // Login como user1
    const { data: { user } } = await supabase1.auth.signInWithPassword({
      email: 'test1@example.com',
      password: 'test123'
    })
    user1 = user!
    
    // Login como user2
    const { data: { user: u2 } } = await supabase2.auth.signInWithPassword({
      email: 'test2@example.com',
      password: 'test123'
    })
    user2 = u2!
  })
  
  test('User 1 não deve ver transações de User 2', async () => {
    // User 2 cria transação
    await supabase2.from('transactions').insert({
      user_id: user2.id,
      category_id: 'cat-1',
      amount: 100,
      description: 'Test',
      date: '2026-03-24',
      type: 'expense'
    })
    
    // User 1 tenta buscar
    const { data, error } = await supabase1
      .from('transactions')
      .select('*')
      .eq('user_id', user2.id)
    
    expect(error).toBeNull()
    expect(data).toEqual([]) // ← Vazio (RLS bloqueou)
  })
  
  test('User 1 não pode inserir transação para User 2', async () => {
    const { data, error } = await supabase1
      .from('transactions')
      .insert({
        user_id: user2.id,  // ← Tentativa de hack
        category_id: 'cat-1',
        amount: 999,
        description: 'Hack',
        date: '2026-03-24',
        type: 'expense'
      })
    
    expect(error).not.toBeNull()
    expect(error?.message).toContain('row-level security')
  })
})
```

---

## 11. Migrações de RLS

### 11.1 Adicionar Nova Política

```sql
-- migration 009_add_couple_policy.sql

-- Adicionar política SEM remover a antiga:
CREATE POLICY "view_couple_transactions" ON transactions
  FOR SELECT
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM couple_relationships cr
      WHERE cr.status = 'accepted'
        AND ((cr.user1_id = auth.uid() AND cr.user2_id = transactions.user_id)
             OR (cr.user2_id = auth.uid() AND cr.user1_id = transactions.user_id))
    )
  );
```

### 11.2 Modificar Política Existente

```sql
-- migration 010_update_policy.sql

-- Remover política antiga:
DROP POLICY IF EXISTS "users_own_data" ON transactions;

-- Criar nova versão:
CREATE POLICY "users_own_data_v2" ON transactions
  FOR ALL
  USING (auth.uid() = user_id AND active = true)  -- ← Nova condição
  WITH CHECK (auth.uid() = user_id);
```

**⚠️ Cuidado**: Durante o deploy, há um momento em que a política não existe (race condition). Usar transações:

```sql
BEGIN;
  DROP POLICY "users_own_data" ON transactions;
  CREATE POLICY "users_own_data_v2" ON transactions ...;
COMMIT;
```

---

## 12. RLS vs Application-Level Security

### 12.1 Comparação

| Aspecto | RLS | Application-Level |
|---------|-----|-------------------|
| **Local da validação** | Banco de dados | Código do app |
| **Consistência** | ✅ 100% (impossível bypassar) | ❌ Depende do dev lembrar |
| **Performance** | ✅ Otimizado pelo query planner | ❌ Múltiplas queries |
| **Auditoria** | ✅ Centralizada | ❌ Espalhada no código |
| **Complexidade** | ⚠️ SQL avançado | ✅ JavaScript familiar |
| **Debugging** | ⚠️ Mais difícil (EXPLAIN ANALYZE) | ✅ Console.log |

### 12.2 Quando Usar Cada Um?

**RLS** (obrigatório):
- Isolamento de dados por usuário
- Proteção contra SQL injection
- Compliance (GDPR, LGPD)

**Application-Level** (complementar):
- Validação de negócio (ex: "limite de 10 transações/dia")
- UI/UX (ex: esconder botões para usuários sem permissão)
- Lógica complexa (ex: "apenas admin pode fazer X")

**Exemplo combinado**:
```typescript
// 1. RLS garante que user_id = auth.uid() (SEGURANÇA)
// 2. App valida regras de negócio (UX)

async function createTransaction(data: Transaction) {
  // Validação 1 (app): limite diário
  const { data: today } = await supabase
    .from('transactions')
    .select('id', { count: 'exact' })
    .eq('date', format(new Date(), 'yyyy-MM-dd'))
  
  if (today.length >= 10) {
    throw new Error('Limite de 10 transações por dia atingido')
  }
  
  // Validação 2 (RLS): user_id = auth.uid()
  const { error } = await supabase
    .from('transactions')
    .insert(data)
  
  if (error) throw error
}
```

---

## 13. Conclusão

### 13.1 Checklist de Segurança

- [ ] **RLS habilitado** em todas as tabelas com dados de usuário
- [ ] **Política criada** para cada tabela (mínimo: `users_own_data`)
- [ ] **Teste de isolamento** executado (user1 não vê dados de user2)
- [ ] **Service role key** NUNCA exposta no cliente
- [ ] **`auth.uid()`** usado em todas as políticas (não `current_user`)
- [ ] **Foreign keys** validados (categoria pertence ao usuário)
- [ ] **WITH CHECK** presente em políticas `FOR ALL` e `FOR INSERT`
- [ ] **RESTRICTIVE policies** para operações de modificação
- [ ] **Auditoria** configurada (logs de violações)
- [ ] **Testes automatizados** de RLS em CI/CD

### 13.2 Recursos Adicionais

- [PostgreSQL RLS Docs](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [Supabase RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [RLS Performance Tips](https://supabase.com/docs/guides/database/postgres/row-level-security#performance)
- [Common RLS Patterns](https://supabase.com/docs/guides/database/postgres/row-level-security#common-patterns)

---

**Lembre-se**: RLS não é opcional. É a **última linha de defesa** contra acesso não autorizado. Mesmo que o código do front-end tenha bugs, RLS garante que dados de um usuário nunca vazem para outro.
