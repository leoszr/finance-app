export type ParsedNubankRow = {
  line: number
  occurred_on: string
  description: string
  amount: number
}

export type ParsedNubankRowError = {
  line: number
  reason: string
  raw: string[]
}

export type ParseNubankCSVResult = {
  rows: ParsedNubankRow[]
  skippedPositive: number
  errors: ParsedNubankRowError[]
  totalLines: number
}

function normalizeHeader(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function splitCSVLine(line: string, separator: ';' | ',') {
  const values: string[] = []
  let current = ''
  let inQuotes = false

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index]

    if (char === '"') {
      const nextChar = line[index + 1]

      if (inQuotes && nextChar === '"') {
        current += '"'
        index += 1
      } else {
        inQuotes = !inQuotes
      }

      continue
    }

    if (!inQuotes && char === separator) {
      values.push(current.trim())
      current = ''
      continue
    }

    current += char
  }

  values.push(current.trim())
  return values
}

function detectSeparator(headerLine: string): ';' | ',' {
  const semicolons = (headerLine.match(/;/g) ?? []).length
  const commas = (headerLine.match(/,/g) ?? []).length
  return semicolons >= commas ? ';' : ','
}

function toISODate(value: string) {
  const normalized = value.trim()

  if (normalized.length === 10 && normalized[2] === '/' && normalized[5] === '/') {
    const day = normalized.slice(0, 2)
    const month = normalized.slice(3, 5)
    const year = normalized.slice(6, 10)
    return `${year}-${month}-${day}`
  }

  if (normalized.length === 10 && normalized[4] === '-' && normalized[7] === '-') {
    return normalized
  }

  return null
}

function toAmount(value: string) {
  const normalized = value
    .trim()
    .replaceAll(' ', '')
    .replaceAll('R$', '')
    .replaceAll('.', '')
    .replace(',', '.')

  const parsed = Number.parseFloat(normalized)
  return Number.isFinite(parsed) ? parsed : null
}

export function validateCSVFileName(fileName: string) {
  if (!fileName.toLowerCase().endsWith('.csv')) {
    return 'Arquivo inválido. Envie um CSV exportado do Nubank.'
  }

  return null
}

export function parseNubankCSV(content: string): ParseNubankCSVResult {
  const sanitized = content.startsWith('\uFEFF') ? content.slice(1) : content
  const lines = sanitized.split(/\r?\n/)

  if (lines.length < 2) {
    throw new Error('CSV inválido: arquivo sem dados suficientes.')
  }

  const headerLine = lines.find((line) => line.trim().length > 0)

  if (!headerLine) {
    throw new Error('CSV inválido: cabeçalho ausente.')
  }

  const separator = detectSeparator(headerLine)
  const headers = splitCSVLine(headerLine, separator).map(normalizeHeader)

  const dataIndex = headers.indexOf('data')
  const descriptionIndex = headers.indexOf('descricao')
  const amountIndex = headers.indexOf('valor')

  if (dataIndex < 0 || descriptionIndex < 0 || amountIndex < 0) {
    throw new Error('CSV fora do padrão Nubank. Colunas obrigatórias: Data, Descrição e Valor.')
  }

  const rows: ParsedNubankRow[] = []
  const errors: ParsedNubankRowError[] = []
  let skippedPositive = 0
  let totalLines = 0

  for (let index = 1; index < lines.length; index += 1) {
    const line = lines[index]

    if (!line || line.trim().length === 0) {
      continue
    }

    totalLines += 1
    const lineNumber = index + 1
    const rawValues = splitCSVLine(line, separator)

    const occurredOn = toISODate(rawValues[dataIndex] ?? '')
    if (!occurredOn) {
      errors.push({
        line: lineNumber,
        reason: 'Data inválida. Use DD/MM/AAAA ou AAAA-MM-DD.',
        raw: rawValues
      })
      continue
    }

    const description = (rawValues[descriptionIndex] ?? '').trim()
    if (description.length < 2) {
      errors.push({
        line: lineNumber,
        reason: 'Descrição inválida.',
        raw: rawValues
      })
      continue
    }

    const amount = toAmount(rawValues[amountIndex] ?? '')
    if (amount === null) {
      errors.push({
        line: lineNumber,
        reason: 'Valor inválido.',
        raw: rawValues
      })
      continue
    }

    if (amount > 0) {
      skippedPositive += 1
      continue
    }

    rows.push({
      line: lineNumber,
      occurred_on: occurredOn,
      description,
      amount: Math.abs(amount)
    })
  }

  return {
    rows,
    skippedPositive,
    errors,
    totalLines
  }
}
