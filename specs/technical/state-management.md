# State Management — Finance App

**Versão:** 1.0  
**Última atualização:** Março 2026  
**Nível:** Avançado — State Management Architecture

---

## 1. Visão Geral do State Management

Este projeto utiliza uma **arquitetura híbrida** de gerenciamento de estado, combinando três ferramentas especializadas:

### 1.1 Três Tipos de Estado

```
┌──────────────────────────────────────────────────────────┐
│                    STATE HIERARCHY                       │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  1. SERVER STATE (TanStack Query)                        │
│     - Dados do Supabase (transactions, budgets, etc.)   │
│     - Cache automático + invalidação                    │
│     - Loading/error states                              │
│                                                          │
│  2. GLOBAL CLIENT STATE (Zustand)                        │
│     - Mês selecionado (UI state)                        │
│     - Filtros ativos                                    │
│     - Preferências do usuário                           │
│                                                          │
│  3. LOCAL COMPONENT STATE (React useState/useReducer)    │
│     - Estado de formulários (React Hook Form)           │
│     - UI temporária (modals abertos, tabs ativas)       │
│     - Input values não persistidos                      │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 1.2 Por Que Três Ferramentas?

| Estado | Ferramenta | Justificativa |
|--------|------------|---------------|
| **Server data** | TanStack Query | Cache inteligente, deduplicação, retry automático |
| **Global UI** | Zustand | Leve (~1kb), sem boilerplate, performance |
| **Local UI** | React Hooks | Nativo, simples, não precisa de lib externa |

**Anti-pattern evitado**: Usar uma única ferramenta para tudo (ex: Redux com dados do servidor + UI state)

---

## 2. TanStack Query (React Query)

### 2.1 Setup e Configuração

#### 2.1.1 Provider Setup

```typescript
// components/layout/AppProviders.tsx
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // Configurações globais de queries
        staleTime: 60 * 1000,           // Considera "fresco" por 1 min
        cacheTime: 5 * 60 * 1000,       // Mantém em cache por 5 min
        retry: 1,                        // Retenta 1 vez em caso de erro
        refetchOnWindowFocus: false,     // Não refetch ao voltar para aba
        refetchOnReconnect: true,        // Refetch ao reconectar internet
        refetchOnMount: false,           // Não refetch se cache válido
      },
      mutations: {
        // Configurações globais de mutations
        retry: 0,                        // Não retenta mutations (evita duplicatas)
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
      )}
    </QueryClientProvider>
  )
}
```

#### 2.1.2 Configurações Explicadas

**`staleTime`**:
- Quanto tempo os dados são considerados "frescos"
- Durante esse período, queries retornam cache SEM refetch
- ✅ 60s para dados financeiros (balanço em tempo real não é crítico)
- ❌ 0s forçaria refetch em toda renderização (performance ruim)

**`cacheTime`**:
- Quanto tempo o cache fica na memória após a query ser "unused"
- Após esse período, dados são garbage collected
- ✅ 5min permite navegar entre páginas sem refetch
- ❌ Infinity causaria memory leak

**`refetchOnWindowFocus`**:
- Se deve refetch ao usuário voltar para a aba
- ✅ false: evita requisições desnecessárias (dados financeiros mudam pouco)
- ❌ true: útil para dashboards em tempo real (não é o caso)

**`refetchOnMount`**:
- Se deve refetch ao montar componente
- ✅ false: usa cache se ainda válido (staleTime)
- ❌ true: sempre faz network request (desperdiça banda)

### 2.2 Query Keys — Naming Convention

**Estrutura padrão**:
```typescript
['resource', userId, ...params]
```

**Exemplos**:
```typescript
// Transações de um mês específico
['transactions', userId, '2026-03']

// Orçamentos de um mês
['budgets', userId, '2026-03']

// Metas ativas
['goals', userId, 'active']

// Investimentos (todos)
['investments', userId]

// Categorias de despesas
['categories', userId, 'expense']

// Dashboard do mês
['dashboard', userId, '2026-03']
```

**Por que incluir `userId`?**
- Evita cache compartilhado entre usuários (se houver switch de conta)
- Facilita invalidação por usuário: `queryClient.invalidateQueries(['transactions', userId])`

**Por que incluir parâmetros no final?**
- Permite invalidação granular:
  - `['transactions', userId]` → invalida TODAS as transações
  - `['transactions', userId, '2026-03']` → invalida apenas março

### 2.3 Hooks Customizados — Pattern

#### 2.3.1 Template Base

```typescript
// lib/hooks/useResource.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { useUser } from './useUser'
import type { Resource } from '@/lib/types'

// ============ QUERIES (read) ============

export function useResources(params?: ResourceParams) {
  const user = useUser()
  const userId = user?.id
  
  return useQuery({
    queryKey: ['resources', userId, params],
    queryFn: async () => {
      if (!userId) throw new Error('User not authenticated')
      
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .eq('user_id', userId)
        // ... filtros adicionais baseados em params
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data as Resource[]
    },
    enabled: !!userId, // Só executa se userId existir
  })
}

// ============ MUTATIONS (write) ============

export function useCreateResource() {
  const queryClient = useQueryClient()
  const user = useUser()
  const userId = user?.id
  
  return useMutation({
    mutationFn: async (data: Omit<Resource, 'id' | 'user_id' | 'created_at'>) => {
      if (!userId) throw new Error('User not authenticated')
      
      const { data: result, error } = await supabase
        .from('resources')
        .insert({ ...data, user_id: userId })
        .select()
        .single()
      
      if (error) throw error
      return result as Resource
    },
    onSuccess: () => {
      // Invalidar cache para refetch automático
      queryClient.invalidateQueries({ queryKey: ['resources', userId] })
    },
  })
}

export function useUpdateResource() {
  const queryClient = useQueryClient()
  const user = useUser()
  const userId = user?.id
  
  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<Resource> & { id: string }) => {
      const { data: result, error } = await supabase
        .from('resources')
        .update(data)
        .eq('id', id)
        .eq('user_id', userId) // RLS já valida, mas adicionar explicitamente
        .select()
        .single()
      
      if (error) throw error
      return result as Resource
    },
    onSuccess: (data) => {
      // Opção 1: Invalidar tudo
      queryClient.invalidateQueries({ queryKey: ['resources', userId] })
      
      // Opção 2 (mais performático): Update do cache manual
      queryClient.setQueryData<Resource[]>(
        ['resources', userId],
        (old) => old?.map(item => item.id === data.id ? data : item)
      )
    },
  })
}

export function useDeleteResource() {
  const queryClient = useQueryClient()
  const user = useUser()
  const userId = user?.id
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('resources')
        .delete()
        .eq('id', id)
        .eq('user_id', userId)
      
      if (error) throw error
    },
    onSuccess: (_, id) => {
      // Remover do cache manualmente (evita refetch)
      queryClient.setQueryData<Resource[]>(
        ['resources', userId],
        (old) => old?.filter(item => item.id !== id)
      )
    },
  })
}
```

### 2.4 Hooks Implementados

#### 2.4.1 `useTransactions`

```typescript
// lib/hooks/useTransactions.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { useUser } from './useUser'
import { startOfMonth, endOfMonth, format } from 'date-fns'
import type { Transaction } from '@/lib/types'

export function useTransactions(month: Date) {
  const user = useUser()
  const userId = user?.id
  const monthKey = format(month, 'yyyy-MM')
  
  return useQuery({
    queryKey: ['transactions', userId, monthKey],
    queryFn: async () => {
      if (!userId) throw new Error('User not authenticated')
      
      const start = format(startOfMonth(month), 'yyyy-MM-dd')
      const end = format(endOfMonth(month), 'yyyy-MM-dd')
      
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          category:categories(id, name, icon, color)
        `)
        .eq('user_id', userId)
        .gte('date', start)
        .lte('date', end)
        .order('date', { ascending: false })
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data as Transaction[]
    },
    enabled: !!userId,
  })
}

export function useCreateTransaction() {
  const queryClient = useQueryClient()
  const user = useUser()
  const userId = user?.id
  
  return useMutation({
    mutationFn: async (data: Omit<Transaction, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      if (!userId) throw new Error('User not authenticated')
      
      const { data: result, error } = await supabase
        .from('transactions')
        .insert({ ...data, user_id: userId })
        .select(`
          *,
          category:categories(id, name, icon, color)
        `)
        .single()
      
      if (error) throw error
      return result as Transaction
    },
    onSuccess: (newTransaction) => {
      // Invalidar queries relacionadas
      const monthKey = format(new Date(newTransaction.date), 'yyyy-MM')
      
      queryClient.invalidateQueries({ queryKey: ['transactions', userId, monthKey] })
      queryClient.invalidateQueries({ queryKey: ['dashboard', userId, monthKey] })
      queryClient.invalidateQueries({ queryKey: ['budgets', userId, monthKey] })
    },
  })
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient()
  const user = useUser()
  const userId = user?.id
  
  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<Transaction> & { id: string }) => {
      const { data: result, error } = await supabase
        .from('transactions')
        .update(data)
        .eq('id', id)
        .eq('user_id', userId)
        .select(`
          *,
          category:categories(id, name, icon, color)
        `)
        .single()
      
      if (error) throw error
      return result as Transaction
    },
    onMutate: async (updatedTransaction) => {
      // Optimistic update (atualiza UI antes do servidor responder)
      const monthKey = format(new Date(updatedTransaction.date || new Date()), 'yyyy-MM')
      const queryKey = ['transactions', userId, monthKey]
      
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey })
      
      // Snapshot do valor anterior
      const previousTransactions = queryClient.getQueryData<Transaction[]>(queryKey)
      
      // Optimistic update
      if (previousTransactions) {
        queryClient.setQueryData<Transaction[]>(
          queryKey,
          previousTransactions.map(t => 
            t.id === updatedTransaction.id 
              ? { ...t, ...updatedTransaction } 
              : t
          )
        )
      }
      
      // Retornar snapshot para rollback em caso de erro
      return { previousTransactions, queryKey }
    },
    onError: (err, updatedTransaction, context) => {
      // Rollback em caso de erro
      if (context?.previousTransactions) {
        queryClient.setQueryData(context.queryKey, context.previousTransactions)
      }
    },
    onSettled: (data) => {
      // Sempre refetch após finalizar (garante consistência)
      if (data) {
        const monthKey = format(new Date(data.date), 'yyyy-MM')
        queryClient.invalidateQueries({ queryKey: ['transactions', userId, monthKey] })
        queryClient.invalidateQueries({ queryKey: ['dashboard', userId, monthKey] })
      }
    },
  })
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient()
  const user = useUser()
  const userId = user?.id
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id)
        .eq('user_id', userId)
      
      if (error) throw error
      return id
    },
    onSuccess: (id) => {
      // Remover de todos os caches relevantes
      queryClient.setQueriesData<Transaction[]>(
        { queryKey: ['transactions', userId] },
        (old) => old?.filter(t => t.id !== id)
      )
      
      // Invalidar agregações
      queryClient.invalidateQueries({ queryKey: ['dashboard', userId] })
      queryClient.invalidateQueries({ queryKey: ['budgets', userId] })
    },
  })
}
```

#### 2.4.2 `useBudgets`

```typescript
// lib/hooks/useBudgets.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { useUser } from './useUser'
import { useTransactions } from './useTransactions'
import { format } from 'date-fns'
import type { Budget } from '@/lib/types'

export function useBudgets(month: Date) {
  const user = useUser()
  const userId = user?.id
  const monthKey = format(month, 'yyyy-MM-01')
  
  // Buscar transações do mês para calcular spent
  const { data: transactions } = useTransactions(month)
  
  return useQuery({
    queryKey: ['budgets', userId, monthKey],
    queryFn: async () => {
      if (!userId) throw new Error('User not authenticated')
      
      const { data, error } = await supabase
        .from('budgets')
        .select(`
          *,
          category:categories(id, name, icon, color)
        `)
        .eq('user_id', userId)
        .eq('month', monthKey)
        .order('created_at', { ascending: true })
      
      if (error) throw error
      
      // Calcular spent para cada orçamento
      const budgetsWithSpent = data.map(budget => {
        const spent = transactions
          ?.filter(t => t.category_id === budget.category_id && t.type === 'expense')
          .reduce((sum, t) => sum + Number(t.amount), 0) || 0
        
        return {
          ...budget,
          spent,
          percentage: (spent / Number(budget.amount)) * 100,
        }
      })
      
      return budgetsWithSpent
    },
    enabled: !!userId && !!transactions, // Só executa após ter transações
  })
}

export function useCreateBudget() {
  const queryClient = useQueryClient()
  const user = useUser()
  const userId = user?.id
  
  return useMutation({
    mutationFn: async (data: Omit<Budget, 'id' | 'user_id' | 'created_at'>) => {
      if (!userId) throw new Error('User not authenticated')
      
      const { data: result, error } = await supabase
        .from('budgets')
        .insert({ ...data, user_id: userId })
        .select(`
          *,
          category:categories(id, name, icon, color)
        `)
        .single()
      
      if (error) throw error
      return result as Budget
    },
    onSuccess: (newBudget) => {
      const monthKey = newBudget.month
      queryClient.invalidateQueries({ queryKey: ['budgets', userId, monthKey] })
    },
  })
}

export function useUpdateBudget() {
  const queryClient = useQueryClient()
  const user = useUser()
  const userId = user?.id
  
  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<Budget> & { id: string }) => {
      const { data: result, error } = await supabase
        .from('budgets')
        .update(data)
        .eq('id', id)
        .eq('user_id', userId)
        .select(`
          *,
          category:categories(id, name, icon, color)
        `)
        .single()
      
      if (error) throw error
      return result as Budget
    },
    onSuccess: (updatedBudget) => {
      const monthKey = updatedBudget.month
      queryClient.invalidateQueries({ queryKey: ['budgets', userId, monthKey] })
    },
  })
}

export function useDeleteBudget() {
  const queryClient = useQueryClient()
  const user = useUser()
  const userId = user?.id
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('budgets')
        .delete()
        .eq('id', id)
        .eq('user_id', userId)
      
      if (error) throw error
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets', userId] })
    },
  })
}
```

#### 2.4.3 `useDashboard` (Agregação)

```typescript
// lib/hooks/useDashboard.ts
import { useQuery } from '@tanstack/react-query'
import { useUser } from './useUser'
import { useTransactions } from './useTransactions'
import { useBudgets } from './useBudgets'
import { format } from 'date-fns'
import type { DashboardSummary } from '@/lib/types'

export function useDashboard(month: Date) {
  const user = useUser()
  const userId = user?.id
  const monthKey = format(month, 'yyyy-MM')
  
  const { data: transactions, isLoading: transactionsLoading } = useTransactions(month)
  const { data: budgets, isLoading: budgetsLoading } = useBudgets(month)
  
  return useQuery({
    queryKey: ['dashboard', userId, monthKey],
    queryFn: (): DashboardSummary => {
      if (!transactions) throw new Error('Transactions not loaded')
      
      // Calcular totais
      const income = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + Number(t.amount), 0)
      
      const expenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Number(t.amount), 0)
      
      // Agrupar despesas por categoria
      const expensesByCategory = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => {
          const categoryId = t.category_id
          if (!acc[categoryId]) {
            acc[categoryId] = {
              category: t.category!,
              total: 0,
            }
          }
          acc[categoryId].total += Number(t.amount)
          return acc
        }, {} as Record<string, { category: Category; total: number }>)
      
      const expensesByCategoryArray = Object.values(expensesByCategory)
        .map(item => ({
          ...item,
          percentage: expenses > 0 ? (item.total / expenses) * 100 : 0,
        }))
        .sort((a, b) => b.total - a.total)
      
      return {
        month: monthKey,
        totalIncome: income,
        totalExpenses: expenses,
        balance: income - expenses,
        expensesByCategory: expensesByCategoryArray,
        recentTransactions: transactions.slice(0, 5),
        budgets: budgets || [],
      }
    },
    enabled: !!userId && !!transactions && !transactionsLoading,
  })
}
```

### 2.5 Cache Invalidation Strategies

#### 2.5.1 Invalidação Granular

```typescript
// Invalida apenas transações de março de 2026
queryClient.invalidateQueries({ 
  queryKey: ['transactions', userId, '2026-03'] 
})

// Invalida transações de TODOS os meses
queryClient.invalidateQueries({ 
  queryKey: ['transactions', userId] 
})

// Invalida TUDO do usuário
queryClient.invalidateQueries({ 
  queryKey: [userId] 
})
```

#### 2.5.2 Invalidação em Cascata

```typescript
// Ao criar transação, invalidar:
// 1. Lista de transações do mês
queryClient.invalidateQueries({ queryKey: ['transactions', userId, monthKey] })

// 2. Dashboard (depende de transações)
queryClient.invalidateQueries({ queryKey: ['dashboard', userId, monthKey] })

// 3. Orçamentos (depende de transações para calcular spent)
queryClient.invalidateQueries({ queryKey: ['budgets', userId, monthKey] })

// 4. Metas (se for do tipo monthly_savings)
queryClient.invalidateQueries({ queryKey: ['goals', userId] })
```

#### 2.5.3 Update Manual do Cache (Performance)

```typescript
// Opção 1: Invalidar (refetch automático)
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ['transactions'] })
}
// Pros: Simples, sempre consistente
// Cons: Requisição extra (200-500ms)

// Opção 2: Update manual (sem refetch)
onSuccess: (newTransaction) => {
  queryClient.setQueryData<Transaction[]>(
    ['transactions', userId, monthKey],
    (old) => old ? [newTransaction, ...old] : [newTransaction]
  )
}
// Pros: Instantâneo (0ms)
// Cons: Precisa manter lógica de ordenação/filtros
```

### 2.6 Optimistic Updates

```typescript
export function useUpdateTransaction() {
  const queryClient = useQueryClient()
  const user = useUser()
  const userId = user?.id
  
  return useMutation({
    mutationFn: async (data) => {
      // Simular delay de rede (para testar optimistic update)
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const { data: result, error } = await supabase
        .from('transactions')
        .update(data)
        .eq('id', data.id)
        .select()
        .single()
      
      if (error) throw error
      return result
    },
    
    // 1. ANTES de enviar request (atualiza UI imediatamente)
    onMutate: async (updatedData) => {
      const queryKey = ['transactions', userId]
      
      // Cancelar queries em andamento (evitar race condition)
      await queryClient.cancelQueries({ queryKey })
      
      // Snapshot do estado anterior (para rollback)
      const previousData = queryClient.getQueryData<Transaction[]>(queryKey)
      
      // Atualizar cache optimisticamente
      if (previousData) {
        queryClient.setQueryData<Transaction[]>(
          queryKey,
          previousData.map(t => 
            t.id === updatedData.id 
              ? { ...t, ...updatedData, _optimistic: true }  // Flag de optimistic
              : t
          )
        )
      }
      
      return { previousData, queryKey }
    },
    
    // 2. SE request falhar (rollback)
    onError: (err, updatedData, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(context.queryKey, context.previousData)
      }
      
      toast.error('Falha ao atualizar transação. Tente novamente.')
    },
    
    // 3. SEMPRE após finalizar (sucesso ou erro)
    onSettled: (data, error, variables, context) => {
      // Refetch para garantir consistência com servidor
      queryClient.invalidateQueries({ queryKey: context?.queryKey })
    },
  })
}
```

**Fluxo do optimistic update**:
```
User clica "Salvar"
  ↓
UI atualiza IMEDIATAMENTE (onMutate)
  ↓
Request enviado ao servidor (2s de delay)
  ↓
CASO 1: Sucesso
  → onSuccess executa
  → Cache já está correto (nada a fazer)
  → onSettled refetch (validação final)

CASO 2: Erro
  → onError executa
  → Rollback para estado anterior (previousData)
  → Toast de erro exibido
```

### 2.7 Prefetching (Performance)

```typescript
// Prefetch de transações do mês seguinte (hover em botão "Próximo mês")
function MonthPicker({ currentMonth }: { currentMonth: Date }) {
  const queryClient = useQueryClient()
  const user = useUser()
  const nextMonth = addMonths(currentMonth, 1)
  
  const handleMouseEnter = () => {
    // Prefetch em background (não bloqueia UI)
    queryClient.prefetchQuery({
      queryKey: ['transactions', user?.id, format(nextMonth, 'yyyy-MM')],
      queryFn: () => fetchTransactions(user?.id, nextMonth),
    })
  }
  
  return (
    <button onMouseEnter={handleMouseEnter}>
      Próximo mês →
    </button>
  )
}
```

**Quando usar prefetch?**
- ✅ Paginação (prefetch próxima página)
- ✅ Navegação previsível (hover em links)
- ✅ Dados críticos (prefetch ao carregar dashboard)
- ❌ Dados raramente acessados (desperdício de banda)

---

## 3. Zustand (Global Client State)

### 3.1 Store Setup

```typescript
// store/useAppStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AppState {
  // ===== Mês selecionado =====
  selectedMonth: Date
  setSelectedMonth: (month: Date) => void
  
  // ===== Filtros de transações =====
  transactionFilters: {
    categoryId?: string
    type?: 'expense' | 'income' | 'all'
    minAmount?: number
    maxAmount?: number
    startDate?: string
    endDate?: string
  }
  setTransactionFilters: (filters: AppState['transactionFilters']) => void
  clearTransactionFilters: () => void
  
  // ===== Preferências de UI =====
  sidebarCollapsed: boolean
  toggleSidebar: () => void
  
  theme: 'light' | 'dark' | 'system'
  setTheme: (theme: AppState['theme']) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Estado inicial
      selectedMonth: new Date(),
      transactionFilters: {},
      sidebarCollapsed: false,
      theme: 'system',
      
      // Actions
      setSelectedMonth: (month) => set({ selectedMonth: month }),
      
      setTransactionFilters: (filters) => 
        set((state) => ({
          transactionFilters: { ...state.transactionFilters, ...filters }
        })),
      
      clearTransactionFilters: () => set({ transactionFilters: {} }),
      
      toggleSidebar: () => 
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'finance-app-storage', // Key no localStorage
      partialize: (state) => ({
        // Apenas persistir estes campos (não selectedMonth, é sempre "hoje")
        sidebarCollapsed: state.sidebarCollapsed,
        theme: state.theme,
      }),
    }
  )
)
```

### 3.2 Uso em Componentes

```typescript
// Exemplo 1: Ler estado (com seletor)
function MonthPicker() {
  const selectedMonth = useAppStore((state) => state.selectedMonth)
  const setSelectedMonth = useAppStore((state) => state.setSelectedMonth)
  
  return (
    <div>
      <button onClick={() => setSelectedMonth(subMonths(selectedMonth, 1))}>
        ← Mês anterior
      </button>
      <span>{format(selectedMonth, 'MMMM yyyy', { locale: ptBR })}</span>
      <button onClick={() => setSelectedMonth(addMonths(selectedMonth, 1))}>
        Próximo mês →
      </button>
    </div>
  )
}

// Exemplo 2: Usar múltiplos valores
function TransactionFilters() {
  const { transactionFilters, setTransactionFilters, clearTransactionFilters } = 
    useAppStore((state) => ({
      transactionFilters: state.transactionFilters,
      setTransactionFilters: state.setTransactionFilters,
      clearTransactionFilters: state.clearTransactionFilters,
    }))
  
  return (
    <div>
      <input
        type="number"
        value={transactionFilters.minAmount || ''}
        onChange={(e) => setTransactionFilters({ minAmount: Number(e.target.value) })}
        placeholder="Valor mínimo"
      />
      <button onClick={clearTransactionFilters}>Limpar filtros</button>
    </div>
  )
}

// Exemplo 3: Seletor derivado (computed state)
function TransactionList() {
  const hasActiveFilters = useAppStore((state) => 
    Object.keys(state.transactionFilters).length > 0
  )
  
  return (
    <div>
      {hasActiveFilters && <Badge>Filtros ativos</Badge>}
      {/* ... */}
    </div>
  )
}
```

### 3.3 Performance — Selectores

**❌ Re-render desnecessário**:
```typescript
function Component() {
  // Problema: re-renderiza quando QUALQUER parte do state mudar
  const store = useAppStore()
  
  return <div>{store.selectedMonth.toISOString()}</div>
}
```

**✅ Re-render apenas quando selectedMonth mudar**:
```typescript
function Component() {
  // Solução: seletor granular
  const selectedMonth = useAppStore((state) => state.selectedMonth)
  
  return <div>{selectedMonth.toISOString()}</div>
}
```

**Por que?**
- Zustand usa `Object.is()` para comparar valores retornados pelo seletor
- Se o valor não mudar, componente não re-renderiza
- Equivalente ao `useMemo()` do React

### 3.4 Actions Complexas

```typescript
// Action que atualiza múltiplos valores
setMonthAndClearFilters: (month) => 
  set({
    selectedMonth: month,
    transactionFilters: {},
  }),

// Action assíncrona (com side effects)
fetchAndSetTheme: async () => {
  const theme = await fetchUserTheme()
  set({ theme })
},

// Action que depende do estado anterior
incrementMonth: () => 
  set((state) => ({
    selectedMonth: addMonths(state.selectedMonth, 1)
  })),
```

---

## 4. React Hook Form (Form State)

### 4.1 Setup com Zod

```typescript
// components/forms/TransactionForm.tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const transactionSchema = z.object({
  type: z.enum(['expense', 'income']),
  amount: z.number().positive('Valor deve ser maior que zero'),
  description: z.string().min(1, 'Descrição obrigatória').max(100),
  category_id: z.string().uuid('Selecione uma categoria'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida'),
  notes: z.string().max(500).optional(),
})

type TransactionFormData = z.infer<typeof transactionSchema>

export function TransactionForm({ 
  defaultValues, 
  onSubmit 
}: { 
  defaultValues?: Partial<TransactionFormData>
  onSubmit: (data: TransactionFormData) => void 
}) {
  const form = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: 'expense',
      date: format(new Date(), 'yyyy-MM-dd'),
      ...defaultValues,
    },
  })
  
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Fields aqui */}
    </form>
  )
}
```

### 4.2 Integração com TanStack Query

```typescript
function TransactionFormContainer() {
  const createTransaction = useCreateTransaction()
  
  const handleSubmit = async (data: TransactionFormData) => {
    try {
      await createTransaction.mutateAsync(data)
      toast.success('Transação criada com sucesso!')
      // Form é resetado automaticamente pelo componente pai (Sheet)
    } catch (error) {
      toast.error('Erro ao criar transação')
    }
  }
  
  return (
    <TransactionForm 
      onSubmit={handleSubmit}
      isSubmitting={createTransaction.isLoading}
    />
  )
}
```

---

## 5. Padrões Avançados

### 5.1 Dependent Queries

```typescript
// Query 2 depende de Query 1
function UserDashboard() {
  const { data: user } = useUser()
  
  const { data: transactions } = useTransactions(new Date(), {
    enabled: !!user, // ← Só executa se user existir
  })
  
  const { data: dashboard } = useDashboard(new Date(), {
    enabled: !!transactions, // ← Só executa se transactions existirem
  })
  
  if (!user) return <div>Carregando usuário...</div>
  if (!transactions) return <div>Carregando transações...</div>
  if (!dashboard) return <div>Processando dashboard...</div>
  
  return <Dashboard data={dashboard} />
}
```

### 5.2 Parallel Queries

```typescript
// Múltiplas queries em paralelo
function DashboardPage() {
  const month = useAppStore((state) => state.selectedMonth)
  
  const transactions = useTransactions(month)
  const budgets = useBudgets(month)
  const goals = useGoals()
  const investments = useInvestments()
  
  // Esperar todas carregarem
  const isLoading = [transactions, budgets, goals, investments].some(q => q.isLoading)
  const hasError = [transactions, budgets, goals, investments].some(q => q.error)
  
  if (isLoading) return <DashboardSkeleton />
  if (hasError) return <ErrorMessage />
  
  return (
    <Dashboard
      transactions={transactions.data}
      budgets={budgets.data}
      goals={goals.data}
      investments={investments.data}
    />
  )
}
```

### 5.3 Infinite Queries (Paginação)

```typescript
// Scroll infinito (futuro, para histórico de transações)
export function useTransactionsInfinite() {
  const user = useUser()
  const userId = user?.id
  
  return useInfiniteQuery({
    queryKey: ['transactions', userId, 'infinite'],
    queryFn: async ({ pageParam = 0 }) => {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false })
        .range(pageParam * 20, (pageParam + 1) * 20 - 1)
      
      if (error) throw error
      return data
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 20 ? allPages.length : undefined
    },
    enabled: !!userId,
  })
}

// Uso:
function TransactionHistory() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useTransactionsInfinite()
  
  return (
    <div>
      {data?.pages.map((page, i) => (
        <React.Fragment key={i}>
          {page.map((transaction) => (
            <TransactionCard key={transaction.id} transaction={transaction} />
          ))}
        </React.Fragment>
      ))}
      
      {hasNextPage && (
        <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
          {isFetchingNextPage ? 'Carregando...' : 'Carregar mais'}
        </button>
      )}
    </div>
  )
}
```

---

## 6. Testing

### 6.1 Testar Hooks com TanStack Query

```typescript
// lib/hooks/__tests__/useTransactions.test.ts
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useTransactions } from '../useTransactions'

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

describe('useTransactions', () => {
  it('retorna transações do mês', async () => {
    const { result } = renderHook(() => useTransactions(new Date('2026-03-01')), {
      wrapper: createWrapper(),
    })
    
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    
    expect(result.current.data).toHaveLength(5)
    expect(result.current.data[0].date).toMatch(/^2026-03/)
  })
  
  it('refetch ao invalidar cache', async () => {
    const queryClient = new QueryClient()
    const { result } = renderHook(() => useTransactions(new Date('2026-03-01')), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ),
    })
    
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    
    // Invalidar cache
    queryClient.invalidateQueries({ queryKey: ['transactions'] })
    
    // Aguardar refetch
    await waitFor(() => expect(result.current.isFetching).toBe(false))
    
    expect(result.current.data).toBeDefined()
  })
})
```

### 6.2 Testar Zustand Store

```typescript
// store/__tests__/useAppStore.test.ts
import { renderHook, act } from '@testing-library/react'
import { useAppStore } from '../useAppStore'

describe('useAppStore', () => {
  beforeEach(() => {
    // Reset store antes de cada teste
    useAppStore.setState({
      selectedMonth: new Date('2026-03-01'),
      transactionFilters: {},
    })
  })
  
  it('atualiza mês selecionado', () => {
    const { result } = renderHook(() => useAppStore())
    
    act(() => {
      result.current.setSelectedMonth(new Date('2026-04-01'))
    })
    
    expect(result.current.selectedMonth).toEqual(new Date('2026-04-01'))
  })
  
  it('adiciona filtros incrementalmente', () => {
    const { result } = renderHook(() => useAppStore())
    
    act(() => {
      result.current.setTransactionFilters({ categoryId: 'cat-1' })
    })
    
    expect(result.current.transactionFilters).toEqual({ categoryId: 'cat-1' })
    
    act(() => {
      result.current.setTransactionFilters({ type: 'expense' })
    })
    
    expect(result.current.transactionFilters).toEqual({
      categoryId: 'cat-1',
      type: 'expense',
    })
  })
})
```

---

## 7. Performance Monitoring

### 7.1 React Query DevTools

```typescript
// Ver em tempo real:
// - Queries ativas
// - Cache hits/misses
// - Tempo de fetch
// - Stale/fresh status

// Abrir DevTools: clique no ícone flutuante no canto inferior direito (dev mode)
```

### 7.2 Performance Metrics

```typescript
// Adicionar logging customizado
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      onSuccess: (data, query) => {
        console.log(`Query ${query.queryKey} succeeded in ${query.state.dataUpdatedAt - query.state.fetchMeta?.startTime}ms`)
      },
      onError: (error, query) => {
        console.error(`Query ${query.queryKey} failed:`, error)
      },
    },
  },
})
```

---

## 8. Conclusão

### 8.1 Checklist de Best Practices

- [ ] **TanStack Query** para dados do servidor (não useState + useEffect)
- [ ] **Zustand** para estado global de UI (não Context API para tudo)
- [ ] **React Hook Form** para formulários (não useState para cada input)
- [ ] **Query keys** consistentes (`['resource', userId, ...params]`)
- [ ] **Invalidação em cascata** (invalidar queries dependentes)
- [ ] **Optimistic updates** para mutations frequentes (melhor UX)
- [ ] **Prefetching** em navegação previsível (performance)
- [ ] **Seletores granulares** no Zustand (evitar re-renders)
- [ ] **Error handling** em todos os hooks (toast.error)
- [ ] **Loading states** em todas as queries (skeleton loaders)

### 8.2 Anti-Patterns a Evitar

- ❌ Misturar server state com client state no Zustand
- ❌ Fetch manual com `useEffect` + `useState`
- ❌ Query keys inconsistentes (`['transactions']` vs `['transaction']`)
- ❌ Não invalidar cache após mutations (dados desatualizados)
- ❌ Seletores que retornam objetos novos a cada render
- ❌ Guardar dados do servidor no localStorage
- ❌ Usar Context API para dados frequentemente atualizados

---

**Referências**:
- [TanStack Query Docs](https://tanstack.com/query/latest/docs/react/overview)
- [Zustand Docs](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [React Hook Form Docs](https://react-hook-form.com/get-started)
