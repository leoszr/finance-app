# Sprint 0 — Setup e Infraestrutura

**Objetivo:** Repositório funcional com autenticação, deploy automático e infraestrutura base configurada.  
**Estimativa:** 3–5 dias  
**Status:** 🔴 Não iniciado  
**Tasks:** TASK-001, TASK-002, TASK-003, TASK-004, TASK-005, TASK-006

---

## Visão Geral

Esta sprint estabelece a fundação técnica completa do projeto. Ao final, teremos:
- Repositório Next.js 14 com TypeScript strict configurado
- Supabase com banco de dados, autenticação e RLS funcionando
- Login via Google OAuth
- Layout mobile-first com navegação inferior
- PWA instalável
- Deploy automático na Vercel com CI/CD

Esta é a sprint mais crítica, pois todos os demais recursos dependem desta infraestrutura. Não pule ou simplifique nenhuma task desta sprint.

---

## TASK-001: Inicializar repositório Next.js com TypeScript

**Descrição expandida:**  
Criar o projeto base Next.js 14 com App Router, TypeScript em modo strict, e todas as dependências necessárias para o desenvolvimento completo da aplicação. Esta task também configura a estrutura de pastas que será usada durante todo o projeto.

### Arquivos a criar/modificar

```
/
├── package.json                    (gerado + dependências adicionadas)
├── tsconfig.json                   (configurar strict mode)
├── next.config.js                  (criar configurações customizadas)
├── tailwind.config.ts              (gerar com shadcn)
├── components.json                 (shadcn configuration)
├── .eslintrc.json                  (configurar regras)
├── .prettierrc                     (criar regras de formatação)
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   └── ui/                         (será populado pelo shadcn)
├── lib/
│   ├── types/
│   │   └── index.ts               (tipos centralizados)
│   ├── supabase/                  (preparar diretório)
│   ├── hooks/                     (preparar diretório)
│   └── utils/                     (preparar diretório)
├── store/                         (preparar diretório)
└── supabase/
    └── migrations/                (preparar diretório)
```

### Código exemplo

#### `tsconfig.json` (configuração strict)
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    },
    "forceConsistentCasingInFileNames": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

#### `lib/types/index.ts` (tipos iniciais — será expandido nas próximas sprints)
```typescript
// ============================================
// TIPOS CENTRALIZADOS - FINANCE APP
// ============================================
// Este arquivo é a fonte única de verdade para tipos do domínio.
// NUNCA redefina estes tipos inline em componentes ou hooks.
// ============================================

// Enums e tipos literais
export type TransactionType = 'expense' | 'income'
export type CategoryType = 'expense' | 'income' | 'investment'
export type RateType = 'fixed' | 'cdi_pct' | 'selic_pct' | 'ipca_plus'
export type InvestmentType = 
  | 'cdb' 
  | 'tesouro_direto' 
  | 'lci' 
  | 'lca' 
  | 'poupanca' 
  | 'outros_renda_fixa'
export type GoalType = 'monthly_savings' | 'final_target'
export type TransactionSource = 'manual' | 'csv_nubank' | 'recurring'

// ============================================
// ENTIDADES DO BANCO DE DADOS
// ============================================

export interface Category {
  id: string
  user_id: string
  name: string
  type: CategoryType
  icon?: string | null
  color?: string | null
  is_default: boolean
  created_at: string
}

export interface Transaction {
  id: string
  user_id: string
  category_id: string
  category?: Category  // Join opcional
  type: TransactionType
  amount: number
  description: string
  date: string        // ISO date string YYYY-MM-DD
  notes?: string | null
  is_recurring: boolean
  recurring_id?: string | null
  source: TransactionSource
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
  day_of_month: number  // 1-28
  active: boolean
  last_generated_month?: string | null
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
  deadline?: string | null
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
  maturity_date?: string | null
  notes?: string | null
  active: boolean
  created_at: string
  updated_at: string
}

// ============================================
// TIPOS COMPUTADOS / DTOs
// ============================================

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

export interface BudgetWithSpent extends Budget {
  spent: number
  percentage: number
  status: 'ok' | 'warning' | 'exceeded'
}

// ============================================
// TIPOS DE FORMULÁRIOS (Zod schemas)
// ============================================

export interface TransactionFormData {
  type: TransactionType
  amount: number
  description: string
  category_id: string
  date: string
  notes?: string
}

export interface RecurrentFormData {
  type: TransactionType
  amount: number
  description: string
  category_id: string
  day_of_month: number
  active: boolean
}

export interface BudgetFormData {
  category_id: string
  amount: number
  month: string
}

export interface GoalFormData {
  title: string
  type: GoalType
  target_amount: number
  deadline?: string
}

export interface InvestmentFormData {
  name: string
  type: InvestmentType
  institution: string
  invested_amount: number
  rate_type: RateType
  rate_value: number
  start_date: string
  maturity_date?: string
  notes?: string
}
```

#### `.prettierrc`
```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "arrowParens": "always"
}
```

### Passos de implementação

1. **Criar projeto Next.js:**
   ```bash
   npx create-next-app@latest finance-app --typescript --tailwind --app --src-dir=false
   cd finance-app
   ```

2. **Instalar dependências principais:**
   ```bash
   npm install @supabase/supabase-js@2 @supabase/ssr
   npm install @tanstack/react-query@5
   npm install zustand@4
   npm install date-fns@3
   npm install react-hook-form@7 @hookform/resolvers@3 zod@3
   npm install recharts@2
   npm install papaparse@5 jspdf@2 jspdf-autotable@3 xlsx@0.18
   npm install -D @types/papaparse
   ```

3. **Configurar shadcn/ui:**
   ```bash
   npx shadcn-ui@latest init
   # Escolher:
   # - Style: Default
   # - Base color: Zinc
   # - CSS variables: Yes
   ```

4. **Instalar componentes shadcn básicos:**
   ```bash
   npx shadcn-ui@latest add button
   npx shadcn-ui@latest add input
   npx shadcn-ui@latest add toast
   npx shadcn-ui@latest add sheet
   npx shadcn-ui@latest add alert-dialog
   npx shadcn-ui@latest add select
   npx shadcn-ui@latest add form
   npx shadcn-ui@latest add label
   npx shadcn-ui@latest add card
   ```

5. **Configurar TypeScript strict mode:**
   - Editar `tsconfig.json` conforme exemplo acima
   - Adicionar flags: `noUnusedLocals`, `noUnusedParameters`, `noImplicitReturns`

6. **Criar estrutura de pastas:**
   ```bash
   mkdir -p lib/{types,supabase,hooks,utils}
   mkdir -p components/{ui,layout,forms,charts,shared}
   mkdir -p store
   mkdir -p supabase/migrations
   mkdir -p app/{auth,api}
   ```

7. **Criar arquivo de tipos centralizado:**
   - Copiar conteúdo do exemplo `lib/types/index.ts`

8. **Configurar Prettier:**
   - Criar `.prettierrc` conforme exemplo

9. **Testar build:**
   ```bash
   npm run dev
   npm run build
   ```

### Critérios de aceitação

- [ ] `npm run dev` sobe sem erros e abre em `http://localhost:3000`
- [ ] `npm run build` compila sem erros de TypeScript
- [ ] Alias `@/` funciona corretamente em imports (testar importando `@/lib/types`)
- [ ] Estrutura de pastas criada conforme especificação
- [ ] shadcn/ui configurado e componentes básicos instalados
- [ ] TypeScript strict mode ativo (verificar no `tsconfig.json`)
- [ ] Prettier formata código automaticamente

### Possíveis desafios/edge cases

- **Conflito de versões:** Se houver erro de peer dependencies, usar `npm install --legacy-peer-deps`
- **Alias não funciona:** Reiniciar o servidor dev após alterar `tsconfig.json`
- **shadcn/ui não instala:** Verificar se o `tailwind.config.ts` foi gerado corretamente

### Dependências

Nenhuma (primeira task).

### Tempo estimado

**2–3 horas** (incluindo instalação, configuração e testes)

---

## TASK-002: Configurar Supabase

**Descrição expandida:**  
Criar projeto no Supabase, executar todas as migrations do banco de dados, configurar Row Level Security, habilitar Google OAuth e criar os clients JavaScript para browser e servidor.

### Arquivos a criar/modificar

```
├── .env.local                     (criar com secrets)
├── .env.example                   (criar template)
├── lib/supabase/
│   ├── client.ts                  (browser client)
│   ├── server.ts                  (server client para SSR)
│   └── types.ts                   (tipos gerados pelo Supabase)
├── supabase/migrations/
│   ├── 20260324000001_categories.sql
│   ├── 20260324000002_transactions.sql
│   ├── 20260324000003_recurrents.sql
│   ├── 20260324000004_budgets.sql
│   ├── 20260324000005_goals.sql
│   ├── 20260324000006_investments.sql
│   ├── 20260324000007_trigger_default_categories.sql
│   └── 20260324000008_function_recurring_transactions.sql
```

### Código exemplo

#### `.env.local`
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-aqui

# NUNCA EXPONHA A SERVICE_ROLE KEY NO CLIENTE
# SUPABASE_SERVICE_ROLE_KEY=sua-chave-service-role (NÃO USAR)
```

#### `.env.example`
```env
# Copie este arquivo para .env.local e preencha com suas credenciais

# Supabase Project URL (encontre em: Settings > API)
NEXT_PUBLIC_SUPABASE_URL=

# Supabase Anon Key (encontre em: Settings > API > Project API keys > anon public)
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

#### `lib/supabase/client.ts` (Browser Client)
```typescript
import { createBrowserClient } from '@supabase/ssr'
import { Database } from './types'

/**
 * Cliente Supabase para uso no browser (Client Components)
 * 
 * IMPORTANTE: 
 * - Usa a anon key (segura para exposição)
 * - Row Level Security (RLS) protege os dados
 * - Sessão é mantida no localStorage
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

#### `lib/supabase/server.ts` (Server Client)
```typescript
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from './types'

/**
 * Cliente Supabase para uso em Server Components e Server Actions
 * 
 * Este cliente:
 * - Lê e escreve cookies de sessão automaticamente
 * - Mantém a sessão do usuário em requisições SSR
 * - Ainda respeita RLS (usa a mesma anon key)
 */
export function createClient() {
  const cookieStore = cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // Erro pode ocorrer em Server Components (read-only cookies)
            // Ignorar silenciosamente
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // Ignorar
          }
        },
      },
    }
  )
}
```

#### `supabase/migrations/20260324000001_categories.sql`
```sql
-- ============================================
-- MIGRATION 001: Tabela de Categorias
-- ============================================
-- Categorias são criadas automaticamente para cada usuário
-- via trigger após criação da conta (ver migration 007)
-- ============================================

CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('expense', 'income', 'investment')),
  icon TEXT,                        -- nome de ícone lucide-react (ex: "shopping-cart")
  color TEXT,                       -- hex color (ex: "#FF5733")
  is_default BOOLEAN DEFAULT false, -- categorias padrão do sistema (não podem ser editadas)
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Habilitar Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Política: usuários só acessam suas próprias categorias
CREATE POLICY "users_own_data" ON categories
  FOR ALL 
  USING (auth.uid() = user_id);

-- Índices para performance
CREATE INDEX idx_categories_user_id ON categories(user_id);
CREATE INDEX idx_categories_user_type ON categories(user_id, type);

-- Comentários para documentação
COMMENT ON TABLE categories IS 'Categorias de transações e investimentos por usuário';
COMMENT ON COLUMN categories.is_default IS 'Categorias padrão são criadas pelo sistema e não podem ser excluídas';
```

#### `supabase/migrations/20260324000002_transactions.sql`
```sql
-- ============================================
-- MIGRATION 002: Tabela de Transações
-- ============================================

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

-- RLS
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_data" ON transactions FOR ALL USING (auth.uid() = user_id);

-- Índices importantes
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_transactions_user_month ON transactions(user_id, date_trunc('month', date));
CREATE INDEX idx_transactions_category ON transactions(category_id);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_transactions_updated_at
  BEFORE UPDATE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE transactions IS 'Transações de receitas e despesas dos usuários';
```

#### `supabase/migrations/20260324000007_trigger_default_categories.sql`
```sql
-- ============================================
-- MIGRATION 007: Trigger de Categorias Padrão
-- ============================================
-- Sempre que um usuário é criado no Supabase Auth,
-- este trigger cria automaticamente as categorias padrão
-- ============================================

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

-- Trigger dispara após INSERT na tabela auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_default_categories();

COMMENT ON FUNCTION create_default_categories IS 'Cria categorias padrão para novo usuário';
```

### Passos de implementação

1. **Criar projeto no Supabase:**
   - Acessar https://supabase.com/dashboard
   - Clicar em "New Project"
   - Nome: `finance-app` (ou seu nome preferido)
   - Database Password: gerar senha forte (salvar com segurança)
   - Region: escolher mais próxima (ex: South America - São Paulo)
   - Aguardar ~2 minutos para provisionar

2. **Obter credenciais:**
   - No dashboard do projeto, ir em Settings > API
   - Copiar "Project URL" → `NEXT_PUBLIC_SUPABASE_URL`
   - Copiar "anon public" key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Criar arquivo `.env.local` com essas credenciais

3. **Executar migrations:**
   - No Supabase Dashboard → SQL Editor
   - Criar nova query
   - Copiar conteúdo da migration 001 e executar
   - Repetir para migrations 002–008 em ordem

4. **Verificar RLS:**
   - No Dashboard → Database → Tables
   - Verificar que todas as tabelas têm RLS habilitado (ícone de cadeado)
   - Clicar em cada tabela e verificar políticas na aba "Policies"

5. **Configurar Google OAuth:**
   - No Dashboard → Authentication → Providers
   - Habilitar Google OAuth
   - Obter Client ID e Secret do Google Cloud Console:
     - Acessar https://console.cloud.google.com
     - Criar novo projeto ou usar existente
     - APIs & Services → Credentials → Create OAuth 2.0 Client ID
     - Tipo: Web application
     - Authorized redirect URIs: `https://seu-projeto.supabase.co/auth/v1/callback`
   - Copiar Client ID e Secret para o Supabase
   - Em "Site URL", adicionar: `http://localhost:3000`
   - Em "Redirect URLs", adicionar: `http://localhost:3000/auth/callback`

6. **Criar clients Supabase:**
   - Criar `lib/supabase/client.ts` conforme exemplo
   - Criar `lib/supabase/server.ts` conforme exemplo

7. **Gerar tipos TypeScript (opcional mas recomendado):**
   ```bash
   npx supabase gen types typescript --project-id seu-projeto-id > lib/supabase/types.ts
   ```

### Critérios de aceitação

- [ ] Projeto Supabase criado e acessível
- [ ] Todas as 8 migrations executadas sem erro
- [ ] RLS habilitado em todas as tabelas (verificar no Dashboard)
- [ ] Trigger de categorias padrão ativo (testar: criar usuário manualmente via SQL e verificar se categorias são criadas)
- [ ] Google OAuth configurado e testado (pode testar manualmente no Authentication > Users > Invite user)
- [ ] `.env.local` criado com credenciais corretas
- [ ] `lib/supabase/client.ts` e `lib/supabase/server.ts` criados
- [ ] Nenhuma senha ou service_role key commitada no Git

### Possíveis desafios/edge cases

- **Migration falha:** Verificar se migrations anteriores foram executadas. Ordem importa!
- **RLS não funciona:** Verificar se a política foi criada corretamente. Testar com: `SELECT * FROM categories WHERE user_id = auth.uid()`
- **Google OAuth redirect loop:** Verificar se URLs estão corretas (sem trailing slash)
- **Trigger não dispara:** Verificar se foi criado na tabela `auth.users` (não `public.users`)

### Dependências

- TASK-001 completa

### Tempo estimado

**2–3 horas** (incluindo criação do projeto, migrations e configuração OAuth)

---

## TASK-003: Autenticação com Google

**Descrição expandida:**  
Implementar fluxo completo de autenticação: página de login, callback OAuth, middleware de proteção de rotas, e botão de logout. Após login, usuário deve ser redirecionado para o dashboard e receber categorias padrão.

### Arquivos a criar/modificar

```
├── middleware.ts                          (proteção de rotas)
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx                  (tela de login)
│   │   └── layout.tsx                    (layout público)
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts                  (callback OAuth)
│   └── (app)/
│       └── dashboard/
│           └── page.tsx                  (placeholder)
├── components/
│   └── auth/
│       └── LogoutButton.tsx              (botão de logout)
```

### Código exemplo

#### `app/(auth)/login/page.tsx`
```typescript
import { createClient } from '@/lib/supabase/client'
import { Chrome } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function LoginPage() {
  async function handleGoogleLogin() {
    const supabase = createClient()
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })

    if (error) {
      console.error('Erro no login:', error.message)
      alert('Erro ao fazer login. Tente novamente.')
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900">
      <div className="w-full max-w-md space-y-8 px-6">
        {/* Logo e título */}
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-600 text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-8 w-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Finanças
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Controle financeiro pessoal simples e eficiente
          </p>
        </div>

        {/* Botão de login */}
        <div className="mt-8">
          <Button
            onClick={handleGoogleLogin}
            size="lg"
            className="w-full"
            variant="outline"
          >
            <Chrome className="mr-2 h-5 w-5" />
            Entrar com Google
          </Button>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-zinc-500 dark:text-zinc-400">
          Ao continuar, você concorda com nossos termos de uso
        </p>
      </div>
    </div>
  )
}
```

#### `app/auth/callback/route.ts`
```typescript
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

/**
 * Route Handler: Callback do OAuth
 * 
 * Este endpoint:
 * 1. Recebe o código de autorização do Google
 * 2. Troca o código por uma sessão no Supabase
 * 3. Redireciona para o dashboard
 */
export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createClient()
    
    // Trocar código por sessão
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('Erro no callback:', error.message)
      return NextResponse.redirect(`${requestUrl.origin}/login?error=auth_failed`)
    }
  }

  // Redirecionar para dashboard após login bem-sucedido
  return NextResponse.redirect(`${requestUrl.origin}/dashboard`)
}
```

#### `middleware.ts`
```typescript
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Middleware de Autenticação
 * 
 * Protege rotas do grupo (app) e renova sessão automaticamente.
 * Rotas públicas: /login, /auth/callback, /api/bcb-proxy
 */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Renovar sessão (importante para evitar expiração)
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Rotas protegidas: tudo em /dashboard, /transacoes, /metas, /investimentos, /configuracoes
  const isProtectedRoute = 
    request.nextUrl.pathname.startsWith('/dashboard') ||
    request.nextUrl.pathname.startsWith('/transacoes') ||
    request.nextUrl.pathname.startsWith('/metas') ||
    request.nextUrl.pathname.startsWith('/investimentos') ||
    request.nextUrl.pathname.startsWith('/configuracoes')

  // Redirecionar para login se não autenticado
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Redirecionar para dashboard se já autenticado e tentar acessar login
  if (request.nextUrl.pathname === '/login' && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

#### `components/auth/LogoutButton.tsx`
```typescript
'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

export function LogoutButton() {
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      console.error('Erro ao fazer logout:', error.message)
      return
    }

    router.push('/login')
    router.refresh()
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLogout}
      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
    >
      <LogOut className="mr-2 h-4 w-4" />
      Sair
    </Button>
  )
}
```

#### `app/(app)/dashboard/page.tsx` (placeholder temporário)
```typescript
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { LogoutButton } from '@/components/auth/LogoutButton'

export default async function DashboardPage() {
  const supabase = createClient()
  
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  const user = session.user

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Olá, {user.user_metadata.full_name || user.email}!
          </p>
        </div>
        <LogoutButton />
      </div>
      
      <div className="mt-8 rounded-lg border border-green-200 bg-green-50 p-6 dark:border-green-900 dark:bg-green-950">
        <p className="font-semibold text-green-900 dark:text-green-100">
          ✅ Autenticação funcionando!
        </p>
        <p className="mt-2 text-sm text-green-700 dark:text-green-300">
          Você está logado como: {user.email}
        </p>
      </div>
    </div>
  )
}
```

### Passos de implementação

1. **Criar página de login:**
   - Criar `app/(auth)/login/page.tsx`
   - Implementar UI conforme exemplo
   - Adicionar lógica de `signInWithOAuth`

2. **Criar callback route:**
   - Criar `app/auth/callback/route.ts`
   - Implementar troca de código por sessão

3. **Criar middleware:**
   - Criar `middleware.ts` na raiz
   - Implementar proteção de rotas conforme exemplo

4. **Criar botão de logout:**
   - Criar `components/auth/LogoutButton.tsx`
   - Adicionar ao dashboard placeholder

5. **Criar dashboard placeholder:**
   - Criar `app/(app)/dashboard/page.tsx`
   - Exibir informações básicas do usuário

6. **Testar fluxo completo:**
   ```bash
   npm run dev
   # Acessar http://localhost:3000
   # Deve redirecionar para /login
   # Clicar em "Entrar com Google"
   # Autorizar aplicação
   # Deve redirecionar para /dashboard
   ```

### Critérios de aceitação

- [ ] Usuário não autenticado acessando `/dashboard` é redirecionado para `/login`
- [ ] Fluxo de login com Google funciona sem erros
- [ ] Após login, usuário é redirecionado para `/dashboard`
- [ ] Dashboard exibe nome e email do usuário
- [ ] Botão de logout funciona e redireciona para `/login`
- [ ] Após logout, tentar acessar `/dashboard` redireciona para `/login`
- [ ] Categorias padrão são criadas automaticamente (verificar no Supabase Dashboard → Database → categories)
- [ ] Sessão persiste após reload da página

### Possíveis desafios/edge cases

- **Redirect loop:** Verificar configuração de URLs no Supabase (sem trailing slash)
- **Categorias não criadas:** Verificar se trigger foi executado corretamente (migration 007)
- **Sessão não persiste:** Verificar se cookies estão habilitados no browser
- **Erro "Invalid code_verifier":** Limpar cookies do browser e tentar novamente
- **Google OAuth não abre:** Verificar se Client ID e Secret estão corretos

### Dependências

- TASK-001 completa
- TASK-002 completa

### Tempo estimado

**2–3 horas** (incluindo testes de autenticação)

---

## TASK-004: Layout mobile com navegação inferior

**Descrição expandida:**  
Criar o layout base do aplicativo com navegação inferior fixa (bottom navigation bar) contendo 4 seções principais. Este layout será usado em todas as páginas autenticadas e deve ser mobile-first.

### Arquivos a criar/modificar

```
├── app/(app)/
│   └── layout.tsx                     (layout com BottomNav)
├── components/layout/
│   ├── BottomNav.tsx                  (navegação inferior)
│   └── PageHeader.tsx                 (cabeçalho reutilizável)
```

### Código exemplo

#### `components/layout/BottomNav.tsx`
```typescript
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, ArrowLeftRight, Target, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Transações',
    href: '/transacoes',
    icon: ArrowLeftRight,
  },
  {
    label: 'Metas',
    href: '/metas',
    icon: Target,
  },
  {
    label: 'Investimentos',
    href: '/investimentos',
    icon: TrendingUp,
  },
]

/**
 * Navegação inferior mobile
 * 
 * - Fixa na parte inferior da tela
 * - 4 seções principais do app
 * - Item ativo destacado visualmente
 * - Respeita safe area do iOS
 */
export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex h-16 max-w-lg items-center justify-around pb-safe">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 px-3 py-2 text-xs font-medium transition-colors',
                isActive
                  ? 'text-green-600 dark:text-green-500'
                  : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
              )}
            >
              <Icon
                className={cn(
                  'h-5 w-5',
                  isActive && 'scale-110'
                )}
              />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
```

#### `components/layout/PageHeader.tsx`
```typescript
import { ReactNode } from 'react'
import { Button } from '@/components/ui/button'

interface PageHeaderProps {
  title: string
  subtitle?: string
  action?: {
    label: string
    icon?: ReactNode
    onClick: () => void
  }
}

/**
 * Cabeçalho de página reutilizável
 * 
 * Props:
 * - title: Título principal da página
 * - subtitle: Texto descritivo opcional
 * - action: Botão de ação opcional (ex: "Nova transação")
 */
export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div>
        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {subtitle}
          </p>
        )}
      </div>

      {action && (
        <Button
          size="sm"
          onClick={action.onClick}
          className="gap-2"
        >
          {action.icon}
          {action.label}
        </Button>
      )}
    </div>
  )
}
```

#### `app/(app)/layout.tsx`
```typescript
import { BottomNav } from '@/components/layout/BottomNav'
import { Toaster } from '@/components/ui/toaster'

/**
 * Layout para todas as rotas autenticadas
 * 
 * - Inclui BottomNav fixa
 * - Padding inferior para não sobrepor conteúdo
 * - Toaster global para notificações
 */
export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      {/* Conteúdo principal */}
      <main className="pb-20">
        {children}
      </main>

      {/* Navegação inferior */}
      <BottomNav />

      {/* Toaster para notificações */}
      <Toaster />
    </div>
  )
}
```

#### `tailwind.config.ts` (adicionar suporte a safe-area)
```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  // ... configuração existente
  theme: {
    extend: {
      // ... outras extensões
      padding: {
        safe: 'env(safe-area-inset-bottom)',
      },
    },
  },
}

export default config
```

### Passos de implementação

1. **Instalar lucide-react (se não instalado):**
   ```bash
   npm install lucide-react
   ```

2. **Criar componente BottomNav:**
   - Criar `components/layout/BottomNav.tsx`
   - Implementar conforme exemplo
   - Testar responsividade em 375px

3. **Criar componente PageHeader:**
   - Criar `components/layout/PageHeader.tsx`
   - Implementar conforme exemplo

4. **Criar layout de app:**
   - Criar `app/(app)/layout.tsx`
   - Incluir BottomNav e Toaster

5. **Adicionar safe-area ao Tailwind:**
   - Editar `tailwind.config.ts`
   - Adicionar classe `pb-safe`

6. **Criar páginas placeholder:**
   ```typescript
   // app/(app)/transacoes/page.tsx
   export default function TransacoesPage() {
     return <div className="p-6">Transações (em breve)</div>
   }

   // app/(app)/metas/page.tsx
   export default function MetasPage() {
     return <div className="p-6">Metas (em breve)</div>
   }

   // app/(app)/investimentos/page.tsx
   export default function InvestimentosPage() {
     return <div className="p-6">Investimentos (em breve)</div>
   }
   ```

7. **Testar navegação:**
   - Clicar em cada item da BottomNav
   - Verificar que item ativo muda de cor
   - Verificar que URL muda corretamente

### Critérios de aceitação

- [ ] BottomNav visível em todas as páginas do grupo `(app)`
- [ ] Item ativo destacado visualmente (cor verde)
- [ ] Navegação funciona sem reload de página (client-side navigation)
- [ ] Layout não quebra em viewport de 375px (iPhone SE)
- [ ] Safe area do iOS respeitada (testar em iPhone real ou simulador)
- [ ] Conteúdo não é sobreposto pela BottomNav (padding inferior correto)
- [ ] Dark mode funciona corretamente

### Possíveis desafios/edge cases

- **Safe area não funciona:** Testar em dispositivo iOS real, não funciona em DevTools
- **BottomNav some em algumas páginas:** Verificar se todas as páginas estão dentro do grupo `(app)`
- **Item ativo não destaca:** Verificar lógica de `pathname.startsWith()`
- **Scroll não funciona:** Verificar se `pb-20` está aplicado no `<main>`

### Dependências

- TASK-001 completa
- TASK-003 completa

### Tempo estimado

**1–2 horas** (incluindo testes de responsividade)

---

## TASK-005: Configurar PWA

**Descrição expandida:**  
Tornar o aplicativo instalável como Progressive Web App (PWA). O usuário poderá adicionar o app à tela inicial do smartphone e usá-lo como um aplicativo nativo, com ícone próprio e modo standalone (sem barra do navegador).

### Arquivos a criar/modificar

```
├── public/
│   ├── manifest.json              (manifest do PWA)
│   ├── icons/
│   │   ├── icon-192.png          (ícone 192x192)
│   │   ├── icon-512.png          (ícone 512x512)
│   │   └── apple-touch-icon.png  (ícone iOS)
│   └── favicon.ico
├── app/
│   └── layout.tsx                 (adicionar meta tags)
└── next.config.js                 (configurar next-pwa)
```

### Código exemplo

#### `public/manifest.json`
```json
{
  "name": "Finanças - Controle Financeiro",
  "short_name": "Finanças",
  "description": "Controle financeiro pessoal simples e eficiente",
  "start_url": "/dashboard",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#16a34a",
  "orientation": "portrait",
  "scope": "/",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ],
  "categories": ["finance", "productivity"],
  "lang": "pt-BR"
}
```

#### `app/layout.tsx` (root layout com meta tags PWA)
```typescript
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Finanças - Controle Financeiro',
  description: 'Controle financeiro pessoal simples e eficiente',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Finanças',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/icons/apple-touch-icon.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#16a34a',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
```

#### `next.config.js` (com next-pwa)
```javascript
/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  buildExcludes: [/middleware-manifest\.json$/],
})

const nextConfig = {
  // Suas configurações existentes
}

module.exports = withPWA(nextConfig)
```

### Passos de implementação

1. **Instalar next-pwa:**
   ```bash
   npm install next-pwa
   ```

2. **Gerar ícones do PWA:**
   - Criar um ícone quadrado 512x512px (pode usar Figma, Canva, ou AI)
   - Tema: símbolo de cifrão ($) em verde sobre fundo branco
   - Usar ferramenta online para gerar todos os tamanhos: https://www.pwabuilder.com/imageGenerator
   - Salvar em `public/icons/`:
     - `icon-192.png` (192x192)
     - `icon-512.png` (512x512)
     - `apple-touch-icon.png` (180x180)
   - Gerar `favicon.ico` e salvar em `public/`

3. **Criar manifest.json:**
   - Criar `public/manifest.json` conforme exemplo

4. **Adicionar meta tags ao layout:**
   - Editar `app/layout.tsx`
   - Adicionar metadata conforme exemplo

5. **Configurar next-pwa:**
   - Editar `next.config.js`
   - Adicionar configuração do PWA

6. **Build e testar:**
   ```bash
   npm run build
   npm run start
   ```

7. **Testar instalação:**
   - Abrir no Chrome mobile (Android)
   - Menu → Adicionar à tela inicial
   - Verificar se ícone aparece na home screen
   - Abrir app instalado → não deve mostrar barra do navegador

### Critérios de aceitação

- [ ] Arquivo `manifest.json` válido (validar em https://manifest-validator.appspot.com)
- [ ] Ícones 192x192 e 512x512 criados e otimizados
- [ ] No Chrome mobile, opção "Adicionar à tela inicial" disponível
- [ ] Após instalação, app abre em modo standalone (sem barra do navegador)
- [ ] Lighthouse PWA score ≥ 90 (testar em modo anônimo)
- [ ] Service Worker registrado (verificar no DevTools → Application → Service Workers)
- [ ] Splash screen exibida ao abrir app instalado (iOS e Android)

### Possíveis desafios/edge cases

- **PWA não instala no iOS:** iOS tem requisitos mais rígidos (HTTPS obrigatório, mesmo em localhost). Testar em produção.
- **Service Worker não atualiza:** Limpar cache do navegador e recarregar
- **Ícones não aparecem:** Verificar se paths estão corretos no manifest
- **Build falha:** Verificar se `next-pwa` está configurado corretamente

### Dependências

- TASK-001 completa
- TASK-004 completa (para testar navegação no PWA)

### Tempo estimado

**1–2 horas** (incluindo geração de ícones e testes)

---

## TASK-006: Deploy inicial na Vercel

**Descrição expandida:**  
Configurar CI/CD completo com deploy automático na Vercel. Cada push para a branch `main` deve disparar um novo deploy. Configurar variáveis de ambiente e garantir que autenticação funciona em produção.

### Arquivos a criar/modificar

```
├── .gitignore                     (verificar)
├── vercel.json                    (opcional: configurações)
└── README.md                      (instruções de deploy)
```

### Código exemplo

#### `.gitignore` (verificar se contém)
```
# dependencies
/node_modules

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local
.env

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

# pwa
/public/sw.js
/public/workbox-*.js
```

#### `vercel.json` (opcional)
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "regions": ["gru1"]
}
```

### Passos de implementação

1. **Criar repositório no GitHub:**
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit with setup complete"
   git branch -M main
   git remote add origin https://github.com/seu-usuario/finance-app.git
   git push -u origin main
   ```

2. **Conectar à Vercel:**
   - Acessar https://vercel.com/new
   - Fazer login com GitHub
   - Clicar em "Import Project"
   - Selecionar o repositório `finance-app`
   - Framework Preset: Next.js (detectado automaticamente)
   - Clicar em "Deploy"

3. **Configurar variáveis de ambiente:**
   - No dashboard do projeto na Vercel
   - Settings → Environment Variables
   - Adicionar:
     - `NEXT_PUBLIC_SUPABASE_URL` = (URL do Supabase)
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (chave anon)
   - Aplicar a: Production, Preview, Development

4. **Atualizar URLs no Supabase:**
   - No Supabase Dashboard → Authentication → URL Configuration
   - Site URL: `https://seu-app.vercel.app`
   - Redirect URLs: adicionar `https://seu-app.vercel.app/auth/callback`

5. **Testar deploy:**
   - Aguardar build finalizar (~2 minutos)
   - Acessar URL gerada pela Vercel
   - Testar login com Google
   - Verificar se dashboard carrega corretamente

6. **Configurar domínio customizado (opcional):**
   - Settings → Domains
   - Adicionar domínio próprio se tiver

### Critérios de aceitação

- [ ] Repositório criado no GitHub com código completo
- [ ] Projeto conectado à Vercel com deploy automático
- [ ] Build passa sem erros
- [ ] Variáveis de ambiente configuradas corretamente
- [ ] HTTPS ativo (automático na Vercel)
- [ ] Login com Google funciona em produção
- [ ] Dashboard carrega após autenticação
- [ ] Novo commit em `main` dispara deploy automático
- [ ] Preview deployments funcionam em PRs (opcional)

### Possíveis desafios/edge cases

- **Build falha com erro de TypeScript:** Verificar se `npm run build` passa localmente
- **Variáveis de ambiente não carregam:** Verificar prefixo `NEXT_PUBLIC_` (obrigatório para variáveis do cliente)
- **Google OAuth redirect loop:** Verificar se URL de callback está correta no Supabase
- **"Deployment failed" sem detalhes:** Verificar logs no dashboard da Vercel

### Dependências

- Todas as tasks anteriores (TASK-001 a TASK-005) completas

### Tempo estimado

**30 minutos – 1 hora** (incluindo configuração e testes em produção)

---

## Resumo da Sprint 0

Ao completar todas as tasks desta sprint, você terá:

✅ Repositório Next.js 14 com TypeScript strict  
✅ Supabase configurado com banco de dados e RLS  
✅ Autenticação via Google OAuth funcionando  
✅ Layout mobile-first com navegação inferior  
✅ PWA instalável  
✅ Deploy automático na Vercel com CI/CD  

**Próxima sprint:** Sprint 1 — Transações (CRUD completo de transações)

---

**Última atualização:** Março 2026  
**Versão:** 1.0
