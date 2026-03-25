# Feature: Investimentos em Renda Fixa

**Status:** 🔄 Em desenvolvimento  
**Prioridade:** 🟢 MÉDIA  
**Sprint:** Sprint 5 - Módulo de Investimentos  
**Tasks relacionadas:** TASK-020, TASK-021, TASK-022, TASK-023, TASK-024  
**Estimativa:** 5-6 dias

---

## 1. Visão Geral

Módulo de investimentos focado em **renda fixa** (CDB, Tesouro Direto, LCI/LCA, Poupança) com:
- **Portfólio** com todos os investimentos ativos
- **Calculadora** de rentabilidade com taxas do BCB
- **Acompanhamento** de vencimentos
- **Distribuição** visual por tipo de ativo

### Objetivos
- ✅ Cadastrar investimentos em renda fixa
- ✅ Visualizar portfólio com total investido
- ✅ Calcular projeção de rentabilidade
- ✅ Buscar taxas reais do BCB (Selic, CDI, IPCA)
- ✅ Comparar diferentes cenários de investimento

---

## 2. Requisitos Funcionais

### RF-001: Cadastrar Investimento
- **Descrição:** Registrar novo investimento em renda fixa
- **Regras de negócio:**
  - Tipos suportados: CDB, Tesouro Direto, LCI, LCA, Poupança, Outros
  - Taxa pode ser: fixa (%), % do CDI, % da Selic, IPCA+
  - Data de início obrigatória
  - Vencimento opcional (poupança não tem)
  - Instituição obrigatória (ex: "Nubank", "Banco do Brasil")

### RF-002: Visualizar Portfólio
- **Descrição:** Ver todos os investimentos com total investido
- **Regras de negócio:**
  - Total investido = SUM(invested_amount) WHERE active = true
  - Agrupar por tipo (CDB, Tesouro, etc.)
  - Pie chart de distribuição
  - Lista ordenada por data de início DESC

### RF-003: Calcular Rentabilidade
- **Descrição:** Simulador de rentabilidade com diferentes cenários
- **Regras de negócio:**
  - Parâmetros: aporte inicial, aporte mensal, taxa anual, período (meses)
  - Taxa pode vir do BCB (Selic/CDI/IPCA) ou manual
  - Fórmula: juros compostos mensais
  - Gráfico de evolução do saldo
  - Cards: valor final, total investido, rendimento

### RF-004: Buscar Taxas do BCB
- **Descrição:** Proxy para API do Banco Central
- **Regras de negócio:**
  - Séries: Selic (432), CDI (4389), IPCA (13522)
  - Cache de 24 horas (evitar requisições excessivas)
  - Fallback se API indisponível

### RF-005: Editar/Excluir Investimento
- **Descrição:** Alterar dados ou remover investimento
- **Regras de negócio:**
  - Edição permite alterar todos os campos
  - Exclusão marca como `active = false` (soft delete)
  - Investimentos inativos não entram nos totais

---

## 3. User Stories

### 🎯 US-001: Cadastrar CDB
**Como** usuário  
**Quero** registrar meu CDB do Nubank  
**Para** acompanhar meus investimentos

**Cenário:** Cadastrar CDB
```gherkin
Dado que estou na aba "Portfólio"
Quando clico em "Novo investimento"
E seleciono tipo "CDB"
E digito nome "CDB Nubank 120% CDI"
E seleciono instituição "Nubank"
E digito valor investido "R$ 5.000,00"
E seleciono tipo de taxa "% do CDI"
E digito valor da taxa "120"
E seleciono data de início "01/01/2026"
E seleciono vencimento "01/01/2028"
E clico em "Salvar"
Então vejo o investimento na lista
E vejo total investido atualizado
```

---

### 🎯 US-002: Visualizar Portfólio
**Como** usuário  
**Quero** ver todos meus investimentos  
**Para** ter visão geral do patrimônio

**Cenário:** Ver portfólio
```gherkin
Dado que tenho 3 investimentos:
  - CDB: R$ 5.000
  - Tesouro Selic: R$ 3.000
  - Poupança: R$ 2.000
Quando acesso Investimentos > Portfólio
Então vejo card "Total Investido: R$ 10.000"
E vejo pie chart com 3 fatias:
  - CDB: 50%
  - Tesouro Direto: 30%
  - Poupança: 20%
E vejo lista com os 3 investimentos
```

---

### 🎯 US-003: Usar Calculadora
**Como** usuário  
**Quero** simular investimento de R$ 500/mês  
**Para** saber quanto vou ter em 2 anos

**Cenário:** Calcular com taxa do BCB
```gherkin
Dado que estou na aba "Calculadora"
Quando seleciono fonte da taxa "Banco Central"
E seleciono índice "CDI"
E ajusto slider para "100% do CDI"
E digito aporte inicial "R$ 0"
E digito aporte mensal "R$ 500"
E ajusto duração para "24 meses"
Então vejo card "Valor Final: R$ 12.580,43"
E vejo card "Total Investido: R$ 12.000,00"
E vejo card "Rendimento: R$ 580,43"
E vejo gráfico de linha mostrando evolução
```

**Cenário:** Calcular com taxa manual
```gherkin
Dado que estou na calculadora
Quando seleciono fonte "Taxa manual"
E ajusto slider para "12% ao ano"
E digito aporte inicial "R$ 10.000"
E digito aporte mensal "R$ 0"
E ajusto duração para "12 meses"
Então vejo valor final calculado com 12% a.a.
```

---

## 4. Schema de Dados

### Tabela: `investments`
```sql
CREATE TYPE investment_type AS ENUM (
  'cdb',
  'tesouro_direto',
  'lci',
  'lca',
  'poupanca',
  'outros_renda_fixa'
);

CREATE TABLE investments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,               -- ex: "CDB Nubank 120% CDI"
  type investment_type NOT NULL,
  institution TEXT NOT NULL,        -- ex: "Nubank", "Tesouro Direto"
  invested_amount NUMERIC(12,2) NOT NULL CHECK (invested_amount > 0),
  rate_type TEXT NOT NULL CHECK (rate_type IN ('fixed', 'cdi_pct', 'selic_pct', 'ipca_plus')),
  rate_value NUMERIC(8,4) NOT NULL, -- ex: 12.5 para 12.5% a.a., ou 110 para 110% CDI
  start_date DATE NOT NULL,
  maturity_date DATE,               -- null = sem vencimento (poupança, etc)
  notes TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE investments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_data" ON investments FOR ALL USING (auth.uid() = user_id);
CREATE INDEX idx_investments_user_id ON investments(user_id);
CREATE INDEX idx_investments_active ON investments(user_id, active);
```

---

## 5. API Route: Proxy BCB

**Arquivo:** `app/api/bcb-proxy/route.ts`

```typescript
import { NextResponse } from 'next/server'

const BCB_BASE_URL = 'https://api.bcb.gov.br/dados/serie/bcdata.sgs'

// Séries do BCB
const SERIES = {
  selic: '432',
  cdi: '4389',
  ipca: '13522',
} as const

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const serie = searchParams.get('serie')

  if (!serie || !Object.values(SERIES).includes(serie)) {
    return NextResponse.json(
      { error: 'Série inválida. Use: 432 (Selic), 4389 (CDI), 13522 (IPCA)' },
      { status: 400 }
    )
  }

  try {
    const response = await fetch(
      `${BCB_BASE_URL}.${serie}/dados/ultimos/1?formato=json`,
      { next: { revalidate: 86400 } } // Cache 24h
    )

    if (!response.ok) {
      throw new Error('BCB API unavailable')
    }

    const data = await response.json()

    if (!data || data.length === 0) {
      throw new Error('No data from BCB')
    }

    const latest = data[0]

    return NextResponse.json(
      {
        value: parseFloat(latest.valor),
        date: latest.data,
        period: serie === SERIES.ipca ? 'monthly' : 'annual',
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600',
        },
      }
    )
  } catch (error) {
    console.error('BCB API Error:', error)
    return NextResponse.json(
      { error: 'BCB API unavailable' },
      { status: 503 }
    )
  }
}
```

---

## 6. Componentes React

### 6.1 Página de Investimentos
**Arquivo:** `app/(app)/investimentos/page.tsx`

```typescript
'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { InvestmentPortfolio } from '@/components/investments/InvestmentPortfolio'
import { InvestmentCalculator } from '@/components/investments/InvestmentCalculator'

export default function InvestmentsPage() {
  return (
    <div className="flex flex-col h-full">
      <Tabs defaultValue="portfolio" className="flex-1">
        <div className="border-b">
          <TabsList className="w-full">
            <TabsTrigger value="portfolio" className="flex-1">
              Portfólio
            </TabsTrigger>
            <TabsTrigger value="calculator" className="flex-1">
              Calculadora
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="portfolio">
          <InvestmentPortfolio />
        </TabsContent>

        <TabsContent value="calculator">
          <InvestmentCalculator />
        </TabsContent>
      </Tabs>
    </div>
  )
}
```

---

### 6.2 Calculadora de Investimentos
**Arquivo:** `components/investments/InvestmentCalculator.tsx`

```typescript
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CurrencyInput } from '@/components/shared/CurrencyInput'
import { LineChart } from '@/components/charts/LineChart'
import { formatCurrency } from '@/lib/utils/currency'
import { useBCBRates } from '@/lib/hooks/useBCBRates'

export function InvestmentCalculator() {
  const [rateSource, setRateSource] = useState<'bcb' | 'manual'>('bcb')
  const [bcbIndex, setBcbIndex] = useState<'selic' | 'cdi'>('cdi')
  const [bcbPercentage, setBcbPercentage] = useState(100)
  const [manualRate, setManualRate] = useState(12)
  const [initialAmount, setInitialAmount] = useState(0)
  const [monthlyAmount, setMonthlyAmount] = useState(500)
  const [months, setMonths] = useState(24)

  const { data: rates, isLoading: loadingRates } = useBCBRates()

  const calculateProjection = () => {
    let rate = 0

    if (rateSource === 'bcb' && rates) {
      const indexRate = bcbIndex === 'selic' ? rates.selic : rates.cdi
      rate = (indexRate * bcbPercentage) / 100
    } else {
      rate = manualRate
    }

    const monthlyRate = Math.pow(1 + rate / 100, 1 / 12) - 1

    let balance = initialAmount
    const breakdown = []

    for (let month = 1; month <= months; month++) {
      balance = balance * (1 + monthlyRate) + monthlyAmount
      breakdown.push({
        month,
        balance: Math.round(balance * 100) / 100,
        invested: initialAmount + monthlyAmount * month,
      })
    }

    const finalBalance = balance
    const totalInvested = initialAmount + monthlyAmount * months
    const gain = finalBalance - totalInvested

    return {
      finalBalance,
      totalInvested,
      gain,
      gainPercent: (gain / totalInvested) * 100,
      breakdown,
    }
  }

  const projection = calculateProjection()

  return (
    <div className="p-4 space-y-6">
      {/* Resultado */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Valor Final</p>
            <p className="text-lg font-bold text-green-600">
              {formatCurrency(projection.finalBalance)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Investido</p>
            <p className="text-lg font-bold">
              {formatCurrency(projection.totalInvested)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Rendimento</p>
            <p className="text-lg font-bold text-green-600">
              {formatCurrency(projection.gain)}
            </p>
            <p className="text-xs text-muted-foreground">
              +{projection.gainPercent.toFixed(1)}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Parâmetros */}
      <Card>
        <CardHeader>
          <CardTitle>Parâmetros</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Fonte da taxa */}
          <div className="space-y-2">
            <Label>Fonte da Taxa</Label>
            <Select value={rateSource} onValueChange={(v: any) => setRateSource(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bcb">Banco Central</SelectItem>
                <SelectItem value="manual">Taxa Manual</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {rateSource === 'bcb' ? (
            <>
              <div className="space-y-2">
                <Label>Índice</Label>
                <Select value={bcbIndex} onValueChange={(v: any) => setBcbIndex(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="selic">Selic</SelectItem>
                    <SelectItem value="cdi">CDI</SelectItem>
                  </SelectContent>
                </Select>
                {loadingRates ? (
                  <p className="text-xs text-muted-foreground">Buscando taxa...</p>
                ) : rates ? (
                  <p className="text-xs text-muted-foreground">
                    Taxa atual: {rates[bcbIndex].toFixed(2)}% a.a.
                  </p>
                ) : (
                  <p className="text-xs text-destructive">Erro ao buscar taxa</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Percentual do Índice: {bcbPercentage}%</Label>
                <Slider
                  value={[bcbPercentage]}
                  onValueChange={([v]) => setBcbPercentage(v)}
                  min={50}
                  max={150}
                  step={5}
                />
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <Label>Taxa Anual: {manualRate}%</Label>
              <Slider
                value={[manualRate]}
                onValueChange={([v]) => setManualRate(v)}
                min={1}
                max={30}
                step={0.5}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label>Aporte Inicial</Label>
            <CurrencyInput
              value={initialAmount}
              onChange={setInitialAmount}
              placeholder="R$ 0,00"
            />
          </div>

          <div className="space-y-2">
            <Label>Aporte Mensal</Label>
            <CurrencyInput
              value={monthlyAmount}
              onChange={setMonthlyAmount}
              placeholder="R$ 0,00"
            />
          </div>

          <div className="space-y-2">
            <Label>Duração: {months} meses</Label>
            <Slider
              value={[months]}
              onValueChange={([v]) => setMonths(v)}
              min={1}
              max={360}
              step={1}
            />
          </div>
        </CardContent>
      </Card>

      {/* Gráfico */}
      <Card>
        <CardHeader>
          <CardTitle>Evolução do Investimento</CardTitle>
        </CardHeader>
        <CardContent>
          <LineChart
            data={projection.breakdown.map(item => ({
              month: `Mês ${item.month}`,
              Saldo: item.balance,
              Investido: item.invested,
            }))}
          />
        </CardContent>
      </Card>
    </div>
  )
}
```

---

## 7. Hooks

### Hook: `useBCBRates`
**Arquivo:** `lib/hooks/useBCBRates.ts`

```typescript
import { useQuery } from '@tanstack/react-query'

interface BCBRate {
  value: number
  date: string
  period: 'annual' | 'monthly'
}

export function useBCBRates() {
  return useQuery({
    queryKey: ['bcb-rates'],
    queryFn: async () => {
      const [selicRes, cdiRes, ipcaRes] = await Promise.all([
        fetch('/api/bcb-proxy?serie=432'),
        fetch('/api/bcb-proxy?serie=4389'),
        fetch('/api/bcb-proxy?serie=13522'),
      ])

      if (!selicRes.ok || !cdiRes.ok || !ipcaRes.ok) {
        throw new Error('Failed to fetch BCB rates')
      }

      const selic: BCBRate = await selicRes.json()
      const cdi: BCBRate = await cdiRes.json()
      const ipca: BCBRate = await ipcaRes.json()

      return {
        selic: selic.value,
        cdi: cdi.value,
        ipca: ipca.value,
        updatedAt: new Date().toISOString(),
      }
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 horas
    retry: 2,
  })
}
```

---

## 8. Testes Sugeridos

### Teste: Cálculo de rentabilidade
```typescript
test('Calcular rentabilidade corretamente', () => {
  const initial = 10000
  const monthly = 0
  const rate = 12 // 12% a.a.
  const months = 12

  const monthlyRate = Math.pow(1 + rate / 100, 1 / 12) - 1
  let balance = initial

  for (let i = 0; i < months; i++) {
    balance = balance * (1 + monthlyRate)
  }

  expect(balance).toBeCloseTo(11200, 0) // aproximado
})
```

---

## 9. Links para Tasks

- **TASK-020:** Hook `useInvestments`
- **TASK-021:** API Route proxy BCB
- **TASK-022:** Calculadora de investimentos
- **TASK-023:** Página de Investimentos
- **TASK-024:** Formulário de investimento

---

**Última atualização:** Março 2026
