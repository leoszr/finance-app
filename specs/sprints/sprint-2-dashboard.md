# Sprint 2 — Dashboard e Gráficos

**Objetivo:** Dashboard visual com gráficos de gastos, comparativos mensais e resumo financeiro.  
**Estimativa:** 4–5 dias  
**Status:** 🔴 Não iniciado  
**Tasks:** TASK-011, TASK-012, TASK-013, TASK-014

---

## Visão Geral

Esta sprint transforma os dados brutos de transações em visualizações significativas. O dashboard será a tela inicial do app, mostrando:
- Resumo financeiro do mês atual
- Gráfico de pizza de gastos por categoria
- Últimas transações
- Comparativo de receitas/despesas dos últimos 6 meses

Esta sprint consolida a experiência do usuário ao fornecer insights visuais sobre seus hábitos financeiros.

---

## TASK-011: Hook `useDashboard`

**Descrição expandida:**  
Criar hook que agrega dados de transações para exibição no dashboard, calculando totais, percentuais por categoria e retornando dados prontos para visualização.

### Arquivos a criar/modificar

```
├── lib/hooks/
│   └── useDashboard.ts            (hook principal)
```

### Código exemplo

#### `lib/hooks/useDashboard.ts`
```typescript
'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Transaction, Category } from '@/lib/types'
import { format, startOfMonth, endOfMonth } from 'date-fns'

/**
 * Dados agregados para o dashboard
 */
export interface DashboardData {
  totalIncome: number
  totalExpenses: number
  balance: number
  expensesByCategory: Array<{
    category: Category
    total: number
    percentage: number
    transactionCount: number
  }>
  recentTransactions: Transaction[]
}

/**
 * Hook para buscar dados agregados do dashboard
 * 
 * Retorna:
 * - Totais de receitas e despesas
 * - Saldo do mês
 * - Gastos agrupados por categoria (com percentual)
 * - Últimas 5 transações
 */
export function useDashboard(month: Date) {
  const supabase = createClient()

  const monthStart = format(startOfMonth(month), 'yyyy-MM-dd')
  const monthEnd = format(endOfMonth(month), 'yyyy-MM-dd')
  const monthKey = format(month, 'yyyy-MM')

  return useQuery({
    queryKey: ['dashboard', monthKey],
    queryFn: async (): Promise<DashboardData> => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error('Usuário não autenticado')

      // Buscar transações do mês com categorias
      const { data: transactions, error } = await supabase
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
        console.error('Erro ao buscar dados do dashboard:', error)
        throw new Error('Não foi possível carregar os dados do dashboard')
      }

      const allTransactions = (transactions as Transaction[]) || []

      // Calcular totais
      const totalIncome = allTransactions
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + Number(t.amount), 0)

      const totalExpenses = allTransactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + Number(t.amount), 0)

      const balance = totalIncome - totalExpenses

      // Agrupar despesas por categoria
      const expenseTransactions = allTransactions.filter((t) => t.type === 'expense')
      const categoryMap = new Map<
        string,
        {
          category: Category
          total: number
          transactionCount: number
        }
      >()

      expenseTransactions.forEach((transaction) => {
        if (!transaction.category) return

        const existing = categoryMap.get(transaction.category.id)
        if (existing) {
          existing.total += Number(transaction.amount)
          existing.transactionCount += 1
        } else {
          categoryMap.set(transaction.category.id, {
            category: transaction.category as Category,
            total: Number(transaction.amount),
            transactionCount: 1,
          })
        }
      })

      // Calcular percentuais e ordenar por total (maior primeiro)
      const expensesByCategory = Array.from(categoryMap.values())
        .map((item) => ({
          ...item,
          percentage: totalExpenses > 0 ? (item.total / totalExpenses) * 100 : 0,
        }))
        .sort((a, b) => b.total - a.total)

      // Últimas 5 transações
      const recentTransactions = allTransactions.slice(0, 5)

      return {
        totalIncome,
        totalExpenses,
        balance,
        expensesByCategory,
        recentTransactions,
      }
    },
  })
}
```

### Passos de implementação

1. **Criar `lib/hooks/useDashboard.ts`:**
   - Implementar função de agregação conforme exemplo
   - Garantir que percentuais somam 100%

2. **Testar cálculos:**
   - Criar transações de teste
   - Verificar se totais estão corretos
   - Verificar se percentuais somam 100%

3. **Otimizar query:**
   - Considerar criar view no Supabase se performance for problema
   - Por enquanto, cálculo no cliente é aceitável (< 500ms)

### Critérios de aceitação

- [ ] `useDashboard` retorna dados agregados corretos
- [ ] `expensesByCategory` ordenado por total (maior primeiro)
- [ ] Percentuais somam 100% (ou próximo, considerando arredondamento)
- [ ] `recentTransactions` retorna no máximo 5 itens
- [ ] Query executa em menos de 500ms (testar com 100+ transações)
- [ ] Categorias sem transações não aparecem no array
- [ ] Se não houver transações, todos os valores são 0 e arrays são vazios

### Possíveis desafios/edge cases

- **Precisão decimal:** Usar `Number(t.amount)` para converter de string
- **Percentual > 100%:** Pode acontecer por arredondamento. Normalizar se necessário
- **Categoria deletada:** Verificar se `transaction.category` não é null antes de usar

### Dependências

- TASK-007 completa (useTransactions como referência)

### Tempo estimado

**2–3 horas** (incluindo testes de agregação)

---

## TASK-012: Componente PieChart de gastos

**Descrição expandida:**  
Gráfico de pizza interativo mostrando distribuição de gastos por categoria, com tooltip detalhado e legenda mobile-friendly.

### Arquivos a criar/modificar

```
├── components/charts/
│   └── ExpensesPieChart.tsx       (gráfico de pizza)
```

### Código exemplo

#### `components/charts/ExpensesPieChart.tsx`
```typescript
'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { formatCurrency } from '@/lib/utils/currency'
import { Category } from '@/lib/types'

interface ExpensesByCategoryData {
  category: Category
  total: number
  percentage: number
}

interface ExpensesPieChartProps {
  data: ExpensesByCategoryData[]
}

// Cores padrão para categorias (caso não tenham cor customizada)
const FALLBACK_COLORS = [
  '#ef4444', // red-500
  '#f59e0b', // amber-500
  '#10b981', // emerald-500
  '#3b82f6', // blue-500
  '#8b5cf6', // violet-500
  '#ec4899', // pink-500
  '#14b8a6', // teal-500
  '#f97316', // orange-500
]

/**
 * Gráfico de pizza de gastos por categoria
 * 
 * - Cada fatia representa uma categoria
 * - Tooltip mostra nome, valor e percentual
 * - Legenda abaixo (não ao lado — otimizado para mobile)
 * - Estado vazio: círculo cinza
 */
export function ExpensesPieChart({ data }: ExpensesPieChartProps) {
  // Estado vazio
  if (!data || data.length === 0) {
    return (
      <div className="flex h-80 flex-col items-center justify-center">
        <div className="h-48 w-48 rounded-full bg-zinc-200 dark:bg-zinc-800" />
        <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
          Nenhum gasto registrado no mês
        </p>
      </div>
    )
  }

  // Preparar dados para o chart
  const chartData = data.map((item, index) => ({
    name: item.category.name,
    value: item.total,
    percentage: item.percentage,
    color: item.category.color || FALLBACK_COLORS[index % FALLBACK_COLORS.length],
  }))

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="rounded-lg border border-zinc-200 bg-white p-3 shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
          <p className="font-semibold text-zinc-900 dark:text-zinc-100">{data.name}</p>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {formatCurrency(data.value)}
          </p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {data.percentage.toFixed(1)}% do total
          </p>
        </div>
      )
    }
    return null
  }

  // Custom legend
  const renderLegend = (props: any) => {
    const { payload } = props
    return (
      <ul className="mt-4 grid grid-cols-2 gap-2 text-sm">
        {payload.map((entry: any, index: number) => (
          <li key={`legend-${index}`} className="flex items-center gap-2">
            <span
              className="h-3 w-3 flex-shrink-0 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="truncate text-zinc-700 dark:text-zinc-300">{entry.value}</span>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={100}
            innerRadius={60}
            fill="#8884d8"
            dataKey="value"
            animationBegin={0}
            animationDuration={800}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={renderLegend} verticalAlign="bottom" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
```

### Passos de implementação

1. **Instalar Recharts:**
   ```bash
   npm install recharts
   ```

2. **Criar componente:**
   - Implementar `ExpensesPieChart.tsx` conforme exemplo
   - Testar com dados mock primeiro

3. **Testar responsividade:**
   - Verificar em 375px, 768px, 1024px
   - Garantir que legenda não quebra

4. **Testar dark mode:**
   - Verificar contraste de cores
   - Tooltip legível em ambos os temas

### Critérios de aceitação

- [ ] Gráfico renderiza corretamente com dados reais
- [ ] Tooltip aparece ao tocar/hover em fatia
- [ ] Tooltip mostra nome, valor formatado e percentual
- [ ] Legenda abaixo do gráfico (não ao lado)
- [ ] Estado vazio mostra círculo cinza com mensagem
- [ ] Cores customizadas das categorias são respeitadas
- [ ] Funciona em dark mode
- [ ] Animação suave ao carregar

### Possíveis desafios/edge cases

- **Recharts SSR:** Pode ter problemas com SSR. Use `'use client'` no componente
- **Legenda cortada:** Ajustar `ResponsiveContainer` height se necessário
- **Muitas categorias:** Se > 10 categorias, legenda pode ficar poluída. Considerar agrupar "Outros"

### Dependências

- TASK-011 completa

### Tempo estimado

**3–4 horas** (incluindo customização de tooltip e legenda)

---

## TASK-013: Página Dashboard

**Descrição expandida:**  
Tela inicial do app mostrando visão geral financeira: resumo do mês, gráfico de gastos, últimas transações e progresso de orçamentos (se houver).

### Arquivos a criar/modificar

```
├── app/(app)/dashboard/
│   ├── page.tsx                   (página principal)
│   └── loading.tsx                (skeleton loading)
├── components/dashboard/
│   ├── SummaryCards.tsx           (cards de resumo)
│   ├── RecentTransactions.tsx     (lista compacta)
│   └── BudgetProgress.tsx         (barras de orçamento)
```

### Código exemplo (parcial)

#### `app/(app)/dashboard/page.tsx`
```typescript
'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useDashboard } from '@/lib/hooks/useDashboard'
import { ExpensesPieChart } from '@/components/charts/ExpensesPieChart'
import { SummaryCards } from '@/components/dashboard/SummaryCards'
import { RecentTransactions } from '@/components/dashboard/RecentTransactions'
import { PageHeader } from '@/components/layout/PageHeader'
import { createClient } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'
import { User } from '@supabase/supabase-js'

export default function DashboardPage() {
  const [currentMonth] = useState(new Date())
  const { data, isLoading } = useDashboard(currentMonth)

  // Buscar dados do usuário
  const supabase = createClient()
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      return user as User
    },
  })

  if (isLoading) {
    return <DashboardSkeleton />
  }

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 'Usuário'

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      {/* Cabeçalho */}
      <div className="bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800">
        <div className="px-6 py-6">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Olá, {firstName}!
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {format(currentMonth, "MMMM 'de' yyyy", { locale: ptBR })}
          </p>
        </div>
      </div>

      <div className="space-y-6 px-6 py-6">
        {/* Cards de resumo */}
        <SummaryCards
          totalIncome={data?.totalIncome || 0}
          totalExpenses={data?.totalExpenses || 0}
          balance={data?.balance || 0}
        />

        {/* Gráfico de gastos */}
        <section className="rounded-lg bg-white p-6 dark:bg-zinc-950">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Gastos por categoria
          </h2>
          <div className="mt-4">
            <ExpensesPieChart data={data?.expensesByCategory || []} />
          </div>
        </section>

        {/* Últimas transações */}
        <section className="rounded-lg bg-white p-6 dark:bg-zinc-950">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Últimas transações
            </h2>
            <a
              href="/transacoes"
              className="text-sm font-medium text-green-600 hover:text-green-700 dark:text-green-500"
            >
              Ver todas
            </a>
          </div>
          <div className="mt-4">
            <RecentTransactions transactions={data?.recentTransactions || []} />
          </div>
        </section>
      </div>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="min-h-screen animate-pulse bg-zinc-50 dark:bg-zinc-900">
      <div className="bg-white px-6 py-6 dark:bg-zinc-950">
        <div className="h-8 w-40 rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="mt-2 h-4 w-32 rounded bg-zinc-200 dark:bg-zinc-800" />
      </div>
      <div className="space-y-6 px-6 py-6">
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-lg bg-white dark:bg-zinc-950" />
          ))}
        </div>
        <div className="h-96 rounded-lg bg-white dark:bg-zinc-950" />
        <div className="h-64 rounded-lg bg-white dark:bg-zinc-950" />
      </div>
    </div>
  )
}
```

#### `components/dashboard/SummaryCards.tsx`
```typescript
import { formatCurrency } from '@/lib/utils/currency'
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SummaryCardsProps {
  totalIncome: number
  totalExpenses: number
  balance: number
}

export function SummaryCards({ totalIncome, totalExpenses, balance }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {/* Receitas */}
      <div className="flex flex-col rounded-lg bg-green-50 p-4 dark:bg-green-950">
        <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
        <p className="mt-2 text-xs text-green-700 dark:text-green-300">Receitas</p>
        <p className="mt-1 text-base font-bold text-green-900 dark:text-green-100">
          {formatCurrency(totalIncome)}
        </p>
      </div>

      {/* Despesas */}
      <div className="flex flex-col rounded-lg bg-red-50 p-4 dark:bg-red-950">
        <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
        <p className="mt-2 text-xs text-red-700 dark:text-red-300">Despesas</p>
        <p className="mt-1 text-base font-bold text-red-900 dark:text-red-100">
          {formatCurrency(totalExpenses)}
        </p>
      </div>

      {/* Saldo */}
      <div className="flex flex-col rounded-lg bg-zinc-100 p-4 dark:bg-zinc-800">
        <DollarSign
          className={cn(
            'h-5 w-5',
            balance >= 0
              ? 'text-green-600 dark:text-green-400'
              : 'text-red-600 dark:text-red-400'
          )}
        />
        <p className="mt-2 text-xs text-zinc-700 dark:text-zinc-300">Saldo</p>
        <p
          className={cn(
            'mt-1 text-base font-bold',
            balance >= 0
              ? 'text-green-600 dark:text-green-400'
              : 'text-red-600 dark:text-red-400'
          )}
        >
          {formatCurrency(balance)}
        </p>
      </div>
    </div>
  )
}
```

### Passos de implementação

1. **Criar componentes auxiliares:**
   - `SummaryCards.tsx`
   - `RecentTransactions.tsx` (lista compacta com 5 itens)

2. **Criar página dashboard:**
   - Implementar `page.tsx` conforme exemplo
   - Adicionar skeleton loading

3. **Testar com dados reais:**
   - Criar transações de teste
   - Verificar se todos os valores estão corretos

4. **Otimizar performance:**
   - Memoizar componentes se necessário
   - Verificar se não há re-renders desnecessários

### Critérios de aceitação

- [ ] Dashboard é a rota padrão após login
- [ ] Saudação exibe primeiro nome do usuário
- [ ] Cards de resumo mostram valores corretos
- [ ] Saldo negativo em vermelho, positivo em verde
- [ ] Gráfico de pizza renderiza corretamente
- [ ] Últimas 5 transações exibidas
- [ ] Link "Ver todas" vai para `/transacoes`
- [ ] Skeleton loading aparece durante carregamento
- [ ] Pull-to-refresh atualiza dados (mobile)
- [ ] Página carrega em < 1s (4G)

### Possíveis desafios/edge cases

- **Usuário sem transações:** Exibir onboarding ou CTA para adicionar primeira transação
- **Nome do usuário vazio:** Usar "Usuário" como fallback
- **Performance:** Com muitas transações, agregação pode ser lenta. Considerar view SQL.

### Dependências

- TASK-011 completa
- TASK-012 completa

### Tempo estimado

**4–5 horas** (incluindo componentes auxiliares e skeleton)

---

## TASK-014: Comparativo entre meses

**Descrição expandida:**  
Gráfico de linha mostrando evolução de receitas e despesas nos últimos 6 meses, permitindo visualizar tendências e padrões de gastos.

### Arquivos a criar/modificar

```
├── components/charts/
│   └── MonthlyComparisonChart.tsx (gráfico de linha)
├── lib/hooks/
│   └── useMonthlyComparison.ts    (hook de dados)
├── app/(app)/transacoes/
│   └── page.tsx                   (adicionar seção)
```

### Código exemplo

#### `lib/hooks/useMonthlyComparison.ts`
```typescript
'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export interface MonthlyComparisonData {
  month: string
  monthLabel: string
  income: number
  expenses: number
}

/**
 * Hook para buscar dados de comparação mensal (últimos 6 meses)
 */
export function useMonthlyComparison() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['monthly-comparison'],
    queryFn: async (): Promise<MonthlyComparisonData[]> => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error('Usuário não autenticado')

      // Gerar array dos últimos 6 meses
      const months: Date[] = []
      for (let i = 5; i >= 0; i--) {
        months.push(subMonths(new Date(), i))
      }

      // Buscar transações dos últimos 6 meses
      const firstMonth = format(startOfMonth(months[0]), 'yyyy-MM-dd')
      const lastMonth = format(endOfMonth(months[5]), 'yyyy-MM-dd')

      const { data: transactions, error } = await supabase
        .from('transactions')
        .select('date, type, amount')
        .eq('user_id', user.id)
        .gte('date', firstMonth)
        .lte('date', lastMonth)

      if (error) {
        console.error('Erro ao buscar comparação mensal:', error)
        throw new Error('Não foi possível carregar os dados')
      }

      // Agrupar por mês
      const monthlyData = months.map((month) => {
        const monthKey = format(month, 'yyyy-MM')
        const monthTransactions =
          transactions?.filter((t) => t.date.startsWith(monthKey)) || []

        const income = monthTransactions
          .filter((t) => t.type === 'income')
          .reduce((sum, t) => sum + Number(t.amount), 0)

        const expenses = monthTransactions
          .filter((t) => t.type === 'expense')
          .reduce((sum, t) => sum + Number(t.amount), 0)

        return {
          month: monthKey,
          monthLabel: format(month, 'MMM', { locale: ptBR }),
          income,
          expenses,
        }
      })

      return monthlyData
    },
    staleTime: 10 * 60 * 1000, // 10 minutos (dados históricos mudam pouco)
  })
}
```

#### `components/charts/MonthlyComparisonChart.tsx`
```typescript
'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { formatCurrencyCompact } from '@/lib/utils/currency'
import { MonthlyComparisonData } from '@/lib/hooks/useMonthlyComparison'

interface MonthlyComparisonChartProps {
  data: MonthlyComparisonData[]
}

export function MonthlyComparisonChart({ data }: MonthlyComparisonChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-zinc-600 dark:text-zinc-400">
        Sem dados para exibir
      </div>
    )
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-zinc-200 bg-white p-3 shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
          <p className="font-semibold text-zinc-900 dark:text-zinc-100">{label}</p>
          <p className="mt-1 text-sm text-green-600 dark:text-green-400">
            Receitas: {formatCurrencyCompact(payload[0].value)}
          </p>
          <p className="text-sm text-red-600 dark:text-red-400">
            Despesas: {formatCurrencyCompact(payload[1].value)}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
        <XAxis
          dataKey="monthLabel"
          stroke="#71717a"
          style={{ fontSize: '12px' }}
        />
        <YAxis
          stroke="#71717a"
          style={{ fontSize: '12px' }}
          tickFormatter={(value) => formatCurrencyCompact(value)}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: '14px' }}
          iconType="line"
        />
        <Line
          type="monotone"
          dataKey="income"
          stroke="#16a34a"
          strokeWidth={2}
          name="Receitas"
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
        <Line
          type="monotone"
          dataKey="expenses"
          stroke="#dc2626"
          strokeWidth={2}
          name="Despesas"
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
```

### Passos de implementação

1. **Criar hook useMonthlyComparison:**
   - Implementar lógica de agregação por mês
   - Testar com dados reais

2. **Criar componente de gráfico:**
   - Implementar `MonthlyComparisonChart.tsx`
   - Customizar cores e tooltip

3. **Adicionar seção na página de transações:**
   - Inserir gráfico abaixo dos cards de resumo
   - Adicionar título "Comparativo mensal"

4. **Testar responsividade:**
   - Verificar em 375px (labels podem se sobrepor)
   - Ajustar margens se necessário

### Critérios de aceitação

- [ ] Gráfico mostra últimos 6 meses
- [ ] Eixo X mostra mês abreviado (Jan, Fev, Mar)
- [ ] Eixo Y formata valores com `formatCurrencyCompact`
- [ ] Linha de receitas em verde (#16a34a)
- [ ] Linha de despesas em vermelho (#dc2626)
- [ ] Tooltip mostra valores completos ao tocar/hover
- [ ] Mês atual destacado visualmente (dot maior)
- [ ] Funciona em dark mode
- [ ] Gráfico aparece na aba de transações

### Possíveis desafios/edge cases

- **Meses sem transações:** Exibir valor 0 (não omitir do gráfico)
- **Labels sobrepostos:** Rotacionar labels do eixo X se necessário
- **Performance:** Query pode ser lenta com muitos dados. Considerar cache de 10min.

### Dependências

- TASK-007 completa (estrutura de queries)
- TASK-012 completa (Recharts já instalado)

### Tempo estimado

**3–4 horas** (incluindo hook e customização do gráfico)

---

## Resumo da Sprint 2

Ao completar esta sprint, o usuário terá:

✅ Dashboard visual com resumo financeiro  
✅ Gráfico de pizza de gastos por categoria  
✅ Últimas transações no dashboard  
✅ Comparativo mensal dos últimos 6 meses  

**Próxima sprint:** Sprint 3 — Metas e Orçamentos

---

**Última atualização:** Março 2026  
**Versão:** 1.0
