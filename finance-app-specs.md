# Projeto: App de Gestão Financeira para Casal
**Versão:** 1.0  
**Público-alvo deste documento:** agente de IA responsável pelo desenvolvimento  
**Idioma do app:** Português (pt-BR)

---

## 1. Visão Geral

Aplicação web mobile-first de controle financeiro pessoal para uso de dois usuários (casal). Cada usuário tem dados completamente isolados. A arquitetura deve ser preparada para suportar uma futura visão consolidada do casal, mas isso não deve ser implementado agora.

**Princípios-guia:**
- Custo zero de infraestrutura (usar apenas free tiers)
- Mobile-first em todas as telas
- Dados isolados por usuário via Row Level Security no Supabase
- Código limpo, tipado com TypeScript, pronto para expansão futura

---

## 2. Stack de Tecnologias

| Camada | Tecnologia | Justificativa |
|---|---|---|
| Framework | Next.js 14 (App Router) | SSR, PWA, routing moderno |
| Linguagem | TypeScript (strict mode) | Segurança de tipos |
| Banco de dados | Supabase (PostgreSQL) | Auth + DB + Storage + Edge Functions gratuitos |
| Autenticação | Supabase Auth — Google OAuth | Sem senha, mais prático |
| Hospedagem | Vercel (Hobby plan) | Deploy automático, HTTPS, CDN global |
| Estilo | Tailwind CSS + shadcn/ui | Componentes acessíveis, dark mode nativo |
| Gráficos | Recharts | Responsivo, bom suporte a pie/line charts |
| CSV parsing | Papa Parse | Parse client-side, sem backend |
| PDF export | jsPDF + jspdf-autotable | Client-side, sem servidor |
| Excel export | SheetJS (xlsx) | Client-side, sem servidor |
| Formulários | React Hook Form + Zod | Validação tipada |
| Estado global | Zustand | Leve, simples |
| Datas | date-fns | Leve, tree-shakeable |
| HTTP/fetch | TanStack Query (React Query) | Cache, loading states, refetch automático |

### Versões a instalar
```
next@14
typescript@5
@supabase/supabase-js@2
@supabase/ssr@latest
tailwindcss@3
shadcn/ui (CLI: npx shadcn-ui@latest init)
recharts@2
papaparse@5
jspdf@2
jspdf-autotable@3
xlsx@0.18
react-hook-form@7
@hookform/resolvers@3
zod@3
zustand@4
date-fns@3
@tanstack/react-query@5
```

---

## 3. Arquitetura da Aplicação

### 3.1 Estrutura de Pastas

```
/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Grupo de rotas públicas
│   │   └── login/
│   │       └── page.tsx
│   ├── (app)/                    # Grupo de rotas protegidas
│   │   ├── layout.tsx            # Layout com nav mobile
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── transacoes/
│   │   │   ├── page.tsx
│   │   │   └── nova/
│   │   │       └── page.tsx
│   │   ├── metas/
│   │   │   └── page.tsx
│   │   ├── investimentos/
│   │   │   └── page.tsx
│   │   └── configuracoes/
│   │       └── page.tsx
│   ├── api/
│   │   └── bcb-proxy/
│   │       └── route.ts          # Edge Route: proxy para API do BCB
│   ├── layout.tsx                # Root layout
│   └── globals.css
├── components/
│   ├── ui/                       # shadcn/ui components (gerados pelo CLI)
│   ├── charts/
│   │   ├── PieChart.tsx
│   │   └── LineChart.tsx
│   ├── forms/
│   │   ├── TransactionForm.tsx
│   │   ├── BudgetForm.tsx
│   │   ├── GoalForm.tsx
│   │   └── InvestmentForm.tsx
│   ├── layout/
│   │   ├── BottomNav.tsx         # Navegação mobile inferior
│   │   └── PageHeader.tsx
│   └── shared/
│       ├── MonthPicker.tsx
│       ├── CategoryBadge.tsx
│       └── CurrencyInput.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts             # Supabase browser client
│   │   ├── server.ts             # Supabase server client (SSR)
│   │   └── middleware.ts
│   ├── hooks/
│   │   ├── useTransactions.ts
│   │   ├── useBudgets.ts
│   │   ├── useGoals.ts
│   │   └── useInvestments.ts
│   ├── utils/
│   │   ├── currency.ts           # Formatação BRL
│   │   ├── csv-parsers/
│   │   │   └── nubank.ts
│   │   ├── export/
│   │   │   ├── pdf.ts
│   │   │   └── excel.ts
│   │   └── bcb.ts               # Funções de fetch das taxas BCB
│   └── types/
│       └── index.ts              # Todos os tipos TypeScript do domínio
├── store/
│   └── useAppStore.ts            # Zustand store global
├── middleware.ts                  # Proteção de rotas + refresh de sessão
├── public/
│   ├── manifest.json             # PWA manifest
│   └── icons/                    # Ícones do app (PWA)
└── supabase/
    ├── migrations/               # SQL migrations versionadas
    └── functions/
        └── weekly-summary/       # Edge Function para resumo semanal
            └── index.ts
```

### 3.2 Arquitetura de Dados (Fluxo)

```
Usuário (browser)
    │
    ├── Ações de leitura
    │   └── TanStack Query → Supabase JS Client → Supabase DB (RLS filtra por user_id)
    │
    ├── Ações de escrita
    │   └── React Hook Form → Zod validation → Supabase JS Client → Supabase DB
    │
    ├── Import CSV
    │   └── File input → Papa Parse (client) → validação Zod → Supabase bulk insert
    │
    ├── Taxas BCB
    │   └── Recharts Calculator → /api/bcb-proxy → BCB API externa → cache 24h (headers)
    │
    └── Export
        └── TanStack Query (dados) → jsPDF ou SheetJS → download direto no browser
```

### 3.3 Segurança e Isolamento de Dados

Toda tabela que pertence a um usuário deve ter a coluna `user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE`.

Row Level Security deve ser habilitada em todas as tabelas e todas as políticas devem seguir o padrão:

```sql
-- Habilitar RLS
ALTER TABLE <tabela> ENABLE ROW LEVEL SECURITY;

-- Política padrão: usuário só acessa os próprios dados
CREATE POLICY "users_own_data" ON <tabela>
  FOR ALL USING (auth.uid() = user_id);
```

Nunca desabilitar RLS. Nunca criar políticas permissivas sem filtro de `user_id`.

---

## 4. Schema do Banco de Dados

Execute as migrations na ordem abaixo. Cada migration é um arquivo SQL em `/supabase/migrations/`.

### Migration 001 — Categorias

```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('expense', 'income', 'investment')),
  icon TEXT,                        -- nome de ícone (ex: "shopping-cart")
  color TEXT,                       -- hex color (ex: "#FF5733")
  is_default BOOLEAN DEFAULT false, -- categorias padrão do sistema
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_data" ON categories FOR ALL USING (auth.uid() = user_id);
CREATE INDEX idx_categories_user_id ON categories(user_id);
```

**Categorias padrão a inserir via seed (para cada novo usuário via trigger):**

| name | type | icon |
|---|---|---|
| Alimentação | expense | utensils |
| Moradia | expense | home |
| Transporte | expense | car |
| Saúde | expense | heart-pulse |
| Lazer | expense | gamepad-2 |
| Roupas | expense | shirt |
| Viagens | expense | plane |
| Assinaturas | expense | repeat |
| Salário | income | wallet |
| Freelance | income | briefcase |
| Investimentos | investment | trending-up |
| Renda fixa | investment | landmark |

### Migration 002 — Transações

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
  recurring_id UUID,                -- referência ao registro de recorrência
  source TEXT CHECK (source IN ('manual', 'csv_nubank', 'recurring')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_data" ON transactions FOR ALL USING (auth.uid() = user_id);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_transactions_user_month ON transactions(user_id, date_trunc('month', date));
```

### Migration 003 — Recorrências

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
  last_generated_month DATE,        -- último mês em que gerou transação
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE recurrents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_data" ON recurrents FOR ALL USING (auth.uid() = user_id);
CREATE INDEX idx_recurrents_user_id ON recurrents(user_id);
```

### Migration 004 — Orçamentos (limites por categoria)

```sql
CREATE TABLE budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  month DATE NOT NULL,              -- sempre dia 1 do mês (ex: 2025-07-01)
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, category_id, month)
);

ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_data" ON budgets FOR ALL USING (auth.uid() = user_id);
CREATE INDEX idx_budgets_user_month ON budgets(user_id, month);
```

### Migration 005 — Metas

```sql
CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('monthly_savings', 'final_target')),
  target_amount NUMERIC(12,2) NOT NULL CHECK (target_amount > 0),
  current_amount NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (current_amount >= 0),
  deadline DATE,                    -- obrigatório para type='final_target'
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_data" ON goals FOR ALL USING (auth.uid() = user_id);
CREATE INDEX idx_goals_user_id ON goals(user_id);
```

### Migration 006 — Investimentos

```sql
-- Tipos de investimento (expansível futuramente)
CREATE TYPE investment_type AS ENUM (
  'cdb',
  'tesouro_direto',
  'lci',
  'lca',
  'poupanca',
  'outros_renda_fixa'
  -- Adicionar no futuro: 'acao', 'fii', 'fundo', 'cripto', 'previdencia'
);

CREATE TABLE investments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,               -- ex: "CDB Nubank 120% CDI"
  type investment_type NOT NULL,
  institution TEXT NOT NULL,        -- ex: "Nubank", "Tesouro Direto"
  invested_amount NUMERIC(12,2) NOT NULL CHECK (invested_amount > 0),
  rate_type TEXT NOT NULL CHECK (rate_type IN ('fixed', 'cdi_pct', 'selic_pct', 'ipca_plus')),
  rate_value NUMERIC(8,4) NOT NULL, -- ex: 12.5 para 12.5% a.a., ou 110 para 110% CDI
  start_date DATE NOT NULL,
  maturity_date DATE,               -- null = sem vencimento (poupança, etc)
  notes TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE investments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_data" ON investments FOR ALL USING (auth.uid() = user_id);
CREATE INDEX idx_investments_user_id ON investments(user_id);
```

### Migration 007 — Trigger: seed de categorias para novo usuário

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

### Migration 008 — Função: gerar transações recorrentes

```sql
-- Chamada pelo cliente ao fazer login ou ao abrir o app
-- Gera transações do mês atual para recorrências ativas que ainda não foram geradas
CREATE OR REPLACE FUNCTION generate_recurring_transactions(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  rec RECORD;
  current_month DATE := date_trunc('month', CURRENT_DATE);
  count INTEGER := 0;
BEGIN
  FOR rec IN
    SELECT * FROM recurrents
    WHERE user_id = p_user_id
      AND active = true
      AND (last_generated_month IS NULL OR last_generated_month < current_month)
  LOOP
    INSERT INTO transactions (
      user_id, category_id, type, amount, description, date, is_recurring, recurring_id, source
    ) VALUES (
      p_user_id,
      rec.category_id,
      rec.type,
      rec.amount,
      rec.description,
      (current_month + (rec.day_of_month - 1) * INTERVAL '1 day')::DATE,
      true,
      rec.id,
      'recurring'
    );

    UPDATE recurrents
    SET last_generated_month = current_month
    WHERE id = rec.id;

    count := count + 1;
  END LOOP;
  RETURN count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 5. Variáveis de Ambiente

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=           # URL do projeto Supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=      # chave anon pública do Supabase
```

Nunca expor a `service_role` key no cliente. Toda lógica privilegiada vai em Edge Functions ou Server Actions com o client de servidor.

---

## 6. Configuração PWA

### public/manifest.json
```json
{
  "name": "Finanças",
  "short_name": "Finanças",
  "description": "Controle financeiro pessoal",
  "start_url": "/dashboard",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#ffffff",
  "orientation": "portrait",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

### next.config.js
Instalar `next-pwa` e configurar para gerar service worker em produção.

---

## 7. API Route: Proxy BCB

**Arquivo:** `app/api/bcb-proxy/route.ts`

Este endpoint evita bloqueio de CORS na API do Banco Central. Ele faz fetch da taxa, adiciona cache de 24h e retorna para o cliente.

```typescript
// Séries temporais usadas:
// Selic: 432
// CDI: 4389
// IPCA: 13522

// Query params: ?serie=432
// Response: { value: number, date: string, period: 'annual' | 'monthly' }
// Cache-Control: public, s-maxage=86400, stale-while-revalidate=3600
```

**Critério de aceitação:** a rota deve retornar em menos de 2s, incluir header `Cache-Control: public, s-maxage=86400`, e retornar `{ error: string }` com status 503 se a API do BCB estiver indisponível.

---

## 8. Tipos TypeScript Globais

**Arquivo:** `lib/types/index.ts`

```typescript
export type TransactionType = 'expense' | 'income'
export type CategoryType = 'expense' | 'income' | 'investment'
export type RateType = 'fixed' | 'cdi_pct' | 'selic_pct' | 'ipca_plus'
export type InvestmentType = 'cdb' | 'tesouro_direto' | 'lci' | 'lca' | 'poupanca' | 'outros_renda_fixa'
export type GoalType = 'monthly_savings' | 'final_target'

export interface Category {
  id: string
  user_id: string
  name: string
  type: CategoryType
  icon?: string
  color?: string
  is_default: boolean
  created_at: string
}

export interface Transaction {
  id: string
  user_id: string
  category_id: string
  category?: Category
  type: TransactionType
  amount: number
  description: string
  date: string        // ISO date string YYYY-MM-DD
  notes?: string
  is_recurring: boolean
  recurring_id?: string
  source: 'manual' | 'csv_nubank' | 'recurring'
  created_at: string
  updated_at: string
}

export interface Recurrent {
  id: string
  user_id: string
  category_id: string
  category?: Category
  type: TransactionType
  amount: number
  description: string
  day_of_month: number
  active: boolean
  last_generated_month?: string
  created_at: string
}

export interface Budget {
  id: string
  user_id: string
  category_id: string
  category?: Category
  amount: number
  month: string       // YYYY-MM-01
  created_at: string
}

export interface Goal {
  id: string
  user_id: string
  title: string
  type: GoalType
  target_amount: number
  current_amount: number
  deadline?: string
  active: boolean
  created_at: string
  updated_at: string
}

export interface Investment {
  id: string
  user_id: string
  name: string
  type: InvestmentType
  institution: string
  invested_amount: number
  rate_type: RateType
  rate_value: number
  start_date: string
  maturity_date?: string
  notes?: string
  active: boolean
  created_at: string
  updated_at: string
}

// Resultado da calculadora de investimentos
export interface InvestmentProjection {
  months: number
  finalAmount: number
  totalInvested: number
  gain: number
  gainPercent: number
  monthlyBreakdown: Array<{
    month: number
    balance: number
    invested: number
  }>
}

// Dados do dashboard
export interface DashboardSummary {
  month: string
  totalIncome: number
  totalExpenses: number
  balance: number
  expensesByCategory: Array<{
    category: Category
    total: number
    percentage: number
  }>
}
```

---

## 9. Middleware de Autenticação

**Arquivo:** `middleware.ts`

- Intercepta todas as rotas do grupo `(app)`
- Se não houver sessão válida, redirecionar para `/login`
- Chamar `supabase.auth.getSession()` para renovar tokens automaticamente
- Rotas públicas: `/login`, `/api/bcb-proxy`
- Após login bem-sucedido, chamar `generate_recurring_transactions(user_id)` via RPC do Supabase

---

## 10. Sprints de Desenvolvimento

---

### Sprint 0 — Setup e Infraestrutura
**Objetivo:** Repositório funcional com autenticação e deploy automático.  
**Estimativa:** 3–5 dias

---

#### TASK-001: Inicializar repositório Next.js com TypeScript
**Descrição:** Criar o projeto base com todas as dependências configuradas.

**Passos:**
1. `npx create-next-app@latest --typescript --tailwind --app --src-dir=false`
2. Instalar todas as dependências listadas na seção 2
3. Inicializar shadcn/ui com `npx shadcn-ui@latest init` (tema: zinc, dark mode: class)
4. Configurar `tsconfig.json` com `strict: true` e alias `@/` para a raiz
5. Criar estrutura de pastas conforme seção 3.1
6. Criar arquivo `lib/types/index.ts` com todos os tipos da seção 8
7. Configurar ESLint e Prettier

**Critérios de aceitação:**
- `npm run dev` sobe sem erros
- `npm run build` compila sem erros de TypeScript
- Alias `@/` funciona nos imports
- Estrutura de pastas conforme seção 3.1 está criada

---

#### TASK-002: Configurar Supabase
**Descrição:** Criar projeto Supabase, executar migrations e configurar Auth.

**Passos:**
1. Criar projeto no Supabase Dashboard
2. Executar as migrations 001 a 008 em ordem no SQL Editor do Supabase
3. No Supabase Dashboard → Authentication → Providers: habilitar Google OAuth
4. Configurar URLs permitidas: `http://localhost:3000` e URL de produção
5. Criar `lib/supabase/client.ts` (browser client com `createBrowserClient`)
6. Criar `lib/supabase/server.ts` (server client com `createServerClient` + cookies)
7. Criar `.env.local` com as variáveis da seção 5

**Critérios de aceitação:**
- Todas as migrations executam sem erro
- Trigger de criação de categorias está ativo (verificar no Dashboard)
- RLS está habilitado em todas as tabelas (verificar: `SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public'` — todos devem ter `rowsecurity = true`)
- `supabase.auth.getSession()` retorna sem erro no console do browser

---

#### TASK-003: Autenticação com Google
**Descrição:** Implementar fluxo completo de login e logout.

**Passos:**
1. Criar página `app/(auth)/login/page.tsx`
   - Botão "Entrar com Google" centralizado na tela
   - Logo e nome do app acima do botão
   - Chamar `supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: '/dashboard' } })`
2. Criar `middleware.ts` conforme seção 9
3. Criar rota de callback `app/auth/callback/route.ts` para processar o retorno do OAuth
4. Adicionar botão de logout acessível em todas as telas autenticadas
   - Logout chama `supabase.auth.signOut()` e redireciona para `/login`

**Critérios de aceitação:**
- Usuário não autenticado em `/dashboard` é redirecionado para `/login`
- Fluxo completo de login com Google funciona sem erro
- Após login, usuário é redirecionado para `/dashboard`
- Após logout, sessão é destruída e usuário vai para `/login`
- As categorias padrão são criadas automaticamente no primeiro login (verificar na tabela `categories`)

---

#### TASK-004: Layout mobile com navegação inferior
**Descrição:** Criar o layout base do app com a navegação principal mobile.

**Componentes a criar:**
- `components/layout/BottomNav.tsx`: barra de navegação fixa na parte inferior com 4 ícones
  - Dashboard (ícone: `LayoutDashboard`)
  - Transações (ícone: `ArrowLeftRight`)
  - Metas (ícone: `Target`)
  - Investimentos (ícone: `TrendingUp`)
- `components/layout/PageHeader.tsx`: cabeçalho de página com título e ação opcional (ex: botão "+")
- `app/(app)/layout.tsx`: layout que envolve todas as rotas autenticadas com `BottomNav`

**Critérios de aceitação:**
- Navegação inferior é visível em todas as telas do grupo `(app)`
- Item ativo tem destaque visual
- Layout não quebra em telas de 375px de largura (iPhone SE)
- Safe area do iOS é respeitada (usar `pb-safe` ou `padding-bottom: env(safe-area-inset-bottom)`)

---

#### TASK-005: Configurar PWA
**Descrição:** Tornar o app instalável como PWA.

**Passos:**
1. Criar `public/manifest.json` conforme seção 6
2. Gerar ícones 192x192 e 512x512 (pode ser placeholder colorido)
3. Instalar e configurar `next-pwa`
4. Adicionar `<link rel="manifest">` e meta tags no root layout

**Critérios de aceitação:**
- No Chrome mobile, o app exibe opção "Adicionar à tela inicial"
- Após instalação, abre sem a barra do browser (modo standalone)
- Lighthouse PWA score ≥ 90

---

#### TASK-006: Deploy inicial na Vercel
**Descrição:** Configurar CI/CD e primeiro deploy em produção.

**Passos:**
1. Criar repositório no GitHub
2. Conectar repositório à Vercel
3. Configurar variáveis de ambiente na Vercel (mesmas do `.env.local`)
4. Adicionar URL de produção da Vercel nas URLs permitidas do Supabase Auth
5. Confirmar que `npm run build` passa na Vercel sem erros

**Critérios de aceitação:**
- Cada push para `main` dispara deploy automático
- App em produção faz login com Google sem erro
- HTTPS ativo

---

### Sprint 1 — Transações
**Objetivo:** CRUD completo de transações com categorias.  
**Estimativa:** 5–7 dias

---

#### TASK-007: Hook `useTransactions`
**Arquivo:** `lib/hooks/useTransactions.ts`

**Descrição:** Toda a lógica de acesso a transações centralizada em um hook com TanStack Query.

**Funções a implementar:**
- `useTransactions(month: Date)` — lista transações do mês, join com categories
- `useCreateTransaction(data)` — inserção com invalidação de cache
- `useUpdateTransaction(id, data)` — atualização
- `useDeleteTransaction(id)` — remoção

**Query key pattern:** `['transactions', userId, 'YYYY-MM']`

**Critérios de aceitação:**
- Transações são filtradas pelo `user_id` do usuário autenticado (RLS garante, mas o hook também deve filtrar na query)
- Loading e error states são expostos pelo hook
- Após mutação, a lista atualiza automaticamente sem reload
- Transações vêm ordenadas por `date DESC`

---

#### TASK-008: Formulário de nova transação
**Arquivo:** `components/forms/TransactionForm.tsx`

**Campos obrigatórios:**
- Tipo (receita / despesa) — toggle visual
- Valor — input numérico formatado como BRL (ex: R$ 1.500,00)
- Descrição — text input
- Categoria — select com ícone, filtrado pelo tipo selecionado
- Data — date picker com default = hoje

**Campos opcionais:**
- Notas — textarea

**Validação Zod:**
```typescript
const schema = z.object({
  type: z.enum(['expense', 'income']),
  amount: z.number().positive('Valor deve ser maior que zero'),
  description: z.string().min(1, 'Descrição obrigatória').max(100),
  category_id: z.string().uuid('Selecione uma categoria'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida'),
  notes: z.string().max(500).optional(),
})
```

**Critérios de aceitação:**
- Erro de validação exibido inline abaixo de cada campo
- Input de valor aceita apenas números, formata automaticamente como BRL
- Submit desabilitado enquanto a requisição está em andamento
- Após salvar com sucesso, formulário fecha/limpa e lista atualiza
- Categorias no select são as do usuário logado (não de outro usuário)

---

#### TASK-009: Página de transações
**Arquivo:** `app/(app)/transacoes/page.tsx`

**Layout:**
- Cabeçalho com mês atual e setas para navegar entre meses
- Cards de resumo: Total Receitas | Total Despesas | Saldo
- Lista de transações agrupadas por data (ex: "Hoje", "Ontem", "12 de julho")
- Cada item: ícone da categoria, descrição, valor (vermelho para despesa, verde para receita), data
- Botão flutuante "+" no canto inferior direito para nova transação
- Estado vazio: ilustração e texto "Nenhuma transação em [mês]"

**Critérios de aceitação:**
- Trocar mês recarrega os dados sem piscar a tela
- Swipe left em um item (mobile) revela botões de editar e excluir (ou long press abre menu)
- Saldo = receitas − despesas, com cor verde (positivo) ou vermelho (negativo)
- Scroll funciona corretamente com a `BottomNav` fixa

---

#### TASK-010: Recorrências
**Arquivo:** `app/(app)/configuracoes/page.tsx` (seção de recorrências)

**Descrição:** CRUD de despesas e receitas recorrentes.

**Formulário de recorrência (campos):**
- Tipo (receita / despesa)
- Valor
- Descrição
- Categoria
- Dia do mês (1–28, usar 28 como máximo para evitar problemas com fevereiro)
- Status (ativa / inativa)

**Lógica de geração automática:**
- Ao fazer login, chamar `supabase.rpc('generate_recurring_transactions', { p_user_id: userId })`
- Exibir toast de confirmação com quantidade de transações geradas (ex: "2 recorrências lançadas para julho")
- Se count = 0, não exibir nada

**Critérios de aceitação:**
- Transações geradas por recorrência aparecem na lista com badge "Recorrente"
- Desativar uma recorrência não apaga transações já geradas
- Excluir uma recorrência não apaga transações já geradas (ON DELETE não há cascade aqui — `recurring_id` fica como referência histórica)
- Recorrência não é gerada duas vezes no mesmo mês

---

### Sprint 2 — Dashboard e Gráficos
**Objetivo:** Dashboard com visualizações do mês atual.  
**Estimativa:** 4–5 dias

---

#### TASK-011: Hook `useDashboard`
**Arquivo:** `lib/hooks/useDashboard.ts`

**Descrição:** Agregar dados do mês para o dashboard.

**Retorna:**
```typescript
interface DashboardData {
  totalIncome: number
  totalExpenses: number
  balance: number
  expensesByCategory: Array<{
    category: Category
    total: number
    percentage: number
  }>
  recentTransactions: Transaction[]  // últimas 5
}
```

**Implementação:** fazer a query de transações do mês e calcular os agregados no cliente (não precisa de view SQL para o MVP).

**Critérios de aceitação:**
- Dados são corretos para o mês selecionado
- Se não houver transações, todos os valores são 0 e array é vazio
- Query executa em menos de 500ms

---

#### TASK-012: Componente PieChart de gastos
**Arquivo:** `components/charts/PieChart.tsx`

**Biblioteca:** Recharts — usar `PieChart`, `Pie`, `Cell`, `Legend`, `Tooltip`

**Comportamento:**
- Cada fatia representa uma categoria de despesa do mês
- Cor de cada fatia: usar a propriedade `color` da categoria, ou gerar cor a partir do nome se `color` for null
- Tooltip ao tocar na fatia: exibir nome da categoria, valor (BRL) e percentual
- Legenda abaixo do gráfico (não ao lado — mobile)
- Estado vazio: círculo cinza com texto "Nenhum gasto no mês"

**Critérios de aceitação:**
- Gráfico é responsivo (ocupa 100% da largura do container)
- Funciona corretamente em dark mode
- Toque/click em fatia exibe tooltip com informações corretas
- Categorias com valor 0 não aparecem no gráfico

---

#### TASK-013: Página Dashboard
**Arquivo:** `app/(app)/dashboard/page.tsx`

**Layout (de cima para baixo):**
1. Saudação ("Olá, [nome]") + mês atual
2. Cards de resumo: Receitas | Despesas | Saldo (3 cards em linha)
3. Título "Gastos por categoria" + PieChart
4. Título "Últimas transações" + lista das 5 mais recentes com link "Ver todas"
5. Se houver orçamentos: seção "Orçamentos do mês" com barras de progresso

**Critérios de aceitação:**
- Página carrega em menos de 1s em conexão 4G
- Saldo negativo exibido em vermelho
- Link "Ver todas" vai para `/transacoes`
- Pull-to-refresh atualiza os dados (usar padrão nativo do browser ou botão de refresh)

---

#### TASK-014: Comparativo entre meses
**Arquivo:** `components/charts/LineChart.tsx` + seção na página de transações

**Descrição:** Gráfico de linha mostrando receitas e despesas dos últimos 6 meses.

**Biblioteca:** Recharts — `LineChart`, `Line`, `XAxis`, `YAxis`, `CartesianGrid`, `Tooltip`, `Legend`

**Dados:** buscar agregados dos últimos 6 meses com uma única query:
```sql
SELECT 
  date_trunc('month', date) as month,
  type,
  SUM(amount) as total
FROM transactions
WHERE user_id = auth.uid()
  AND date >= date_trunc('month', CURRENT_DATE) - INTERVAL '5 months'
GROUP BY 1, 2
ORDER BY 1
```

**Critérios de aceitação:**
- Eixo X mostra mês abreviado em pt-BR (ex: "Jan", "Fev")
- Eixo Y formata valores em BRL abreviado (ex: "R$1,2k")
- Mês atual é destacado visualmente
- Gráfico aparece na aba de transações, abaixo do resumo

---

### Sprint 3 — Metas e Orçamentos
**Objetivo:** Sistema de metas e limites por categoria.  
**Estimativa:** 4–5 dias

---

#### TASK-015: Hook `useBudgets` e `useGoals`
**Arquivos:** `lib/hooks/useBudgets.ts`, `lib/hooks/useGoals.ts`

**useBudgets:**
- `useBudgets(month)` — lista orçamentos do mês com gastos reais calculados
- `useCreateBudget(data)`, `useUpdateBudget(id, data)`, `useDeleteBudget(id)`
- Para cada orçamento, calcular `spent` (soma das transações da categoria no mês)

**useGoals:**
- `useGoals()` — lista metas ativas
- `useCreateGoal(data)`, `useUpdateGoal(id, data)`, `useDeleteGoal(id)`
- `useAddToGoal(id, amount)` — adicionar valor à meta (incrementa `current_amount`)

**Critérios de aceitação:**
- `spent` é calculado corretamente (apenas despesas da categoria no mês)
- Metas inativas não aparecem na lista principal
- Mutações invalidam o cache do dashboard também

---

#### TASK-016: Página de Metas
**Arquivo:** `app/(app)/metas/page.tsx`

**Layout — três seções:**

**Seção 1: Orçamentos do mês**
- Seletor de mês
- Botão para adicionar novo orçamento
- Para cada orçamento:
  - Nome da categoria + ícone
  - Barra de progresso: `spent / amount * 100%`
  - Valores: "R$480 de R$800" 
  - Cor da barra: verde (< 80%), amarelo (80–99%), vermelho (≥ 100%)
  - Ícone de alerta se ultrapassou o limite

**Seção 2: Meta de economia mensal**
- Card mostrando quanto foi economizado no mês vs. meta
- Economia do mês = receitas − despesas
- Barra de progresso

**Seção 3: Metas com objetivo final**
- Cards com título, progresso, valor atual / meta e prazo
- Botão "+" para adicionar valor à meta
- Prazo em destaque se menos de 30 dias

**Critérios de aceitação:**
- Orçamento excedido tem barra vermelha e ícone de alerta
- Progresso das metas é calculado corretamente
- Adicionar valor a uma meta atualiza o card instantaneamente (optimistic update)
- Metas concluídas (current ≥ target) exibem badge "Concluída" 🎉

---

#### TASK-017: Formulários de orçamento e meta
**Arquivos:** `components/forms/BudgetForm.tsx`, `components/forms/GoalForm.tsx`

**BudgetForm — campos:**
- Categoria (select, apenas categorias do tipo 'expense')
- Limite mensal (valor BRL)
- Mês (default = mês atual)

**GoalForm — campos:**
- Título
- Tipo: "Meta de economia mensal" ou "Objetivo com valor final"
- Valor alvo
- Prazo (apenas para tipo 'final_target') — date picker

**Validações:**
- Não permitir dois orçamentos para a mesma categoria no mesmo mês (validar antes de submeter)
- Prazo deve ser no futuro para metas do tipo 'final_target'

**Critérios de aceitação:**
- Formulários são exibidos em sheet/drawer mobile (não modal full-screen)
- Validações são exibidas inline
- Edição de orçamento existente pré-preenche os campos

---

### Sprint 4 — Import de CSV
**Objetivo:** Importar fatura do Nubank via CSV.  
**Estimativa:** 3–4 dias

---

#### TASK-018: Parser do CSV do Nubank
**Arquivo:** `lib/utils/csv-parsers/nubank.ts`

**Formato do CSV do Nubank (fatura do cartão):**
```
Data,Hora,Valor,Identificador,Descrição
2025-07-15,10:30:00,-150.00,abc123,Restaurante XYZ
2025-07-14,09:00:00,-89.90,def456,Supermercado ABC
```

**Regras de parsing:**
- Usar Papa Parse com `header: true`
- Coluna `Data` → campo `date` (formato YYYY-MM-DD)
- Coluna `Descrição` → campo `description`
- Coluna `Valor` → campo `amount`: converter para positivo (fatura Nubank usa negativo para débitos)
- Ignorar linhas com `Valor` positivo (estornos e pagamentos de fatura)
- Retornar array de objetos `NubankTransaction` para pré-visualização

**Nota:** O formato exato do CSV pode variar. Implementar com tolerância: tentar mapear colunas por nome case-insensitive. Se colunas obrigatórias não forem encontradas, retornar erro descritivo.

**Critérios de aceitação:**
- Função `parseNubankCSV(file: File): Promise<ParseResult>` retorna `{ data, errors }`
- Linhas inválidas são ignoradas e contadas em `errors`
- Função não falha se o arquivo tiver BOM (Byte Order Mark) UTF-8
- Testar com arquivo CSV de exemplo do Nubank

---

#### TASK-019: Fluxo de importação de CSV
**Arquivo:** `app/(app)/transacoes/importar/page.tsx`

**Fluxo em 3 etapas:**

**Etapa 1 — Upload:**
- Área de drag-and-drop ou botão de seleção de arquivo
- Aceitar apenas `.csv`
- Ao selecionar arquivo, processar com o parser

**Etapa 2 — Pré-visualização e mapeamento:**
- Tabela com as transações encontradas (max 10 visíveis, com scroll)
- Cada linha: data, descrição, valor
- Dropdown por linha para selecionar a categoria (default: tentar inferir pelo nome da descrição — opcional)
- Checkbox para desmarcar linhas que o usuário não quer importar
- Resumo: "X transações encontradas, Y selecionadas"

**Etapa 3 — Confirmação:**
- Botão "Importar X transações"
- Inserção em batch via Supabase (um único insert com array)
- Toast de sucesso com quantidade importada
- Redirecionar para `/transacoes`

**Critérios de aceitação:**
- Arquivo inválido (não é CSV do Nubank) exibe mensagem de erro clara
- Usuário pode desmarcar transações individualmente antes de importar
- Transações duplicadas não são detectadas automaticamente no MVP (avisar ao usuário que verifique)
- Import de 100 transações funciona sem timeout

---

### Sprint 5 — Módulo de Investimentos
**Objetivo:** Registro e visualização de investimentos em renda fixa + calculadora.  
**Estimativa:** 5–6 dias

---

#### TASK-020: Hook `useInvestments`
**Arquivo:** `lib/hooks/useInvestments.ts`

**Funções:**
- `useInvestments()` — lista investimentos ativos
- `useCreateInvestment(data)`, `useUpdateInvestment(id, data)`, `useDeleteInvestment(id)`
- `useInvestmentsSummary()` — total investido + agrupamento por tipo

**Critérios de aceitação:**
- `totalInvested` = soma de `invested_amount` de todos os investimentos ativos
- Agrupamento por `type` retorna array com `{ type, label, total, percentage }`
- Investimentos inativos não entram nos totais

---

#### TASK-021: API Route proxy BCB
**Arquivo:** `app/api/bcb-proxy/route.ts`

**Implementação:**
```typescript
// GET /api/bcb-proxy?serie=432
// Faz fetch em: https://api.bcb.gov.br/dados/serie/bcdata.sgs.{serie}/dados/ultimos/1?formato=json
// Retorna: { value: number, date: string, period: 'annual' | 'monthly' }
// Cache: 24 horas via headers
```

**Séries suportadas:** 432 (Selic), 4389 (CDI), 13522 (IPCA)

**Critérios de aceitação:**
- Retorna dados corretos para as 3 séries
- Header `Cache-Control: public, s-maxage=86400` presente na resposta
- Se série não for suportada: retornar 400
- Se BCB estiver indisponível: retornar 503 com `{ error: 'BCB API unavailable' }`
- Response time < 2s (inclui latência do BCB)

---

#### TASK-022: Calculadora de investimentos
**Arquivo:** `components/InvestmentCalculator.tsx`

**Descrição:** Componente standalone da calculadora (igual ao protótipo já aprovado).

**Parâmetros de entrada:**
- Fonte da taxa: "Banco Central" ou "Taxa manual"
  - Se BCB: select de índice (Selic / CDI / IPCA) + slider de % do índice (CDI e Selic apenas)
  - Se manual: slider de taxa anual (1%–30%)
- Aporte inicial (R$)
- Aporte mensal (R$)
- Duração: slider 1–360 meses

**Saídas:**
- Cards: Valor final | Total investido | Rendimento
- Gráfico de linha: evolução do saldo vs. total investido ao longo do tempo

**Fórmula de cálculo:**
```
taxa_mensal = (1 + taxa_anual) ^ (1/12) - 1
Para cada mês:
  saldo = saldo * (1 + taxa_mensal) + aporte_mensal
```

**Critérios de aceitação:**
- Valores atualizados em tempo real ao mover sliders (sem debounce)
- Taxa do BCB é buscada do proxy `/api/bcb-proxy` ao carregar
- Se BCB indisponível, exibir mensagem "Não foi possível buscar a taxa" e manter última taxa em cache (localStorage)
- Todos os valores monetários formatados como BRL (ex: R$ 1.234,56)
- IPCA é anualizado corretamente: `(1 + taxa_mensal)^12 - 1`

---

#### TASK-023: Página de Investimentos
**Arquivo:** `app/(app)/investimentos/page.tsx`

**Layout — duas abas:**

**Aba 1: Portfólio**
- Card de resumo: Total investido (valor grande em destaque)
- Pie chart: distribuição por tipo de investimento
- Lista de investimentos ativos:
  - Nome + instituição
  - Tipo (badge)
  - Valor investido
  - Taxa (ex: "120% CDI", "12,5% a.a.")
  - Vencimento (se houver)
- Botão "+" para adicionar investimento

**Aba 2: Calculadora**
- Componente `InvestmentCalculator` completo

**Critérios de aceitação:**
- Pie chart atualiza ao adicionar/remover investimento
- Lista vazia mostra CTA para adicionar primeiro investimento
- Abas funcionam com swipe horizontal (mobile)

---

#### TASK-024: Formulário de investimento
**Arquivo:** `components/forms/InvestmentForm.tsx`

**Campos:**
- Nome (ex: "CDB Nubank 120% CDI")
- Tipo — select com opções: CDB, Tesouro Direto, LCI, LCA, Poupança, Outros renda fixa
- Instituição (text input)
- Valor investido (BRL)
- Tipo de taxa — select: "% ao ano (fixo)", "% do CDI", "% da Selic", "IPCA +"
- Valor da taxa (número com 2 casas decimais)
- Data de início — date picker
- Data de vencimento — date picker (opcional)
- Notas (textarea, opcional)

**Critérios de aceitação:**
- Label do campo de taxa muda conforme o tipo selecionado (ex: "% do CDI" → "Percentual do CDI")
- Data de vencimento deve ser posterior à data de início
- Formulário exibido em sheet/drawer mobile

---

### Sprint 6 — Exportação e Histórico
**Objetivo:** Exportar dados e navegar pelo histórico completo.  
**Estimativa:** 3–4 dias

---

#### TASK-025: Exportar para PDF
**Arquivo:** `lib/utils/export/pdf.ts`

**Descrição:** Gerar PDF do extrato mensal usando jsPDF + jspdf-autotable.

**Conteúdo do PDF:**
- Cabeçalho: "Extrato — [Mês Ano]" + nome do usuário
- Tabela de resumo: Receitas | Despesas | Saldo
- Tabela de transações: Data | Descrição | Categoria | Tipo | Valor
- Rodapé: data de geração

**Critérios de aceitação:**
- PDF gerado inteiramente no cliente (sem servidor)
- Download inicia automaticamente ao clicar em "Exportar PDF"
- Nome do arquivo: `extrato-[mes]-[ano].pdf`
- Tabela com mais de uma página pagina corretamente

---

#### TASK-026: Exportar para Excel
**Arquivo:** `lib/utils/export/excel.ts`

**Descrição:** Gerar arquivo `.xlsx` do extrato usando SheetJS.

**Conteúdo:**
- Planilha "Transações": todas as transações do período com colunas Data, Descrição, Categoria, Tipo, Valor
- Planilha "Resumo": total de receitas, despesas, saldo, e gastos por categoria

**Critérios de aceitação:**
- Arquivo gerado no cliente, download automático
- Nome do arquivo: `extrato-[mes]-[ano].xlsx`
- Valores monetários como número (não string) para facilitar análise no Excel
- Datas formatadas como `DD/MM/YYYY`

---

#### TASK-027: Filtros avançados no histórico
**Arquivo:** `app/(app)/transacoes/page.tsx` — adicionar painel de filtros

**Filtros disponíveis:**
- Período personalizado (data início / data fim)
- Categoria (multi-select)
- Tipo (receita / despesa / todos)
- Valor mínimo e máximo

**Critérios de aceitação:**
- Filtros persistem enquanto o usuário está na página
- Contador de filtros ativos visível no botão de filtro
- Limpar filtros com um clique
- Resultados filtrados exibem a contagem (ex: "32 transações")

---

### Sprint 7 — Notificações e Polimento
**Objetivo:** Resumo semanal e refinamentos de UX.  
**Estimativa:** 3–4 dias

---

#### TASK-028: Resumo semanal por e-mail
**Arquivo:** `supabase/functions/weekly-summary/index.ts`

**Descrição:** Supabase Edge Function agendada via pg_cron para enviar resumo semanal por e-mail.

**Conteúdo do e-mail:**
- Total gasto na semana
- Top 3 categorias de gasto
- Progresso dos orçamentos do mês
- Texto em pt-BR

**Implementação:**
- Usar Supabase Resend integration (gratuita, 3.000 emails/mês)
- Agendar para toda segunda-feira às 9h (BRT = UTC-3 → 12:00 UTC)
- Buscar todos os usuários e calcular dados de cada um

**Critérios de aceitação:**
- E-mail chega na segunda-feira às ~9h BRT
- E-mail é responsivo (mobile-friendly)
- Se o usuário não tiver transações na semana, e-mail não é enviado
- Link no e-mail abre o app direto no dashboard

---

#### TASK-029: Estados de loading e erro globais
**Descrição:** Garantir que todos os estados de loading e erro são tratados adequadamente.

**Checklist:**
- Skeleton loaders em todas as listas e cards (não usar spinner genérico)
- Mensagem de erro com botão "Tentar novamente" em caso de falha de rede
- Toast de sucesso após cada mutação (criar, editar, excluir)
- Toast de erro com mensagem amigável em caso de falha
- Confirmação antes de excluir qualquer item (sheet de confirmação, não `window.confirm`)

**Critérios de aceitação:**
- Nenhuma tela exibe tela em branco em estado de loading
- Erro de rede é recuperável sem reload
- Todos os toasts têm duração de 4s e podem ser fechados manualmente

---

#### TASK-030: Testes de fumaça (smoke tests) end-to-end
**Descrição:** Verificar os fluxos críticos antes do lançamento.

**Fluxos a testar manualmente:**
1. Login com Google → categorias criadas → dashboard carregado
2. Criar transação → aparece na lista → saldo atualizado
3. Import CSV do Nubank (usar arquivo de exemplo)
4. Criar orçamento → gastar acima do limite → barra fica vermelha
5. Criar meta → adicionar valor → progresso atualizado
6. Adicionar investimento → aparece no portfólio → calculadora funciona
7. Exportar PDF → arquivo baixado
8. Logout → redireciona para login → não acessa rotas protegidas

**Critérios de aceitação:**
- Todos os 8 fluxos funcionam sem erro no Chrome mobile (Android)
- Todos os 8 fluxos funcionam no Safari mobile (iOS)
- App funciona em modo PWA instalado

---

## 11. Decisões de Design de UX

- **Idioma:** pt-BR em todo o app. Usar `date-fns/locale/pt-BR` para formatação de datas
- **Moeda:** sempre formatar com `Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })`
- **Dark mode:** suportar via classe Tailwind (`dark:`), respeitar preferência do sistema
- **Navegação:** mobile-first com `BottomNav`. Sem sidebar. Sem hamburger menu
- **Formulários:** abrir em `Sheet` do shadcn/ui (drawer deslizando de baixo), não em modal
- **Confirmações destrutivas:** usar `AlertDialog` do shadcn/ui, nunca `window.confirm`
- **Feedback de sucesso:** usar `Toast` do shadcn/ui
- **Cor de despesa:** vermelho (`text-red-500`)
- **Cor de receita:** verde (`text-green-600`)
- **Cor de saldo positivo:** verde (`text-green-600`)
- **Cor de saldo negativo:** vermelho (`text-red-500`)

---

## 12. Regras para o Agente de IA

Ao implementar qualquer task deste documento:

1. **Sempre usar TypeScript strict** — sem `any`, sem `as unknown as`, preferir inferência de tipos
2. **Sempre usar os tipos de `lib/types/index.ts`** — não redefinir tipos inline
3. **Nunca bypassar RLS** — não usar `service_role` key no cliente
4. **Sempre formatar moeda com `Intl.NumberFormat`** — nunca concatenar string manualmente
5. **Sempre tratar loading e error** — todo hook do TanStack Query deve expor `isLoading` e `error`
6. **Componentes mobile-first** — testar em viewport 375px antes de 768px
7. **Sem dependências desnecessárias** — usar o que já está listado na seção 2
8. **Commits semânticos** — `feat:`, `fix:`, `chore:`, `refactor:` seguindo Conventional Commits
9. **Uma task por vez** — não começar TASK-N+1 antes de TASK-N passar nos critérios de aceitação
10. **Migrations são imutáveis** — nunca editar uma migration existente; criar nova migration para alterações de schema

---

## 13. Fora do Escopo (não implementar)

- Dashboard consolidado do casal
- Open Finance / integração automática com bancos
- Import de PDF do PicPay
- Suporte a outros idiomas
- Notificações push (apenas e-mail)
- Módulo de ações, FIIs, cripto (schema preparado, mas UI não implementada)
- Aplicativo nativo iOS/Android (apenas PWA)
- Modo offline completo
