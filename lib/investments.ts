import type { InvestmentRateType, InvestmentType } from '@/lib/types'

export type CalculatorRateSource = 'manual' | 'selic' | 'cdi' | 'ipca'

export type InvestmentProjectionInput = {
  principal: number
  monthlyContribution: number
  years: number
  annualRate: number
}

export type InvestmentProjectionResult = {
  investedTotal: number
  grossValue: number
  interestValue: number
  monthlyRate: number
}

const investmentTypeLabels: Record<InvestmentType, string> = {
  cdb: 'CDB',
  tesouro_direto: 'Tesouro Direto',
  lci: 'LCI',
  lca: 'LCA',
  poupanca: 'Poupanca',
  outros_renda_fixa: 'Outros renda fixa'
}

const investmentRateTypeLabels: Record<InvestmentRateType, string> = {
  fixed: 'Taxa fixa (% a.a.)',
  cdi_pct: '% do CDI',
  selic_pct: '% da Selic',
  ipca_plus: 'IPCA + spread (% a.a.)'
}

const calculatorRateSourceLabels: Record<CalculatorRateSource, string> = {
  manual: 'Taxa manual',
  selic: 'Selic',
  cdi: 'CDI',
  ipca: 'IPCA'
}

export function getInvestmentTypeLabel(type: InvestmentType) {
  return investmentTypeLabels[type]
}

export function getInvestmentRateTypeLabel(type: InvestmentRateType) {
  return investmentRateTypeLabels[type]
}

export function getCalculatorRateSourceLabel(source: CalculatorRateSource) {
  return calculatorRateSourceLabels[source]
}

export function annualRateToMonthlyRate(annualRate: number) {
  return Math.pow(1 + annualRate / 100, 1 / 12) - 1
}

export function calculateInvestmentProjection({
  principal,
  monthlyContribution,
  years,
  annualRate
}: InvestmentProjectionInput): InvestmentProjectionResult {
  const totalMonths = Math.max(0, Math.round(years * 12))
  const monthlyRate = annualRateToMonthlyRate(annualRate)

  let grossValue = principal

  for (let month = 0; month < totalMonths; month += 1) {
    grossValue = grossValue * (1 + monthlyRate) + monthlyContribution
  }

  const investedTotal = principal + monthlyContribution * totalMonths
  const interestValue = grossValue - investedTotal

  return {
    investedTotal,
    grossValue,
    interestValue,
    monthlyRate
  }
}
