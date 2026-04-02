'use client'

import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import type { DashboardMonthComparison } from '@/lib/hooks/use-dashboard'

type MonthlyComparisonChartProps = {
  data: DashboardMonthComparison[]
}

function formatCompact(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    notation: 'compact',
    compactDisplay: 'short'
  }).format(value)
}

export function MonthlyComparisonChart({ data }: MonthlyComparisonChartProps) {
  if (data.length === 0) {
    return <p className="text-sm text-slate-600">Sem dados de comparação.</p>
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="label" fontSize={12} stroke="#64748b" />
        <YAxis tickFormatter={formatCompact} fontSize={12} stroke="#64748b" />
        <Tooltip formatter={(value) => formatCompact(Number(value ?? 0))} />
        <Legend />
        <Line type="monotone" dataKey="income" stroke="#16a34a" strokeWidth={2} name="Receitas" />
        <Line type="monotone" dataKey="expense" stroke="#dc2626" strokeWidth={2} name="Despesas" />
      </LineChart>
    </ResponsiveContainer>
  )
}
