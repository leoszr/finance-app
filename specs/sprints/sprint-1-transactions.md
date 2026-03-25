# Sprint 1 — Transações

**Objetivo:** CRUD completo de transações com categorias, filtros mensais e recorrências.  
**Estimativa:** 5–7 dias  
**Status:** 🔴 Não iniciado  
**Tasks:** TASK-007, TASK-008, TASK-009, TASK-010

---

## Visão Geral

Esta sprint implementa o núcleo do aplicativo: o sistema completo de gerenciamento de transações (receitas e despesas). Ao final, o usuário poderá:
- Adicionar, editar e excluir transações manualmente
- Visualizar transações organizadas por mês
- Ver resumo do mês (receitas, despesas, saldo)
- Configurar transações recorrentes (ex: aluguel, salário)
- Navegar entre meses com facilidade

Esta é a sprint mais importante depois do setup, pois todas as outras funcionalidades (dashboard, metas, investimentos) dependem dos dados de transações.

---

## TASK-007: Hook `useTransactions`

**Descrição expandida:**  
Criar hook customizado que centraliza toda a lógica de acesso e manipulação de transações usando TanStack Query. Este hook será usado em todas as páginas e componentes que lidam com transações.

### Arquivos a criar/modificar

```
├── lib/hooks/
│   └── useTransactions.ts         (hook principal)
├── lib/utils/
│   └── currency.ts                (formatação de moeda)
└── app/
    └── providers.tsx              (TanStack Query Provider)
```

### Código exemplo

#### `app/providers.tsx` (TanStack Query Provider)
```typescript
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'

/**
 * Provider do TanStack Query para toda a aplicação
 * 
 * Configurações:
 * - staleTime: 5 minutos (dados são considerados frescos por 5min)
 * - gcTime: 10 minutos (cache persiste por 10min)
 * - retry: 1 tentativa em caso de erro
 */
export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutos
            gcTime: 10 * 60 * 1000,   // 10 minutos (antes: cacheTime)
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
```

#### `lib/utils/currency.ts`
```typescript
/**
 * Utilitários para formatação de valores monetários em BRL
 */

/**
 * Formata número como moeda brasileira (R$)
 * 
 * @example
 * formatCurrency(1500.50) // "R$ 1.500,50"
 * formatCurrency(-250)    // "-R$ 250,00"
 */
export function formatCurrency(value: number): string {
  const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  return formatter.format(value)
}

/**
 * Formata número como moeda abreviada (para gráficos)
 * 
 * @example
 * formatCurrencyCompact(1500)    // "R$ 1,5 mil"
 * formatCurrencyCompact(1500000) // "R$ 1,5 mi"
 */
export function formatCurrencyCompact(value: number): string {
  if (Math.abs(value) >= 1_000_000) {
    return `R$ ${(value / 1_000_000).toFixed(1)} mi`
  }
  if (Math.abs(value) >= 1_000) {
    return `R$ ${(value / 1_000).toFixed(1)} mil`
  }
  return formatCurrency(value)
}

/**
 * Parse de string para número (remove R$, pontos e substitui vírgula)
 * 
 * @example
 * parseCurrency("R$ 1.500,50") // 1500.50
 * parseCurrency("1.500,50")    // 1500.50
 */
export function parseCurrency(value: string): number {
  const cleaned = value
    .replace('R$', '')
    .replace(/\./g, '')  // Remove separadores de milhar
    .replace(',', '.')   // Substitui vírgula por ponto
    .trim()

  const parsed = parseFloat(cleaned)
  return isNaN(parsed) ? 0 : parsed
}
```

#### `lib/hooks/useTransactions.ts`
```typescript
'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Transaction, TransactionFormData } from '@/lib/types'
import { format, startOfMonth, endOfMonth } from 'date-fns'
import { useToast } from '@/components/ui/use-toast'

/**
 * Hook para gerenciar transações
 * 
 * Provides:
 * - useTransactions: listar transações do mês
 * - useCreateTransaction: criar nova transação
 * - useUpdateTransaction: atualizar transação
 * - useDeleteTransaction: deletar transação
 */

// ============================================
// Query: Listar transações do mês
// ============================================

interface UseTransactionsOptions {
  month: Date
  enabled?: boolean
}

export function useTransactions({ month, enabled = true }: UseTransactionsOptions) {
  const supabase = createClient()

  const monthStart = format(startOfMonth(month), 'yyyy-MM-dd')
  const monthEnd = format(endOfMonth(month), 'yyyy-MM-dd')
  const monthKey = format(month, 'yyyy-MM')

  return useQuery({
    queryKey: ['transactions', monthKey],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error('Usuário não autenticado')

      const { data, error } = await supabase
        .from('transactions')
        .select(
          `
          *,
          category:categories (
            id,
            name,
            type,
            icon,
            color
          )
        `
        )
        .eq('user_id', user.id)
        .gte('date', monthStart)
        .lte('date', monthEnd)
        .order('date', { ascending: false })
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao buscar transações:', error)
        throw new Error('Não foi possível carregar as transações')
      }

      return (data as Transaction[]) || []
    },
    enabled,
  })
}

// ============================================
// Mutation: Criar transação
// ============================================

export function useCreateTransaction() {
  const supabase = createClient()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (data: TransactionFormData) => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error('Usuário não autenticado')

      const { data: transaction, error } = await supabase
        .from('transactions')
        .insert([
          {
            user_id: user.id,
            type: data.type,
            amount: data.amount,
            description: data.description,
            category_id: data.category_id,
            date: data.date,
            notes: data.notes || null,
            is_recurring: false,
            source: 'manual',
          },
        ])
        .select()
        .single()

      if (error) {
        console.error('Erro ao criar transação:', error)
        throw new Error('Não foi possível criar a transação')
      }

      return transaction as Transaction
    },
    onSuccess: () => {
      // Invalidar todas as queries de transações (todos os meses)
      queryClient.invalidateQueries({ queryKey: ['transactions'] })

      // Invalidar dashboard também
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })

      toast({
        title: 'Transação criada',
        description: 'A transação foi adicionada com sucesso.',
      })
    },
    onError: (error) => {
      toast({
        title: 'Erro ao criar transação',
        description: error.message,
        variant: 'destructive',
      })
    },
  })
}

// ============================================
// Mutation: Atualizar transação
// ============================================

interface UpdateTransactionParams {
  id: string
  data: Partial<TransactionFormData>
}

export function useUpdateTransaction() {
  const supabase = createClient()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async ({ id, data }: UpdateTransactionParams) => {
      const { data: transaction, error } = await supabase
        .from('transactions')
        .update({
          type: data.type,
          amount: data.amount,
          description: data.description,
          category_id: data.category_id,
          date: data.date,
          notes: data.notes || null,
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Erro ao atualizar transação:', error)
        throw new Error('Não foi possível atualizar a transação')
      }

      return transaction as Transaction
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })

      toast({
        title: 'Transação atualizada',
        description: 'As alterações foram salvas com sucesso.',
      })
    },
    onError: (error) => {
      toast({
        title: 'Erro ao atualizar transação',
        description: error.message,
        variant: 'destructive',
      })
    },
  })
}

// ============================================
// Mutation: Deletar transação
// ============================================

export function useDeleteTransaction() {
  const supabase = createClient()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('transactions').delete().eq('id', id)

      if (error) {
        console.error('Erro ao deletar transação:', error)
        throw new Error('Não foi possível excluir a transação')
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })

      toast({
        title: 'Transação excluída',
        description: 'A transação foi removida com sucesso.',
      })
    },
    onError: (error) => {
      toast({
        title: 'Erro ao excluir transação',
        description: error.message,
        variant: 'destructive',
      })
    },
  })
}

// ============================================
// Hook auxiliar: Resumo do mês
// ============================================

interface MonthSummary {
  totalIncome: number
  totalExpenses: number
  balance: number
  transactionCount: number
}

export function useMonthSummary(month: Date): MonthSummary {
  const { data: transactions = [] } = useTransactions({ month })

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const balance = totalIncome - totalExpenses

  return {
    totalIncome,
    totalExpenses,
    balance,
    transactionCount: transactions.length,
  }
}
```

### Passos de implementação

1. **Criar QueryClientProvider:**
   - Criar `app/providers.tsx`
   - Envolver `<body>` no root layout:
   ```typescript
   // app/layout.tsx
   import { Providers } from './providers'
   
   export default function RootLayout({ children }) {
     return (
       <html>
         <body>
           <Providers>{children}</Providers>
         </body>
       </html>
     )
   }
   ```

2. **Criar utilitários de moeda:**
   - Criar `lib/utils/currency.ts`
   - Implementar `formatCurrency`, `formatCurrencyCompact`, `parseCurrency`

3. **Criar hook useTransactions:**
   - Criar `lib/hooks/useTransactions.ts`
   - Implementar todas as funções conforme exemplo

4. **Testar em componente temporário:**
   ```typescript
   // app/(app)/dashboard/page.tsx
   'use client'
   
   import { useTransactions } from '@/lib/hooks/useTransactions'
   
   export default function Dashboard() {
     const { data, isLoading, error } = useTransactions({ month: new Date() })
     
     if (isLoading) return <div>Carregando...</div>
     if (error) return <div>Erro: {error.message}</div>
     
     return (
       <div>
         <h1>Transações</h1>
         <pre>{JSON.stringify(data, null, 2)}</pre>
       </div>
     )
   }
   ```

### Critérios de aceitação

- [ ] TanStack Query Provider configurado no root layout
- [ ] `useTransactions` retorna transações do mês filtradas por usuário
- [ ] Transações vêm ordenadas por data (mais recentes primeiro)
- [ ] Join com `categories` funciona (transação contém dados da categoria)
- [ ] `useCreateTransaction` cria transação e invalida cache
- [ ] `useUpdateTransaction` atualiza transação corretamente
- [ ] `useDeleteTransaction` remove transação
- [ ] Toasts aparecem após cada mutação (sucesso ou erro)
- [ ] `useMonthSummary` calcula totais corretamente
- [ ] Formatação de moeda funciona (`formatCurrency(1500)` → "R$ 1.500,00")

### Possíveis desafios/edge cases

- **Query não executa:** Verificar se Provider está envolvendo corretamente
- **RLS bloqueia query:** Verificar se usuário está autenticado (`auth.uid()` não nulo)
- **Decimal precision:** `amount` vem do banco como string. Converter com `Number()` antes de somar
- **Timezone:** Usar sempre `yyyy-MM-dd` para datas (sem timezone)

### Dependências

- Sprint 0 completa (TASK-001 a TASK-006)

### Tempo estimado

**4–5 horas** (incluindo testes e ajustes)

---

## TASK-008: Formulário de nova transação

**Descrição expandida:**  
Criar formulário completo para adicionar e editar transações com validação Zod, formatação automática de valores e UX otimizada para mobile.

### Arquivos a criar/modificar

```
├── components/forms/
│   └── TransactionForm.tsx        (formulário principal)
├── components/shared/
│   └── CurrencyInput.tsx          (input customizado de moeda)
├── lib/hooks/
│   └── useCategories.ts           (hook para buscar categorias)
```

### Código exemplo

#### `lib/hooks/useCategories.ts`
```typescript
'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Category, CategoryType } from '@/lib/types'

/**
 * Hook para buscar categorias do usuário
 */
export function useCategories(type?: CategoryType) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['categories', type],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error('Usuário não autenticado')

      let query = supabase
        .from('categories')
        .select('*')
        .eq('user_id', user.id)
        .order('name')

      if (type) {
        query = query.eq('type', type)
      }

      const { data, error } = await query

      if (error) {
        console.error('Erro ao buscar categorias:', error)
        throw new Error('Não foi possível carregar as categorias')
      }

      return (data as Category[]) || []
    },
  })
}
```

#### `components/shared/CurrencyInput.tsx`
```typescript
'use client'

import { Input } from '@/components/ui/input'
import { formatCurrency, parseCurrency } from '@/lib/utils/currency'
import { ChangeEvent, useState, useEffect } from 'react'

interface CurrencyInputProps {
  value: number
  onChange: (value: number) => void
  placeholder?: string
  disabled?: boolean
}

/**
 * Input customizado para valores monetários
 * 
 * - Formata automaticamente como R$ X.XXX,XX
 * - Aceita apenas números
 * - Retorna valor numérico no onChange
 */
export function CurrencyInput({
  value,
  onChange,
  placeholder = 'R$ 0,00',
  disabled = false,
}: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = useState('')

  useEffect(() => {
    if (value === 0) {
      setDisplayValue('')
    } else {
      setDisplayValue(formatCurrency(value).replace('R$', '').trim())
    }
  }, [value])

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const input = e.target.value
    const numericValue = parseCurrency(input)

    onChange(numericValue)
  }

  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
        R$
      </span>
      <Input
        type="text"
        inputMode="decimal"
        value={displayValue}
        onChange={handleChange}
        placeholder={placeholder.replace('R$', '').trim()}
        disabled={disabled}
        className="pl-10"
      />
    </div>
  )
}
```

#### `components/forms/TransactionForm.tsx`
```typescript
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { format } from 'date-fns'
import { useCreateTransaction, useUpdateTransaction } from '@/lib/hooks/useTransactions'
import { useCategories } from '@/lib/hooks/useCategories'
import { Transaction, TransactionType } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CurrencyInput } from '@/components/shared/CurrencyInput'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

// ============================================
// Schema de validação Zod
// ============================================

const transactionSchema = z.object({
  type: z.enum(['expense', 'income'], {
    required_error: 'Selecione o tipo de transação',
  }),
  amount: z.number().positive('O valor deve ser maior que zero'),
  description: z
    .string()
    .min(1, 'Descrição obrigatória')
    .max(100, 'Descrição muito longa (máximo 100 caracteres)'),
  category_id: z.string().uuid('Selecione uma categoria'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida'),
  notes: z.string().max(500, 'Notas muito longas (máximo 500 caracteres)').optional(),
})

type TransactionFormValues = z.infer<typeof transactionSchema>

// ============================================
// Props do componente
// ============================================

interface TransactionFormProps {
  transaction?: Transaction // Se fornecido, modo edição
  onSuccess?: () => void
  defaultType?: TransactionType
}

// ============================================
// Componente principal
// ============================================

export function TransactionForm({
  transaction,
  onSuccess,
  defaultType = 'expense',
}: TransactionFormProps) {
  const isEditing = !!transaction

  // Hooks de mutação
  const createMutation = useCreateTransaction()
  const updateMutation = useUpdateTransaction()

  // Form state
  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: transaction?.type || defaultType,
      amount: transaction?.amount ? Number(transaction.amount) : 0,
      description: transaction?.description || '',
      category_id: transaction?.category_id || '',
      date: transaction?.date || format(new Date(), 'yyyy-MM-dd'),
      notes: transaction?.notes || '',
    },
  })

  const watchType = form.watch('type')

  // Buscar categorias do tipo selecionado
  const { data: categories = [], isLoading: loadingCategories } = useCategories(watchType)

  // Submit handler
  async function onSubmit(data: TransactionFormValues) {
    if (isEditing && transaction) {
      await updateMutation.mutateAsync({ id: transaction.id, data })
    } else {
      await createMutation.mutateAsync(data)
    }

    onSuccess?.()
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Toggle: Receita / Despesa */}
      <div>
        <Label>Tipo</Label>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => form.setValue('type', 'expense')}
            className={cn(
              'flex items-center justify-center gap-2 rounded-lg border-2 p-3 text-sm font-medium transition-colors',
              watchType === 'expense'
                ? 'border-red-500 bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300'
                : 'border-zinc-200 bg-white text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300'
            )}
          >
            <TrendingDown className="h-4 w-4" />
            Despesa
          </button>

          <button
            type="button"
            onClick={() => form.setValue('type', 'income')}
            className={cn(
              'flex items-center justify-center gap-2 rounded-lg border-2 p-3 text-sm font-medium transition-colors',
              watchType === 'income'
                ? 'border-green-600 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300'
                : 'border-zinc-200 bg-white text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300'
            )}
          >
            <TrendingUp className="h-4 w-4" />
            Receita
          </button>
        </div>
      </div>

      {/* Valor */}
      <div>
        <Label htmlFor="amount">Valor</Label>
        <CurrencyInput
          value={form.watch('amount')}
          onChange={(value) => form.setValue('amount', value)}
          disabled={isSubmitting}
        />
        {form.formState.errors.amount && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {form.formState.errors.amount.message}
          </p>
        )}
      </div>

      {/* Descrição */}
      <div>
        <Label htmlFor="description">Descrição</Label>
        <Input
          id="description"
          placeholder="Ex: Supermercado"
          {...form.register('description')}
          disabled={isSubmitting}
        />
        {form.formState.errors.description && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {form.formState.errors.description.message}
          </p>
        )}
      </div>

      {/* Categoria */}
      <div>
        <Label htmlFor="category">Categoria</Label>
        <Select
          value={form.watch('category_id')}
          onValueChange={(value) => form.setValue('category_id', value)}
          disabled={isSubmitting || loadingCategories}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma categoria" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.icon && <span className="mr-2">{category.icon}</span>}
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {form.formState.errors.category_id && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {form.formState.errors.category_id.message}
          </p>
        )}
      </div>

      {/* Data */}
      <div>
        <Label htmlFor="date">Data</Label>
        <Input
          id="date"
          type="date"
          {...form.register('date')}
          disabled={isSubmitting}
        />
        {form.formState.errors.date && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {form.formState.errors.date.message}
          </p>
        )}
      </div>

      {/* Notas (opcional) */}
      <div>
        <Label htmlFor="notes">Notas (opcional)</Label>
        <Textarea
          id="notes"
          placeholder="Informações adicionais..."
          rows={3}
          {...form.register('notes')}
          disabled={isSubmitting}
        />
        {form.formState.errors.notes && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {form.formState.errors.notes.message}
          </p>
        )}
      </div>

      {/* Botão de submit */}
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Salvando...' : isEditing ? 'Salvar alterações' : 'Adicionar transação'}
      </Button>
    </form>
  )
}
```

### Passos de implementação

1. **Instalar componentes shadcn:**
   ```bash
   npx shadcn-ui@latest add textarea
   ```

2. **Criar hook useCategories:**
   - Criar `lib/hooks/useCategories.ts`
   - Implementar conforme exemplo

3. **Criar CurrencyInput:**
   - Criar `components/shared/CurrencyInput.tsx`
   - Testar formatação com diferentes valores

4. **Criar TransactionForm:**
   - Criar `components/forms/TransactionForm.tsx`
   - Implementar todos os campos e validações

5. **Testar formulário:**
   - Criar página temporária para testar
   - Submeter formulário e verificar se transação é criada
   - Verificar validações (campo vazio, valor zero, etc.)

### Critérios de aceitação

- [ ] Formulário abre em sheet/drawer mobile (será implementado na TASK-009)
- [ ] Toggle receita/despesa funciona visualmente
- [ ] CurrencyInput formata valor automaticamente
- [ ] Select de categorias filtra por tipo (receita ou despesa)
- [ ] Todas as validações Zod funcionam e exibem mensagens em português
- [ ] Botão de submit desabilitado enquanto salvando
- [ ] Toast de sucesso aparece após salvar
- [ ] Formulário fecha/limpa após salvar com sucesso
- [ ] Modo de edição pré-preenche todos os campos corretamente

### Possíveis desafios/edge cases

- **CurrencyInput não formata:** Verificar se `parseCurrency` está tratando corretamente
- **Categorias não carregam:** Verificar RLS da tabela `categories`
- **Validação de data:** Input type="date" pode variar entre browsers. Testar em iOS e Android.
- **Select vazio:** Garantir que usuário tem categorias (criadas pelo trigger)

### Dependências

- TASK-007 completa

### Tempo estimado

**5–6 horas** (incluindo CurrencyInput e validações)

---

## TASK-009: Página de transações

**Descrição expandida:**  
Criar interface completa de listagem de transações com navegação entre meses, resumo financeiro, agrupamento por data e ações de editar/excluir.

### Arquivos a criar/modificar

```
├── app/(app)/transacoes/
│   ├── page.tsx                   (página principal)
│   └── loading.tsx                (skeleton)
├── components/transactions/
│   ├── TransactionList.tsx        (lista agrupada)
│   ├── TransactionItem.tsx        (item individual)
│   ├── MonthPicker.tsx            (seletor de mês)
│   └── TransactionSheet.tsx       (drawer com formulário)
```

### Código exemplo (parcial - arquivo muito longo)

#### `app/(app)/transacoes/page.tsx`
```typescript
'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Plus } from 'lucide-react'
import { useTransactions, useMonthSummary } from '@/lib/hooks/useTransactions'
import { MonthPicker } from '@/components/transactions/MonthPicker'
import { TransactionList } from '@/components/transactions/TransactionList'
import { TransactionSheet } from '@/components/transactions/TransactionSheet'
import { PageHeader } from '@/components/layout/PageHeader'
import { formatCurrency } from '@/lib/utils/currency'
import { cn } from '@/lib/utils'

export default function TransacoesPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [sheetOpen, setSheetOpen] = useState(false)

  const { data: transactions = [], isLoading } = useTransactions({ month: currentMonth })
  const summary = useMonthSummary(currentMonth)

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      {/* Cabeçalho fixo */}
      <div className="sticky top-0 z-40 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800">
        <PageHeader
          title="Transações"
          action={{
            label: '',
            icon: <Plus className="h-5 w-5" />,
            onClick: () => setSheetOpen(true),
          }}
        />

        {/* Seletor de mês */}
        <div className="px-6 py-3">
          <MonthPicker value={currentMonth} onChange={setCurrentMonth} />
        </div>

        {/* Cards de resumo */}
        <div className="grid grid-cols-3 gap-3 px-6 pb-4">
          {/* Receitas */}
          <div className="rounded-lg bg-green-50 p-3 dark:bg-green-950">
            <p className="text-xs text-green-700 dark:text-green-300">Receitas</p>
            <p className="mt-1 text-sm font-bold text-green-900 dark:text-green-100">
              {formatCurrency(summary.totalIncome)}
            </p>
          </div>

          {/* Despesas */}
          <div className="rounded-lg bg-red-50 p-3 dark:bg-red-950">
            <p className="text-xs text-red-700 dark:text-red-300">Despesas</p>
            <p className="mt-1 text-sm font-bold text-red-900 dark:text-red-100">
              {formatCurrency(summary.totalExpenses)}
            </p>
          </div>

          {/* Saldo */}
          <div className="rounded-lg bg-zinc-100 p-3 dark:bg-zinc-800">
            <p className="text-xs text-zinc-700 dark:text-zinc-300">Saldo</p>
            <p
              className={cn(
                'mt-1 text-sm font-bold',
                summary.balance >= 0
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              )}
            >
              {formatCurrency(summary.balance)}
            </p>
          </div>
        </div>
      </div>

      {/* Lista de transações */}
      <div className="px-6 py-4">
        {isLoading ? (
          <div>Carregando...</div>
        ) : transactions.length === 0 ? (
          <EmptyState month={currentMonth} />
        ) : (
          <TransactionList transactions={transactions} />
        )}
      </div>

      {/* Sheet de criação/edição */}
      <TransactionSheet open={sheetOpen} onOpenChange={setSheetOpen} />
    </div>
  )
}

function EmptyState({ month }: { month: Date }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-zinc-100 p-6 dark:bg-zinc-800">
        <svg
          className="h-12 w-12 text-zinc-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>
      <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
        Nenhuma transação
      </h3>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        Você ainda não tem transações em {format(month, 'MMMM yyyy', { locale: ptBR })}
      </p>
    </div>
  )
}
```

### Critérios de aceitação

- [ ] Página carrega transações do mês atual
- [ ] Setas de navegação entre meses funcionam
- [ ] Resumo (receitas, despesas, saldo) calculado corretamente
- [ ] Saldo negativo exibido em vermelho
- [ ] Transações agrupadas por data (Hoje, Ontem, DD/MM/YYYY)
- [ ] Botão flutuante "+" abre sheet de nova transação
- [ ] Swipe left ou long press abre menu de ações (editar/excluir)
- [ ] Estado vazio mostra ilustração e mensagem amigável
- [ ] Loading state com skeleton (não spinner genérico)

### Possíveis desafios/edge cases

- **Agrupamento por data:** Usar `date-fns` para comparar datas e criar grupos
- **Swipe gestures:** Pode ser complexo. Alternativa: botão de menu (três pontos) em cada item
- **Performance:** Se usuário tiver 1000+ transações no mês, considerar virtualização (react-window)

### Dependências

- TASK-007 completa
- TASK-008 completa

### Tempo estimado

**6–8 horas** (incluindo agrupamento e ações)

---

## TASK-010: Recorrências

**Descrição expandida:**  
Sistema completo de transações recorrentes: CRUD de recorrências e geração automática mensal.

### Arquivos a criar/modificar

```
├── lib/hooks/
│   └── useRecurrents.ts           (hook de recorrências)
├── components/forms/
│   └── RecurrentForm.tsx          (formulário)
├── app/(app)/configuracoes/
│   └── page.tsx                   (seção de recorrências)
```

### Passos de implementação

1. Criar hook `useRecurrents` (similar ao `useTransactions`)
2. Criar formulário `RecurrentForm`
3. Adicionar seção de recorrências em Configurações
4. Implementar geração automática no login (middleware)
5. Exibir badge "Recorrente" em transações geradas

### Critérios de aceitação

- [ ] CRUD de recorrências funciona
- [ ] Ao fazer login, função `generate_recurring_transactions` é chamada
- [ ] Toast informa quantidade de recorrências geradas
- [ ] Transações recorrentes têm badge visual
- [ ] Desativar recorrência não apaga histórico
- [ ] Excluir recorrência não apaga histórico
- [ ] Recorrência não é gerada duas vezes no mesmo mês

### Dependências

- TASK-007, TASK-008, TASK-009 completas

### Tempo estimado

**4–5 horas**

---

## Resumo da Sprint 1

Ao completar esta sprint, o usuário poderá:

✅ Adicionar, editar e excluir transações  
✅ Visualizar transações organizadas por mês  
✅ Ver resumo financeiro mensal  
✅ Configurar transações recorrentes  
✅ Navegar facilmente entre meses  

**Próxima sprint:** Sprint 2 — Dashboard e Gráficos

---

**Última atualização:** Março 2026  
**Versão:** 1.0
