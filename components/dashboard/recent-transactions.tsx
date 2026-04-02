import { formatCurrencyBRL, formatDateBR } from '@/lib/formatters'
import type { Transaction } from '@/lib/types'

type RecentTransactionsProps = {
  transactions: Transaction[]
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  if (transactions.length === 0) {
    return <p className="text-sm text-slate-600">Sem transações no mês selecionado.</p>
  }

  return (
    <ul className="space-y-2" aria-label="Últimas transações">
      {transactions.map((transaction) => (
        <li key={transaction.id} className="flex items-center justify-between rounded-xl border border-slate-200 p-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-slate-900">{transaction.description}</p>
            <p className="text-xs text-slate-600">
              {transaction.category?.name ?? 'Sem categoria'} · {formatDateBR(transaction.occurred_on)}
            </p>
          </div>
          <p
            className={transaction.type === 'income' ? 'text-sm font-semibold text-emerald-700' : 'text-sm font-semibold text-rose-700'}
          >
            {transaction.type === 'income' ? '+' : '-'} {formatCurrencyBRL(Number(transaction.amount))}
          </p>
        </li>
      ))}
    </ul>
  )
}
