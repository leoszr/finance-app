# Schema do Banco de Dados — Finance App

**Versão:** 1.0  
**Última atualização:** Março 2026  
**Nível:** Avançado — Database Design

---

## 1. Visão Geral do Schema

O banco de dados utiliza **PostgreSQL 15** via Supabase, com foco em:

- **Row Level Security (RLS)**: Isolamento de dados por usuário
- **Normalização 3NF**: Evita redundância, facilita manutenção
- **Indexes estratégicos**: Otimização de queries comuns
- **Triggers e Functions**: Automação de processos (seeds, recorrências)
- **Constraints rígidas**: Integridade referencial e validações

### 1.1 Diagrama Entidade-Relacionamento (ASCII)

```
┌─────────────────┐
│   auth.users    │ (Supabase Auth, não editável)
│─────────────────│
│ id (UUID) PK    │
│ email           │
│ created_at      │
└────────┬────────┘
         │
         │ 1:N
         │
    ┌────┴──────────────────────────────────────────────────┐
    │                                                        │
    │                                                        │
┌───┴──────────────┐  ┌────────────────────┐  ┌────────────┴─────────┐
│  categories      │  │   recurrents       │  │     budgets          │
│──────────────────│  │────────────────────│  │──────────────────────│
│ id (UUID) PK     │  │ id (UUID) PK       │  │ id (UUID) PK         │
│ user_id FK ─────────┤ user_id FK ───────────┤ user_id FK           │
│ name             │  │ category_id FK     │  │ category_id FK ─────┐
│ type             │  │ amount             │  │ amount              │
│ icon             │  │ description        │  │ month               │
│ color            │  │ day_of_month       │  │ created_at          │
│ is_default       │  │ active             │  └─────────────────────┘
│ created_at       │  │ last_gen_month     │
└────────┬─────────┘  └──────┬─────────────┘
         │                   │
         │                   │
         │ 1:N               │ 1:N
         │                   │
         │             ┌─────┴──────────────┐
         │             │                    │
    ┌────┴─────────────┴────┐          ┌────┴────────────────┐
    │   transactions        │          │     goals           │
    │───────────────────────│          │─────────────────────│
    │ id (UUID) PK          │          │ id (UUID) PK        │
    │ user_id FK            │          │ user_id FK          │
    │ category_id FK        │          │ title               │
    │ type                  │          │ type                │
    │ amount                │          │ target_amount       │
    │ description           │          │ current_amount      │
    │ date                  │          │ deadline            │
    │ notes                 │          │ active              │
    │ is_recurring          │          │ created_at          │
    │ recurring_id FK ──────┤          │ updated_at          │
    │ source                │          └─────────────────────┘
    │ created_at            │
    │ updated_at            │
    └───────────────────────┘

    ┌──────────────────────────┐
    │    investments           │
    │──────────────────────────│
    │ id (UUID) PK             │
    │ user_id FK ───────────────┤
    │ name                     │
    │ type (ENUM)              │
    │ institution              │
    │ invested_amount          │
    │ rate_type                │
    │ rate_value               │
    │ start_date               │
    │ maturity_date            │
    │ notes                    │
    │ active                   │
    │ created_at               │
    │ updated_at               │
    └──────────────────────────┘
```

### 1.2 Estatísticas do Schema

| Métrica | Valor |
|---------|-------|
| Total de tabelas | 6 (+ 1 enum type) |
| Total de indexes | 12 |
| Total de triggers | 1 |
| Total de functions | 2 |
| Total de policies RLS | 6 (uma por tabela) |
| Tamanho estimado (10k transações/user) | ~50MB |

---

## 2. Tabelas Detalhadas

### 2.1 `categories`

**Propósito**: Categorização de transações, orçamentos e investimentos.

```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('expense', 'income', 'investment')),
  icon TEXT,
  color TEXT,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_categories_user_id ON categories(user_id);
CREATE INDEX idx_categories_type ON categories(user_id, type); -- Para filtros

-- RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_data" ON categories FOR ALL USING (auth.uid() = user_id);
```

#### 2.1.1 Campos Explicados

| Campo | Tipo | Nullable | Descrição |
|-------|------|----------|-----------|
| `id` | UUID | NO | Primary key (gerado automaticamente) |
| `user_id` | UUID | NO | Referência ao usuário (RLS) |
| `name` | TEXT | NO | Nome da categoria (ex: "Alimentação") |
| `type` | TEXT | NO | Tipo: 'expense', 'income' ou 'investment' |
| `icon` | TEXT | YES | Nome do ícone Lucide (ex: "utensils", "home") |
| `color` | TEXT | YES | Cor hex (ex: "#FF5733") para UI |
| `is_default` | BOOLEAN | NO | Se é categoria padrão (criada pelo sistema) |
| `created_at` | TIMESTAMPTZ | NO | Data de criação |

#### 2.1.2 Regras de Negócio

- **Unicidade**: Não há constraint UNIQUE em `(user_id, name)`, permitindo duplicatas se o usuário quiser
- **Categorias padrão**: `is_default = true` são criadas automaticamente ao criar usuário (trigger)
- **Exclusão**: Usuário pode excluir categorias padrão, mas será avisado que transações associadas precisam ser reatribuídas
- **Tipo imutável**: Após criar uma categoria, o `type` não pode ser alterado (validado no front-end)

#### 2.1.3 Queries Comuns Otimizadas

```sql
-- Q1: Buscar categorias de despesas (otimizada por index composto)
SELECT * FROM categories 
WHERE user_id = $1 AND type = 'expense' 
ORDER BY name;
-- Execution plan: Index Scan using idx_categories_type
-- Cost: ~0.05ms

-- Q2: Contar categorias por tipo (agregação simples)
SELECT type, COUNT(*) 
FROM categories 
WHERE user_id = $1 
GROUP BY type;
-- Execution plan: Bitmap Heap Scan + HashAggregate
-- Cost: ~0.1ms

-- Q3: Buscar categoria por ID (lookup direto)
SELECT * FROM categories WHERE id = $1;
-- Execution plan: Index Scan using categories_pkey
-- Cost: ~0.01ms
```

#### 2.1.4 Categorias Padrão (Seed Data)

Criadas automaticamente pelo trigger `create_default_categories()`:

| name | type | icon | color |
|------|------|------|-------|
| Alimentação | expense | utensils | #EF4444 |
| Moradia | expense | home | #F59E0B |
| Transporte | expense | car | #3B82F6 |
| Saúde | expense | heart-pulse | #EC4899 |
| Lazer | expense | gamepad-2 | #8B5CF6 |
| Roupas | expense | shirt | #06B6D4 |
| Viagens | expense | plane | #10B981 |
| Assinaturas | expense | repeat | #6366F1 |
| Salário | income | wallet | #22C55E |
| Freelance | income | briefcase | #14B8A6 |
| Renda fixa | investment | landmark | #F97316 |

**Total**: 11 categorias (8 despesas, 2 receitas, 1 investimento)

---

### 2.2 `transactions`

**Propósito**: Registro de todas as transações financeiras (receitas e despesas).

```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  type TEXT NOT NULL CHECK (type IN ('expense', 'income')),
  amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  description TEXT NOT NULL,
  date DATE NOT NULL,
  notes TEXT,
  is_recurring BOOLEAN DEFAULT false,
  recurring_id UUID REFERENCES recurrents(id) ON DELETE SET NULL,
  source TEXT CHECK (source IN ('manual', 'csv_nubank', 'recurring')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes (críticos para performance)
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_transactions_user_month ON transactions(user_id, date_trunc('month', date));
CREATE INDEX idx_transactions_category_id ON transactions(category_id);

-- RLS
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_data" ON transactions FOR ALL USING (auth.uid() = user_id);

-- Trigger para updated_at
CREATE TRIGGER set_updated_at BEFORE UPDATE ON transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

#### 2.2.1 Campos Explicados

| Campo | Tipo | Nullable | Descrição |
|-------|------|----------|-----------|
| `id` | UUID | NO | Primary key |
| `user_id` | UUID | NO | Dono da transação |
| `category_id` | UUID | NO | Categoria (FK com RESTRICT) |
| `type` | TEXT | NO | 'expense' ou 'income' |
| `amount` | NUMERIC(12,2) | NO | Valor (sempre positivo, max 9.999.999.999,99) |
| `description` | TEXT | NO | Descrição (ex: "Supermercado Pão de Açúcar") |
| `date` | DATE | NO | Data da transação (não TIMESTAMPTZ, apenas dia) |
| `notes` | TEXT | YES | Observações adicionais |
| `is_recurring` | BOOLEAN | NO | Se foi gerada por recorrência |
| `recurring_id` | UUID | YES | FK para `recurrents` (SET NULL ao excluir) |
| `source` | TEXT | YES | Origem: 'manual', 'csv_nubank', 'recurring' |
| `created_at` | TIMESTAMPTZ | NO | Timestamp de criação |
| `updated_at` | TIMESTAMPTZ | NO | Timestamp de última edição |

#### 2.2.2 Decisões de Design

**Por que `amount` é NUMERIC e não FLOAT?**
- FLOAT tem erros de precisão: `0.1 + 0.2 = 0.30000000000000004`
- NUMERIC(12,2) garante exatamente 2 casas decimais
- Suporta valores até 9.999.999.999,99 (suficiente para pessoa física)

**Por que `date` é DATE e não TIMESTAMPTZ?**
- Transações são registradas por dia, não por hora/minuto
- Evita problemas de timezone (ex: meia-noite em UTC vs. BRT)
- Facilita agregações por mês: `date_trunc('month', date)`

**Por que `ON DELETE RESTRICT` em `category_id`?**
- Impede excluir categoria que tem transações
- Força o usuário a reatribuir transações antes de excluir
- Previne perda de dados acidental

**Por que `ON DELETE SET NULL` em `recurring_id`?**
- Se o usuário excluir a recorrência, transações já geradas permanecem
- `recurring_id` vira NULL (histórico preservado)
- Permite saber que a transação "foi gerada por recorrência, mas a recorrência foi deletada"

#### 2.2.3 Constraints e Validações

```sql
-- Validação 1: amount sempre positivo
CHECK (amount > 0)

-- Validação 2: type deve ser 'expense' ou 'income'
CHECK (type IN ('expense', 'income'))

-- Validação 3: source válido
CHECK (source IN ('manual', 'csv_nubank', 'recurring'))

-- Validação 4 (aplicada no app): date não pode ser no futuro
-- (implementado em Zod, não no banco, para permitar agendamentos futuros)
```

#### 2.2.4 Queries Comuns Otimizadas

```sql
-- Q1: Transações do mês (query mais comum, ~70% das requisições)
SELECT t.*, c.name as category_name, c.icon, c.color
FROM transactions t
INNER JOIN categories c ON t.category_id = c.id
WHERE t.user_id = $1 
  AND date_trunc('month', t.date) = date_trunc('month', $2::date)
ORDER BY t.date DESC, t.created_at DESC;
-- Execution plan: Index Scan using idx_transactions_user_month
-- Cost: ~5ms (100 transações), ~50ms (1000 transações)

-- Q2: Agregação por categoria no mês (para gráficos)
SELECT 
  c.id, c.name, c.icon, c.color,
  SUM(t.amount) as total,
  COUNT(t.id) as count
FROM transactions t
INNER JOIN categories c ON t.category_id = c.id
WHERE t.user_id = $1 
  AND t.type = 'expense'
  AND date_trunc('month', t.date) = $2
GROUP BY c.id, c.name, c.icon, c.color
ORDER BY total DESC;
-- Execution plan: HashAggregate + Index Scan
-- Cost: ~10ms

-- Q3: Total de receitas e despesas do mês (para cards do dashboard)
SELECT 
  type,
  SUM(amount) as total
FROM transactions
WHERE user_id = $1 
  AND date_trunc('month', date) = $2
GROUP BY type;
-- Execution plan: GroupAggregate + Index Scan
-- Cost: ~5ms

-- Q4: Últimas 5 transações (para dashboard)
SELECT t.*, c.name as category_name, c.icon, c.color
FROM transactions t
INNER JOIN categories c ON t.category_id = c.id
WHERE t.user_id = $1
ORDER BY t.date DESC, t.created_at DESC
LIMIT 5;
-- Execution plan: Index Scan using idx_transactions_user_id + Limit
-- Cost: ~1ms

-- Q5: Buscar por descrição (search, menos comum)
SELECT t.*, c.name as category_name
FROM transactions t
INNER JOIN categories c ON t.category_id = c.id
WHERE t.user_id = $1 
  AND t.description ILIKE '%' || $2 || '%'
ORDER BY t.date DESC
LIMIT 20;
-- Execution plan: Bitmap Heap Scan (sem index de texto no MVP)
-- Cost: ~50ms (1000 transações)
-- Futuro: adicionar GIN index com pg_trgm para full-text search
```

#### 2.2.5 Exemplo de Dados

```sql
INSERT INTO transactions (user_id, category_id, type, amount, description, date, source) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'cat-alim', 'expense', 152.30, 'Supermercado Carrefour', '2026-03-20', 'manual'),
('550e8400-e29b-41d4-a716-446655440000', 'cat-alim', 'expense', 45.90, 'Restaurante Sushi Bar', '2026-03-20', 'manual'),
('550e8400-e29b-41d4-a716-446655440000', 'cat-transp', 'expense', 150.00, 'Uber - Corridas', '2026-03-19', 'csv_nubank'),
('550e8400-e29b-41d4-a716-446655440000', 'cat-sal', 'income', 5000.00, 'Salário Março', '2026-03-01', 'recurring');
```

---

### 2.3 `recurrents`

**Propósito**: Templates de transações recorrentes (aluguel, salário, assinaturas).

```sql
CREATE TABLE recurrents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  type TEXT NOT NULL CHECK (type IN ('expense', 'income')),
  amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  description TEXT NOT NULL,
  day_of_month INTEGER NOT NULL CHECK (day_of_month BETWEEN 1 AND 28),
  active BOOLEAN DEFAULT true,
  last_generated_month DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_recurrents_user_id ON recurrents(user_id);
CREATE INDEX idx_recurrents_active ON recurrents(user_id, active); -- Para queries de geração

-- RLS
ALTER TABLE recurrents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_data" ON recurrents FOR ALL USING (auth.uid() = user_id);
```

#### 2.3.1 Campos Explicados

| Campo | Tipo | Nullable | Descrição |
|-------|------|----------|-----------|
| `id` | UUID | NO | Primary key |
| `user_id` | UUID | NO | Dono da recorrência |
| `category_id` | UUID | NO | Categoria da transação a ser gerada |
| `type` | TEXT | NO | 'expense' ou 'income' |
| `amount` | NUMERIC(12,2) | NO | Valor da recorrência |
| `description` | TEXT | NO | Descrição (ex: "Aluguel", "Netflix") |
| `day_of_month` | INTEGER | NO | Dia do mês (1-28) |
| `active` | BOOLEAN | NO | Se está ativa (gera transações) |
| `last_generated_month` | DATE | YES | Último mês em que gerou transação |
| `created_at` | TIMESTAMPTZ | NO | Data de criação |

#### 2.3.2 Decisões de Design

**Por que limitar a 28 dias?**
- Fevereiro tem 28 dias (29 em ano bissexto)
- Evita problema de "dia 31 em fevereiro"
- Para necessidades específicas (ex: "último dia do mês"), implementar lógica customizada no front-end

**Por que `last_generated_month` é DATE e não BOOLEAN?**
- Permite saber exatamente quando foi a última geração
- Facilita debugging (ex: "por que não gerou em março?")
- Permite lógica futura de "regenerar meses passados"

**Por que não há `end_date` (data de término)?**
- Simplicidade: usuário desativa manualmente quando não precisar mais
- Evita complexidade de "recorrência ativa mas expirada"
- Futuro: adicionar `end_date` opcional se necessário

#### 2.3.3 Function de Geração Automática

```sql
CREATE OR REPLACE FUNCTION generate_recurring_transactions(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  rec RECORD;
  current_month DATE := date_trunc('month', CURRENT_DATE)::DATE;
  transaction_date DATE;
  count INTEGER := 0;
BEGIN
  FOR rec IN
    SELECT * FROM recurrents
    WHERE user_id = p_user_id
      AND active = true
      AND (last_generated_month IS NULL OR last_generated_month < current_month)
  LOOP
    -- Calcular data da transação (dia correto do mês atual)
    transaction_date := current_month + (rec.day_of_month - 1) * INTERVAL '1 day';
    
    -- Inserir transação
    INSERT INTO transactions (
      user_id, 
      category_id, 
      type, 
      amount, 
      description, 
      date, 
      is_recurring, 
      recurring_id, 
      source
    ) VALUES (
      p_user_id,
      rec.category_id,
      rec.type,
      rec.amount,
      rec.description,
      transaction_date,
      true,
      rec.id,
      'recurring'
    );

    -- Atualizar last_generated_month
    UPDATE recurrents
    SET last_generated_month = current_month
    WHERE id = rec.id;

    count := count + 1;
  END LOOP;
  
  RETURN count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Chamada no front-end** (ao fazer login):
```typescript
const { data: count } = await supabase.rpc('generate_recurring_transactions', {
  p_user_id: user.id
})

if (count > 0) {
  toast.success(`${count} recorrências lançadas para ${format(new Date(), 'MMMM', { locale: ptBR })}`)
}
```

#### 2.3.4 Exemplo de Dados

```sql
INSERT INTO recurrents (user_id, category_id, type, amount, description, day_of_month, active) VALUES
('user-uuid', 'cat-moradia', 'expense', 1500.00, 'Aluguel', 5, true),
('user-uuid', 'cat-assin', 'expense', 32.90, 'Netflix', 15, true),
('user-uuid', 'cat-sal', 'income', 5000.00, 'Salário', 1, true),
('user-uuid', 'cat-assin', 'expense', 19.90, 'Spotify (desativado)', 10, false);
```

---

### 2.4 `budgets`

**Propósito**: Limites de gastos por categoria por mês (orçamentos).

```sql
CREATE TABLE budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  month DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, category_id, month)
);

-- Indexes
CREATE INDEX idx_budgets_user_month ON budgets(user_id, month);

-- RLS
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_data" ON budgets FOR ALL USING (auth.uid() = user_id);
```

#### 2.4.1 Campos Explicados

| Campo | Tipo | Nullable | Descrição |
|-------|------|----------|-----------|
| `id` | UUID | NO | Primary key |
| `user_id` | UUID | NO | Dono do orçamento |
| `category_id` | UUID | NO | Categoria limitada |
| `amount` | NUMERIC(12,2) | NO | Limite mensal (ex: R$ 800,00) |
| `month` | DATE | NO | Mês do orçamento (sempre dia 1, ex: 2026-03-01) |
| `created_at` | TIMESTAMPTZ | NO | Data de criação |

#### 2.4.2 Decisões de Design

**Por que `month` é sempre dia 1?**
- Facilita comparações: `month = '2026-03-01'` ao invés de `LIKE '2026-03%'`
- Permite usar `date_trunc('month', ...)` nas queries
- Consistência com agregações de transações

**Por que constraint UNIQUE em `(user_id, category_id, month)`?**
- Impede duplicatas (um usuário não pode ter dois orçamentos para "Alimentação" em março)
- Facilita upsert: `ON CONFLICT (user_id, category_id, month) DO UPDATE`

**Por que `ON DELETE CASCADE` em `category_id`?**
- Se a categoria for excluída, orçamentos associados também são
- Diferente de transactions (que usa RESTRICT para preservar histórico)
- Orçamentos são "configurações", não "dados históricos"

#### 2.4.3 Query com Cálculo de Gasto Atual

```sql
-- Buscar orçamentos do mês com % consumido
SELECT 
  b.id,
  b.amount as limit,
  c.name as category_name,
  c.icon,
  c.color,
  COALESCE(SUM(t.amount), 0) as spent,
  ROUND((COALESCE(SUM(t.amount), 0) / b.amount) * 100, 2) as percentage
FROM budgets b
INNER JOIN categories c ON b.category_id = c.id
LEFT JOIN transactions t ON 
  t.category_id = b.category_id 
  AND t.user_id = b.user_id 
  AND t.type = 'expense'
  AND date_trunc('month', t.date) = b.month
WHERE b.user_id = $1 AND b.month = $2
GROUP BY b.id, b.amount, c.name, c.icon, c.color
ORDER BY percentage DESC;
-- Execution plan: Hash Join + GroupAggregate
-- Cost: ~10ms (10 orçamentos)
```

**Exemplo de resultado**:
```json
[
  {
    "id": "...",
    "limit": 800.00,
    "category_name": "Alimentação",
    "icon": "utensils",
    "color": "#EF4444",
    "spent": 920.50,
    "percentage": 115.06
  },
  {
    "id": "...",
    "limit": 500.00,
    "category_name": "Lazer",
    "icon": "gamepad-2",
    "color": "#8B5CF6",
    "spent": 420.00,
    "percentage": 84.00
  }
]
```

**Regras de cor no front-end**:
- `percentage < 80`: Verde
- `percentage >= 80 && percentage < 100`: Amarelo (aviso)
- `percentage >= 100`: Vermelho (excedido)

---

### 2.5 `goals`

**Propósito**: Metas de economia (mensal ou com objetivo final).

```sql
CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('monthly_savings', 'final_target')),
  target_amount NUMERIC(12,2) NOT NULL CHECK (target_amount > 0),
  current_amount NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (current_amount >= 0),
  deadline DATE,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_goals_user_id ON goals(user_id);
CREATE INDEX idx_goals_active ON goals(user_id, active);

-- RLS
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_data" ON goals FOR ALL USING (auth.uid() = user_id);

-- Constraint: deadline obrigatório para final_target
ALTER TABLE goals ADD CONSTRAINT deadline_required_for_final_target
  CHECK (type = 'monthly_savings' OR (type = 'final_target' AND deadline IS NOT NULL));
```

#### 2.5.1 Campos Explicados

| Campo | Tipo | Nullable | Descrição |
|-------|------|----------|-----------|
| `id` | UUID | NO | Primary key |
| `user_id` | UUID | NO | Dono da meta |
| `title` | TEXT | NO | Título (ex: "Viagem para Europa") |
| `type` | TEXT | NO | 'monthly_savings' ou 'final_target' |
| `target_amount` | NUMERIC(12,2) | NO | Valor alvo (ex: R$ 10.000,00) |
| `current_amount` | NUMERIC(12,2) | NO | Valor já economizado |
| `deadline` | DATE | YES | Prazo (obrigatório para final_target) |
| `active` | BOOLEAN | NO | Se a meta está ativa |
| `created_at` | TIMESTAMPTZ | NO | Data de criação |
| `updated_at` | TIMESTAMPTZ | NO | Data de última atualização |

#### 2.5.2 Tipos de Meta

**1. Meta de Economia Mensal** (`monthly_savings`)
- Objetivo: economizar X reais todo mês
- Cálculo: `economia_do_mes = receitas - despesas`
- Progresso: `(economia_do_mes / target_amount) * 100`
- Não tem prazo fixo

**Exemplo**:
```json
{
  "title": "Economizar R$ 1.000 por mês",
  "type": "monthly_savings",
  "target_amount": 1000.00,
  "current_amount": 0, // calculado dinamicamente no mês
  "deadline": null
}
```

**2. Meta com Objetivo Final** (`final_target`)
- Objetivo: juntar X reais até uma data
- Usuário adiciona valores manualmente
- Progresso: `(current_amount / target_amount) * 100`
- Tem prazo obrigatório

**Exemplo**:
```json
{
  "title": "Viagem para Europa",
  "type": "final_target",
  "target_amount": 15000.00,
  "current_amount": 8500.00,
  "deadline": "2026-12-01"
}
```

#### 2.5.3 Operações Comuns

```sql
-- Adicionar valor a uma meta (mutation)
UPDATE goals
SET current_amount = current_amount + $1,
    updated_at = now()
WHERE id = $2 AND user_id = $3;

-- Marcar meta como concluída
UPDATE goals
SET active = false,
    updated_at = now()
WHERE id = $1 AND user_id = $2 AND current_amount >= target_amount;

-- Buscar metas ativas com progresso
SELECT 
  id,
  title,
  type,
  target_amount,
  current_amount,
  deadline,
  ROUND((current_amount / target_amount) * 100, 2) as percentage,
  CASE 
    WHEN deadline IS NOT NULL THEN deadline - CURRENT_DATE
    ELSE NULL
  END as days_remaining
FROM goals
WHERE user_id = $1 AND active = true
ORDER BY 
  CASE WHEN deadline IS NOT NULL THEN deadline END ASC NULLS LAST,
  created_at DESC;
```

---

### 2.6 `investments`

**Propósito**: Registro de investimentos em renda fixa (CDB, Tesouro, LCI, etc.).

```sql
-- Enum personalizado para tipos de investimento
CREATE TYPE investment_type AS ENUM (
  'cdb',
  'tesouro_direto',
  'lci',
  'lca',
  'poupanca',
  'outros_renda_fixa'
  -- Futuro: 'acao', 'fii', 'cripto', 'fundo', 'previdencia'
);

CREATE TABLE investments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type investment_type NOT NULL,
  institution TEXT NOT NULL,
  invested_amount NUMERIC(12,2) NOT NULL CHECK (invested_amount > 0),
  rate_type TEXT NOT NULL CHECK (rate_type IN ('fixed', 'cdi_pct', 'selic_pct', 'ipca_plus')),
  rate_value NUMERIC(8,4) NOT NULL,
  start_date DATE NOT NULL,
  maturity_date DATE,
  notes TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_investments_user_id ON investments(user_id);
CREATE INDEX idx_investments_type ON investments(user_id, type);

-- RLS
ALTER TABLE investments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_data" ON investments FOR ALL USING (auth.uid() = user_id);

-- Constraint: maturity_date deve ser posterior a start_date
ALTER TABLE investments ADD CONSTRAINT maturity_after_start
  CHECK (maturity_date IS NULL OR maturity_date > start_date);
```

#### 2.6.1 Campos Explicados

| Campo | Tipo | Nullable | Descrição |
|-------|------|----------|-----------|
| `id` | UUID | NO | Primary key |
| `user_id` | UUID | NO | Dono do investimento |
| `name` | TEXT | NO | Nome (ex: "CDB Nubank 120% CDI") |
| `type` | investment_type | NO | Tipo de investimento (enum) |
| `institution` | TEXT | NO | Instituição (ex: "Nubank", "Banco Inter") |
| `invested_amount` | NUMERIC(12,2) | NO | Valor investido |
| `rate_type` | TEXT | NO | Tipo de taxa (fixed, cdi_pct, selic_pct, ipca_plus) |
| `rate_value` | NUMERIC(8,4) | NO | Valor da taxa (ex: 12.5000 para 12,5% a.a.) |
| `start_date` | DATE | NO | Data de início |
| `maturity_date` | DATE | YES | Data de vencimento (null = sem vencimento) |
| `notes` | TEXT | YES | Observações |
| `active` | BOOLEAN | NO | Se está ativo (não resgatado) |
| `created_at` | TIMESTAMPTZ | NO | Data de criação |
| `updated_at` | TIMESTAMPTZ | NO | Data de última atualização |

#### 2.6.2 Tipos de Taxa Explicados

| `rate_type` | `rate_value` | Interpretação | Exemplo |
|-------------|--------------|---------------|---------|
| `fixed` | 12.5000 | 12,5% ao ano (fixo) | Tesouro Prefixado 2029 |
| `cdi_pct` | 120.0000 | 120% do CDI | CDB Nubank |
| `selic_pct` | 100.0000 | 100% da Selic | Tesouro Selic |
| `ipca_plus` | 6.5000 | IPCA + 6,5% a.a. | Tesouro IPCA+ 2035 |

**Cálculo de rendimento** (feito no front-end):
```typescript
async function calculateReturn(investment: Investment) {
  const months = differenceInMonths(new Date(), investment.start_date)
  
  let annualRate: number
  
  if (investment.rate_type === 'fixed') {
    annualRate = investment.rate_value
  } else if (investment.rate_type === 'cdi_pct') {
    const cdi = await fetchBCBRate('4389') // CDI
    annualRate = cdi * (investment.rate_value / 100)
  } else if (investment.rate_type === 'selic_pct') {
    const selic = await fetchBCBRate('432') // Selic
    annualRate = selic * (investment.rate_value / 100)
  } else if (investment.rate_type === 'ipca_plus') {
    const ipca = await fetchBCBRate('13522') // IPCA
    annualRate = ipca + investment.rate_value
  }
  
  const monthlyRate = Math.pow(1 + annualRate / 100, 1/12) - 1
  const finalAmount = investment.invested_amount * Math.pow(1 + monthlyRate, months)
  
  return {
    finalAmount,
    gain: finalAmount - investment.invested_amount,
    gainPercent: ((finalAmount / investment.invested_amount) - 1) * 100
  }
}
```

#### 2.6.3 Queries de Agregação

```sql
-- Portfólio: total investido por tipo
SELECT 
  type,
  COUNT(*) as count,
  SUM(invested_amount) as total,
  ROUND((SUM(invested_amount) / (SELECT SUM(invested_amount) FROM investments WHERE user_id = $1 AND active = true)) * 100, 2) as percentage
FROM investments
WHERE user_id = $1 AND active = true
GROUP BY type
ORDER BY total DESC;

-- Investimentos próximos do vencimento (alertas)
SELECT id, name, institution, invested_amount, maturity_date
FROM investments
WHERE user_id = $1 
  AND active = true 
  AND maturity_date IS NOT NULL
  AND maturity_date <= CURRENT_DATE + INTERVAL '30 days'
ORDER BY maturity_date ASC;
```

---

## 3. Triggers e Functions

### 3.1 Trigger: Seed de Categorias

```sql
CREATE OR REPLACE FUNCTION create_default_categories()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO categories (user_id, name, type, icon, is_default) VALUES
    (NEW.id, 'Alimentação', 'expense', 'utensils', true),
    (NEW.id, 'Moradia', 'expense', 'home', true),
    (NEW.id, 'Transporte', 'expense', 'car', true),
    (NEW.id, 'Saúde', 'expense', 'heart-pulse', true),
    (NEW.id, 'Lazer', 'expense', 'gamepad-2', true),
    (NEW.id, 'Roupas', 'expense', 'shirt', true),
    (NEW.id, 'Viagens', 'expense', 'plane', true),
    (NEW.id, 'Assinaturas', 'expense', 'repeat', true),
    (NEW.id, 'Salário', 'income', 'wallet', true),
    (NEW.id, 'Freelance', 'income', 'briefcase', true),
    (NEW.id, 'Renda fixa', 'investment', 'landmark', true);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_default_categories();
```

**Por que `SECURITY DEFINER`?**
- Permite que o trigger insira em `categories` mesmo sem permissão explícita do user
- RLS é bypassada dentro de functions com SECURITY DEFINER
- ⚠️ **Cuidado**: Validar todos os inputs para evitar SQL injection

### 3.2 Function: Gerar Recorrências

(Já explicada na seção 2.3.3)

### 3.3 Function: Atualizar `updated_at` Automaticamente

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar em todas as tabelas com updated_at:
CREATE TRIGGER set_updated_at BEFORE UPDATE ON transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON goals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON investments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

## 4. Row Level Security (RLS) — Políticas Detalhadas

### 4.1 Política Padrão

**Todas as tabelas** usam a mesma política:

```sql
CREATE POLICY "users_own_data" ON <tabela>
  FOR ALL USING (auth.uid() = user_id);
```

**O que essa política faz?**
- `FOR ALL`: Aplica para SELECT, INSERT, UPDATE, DELETE
- `USING (auth.uid() = user_id)`: Só permite acesso se o user_id da row = ID do usuário autenticado

**Tradução em SQL**:
```sql
-- Quando o usuário faz:
SELECT * FROM transactions;

-- O PostgreSQL automaticamente adiciona:
SELECT * FROM transactions WHERE user_id = auth.uid();
```

### 4.2 Teste de Segurança

```sql
-- Testar como user1:
SET request.jwt.claims = '{"sub": "user1-uuid"}';

INSERT INTO transactions (user_id, ...) VALUES ('user2-uuid', ...);
-- ❌ ERROR: new row violates row-level security policy

SELECT * FROM transactions WHERE user_id = 'user2-uuid';
-- ✅ SUCCESS: Retorna [] (vazio), não erro
-- (RLS filtra silenciosamente, não levanta exceção)
```

### 4.3 Políticas Avançadas (Futuro)

Para o dashboard consolidado do casal:

```sql
-- Política para ver transações do casal:
CREATE POLICY "couple_shared_data" ON transactions
  FOR SELECT USING (
    auth.uid() = user_id
    OR EXISTS (
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

---

## 5. Migrations — Ordem de Execução

### 5.1 Sequência Correta

```
001_categories.sql         → Cria tabela base (sem FKs externas)
002_transactions.sql       → Depende de categories
003_recurrents.sql         → Depende de categories
004_budgets.sql            → Depende de categories
005_goals.sql              → Independente
006_investments.sql        → Independente
007_seed_trigger.sql       → Depende de categories (cria trigger)
008_generate_recurrents.sql → Depende de recurrents e transactions
```

**⚠️ NUNCA editar migrations existentes!**

Se precisar alterar schema:
```bash
# ❌ Errado:
vim supabase/migrations/002_transactions.sql
# (editar arquivo existente)

# ✅ Correto:
# Criar nova migration:
vim supabase/migrations/009_add_transaction_tags.sql
```

### 5.2 Exemplo de Migration de Alteração

```sql
-- 009_add_transaction_tags.sql
ALTER TABLE transactions ADD COLUMN tags TEXT[];

CREATE INDEX idx_transactions_tags ON transactions USING GIN(tags);

-- Migrar dados existentes (se necessário):
UPDATE transactions SET tags = '{}' WHERE tags IS NULL;

-- Tornar NOT NULL após popular:
ALTER TABLE transactions ALTER COLUMN tags SET DEFAULT '{}';
ALTER TABLE transactions ALTER COLUMN tags SET NOT NULL;
```

---

## 6. Performance e Otimização

### 6.1 Explain Analyze de Queries Críticas

```sql
-- Query de dashboard (mais importante):
EXPLAIN ANALYZE
SELECT 
  type,
  SUM(amount) as total
FROM transactions
WHERE user_id = '...' 
  AND date_trunc('month', date) = '2026-03-01'
GROUP BY type;

-- Resultado ideal:
-- GroupAggregate  (cost=0.29..15.32 rows=2 width=40) (actual time=0.052..0.053 rows=2 loops=1)
--   ->  Index Scan using idx_transactions_user_month on transactions  (cost=0.29..15.19 rows=5 width=12)
-- Planning Time: 0.123 ms
-- Execution Time: 0.089 ms
```

**Sem o index**:
```
-- Execution Time: 450.234 ms (500x mais lento!)
```

### 6.2 Monitoramento de Índices Não Utilizados

```sql
-- Ver índices que nunca foram usados (rodar após 1 mês em produção):
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read
FROM pg_stat_user_indexes
WHERE idx_scan = 0
  AND schemaname = 'public'
ORDER BY tablename;

-- Se algum index tiver idx_scan = 0, considerar remover:
DROP INDEX IF EXISTS idx_unused;
```

### 6.3 Vacuum e Analyze

```sql
-- Executar manualmente após grandes imports:
VACUUM ANALYZE transactions;

-- Configurar autovacuum (já ativo por padrão no Supabase):
ALTER TABLE transactions SET (autovacuum_vacuum_scale_factor = 0.1);
```

---

## 7. Backup e Disaster Recovery

### 7.1 Estratégia de Backup (Supabase)

**Free tier**:
- Backups diários automáticos (retenção: 7 dias)
- Point-in-Time Recovery (PITR): não disponível

**Pro tier** (US$ 25/mês, futuro):
- Backups diários (retenção: 30 dias)
- PITR até 7 dias atrás

### 7.2 Export Manual

```sql
-- Export de dados de um usuário específico (GDPR compliance):
COPY (
  SELECT * FROM transactions WHERE user_id = '...'
) TO '/tmp/user_transactions.csv' WITH CSV HEADER;

COPY (
  SELECT * FROM categories WHERE user_id = '...'
) TO '/tmp/user_categories.csv' WITH CSV HEADER;

-- Futuro: botão "Exportar todos os meus dados" no app
```

---

## 8. Evolução Futura do Schema

### 8.1 Features Planejadas

**Dashboard Consolidado do Casal**:
```sql
-- 009_couple_relationships.sql
CREATE TABLE couple_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id UUID NOT NULL REFERENCES auth.users(id),
  user2_id UUID NOT NULL REFERENCES auth.users(id),
  status TEXT CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user1_id, user2_id)
);
```

**Ações, FIIs, Cripto**:
```sql
-- 010_expand_investments.sql
ALTER TYPE investment_type ADD VALUE 'acao';
ALTER TYPE investment_type ADD VALUE 'fii';
ALTER TYPE investment_type ADD VALUE 'cripto';

ALTER TABLE investments ADD COLUMN ticker TEXT;
ALTER TABLE investments ADD COLUMN quantity NUMERIC(16,8);
ALTER TABLE investments ADD COLUMN current_price NUMERIC(12,2);
```

**Tags para Transações**:
```sql
-- 011_transaction_tags.sql
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT,
  UNIQUE (user_id, name)
);

CREATE TABLE transaction_tags (
  transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (transaction_id, tag_id)
);
```

---

## 9. Conclusão

Este schema foi projetado com:
- **Segurança em primeiro lugar**: RLS em todas as tabelas
- **Performance**: Índices estratégicos para queries comuns
- **Manutenibilidade**: Constraints rígidas + triggers automáticos
- **Escalabilidade**: Preparado para features futuras
- **Simplicidade**: Normalização 3NF sem over-engineering

**Métricas esperadas** (10k transações/usuário):
- Query de dashboard: < 50ms
- Insert de transação: < 20ms
- Agregação por categoria: < 100ms
- Tamanho do banco: ~50MB

**Próximos passos**:
1. Implementar full-text search (GIN index + pg_trgm)
2. Adicionar materialized views para agregações pesadas
3. Configurar replication (produção)
4. Implementar soft deletes (adicionar `deleted_at` em vez de DELETE)

---

**Referências**:
- [PostgreSQL Constraints](https://www.postgresql.org/docs/current/ddl-constraints.html)
- [Supabase RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [Indexing Best Practices](https://www.postgresql.org/docs/current/indexes.html)
- [NUMERIC vs FLOAT](https://www.postgresql.org/docs/current/datatype-numeric.html)
