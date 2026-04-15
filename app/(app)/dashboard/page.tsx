'use client'

import Link from 'next/link'

import { ExpensesPieChart } from '@/components/charts/expenses-pie-chart'
import { RecentTransactions } from '@/components/dashboard/recent-transactions'
import { ErrorMessage } from '@/components/shared/error-message'
import { Skeleton } from '@/components/shared/skeleton'
import { SummaryCards } from '@/components/dashboard/summary-cards'
import { useDashboard } from '@/lib/hooks/use-dashboard'

export default function DashboardPage() {
  const { summary, expensesByCategory, recentTransactions, isLoading, isError, error, refetch } = useDashboard()

  if (isLoading) {
    return <DashboardLoading />
  }

  if (isError) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-md flex-col gap-4 px-5 py-6">
        <ErrorMessage
          message={error instanceof Error ? error.message : 'Falha ao carregar dashboard.'}
          onRetry={() => {
            void refetch()
          }}
        />
      </main>
    )
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col gap-4 px-5 py-6">
      <header>
        <h1 className="text-xl font-semibold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-600">Visão geral do mês atual.</p>
      </header>

      <SummaryCards income={summary.income} expense={summary.expense} balance={summary.balance} />

      <section className="glass-card rounded-2xl p-4">
        <h2 className="text-sm font-semibold text-slate-900">Gastos por categoria</h2>
        <div className="mt-3">
          <ExpensesPieChart data={expensesByCategory} />
        </div>
      </section>

      <section className="glass-card rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900">Últimas transações</h2>
          <Link href="/transacoes" className="text-xs font-medium text-emerald-700">
            Ver todas
          </Link>
        </div>
        <div className="mt-3">
          <RecentTransactions transactions={recentTransactions} />
        </div>
      </section>
    </main>
  )
}

function DashboardLoading() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md animate-pulse flex-col gap-4 px-5 py-6">
      <Skeleton className="h-8 w-40 rounded-lg" />
      <div className="grid grid-cols-3 gap-3">
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-24 rounded-2xl" />
      </div>
      <Skeleton className="h-80 rounded-2xl" />
      <Skeleton className="h-64 rounded-2xl" />
    </main>
  )
}
