# Feature: Dashboard e Visualizações

**Status:** 🔄 Em desenvolvimento  
**Prioridade:** 🔴 CRÍTICA  
**Sprint:** Sprint 2 - Dashboard e Gráficos  
**Tasks relacionadas:** TASK-011, TASK-012, TASK-013, TASK-014  
**Estimativa:** 4-5 dias

---

## 1. Visão Geral

Dashboard mobile-first com visualizações financeiras do mês atual, incluindo:
- **Resumos financeiros** (receitas, despesas, saldo)
- **Gráfico de pizza** de gastos por categoria
- **Últimas transações** com acesso rápido
- **Progresso de orçamentos** (se configurados)
- **Comparativo mensal** (últimos 6 meses)
- **Saudação personalizada** com nome do usuário

### Objetivos
- ✅ Visão geral financeira em um relance
- ✅ Identificar categorias com maior gasto
- ✅ Acompanhar evolução mês a mês
- ✅ Acesso rápido às transações recentes
- ✅ Alertas visuais de orçamentos excedidos

---

## 2. Requisitos Funcionais

### RF-001: Cards de Resumo do Mês
- **Descrição:** Exibir total de receitas, despesas e saldo do mês atual
- **Regras de negócio:**
  - Receitas = SUM(amount) WHERE type = 'income'
  - Despesas = SUM(amount) WHERE type = 'expense'
  - Saldo = receitas - despesas
  - Cor do saldo: verde (≥0), vermelho (<0)
  - Valores formatados em BRL

### RF-002: Gráfico de Gastos por Categoria
- **Descrição:** Pie chart mostrando distribuição de despesas
- **Regras de negócio:**
  - Apenas despesas do mês atual
  - Agrupar por categoria
  - Exibir percentual de cada categoria
  - Usar cores das categorias
  - Tooltip com valor absoluto e percentual
  - Estado vazio: círculo cinza com texto

### RF-003: Últimas Transações
- **Descrição:** Lista das 5 transações mais recentes
- **Regras de negócio:**
  - Ordenar por data DESC, created_at DESC
  - Exibir: ícone categoria, descrição, valor, data
  - Link "Ver todas" → /transacoes
  - Estado vazio: texto "Nenhuma transação"

### RF-004: Progresso de Orçamentos
- **Descrição:** Barras de progresso para orçamentos do mês
- **Regras de negócio:**
  - Exibir apenas se usuário tiver orçamentos configurados
  - Calcular: gasto / limite * 100%
  - Cores: verde (<80%), amarelo (80-99%), vermelho (≥100%)
  - Ícone de alerta se excedido
  - Link "Gerenciar orçamentos" → /metas

### RF-005: Comparativo Mensal (Gráfico de Linha)
- **Descrição:** Evolução de receitas e despesas nos últimos 6 meses
- **Regras de negócio:**
  - 2 linhas: receitas (verde) e despesas (vermelho)
  - Eixo X: meses abreviados (Jan, Fev, Mar...)
  - Eixo Y: valores em BRL abreviados (R$1,2k)
  - Destacar mês atual
  - Tooltip ao tocar: valores exatos

### RF-006: Saudação Personalizada
- **Descrição:** Exibir "Olá, [nome]" no topo
- **Regras de negócio:**
  - Usar primeiro nome do email se nome completo não disponível
  - Ex: "joao@email.com" → "Olá, João"
  - Variação por período: "Bom dia", "Boa tarde", "Boa noite"

---

## 3. User Stories

### 🎯 US-001: Visão Geral Rápida
**Como** usuário  
**Quero** ver um resumo financeiro ao abrir o app  
**Para** saber rapidamente minha situação do mês

**Cenário:** Dashboard com dados
```gherkin
Dado que tenho 3 receitas e 5 despesas em março
E meu saldo é positivo em R$ 500
Quando acesso o dashboard
Então vejo card "Receitas: R$ 3.500,00"
E vejo card "Despesas: R$ 3.000,00"
E vejo card "Saldo: R$ 500,00" em verde
E vejo saudação "Olá, João"
E vejo "Março 2026" no cabeçalho
```

**Cenário:** Saldo negativo
```gherkin
Dado que gastei mais do que recebi
Quando acesso o dashboard
Então vejo card "Saldo: -R$ 200,00" em vermelho
E vejo ícone de alerta ao lado do saldo
```

---

### 🎯 US-002: Identificar Maior Gasto
**Como** usuário  
**Quero** ver um gráfico de pizza dos meus gastos  
**Para** identificar em que categoria gasto mais

**Cenário:** Visualizar gráfico
```gherkin
Dado que gastei:
  - Alimentação: R$ 800 (40%)
  - Transporte: R$ 600 (30%)
  - Lazer: R$ 400 (20%)
  - Saúde: R$ 200 (10%)
Quando acesso o dashboard
E visualizo o gráfico de pizza
Então vejo 4 fatias coloridas
E a maior fatia é "Alimentação" (40%)
Quando toco na fatia de Alimentação
Então vejo tooltip "Alimentação: R$ 800,00 (40%)"
```

**Cenário:** Sem despesas no mês
```gherkin
Dado que não tenho despesas em março
Quando acesso o dashboard
Então vejo círculo cinza no lugar do gráfico
E vejo texto "Nenhum gasto este mês"
```

---

### 🎯 US-003: Acessar Transações Recentes
**Como** usuário  
**Quero** ver minhas últimas transações no dashboard  
**Para** ter acesso rápido sem navegar

**Cenário:** Ver últimas 5
```gherkin
Dado que tenho 10 transações este mês
Quando acesso o dashboard
Então vejo seção "Últimas transações"
E vejo 5 transações mais recentes
E vejo link "Ver todas" no final
Quando clico em "Ver todas"
Então sou redirecionado para /transacoes
```

---

### 🎯 US-004: Monitorar Orçamentos
**Como** usuário  
**Quero** ver o progresso dos meus orçamentos no dashboard  
**Para** saber se estou dentro do limite

**Cenário:** Orçamento saudável
```gherkin
Dado que tenho orçamento de R$ 800 para Alimentação
E gastei R$ 500 (62,5%)
Quando acesso o dashboard
Então vejo barra de progresso verde
E vejo "R$ 500 de R$ 800"
E vejo "62%" na barra
```

**Cenário:** Orçamento excedido
```gherkin
Dado que tenho orçamento de R$ 300 para Lazer
E gastei R$ 350 (117%)
Quando acesso o dashboard
Então vejo barra de progresso vermelha
E vejo ícone de alerta ⚠️
E vejo "R$ 350 de R$ 300"
E vejo "117%" em destaque
```

**Cenário:** Sem orçamentos
```gherkin
Dado que não tenho orçamentos configurados
Quando acesso o dashboard
Então não vejo seção de orçamentos
```

---

### 🎯 US-005: Comparar Meses Anteriores
**Como** usuário  
**Quero** ver um gráfico comparando os últimos 6 meses  
**Para** identificar tendências nos meus gastos

**Cenário:** Visualizar evolução
```gherkin
Dado que estou em Março/2026
E tenho transações nos últimos 6 meses
Quando rolo o dashboard até o final
Então vejo seção "Comparativo Mensal"
E vejo gráfico de linha com 2 linhas
E vejo linha verde (Receitas)
E vejo linha vermelha (Despesas)
E o eixo X mostra "Out, Nov, Dez, Jan, Fev, Mar"
E Março está destacado
Quando toco em um ponto do gráfico
Então vejo tooltip "Fev/26 - Receitas: R$ 3.200,00"
```

---

## 4. Schema de Dados

O dashboard não tem tabela própria, consome dados de:
- `transactions` - transações do mês
- `categories` - nomes e ícones
- `budgets` - orçamentos configurados

### Query Agregada: Resumo do Mês
```sql
-- Executar no cliente com TanStack Query
SELECT
  type,
  SUM(amount) as total
FROM transactions
WHERE user_id = $1
  AND date >= date_trunc('month', CURRENT_DATE)
  AND date < date_trunc('month', CURRENT_DATE) + INTERVAL '1 month'
GROUP BY type
```

### Query: Gastos por Categoria
```sql
SELECT
  c.id,
  c.name,
  c.icon,
  c.color,
  SUM(t.amount) as total,
  ROUND(SUM(t.amount) * 100.0 / (
    SELECT SUM(amount) FROM transactions
    WHERE user_id = $1
      AND type = 'expense'
      AND date >= date_trunc('month', CURRENT_DATE)
      AND date < date_trunc('month', CURRENT_DATE) + INTERVAL '1 month'
  ), 2) as percentage
FROM transactions t
JOIN categories c ON t.category_id = c.id
WHERE t.user_id = $1
  AND t.type = 'expense'
  AND t.date >= date_trunc('month', CURRENT_DATE)
  AND t.date < date_trunc('month', CURRENT_DATE) + INTERVAL '1 month'
GROUP BY c.id, c.name, c.icon, c.color
ORDER BY total DESC
```

### Query: Comparativo 6 Meses
```sql
SELECT
  date_trunc('month', date) as month,
  type,
  SUM(amount) as total
FROM transactions
WHERE user_id = $1
  AND date >= date_trunc('month', CURRENT_DATE) - INTERVAL '5 months'
GROUP BY 1, 2
ORDER BY 1, 2
```

---

## 5. Componentes React

### 5.1 Página Dashboard
**Arquivo:** `app/(app)/dashboard/page.tsx`

```typescript
'use client'

import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useDashboard } from '@/lib/hooks/useDashboard'
import { useUser } from '@/lib/hooks/useUser'
import { formatCurrency } from '@/lib/utils/currency'
import { PieChart } from '@/components/charts/PieChart'
import { LineChart } from '@/components/charts/LineChart'
import { RecentTransactions } from '@/components/dashboard/RecentTransactions'
import { BudgetProgress } from '@/components/dashboard/BudgetProgress'
import { DashboardSkeleton } from '@/components/dashboard/DashboardSkeleton'

export default function DashboardPage() {
  const { data: user } = useUser()
  const { data, isLoading, error } = useDashboard()

  if (isLoading) return <DashboardSkeleton />
  if (error) return <DashboardError />
  if (!data) return null

  const { summary, expensesByCategory, recentTransactions, budgets, monthlyComparison } = data

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Bom dia'
    if (hour < 18) return 'Boa tarde'
    return 'Boa noite'
  }

  const firstName = user?.email?.split('@')[0] || 'Usuário'

  return (
    <div className="flex flex-col pb-20">
      {/* Header */}
      <div className="p-4 border-b">
        <h1 className="text-2xl font-bold">
          {getGreeting()}, {firstName}
        </h1>
        <p className="text-sm text-muted-foreground capitalize">
          {format(new Date(), 'MMMM yyyy', { locale: ptBR })}
        </p>
      </div>

      <div className="p-4 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-3">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <p className="text-xs text-muted-foreground">Receitas</p>
              </div>
              <p className="text-lg font-bold text-green-600">
                {formatCurrency(summary.totalIncome)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <TrendingDown className="h-4 w-4 text-red-500" />
                <p className="text-xs text-muted-foreground">Despesas</p>
              </div>
              <p className="text-lg font-bold text-red-500">
                {formatCurrency(summary.totalExpenses)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <Wallet className="h-4 w-4" />
                <p className="text-xs text-muted-foreground">Saldo</p>
              </div>
              <p className={`text-lg font-bold ${
                summary.balance >= 0 ? 'text-green-600' : 'text-red-500'
              }`}>
                {formatCurrency(summary.balance)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Expenses by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Gastos por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            {expensesByCategory.length > 0 ? (
              <PieChart data={expensesByCategory} />
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground">Nenhum gasto este mês</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Budgets */}
        {budgets && budgets.length > 0 && (
          <BudgetProgress budgets={budgets} />
        )}

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Últimas Transações</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentTransactions transactions={recentTransactions} />
          </CardContent>
        </Card>

        {/* Monthly Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Comparativo Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart data={monthlyComparison} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
```

---

### 5.2 Gráfico de Pizza
**Arquivo:** `components/charts/PieChart.tsx`

```typescript
'use client'

import { PieChart as RechartsP pie, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { formatCurrency } from '@/lib/utils/currency'
import type { Category } from '@/lib/types'

interface PieChartData {
  category: Category
  total: number
  percentage: number
}

interface PieChartProps {
  data: PieChartData[]
}

const COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
  '#FFEAA7', '#DFE6E9', '#74B9FF', '#A29BFE'
]

export function PieChart({ data }: PieChartProps) {
  const chartData = data.map((item, index) => ({
    name: item.category.name,
    value: item.total,
    percentage: item.percentage,
    color: item.category.color || COLORS[index % COLORS.length],
  }))

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-popover border rounded-lg p-3 shadow-lg">
          <p className="font-semibold">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            {formatCurrency(data.value)} ({data.percentage}%)
          </p>
        </div>
      )
    }
    return null
  }

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="grid grid-cols-2 gap-2 mt-4">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs truncate">{entry.value}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsPie>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ percentage }) => `${percentage}%`}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend content={<CustomLegend />} />
      </RechartsPie>
    </ResponsiveContainer>
  )
}
```

---

### 5.3 Gráfico de Linha
**Arquivo:** `components/charts/LineChart.tsx`

```typescript
'use client'

import {
  LineChart as RechartsLine,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { formatCurrency } from '@/lib/utils/currency'

interface MonthlyData {
  month: string
  income: number
  expenses: number
}

interface LineChartProps {
  data: MonthlyData[]
}

export function LineChart({ data }: LineChartProps) {
  const chartData = data.map(item => ({
    month: format(new Date(item.month), 'MMM', { locale: ptBR }),
    Receitas: item.income,
    Despesas: item.expenses,
  }))

  const formatYAxis = (value: number) => {
    if (value >= 1000) {
      return `R$${(value / 1000).toFixed(1)}k`
    }
    return `R$${value}`
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border rounded-lg p-3 shadow-lg">
          <p className="font-semibold mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <RechartsLine data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.1} />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 12 }}
          stroke="#888"
        />
        <YAxis
          tickFormatter={formatYAxis}
          tick={{ fontSize: 12 }}
          stroke="#888"
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line
          type="monotone"
          dataKey="Receitas"
          stroke="#00B894"
          strokeWidth={2}
          dot={{ fill: '#00B894', r: 4 }}
          activeDot={{ r: 6 }}
        />
        <Line
          type="monotone"
          dataKey="Despesas"
          stroke="#FF6B6B"
          strokeWidth={2}
          dot={{ fill: '#FF6B6B', r: 4 }}
          activeDot={{ r: 6 }}
        />
      </RechartsLine>
    </ResponsiveContainer>
  )
}
```

---

### 5.4 Últimas Transações
**Arquivo:** `components/dashboard/RecentTransactions.tsx`

```typescript
'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CategoryBadge } from '@/components/shared/CategoryBadge'
import { formatCurrency } from '@/lib/utils/currency'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { Transaction } from '@/lib/types'

interface RecentTransactionsProps {
  transactions: Transaction[]
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Nenhuma transação ainda</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {transactions.map(transaction => (
        <div key={transaction.id} className="flex items-center gap-3">
          <CategoryBadge category={transaction.category} />
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{transaction.description}</p>
            <p className="text-xs text-muted-foreground">
              {format(new Date(transaction.date), 'd MMM', { locale: ptBR })}
            </p>
          </div>
          <p className={`font-semibold ${
            transaction.type === 'expense' ? 'text-red-500' : 'text-green-600'
          }`}>
            {transaction.type === 'expense' ? '-' : '+'}
            {formatCurrency(transaction.amount)}
          </p>
        </div>
      ))}

      <Link href="/transacoes">
        <Button variant="ghost" className="w-full mt-2">
          Ver todas
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </Link>
    </div>
  )
}
```

---

### 5.5 Progresso de Orçamentos
**Arquivo:** `components/dashboard/BudgetProgress.tsx`

```typescript
'use client'

import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { CategoryBadge } from '@/components/shared/CategoryBadge'
import { formatCurrency } from '@/lib/utils/currency'
import type { Budget } from '@/lib/types'

interface BudgetWithSpent extends Budget {
  spent: number
  percentage: number
}

interface BudgetProgressProps {
  budgets: BudgetWithSpent[]
}

export function BudgetProgress({ budgets }: BudgetProgressProps) {
  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-red-500'
    if (percentage >= 80) return 'bg-yellow-500'
    return 'bg-green-600'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Orçamentos do Mês</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {budgets.map(budget => (
          <div key={budget.id}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <CategoryBadge category={budget.category} size="sm" />
                <span className="font-medium">{budget.category.name}</span>
                {budget.percentage >= 100 && (
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                )}
              </div>
              <span className="text-sm font-semibold">
                {budget.percentage.toFixed(0)}%
              </span>
            </div>
            <Progress
              value={Math.min(budget.percentage, 100)}
              className={getProgressColor(budget.percentage)}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {formatCurrency(budget.spent)} de {formatCurrency(budget.amount)}
            </p>
          </div>
        ))}

        <Link href="/metas">
          <Button variant="outline" className="w-full mt-2">
            Gerenciar orçamentos
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
```

---

## 6. Hooks

### Hook: `useDashboard`
**Arquivo:** `lib/hooks/useDashboard.ts`

```typescript
'use client'

import { useQuery } from '@tanstack/react-query'
import { startOfMonth, endOfMonth, subMonths, format } from 'date-fns'
import { createClient } from '@/lib/supabase/client'
import { useUser } from './useUser'
import type { Transaction, Category, Budget } from '@/lib/types'

interface DashboardData {
  summary: {
    totalIncome: number
    totalExpenses: number
    balance: number
  }
  expensesByCategory: Array<{
    category: Category
    total: number
    percentage: number
  }>
  recentTransactions: Transaction[]
  budgets: Array<Budget & { spent: number; percentage: number }>
  monthlyComparison: Array<{
    month: string
    income: number
    expenses: number
  }>
}

export function useDashboard() {
  const { data: user } = useUser()
  const supabase = createClient()

  return useQuery({
    queryKey: ['dashboard', user?.id],
    queryFn: async (): Promise<DashboardData> => {
      if (!user) throw new Error('User not authenticated')

      const currentMonth = startOfMonth(new Date())
      const monthStart = format(currentMonth, 'yyyy-MM-dd')
      const monthEnd = format(endOfMonth(currentMonth), 'yyyy-MM-dd')

      // Buscar transações do mês
      const { data: transactions, error: transError } = await supabase
        .from('transactions')
        .select('*, category:categories(*)')
        .eq('user_id', user.id)
        .gte('date', monthStart)
        .lte('date', monthEnd)
        .order('date', { ascending: false })

      if (transError) throw transError

      // Calcular resumo
      const totalIncome = transactions
        ?.filter(t => t.type === 'income')
        .reduce((sum, t) => sum + Number(t.amount), 0) || 0

      const totalExpenses = transactions
        ?.filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Number(t.amount), 0) || 0

      // Agrupar despesas por categoria
      const expensesByCategory = Object.values(
        transactions
          ?.filter(t => t.type === 'expense')
          .reduce((acc, t) => {
            const catId = t.category_id
            if (!acc[catId]) {
              acc[catId] = {
                category: t.category,
                total: 0,
                percentage: 0,
              }
            }
            acc[catId].total += Number(t.amount)
            return acc
          }, {} as Record<string, any>)
      ).map(item => ({
        ...item,
        percentage: totalExpenses > 0
          ? Math.round((item.total / totalExpenses) * 100)
          : 0,
      }))

      // Buscar últimas 5 transações
      const recentTransactions = (transactions || []).slice(0, 5)

      // Buscar orçamentos do mês
      const { data: budgets } = await supabase
        .from('budgets')
        .select('*, category:categories(*)')
        .eq('user_id', user.id)
        .eq('month', monthStart)

      // Calcular gasto por orçamento
      const budgetsWithSpent = (budgets || []).map(budget => {
        const spent = transactions
          ?.filter(t => t.type === 'expense' && t.category_id === budget.category_id)
          .reduce((sum, t) => sum + Number(t.amount), 0) || 0

        return {
          ...budget,
          spent,
          percentage: (spent / Number(budget.amount)) * 100,
        }
      })

      // Buscar dados dos últimos 6 meses
      const sixMonthsAgo = subMonths(currentMonth, 5)
      const { data: historicalData } = await supabase
        .from('transactions')
        .select('date, type, amount')
        .eq('user_id', user.id)
        .gte('date', format(sixMonthsAgo, 'yyyy-MM-dd'))
        .lte('date', monthEnd)

      // Agrupar por mês
      const monthlyComparison = Array.from({ length: 6 }, (_, i) => {
        const month = subMonths(currentMonth, 5 - i)
        const monthStr = format(month, 'yyyy-MM')
        
        const monthData = historicalData?.filter(t => 
          t.date.startsWith(monthStr)
        ) || []

        return {
          month: format(month, 'yyyy-MM-01'),
          income: monthData
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + Number(t.amount), 0),
          expenses: monthData
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + Number(t.amount), 0),
        }
      })

      return {
        summary: {
          totalIncome,
          totalExpenses,
          balance: totalIncome - totalExpenses,
        },
        expensesByCategory,
        recentTransactions,
        budgets: budgetsWithSpent,
        monthlyComparison,
      }
    },
    enabled: !!user,
    staleTime: 1000 * 60, // 1 minuto
  })
}
```

---

## 7. Estados de UI

### Loading State
```typescript
function DashboardSkeleton() {
  return (
    <div className="p-4 space-y-6">
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
      <div className="h-80 bg-muted animate-pulse rounded-lg" />
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    </div>
  )
}
```

### Error State
```typescript
function DashboardError() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
      <p className="text-muted-foreground mb-4">Erro ao carregar dashboard</p>
      <Button onClick={() => window.location.reload()}>
        Recarregar
      </Button>
    </div>
  )
}
```

---

## 8. Testes Sugeridos

### Teste: Cálculo de resumo
```typescript
test('Calcular resumo corretamente', () => {
  const transactions = [
    { type: 'income', amount: 3000 },
    { type: 'income', amount: 500 },
    { type: 'expense', amount: 1500 },
    { type: 'expense', amount: 800 },
  ]

  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const expenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  expect(income).toBe(3500)
  expect(expenses).toBe(2300)
  expect(income - expenses).toBe(1200)
})
```

### Teste E2E: Dashboard carrega
```typescript
test('Dashboard exibe resumo', async ({ page }) => {
  await page.goto('/dashboard')

  await expect(page.locator('text=Receitas')).toBeVisible()
  await expect(page.locator('text=Despesas')).toBeVisible()
  await expect(page.locator('text=Saldo')).toBeVisible()
  await expect(page.locator('text=Gastos por Categoria')).toBeVisible()
})
```

---

## 9. Links para Tasks

- **TASK-011:** Hook `useDashboard`
- **TASK-012:** Componente PieChart
- **TASK-013:** Página Dashboard
- **TASK-014:** Comparativo mensal (LineChart)

---

**Última atualização:** Março 2026
