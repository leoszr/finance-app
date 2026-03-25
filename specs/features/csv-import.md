# Feature: Importação de CSV (Nubank)

**Status:** 🔄 Em desenvolvimento  
**Prioridade:** 🟢 MÉDIA  
**Sprint:** Sprint 4 - Import de CSV  
**Tasks relacionadas:** TASK-018, TASK-019  
**Estimativa:** 3-4 dias

---

## 1. Visão Geral

Sistema de importação de faturas do cartão Nubank via arquivo CSV, com:
- **Upload de arquivo** CSV
- **Parsing automático** das colunas
- **Pré-visualização** das transações encontradas
- **Mapeamento de categorias** (manual ou sugerido)
- **Seleção** de quais transações importar
- **Inserção em batch** no banco

### Objetivos
- ✅ Importar fatura completa do Nubank
- ✅ Mapear automaticamente categorias comuns
- ✅ Permitir revisar antes de importar
- ✅ Importar até 100 transações de uma vez
- ✅ Marcar origem como 'csv_nubank'

---

## 2. Requisitos Funcionais

### RF-001: Upload de Arquivo CSV
- **Descrição:** Usuário faz upload do arquivo da fatura
- **Regras de negócio:**
  - Aceitar apenas `.csv`
  - Tamanho máximo: 5 MB
  - Encoding: UTF-8 (com suporte a BOM)
  - Validar estrutura antes de processar

### RF-002: Parsing do CSV
- **Descrição:** Extrair transações do formato Nubank
- **Regras de negócio:**
  - Formato esperado: Data, Hora, Valor, Identificador, Descrição
  - Valor negativo = despesa (converter para positivo)
  - Valor positivo = ignorar (pagamento de fatura, estornos)
  - Ignorar linhas inválidas (avisar quantidade)

### RF-003: Pré-visualização das Transações
- **Descrição:** Mostrar tabela com transações antes de importar
- **Regras de negócio:**
  - Exibir: data, descrição, valor, categoria sugerida
  - Permitir editar categoria por linha
  - Checkbox para desmarcar linhas indesejadas
  - Contador: "X de Y transações selecionadas"

### RF-004: Sugestão de Categorias
- **Descrição:** Inferir categoria pela descrição
- **Regras de negócio:**
  - Palavras-chave: "supermercado" → Alimentação, "uber" → Transporte
  - Se não identificar: deixar sem categoria (usuário escolhe)
  - Caso insensitive

### RF-005: Importar Selecionadas
- **Descrição:** Inserir transações escolhidas em batch
- **Regras de negócio:**
  - Todas com `source = 'csv_nubank'`
  - Usar Supabase bulk insert (um único request)
  - Se erro, abortar tudo (transação atômica)
  - Toast com quantidade importada

---

## 3. User Stories

### 🎯 US-001: Importar Fatura do Nubank
**Como** usuário  
**Quero** importar minha fatura do Nubank  
**Para** não lançar 50 transações manualmente

**Cenário:** Importação bem-sucedida
```gherkin
Dado que baixei o CSV da fatura do Nubank
Quando acesso Transações > Importar
E clico em "Selecionar arquivo"
E escolho o arquivo "fatura-marco.csv"
Então vejo loading "Processando arquivo..."
E após 2 segundos vejo pré-visualização
E vejo "32 transações encontradas"
E todas as linhas estão marcadas
E vejo categorias sugeridas para algumas
Quando clico em "Importar 32 transações"
Então vejo toast "32 transações importadas com sucesso"
E sou redirecionado para /transacoes
E vejo as transações na lista
```

---

### 🎯 US-002: Revisar Antes de Importar
**Como** usuário  
**Quero** escolher quais transações importar  
**Para** não duplicar gastos já lançados

**Cenário:** Desmarcar algumas transações
```gherkin
Dado que estou na pré-visualização
E vejo 10 transações
Quando desmarco 3 transações
Então vejo contador "7 de 10 selecionadas"
Quando clico em "Importar 7 transações"
Então apenas 7 são importadas
```

---

### 🎯 US-003: Arquivo Inválido
**Como** usuário  
**Quero** ver mensagem clara se arquivo estiver errado  
**Para** saber o que fazer

**Cenário:** CSV com formato incorreto
```gherkin
Dado que selecionei arquivo "planilha-qualquer.csv"
E o arquivo não tem as colunas esperadas
Quando o parser processa
Então vejo erro "Arquivo não é uma fatura do Nubank"
E vejo mensagem "Certifique-se de baixar o CSV correto"
E vejo link "Como baixar a fatura?"
```

---

## 4. Parsing do CSV

### Formato Esperado (Nubank)
```csv
Data,Hora,Valor,Identificador,Descrição
2025-07-15,10:30:00,-150.00,abc123,Restaurante XYZ
2025-07-14,09:00:00,-89.90,def456,Supermercado ABC
2025-07-13,,,,-Pagamento recebido  # Ignorar (positivo)
```

### Função de Parsing
**Arquivo:** `lib/utils/csv-parsers/nubank.ts`

```typescript
import Papa from 'papaparse'

export interface NubankTransaction {
  date: string
  description: string
  amount: number
  originalRow: number
}

export interface ParseResult {
  data: NubankTransaction[]
  errors: string[]
  totalRows: number
}

const REQUIRED_COLUMNS = ['Data', 'Valor', 'Descrição']

export async function parseNubankCSV(file: File): Promise<ParseResult> {
  return new Promise((resolve) => {
    const errors: string[] = []
    const transactions: NubankTransaction[] = []

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      encoding: 'UTF-8',
      transformHeader: (header) => header.trim(),
      complete: (results) => {
        const headers = results.meta.fields || []

        // Validar colunas obrigatórias
        const missingColumns = REQUIRED_COLUMNS.filter(
          (col) => !headers.some((h) => h.toLowerCase() === col.toLowerCase())
        )

        if (missingColumns.length > 0) {
          errors.push(`Colunas obrigatórias ausentes: ${missingColumns.join(', ')}`)
          return resolve({ data: [], errors, totalRows: 0 })
        }

        // Processar linhas
        results.data.forEach((row: any, index: number) => {
          try {
            const value = parseFloat(row.Valor || row.valor)
            
            // Ignorar valores positivos (pagamentos/estornos)
            if (value >= 0) return

            // Ignorar linhas sem data ou descrição
            if (!row.Data && !row.data) return
            if (!row.Descrição && !row.descrição) return

            const date = row.Data || row.data
            const description = (row.Descrição || row.descrição || '').trim()

            // Validar formato de data (YYYY-MM-DD)
            if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
              errors.push(`Linha ${index + 2}: data inválida "${date}"`)
              return
            }

            transactions.push({
              date,
              description,
              amount: Math.abs(value),
              originalRow: index + 2,
            })
          } catch (error) {
            errors.push(`Linha ${index + 2}: erro ao processar`)
          }
        })

        resolve({
          data: transactions,
          errors,
          totalRows: results.data.length,
        })
      },
      error: (error) => {
        errors.push(`Erro ao ler arquivo: ${error.message}`)
        resolve({ data: [], errors, totalRows: 0 })
      },
    })
  })
}

// Sugerir categoria pela descrição
export function suggestCategory(description: string, categories: Category[]): string | null {
  const desc = description.toLowerCase()

  const keywords: Record<string, string[]> = {
    'Alimentação': ['supermercado', 'mercado', 'padaria', 'restaurante', 'lanche', 'ifood', 'rappi'],
    'Transporte': ['uber', '99', 'posto', 'gasolina', 'estacionamento', 'pedágio'],
    'Lazer': ['cinema', 'netflix', 'spotify', 'ingresso', 'show'],
    'Saúde': ['farmácia', 'drogaria', 'consulta', 'hospital', 'clínica'],
  }

  for (const [categoryName, words] of Object.entries(keywords)) {
    if (words.some(word => desc.includes(word))) {
      const category = categories.find(c => c.name === categoryName)
      return category?.id || null
    }
  }

  return null
}
```

---

## 5. Componentes React

### 5.1 Página de Importação
**Arquivo:** `app/(app)/transacoes/importar/page.tsx`

```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, Check, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { parseNubankCSV, suggestCategory } from '@/lib/utils/csv-parsers/nubank'
import { useCategories } from '@/lib/hooks/useCategories'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/lib/hooks/useUser'
import { TransactionPreview } from '@/components/import/TransactionPreview'
import type { NubankTransaction } from '@/lib/utils/csv-parsers/nubank'

interface TransactionToImport extends NubankTransaction {
  category_id: string | null
  selected: boolean
}

export default function ImportPage() {
  const [step, setStep] = useState<'upload' | 'preview' | 'importing'>('upload')
  const [transactions, setTransactions] = useState<TransactionToImport[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const router = useRouter()
  const { toast } = useToast()
  const { data: categories } = useCategories()
  const { data: user } = useUser()
  const supabase = createClient()

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?[0]
    if (!file) return

    if (!file.name.endsWith('.csv')) {
      toast({ title: 'Arquivo deve ser .csv', variant: 'destructive' })
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'Arquivo muito grande (máximo 5 MB)', variant: 'destructive' })
      return
    }

    try {
      const result = await parseNubankCSV(file)

      if (result.errors.length > 0) {
        setErrors(result.errors)
      }

      if (result.data.length === 0) {
        toast({
          title: 'Nenhuma transação encontrada',
          description: 'Certifique-se de baixar o CSV correto do Nubank',
          variant: 'destructive',
        })
        return
      }

      const withCategories = result.data.map((t) => ({
        ...t,
        category_id: categories ? suggestCategory(t.description, categories) : null,
        selected: true,
      }))

      setTransactions(withCategories)
      setStep('preview')
    } catch (error) {
      toast({ title: 'Erro ao processar arquivo', variant: 'destructive' })
    }
  }

  const handleImport = async () => {
    if (!user) return

    const selected = transactions.filter((t) => t.selected)

    if (selected.length === 0) {
      toast({ title: 'Selecione pelo menos uma transação', variant: 'destructive' })
      return
    }

    // Validar que todas têm categoria
    const withoutCategory = selected.filter((t) => !t.category_id)
    if (withoutCategory.length > 0) {
      toast({
        title: `${withoutCategory.length} transações sem categoria`,
        description: 'Selecione uma categoria para todas',
        variant: 'destructive',
      })
      return
    }

    setStep('importing')

    try {
      const { error } = await supabase.from('transactions').insert(
        selected.map((t) => ({
          user_id: user.id,
          type: 'expense',
          amount: t.amount,
          description: t.description,
          category_id: t.category_id,
          date: t.date,
          source: 'csv_nubank',
        }))
      )

      if (error) throw error

      toast({
        title: `${selected.length} transações importadas com sucesso`,
      })

      router.push('/transacoes')
    } catch (error) {
      toast({ title: 'Erro ao importar transações', variant: 'destructive' })
      setStep('preview')
    }
  }

  if (step === 'upload') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Importar Fatura do Nubank</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground mb-4">
                Selecione o arquivo CSV da sua fatura
              </p>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
                id="csv-upload"
              />
              <label htmlFor="csv-upload">
                <Button asChild>
                  <span>Selecionar arquivo</span>
                </Button>
              </label>
            </div>

            <div className="text-xs text-muted-foreground space-y-1">
              <p>✓ Formatos aceitos: .csv</p>
              <p>✓ Tamanho máximo: 5 MB</p>
              <p>✓ Até 100 transações por arquivo</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (step === 'preview') {
    return (
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Pré-visualização</h1>
          <Button onClick={() => setStep('upload')} variant="outline">
            Voltar
          </Button>
        </div>

        {errors.length > 0 && (
          <Card className="border-yellow-500">
            <CardContent className="p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold">Avisos:</p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside">
                    {errors.map((error, i) => (
                      <li key={i}>{error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <TransactionPreview
          transactions={transactions}
          onUpdate={setTransactions}
        />

        <div className="sticky bottom-20 p-4 bg-background border-t">
          <Button onClick={handleImport} className="w-full" size="lg">
            <Check className="mr-2 h-5 w-5" />
            Importar {transactions.filter((t) => t.selected).length} transações
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4" />
      <p className="text-muted-foreground">Importando transações...</p>
    </div>
  )
}
```

---

## 6. Edge Cases

### EC-001: Arquivo com BOM (Byte Order Mark)
**Problema:** Excel exporta CSV com BOM UTF-8  
**Solução:** Papa Parse detecta automaticamente  
**Teste:** Importar CSV do Excel

### EC-002: Mais de 100 transações
**Problema:** Arquivo com 200 linhas  
**Solução:** Limitar preview a 100, avisar usuário  
**UI:** "Arquivo muito grande. Apenas as 100 primeiras serão importadas."

### EC-003: Transações duplicadas
**Problema:** Usuário importa mesmo arquivo duas vezes  
**Solução:** Não detectar automaticamente no MVP  
**UI:** Exibir aviso: "Verifique se não está importando transações duplicadas"

---

## 7. Testes Sugeridos

### Teste: Parsing de CSV válido
```typescript
test('Parsear CSV do Nubank', async () => {
  const csv = `Data,Hora,Valor,Identificador,Descrição
2026-03-15,10:30:00,-150.00,abc123,Restaurante XYZ
2026-03-14,09:00:00,-89.90,def456,Supermercado ABC`

  const file = new File([csv], 'fatura.csv', { type: 'text/csv' })
  const result = await parseNubankCSV(file)

  expect(result.data.length).toBe(2)
  expect(result.data[0].amount).toBe(150)
  expect(result.data[0].description).toBe('Restaurante XYZ')
})
```

---

## 8. Links para Tasks

- **TASK-018:** Parser do CSV do Nubank
- **TASK-019:** Fluxo de importação de CSV

---

**Última atualização:** Março 2026
