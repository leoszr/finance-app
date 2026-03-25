# Feature: Orçamentos (Budgets)

**Status:** 🔄 Em desenvolvimento  
**Prioridade:** 🟡 ALTA  
**Sprint:** Sprint 3 - Metas e Orçamentos  
**Tasks relacionadas:** TASK-015, TASK-016, TASK-017  
**Estimativa:** 2-3 dias

---

## 1. Visão Geral

Sistema de orçamentos mensais por categoria para controle de gastos, com:
- **Definição de limites** por categoria e mês
- **Acompanhamento visual** com barras de progresso
- **Alertas visuais** quando próximo ou acima do limite
- **Histórico** de orçamentos de meses anteriores
- **Sugestões inteligentes** baseadas em gastos passados

### Objetivos
- ✅ Definir limite mensal por categoria de despesa
- ✅ Visualizar progresso em tempo real
- ✅ Alertar quando atingir 80%, 100% do limite
- ✅ Comparar orçamento planejado vs. realizado
- ✅ Copiar orçamentos de um mês para outro

---

## 2. Requisitos Funcionais

### RF-001: Criar Orçamento Mensal
- **Descrição:** Usuário define limite de gasto para uma categoria em um mês
- **Regras de negócio:**
  - Apenas categorias tipo 'expense' podem ter orçamento
  - Um mês pode ter apenas um orçamento por categoria (UNIQUE constraint)
  - Valor deve ser > 0
  - Mês deve estar no formato YYYY-MM-01
  - Default: mês atual

### RF-002: Visualizar Progresso do Orçamento
- **Descrição:** Ver quanto já foi gasto vs. limite definido
- **Regras de negócio:**
  - Progresso = (gasto / limite) * 100%
  - Cores: verde (<80%), amarelo (80-99%), vermelho (≥100%)
  - Ícone de alerta se ≥100%
  - Atualização em tempo real ao criar/editar transação

### RF-003: Editar Orçamento
- **Descrição:** Alterar valor do limite de um orçamento existente
- **Regras de negócio:**
  - Não permite alterar categoria ou mês (apenas valor)
  - Se quiser mudar categoria, deve excluir e criar novo

### RF-004: Excluir Orçamento
- **Descrição:** Remover orçamento de uma categoria
- **Regras de negócio:**
  - Exibir confirmação antes de excluir
  - Exclusão não afeta transações (apenas remove o limite)

### RF-005: Copiar Orçamentos para Próximo Mês
- **Descrição:** Duplicar todos os orçamentos do mês atual para o próximo
- **Regras de negócio:**
  - Copiar apenas categorias que ainda têm orçamento no mês de origem
  - Não sobrescrever orçamentos já existentes no mês de destino
  - Exibir toast com quantidade copiada

### RF-006: Sugerir Valor de Orçamento
- **Descrição:** Sugerir limite baseado na média de gastos dos últimos 3 meses
- **Regras de negócio:**
  - Calcular: AVG(gasto_categoria) dos últimos 3 meses
  - Arredondar para cima (próxima centena)
  - Exibir como placeholder no campo de valor

---

## 3. User Stories

### 🎯 US-001: Definir Orçamento Mensal
**Como** usuário  
**Quero** definir um limite de gasto para alimentação  
**Para** controlar melhor essa categoria

**Cenário:** Criar primeiro orçamento
```gherkin
Dado que estou na página de Metas
E clico na aba "Orçamentos"
Quando clico em "Novo orçamento"
E seleciono categoria "Alimentação"
E digito valor "R$ 800,00"
E o mês default é "Março/2026"
E clico em "Salvar"
Então vejo toast "Orçamento criado com sucesso"
E vejo barra de progresso para Alimentação
E vejo "R$ 0 de R$ 800" (ainda sem gastos)
```

**Cenário:** Orçamento duplicado (mesma categoria e mês)
```gherkin
Dado que já tenho orçamento de Alimentação em Março
Quando tento criar outro orçamento de Alimentação em Março
Então vejo erro "Já existe orçamento para esta categoria neste mês"
E o formulário não é enviado
```

---

### 🎯 US-002: Acompanhar Progresso
**Como** usuário  
**Quero** ver quanto já gastei do meu orçamento  
**Para** saber se posso gastar mais

**Cenário:** Orçamento saudável (60%)
```gherkin
Dado que tenho orçamento de R$ 800 para Alimentação
E já gastei R$ 480
Quando acesso a página de Metas > Orçamentos
Então vejo barra verde em 60%
E vejo "R$ 480 de R$ 800"
E vejo "60%" ao lado da barra
E não vejo ícone de alerta
```

**Cenário:** Orçamento em alerta (85%)
```gherkin
Dado que tenho orçamento de R$ 800
E já gastei R$ 680 (85%)
Quando acesso Orçamentos
Então vejo barra amarela
E vejo aviso "Atenção: próximo do limite"
```

**Cenário:** Orçamento excedido (110%)
```gherkin
Dado que tenho orçamento de R$ 500 para Lazer
E já gastei R$ 550
Quando acesso Orçamentos
Então vejo barra vermelha em 100% (máximo)
E vejo ícone ⚠️ de alerta
E vejo "R$ 550 de R$ 500" em vermelho
E vejo "110%" em destaque
E vejo mensagem "Você excedeu o orçamento em R$ 50"
```

---

### 🎯 US-003: Editar Orçamento
**Como** usuário  
**Quero** aumentar o limite do meu orçamento  
**Para** ajustar às minhas necessidades

**Cenário:** Alterar valor
```gherkin
Dado que tenho orçamento de R$ 800 para Alimentação
Quando clico no orçamento para editar
E altero valor para "R$ 1.000,00"
E clico em "Salvar"
Então vejo toast "Orçamento atualizado"
E vejo nova barra com "R$ 480 de R$ 1.000"
E o percentual é recalculado para 48%
```

---

### 🎯 US-004: Copiar para Próximo Mês
**Como** usuário  
**Quero** copiar meus orçamentos para o próximo mês  
**Para** não precisar recriá-los manualmente

**Cenário:** Copiar todos os orçamentos
```gherkin
Dado que tenho 4 orçamentos em Março/2026
E estou vendo orçamentos de Março
Quando clico em "Copiar para próximo mês"
Então vejo AlertDialog "Copiar 4 orçamentos para Abril/2026?"
Quando confirmo
Então vejo toast "4 orçamentos copiados para Abril"
E quando navego para Abril/2026
Então vejo os 4 orçamentos com os mesmos valores
E vejo gasto = R$ 0 (novo mês)
```

**Cenário:** Não sobrescrever existentes
```gherkin
Dado que tenho 3 orçamentos em Março
E já tenho 1 orçamento em Abril (Alimentação)
Quando copio de Março para Abril
Então vejo toast "2 orçamentos copiados (1 já existia)"
E o orçamento existente de Alimentação não é alterado
```

---

### 🎯 US-005: Sugestão Inteligente
**Como** usuário  
**Quero** ver uma sugestão de limite baseada no meu histórico  
**Para** definir um valor realista

**Cenário:** Sugestão baseada em histórico
```gherkin
Dado que gastei em Alimentação:
  - Janeiro: R$ 750
  - Fevereiro: R$ 820
  - Março: R$ 780
E estou criando orçamento para Abril
Quando clico no campo "Valor"
Então vejo placeholder "Sugestão: R$ 800 (média dos últimos 3 meses)"
E posso aceitar a sugestão clicando no ícone ✓
Ou posso digitar outro valor
```

**Cenário:** Sem histórico suficiente
```gherkin
Dado que sou novo usuário
E não tenho histórico de 3 meses
Quando crio primeiro orçamento
Então não vejo sugestão
E o placeholder é "R$ 0,00"
```

---

## 4. Schema de Dados

### Tabela: `budgets`
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

-- RLS obrigatório
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_data" ON budgets
  FOR ALL USING (auth.uid() = user_id);

-- Índices para performance
CREATE INDEX idx_budgets_user_month ON budgets(user_id, month);
CREATE INDEX idx_budgets_category ON budgets(category_id);
```

**Campos:**
- `id`: UUID único do orçamento
- `user_id`: Referência ao usuário (RLS)
- `category_id`: Categoria de despesa (ON DELETE CASCADE - se categoria é excluída, orçamento também)
- `amount`: Valor limite do orçamento
- `month`: Mês de referência (sempre dia 1, formato DATE)
- `UNIQUE(user_id, category_id, month)`: Garante apenas um orçamento por categoria/mês

---

## 5. Componentes React

### 5.1 Página de Orçamentos
**Arquivo:** `app/(app)/metas/page.tsx` (aba de orçamentos)

```typescript
'use client'

import { useState } from 'react'
import { format, addMonths, startOfMonth } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Plus, Copy } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { MonthPicker } from '@/components/shared/MonthPicker'
import { BudgetForm } from '@/components/forms/BudgetForm'
import { BudgetList } from '@/components/budgets/BudgetList'
import { useBudgets, useCopyBudgets } from '@/lib/hooks/useBudgets'
import { useToast } from '@/components/ui/use-toast'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

export default function MetasPage() {
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()))
  const [isFormOpen, setIsFormOpen] = useState(false)
  const { toast } = useToast()

  const { data: budgets, isLoading } = useBudgets(currentMonth)
  const copyBudgets = useCopyBudgets()

  const handleCopyToNextMonth = async () => {
    const nextMonth = addMonths(currentMonth, 1)
    
    try {
      const count = await copyBudgets.mutateAsync({
        sourceMonth: currentMonth,
        targetMonth: nextMonth,
      })

      toast({
        title: `${count} orçamentos copiados para ${format(nextMonth, 'MMMM', { locale: ptBR })}`,
      })
      
      setCurrentMonth(nextMonth)
    } catch (error) {
      toast({
        title: 'Erro ao copiar orçamentos',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="flex flex-col h-full">
      <Tabs defaultValue="budgets" className="flex-1">
        <div className="border-b">
          <TabsList className="w-full">
            <TabsTrigger value="budgets" className="flex-1">
              Orçamentos
            </TabsTrigger>
            <TabsTrigger value="goals" className="flex-1">
              Metas
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="budgets" className="flex-1">
          <div className="p-4 space-y-4">
            {/* Seletor de mês */}
            <div className="flex items-center justify-between">
              <MonthPicker value={currentMonth} onChange={setCurrentMonth} />
              
              {budgets && budgets.length > 0 && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Copy className="mr-2 h-4 w-4" />
                      Copiar para próximo mês
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Copiar orçamentos?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Isso copiará {budgets.length} orçamentos de{' '}
                        {format(currentMonth, 'MMMM', { locale: ptBR })} para{' '}
                        {format(addMonths(currentMonth, 1), 'MMMM', { locale: ptBR })}.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={handleCopyToNextMonth}>
                        Copiar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>

            {/* Lista de orçamentos */}
            {isLoading ? (
              <BudgetsSkeleton />
            ) : budgets && budgets.length > 0 ? (
              <BudgetList budgets={budgets} month={currentMonth} />
            ) : (
              <EmptyBudgets onAdd={() => setIsFormOpen(true)} />
            )}
          </div>

          {/* Botão para novo orçamento */}
          <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
            <SheetTrigger asChild>
              <Button
                size="icon"
                className="fixed bottom-20 right-4 h-14 w-14 rounded-full shadow-lg"
              >
                <Plus className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[70vh]">
              <BudgetForm
                month={currentMonth}
                onSuccess={() => setIsFormOpen(false)}
              />
            </SheetContent>
          </Sheet>
        </TabsContent>

        <TabsContent value="goals">
          {/* Goals component (será implementado em goals.md) */}
        </TabsContent>
      </Tabs>
    </div>
  )
}
```

---

### 5.2 Formulário de Orçamento
**Arquivo:** `components/forms/BudgetForm.tsx`

```typescript
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CurrencyInput } from '@/components/shared/CurrencyInput'
import { CategoryBadge } from '@/components/shared/CategoryBadge'
import { useCategories } from '@/lib/hooks/useCategories'
import { useCreateBudget, useBudgetSuggestion } from '@/lib/hooks/useBudgets'
import { useToast } from '@/components/ui/use-toast'
import { formatCurrency } from '@/lib/utils/currency'
import { Check } from 'lucide-react'

const formSchema = z.object({
  category_id: z.string().uuid('Selecione uma categoria'),
  amount: z.number().positive('Valor deve ser maior que zero'),
})

type FormData = z.infer<typeof formSchema>

interface BudgetFormProps {
  month: Date
  onSuccess?: () => void
  defaultValues?: Partial<FormData>
}

export function BudgetForm({ month, onSuccess, defaultValues }: BudgetFormProps) {
  const { toast } = useToast()
  const { data: categories } = useCategories()
  const createBudget = useCreateBudget()

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  const selectedCategoryId = form.watch('category_id')
  const { data: suggestion } = useBudgetSuggestion(selectedCategoryId)

  const expenseCategories = categories?.filter(c => c.type === 'expense') || []

  const onSubmit = async (data: FormData) => {
    try {
      await createBudget.mutateAsync({
        ...data,
        month: format(month, 'yyyy-MM-01'),
      })

      toast({
        title: 'Orçamento criado com sucesso',
      })

      form.reset()
      onSuccess?.()
    } catch (error: any) {
      if (error.message?.includes('duplicate')) {
        toast({
          title: 'Já existe orçamento para esta categoria neste mês',
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Erro ao criar orçamento',
          variant: 'destructive',
        })
      }
    }
  }

  const applySuggestion = () => {
    if (suggestion) {
      form.setValue('amount', suggestion.suggestedAmount)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-semibold">Novo Orçamento</h2>

        <p className="text-sm text-muted-foreground">
          Mês de referência:{' '}
          <span className="font-semibold">
            {format(month, 'MMMM yyyy', { locale: ptBR })}
          </span>
        </p>

        {/* Categoria */}
        <FormField
          control={form.control}
          name="category_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoria</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria de despesa" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {expenseCategories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      <CategoryBadge category={category} />
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Valor com sugestão */}
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Limite Mensal</FormLabel>
              <div className="flex gap-2">
                <FormControl>
                  <CurrencyInput
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={
                      suggestion
                        ? `Sugestão: ${formatCurrency(suggestion.suggestedAmount)}`
                        : 'R$ 0,00'
                    }
                  />
                </FormControl>
                {suggestion && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={applySuggestion}
                    title="Usar sugestão"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {suggestion && (
                <FormDescription>
                  Sugestão baseada na média dos últimos 3 meses:{' '}
                  {formatCurrency(suggestion.suggestedAmount)}
                </FormDescription>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={createBudget.isPending}
        >
          {createBudget.isPending ? 'Salvando...' : 'Criar orçamento'}
        </Button>
      </form>
    </Form>
  )
}
```

---

### 5.3 Lista de Orçamentos
**Arquivo:** `components/budgets/BudgetList.tsx`

```typescript
'use client'

import { AlertTriangle, Edit, Trash2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { CategoryBadge } from '@/components/shared/CategoryBadge'
import { formatCurrency } from '@/lib/utils/currency'
import { useDeleteBudget } from '@/lib/hooks/useBudgets'
import { useToast } from '@/components/ui/use-toast'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import type { Budget } from '@/lib/types'

interface BudgetWithSpent extends Budget {
  spent: number
  percentage: number
}

interface BudgetListProps {
  budgets: BudgetWithSpent[]
  month: Date
}

export function BudgetList({ budgets, month }: BudgetListProps) {
  const { toast } = useToast()
  const deleteBudget = useDeleteBudget()

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-red-500'
    if (percentage >= 80) return 'bg-yellow-500'
    return 'bg-green-600'
  }

  const getStatusMessage = (percentage: number) => {
    if (percentage >= 100) return 'Orçamento excedido'
    if (percentage >= 80) return 'Atenção: próximo do limite'
    return null
  }

  const handleDelete = async (id: string, categoryName: string) => {
    try {
      await deleteBudget.mutateAsync(id)
      toast({
        title: `Orçamento de ${categoryName} excluído`,
      })
    } catch (error) {
      toast({
        title: 'Erro ao excluir orçamento',
        variant: 'destructive',
      })
    }
  }

  // Ordenar por percentual (maior primeiro)
  const sortedBudgets = [...budgets].sort((a, b) => b.percentage - a.percentage)

  return (
    <div className="space-y-3">
      {sortedBudgets.map(budget => {
        const statusMessage = getStatusMessage(budget.percentage)
        const exceeded = budget.spent > budget.amount

        return (
          <Card key={budget.id}>
            <CardContent className="p-4 space-y-3">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CategoryBadge category={budget.category} />
                  <div>
                    <p className="font-semibold">{budget.category.name}</p>
                    {statusMessage && (
                      <p className={`text-xs ${
                        exceeded ? 'text-red-500' : 'text-yellow-600'
                      }`}>
                        {statusMessage}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {exceeded && <AlertTriangle className="h-5 w-5 text-red-500" />}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Excluir orçamento?</AlertDialogTitle>
                        <AlertDialogDescription>
                          O orçamento de {budget.category.name} será excluído.
                          Suas transações não serão afetadas.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(budget.id, budget.category.name)}
                        >
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">
                    {formatCurrency(budget.spent)} de {formatCurrency(budget.amount)}
                  </span>
                  <span className={`font-semibold ${
                    exceeded ? 'text-red-500' : 'text-foreground'
                  }`}>
                    {budget.percentage.toFixed(0)}%
                  </span>
                </div>
                <Progress
                  value={Math.min(budget.percentage, 100)}
                  className={`h-2 ${getProgressColor(budget.percentage)}`}
                />
                {exceeded && (
                  <p className="text-xs text-red-500 mt-1">
                    Você excedeu o orçamento em {formatCurrency(budget.spent - budget.amount)}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
```

---

## 6. Hooks

### Hook: `useBudgets`
**Arquivo:** `lib/hooks/useBudgets.ts`

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { createClient } from '@/lib/supabase/client'
import { useUser } from './useUser'
import type { Budget } from '@/lib/types'

interface BudgetWithSpent extends Budget {
  spent: number
  percentage: number
}

export function useBudgets(month: Date) {
  const { data: user } = useUser()
  const supabase = createClient()

  const monthKey = format(month, 'yyyy-MM-01')

  return useQuery({
    queryKey: ['budgets', user?.id, monthKey],
    queryFn: async (): Promise<BudgetWithSpent[]> => {
      if (!user) throw new Error('User not authenticated')

      // Buscar orçamentos do mês
      const { data: budgets, error } = await supabase
        .from('budgets')
        .select('*, category:categories(*)')
        .eq('user_id', user.id)
        .eq('month', monthKey)

      if (error) throw error

      // Buscar gastos do mês por categoria
      const monthStart = format(month, 'yyyy-MM-01')
      const monthEnd = format(new Date(month.getFullYear(), month.getMonth() + 1, 0), 'yyyy-MM-dd')

      const { data: transactions } = await supabase
        .from('transactions')
        .select('category_id, amount')
        .eq('user_id', user.id)
        .eq('type', 'expense')
        .gte('date', monthStart)
        .lte('date', monthEnd)

      // Calcular gasto por categoria
      const spentByCategory = (transactions || []).reduce((acc, t) => {
        acc[t.category_id] = (acc[t.category_id] || 0) + Number(t.amount)
        return acc
      }, {} as Record<string, number>)

      // Combinar budgets com spent
      return (budgets || []).map(budget => {
        const spent = spentByCategory[budget.category_id] || 0
        const percentage = (spent / Number(budget.amount)) * 100

        return {
          ...budget,
          spent,
          percentage,
        }
      })
    },
    enabled: !!user,
  })
}

export function useCreateBudget() {
  const queryClient = useQueryClient()
  const { data: user } = useUser()
  const supabase = createClient()

  return useMutation({
    mutationFn: async (data: Omit<Budget, 'id' | 'user_id' | 'created_at'>) => {
      if (!user) throw new Error('User not authenticated')

      const { data: budget, error } = await supabase
        .from('budgets')
        .insert({
          ...data,
          user_id: user.id,
        })
        .select()
        .single()

      if (error) throw error
      return budget
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export function useDeleteBudget() {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('budgets')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export function useCopyBudgets() {
  const queryClient = useQueryClient()
  const { data: user } = useUser()
  const supabase = createClient()

  return useMutation({
    mutationFn: async ({
      sourceMonth,
      targetMonth,
    }: {
      sourceMonth: Date
      targetMonth: Date
    }) => {
      if (!user) throw new Error('User not authenticated')

      const sourceKey = format(sourceMonth, 'yyyy-MM-01')
      const targetKey = format(targetMonth, 'yyyy-MM-01')

      // Buscar orçamentos do mês de origem
      const { data: sourceBudgets, error: fetchError } = await supabase
        .from('budgets')
        .select('category_id, amount')
        .eq('user_id', user.id)
        .eq('month', sourceKey)

      if (fetchError) throw fetchError
      if (!sourceBudgets || sourceBudgets.length === 0) return 0

      // Buscar orçamentos já existentes no mês de destino
      const { data: existingBudgets } = await supabase
        .from('budgets')
        .select('category_id')
        .eq('user_id', user.id)
        .eq('month', targetKey)

      const existingCategoryIds = new Set(
        (existingBudgets || []).map(b => b.category_id)
      )

      // Filtrar apenas categorias que ainda não têm orçamento no destino
      const budgetsToCreate = sourceBudgets.filter(
        b => !existingCategoryIds.has(b.category_id)
      )

      if (budgetsToCreate.length === 0) return 0

      // Inserir novos orçamentos
      const { error: insertError } = await supabase
        .from('budgets')
        .insert(
          budgetsToCreate.map(b => ({
            user_id: user.id,
            category_id: b.category_id,
            amount: b.amount,
            month: targetKey,
          }))
        )

      if (insertError) throw insertError

      return budgetsToCreate.length
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] })
    },
  })
}

export function useBudgetSuggestion(categoryId: string | undefined) {
  const { data: user } = useUser()
  const supabase = createClient()

  return useQuery({
    queryKey: ['budget-suggestion', user?.id, categoryId],
    queryFn: async () => {
      if (!user || !categoryId) return null

      // Buscar gastos dos últimos 3 meses
      const threeMonthsAgo = new Date()
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)

      const { data: transactions } = await supabase
        .from('transactions')
        .select('date, amount')
        .eq('user_id', user.id)
        .eq('category_id', categoryId)
        .eq('type', 'expense')
        .gte('date', format(threeMonthsAgo, 'yyyy-MM-dd'))

      if (!transactions || transactions.length === 0) return null

      // Agrupar por mês e calcular total
      const monthlyTotals = transactions.reduce((acc, t) => {
        const month = format(new Date(t.date), 'yyyy-MM')
        acc[month] = (acc[month] || 0) + Number(t.amount)
        return acc
      }, {} as Record<string, number>)

      // Calcular média
      const totals = Object.values(monthlyTotals)
      const average = totals.reduce((sum, val) => sum + val, 0) / totals.length

      // Arredondar para próxima centena
      const suggested = Math.ceil(average / 100) * 100

      return {
        suggestedAmount: suggested,
        basedOnMonths: totals.length,
      }
    },
    enabled: !!user && !!categoryId,
  })
}
```

---

## 7. Validações Zod

```typescript
// lib/schemas/budget.ts
import { z } from 'zod'

export const budgetSchema = z.object({
  category_id: z.string().uuid('Selecione uma categoria válida'),
  amount: z
    .number({ required_error: 'Valor obrigatório' })
    .positive('Valor deve ser maior que zero')
    .max(999999.99, 'Valor muito alto'),
  month: z.string().regex(/^\d{4}-\d{2}-01$/, 'Mês inválido'),
})
```

---

## 8. Estados de UI

### Loading
```typescript
function BudgetsSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
      ))}
    </div>
  )
}
```

### Empty
```typescript
function EmptyBudgets({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <p className="text-muted-foreground mb-4">
        Nenhum orçamento configurado para este mês
      </p>
      <Button onClick={onAdd}>
        <Plus className="mr-2 h-4 w-4" />
        Criar primeiro orçamento
      </Button>
    </div>
  )
}
```

---

## 9. Testes Sugeridos

### Teste: UNIQUE constraint
```typescript
test('Não permitir orçamento duplicado', async () => {
  // Criar primeiro orçamento
  await supabase.from('budgets').insert({
    user_id: userId,
    category_id: catId,
    amount: 800,
    month: '2026-03-01',
  })

  // Tentar criar duplicado
  const { error } = await supabase.from('budgets').insert({
    user_id: userId,
    category_id: catId,
    amount: 900,
    month: '2026-03-01',
  })

  expect(error?.message).toContain('duplicate')
})
```

---

## 10. Links para Tasks

- **TASK-015:** Hook `useBudgets` e `useGoals`
- **TASK-016:** Página de Metas (aba Orçamentos)
- **TASK-017:** Formulários de orçamento e meta

---

**Última atualização:** Março 2026
