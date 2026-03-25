# Sprint 3 — Metas e Orçamentos

**Objetivo:** Sistema completo de metas financeiras e orçamentos por categoria.  
**Estimativa:** 4–5 dias  
**Status:** 🔴 Não iniciado  
**Tasks:** TASK-015, TASK-016, TASK-017

---

## Visão Geral

Esta sprint implementa ferramentas de planejamento financeiro:
- **Orçamentos:** Limites de gastos por categoria (mensal)
- **Metas de economia:** Quanto economizar por mês
- **Metas com prazo:** Objetivos com valor final e deadline

Ao final, o usuário poderá definir limites, acompanhar progresso e receber alertas visuais quando ultrapassar orçamentos.

---

## TASK-015: Hook `useBudgets` e `useGoals`

**Descrição expandida:**  
Criar hooks para gerenciar orçamentos e metas, incluindo cálculo automático de gastos reais por categoria.

### Arquivos a criar/modificar

```
├── lib/hooks/
│   ├── useBudgets.ts              (hook de orçamentos)
│   └── useGoals.ts                (hook de metas)
```

### Código exemplo

#### `lib/hooks/useBudgets.ts`
```typescript
'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Budget, BudgetWithSpent, BudgetFormData } from '@/lib/types'
import { format, startOfMonth, endOfMonth } from 'date-fns'
import { useToast } from '@/components/ui/use-toast'

/**
 * Hook para gerenciar orçamentos
 * 
 * - useBudgets: listar orçamentos do mês com gastos reais
 * - useCreateBudget: criar novo orçamento
 * - useUpdateBudget: atualizar orçamento
 * - useDeleteBudget: deletar orçamento
 */

// ============================================
// Query: Listar orçamentos do mês
// ============================================

export function useBudgets(month: Date) {
  const supabase = createClient()

  const monthStart = format(startOfMonth(month), 'yyyy-MM-dd')
  const monthEnd = format(endOfMonth(month), 'yyyy-MM-dd')
  const monthKey = format(month, 'yyyy-MM-01') // Sempre dia 1

  return useQuery({
    queryKey: ['budgets', monthKey],
    queryFn: async (): Promise<BudgetWithSpent[]> => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error('Usuário não autenticado')

      // Buscar orçamentos do mês
      const { data: budgets, error: budgetsError } = await supabase
        .from('budgets')
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
        .eq('month', monthKey)
        .order('created_at', { ascending: false })

      if (budgetsError) {
        console.error('Erro ao buscar orçamentos:', budgetsError)
        throw new Error('Não foi possível carregar os orçamentos')
      }

      // Buscar transações do mês para calcular gastos reais
      const { data: transactions, error: transError } = await supabase
        .from('transactions')
        .select('category_id, amount')
        .eq('user_id', user.id)
        .eq('type', 'expense')
        .gte('date', monthStart)
        .lte('date', monthEnd)

      if (transError) {
        console.error('Erro ao buscar transações:', transError)
        throw new Error('Não foi possível calcular gastos')
      }

      // Calcular gastos por categoria
      const spentByCategory = new Map<string, number>()
      transactions?.forEach((t) => {
        const current = spentByCategory.get(t.category_id) || 0
        spentByCategory.set(t.category_id, current + Number(t.amount))
      })

      // Combinar orçamentos com gastos reais
      const budgetsWithSpent: BudgetWithSpent[] = (budgets || []).map((budget) => {
        const spent = spentByCategory.get(budget.category_id) || 0
        const percentage = budget.amount > 0 ? (spent / Number(budget.amount)) * 100 : 0

        let status: 'ok' | 'warning' | 'exceeded' = 'ok'
        if (percentage >= 100) status = 'exceeded'
        else if (percentage >= 80) status = 'warning'

        return {
          ...budget,
          spent,
          percentage,
          status,
        }
      })

      return budgetsWithSpent
    },
  })
}

// ============================================
// Mutation: Criar orçamento
// ============================================

export function useCreateBudget() {
  const supabase = createClient()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (data: BudgetFormData) => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error('Usuário não autenticado')

      // Verificar se já existe orçamento para esta categoria no mês
      const { data: existing } = await supabase
        .from('budgets')
        .select('id')
        .eq('user_id', user.id)
        .eq('category_id', data.category_id)
        .eq('month', data.month)
        .single()

      if (existing) {
        throw new Error('Já existe um orçamento para esta categoria neste mês')
      }

      const { data: budget, error } = await supabase
        .from('budgets')
        .insert([
          {
            user_id: user.id,
            category_id: data.category_id,
            amount: data.amount,
            month: data.month,
          },
        ])
        .select()
        .single()

      if (error) {
        console.error('Erro ao criar orçamento:', error)
        throw new Error('Não foi possível criar o orçamento')
      }

      return budget as Budget
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })

      toast({
        title: 'Orçamento criado',
        description: 'O orçamento foi adicionado com sucesso.',
      })
    },
    onError: (error) => {
      toast({
        title: 'Erro ao criar orçamento',
        description: error.message,
        variant: 'destructive',
      })
    },
  })
}

// ============================================
// Mutation: Atualizar orçamento
// ============================================

interface UpdateBudgetParams {
  id: string
  data: Partial<BudgetFormData>
}

export function useUpdateBudget() {
  const supabase = createClient()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async ({ id, data }: UpdateBudgetParams) => {
      const { data: budget, error } = await supabase
        .from('budgets')
        .update({
          amount: data.amount,
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Erro ao atualizar orçamento:', error)
        throw new Error('Não foi possível atualizar o orçamento')
      }

      return budget as Budget
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })

      toast({
        title: 'Orçamento atualizado',
        description: 'As alterações foram salvas com sucesso.',
      })
    },
    onError: (error) => {
      toast({
        title: 'Erro ao atualizar orçamento',
        description: error.message,
        variant: 'destructive',
      })
    },
  })
}

// ============================================
// Mutation: Deletar orçamento
// ============================================

export function useDeleteBudget() {
  const supabase = createClient()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('budgets').delete().eq('id', id)

      if (error) {
        console.error('Erro ao deletar orçamento:', error)
        throw new Error('Não foi possível excluir o orçamento')
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })

      toast({
        title: 'Orçamento excluído',
        description: 'O orçamento foi removido com sucesso.',
      })
    },
    onError: (error) => {
      toast({
        title: 'Erro ao excluir orçamento',
        description: error.message,
        variant: 'destructive',
      })
    },
  })
}
```

#### `lib/hooks/useGoals.ts`
```typescript
'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Goal, GoalFormData } from '@/lib/types'
import { useToast } from '@/components/ui/use-toast'

/**
 * Hook para gerenciar metas financeiras
 */

// ============================================
// Query: Listar metas ativas
// ============================================

export function useGoals() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['goals'],
    queryFn: async (): Promise<Goal[]> => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error('Usuário não autenticado')

      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .eq('active', true)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao buscar metas:', error)
        throw new Error('Não foi possível carregar as metas')
      }

      return (data as Goal[]) || []
    },
  })
}

// ============================================
// Mutation: Criar meta
// ============================================

export function useCreateGoal() {
  const supabase = createClient()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (data: GoalFormData) => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error('Usuário não autenticado')

      const { data: goal, error } = await supabase
        .from('goals')
        .insert([
          {
            user_id: user.id,
            title: data.title,
            type: data.type,
            target_amount: data.target_amount,
            current_amount: 0,
            deadline: data.deadline || null,
            active: true,
          },
        ])
        .select()
        .single()

      if (error) {
        console.error('Erro ao criar meta:', error)
        throw new Error('Não foi possível criar a meta')
      }

      return goal as Goal
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] })

      toast({
        title: 'Meta criada',
        description: 'A meta foi adicionada com sucesso.',
      })
    },
    onError: (error) => {
      toast({
        title: 'Erro ao criar meta',
        description: error.message,
        variant: 'destructive',
      })
    },
  })
}

// ============================================
// Mutation: Adicionar valor à meta
// ============================================

interface AddToGoalParams {
  id: string
  amount: number
}

export function useAddToGoal() {
  const supabase = createClient()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async ({ id, amount }: AddToGoalParams) => {
      // Buscar meta atual
      const { data: goal, error: fetchError } = await supabase
        .from('goals')
        .select('current_amount')
        .eq('id', id)
        .single()

      if (fetchError) throw new Error('Meta não encontrada')

      // Atualizar com novo valor
      const newAmount = Number(goal.current_amount) + amount

      const { data: updated, error } = await supabase
        .from('goals')
        .update({ current_amount: newAmount, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Erro ao atualizar meta:', error)
        throw new Error('Não foi possível adicionar valor à meta')
      }

      return updated as Goal
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] })

      toast({
        title: 'Valor adicionado',
        description: 'A meta foi atualizada com sucesso.',
      })
    },
    onError: (error) => {
      toast({
        title: 'Erro ao atualizar meta',
        description: error.message,
        variant: 'destructive',
      })
    },
  })
}

// ============================================
// Mutation: Atualizar meta
// ============================================

interface UpdateGoalParams {
  id: string
  data: Partial<GoalFormData>
}

export function useUpdateGoal() {
  const supabase = createClient()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async ({ id, data }: UpdateGoalParams) => {
      const { data: goal, error } = await supabase
        .from('goals')
        .update({
          title: data.title,
          target_amount: data.target_amount,
          deadline: data.deadline || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Erro ao atualizar meta:', error)
        throw new Error('Não foi possível atualizar a meta')
      }

      return goal as Goal
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] })

      toast({
        title: 'Meta atualizada',
        description: 'As alterações foram salvas com sucesso.',
      })
    },
    onError: (error) => {
      toast({
        title: 'Erro ao atualizar meta',
        description: error.message,
        variant: 'destructive',
      })
    },
  })
}

// ============================================
// Mutation: Deletar meta (inativar)
// ============================================

export function useDeleteGoal() {
  const supabase = createClient()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (id: string) => {
      // Inativar em vez de deletar (manter histórico)
      const { error } = await supabase
        .from('goals')
        .update({ active: false })
        .eq('id', id)

      if (error) {
        console.error('Erro ao deletar meta:', error)
        throw new Error('Não foi possível excluir a meta')
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] })

      toast({
        title: 'Meta removida',
        description: 'A meta foi removida da lista.',
      })
    },
    onError: (error) => {
      toast({
        title: 'Erro ao excluir meta',
        description: error.message,
        variant: 'destructive',
      })
    },
  })
}
```

### Passos de implementação

1. **Criar useBudgets.ts:**
   - Implementar queries e mutations conforme exemplo
   - Testar cálculo de `spent` e `percentage`

2. **Criar useGoals.ts:**
   - Implementar queries e mutations
   - Testar `useAddToGoal` (optimistic update opcional)

3. **Testar regras de negócio:**
   - Orçamento duplicado deve retornar erro
   - Meta concluída (`current >= target`) deve exibir badge

### Critérios de aceitação

- [ ] `useBudgets` retorna orçamentos com `spent` calculado corretamente
- [ ] `status` é 'ok', 'warning' ou 'exceeded' conforme percentual
- [ ] `useCreateBudget` bloqueia duplicatas (categoria + mês)
- [ ] `useGoals` retorna apenas metas ativas
- [ ] `useAddToGoal` incrementa `current_amount` corretamente
- [ ] `useDeleteGoal` inativa meta (não deleta do banco)
- [ ] Todas as mutações invalidam cache corretamente

### Possíveis desafios/edge cases

- **Precision decimal:** Usar `Number()` ao somar valores
- **Categoria sem orçamento:** Não exibir na lista de orçamentos
- **Meta com prazo passado:** Destacar visualmente (próxima task)

### Dependências

- TASK-007 completa (estrutura de hooks como referência)

### Tempo estimado

**4–5 horas** (dois hooks complexos)

---

## TASK-016: Página de Metas

**Descrição expandida:**  
Interface completa para visualizar e gerenciar metas e orçamentos com barras de progresso, alertas visuais e ações rápidas.

### Arquivos a criar/modificar

```
├── app/(app)/metas/
│   └── page.tsx                   (página principal)
├── components/metas/
│   ├── BudgetCard.tsx             (card de orçamento)
│   ├── GoalCard.tsx               (card de meta)
│   └── AddToGoalSheet.tsx         (sheet para adicionar valor)
```

### Código exemplo (resumido)

#### `app/(app)/metas/page.tsx`
```typescript
'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useBudgets } from '@/lib/hooks/useBudgets'
import { useGoals } from '@/lib/hooks/useGoals'
import { useMonthSummary } from '@/lib/hooks/useTransactions'
import { BudgetCard } from '@/components/metas/BudgetCard'
import { GoalCard } from '@/components/metas/GoalCard'
import { PageHeader } from '@/components/layout/PageHeader'
import { Plus, Target, PiggyBank } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function MetasPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const { data: budgets = [], isLoading: loadingBudgets } = useBudgets(currentMonth)
  const { data: goals = [], isLoading: loadingGoals } = useGoals()
  const summary = useMonthSummary(currentMonth)

  // Filtrar metas por tipo
  const monthlySavingsGoal = goals.find((g) => g.type === 'monthly_savings')
  const finalTargetGoals = goals.filter((g) => g.type === 'final_target')

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <PageHeader title="Metas e Orçamentos" />

      <div className="space-y-8 px-6 py-6">
        {/* Seção 1: Orçamentos do mês */}
        <section>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PiggyBank className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Orçamentos de {format(currentMonth, 'MMMM', { locale: ptBR })}
              </h2>
            </div>
            <Button size="sm" variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {loadingBudgets ? (
            <div>Carregando...</div>
          ) : budgets.length === 0 ? (
            <EmptyState
              icon={<PiggyBank className="h-12 w-12" />}
              title="Nenhum orçamento definido"
              description="Crie orçamentos para controlar seus gastos por categoria"
            />
          ) : (
            <div className="mt-4 space-y-3">
              {budgets.map((budget) => (
                <BudgetCard key={budget.id} budget={budget} />
              ))}
            </div>
          )}
        </section>

        {/* Seção 2: Meta de economia mensal */}
        <section>
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Meta de economia mensal
            </h2>
          </div>

          {monthlySavingsGoal ? (
            <div className="mt-4">
              <GoalCard goal={monthlySavingsGoal} currentBalance={summary.balance} />
            </div>
          ) : (
            <EmptyState
              icon={<Target className="h-12 w-12" />}
              title="Sem meta de economia"
              description="Defina quanto quer economizar por mês"
            />
          )}
        </section>

        {/* Seção 3: Metas com objetivo final */}
        <section>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Objetivos
            </h2>
            <Button size="sm" variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {finalTargetGoals.length === 0 ? (
            <EmptyState
              icon={<Target className="h-12 w-12" />}
              title="Nenhum objetivo definido"
              description="Crie objetivos com valor final e prazo"
            />
          ) : (
            <div className="mt-4 space-y-3">
              {finalTargetGoals.map((goal) => (
                <GoalCard key={goal.id} goal={goal} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

function EmptyState({ icon, title, description }: any) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-zinc-300 bg-zinc-50 py-12 text-center dark:border-zinc-700 dark:bg-zinc-800">
      <div className="text-zinc-400 dark:text-zinc-600">{icon}</div>
      <h3 className="mt-4 font-semibold text-zinc-900 dark:text-zinc-100">{title}</h3>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{description}</p>
    </div>
  )
}
```

#### `components/metas/BudgetCard.tsx`
```typescript
import { BudgetWithSpent } from '@/lib/types'
import { formatCurrency } from '@/lib/utils/currency'
import { AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BudgetCardProps {
  budget: BudgetWithSpent
}

export function BudgetCard({ budget }: BudgetCardProps) {
  const { category, amount, spent, percentage, status } = budget

  // Definir cor da barra conforme status
  const barColor = {
    ok: 'bg-green-500',
    warning: 'bg-yellow-500',
    exceeded: 'bg-red-500',
  }[status]

  const textColor = {
    ok: 'text-green-700 dark:text-green-300',
    warning: 'text-yellow-700 dark:text-yellow-300',
    exceeded: 'text-red-700 dark:text-red-300',
  }[status]

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          {category?.icon && <span className="text-lg">{category.icon}</span>}
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
            {category?.name}
          </h3>
        </div>
        {status === 'exceeded' && (
          <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
        )}
      </div>

      {/* Barra de progresso */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-sm">
          <span className={textColor}>{formatCurrency(spent)}</span>
          <span className="text-zinc-600 dark:text-zinc-400">
            de {formatCurrency(Number(amount))}
          </span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
          <div
            className={cn('h-full transition-all duration-500', barColor)}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        <p className="mt-1 text-right text-xs text-zinc-600 dark:text-zinc-400">
          {percentage.toFixed(0)}%
        </p>
      </div>
    </div>
  )
}
```

### Critérios de aceitação

- [ ] Página exibe 3 seções claramente separadas
- [ ] Orçamentos mostram barra de progresso com cor correta
- [ ] Alerta visual quando orçamento ultrapassado
- [ ] Meta de economia mensal compara saldo com target
- [ ] Metas com prazo destacadas se < 30 dias
- [ ] Botões "+" abrem sheets para criar orçamento/meta
- [ ] Ações de editar/excluir funcionam (menu de contexto)
- [ ] Estados vazios mostram CTAs claros

### Dependências

- TASK-015 completa

### Tempo estimado

**5–6 horas** (incluindo componentes BudgetCard e GoalCard)

---

## TASK-017: Formulários de orçamento e meta

**Descrição expandida:**  
Formulários completos para criar e editar orçamentos e metas com validação e UX otimizada.

### Arquivos a criar/modificar

```
├── components/forms/
│   ├── BudgetForm.tsx             (formulário de orçamento)
│   └── GoalForm.tsx               (formulário de meta)
```

### Código exemplo (resumido - similar ao TransactionForm)

```typescript
// Validação Zod para orçamento
const budgetSchema = z.object({
  category_id: z.string().uuid('Selecione uma categoria'),
  amount: z.number().positive('Valor deve ser maior que zero'),
  month: z.string().regex(/^\d{4}-\d{2}-01$/, 'Mês inválido'),
})

// Validação Zod para meta
const goalSchema = z.object({
  title: z.string().min(1, 'Título obrigatório').max(100),
  type: z.enum(['monthly_savings', 'final_target']),
  target_amount: z.number().positive('Valor deve ser maior que zero'),
  deadline: z.string().optional().refine(
    (val) => !val || new Date(val) > new Date(),
    'Prazo deve ser no futuro'
  ),
})
```

### Critérios de aceitação

- [ ] Formulários exibidos em sheet/drawer
- [ ] Select de categoria filtra apenas despesas
- [ ] Validação impede orçamento duplicado
- [ ] Meta tipo 'final_target' exige deadline
- [ ] Data de deadline validada (deve ser futura)
- [ ] Modo edição pré-preenche campos
- [ ] Feedback visual de sucesso/erro

### Dependências

- TASK-015 completa
- TASK-008 completa (TransactionForm como referência)

### Tempo estimado

**3–4 horas** (reutilizando estrutura do TransactionForm)

---

## Resumo da Sprint 3

Ao completar esta sprint, o usuário poderá:

✅ Definir orçamentos por categoria  
✅ Ver progresso de gastos com alertas visuais  
✅ Criar metas de economia mensal  
✅ Criar objetivos com prazo  
✅ Acompanhar progresso de todas as metas  

**Próxima sprint:** Sprint 4 — Import de CSV

---

**Última atualização:** Março 2026  
**Versão:** 1.0
