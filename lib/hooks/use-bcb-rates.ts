'use client'

import { useQuery } from '@tanstack/react-query'

import type { CalculatorRateSource } from '@/lib/investments'

type BcbIndicator = Exclude<CalculatorRateSource, 'manual'>

export type BcbRate = {
  indicator: BcbIndicator
  label: string
  code: number
  value: number
  unit: string
  period: 'daily' | 'monthly' | 'annual'
  annualRate: number
  date: string
}

const BCB_RATES_KEY = 'bcb-rates'
const INDICATORS: BcbIndicator[] = ['selic', 'cdi', 'ipca']

async function fetchIndicator(indicator: BcbIndicator): Promise<BcbRate> {
  const response = await fetch(`/api/bcb-proxy?indicator=${indicator}`)
  const payload = (await response.json()) as BcbRate | { error: string }

  if (!response.ok || 'error' in payload) {
    throw new Error('error' in payload ? payload.error : `Falha ao carregar ${indicator.toUpperCase()}.`)
  }

  return payload
}

async function fetchRates(): Promise<Record<BcbIndicator, BcbRate>> {
  const results = await Promise.all(INDICATORS.map((indicator) => fetchIndicator(indicator)))

  return results.reduce<Record<BcbIndicator, BcbRate>>((acc, item) => {
    acc[item.indicator] = item
    return acc
  }, {} as Record<BcbIndicator, BcbRate>)
}

export function useBcbRates() {
  const query = useQuery({
    queryKey: [BCB_RATES_KEY],
    queryFn: fetchRates,
    staleTime: 60 * 60 * 1000
  })

  return {
    rates: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch
  }
}
