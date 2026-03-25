# API Integration — Finance App

**Versão:** 1.0  
**Última atualização:** Março 2026  
**Nível:** Avançado — API Architecture & Integration

---

## 1. Visão Geral das APIs

### 1.1 Arquitetura de Integração

```
┌──────────────────────────────────────────────────────────┐
│                   FRONTEND (Browser)                     │
│                                                          │
│  ┌────────────────┐  ┌─────────────────┐                │
│  │ Supabase       │  │ API BCB         │                │
│  │ Client         │  │ Proxy           │                │
│  │ (Browser)      │  │ (Edge Route)    │                │
│  └────────┬───────┘  └────────┬────────┘                │
└───────────┼──────────────────┼─────────────────────────┘
            │                  │
            │ JWT Auth         │ Server-to-Server
            │ anon_key         │ (sem CORS)
            │                  │
            ▼                  ▼
┌──────────────────────────────────────────────────────────┐
│                  EXTERNAL SERVICES                       │
│                                                          │
│  ┌────────────────┐  ┌─────────────────┐                │
│  │ Supabase       │  │ Banco Central   │                │
│  │ (PostgreSQL    │  │ do Brasil       │                │
│  │  + Auth)       │  │ (BCB API)       │                │
│  └────────────────┘  └─────────────────┘                │
└──────────────────────────────────────────────────────────┘
```

### 1.2 APIs Utilizadas

| API | Tipo | Autenticação | Uso |
|-----|------|--------------|-----|
| **Supabase REST API** | GraphQL-like | JWT (anon_key) | CRUD de dados (transactions, budgets, etc.) |
| **Supabase Auth API** | OAuth 2.0 | Google OAuth | Login/Logout |
| **Supabase RPC** | Function calls | JWT | Stored procedures (generate_recurring) |
| **BCB API (Proxy)** | REST | Pública (sem auth) | Taxas Selic, CDI, IPCA |
| **Supabase Edge Functions** | Serverless | service_role_key | Resumo semanal (email) |

---

## 2. Supabase Client

### 2.1 Browser Client vs Server Client

#### 2.1.1 Browser Client (Cliente)

```typescript
// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Uso:
const { data, error } = await supabase
  .from('transactions')
  .select('*')
// RLS aplicado automaticamente (auth.uid() = user_id)
```

**Características**:
- ✅ Usa `anon_key` (seguro expor no cliente)
- ✅ JWT enviado automaticamente (cookie/localStorage)
- ✅ RLS aplicado (segurança no banco)
- ❌ Não pode bypassar RLS

#### 2.1.2 Server Client (SSR)

```typescript
// lib/supabase/server.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )
}

// Uso em Server Component:
export default async function Page() {
  const supabase = createClient()
  const { data: transactions } = await supabase
    .from('transactions')
    .select('*')
  
  return <TransactionList transactions={transactions} />
}
```

**Características**:
- ✅ Acessa cookies server-side (Next.js 14)
- ✅ SSR-friendly (sem flash de conteúdo)
- ✅ RLS aplicado (usa JWT do cookie)
- ❌ Não pode usar em Client Components

#### 2.1.3 Admin Client (Edge Functions)

```typescript
// NÃO expor no cliente! Apenas em Edge Functions/Server Actions
import { createClient } from '@supabase/supabase-js'

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // ← SECRET!
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)

// Uso (APENAS em servidor):
// app/api/admin/route.ts
export async function GET() {
  const { data } = await supabaseAdmin
    .from('transactions')
    .select('*')
  // ⚠️ RLS BYPASSADO! Retorna dados de TODOS os usuários
  
  return Response.json(data)
}
```

**⚠️ PERIGO**:
- Service role key bypassa RLS
- Se vazar, atacante acessa TODOS os dados
- **NUNCA** usar no cliente

### 2.2 Autenticação e Sessão

#### 2.2.1 Fluxo de Login com Google

```typescript
// app/(auth)/login/page.tsx
'use client'

import { supabase } from '@/lib/supabase/client'

export default function LoginPage() {
  const handleGoogleLogin = async () => {
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
      console.error('Login error:', error)
    }
  }
  
  return (
    <button onClick={handleGoogleLogin}>
      Entrar com Google
    </button>
  )
}
```

#### 2.2.2 Callback OAuth

```typescript
// app/auth/callback/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  
  if (code) {
    const supabase = createClient()
    
    // Troca code por session
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      return NextResponse.redirect(`${requestUrl.origin}/login?error=auth_failed`)
    }
  }
  
  // Redirecionar para dashboard
  return NextResponse.redirect(`${requestUrl.origin}/dashboard`)
}
```

#### 2.2.3 Middleware (Session Refresh)

```typescript
// middleware.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

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
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )
  
  // Refresh session (se expirada, renova automaticamente)
  const { data: { session } } = await supabase.auth.getSession()
  
  // Proteção de rotas
  const isAuthRoute = request.nextUrl.pathname.startsWith('/login')
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard') ||
                            request.nextUrl.pathname.startsWith('/transacoes') ||
                            request.nextUrl.pathname.startsWith('/metas') ||
                            request.nextUrl.pathname.startsWith('/investimentos') ||
                            request.nextUrl.pathname.startsWith('/configuracoes')
  
  if (!session && isProtectedRoute) {
    // Não autenticado, redirecionar para login
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  if (session && isAuthRoute) {
    // Já autenticado, redirecionar para dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

#### 2.2.4 Hook `useUser`

```typescript
// lib/hooks/useUser.ts
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    // Buscar sessão inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })
    
    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )
    
    return () => subscription.unsubscribe()
  }, [])
  
  return { user, loading }
}

// Uso:
function Dashboard() {
  const { user, loading } = useUser()
  
  if (loading) return <Spinner />
  if (!user) return <LoginPrompt />
  
  return <div>Olá, {user.email}</div>
}
```

#### 2.2.5 Logout

```typescript
// components/layout/UserMenu.tsx
'use client'

import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export function UserMenu() {
  const router = useRouter()
  
  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh() // Força refresh do Server Component
  }
  
  return (
    <button onClick={handleLogout}>
      Sair
    </button>
  )
}
```

### 2.3 CRUD Operations

#### 2.3.1 SELECT (Read)

```typescript
// Buscar todas as transações do mês
const { data, error } = await supabase
  .from('transactions')
  .select('*')
  .eq('user_id', userId)
  .gte('date', '2026-03-01')
  .lte('date', '2026-03-31')
  .order('date', { ascending: false })

// SELECT com JOIN (foreign key expansion)
const { data, error } = await supabase
  .from('transactions')
  .select(`
    id,
    amount,
    description,
    date,
    category:categories (
      id,
      name,
      icon,
      color
    )
  `)
  .eq('user_id', userId)

// SELECT com agregação (count)
const { count, error } = await supabase
  .from('transactions')
  .select('*', { count: 'exact', head: true })
  .eq('user_id', userId)
  .eq('type', 'expense')

// SELECT com filtro LIKE (case-insensitive)
const { data, error } = await supabase
  .from('transactions')
  .select('*')
  .eq('user_id', userId)
  .ilike('description', '%mercado%')

// SELECT com OR
const { data, error } = await supabase
  .from('transactions')
  .select('*')
  .eq('user_id', userId)
  .or('type.eq.expense,amount.gte.1000')

// SELECT com IN
const { data, error } = await supabase
  .from('transactions')
  .select('*')
  .eq('user_id', userId)
  .in('category_id', ['cat-1', 'cat-2', 'cat-3'])
```

#### 2.3.2 INSERT (Create)

```typescript
// Inserir uma transação
const { data, error } = await supabase
  .from('transactions')
  .insert({
    user_id: userId,
    category_id: 'cat-1',
    type: 'expense',
    amount: 150.50,
    description: 'Supermercado',
    date: '2026-03-24',
  })
  .select() // Retornar o registro criado
  .single()

// Inserir múltiplas transações (bulk insert)
const { data, error } = await supabase
  .from('transactions')
  .insert([
    { user_id: userId, amount: 100, description: 'Item 1', ... },
    { user_id: userId, amount: 200, description: 'Item 2', ... },
    { user_id: userId, amount: 300, description: 'Item 3', ... },
  ])
  .select()

// Upsert (insert ou update se já existir)
const { data, error } = await supabase
  .from('budgets')
  .upsert({
    user_id: userId,
    category_id: 'cat-1',
    month: '2026-03-01',
    amount: 800,
  }, {
    onConflict: 'user_id,category_id,month', // UNIQUE constraint
  })
  .select()
  .single()
```

#### 2.3.3 UPDATE (Update)

```typescript
// Atualizar transação por ID
const { data, error } = await supabase
  .from('transactions')
  .update({
    amount: 175.00,
    description: 'Supermercado (atualizado)',
  })
  .eq('id', transactionId)
  .eq('user_id', userId) // Garantir que pertence ao user (RLS já valida)
  .select()
  .single()

// Atualizar múltiplas rows
const { data, error } = await supabase
  .from('transactions')
  .update({ is_recurring: true })
  .eq('recurring_id', recurringId)

// Incrementar valor (sem buscar antes)
const { data, error } = await supabase
  .rpc('increment_goal_amount', {
    goal_id: goalId,
    increment_by: 500,
  })
```

#### 2.3.4 DELETE (Delete)

```typescript
// Excluir transação por ID
const { error } = await supabase
  .from('transactions')
  .delete()
  .eq('id', transactionId)
  .eq('user_id', userId)

// Excluir múltiplas rows
const { error } = await supabase
  .from('transactions')
  .delete()
  .eq('recurring_id', recurringId)
  .eq('user_id', userId)

// Soft delete (não usado no projeto, mas útil no futuro)
const { error } = await supabase
  .from('transactions')
  .update({ deleted_at: new Date().toISOString() })
  .eq('id', transactionId)
```

### 2.4 RPC (Remote Procedure Calls)

#### 2.4.1 Chamar Stored Function

```typescript
// Gerar transações recorrentes
const { data: count, error } = await supabase.rpc('generate_recurring_transactions', {
  p_user_id: userId,
})

if (!error && count > 0) {
  toast.success(`${count} recorrências lançadas para ${format(new Date(), 'MMMM', { locale: ptBR })}`)
}
```

#### 2.4.2 Criar Stored Function no Banco

```sql
-- supabase/migrations/012_custom_rpc.sql

-- Função: Buscar agregações complexas
CREATE OR REPLACE FUNCTION get_dashboard_summary(p_user_id UUID, p_month DATE)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_income', COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0),
    'total_expenses', COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0),
    'balance', COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END), 0),
    'transactions_count', COUNT(*)
  )
  INTO result
  FROM transactions
  WHERE user_id = p_user_id
    AND date_trunc('month', date) = date_trunc('month', p_month);
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Uso no front-end:
const { data } = await supabase.rpc('get_dashboard_summary', {
  p_user_id: userId,
  p_month: '2026-03-01',
})

console.log(data) // { total_income: 5000, total_expenses: 3200, balance: 1800, ... }
```

### 2.5 Real-time Subscriptions (Futuro)

```typescript
// Escutar mudanças em transações (futuro)
const channel = supabase
  .channel('transactions')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'transactions',
      filter: `user_id=eq.${userId}`,
    },
    (payload) => {
      console.log('Nova transação:', payload.new)
      // Invalidar cache do TanStack Query
      queryClient.invalidateQueries(['transactions'])
    }
  )
  .subscribe()

// Cleanup:
return () => {
  supabase.removeChannel(channel)
}
```

### 2.6 Error Handling

```typescript
// Pattern de error handling
async function fetchTransactions(userId: string, month: Date) {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
  
  if (error) {
    // Logs detalhados para debugging
    console.error('Supabase error:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    })
    
    // Erro amigável para o usuário
    throw new Error('Erro ao carregar transações. Tente novamente.')
  }
  
  return data
}

// Tratamento em hooks TanStack Query:
export function useTransactions(month: Date) {
  const { user } = useUser()
  
  return useQuery({
    queryKey: ['transactions', user?.id, format(month, 'yyyy-MM')],
    queryFn: () => fetchTransactions(user!.id, month),
    enabled: !!user,
    retry: (failureCount, error) => {
      // Não retenta erros de autenticação
      if (error.message.includes('JWT')) return false
      
      // Retenta até 2 vezes para outros erros
      return failureCount < 2
    },
    onError: (error) => {
      // Toast de erro global
      toast.error(error.message)
    },
  })
}
```

---

## 3. API BCB Proxy

### 3.1 Problema: CORS

**Erro sem proxy**:
```typescript
// ❌ Tentativa direta do cliente:
const response = await fetch('https://api.bcb.gov.br/dados/serie/bcdata.sgs.432/dados/ultimos/1?formato=json')
// ERROR: CORS policy: No 'Access-Control-Allow-Origin' header
```

**Solução: Proxy via Edge Route**

### 3.2 Implementação do Proxy

```typescript
// app/api/bcb-proxy/route.ts
import { NextRequest, NextResponse } from 'next/server'

// Edge Runtime (mais rápido que Node.js)
export const runtime = 'edge'

interface BCBResponse {
  data: string
  valor: string
}

interface ProxyResponse {
  value: number
  date: string
  period: 'annual' | 'monthly'
  serie: string
}

const SERIES = {
  selic: '432',
  cdi: '4389',
  ipca: '13522',
} as const

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const serie = searchParams.get('serie')
    
    // Validar série
    if (!serie || !Object.values(SERIES).includes(serie)) {
      return NextResponse.json(
        { error: 'Série inválida. Use: 432 (Selic), 4389 (CDI), 13522 (IPCA)' },
        { status: 400 }
      )
    }
    
    // Fetch da API do BCB
    const bcbResponse = await fetch(
      `https://api.bcb.gov.br/dados/serie/bcdata.sgs.${serie}/dados/ultimos/1?formato=json`,
      {
        headers: {
          'Accept': 'application/json',
        },
        next: {
          revalidate: 86400, // Cache de 24 horas (Next.js 14)
        },
      }
    )
    
    if (!bcbResponse.ok) {
      throw new Error(`BCB API error: ${bcbResponse.status}`)
    }
    
    const data: BCBResponse[] = await bcbResponse.json()
    
    if (!data || data.length === 0) {
      throw new Error('BCB API returned empty data')
    }
    
    const latest = data[0]
    
    // Determinar período (anual para Selic/CDI, mensal para IPCA)
    const period: 'annual' | 'monthly' = serie === SERIES.ipca ? 'monthly' : 'annual'
    
    const response: ProxyResponse = {
      value: parseFloat(latest.valor),
      date: latest.data,
      period,
      serie,
    }
    
    return NextResponse.json(response, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600',
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.error('BCB Proxy error:', error)
    
    return NextResponse.json(
      { 
        error: 'BCB API indisponível. Tente novamente mais tarde.',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    )
  }
}
```

### 3.3 Uso no Front-end

```typescript
// lib/utils/bcb.ts
interface BCBRate {
  value: number
  date: string
  period: 'annual' | 'monthly'
  serie: string
}

export async function fetchBCBRate(serie: 'selic' | 'cdi' | 'ipca'): Promise<BCBRate> {
  const serieIds = {
    selic: '432',
    cdi: '4389',
    ipca: '13522',
  }
  
  const response = await fetch(`/api/bcb-proxy?serie=${serieIds[serie]}`)
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Erro ao buscar taxa do BCB')
  }
  
  return response.json()
}

// Uso em hook:
export function useBCBRates() {
  return useQuery({
    queryKey: ['bcb-rates'],
    queryFn: async () => {
      const [selic, cdi, ipca] = await Promise.all([
        fetchBCBRate('selic'),
        fetchBCBRate('cdi'),
        fetchBCBRate('ipca'),
      ])
      
      return { selic, cdi, ipca }
    },
    staleTime: 24 * 60 * 60 * 1000, // 24 horas
    cacheTime: 7 * 24 * 60 * 60 * 1000, // 7 dias
  })
}

// Uso em componente:
function InvestmentCalculator() {
  const { data: rates, isLoading, error } = useBCBRates()
  
  if (isLoading) return <Skeleton />
  if (error) return <Alert>Erro ao carregar taxas. Usando valores padrão.</Alert>
  
  return (
    <div>
      <p>Selic: {rates.selic.value.toFixed(2)}% a.a.</p>
      <p>CDI: {rates.cdi.value.toFixed(2)}% a.a.</p>
      <p>IPCA: {rates.ipca.value.toFixed(2)}% a.m.</p>
    </div>
  )
}
```

### 3.4 Cache Strategy

**Níveis de cache**:
1. **Browser cache** (Service Worker): 24h
2. **Next.js Data Cache** (`next.revalidate`): 24h
3. **TanStack Query cache**: 24h

**Por quê 24 horas?**
- Taxas do BCB são atualizadas diariamente (após fechamento do mercado)
- 24h balanceia freshness vs. performance
- Stale-while-revalidate garante disponibilidade

### 3.5 Fallback para Offline

```typescript
// lib/utils/bcb.ts com fallback
const DEFAULT_RATES = {
  selic: { value: 11.75, date: '2026-03-01', period: 'annual' as const, serie: '432' },
  cdi: { value: 11.65, date: '2026-03-01', period: 'annual' as const, serie: '4389' },
  ipca: { value: 0.42, date: '2026-02-01', period: 'monthly' as const, serie: '13522' },
}

export function useBCBRates() {
  return useQuery({
    queryKey: ['bcb-rates'],
    queryFn: async () => {
      try {
        const [selic, cdi, ipca] = await Promise.all([
          fetchBCBRate('selic'),
          fetchBCBRate('cdi'),
          fetchBCBRate('ipca'),
        ])
        
        // Salvar no localStorage (fallback para offline)
        localStorage.setItem('bcb-rates-cache', JSON.stringify({ selic, cdi, ipca }))
        
        return { selic, cdi, ipca }
      } catch (error) {
        // Tentar buscar do localStorage
        const cached = localStorage.getItem('bcb-rates-cache')
        if (cached) {
          console.warn('Using cached BCB rates from localStorage')
          return JSON.parse(cached)
        }
        
        // Fallback final: valores padrão
        console.warn('Using default BCB rates')
        return DEFAULT_RATES
      }
    },
    staleTime: 24 * 60 * 60 * 1000,
  })
}
```

---

## 4. Supabase Edge Functions

### 4.1 Weekly Summary Email

```typescript
// supabase/functions/weekly-summary/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  
  try {
    // Criar cliente admin (bypassa RLS)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )
    
    // Buscar todos os usuários
    const { data: users, error: usersError } = await supabaseAdmin.auth.admin.listUsers()
    
    if (usersError) throw usersError
    
    const now = new Date()
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    
    // Processar cada usuário
    for (const user of users.users) {
      // Buscar transações da semana
      const { data: transactions, error: txError } = await supabaseAdmin
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', lastWeek.toISOString().split('T')[0])
        .lte('date', now.toISOString().split('T')[0])
      
      if (txError) {
        console.error(`Error fetching transactions for user ${user.id}:`, txError)
        continue
      }
      
      // Pular se não houver transações
      if (!transactions || transactions.length === 0) continue
      
      // Calcular estatísticas
      const totalExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Number(t.amount), 0)
      
      const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + Number(t.amount), 0)
      
      // Top 3 categorias (simplificado, fazer JOIN no futuro)
      const categoryTotals = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => {
          acc[t.category_id] = (acc[t.category_id] || 0) + Number(t.amount)
          return acc
        }, {} as Record<string, number>)
      
      const top3 = Object.entries(categoryTotals)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
      
      // Enviar email (usando Resend via Supabase)
      const emailHtml = `
        <h1>Resumo Semanal - Finanças</h1>
        <p>Olá! Aqui está o resumo da sua semana:</p>
        
        <h2>Totais</h2>
        <ul>
          <li><strong>Receitas:</strong> R$ ${totalIncome.toFixed(2)}</li>
          <li><strong>Despesas:</strong> R$ ${totalExpenses.toFixed(2)}</li>
          <li><strong>Saldo:</strong> R$ ${(totalIncome - totalExpenses).toFixed(2)}</li>
        </ul>
        
        <h2>Top 3 Categorias de Gasto</h2>
        <ol>
          ${top3.map(([catId, amount]) => `<li>Categoria ${catId}: R$ ${amount.toFixed(2)}</li>`).join('')}
        </ol>
        
        <p><a href="${Deno.env.get('APP_URL')}/dashboard">Acessar app</a></p>
      `
      
      // TODO: Integrar com Resend (quando configurado)
      console.log(`Email would be sent to ${user.email}:`, emailHtml)
    }
    
    return new Response(
      JSON.stringify({ message: 'Weekly summaries sent' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
```

### 4.2 Deploy e Agendamento

```bash
# Deploy da Edge Function
supabase functions deploy weekly-summary

# Agendar com pg_cron (rodar no SQL Editor do Supabase)
SELECT cron.schedule(
  'weekly-summary',
  '0 12 * * 1',  -- Toda segunda-feira às 12:00 UTC (9h BRT)
  $$
  SELECT net.http_post(
    url := 'https://PROJECT_REF.supabase.co/functions/v1/weekly-summary',
    headers := '{"Authorization": "Bearer SERVICE_ROLE_KEY"}'::jsonb
  );
  $$
);
```

---

## 5. Rate Limiting e Throttling

### 5.1 Supabase Rate Limits (Free Tier)

| Recurso | Limite |
|---------|--------|
| API requests | 500.000/mês |
| Auth requests | 50.000/mês |
| Storage download | 2GB/mês |
| Edge Functions | 500.000 invocações/mês |
| Realtime connections | 200 concurrent |

### 5.2 Client-Side Throttling

```typescript
// lib/utils/throttle.ts
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0
  
  return (...args: Parameters<T>) => {
    const now = Date.now()
    
    if (now - lastCall >= delay) {
      lastCall = now
      func(...args)
    }
  }
}

// Uso em busca (debounce):
import { useDebouncedValue } from '@mantine/hooks'

function TransactionSearch() {
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm] = useDebouncedValue(searchTerm, 500)
  
  const { data } = useQuery({
    queryKey: ['transactions', 'search', debouncedSearchTerm],
    queryFn: () => searchTransactions(debouncedSearchTerm),
    enabled: debouncedSearchTerm.length >= 3,
  })
  
  return (
    <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Buscar transações..."
    />
  )
}
```

---

## 6. Retry Strategies

### 6.1 Exponential Backoff

```typescript
// lib/utils/retry.ts
export async function retry<T>(
  fn: () => Promise<T>,
  options: {
    retries?: number
    delay?: number
    backoff?: number
  } = {}
): Promise<T> {
  const { retries = 3, delay = 1000, backoff = 2 } = options
  
  try {
    return await fn()
  } catch (error) {
    if (retries <= 0) throw error
    
    await new Promise(resolve => setTimeout(resolve, delay))
    
    return retry(fn, {
      retries: retries - 1,
      delay: delay * backoff,
      backoff,
    })
  }
}

// Uso:
const data = await retry(
  () => fetchTransactions(userId, month),
  { retries: 3, delay: 1000, backoff: 2 }
)
// Tentativas: 0ms → 1s → 2s → 4s (exponential backoff)
```

### 6.2 TanStack Query Retry Config

```typescript
// Retry customizado por tipo de erro
export function useTransactions(month: Date) {
  return useQuery({
    queryKey: ['transactions', userId, format(month, 'yyyy-MM')],
    queryFn: () => fetchTransactions(userId, month),
    retry: (failureCount, error) => {
      // Não retenta erros de autenticação
      if (error.message.includes('JWT expired')) return false
      
      // Não retenta 4xx (client errors)
      if (error.message.includes('400') || error.message.includes('404')) return false
      
      // Retenta até 3 vezes para 5xx (server errors)
      return failureCount < 3
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    // Delays: 1s, 2s, 4s, 8s, 16s, 30s (max)
  })
}
```

---

## 7. Error Handling Patterns

### 7.1 Error Types

```typescript
// lib/types/errors.ts
export class SupabaseError extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: any
  ) {
    super(message)
    this.name = 'SupabaseError'
  }
}

export class AuthError extends SupabaseError {
  constructor(message: string, details?: any) {
    super('AUTH_ERROR', message, details)
    this.name = 'AuthError'
  }
}

export class NetworkError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'NetworkError'
  }
}

// Uso:
async function fetchTransactions(userId: string) {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
  
  if (error) {
    if (error.code === 'PGRST301') {
      throw new AuthError('Sessão expirada. Faça login novamente.')
    }
    
    throw new SupabaseError(error.code, error.message, error.details)
  }
  
  return data
}
```

### 7.2 Global Error Boundary

```typescript
// components/ErrorBoundary.tsx
'use client'

import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: (error: Error, reset: () => void) => ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }
  
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }
  
  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught:', error, errorInfo)
    
    // TODO: Enviar para Sentry
  }
  
  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback(
          this.state.error!,
          () => this.setState({ hasError: false, error: null })
        )
      }
      
      return (
        <div className="error-container">
          <h1>Algo deu errado</h1>
          <p>{this.state.error?.message}</p>
          <button onClick={() => window.location.reload()}>
            Recarregar página
          </button>
        </div>
      )
    }
    
    return this.props.children
  }
}

// Uso em layout:
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html>
      <body>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  )
}
```

---

## 8. Monitoring e Logging

### 8.1 Supabase Logs

```typescript
// Acessar logs no Dashboard do Supabase:
// Settings → API → Logs

// Filtrar por:
// - Status code (200, 400, 500)
// - Path (/rest/v1/transactions)
// - Timestamp range
```

### 8.2 Custom Logging

```typescript
// lib/utils/logger.ts
type LogLevel = 'info' | 'warn' | 'error'

export const logger = {
  info: (message: string, meta?: any) => {
    console.log(`[INFO] ${message}`, meta)
    // Futuro: enviar para Sentry/Logtail
  },
  
  warn: (message: string, meta?: any) => {
    console.warn(`[WARN] ${message}`, meta)
  },
  
  error: (message: string, error?: Error, meta?: any) => {
    console.error(`[ERROR] ${message}`, error, meta)
    // Futuro: enviar para Sentry
  },
}

// Uso:
try {
  await supabase.from('transactions').insert(data)
  logger.info('Transaction created', { userId, amount: data.amount })
} catch (error) {
  logger.error('Failed to create transaction', error as Error, { userId, data })
  throw error
}
```

---

## 9. Testing APIs

### 9.1 Testar Supabase Client

```typescript
// lib/__tests__/supabase.test.ts
import { createClient } from '@supabase/supabase-js'

// Mock do Supabase
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          data: [{ id: '1', amount: 100 }],
          error: null,
        })),
      })),
    })),
  })),
}))

describe('Supabase Client', () => {
  it('fetches transactions', async () => {
    const supabase = createClient('url', 'key')
    const { data } = await supabase.from('transactions').select('*').eq('user_id', '123')
    
    expect(data).toHaveLength(1)
    expect(data[0].amount).toBe(100)
  })
})
```

### 9.2 Testar API Route (BCB Proxy)

```typescript
// app/api/bcb-proxy/__tests__/route.test.ts
import { GET } from '../route'
import { NextRequest } from 'next/server'

// Mock do fetch global
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([{ data: '24/03/2026', valor: '11.75' }]),
  } as Response)
)

describe('BCB Proxy API', () => {
  it('retorna taxa da Selic', async () => {
    const request = new NextRequest('http://localhost:3000/api/bcb-proxy?serie=432')
    const response = await GET(request)
    const data = await response.json()
    
    expect(data.value).toBe(11.75)
    expect(data.serie).toBe('432')
    expect(data.period).toBe('annual')
  })
  
  it('retorna 400 para série inválida', async () => {
    const request = new NextRequest('http://localhost:3000/api/bcb-proxy?serie=999')
    const response = await GET(request)
    
    expect(response.status).toBe(400)
  })
})
```

---

## 10. Conclusão

### 10.1 Checklist de API Integration

- [ ] **Supabase client** configurado (browser + server)
- [ ] **Autenticação** com Google OAuth funcionando
- [ ] **Middleware** de session refresh ativo
- [ ] **RLS** habilitado em todas as tabelas
- [ ] **CRUD operations** implementadas em hooks
- [ ] **Error handling** robusto (try/catch + toast)
- [ ] **BCB Proxy** implementado e cacheado (24h)
- [ ] **Rate limiting** respeitado (< 500k requests/mês)
- [ ] **Retry logic** configurado (exponential backoff)
- [ ] **Logging** implementado (console + futuro Sentry)

### 10.2 Próximos Passos

1. Implementar Sentry para error tracking
2. Adicionar real-time subscriptions (Supabase Realtime)
3. Implementar webhook de Resend para emails
4. Adicionar analytics (Vercel Analytics + Posthog)
5. Implementar rate limiting customizado (Upstash Redis)

---

**Referências**:
- [Supabase JS Docs](https://supabase.com/docs/reference/javascript/introduction)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [TanStack Query Error Handling](https://tanstack.com/query/latest/docs/react/guides/query-functions#handling-and-throwing-errors)
