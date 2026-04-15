import { NextResponse, type NextRequest } from 'next/server'

type Indicator = 'selic' | 'cdi' | 'ipca'

type BcbApiRow = {
  data: string
  valor: string
}

type BcbIndicatorResponse = {
  indicator: Indicator
  label: string
  code: number
  value: number
  unit: string
  period: 'daily' | 'monthly' | 'annual'
  annualRate: number
  date: string
}

type IndicatorConfig = {
  code: number
  label: string
  unit: string
  period: 'daily' | 'monthly' | 'annual'
  maxAge: number
  annualize: (value: number) => number
}

const INDICATORS: Record<Indicator, IndicatorConfig> = {
  selic: {
    code: 11,
    label: 'Selic',
    unit: '% a.d.',
    period: 'daily',
    maxAge: 60 * 60,
    annualize: (value) => (Math.pow(1 + value / 100, 252) - 1) * 100
  },
  cdi: {
    code: 4389,
    label: 'CDI',
    unit: '% a.a.',
    period: 'annual',
    maxAge: 60 * 60,
    annualize: (value) => value
  },
  ipca: {
    code: 433,
    label: 'IPCA',
    unit: '% a.m.',
    period: 'monthly',
    maxAge: 60 * 60 * 24,
    annualize: (value) => (Math.pow(1 + value / 100, 12) - 1) * 100
  }
}

function isIndicator(value: string | null): value is Indicator {
  return value === 'selic' || value === 'cdi' || value === 'ipca'
}

function parseDate(date: string) {
  const [day, month, year] = date.split('/')

  if (!day || !month || !year) {
    throw new Error('Data invalida retornada pelo BCB.')
  }

  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
}

async function fetchIndicator(indicator: Indicator): Promise<BcbIndicatorResponse> {
  const config = INDICATORS[indicator]
  const response = await fetch(
    `https://api.bcb.gov.br/dados/serie/bcdata.sgs.${config.code}/dados/ultimos/1?formato=json`,
    {
      headers: {
        Accept: 'application/json'
      },
      next: {
        revalidate: config.maxAge
      }
    }
  )

  if (!response.ok) {
    throw new Error(`BCB indisponivel para ${config.label}.`)
  }

  const payload = (await response.json()) as BcbApiRow[]
  const latest = payload.at(-1)

  if (!latest) {
    throw new Error(`BCB sem dados para ${config.label}.`)
  }

  const value = Number(latest.valor.replace(',', '.'))

  if (Number.isNaN(value)) {
    throw new Error(`Valor invalido retornado pelo BCB para ${config.label}.`)
  }

  return {
    indicator,
    label: config.label,
    code: config.code,
    value,
    unit: config.unit,
    period: config.period,
    annualRate: config.annualize(value),
    date: parseDate(latest.data)
  }
}

export async function GET(request: NextRequest) {
  const indicator = request.nextUrl.searchParams.get('indicator')

  if (!isIndicator(indicator)) {
    return NextResponse.json({ error: 'Indicador invalido. Use selic, cdi ou ipca.' }, { status: 400 })
  }

  try {
    const data = await fetchIndicator(indicator)
    const response = NextResponse.json(data)

    response.headers.set('Cache-Control', `public, s-maxage=${INDICATORS[indicator].maxAge}, stale-while-revalidate=300`)

    return response
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Nao foi possivel consultar o BCB.'
      },
      { status: 502 }
    )
  }
}
