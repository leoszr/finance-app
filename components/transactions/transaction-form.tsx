'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { CreateCategoryForm } from '@/components/categories/create-category-form'
import { useCategories } from '@/lib/hooks/use-categories'
import type { Transaction, TransactionInput, TransactionType } from '@/lib/types'

const transactionSchema = z.object({
  type: z.enum(['income', 'expense'], {
    required_error: 'Selecione o tipo da transacao.'
  }),
  category_id: z.string().min(1, 'Selecione uma categoria.'),
  description: z
    .string()
    .min(3, 'Descricao deve ter ao menos 3 caracteres.')
    .max(120, 'Descricao deve ter no maximo 120 caracteres.'),
  amount: z
    .string()
    .min(1, 'Informe o valor.')
    .refine((value) => !Number.isNaN(Number(value.replace(',', '.'))), 'Informe um valor valido.')
    .refine((value) => Number(value.replace(',', '.')) > 0, 'O valor deve ser maior que zero.'),
  occurred_on: z.string().min(1, 'Selecione a data da transacao.')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Use o formato AAAA-MM-DD.')
    .refine((value) => !Number.isNaN(new Date(`${value}T00:00:00`).getTime()), 'Informe uma data valida.')
})

type TransactionFormValues = z.infer<typeof transactionSchema>

type TransactionFormProps = {
  mode: 'create' | 'edit'
  initialData?: Transaction
  isSaving: boolean
  onCancel?: () => void
  onSubmit: (input: TransactionInput) => Promise<void>
}

function mapTypeLabel(type: TransactionType) {
  return type === 'income' ? 'Receita' : 'Despesa'
}

export function TransactionForm({
  mode,
  initialData,
  isSaving,
  onCancel,
  onSubmit
}: TransactionFormProps) {
  const defaultType = initialData?.type ?? 'expense'
  const [showCreateCategory, setShowCreateCategory] = useState(false)

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: defaultType,
      category_id: initialData?.category_id ?? '',
      description: initialData?.description ?? '',
      amount: initialData ? String(initialData.amount) : '',
      occurred_on: initialData?.occurred_on ?? new Date().toISOString().slice(0, 10)
    }
  })

  useEffect(() => {
    form.reset({
      type: initialData?.type ?? 'expense',
      category_id: initialData?.category_id ?? '',
      description: initialData?.description ?? '',
      amount: initialData ? String(initialData.amount) : '',
      occurred_on: initialData?.occurred_on ?? new Date().toISOString().slice(0, 10)
    })
  }, [form, initialData, mode])

  const selectedType = form.watch('type')
  const {
    categories,
    isLoading: isLoadingCategories,
    isError: isCategoriesError,
    error: categoriesError,
    refetch: refetchCategories
  } = useCategories({ kind: selectedType })
  const typeOptions = useMemo(
    () => [
      { value: 'income' as const, label: mapTypeLabel('income') },
      { value: 'expense' as const, label: mapTypeLabel('expense') }
    ],
    []
  )

  const handleSubmit = form.handleSubmit(async (values) => {
    const parsedAmount = Number(values.amount.replace(',', '.'))

    await onSubmit({
      type: values.type,
      category_id: values.category_id,
      description: values.description.trim(),
      amount: parsedAmount,
      occurred_on: values.occurred_on
    })

    if (mode === 'create') {
      form.reset({
        type: values.type,
        category_id: '',
        description: '',
        amount: '',
        occurred_on: values.occurred_on
      })
    }
  })

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="type">
          Tipo
        </label>
        <select
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
          id="type"
          {...form.register('type')}
        >
          {typeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="category_id">
          Categoria
        </label>
        <select
          aria-invalid={Boolean(form.formState.errors.category_id)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
          disabled={isLoadingCategories || isCategoriesError}
          id="category_id"
          {...form.register('category_id')}
        >
          <option value="">
            {isLoadingCategories ? 'Carregando categorias...' : isCategoriesError ? 'Falha ao carregar' : 'Selecione'}
          </option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <div className="mt-1 flex items-center justify-between">
          <p className="text-xs text-slate-500">Categorias de {mapTypeLabel(selectedType)}</p>
          <button
            className="text-xs font-medium text-emerald-700 underline"
            onClick={() => setShowCreateCategory((current) => !current)}
            type="button"
          >
            {showCreateCategory ? 'Fechar' : 'Nova categoria'}
          </button>
        </div>
        {isCategoriesError ? (
          <div className="mt-1 flex items-center gap-2" role="alert">
            <p className="text-xs text-red-600">
              {categoriesError instanceof Error ? categoriesError.message : 'Nao foi possivel carregar as categorias.'}
            </p>
            <button
              className="text-xs font-medium text-slate-700 underline"
              onClick={() => {
                void refetchCategories()
              }}
              type="button"
            >
              Tentar novamente
            </button>
          </div>
        ) : null}
        {form.formState.errors.category_id ? (
          <p className="mt-1 text-xs text-red-600">{form.formState.errors.category_id.message}</p>
        ) : null}

        {showCreateCategory ? (
          <CreateCategoryForm
            defaultKind={selectedType}
            onCreated={(category) => {
              form.setValue('category_id', category.id, { shouldValidate: true })
              setShowCreateCategory(false)
            }}
          />
        ) : null}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="description">
          Descricao
        </label>
        <input
          aria-invalid={Boolean(form.formState.errors.description)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
          id="description"
          placeholder="Ex: Mercado"
          type="text"
          {...form.register('description')}
        />
        {form.formState.errors.description ? (
          <p className="mt-1 text-xs text-red-600">{form.formState.errors.description.message}</p>
        ) : null}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="amount">
            Valor
          </label>
          <input
            aria-invalid={Boolean(form.formState.errors.amount)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            id="amount"
            inputMode="decimal"
            placeholder="0,00"
            type="text"
            {...form.register('amount')}
          />
          {form.formState.errors.amount ? (
            <p className="mt-1 text-xs text-red-600">{form.formState.errors.amount.message}</p>
          ) : null}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="occurred_on">
            Data
          </label>
          <input
            aria-invalid={Boolean(form.formState.errors.occurred_on)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            id="occurred_on"
            type="date"
            {...form.register('occurred_on')}
          />
          {form.formState.errors.occurred_on ? (
            <p className="mt-1 text-xs text-red-600">{form.formState.errors.occurred_on.message}</p>
          ) : null}
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 pt-2">
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
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSaving}
          type="submit"
        >
          {isSaving ? 'Salvando...' : mode === 'create' ? 'Adicionar' : 'Salvar'}
        </button>
      </div>
    </form>
  )
}
