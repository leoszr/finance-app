import { formatCurrencyBRL } from '@/lib/formatters'

type TransactionsSummaryProps = {
  income: number
  expense: number
  balance: number
}

export function TransactionsSummary({ income, expense, balance }: TransactionsSummaryProps) {
  return (
    <section className="grid grid-cols-3 gap-2">
      <article className="rounded-xl border border-emerald-200 bg-emerald-50 p-3">
        <p className="text-xs text-emerald-700">Receitas</p>
        <p className="mt-1 text-sm font-semibold text-emerald-900">{formatCurrencyBRL(income)}</p>
      </article>

      <article className="rounded-xl border border-rose-200 bg-rose-50 p-3">
        <p className="text-xs text-rose-700">Despesas</p>
        <p className="mt-1 text-sm font-semibold text-rose-900">{formatCurrencyBRL(expense)}</p>
      </article>

      <article className="rounded-xl border border-slate-200 bg-slate-100 p-3">
        <p className="text-xs text-slate-600">Saldo</p>
        <p className="mt-1 text-sm font-semibold text-slate-900">{formatCurrencyBRL(balance)}</p>
      </article>
    </section>
  )
}
