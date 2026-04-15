'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { getInvestmentRateTypeLabel, getInvestmentTypeLabel } from '@/lib/investments'
import type { Investment, InvestmentInput, InvestmentRateType, InvestmentType } from '@/lib/types'

const investmentSchema = z
  .object({
    name: z.string().min(2, 'Nome deve ter ao menos 2 caracteres.').max(80, 'Nome muito longo.'),
    type: z.enum(['cdb', 'tesouro_direto', 'lci', 'lca', 'poupanca', 'outros_renda_fixa']),
    institution: z.string().min(2, 'Instituicao deve ter ao menos 2 caracteres.').max(80, 'Instituicao muito longa.'),
    invested_amount: z
      .string()
      .min(1, 'Informe o valor investido.')
      .refine((value) => !Number.isNaN(Number(value.replace(',', '.'))), 'Informe um valor valido.')
      .refine((value) => Number(value.replace(',', '.')) > 0, 'O valor deve ser maior que zero.'),
    rate_type: z.enum(['fixed', 'cdi_pct', 'selic_pct', 'ipca_plus']),
    rate_value: z
      .string()
      .min(1, 'Informe a taxa.')
      .refine((value) => !Number.isNaN(Number(value.replace(',', '.'))), 'Informe uma taxa valida.')
      .refine((value) => Number(value.replace(',', '.')) > 0, 'A taxa deve ser maior que zero.'),
    start_date: z
      .string()
      .min(1, 'Informe a data de inicio.')
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Use o formato AAAA-MM-DD.'),
    maturity_date: z.string().optional().or(z.literal('')),
    notes: z.string().max(240, 'Observacao deve ter no maximo 240 caracteres.').optional().or(z.literal(''))
  })
  .superRefine((data, ctx) => {
    if (!data.maturity_date) {
      return
    }

    const start = new Date(`${data.start_date}T00:00:00`)
    const maturity = new Date(`${data.maturity_date}T00:00:00`)

    if (Number.isNaN(start.getTime()) || Number.isNaN(maturity.getTime()) || maturity <= start) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Vencimento deve ser maior que data de inicio.',
        path: ['maturity_date']
      })
    }
  })

type InvestmentFormValues = z.infer<typeof investmentSchema>

type InvestmentFormProps = {
  mode: 'create' | 'edit'
  initialData?: Investment
  isSaving: boolean
  onCancel?: () => void
  onSubmit: (input: InvestmentInput) => Promise<void>
}

const typeOptions: InvestmentType[] = ['cdb', 'tesouro_direto', 'lci', 'lca', 'poupanca', 'outros_renda_fixa']
const rateTypeOptions: InvestmentRateType[] = ['fixed', 'cdi_pct', 'selic_pct', 'ipca_plus']

export function InvestmentForm({ mode, initialData, isSaving, onCancel, onSubmit }: InvestmentFormProps) {
  const form = useForm<InvestmentFormValues>({
    resolver: zodResolver(investmentSchema),
    defaultValues: {
      name: initialData?.name ?? '',
      type: initialData?.type ?? 'cdb',
      institution: initialData?.institution ?? '',
      invested_amount: initialData ? String(initialData.invested_amount) : '',
      rate_type: initialData?.rate_type ?? 'fixed',
      rate_value: initialData ? String(initialData.rate_value) : '',
      start_date: initialData?.start_date ?? new Date().toISOString().slice(0, 10),
      maturity_date: initialData?.maturity_date ?? '',
      notes: initialData?.notes ?? ''
    }
  })

  useEffect(() => {
    form.reset({
      name: initialData?.name ?? '',
      type: initialData?.type ?? 'cdb',
      institution: initialData?.institution ?? '',
      invested_amount: initialData ? String(initialData.invested_amount) : '',
      rate_type: initialData?.rate_type ?? 'fixed',
      rate_value: initialData ? String(initialData.rate_value) : '',
      start_date: initialData?.start_date ?? new Date().toISOString().slice(0, 10),
      maturity_date: initialData?.maturity_date ?? '',
      notes: initialData?.notes ?? ''
    })
  }, [form, initialData])

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit({
      name: values.name.trim(),
      type: values.type,
      institution: values.institution.trim(),
      invested_amount: Number(values.invested_amount.replace(',', '.')),
      rate_type: values.rate_type,
      rate_value: Number(values.rate_value.replace(',', '.')),
      start_date: values.start_date,
      maturity_date: values.maturity_date || null,
      notes: values.notes?.trim() ? values.notes.trim() : null,
      active: true
    })

    if (mode === 'create') {
      form.reset({
        name: '',
        type: values.type,
        institution: values.institution,
        invested_amount: '',
        rate_type: values.rate_type,
        rate_value: values.rate_value,
        start_date: values.start_date,
        maturity_date: '',
        notes: ''
      })
    }
  })

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="investment-name">
          Nome do investimento
        </label>
        <input
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
          id="investment-name"
          placeholder="Ex: CDB liquidez diária"
          type="text"
          {...form.register('name')}
        />
        {form.formState.errors.name ? <p className="mt-1 text-xs text-rose-600">{form.formState.errors.name.message}</p> : null}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="investment-type">
            Tipo
          </label>
          <select
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            id="investment-type"
            {...form.register('type')}
          >
            {typeOptions.map((option) => (
              <option key={option} value={option}>
                {getInvestmentTypeLabel(option)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="investment-institution">
            Instituicao
          </label>
          <input
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            id="investment-institution"
            placeholder="Ex: Nubank"
            type="text"
            {...form.register('institution')}
          />
          {form.formState.errors.institution ? (
            <p className="mt-1 text-xs text-rose-600">{form.formState.errors.institution.message}</p>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="investment-amount">
            Valor investido
          </label>
          <input
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            id="investment-amount"
            inputMode="decimal"
            placeholder="0,00"
            type="text"
            {...form.register('invested_amount')}
          />
          {form.formState.errors.invested_amount ? (
            <p className="mt-1 text-xs text-rose-600">{form.formState.errors.invested_amount.message}</p>
          ) : null}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="investment-start-date">
            Data de inicio
          </label>
          <input
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            id="investment-start-date"
            type="date"
            {...form.register('start_date')}
          />
          {form.formState.errors.start_date ? (
            <p className="mt-1 text-xs text-rose-600">{form.formState.errors.start_date.message}</p>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="investment-rate-type">
            Tipo de taxa
          </label>
          <select
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            id="investment-rate-type"
            {...form.register('rate_type')}
          >
            {rateTypeOptions.map((option) => (
              <option key={option} value={option}>
                {getInvestmentRateTypeLabel(option)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="investment-rate-value">
            Taxa
          </label>
          <input
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            id="investment-rate-value"
            inputMode="decimal"
            placeholder="Ex: 110"
            type="text"
            {...form.register('rate_value')}
          />
          {form.formState.errors.rate_value ? (
            <p className="mt-1 text-xs text-rose-600">{form.formState.errors.rate_value.message}</p>
          ) : null}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="investment-maturity-date">
          Vencimento
        </label>
        <input
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
          id="investment-maturity-date"
          type="date"
          {...form.register('maturity_date')}
        />
        {form.formState.errors.maturity_date ? (
          <p className="mt-1 text-xs text-rose-600">{form.formState.errors.maturity_date.message}</p>
        ) : null}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="investment-notes">
          Observacoes
        </label>
        <textarea
          className="min-h-24 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
          id="investment-notes"
          placeholder="Ex: vencimento em 2028"
          {...form.register('notes')}
        />
        {form.formState.errors.notes ? <p className="mt-1 text-xs text-rose-600">{form.formState.errors.notes.message}</p> : null}
      </div>

      <div className="flex items-center justify-end gap-2">
        {onCancel ? (
          <button
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700"
            onClick={onCancel}
            type="button"
          >
            Cancelar
          </button>
        ) : null}
        <button
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          disabled={isSaving}
          type="submit"
        >
          {isSaving ? 'Salvando...' : mode === 'create' ? 'Adicionar investimento' : 'Salvar investimento'}
        </button>
      </div>
    </form>
  )
}
