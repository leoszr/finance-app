'use client'

import { useMemo } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { createClient } from '@/lib/supabase/client'
import type { Investment, InvestmentInput, InvestmentType } from '@/lib/types'

const INVESTMENTS_KEY = 'investments'

export type InvestmentPortfolioItem = {
  type: InvestmentType
  total: number
  count: number
  percentage: number
}

export type InvestmentPortfolioSummary = {
  totalInvested: number
  totalCount: number
  byType: InvestmentPortfolioItem[]
}

const INVESTMENT_TYPE_ORDER: InvestmentType[] = [
  'cdb',
  'tesouro_direto',
  'lci',
  'lca',
  'poupanca',
  'outros_renda_fixa'
]

function buildPortfolioSummary(investments: Investment[]): InvestmentPortfolioSummary {
  const totalInvested = investments.reduce((total, item) => total + Number(item.invested_amount), 0)

  const grouped = investments.reduce<Map<InvestmentType, { total: number; count: number }>>((acc, item) => {
    const current = acc.get(item.type) ?? { total: 0, count: 0 }

    acc.set(item.type, {
      total: current.total + Number(item.invested_amount),
      count: current.count + 1
    })

    return acc
  }, new Map())

  const byType = INVESTMENT_TYPE_ORDER
    .map<InvestmentPortfolioItem | null>((type) => {
      const current = grouped.get(type)

      if (!current) {
        return null
      }

      return {
        type,
        total: current.total,
        count: current.count,
        percentage: totalInvested > 0 ? (current.total / totalInvested) * 100 : 0
      }
    })
    .filter((item): item is InvestmentPortfolioItem => item !== null)

  return {
    totalInvested,
    totalCount: investments.length,
    byType
  }
}

async function fetchInvestments(): Promise<Investment[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('investments')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error('Nao foi possivel carregar os investimentos.')
  }

  return (data as Investment[] | null) ?? []
}

export function useInvestments() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: [INVESTMENTS_KEY],
    queryFn: fetchInvestments
  })

  const summary = useMemo<InvestmentPortfolioSummary>(() => {
    return buildPortfolioSummary(query.data ?? [])
  }, [query.data])

  const invalidate = async () => {
    await queryClient.invalidateQueries({ queryKey: [INVESTMENTS_KEY] })
  }

  const createInvestment = useMutation({
    mutationFn: async (input: InvestmentInput) => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('investments')
        .insert({
          name: input.name,
          type: input.type,
          institution: input.institution,
          invested_amount: input.invested_amount,
          rate_type: input.rate_type,
          rate_value: input.rate_value,
          start_date: input.start_date,
          maturity_date: input.maturity_date ?? null,
          notes: input.notes ?? null,
          active: input.active ?? true
        })
        .select('*')
        .single()

      if (error) {
        throw new Error('Nao foi possivel criar o investimento.')
      }

      return data as Investment
    },
    onSuccess: async () => {
      await invalidate()
    }
  })

  const updateInvestment = useMutation({
    mutationFn: async (payload: { id: string; input: InvestmentInput }) => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('investments')
        .update({
          name: payload.input.name,
          type: payload.input.type,
          institution: payload.input.institution,
          invested_amount: payload.input.invested_amount,
          rate_type: payload.input.rate_type,
          rate_value: payload.input.rate_value,
          start_date: payload.input.start_date,
          maturity_date: payload.input.maturity_date ?? null,
          notes: payload.input.notes ?? null,
          active: payload.input.active ?? true
        })
        .eq('id', payload.id)
        .select('*')
        .single()

      if (error) {
        throw new Error('Nao foi possivel atualizar o investimento.')
      }

      return data as Investment
    },
    onSuccess: async () => {
      await invalidate()
    }
  })

  const archiveInvestment = useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient()
      const { error } = await supabase.from('investments').update({ active: false }).eq('id', id)

      if (error) {
        throw new Error('Nao foi possivel arquivar o investimento.')
      }
    },
    onSuccess: async () => {
      await invalidate()
    }
  })

  return {
    investments: query.data ?? [],
    summary,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    createInvestment,
    updateInvestment,
    archiveInvestment
  }
}
