import { formatCurrencyBRL, formatDateBR } from '@/lib/formatters'
import { getInvestmentRateTypeLabel, getInvestmentTypeLabel } from '@/lib/investments'
import type { Investment } from '@/lib/types'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'

type InvestmentsListProps = {
  investments: Investment[]
  isArchiving: boolean
  onEdit: (item: Investment) => void
  onArchive: (item: Investment) => void
}

export function InvestmentsList({ investments, isArchiving, onEdit, onArchive }: InvestmentsListProps) {
  if (investments.length === 0) {
    return (
      <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center">
        <p className="text-sm text-slate-600">Nenhum investimento ativo cadastrado.</p>
      </section>
    )
  }

  return (
    <section className="space-y-3">
      {investments.map((item) => (
        <article className="rounded-2xl border border-slate-200 bg-white p-4" key={item.id}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">{item.name}</p>
              <p className="mt-1 text-xs text-slate-600">
                {getInvestmentTypeLabel(item.type)} • {item.institution}
              </p>
            </div>

            <p className="text-sm font-semibold text-emerald-700">{formatCurrencyBRL(Number(item.invested_amount))}</p>
          </div>

          <dl className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600">
            <div>
              <dt className="font-medium text-slate-700">Taxa</dt>
              <dd>
                {Number(item.rate_value).toFixed(2)} • {getInvestmentRateTypeLabel(item.rate_type)}
              </dd>
            </div>
            <div>
              <dt className="font-medium text-slate-700">Inicio</dt>
              <dd>{formatDateBR(item.start_date)}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-700">Vencimento</dt>
              <dd>{item.maturity_date ? formatDateBR(item.maturity_date) : 'Sem vencimento'}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-700">Status</dt>
              <dd>{item.active ? 'Ativo' : 'Arquivado'}</dd>
            </div>
          </dl>

          {item.notes ? <p className="mt-3 text-xs text-slate-600">{item.notes}</p> : null}

          <div className="mt-4 flex justify-end gap-2">
            <button
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700"
              disabled={isArchiving}
              onClick={() => onEdit(item)}
              type="button"
            >
              Editar
            </button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  className="rounded-lg border border-rose-300 bg-white px-3 py-1.5 text-xs font-medium text-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={isArchiving}
                  type="button"
                >
                  Arquivar
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Arquivar investimento</AlertDialogTitle>
                  <AlertDialogDescription>
                    O investimento será marcado como inativo e sairá do portfólio consolidado.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isArchiving}>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    disabled={isArchiving}
                    onClick={() => {
                      onArchive(item)
                    }}
                  >
                    Confirmar arquivamento
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </article>
      ))}
    </section>
  )
}
