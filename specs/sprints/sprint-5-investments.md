# Sprint 5 — Investimentos

**Objetivo:** Módulo completo de investimentos em renda fixa com calculadora de projeções e integração com taxas do Banco Central.  
**Estimativa:** 5–6 dias  
**Status:** 🔴 Não iniciado  
**Tasks:** TASK-020, TASK-021, TASK-022, TASK-023, TASK-024

---

## Visão Geral

Esta sprint implementa o módulo de investimentos focado em renda fixa:
- Registro de investimentos (CDB, Tesouro Direto, LCI/LCA, Poupança)
- Visualização de portfólio com distribuição por tipo
- Calculadora de projeções de rendimento
- Integração com API do Banco Central (Selic, CDI, IPCA)

Ao final, o usuário poderá registrar seus investimentos, acompanhar o portfólio e simular cenários de rentabilidade.

---

## TASK-020: Hook `useInvestments`

**Descrição expandida:**  
Criar hook para gerenciar investimentos com queries e mutations completas, incluindo cálculo de totais e agrupamentos.

### Arquivos a criar/modificar

```
├── lib/hooks/
│   └── useInvestments.ts          (hook principal)
```

### Código exemplo

#### `lib/hooks/useInvestments.ts`
```typescript
'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Investment, InvestmentFormData, InvestmentType } from '@/lib/types'
import { useToast } from '@/components/ui/use-toast'

/**
 * Hook para gerenciar investimentos
 */

// ============================================
// Query: Listar investimentos ativos
// ============================================

export function useInvestments() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['investments'],
    queryFn: async (): Promise<Investment[]> => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error('Usuário não autenticado')

      const { data, error } = await supabase
        .from('investments')
        .select('*')
        .eq('user_id', user.id)
        .eq('active', true)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao buscar investimentos:', error)
        throw new Error('Não foi possível carregar os investimentos')
      }

      return (data as Investment[]) || []
    },
  })
}

// ============================================
// Query: Resumo do portfólio
// ============================================

interface InvestmentSummary {
  totalInvested: number
  byType: Array<{
    type: InvestmentType
    label: string
    total: number
    percentage: number
    count: number
  }>
}

const INVESTMENT_TYPE_LABELS: Record<InvestmentType, string> = {
  cdb: 'CDB',
  tesouro_direto: 'Tesouro Direto',
  lci: 'LCI',
  lca: 'LCA',
  poupanca: 'Poupança',
  outros_renda_fixa: 'Outros Renda Fixa',
}

export function useInvestmentsSummary(): InvestmentSummary {
  const { data: investments = [] } = useInvestments()

  const totalInvested = investments.reduce(
    (sum, inv) => sum + Number(inv.invested_amount),
    0
  )

  // Agrupar por tipo
  const typeMap = new Map<
    InvestmentType,
    { total: number; count: number }
  >()

  investments.forEach((inv) => {
    const existing = typeMap.get(inv.type)
    if (existing) {
      existing.total += Number(inv.invested_amount)
      existing.count += 1
    } else {
      typeMap.set(inv.type, {
        total: Number(inv.invested_amount),
        count: 1,
      })
    }
  })

  const byType = Array.from(typeMap.entries()).map(([type, data]) => ({
    type,
    label: INVESTMENT_TYPE_LABELS[type],
    total: data.total,
    percentage: totalInvested > 0 ? (data.total / totalInvested) * 100 : 0,
    count: data.count,
  }))

  // Ordenar por total (maior primeiro)
  byType.sort((a, b) => b.total - a.total)

  return {
    totalInvested,
    byType,
  }
}

// ============================================
// Mutation: Criar investimento
// ============================================

export function useCreateInvestment() {
  const supabase = createClient()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (data: InvestmentFormData) => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error('Usuário não autenticado')

      const { data: investment, error } = await supabase
        .from('investments')
        .insert([
          {
            user_id: user.id,
            name: data.name,
            type: data.type,
            institution: data.institution,
            invested_amount: data.invested_amount,
            rate_type: data.rate_type,
            rate_value: data.rate_value,
            start_date: data.start_date,
            maturity_date: data.maturity_date || null,
            notes: data.notes || null,
            active: true,
          },
        ])
        .select()
        .single()

      if (error) {
        console.error('Erro ao criar investimento:', error)
        throw new Error('Não foi possível criar o investimento')
      }

      return investment as Investment
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investments'] })

      toast({
        title: 'Investimento adicionado',
        description: 'O investimento foi registrado com sucesso.',
      })
    },
    onError: (error) => {
      toast({
        title: 'Erro ao adicionar investimento',
        description: error.message,
        variant: 'destructive',
      })
    },
  })
}

// ============================================
// Mutation: Atualizar investimento
// ============================================

interface UpdateInvestmentParams {
  id: string
  data: Partial<InvestmentFormData>
}

export function useUpdateInvestment() {
  const supabase = createClient()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async ({ id, data }: UpdateInvestmentParams) => {
      const { data: investment, error } = await supabase
        .from('investments')
        .update({
          name: data.name,
          type: data.type,
          institution: data.institution,
          invested_amount: data.invested_amount,
          rate_type: data.rate_type,
          rate_value: data.rate_value,
          start_date: data.start_date,
          maturity_date: data.maturity_date || null,
          notes: data.notes || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Erro ao atualizar investimento:', error)
        throw new Error('Não foi possível atualizar o investimento')
      }

      return investment as Investment
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investments'] })

      toast({
        title: 'Investimento atualizado',
        description: 'As alterações foram salvas com sucesso.',
      })
    },
    onError: (error) => {
      toast({
        title: 'Erro ao atualizar investimento',
        description: error.message,
        variant: 'destructive',
      })
    },
  })
}

// ============================================
// Mutation: Deletar investimento (inativar)
// ============================================

export function useDeleteInvestment() {
  const supabase = createClient()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (id: string) => {
      // Inativar em vez de deletar (manter histórico)
      const { error } = await supabase
        .from('investments')
        .update({ active: false })
        .eq('id', id)

      if (error) {
        console.error('Erro ao deletar investimento:', error)
        throw new Error('Não foi possível excluir o investimento')
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investments'] })

      toast({
        title: 'Investimento removido',
        description: 'O investimento foi removido do portfólio.',
      })
    },
    onError: (error) => {
      toast({
        title: 'Erro ao excluir investimento',
        description: error.message,
        variant: 'destructive',
      })
    },
  })
}
```

### Passos de implementação

1. **Criar hook conforme exemplo**
2. **Implementar `useInvestmentsSummary` com agrupamento**
3. **Testar CRUD completo**
4. **Verificar percentuais (devem somar 100%)**

### Critérios de aceitação

- [ ] `useInvestments` retorna apenas investimentos ativos
- [ ] `useInvestmentsSummary` calcula `totalInvested` corretamente
- [ ] Agrupamento por tipo funciona (byType array)
- [ ] Percentuais somam 100% (ou próximo)
- [ ] Mutações invalidam cache
- [ ] Delete inativa (não remove do banco)

### Dependências

- TASK-007 completa (estrutura de hooks)

### Tempo estimado

**2–3 horas**

---

## TASK-021: API Route proxy BCB

**Descrição expandida:**  
Criar endpoint Edge Route para buscar taxas do Banco Central (Selic, CDI, IPCA) com cache de 24h para evitar rate limiting.

### Arquivos a criar/modificar

```
├── app/api/bcb-proxy/
│   └── route.ts                   (Edge Route)
```

### Código exemplo

#### `app/api/bcb-proxy/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server'

/**
 * API Route: Proxy para API do Banco Central
 * 
 * Endpoint: /api/bcb-proxy?serie=432
 * 
 * Séries suportadas:
 * - 432: Selic (% a.a.)
 * - 4389: CDI (% a.a.)
 * - 13522: IPCA (% mensal)
 * 
 * Cache: 24 horas (header Cache-Control)
 */

const BCB_API_BASE = 'https://api.bcb.gov.br/dados/serie/bcdata.sgs'

const SERIES: Record<string, { name: string; period: 'annual' | 'monthly' }> = {
  '432': { name: 'Selic', period: 'annual' },
  '4389': { name: 'CDI', period: 'annual' },
  '13522': { name: 'IPCA', period: 'monthly' },
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const serie = searchParams.get('serie')

  // Validar série
  if (!serie || !SERIES[serie]) {
    return NextResponse.json(
      { error: 'Série inválida. Use: 432 (Selic), 4389 (CDI), 13522 (IPCA)' },
      { status: 400 }
    )
  }

  const serieInfo = SERIES[serie]

  try {
    // Buscar último valor da série
    const url = `${BCB_API_BASE}.${serie}/dados/ultimos/1?formato=json`

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
      next: {
        revalidate: 24 * 60 * 60, // 24 horas
      },
    })

    if (!response.ok) {
      throw new Error(`BCB API retornou status ${response.status}`)
    }

    const data = await response.json()

    // API do BCB retorna array com um objeto: [{ data: "DD/MM/YYYY", valor: "12.34" }]
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Resposta inválida da API do BCB')
    }

    const latest = data[0]

    return NextResponse.json(
      {
        serie: serie,
        name: serieInfo.name,
        value: parseFloat(latest.valor),
        date: latest.data,
        period: serieInfo.period,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600',
        },
      }
    )
  } catch (error) {
    console.error('Erro ao buscar taxa do BCB:', error)

    return NextResponse.json(
      {
        error: 'Não foi possível buscar a taxa do Banco Central',
        details: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 503 }
    )
  }
}

export const runtime = 'edge' // Edge Runtime (mais rápido)
```

### Passos de implementação

1. **Criar arquivo `app/api/bcb-proxy/route.ts`**
2. **Implementar GET handler conforme exemplo**
3. **Testar endpoints:**
   ```bash
   curl http://localhost:3000/api/bcb-proxy?serie=432
   curl http://localhost:3000/api/bcb-proxy?serie=4389
   curl http://localhost:3000/api/bcb-proxy?serie=13522
   ```

4. **Verificar cache headers:**
   - Resposta deve incluir `Cache-Control: public, s-maxage=86400`

### Critérios de aceitação

- [ ] Endpoint `/api/bcb-proxy?serie=432` retorna taxa Selic
- [ ] Endpoint `/api/bcb-proxy?serie=4389` retorna taxa CDI
- [ ] Endpoint `/api/bcb-proxy?serie=13522` retorna taxa IPCA
- [ ] Header `Cache-Control` presente na resposta
- [ ] Série inválida retorna status 400 com mensagem clara
- [ ] BCB indisponível retorna status 503
- [ ] Response time < 2s (incluindo latência do BCB)
- [ ] Edge Runtime configurado (resposta mais rápida)

### Possíveis desafios/edge cases

- **BCB API instável:** Cache de 24h mitiga problema. Considerar fallback com valores manualmente atualizados
- **Rate limiting:** Improvável com cache de 24h, mas monitorar
- **Timezone:** API do BCB retorna data DD/MM/YYYY. Não precisa converter.

### Dependências

- Sprint 0 completa (estrutura de rotas)

### Tempo estimado

**1–2 horas** (incluindo testes)

---

## TASK-022: Calculadora de investimentos

**Descrição expandida:**  
Componente standalone de calculadora de projeções de investimentos com sliders interativos, integração com BCB e gráfico de evolução.

### Arquivos a criar/modificar

```
├── components/investments/
│   └── InvestmentCalculator.tsx   (calculadora completa)
├── lib/utils/
│   └── investment-calc.ts         (funções de cálculo)
```

### Código exemplo (resumido)

#### `lib/utils/investment-calc.ts`
```typescript
import { InvestmentProjection } from '@/lib/types'

/**
 * Calcular projeção de investimento com juros compostos
 * 
 * @param initialAmount Aporte inicial (R$)
 * @param monthlyDeposit Aporte mensal (R$)
 * @param annualRate Taxa anual (% decimal, ex: 0.12 para 12%)
 * @param months Duração em meses
 */
export function calculateInvestmentProjection(
  initialAmount: number,
  monthlyDeposit: number,
  annualRate: number,
  months: number
): InvestmentProjection {
  // Converter taxa anual para mensal: (1 + taxa_anual)^(1/12) - 1
  const monthlyRate = Math.pow(1 + annualRate, 1 / 12) - 1

  let balance = initialAmount
  const breakdown: Array<{ month: number; balance: number; invested: number }> = []

  for (let month = 1; month <= months; month++) {
    // Aplicar juros do mês anterior
    balance = balance * (1 + monthlyRate)

    // Adicionar aporte mensal
    balance += monthlyDeposit

    const totalInvested = initialAmount + monthlyDeposit * month

    breakdown.push({
      month,
      balance: Math.round(balance * 100) / 100, // Arredondar para 2 casas
      invested: totalInvested,
    })
  }

  const finalAmount = balance
  const totalInvested = initialAmount + monthlyDeposit * months
  const gain = finalAmount - totalInvested
  const gainPercent = totalInvested > 0 ? (gain / totalInvested) * 100 : 0

  return {
    months,
    finalAmount: Math.round(finalAmount * 100) / 100,
    totalInvested,
    gain: Math.round(gain * 100) / 100,
    gainPercent: Math.round(gainPercent * 100) / 100,
    monthlyBreakdown: breakdown,
  }
}

/**
 * Converter taxa mensal do IPCA para anual
 * 
 * Fórmula: (1 + taxa_mensal)^12 - 1
 */
export function monthlyToAnnualRate(monthlyRate: number): number {
  return Math.pow(1 + monthlyRate, 12) - 1
}
```

#### `components/investments/InvestmentCalculator.tsx` (simplificado)
```typescript
'use client'

import { useState, useEffect } from 'react'
import { calculateInvestmentProjection } from '@/lib/utils/investment-calc'
import { formatCurrency, formatCurrencyCompact } from '@/lib/utils/currency'
import { CurrencyInput } from '@/components/shared/CurrencyInput'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

type RateSource = 'bcb' | 'manual'
type BCBIndex = 'selic' | 'cdi'

export function InvestmentCalculator() {
  // Parâmetros de entrada
  const [rateSource, setRateSource] = useState<RateSource>('manual')
  const [bcbIndex, setBcbIndex] = useState<BCBIndex>('cdi')
  const [bcbPercentage, setBcbPercentage] = useState(100) // % do índice (ex: 110% CDI)
  const [manualRate, setManualRate] = useState(12) // Taxa manual (% a.a.)
  const [initialAmount, setInitialAmount] = useState(10000)
  const [monthlyDeposit, setMonthlyDeposit] = useState(500)
  const [months, setMonths] = useState(12)

  // Taxa do BCB
  const [bcbRate, setBcbRate] = useState<number | null>(null)
  const [loadingBcbRate, setLoadingBcbRate] = useState(false)

  // Buscar taxa do BCB
  useEffect(() => {
    if (rateSource === 'bcb') {
      fetchBCBRate()
    }
  }, [rateSource, bcbIndex])

  async function fetchBCBRate() {
    setLoadingBcbRate(true)
    try {
      const serieId = bcbIndex === 'selic' ? '432' : '4389'
      const response = await fetch(`/api/bcb-proxy?serie=${serieId}`)
      const data = await response.json()

      if (response.ok) {
        setBcbRate(data.value)
      } else {
        console.error('Erro ao buscar taxa:', data.error)
        setBcbRate(null)
      }
    } catch (error) {
      console.error('Erro ao buscar taxa do BCB:', error)
      setBcbRate(null)
    } finally {
      setLoadingBcbRate(false)
    }
  }

  // Calcular projeção
  const effectiveRate =
    rateSource === 'bcb' && bcbRate
      ? (bcbRate * bcbPercentage) / 100 / 100 // Converter % para decimal
      : manualRate / 100

  const projection = calculateInvestmentProjection(
    initialAmount,
    monthlyDeposit,
    effectiveRate,
    months
  )

  return (
    <div className="space-y-6">
      {/* Parâmetros */}
      <div className="space-y-4">
        {/* Fonte da taxa */}
        <div>
          <Label>Fonte da taxa</Label>
          <Select value={rateSource} onValueChange={(v) => setRateSource(v as RateSource)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="manual">Taxa manual</SelectItem>
              <SelectItem value="bcb">Banco Central</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Taxa manual ou BCB */}
        {rateSource === 'manual' ? (
          <div>
            <Label>Taxa anual (%)</Label>
            <Slider
              value={[manualRate]}
              onValueChange={([v]) => setManualRate(v)}
              min={1}
              max={30}
              step={0.1}
            />
            <p className="mt-1 text-sm text-zinc-600">{manualRate.toFixed(1)}% ao ano</p>
          </div>
        ) : (
          <>
            <div>
              <Label>Índice</Label>
              <Select value={bcbIndex} onValueChange={(v) => setBcbIndex(v as BCBIndex)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cdi">CDI</SelectItem>
                  <SelectItem value="selic">Selic</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Percentual do índice (%)</Label>
              <Slider
                value={[bcbPercentage]}
                onValueChange={([v]) => setBcbPercentage(v)}
                min={50}
                max={150}
                step={5}
              />
              <p className="mt-1 text-sm text-zinc-600">
                {bcbPercentage}% do {bcbIndex.toUpperCase()}{' '}
                {bcbRate && `(${((bcbRate * bcbPercentage) / 100).toFixed(2)}% a.a.)`}
              </p>
            </div>
          </>
        )}

        {/* Aporte inicial */}
        <div>
          <Label>Aporte inicial</Label>
          <CurrencyInput value={initialAmount} onChange={setInitialAmount} />
        </div>

        {/* Aporte mensal */}
        <div>
          <Label>Aporte mensal</Label>
          <CurrencyInput value={monthlyDeposit} onChange={setMonthlyDeposit} />
        </div>

        {/* Duração */}
        <div>
          <Label>Duração (meses)</Label>
          <Slider
            value={[months]}
            onValueChange={([v]) => setMonths(v)}
            min={1}
            max={360}
            step={1}
          />
          <p className="mt-1 text-sm text-zinc-600">
            {months} {months === 1 ? 'mês' : 'meses'} ({(months / 12).toFixed(1)} anos)
          </p>
        </div>
      </div>

      {/* Resultados */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-lg bg-zinc-100 p-4 dark:bg-zinc-800">
          <p className="text-xs text-zinc-600 dark:text-zinc-400">Valor final</p>
          <p className="mt-1 text-lg font-bold text-zinc-900 dark:text-zinc-100">
            {formatCurrency(projection.finalAmount)}
          </p>
        </div>
        <div className="rounded-lg bg-zinc-100 p-4 dark:bg-zinc-800">
          <p className="text-xs text-zinc-600 dark:text-zinc-400">Investido</p>
          <p className="mt-1 text-lg font-bold text-zinc-900 dark:text-zinc-100">
            {formatCurrency(projection.totalInvested)}
          </p>
        </div>
        <div className="rounded-lg bg-green-50 p-4 dark:bg-green-950">
          <p className="text-xs text-green-700 dark:text-green-300">Rendimento</p>
          <p className="mt-1 text-lg font-bold text-green-900 dark:text-green-100">
            {formatCurrency(projection.gain)}
          </p>
        </div>
      </div>

      {/* Gráfico */}
      <div className="rounded-lg bg-white p-4 dark:bg-zinc-950">
        <h3 className="mb-4 font-semibold text-zinc-900 dark:text-zinc-100">
          Evolução do investimento
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={projection.monthlyBreakdown}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
            <XAxis dataKey="month" stroke="#71717a" style={{ fontSize: '12px' }} />
            <YAxis
              stroke="#71717a"
              style={{ fontSize: '12px' }}
              tickFormatter={(v) => formatCurrencyCompact(v)}
            />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="balance"
              stroke="#16a34a"
              strokeWidth={2}
              name="Saldo"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="invested"
              stroke="#71717a"
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Investido"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
```

### Critérios de aceitação

- [ ] Sliders atualizam valores em tempo real
- [ ] Taxa do BCB buscada ao selecionar fonte "Banco Central"
- [ ] Cálculo de juros compostos correto (validar com Excel)
- [ ] Gráfico mostra evolução do saldo vs investido
- [ ] Valores monetários formatados como BRL
- [ ] IPCA convertido corretamente (mensal → anual)
- [ ] Erro ao buscar BCB mostra mensagem amigável

### Dependências

- TASK-021 completa (proxy BCB)
- TASK-012 completa (Recharts já instalado)

### Tempo estimado

**5–6 horas** (calculadora é complexa)

---

## TASK-023, TASK-024: Página de Investimentos e Formulário

**Descrição resumida:**  
Similar às tasks anteriores (Transações, Metas). Criar:
- Página com 2 abas: Portfólio + Calculadora
- Pie chart de distribuição por tipo
- Lista de investimentos
- Formulário completo com todos os campos

**Estimativa:** 5–6 horas combinadas

---

## Resumo da Sprint 5

Ao completar esta sprint, o usuário terá:

✅ Módulo completo de investimentos  
✅ Portfólio visual com distribuição  
✅ Calculadora de projeções  
✅ Integração com taxas do BCB  

**Próxima sprint:** Sprint 6 — Export e Histórico

---

**Última atualização:** Março 2026  
**Versão:** 1.0
