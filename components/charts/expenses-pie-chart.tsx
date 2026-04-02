'use client'

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

type PieData = {
  categoryId: string
  name: string
  color: string
  total: number
  percentage: number
}

type ExpensesPieChartProps = {
  data: PieData[]
}

export function ExpensesPieChart({ data }: ExpensesPieChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-72 flex-col items-center justify-center">
        <div className="h-40 w-40 rounded-full bg-slate-200" />
        <p className="mt-3 text-sm text-slate-600">Nenhum gasto registrado no mês.</p>
      </div>
    )
  }

  const chartData = data.map((item) => ({
    name: item.name,
    value: item.total,
    percentage: item.percentage,
    color: item.color
  }))

  return (
    <ResponsiveContainer width="100%" height={320}>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
        >
          {chartData.map((entry) => (
            <Cell key={entry.name} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name, payload) => {
            const numericValue = Number(value ?? 0)
            const row = (payload?.payload ?? { percentage: 0 }) as { percentage: number }
            return [`R$ ${numericValue.toFixed(2)}`, `${String(name ?? '')} (${row.percentage.toFixed(1)}%)`]
          }}
        />
        <Legend verticalAlign="bottom" />
      </PieChart>
    </ResponsiveContainer>
  )
}
