import { DollarSign, TrendingDown, TrendingUp } from 'lucide-react'

import { formatCurrencyBRL } from '@/lib/formatters'
import { cn } from '@/lib/utils'

type SummaryCardsProps = {
  income: number
  expense: number
  balance: number
}

export function SummaryCards({ income, expense, balance }: SummaryCardsProps) {
  return (
    <section className="grid grid-cols-3 gap-3" aria-label="Resumo mensal">
      <article className="rounded-2xl bg-emerald-50 p-4">
        <TrendingUp className="h-5 w-5 text-emerald-600" />
        <p className="mt-2 text-xs font-medium text-emerald-700">Receitas</p>
        <p className="mt-1 text-sm font-semibold text-emerald-900">{formatCurrencyBRL(income)}</p>
      </article>

      <article className="rounded-2xl bg-rose-50 p-4">
        <TrendingDown className="h-5 w-5 text-rose-600" />
        <p className="mt-2 text-xs font-medium text-rose-700">Despesas</p>
        <p className="mt-1 text-sm font-semibold text-rose-900">{formatCurrencyBRL(expense)}</p>
      </article>

      <article className="rounded-2xl bg-slate-100 p-4">
        <DollarSign
          className={cn('h-5 w-5', balance >= 0 ? 'text-emerald-600' : 'text-rose-600')}
        />
        <p className="mt-2 text-xs font-medium text-slate-700">Saldo</p>
        <p
          className={cn(
            'mt-1 text-sm font-semibold',
            balance >= 0 ? 'text-emerald-700' : 'text-rose-700'
          )}
        >
          {formatCurrencyBRL(balance)}
        </p>
      </article>
    </section>
  )
}
