'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { useCategories } from '@/lib/hooks/use-categories'
import type { Budget, BudgetInput } from '@/lib/types'

const budgetSchema = z.object({
  category_id: z.string().min(1, 'Selecione uma categoria de despesa.'),
  month: z
    .string()
    .regex(/^\d{4}-\d{2}$/, 'Use o formato AAAA-MM.'),
  limit_amount: z
    .string()
    .min(1, 'Informe o limite.')
    .refine((value) => !Number.isNaN(Number(value.replace(',', '.'))), 'Informe um valor valido.')
    .refine((value) => Number(value.replace(',', '.')) > 0, 'O limite deve ser maior que zero.')
})

type BudgetFormValues = z.infer<typeof budgetSchema>

type BudgetFormProps = {
  month: string
  mode: 'create' | 'edit'
  initialData?: Budget
  isSaving: boolean
  onCancel?: () => void
  onSubmit: (input: BudgetInput) => Promise<void>
}

export function BudgetForm({ month, mode, initialData, isSaving, onCancel, onSubmit }: BudgetFormProps) {
  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      category_id: initialData?.category_id ?? '',
      month: initialData?.month.slice(0, 7) ?? month,
      limit_amount: initialData ? String(initialData.limit_amount) : ''
    }
  })

  useEffect(() => {
    form.reset({
      category_id: initialData?.category_id ?? '',
      month: initialData?.month.slice(0, 7) ?? month,
      limit_amount: initialData ? String(initialData.limit_amount) : ''
    })
  }, [form, initialData, month])

  const { categories, isLoading, isError, refetch } = useCategories({ kind: 'expense' })

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit({
      category_id: values.category_id,
      month: values.month,
      limit_amount: Number(values.limit_amount.replace(',', '.'))
    })
  })

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="budget-category">
          Categoria (despesa)
        </label>
        <select
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
          id="budget-category"
          {...form.register('category_id')}
        >
          <option value="">{isLoading ? 'Carregando...' : 'Selecione'}</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {isError ? (
          <button
            className="mt-1 text-xs font-medium text-slate-700 underline"
            onClick={() => {
              void refetch()
            }}
            type="button"
          >
            Tentar novamente
          </button>
        ) : null}
        {form.formState.errors.category_id ? (
          <p className="mt-1 text-xs text-rose-600">{form.formState.errors.category_id.message}</p>
        ) : null}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="budget-month">
            Mês
          </label>
          <input
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            id="budget-month"
            type="month"
            {...form.register('month')}
          />
          {form.formState.errors.month ? (
            <p className="mt-1 text-xs text-rose-600">{form.formState.errors.month.message}</p>
          ) : null}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="budget-limit">
            Limite
          </label>
          <input
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            id="budget-limit"
            inputMode="decimal"
            placeholder="0,00"
            type="text"
            {...form.register('limit_amount')}
          />
          {form.formState.errors.limit_amount ? (
            <p className="mt-1 text-xs text-rose-600">{form.formState.errors.limit_amount.message}</p>
          ) : null}
        </div>
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
          {isSaving ? 'Salvando...' : mode === 'create' ? 'Criar orçamento' : 'Salvar orçamento'}
        </button>
      </div>
    </form>
  )
}
