# Feature: Metas Financeiras

**Status:** 🔄 Em desenvolvimento  
**Prioridade:** 🟡 ALTA  
**Sprint:** Sprint 3 - Metas e Orçamentos  
**Tasks relacionadas:** TASK-015, TASK-016, TASK-017  
**Estimativa:** 2-3 dias

---

## 1. Visão Geral

Sistema de metas financeiras para economia e objetivos de longo prazo, com:
- **Meta de economia mensal** (guardar X por mês)
- **Meta com valor final** (juntar Y até uma data)
- **Acompanhamento de progresso** visual
- **Adicionar valores** manualmente conforme economiza
- **Histórico** de contribuições

### Objetivos
- ✅ Definir meta de economia mensal
- ✅ Definir meta com objetivo final (ex: viagem, carro)
- ✅ Adicionar valores à meta conforme economiza
- ✅ Visualizar progresso com barra e percentual
- ✅ Alertar quando próximo da data limite
- ✅ Marcar meta como concluída automaticamente

---

## 2. Requisitos Funcionais

### RF-001: Criar Meta de Economia Mensal
- **Descrição:** Definir quanto quer economizar por mês
- **Regras de negócio:**
  - Tipo: 'monthly_savings'
  - Não requer data limite
  - Comparar com economia real do mês (receitas - despesas)
  - Mostrar se atingiu a meta no mês

### RF-002: Criar Meta com Valor Final
- **Descrição:** Definir objetivo com valor total e prazo
- **Regras de negócio:**
  - Tipo: 'final_target'
  - Data limite obrigatória
  - Data limite deve ser no futuro
  - Progresso = (current_amount / target_amount) * 100%
  - Alertar se faltam menos de 30 dias

### RF-003: Adicionar Valor à Meta
- **Descrição:** Registrar que guardou dinheiro para a meta
- **Regras de negócio:**
  - Incrementar `current_amount`
  - Não permitir valor negativo
  - Não permitir exceder `target_amount` (ou avisar)
  - Atualizar `updated_at`

### RF-004: Visualizar Progresso
- **Descrição:** Ver quanto falta para atingir a meta
- **Regras de negócio:**
  - Barra de progresso visual
  - Percentual exato (ex: 67,5%)
  - Valor faltante (target - current)
  - Estimativa de meses (se meta final)

### RF-005: Marcar Meta como Concluída
- **Descrição:** Automaticamente marcar quando atingir 100%
- **Regras de negócio:**
  - Se `current_amount >= target_amount`, exibir badge "Concluída 🎉"
  - Não permitir adicionar mais valores após concluída
  - Perguntar se quer arquivar a meta

### RF-006: Arquivar/Desativar Meta
- **Descrição:** Metas antigas não aparecem na lista principal
- **Regras de negócio:**
  - Campo `active = false`
  - Filtro padrão: mostrar apenas `active = true`
  - Link "Ver arquivadas" para acessar histórico

---

## 3. User Stories

### 🎯 US-001: Criar Meta de Economia Mensal
**Como** usuário  
**Quero** definir que vou economizar R$ 500 por mês  
**Para** ter disciplina de guardar dinheiro

**Cenário:** Criar meta mensal
```gherkin
Dado que estou na aba "Metas"
Quando clico em "Nova meta"
E seleciono tipo "Economia mensal"
E digito título "Reserva de emergência"
E digito valor alvo "R$ 500,00"
E clico em "Salvar"
Então vejo a meta na lista
E vejo progresso comparando saldo do mês com meta
```

---

### 🎯 US-002: Criar Meta com Objetivo Final
**Como** usuário  
**Quero** juntar R$ 10.000 para uma viagem até dezembro  
**Para** realizar esse sonho

**Cenário:** Criar meta final
```gherkin
Dado que estou criando nova meta
E seleciono tipo "Objetivo com valor final"
E digito título "Viagem para Europa"
E digito valor alvo "R$ 10.000,00"
E seleciono data limite "31/12/2026"
E clico em "Salvar"
Então vejo a meta criada
E vejo "R$ 0 de R$ 10.000" (0%)
E vejo "Faltam 9 meses"
```

---

### 🎯 US-003: Adicionar Valor à Meta
**Como** usuário  
**Quero** registrar que guardei R$ 1.000 para minha meta  
**Para** acompanhar o progresso

**Cenário:** Adicionar contribuição
```gherkin
Dado que tenho meta "Viagem" com R$ 0 de R$ 10.000
Quando clico no botão "+" da meta
E digito "R$ 1.000,00"
E clico em "Adicionar"
Então vejo "R$ 1.000 de R$ 10.000"
E vejo progresso em 10%
E vejo barra verde avançou
```

---

### 🎯 US-004: Meta Concluída
**Como** usuário  
**Quero** ver quando atingir minha meta  
**Para** comemorar e decidir o que fazer

**Cenário:** Atingir 100%
```gherkin
Dado que tenho meta de R$ 5.000
E já guardei R$ 4.800
Quando adiciono R$ 200
Então vejo progresso em 100%
E vejo badge "Meta concluída 🎉"
E vejo confete animado
E vejo dialog "Parabéns! Você atingiu sua meta!"
E vejo opções:
  - "Manter ativa"
  - "Arquivar meta"
```

---

## 4. Schema de Dados

### Tabela: `goals`
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
CREATE INDEX idx_goals_active ON goals(user_id, active);

-- Check constraint: deadline obrigatório para final_target
ALTER TABLE goals ADD CONSTRAINT check_deadline 
  CHECK (type != 'final_target' OR deadline IS NOT NULL);
```

---

## 5. Componentes React

### 5.1 Formulário de Meta
**Arquivo:** `components/forms/GoalForm.tsx`

```typescript
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { addDays, format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CurrencyInput } from '@/components/shared/CurrencyInput'
import { useCreateGoal } from '@/lib/hooks/useGoals'
import { useToast } from '@/components/ui/use-toast'
import type { GoalType } from '@/lib/types'

const formSchema = z.object({
  title: z.string().min(1, 'Título obrigatório').max(100),
  type: z.enum(['monthly_savings', 'final_target']),
  target_amount: z.number().positive('Valor deve ser maior que zero'),
  deadline: z.string().optional(),
}).refine(
  (data) => {
    if (data.type === 'final_target' && !data.deadline) {
      return false
    }
    return true
  },
  { message: 'Data limite obrigatória para objetivo final', path: ['deadline'] }
).refine(
  (data) => {
    if (data.deadline) {
      const date = new Date(data.deadline)
      return date > new Date()
    }
    return true
  },
  { message: 'Data deve ser no futuro', path: ['deadline'] }
)

type FormData = z.infer<typeof formSchema>

export function GoalForm({ onSuccess }: { onSuccess?: () => void }) {
  const { toast } = useToast()
  const createGoal = useCreateGoal()

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: 'final_target',
    },
  })

  const selectedType = form.watch('type')

  const onSubmit = async (data: FormData) => {
    try {
      await createGoal.mutateAsync(data)
      toast({ title: 'Meta criada com sucesso' })
      form.reset()
      onSuccess?.()
    } catch (error) {
      toast({ title: 'Erro ao criar meta', variant: 'destructive' })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-semibold">Nova Meta</h2>

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ex: Viagem para Europa" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Meta</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="monthly_savings">
                    Economia mensal
                  </SelectItem>
                  <SelectItem value="final_target">
                    Objetivo com valor final
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="target_amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor Alvo</FormLabel>
              <FormControl>
                <CurrencyInput
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="R$ 0,00"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {selectedType === 'final_target' && (
          <FormField
            control={form.control}
            name="deadline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data Limite</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    min={format(addDays(new Date(), 1), 'yyyy-MM-dd')}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button type="submit" className="w-full" disabled={createGoal.isPending}>
          {createGoal.isPending ? 'Salvando...' : 'Criar meta'}
        </Button>
      </form>
    </Form>
  )
}
```

---

### 5.2 Lista de Metas
**Arquivo:** `components/goals/GoalList.tsx`

```typescript
'use client'

import { differenceInDays, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Plus, CheckCircle, AlertTriangle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils/currency'
import { AddToGoalDialog } from './AddToGoalDialog'
import type { Goal } from '@/lib/types'

interface GoalListProps {
  goals: Goal[]
}

export function GoalList({ goals }: GoalListProps) {
  const activeGoals = goals.filter(g => g.active)

  if (activeGoals.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Nenhuma meta configurada</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {activeGoals.map(goal => (
        <GoalCard key={goal.id} goal={goal} />
      ))}
    </div>
  )
}

function GoalCard({ goal }: { goal: Goal }) {
  const percentage = (goal.current_amount / goal.target_amount) * 100
  const isCompleted = percentage >= 100
  const remaining = goal.target_amount - goal.current_amount

  const daysUntilDeadline = goal.deadline
    ? differenceInDays(new Date(goal.deadline), new Date())
    : null

  const isUrgent = daysUntilDeadline !== null && daysUntilDeadline < 30 && daysUntilDeadline > 0

  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{goal.title}</h3>
              {isCompleted && <Badge variant="default">Concluída 🎉</Badge>}
              {isUrgent && (
                <Badge variant="destructive" className="gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  {daysUntilDeadline} dias
                </Badge>
              )}
            </div>
            {goal.type === 'monthly_savings' ? (
              <p className="text-xs text-muted-foreground">Economia mensal</p>
            ) : (
              goal.deadline && (
                <p className="text-xs text-muted-foreground">
                  Até {format(new Date(goal.deadline), 'dd MMM yyyy', { locale: ptBR })}
                </p>
              )
            )}
          </div>

          {!isCompleted && <AddToGoalDialog goal={goal} />}
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">
              {formatCurrency(goal.current_amount)} de {formatCurrency(goal.target_amount)}
            </span>
            <span className="font-semibold">{percentage.toFixed(1)}%</span>
          </div>
          <Progress value={Math.min(percentage, 100)} className="h-2" />
          {!isCompleted && (
            <p className="text-xs text-muted-foreground mt-1">
              Faltam {formatCurrency(remaining)}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
```

---

### 5.3 Dialog para Adicionar Valor
**Arquivo:** `components/goals/AddToGoalDialog.tsx`

```typescript
'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { CurrencyInput } from '@/components/shared/CurrencyInput'
import { useAddToGoal } from '@/lib/hooks/useGoals'
import { useToast } from '@/components/ui/use-toast'
import { formatCurrency } from '@/lib/utils/currency'
import type { Goal } from '@/lib/types'

interface AddToGoalDialogProps {
  goal: Goal
}

export function AddToGoalDialog({ goal }: AddToGoalDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [amount, setAmount] = useState<number>(0)
  const { toast } = useToast()
  const addToGoal = useAddToGoal()

  const remaining = goal.target_amount - goal.current_amount

  const handleAdd = async () => {
    if (amount <= 0) {
      toast({ title: 'Digite um valor maior que zero', variant: 'destructive' })
      return
    }

    try {
      await addToGoal.mutateAsync({ goalId: goal.id, amount })
      
      const newTotal = goal.current_amount + amount
      const isComplete = newTotal >= goal.target_amount

      toast({
        title: isComplete ? '🎉 Meta concluída!' : 'Valor adicionado com sucesso',
        description: isComplete
          ? `Parabéns! Você atingiu sua meta de ${formatCurrency(goal.target_amount)}`
          : undefined,
      })

      setAmount(0)
      setIsOpen(false)
    } catch (error) {
      toast({ title: 'Erro ao adicionar valor', variant: 'destructive' })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline">
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar à Meta</DialogTitle>
          <DialogDescription>
            {goal.title} - Faltam {formatCurrency(remaining)}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <CurrencyInput
            value={amount}
            onChange={setAmount}
            placeholder="R$ 0,00"
            autoFocus
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleAdd} disabled={addToGoal.isPending || amount <= 0}>
            {addToGoal.isPending ? 'Adicionando...' : 'Adicionar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

---

## 6. Hooks

### Hook: `useGoals`
**Arquivo:** `lib/hooks/useGoals.ts`

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { useUser } from './useUser'
import type { Goal } from '@/lib/types'

export function useGoals() {
  const { data: user } = useUser()
  const supabase = createClient()

  return useQuery({
    queryKey: ['goals', user?.id],
    queryFn: async (): Promise<Goal[]> => {
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as Goal[]
    },
    enabled: !!user,
  })
}

export function useCreateGoal() {
  const queryClient = useQueryClient()
  const { data: user } = useUser()
  const supabase = createClient()

  return useMutation({
    mutationFn: async (data: Omit<Goal, 'id' | 'user_id' | 'current_amount' | 'active' | 'created_at' | 'updated_at'>) => {
      if (!user) throw new Error('User not authenticated')

      const { data: goal, error } = await supabase
        .from('goals')
        .insert({
          ...data,
          user_id: user.id,
          current_amount: 0,
        })
        .select()
        .single()

      if (error) throw error
      return goal
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] })
    },
  })
}

export function useAddToGoal() {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: async ({ goalId, amount }: { goalId: string; amount: number }) => {
      // Buscar goal atual
      const { data: goal } = await supabase
        .from('goals')
        .select('current_amount')
        .eq('id', goalId)
        .single()

      if (!goal) throw new Error('Goal not found')

      // Incrementar current_amount
      const { data, error } = await supabase
        .from('goals')
        .update({
          current_amount: Number(goal.current_amount) + amount,
          updated_at: new Date().toISOString(),
        })
        .eq('id', goalId)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] })
    },
  })
}

export function useDeleteGoal() {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] })
    },
  })
}
```

---

## 7. Validações Zod

```typescript
// lib/schemas/goal.ts
import { z } from 'zod'
import { addDays } from 'date-fns'

export const goalSchema = z.object({
  title: z.string().min(1, 'Título obrigatório').max(100),
  type: z.enum(['monthly_savings', 'final_target']),
  target_amount: z.number().positive('Valor deve ser maior que zero'),
  deadline: z.string().optional(),
}).refine(
  (data) => data.type !== 'final_target' || !!data.deadline,
  { message: 'Data limite obrigatória para objetivo final', path: ['deadline'] }
).refine(
  (data) => !data.deadline || new Date(data.deadline) > new Date(),
  { message: 'Data deve ser no futuro', path: ['deadline'] }
)
```

---

## 8. Estados de UI

### Loading
```typescript
function GoalsSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-28 bg-muted animate-pulse rounded-lg" />
      ))}
    </div>
  )
}
```

### Empty
```typescript
function EmptyGoals({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">🎯</div>
      <p className="text-lg font-medium mb-2">Nenhuma meta criada</p>
      <p className="text-muted-foreground mb-4">
        Defina suas metas financeiras e acompanhe seu progresso
      </p>
      <Button onClick={onAdd}>
        <Plus className="mr-2 h-4 w-4" />
        Criar primeira meta
      </Button>
    </div>
  )
}
```

---

## 9. Edge Cases

### EC-001: Adicionar mais que o faltante
**Problema:** Usuário adiciona R$ 1.000 mas faltam apenas R$ 500  
**Solução:** Permitir, meta fica com 100%+  
**UI:** Exibir aviso "Você ultrapassou a meta em R$ 500"

### EC-002: Meta sem prazo
**Problema:** Meta tipo 'monthly_savings' não tem deadline  
**Solução:** Campo `deadline` NULL é válido  
**UI:** Não exibir data limite na visualização

### EC-003: Data limite no passado (edição)
**Problema:** Usuário esqueceu meta e prazo passou  
**Solução:** Permitir adicionar valores mesmo com prazo vencido  
**UI:** Badge "Prazo vencido" em vermelho, mas funciona normalmente

---

## 10. Queries Supabase

### Buscar metas ativas
```typescript
const { data, error } = await supabase
  .from('goals')
  .select('*')
  .eq('user_id', userId)
  .eq('active', true)
  .order('created_at', { ascending: false })
```

### Adicionar valor à meta
```typescript
const { data, error } = await supabase
  .from('goals')
  .update({
    current_amount: currentAmount + amount,
    updated_at: new Date().toISOString(),
  })
  .eq('id', goalId)
  .select()
  .single()
```

---

## 11. Testes Sugeridos

### Teste: Adicionar valor incrementa corretamente
```typescript
test('Adicionar valor à meta', async () => {
  // Criar meta com R$ 1000 atual
  const goal = await createGoal({ target_amount: 5000, current_amount: 1000 })

  // Adicionar R$ 500
  await addToGoal(goal.id, 500)

  // Buscar meta atualizada
  const updated = await getGoal(goal.id)

  expect(updated.current_amount).toBe(1500)
})
```

### Teste E2E: Criar e completar meta
```typescript
test('Criar meta e completar', async ({ page }) => {
  await page.goto('/metas')
  await page.click('text=Nova meta')
  await page.fill('[name="title"]', 'Teste')
  await page.fill('[name="target_amount"]', '1000')
  await page.selectOption('[name="type"]', 'final_target')
  await page.fill('[name="deadline"]', '2026-12-31')
  await page.click('button[type="submit"]')

  await expect(page.locator('text=Teste')).toBeVisible()

  // Adicionar valor até completar
  await page.click('button[aria-label="Adicionar à meta"]')
  await page.fill('[name="amount"]', '1000')
  await page.click('text=Adicionar')

  await expect(page.locator('text=Meta concluída')).toBeVisible()
})
```

---

## 12. Links para Tasks

- **TASK-015:** Hook `useGoals`
- **TASK-016:** Página de Metas (aba Metas)
- **TASK-017:** Formulário de meta

---

**Última atualização:** Março 2026
