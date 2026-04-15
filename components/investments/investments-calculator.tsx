'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { formatCurrencyBRL } from '@/lib/formatters'
import {
  calculateInvestmentProjection,
  getCalculatorRateSourceLabel,
  type CalculatorRateSource
} from '@/lib/investments'
import { useBcbRates } from '@/lib/hooks/use-bcb-rates'

const calculatorSchema = z.object({
  principal: z
    .string()
    .min(1, 'Informe valor inicial.')
    .refine((value) => !Number.isNaN(Number(value.replace(',', '.'))), 'Informe um valor valido.')
    .refine((value) => Number(value.replace(',', '.')) >= 0, 'Valor inicial nao pode ser negativo.'),
  monthlyContribution: z
    .string()
    .min(1, 'Informe aporte mensal.')
    .refine((value) => !Number.isNaN(Number(value.replace(',', '.'))), 'Informe um valor valido.')
    .refine((value) => Number(value.replace(',', '.')) >= 0, 'Aporte nao pode ser negativo.'),
  years: z
    .string()
    .min(1, 'Informe prazo em anos.')
    .refine((value) => !Number.isNaN(Number(value.replace(',', '.'))), 'Informe prazo valido.')
    .refine((value) => Number(value.replace(',', '.')) > 0, 'Prazo deve ser maior que zero.'),
  rateSource: z.enum(['manual', 'selic', 'cdi', 'ipca']),
  manualAnnualRate: z
    .string()
    .min(1, 'Informe taxa manual.')
    .refine((value) => !Number.isNaN(Number(value.replace(',', '.'))), 'Informe taxa valida.')
    .refine((value) => Number(value.replace(',', '.')) >= 0, 'Taxa nao pode ser negativa.')
})

type CalculatorFormValues = z.infer<typeof calculatorSchema>

export function InvestmentsCalculator() {
  const { rates, isLoading, isError, error, refetch } = useBcbRates()

  const form = useForm<CalculatorFormValues>({
    resolver: zodResolver(calculatorSchema),
    defaultValues: {
      principal: '1000',
      monthlyContribution: '500',
      years: '5',
      rateSource: 'manual',
      manualAnnualRate: '12'
    }
  })

  const rateSource = form.watch('rateSource')

  const selectedAnnualRate = useMemo(() => {
    if (rateSource === 'manual') {
      return Number((form.watch('manualAnnualRate') || '0').replace(',', '.'))
    }

    return rates?.[rateSource]?.annualRate ?? 0
  }, [form, rateSource, rates])

  const projection = useMemo(() => {
    const principal = Number((form.watch('principal') || '0').replace(',', '.'))
    const monthlyContribution = Number((form.watch('monthlyContribution') || '0').replace(',', '.'))
    const years = Number((form.watch('years') || '0').replace(',', '.'))

    if ([principal, monthlyContribution, years, selectedAnnualRate].some((value) => Number.isNaN(value))) {
      return null
    }

    return calculateInvestmentProjection({
      principal,
      monthlyContribution,
      years,
      annualRate: selectedAnnualRate
    })
  }, [form, selectedAnnualRate])

  const selectedBcbRate = rateSource === 'manual' ? null : rates?.[rateSource as Exclude<CalculatorRateSource, 'manual'>]

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4">
      <h2 className="text-sm font-semibold text-slate-900">Calculadora de investimentos</h2>
      <p className="mt-1 text-sm text-slate-600">Simule juros compostos com taxa manual ou indicador do BCB.</p>

      <form className="mt-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="calc-principal">
              Valor inicial
            </label>
            <input
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
              id="calc-principal"
              inputMode="decimal"
              type="text"
              {...form.register('principal')}
            />
            {form.formState.errors.principal ? <p className="mt-1 text-xs text-rose-600">{form.formState.errors.principal.message}</p> : null}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="calc-contribution">
              Aporte mensal
            </label>
            <input
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
              id="calc-contribution"
              inputMode="decimal"
              type="text"
              {...form.register('monthlyContribution')}
            />
            {form.formState.errors.monthlyContribution ? (
              <p className="mt-1 text-xs text-rose-600">{form.formState.errors.monthlyContribution.message}</p>
            ) : null}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="calc-years">
              Prazo (anos)
            </label>
            <input
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
              id="calc-years"
              inputMode="decimal"
              type="text"
              {...form.register('years')}
            />
            {form.formState.errors.years ? <p className="mt-1 text-xs text-rose-600">{form.formState.errors.years.message}</p> : null}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="calc-rate-source">
              Fonte da taxa
            </label>
            <select
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
              id="calc-rate-source"
              {...form.register('rateSource')}
            >
              {(['manual', 'selic', 'cdi', 'ipca'] as CalculatorRateSource[]).map((option) => (
                <option key={option} value={option}>
                  {getCalculatorRateSourceLabel(option)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="calc-rate-manual">
            Taxa anual manual (%)
          </label>
          <input
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            disabled={rateSource !== 'manual'}
            id="calc-rate-manual"
            inputMode="decimal"
            type="text"
            {...form.register('manualAnnualRate')}
          />
          {form.formState.errors.manualAnnualRate ? (
            <p className="mt-1 text-xs text-rose-600">{form.formState.errors.manualAnnualRate.message}</p>
          ) : null}
        </div>
      </form>

      <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-medium text-slate-900">Taxa usada na simulacao</p>
          <p className="text-sm font-semibold text-slate-900">{selectedAnnualRate.toFixed(2)}% a.a.</p>
        </div>

        {rateSource === 'manual' ? (
          <p className="mt-1 text-xs text-slate-600">Taxa definida manualmente.</p>
        ) : isLoading ? (
          <p className="mt-1 text-xs text-slate-600">Carregando indicador do BCB...</p>
        ) : isError ? (
          <div className="mt-2" role="alert">
            <p className="text-xs text-rose-700">{error instanceof Error ? error.message : 'Falha ao consultar o BCB.'}</p>
            <button
              className="mt-2 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700"
              onClick={() => {
                void refetch()
              }}
              type="button"
            >
              Tentar novamente
            </button>
          </div>
        ) : selectedBcbRate ? (
          <p className="mt-1 text-xs text-slate-600">
            {selectedBcbRate.label}: {selectedBcbRate.value.toFixed(4)} {selectedBcbRate.unit} em {selectedBcbRate.date}
          </p>
        ) : null}
      </div>

      {projection ? (
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <article className="rounded-xl border border-slate-200 p-3">
            <p className="text-xs text-slate-500">Total investido</p>
            <p className="mt-1 text-base font-semibold text-slate-900">{formatCurrencyBRL(projection.investedTotal)}</p>
          </article>
          <article className="rounded-xl border border-slate-200 p-3">
            <p className="text-xs text-slate-500">Rendimento</p>
            <p className="mt-1 text-base font-semibold text-emerald-700">{formatCurrencyBRL(projection.interestValue)}</p>
          </article>
          <article className="rounded-xl border border-slate-200 p-3">
            <p className="text-xs text-slate-500">Valor projetado</p>
            <p className="mt-1 text-base font-semibold text-slate-900">{formatCurrencyBRL(projection.grossValue)}</p>
          </article>
        </div>
      ) : null}
    </section>
  )
}
