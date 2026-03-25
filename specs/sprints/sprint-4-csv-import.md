# Sprint 4 — Import de CSV

**Objetivo:** Importação de faturas do Nubank via arquivo CSV.  
**Estimativa:** 3–4 dias  
**Status:** 🔴 Não iniciado  
**Tasks:** TASK-018, TASK-019

---

## Visão Geral

Esta sprint permite que usuários importem transações em massa a partir do CSV da fatura do cartão Nubank. O fluxo completo inclui:
- Upload do arquivo CSV
- Parse e validação dos dados
- Pré-visualização com mapeamento de categorias
- Importação em batch

Esta feature economiza tempo significativo para usuários que têm muitas transações mensais.

---

## TASK-018: Parser do CSV do Nubank

**Descrição expandida:**  
Implementar função robusta para fazer parse do CSV da fatura do Nubank, tratando diferentes formatos, encodings e edge cases.

### Arquivos a criar/modificar

```
├── lib/utils/csv-parsers/
│   ├── nubank.ts                  (parser principal)
│   └── types.ts                   (tipos do parser)
```

### Código exemplo

#### `lib/utils/csv-parsers/types.ts`
```typescript
/**
 * Tipos para parsers de CSV
 */

export interface ParsedTransaction {
  date: string // YYYY-MM-DD
  description: string
  amount: number
  originalData?: Record<string, any> // dados brutos para debug
}

export interface ParseResult {
  success: boolean
  data: ParsedTransaction[]
  errors: ParseError[]
  metadata: {
    totalRows: number
    validRows: number
    invalidRows: number
    institution: string
  }
}

export interface ParseError {
  row: number
  field: string
  message: string
  originalValue?: any
}
```

#### `lib/utils/csv-parsers/nubank.ts`
```typescript
import Papa from 'papaparse'
import { ParseResult, ParsedTransaction, ParseError } from './types'
import { parse, isValid, format } from 'date-fns'

/**
 * Parser de CSV da fatura do Nubank (cartão de crédito)
 * 
 * Formato esperado:
 * Data,Hora,Valor,Identificador,Descrição
 * 2025-07-15,10:30:00,-150.00,abc123,Restaurante XYZ
 * 
 * Regras:
 * - Valores negativos = despesas (débitos)
 * - Valores positivos = estornos/pagamentos (ignorar)
 * - Data no formato ISO (YYYY-MM-DD) ou brasileiro (DD/MM/YYYY)
 */
export async function parseNubankCSV(file: File): Promise<ParseResult> {
  return new Promise((resolve) => {
    const errors: ParseError[] = []
    const validTransactions: ParsedTransaction[] = []
    let rowIndex = 0

    Papa.parse(file, {
      header: true,
      encoding: 'UTF-8',
      skipEmptyLines: true,
      transformHeader: (header) => {
        // Normalizar nomes de colunas (case-insensitive, remover acentos)
        return header
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .trim()
      },
      step: (row, parser) => {
        rowIndex++
        const data = row.data as any

        // Verificar se é header ou linha vazia
        if (!data || Object.keys(data).length === 0) {
          return
        }

        try {
          // Identificar colunas (names podem variar)
          const dateField = data.data || data.date
          const descField = data.descricao || data.description || data.desc
          const valueField = data.valor || data.value || data.amount

          // Validar campos obrigatórios
          if (!dateField) {
            errors.push({
              row: rowIndex,
              field: 'data',
              message: 'Campo "Data" não encontrado',
            })
            return
          }

          if (!descField) {
            errors.push({
              row: rowIndex,
              field: 'descricao',
              message: 'Campo "Descrição" não encontrado',
            })
            return
          }

          if (!valueField) {
            errors.push({
              row: rowIndex,
              field: 'valor',
              message: 'Campo "Valor" não encontrado',
            })
            return
          }

          // Parse de data (tentar múltiplos formatos)
          let parsedDate: Date | null = null

          const dateFormats = [
            'yyyy-MM-dd', // ISO: 2025-07-15
            'dd/MM/yyyy', // BR: 15/07/2025
            'MM/dd/yyyy', // US: 07/15/2025
          ]

          for (const fmt of dateFormats) {
            const attempt = parse(dateField, fmt, new Date())
            if (isValid(attempt)) {
              parsedDate = attempt
              break
            }
          }

          if (!parsedDate || !isValid(parsedDate)) {
            errors.push({
              row: rowIndex,
              field: 'data',
              message: 'Data inválida',
              originalValue: dateField,
            })
            return
          }

          // Parse de valor
          let amount = 0
          try {
            // Limpar valor (remover R$, espaços, trocar vírgula por ponto)
            const cleanValue = String(valueField)
              .replace('R$', '')
              .replace(/\s/g, '')
              .replace('.', '') // Remove separador de milhar
              .replace(',', '.') // Substitui vírgula decimal por ponto
              .trim()

            amount = parseFloat(cleanValue)

            if (isNaN(amount)) {
              throw new Error('Valor não é um número')
            }
          } catch (error) {
            errors.push({
              row: rowIndex,
              field: 'valor',
              message: 'Valor inválido',
              originalValue: valueField,
            })
            return
          }

          // Ignorar valores positivos (estornos, pagamentos de fatura)
          if (amount >= 0) {
            return
          }

          // Converter valor negativo para positivo (despesa)
          amount = Math.abs(amount)

          // Limpar descrição
          const description = String(descField).trim()

          if (!description || description.length === 0) {
            errors.push({
              row: rowIndex,
              field: 'descricao',
              message: 'Descrição vazia',
            })
            return
          }

          // Validação passou - adicionar transação
          validTransactions.push({
            date: format(parsedDate, 'yyyy-MM-dd'),
            description,
            amount,
            originalData: data,
          })
        } catch (error) {
          errors.push({
            row: rowIndex,
            field: 'unknown',
            message: error instanceof Error ? error.message : 'Erro desconhecido',
          })
        }
      },
      complete: () => {
        resolve({
          success: validTransactions.length > 0,
          data: validTransactions,
          errors,
          metadata: {
            totalRows: rowIndex,
            validRows: validTransactions.length,
            invalidRows: errors.length,
            institution: 'Nubank',
          },
        })
      },
      error: (error) => {
        resolve({
          success: false,
          data: [],
          errors: [
            {
              row: 0,
              field: 'file',
              message: `Erro ao processar arquivo: ${error.message}`,
            },
          ],
          metadata: {
            totalRows: 0,
            validRows: 0,
            invalidRows: 1,
            institution: 'Nubank',
          },
        })
      },
    })
  })
}

/**
 * Validar se arquivo parece ser CSV do Nubank
 * (verificação rápida antes do parse completo)
 */
export function isNubankCSV(file: File): boolean {
  // Verificar extensão
  if (!file.name.toLowerCase().endsWith('.csv')) {
    return false
  }

  // Verificar tamanho (CSV não deve ser maior que 5MB)
  if (file.size > 5 * 1024 * 1024) {
    return false
  }

  return true
}
```

### Passos de implementação

1. **Instalar Papa Parse:**
   ```bash
   npm install papaparse
   npm install -D @types/papaparse
   ```

2. **Criar tipos:**
   - Criar `lib/utils/csv-parsers/types.ts`
   - Definir interfaces conforme exemplo

3. **Implementar parser:**
   - Criar `lib/utils/csv-parsers/nubank.ts`
   - Implementar função `parseNubankCSV`
   - Tratar múltiplos formatos de data

4. **Testar com arquivo real:**
   - Baixar fatura do Nubank (ou criar arquivo de teste)
   - Testar parse com diferentes formatos
   - Verificar tratamento de erros

5. **Validar encoding:**
   - Testar com arquivo UTF-8 com BOM
   - Testar com caracteres especiais (ã, é, ç)

### Critérios de aceitação

- [ ] `parseNubankCSV` retorna `ParseResult` com dados corretos
- [ ] Valores negativos convertidos para positivos (despesas)
- [ ] Valores positivos ignorados (estornos/pagamentos)
- [ ] Múltiplos formatos de data suportados (ISO e BR)
- [ ] Linhas inválidas contadas em `errors` (não quebram o parse)
- [ ] Caracteres especiais (acentos) preservados corretamente
- [ ] Arquivo com BOM UTF-8 funciona sem erro
- [ ] Arquivo vazio retorna `success: false`
- [ ] Arquivo com apenas headers retorna `validRows: 0`

### Possíveis desafios/edge cases

- **CSV com encoding ANSI:** Pode corromper acentos. Papa Parse usa UTF-8 por padrão. Se necessário, converter antes.
- **Formatos de data inconsistentes:** Nubank pode mudar formato. Testar com arquivos de diferentes períodos.
- **Valores com símbolos:** "R$ 1.500,00" vs "1500.00". Limpar todas as variações.
- **Descrições muito longas:** Truncar para 100 caracteres (limite do banco).

### Dependências

- Sprint 0 completa

### Tempo estimado

**3–4 horas** (incluindo testes com arquivos reais)

---

## TASK-019: Fluxo de importação de CSV

**Descrição expandida:**  
Interface completa para upload, pré-visualização, mapeamento de categorias e importação em batch das transações.

### Arquivos a criar/modificar

```
├── app/(app)/transacoes/importar/
│   └── page.tsx                   (página de import)
├── components/import/
│   ├── UploadZone.tsx             (drag-and-drop)
│   ├── TransactionPreview.tsx     (tabela de preview)
│   ├── CategoryMapper.tsx         (select por linha)
│   └── ImportSummary.tsx          (resumo final)
```

### Código exemplo (parcial)

#### `app/(app)/transacoes/importar/page.tsx`
```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { parseNubankCSV } from '@/lib/utils/csv-parsers/nubank'
import { ParsedTransaction } from '@/lib/utils/csv-parsers/types'
import { UploadZone } from '@/components/import/UploadZone'
import { TransactionPreview } from '@/components/import/TransactionPreview'
import { ImportSummary } from '@/components/import/ImportSummary'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useCreateTransaction } from '@/lib/hooks/useTransactions'
import { useToast } from '@/components/ui/use-toast'
import { createClient } from '@/lib/supabase/client'

type Step = 'upload' | 'preview' | 'importing' | 'complete'

interface TransactionToImport extends ParsedTransaction {
  category_id: string
  selected: boolean
}

export default function ImportarPage() {
  const [step, setStep] = useState<Step>('upload')
  const [transactions, setTransactions] = useState<TransactionToImport[]>([])
  const [importing, setImporting] = useState(false)
  const [imported, setImported] = useState(0)

  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  // Handler: arquivo selecionado
  async function handleFileSelect(file: File) {
    try {
      const result = await parseNubankCSV(file)

      if (!result.success || result.data.length === 0) {
        toast({
          title: 'Arquivo inválido',
          description: 'Nenhuma transação válida encontrada no arquivo.',
          variant: 'destructive',
        })
        return
      }

      // Converter para formato de importação (com category_id vazio e selected=true)
      const toImport: TransactionToImport[] = result.data.map((t) => ({
        ...t,
        category_id: '', // Usuário selecionará na próxima etapa
        selected: true,
      }))

      setTransactions(toImport)
      setStep('preview')

      toast({
        title: 'Arquivo processado',
        description: `${result.metadata.validRows} transações encontradas`,
      })
    } catch (error) {
      console.error('Erro ao processar arquivo:', error)
      toast({
        title: 'Erro ao processar',
        description: 'Não foi possível ler o arquivo. Verifique o formato.',
        variant: 'destructive',
      })
    }
  }

  // Handler: confirmar importação
  async function handleImport() {
    const selectedTransactions = transactions.filter((t) => t.selected && t.category_id)

    if (selectedTransactions.length === 0) {
      toast({
        title: 'Nenhuma transação selecionada',
        description: 'Selecione ao menos uma transação e atribua uma categoria.',
        variant: 'destructive',
      })
      return
    }

    setImporting(true)
    setStep('importing')

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      toast({
        title: 'Erro de autenticação',
        description: 'Você precisa estar logado para importar transações.',
        variant: 'destructive',
      })
      return
    }

    // Importar em batch (Supabase aceita array no insert)
    const toInsert = selectedTransactions.map((t) => ({
      user_id: user.id,
      type: 'expense' as const,
      amount: t.amount,
      description: t.description,
      category_id: t.category_id,
      date: t.date,
      is_recurring: false,
      source: 'csv_nubank' as const,
    }))

    try {
      const { error } = await supabase.from('transactions').insert(toInsert)

      if (error) {
        console.error('Erro ao importar:', error)
        throw new Error('Falha na importação')
      }

      setImported(selectedTransactions.length)
      setStep('complete')

      toast({
        title: 'Importação concluída',
        description: `${selectedTransactions.length} transações importadas com sucesso!`,
      })
    } catch (error) {
      toast({
        title: 'Erro na importação',
        description: 'Não foi possível importar as transações. Tente novamente.',
        variant: 'destructive',
      })
      setImporting(false)
      setStep('preview')
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      {/* Header com navegação */}
      <div className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex items-center gap-4 px-6 py-4">
          <button
            onClick={() => router.back()}
            className="rounded-lg p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              Importar transações
            </h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {step === 'upload' && 'Faça upload do CSV da fatura do Nubank'}
              {step === 'preview' && 'Revise e atribua categorias'}
              {step === 'importing' && 'Importando transações...'}
              {step === 'complete' && 'Importação concluída'}
            </p>
          </div>
        </div>
      </div>

      {/* Conteúdo por etapa */}
      <div className="px-6 py-6">
        {step === 'upload' && <UploadZone onFileSelect={handleFileSelect} />}

        {step === 'preview' && (
          <>
            <TransactionPreview
              transactions={transactions}
              onChange={setTransactions}
            />
            <div className="mt-6 flex gap-3">
              <Button variant="outline" onClick={() => setStep('upload')}>
                Voltar
              </Button>
              <Button onClick={handleImport} className="flex-1">
                Importar {transactions.filter((t) => t.selected).length} transações
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </>
        )}

        {step === 'importing' && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-zinc-200 border-t-green-600" />
            <p className="mt-4 text-zinc-600 dark:text-zinc-400">
              Importando transações...
            </p>
          </div>
        )}

        {step === 'complete' && (
          <>
            <ImportSummary imported={imported} />
            <div className="mt-6">
              <Button onClick={() => router.push('/transacoes')} className="w-full">
                Ver transações
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
```

#### `components/import/UploadZone.tsx`
```typescript
'use client'

import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'

interface UploadZoneProps {
  onFileSelect: (file: File) => void
}

export function UploadZone({ onFileSelect }: UploadZoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0])
      }
    },
    [onFileSelect]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
    },
    maxFiles: 1,
    multiple: false,
  })

  return (
    <div
      {...getRootProps()}
      className={cn(
        'flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 transition-colors',
        isDragActive
          ? 'border-green-600 bg-green-50 dark:bg-green-950'
          : 'border-zinc-300 bg-white hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-950'
      )}
    >
      <input {...getInputProps()} />

      {isDragActive ? (
        <>
          <Upload className="h-12 w-12 text-green-600" />
          <p className="mt-4 text-lg font-semibold text-green-700 dark:text-green-300">
            Solte o arquivo aqui
          </p>
        </>
      ) : (
        <>
          <FileText className="h-12 w-12 text-zinc-400" />
          <p className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Arraste o CSV ou clique para selecionar
          </p>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Suporte: Fatura do cartão Nubank (formato CSV)
          </p>
        </>
      )}
    </div>
  )
}
```

#### `components/import/TransactionPreview.tsx`
```typescript
'use client'

import { useState } from 'react'
import { TransactionToImport } from '@/app/(app)/transacoes/importar/page'
import { useCategories } from '@/lib/hooks/useCategories'
import { formatCurrency } from '@/lib/utils/currency'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface TransactionPreviewProps {
  transactions: TransactionToImport[]
  onChange: (transactions: TransactionToImport[]) => void
}

export function TransactionPreview({ transactions, onChange }: TransactionPreviewProps) {
  const { data: categories = [] } = useCategories('expense')

  function handleToggle(index: number) {
    const updated = [...transactions]
    updated[index].selected = !updated[index].selected
    onChange(updated)
  }

  function handleCategoryChange(index: number, categoryId: string) {
    const updated = [...transactions]
    updated[index].category_id = categoryId
    onChange(updated)
  }

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex items-center justify-between rounded-t-lg bg-zinc-100 px-4 py-3 dark:bg-zinc-800">
        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          {transactions.filter((t) => t.selected).length} de {transactions.length} selecionadas
        </p>
      </div>

      {/* Lista (scroll se > 10 itens) */}
      <div className="max-h-96 space-y-2 overflow-y-auto">
        {transactions.map((transaction, index) => (
          <div
            key={index}
            className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
          >
            {/* Checkbox */}
            <Checkbox
              checked={transaction.selected}
              onCheckedChange={() => handleToggle(index)}
            />

            {/* Info da transação */}
            <div className="flex-1">
              <p className="font-medium text-zinc-900 dark:text-zinc-100">
                {transaction.description}
              </p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {format(new Date(transaction.date), "dd 'de' MMMM", { locale: ptBR })} •{' '}
                {formatCurrency(transaction.amount)}
              </p>
            </div>

            {/* Select de categoria */}
            <Select
              value={transaction.category_id}
              onValueChange={(value) => handleCategoryChange(index, value)}
              disabled={!transaction.selected}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>
    </div>
  )
}
```

### Passos de implementação

1. **Instalar react-dropzone:**
   ```bash
   npm install react-dropzone
   ```

2. **Criar componente UploadZone:**
   - Drag-and-drop funcional
   - Aceitar apenas .csv

3. **Criar componente TransactionPreview:**
   - Tabela scrollável com checkboxes
   - Select de categoria por linha

4. **Criar página de import:**
   - Gerenciar estados (upload → preview → importing → complete)
   - Importar em batch via Supabase

5. **Adicionar link no app:**
   - Botão "Importar CSV" na página de transações

### Critérios de aceitação

- [ ] Drag-and-drop funciona em mobile e desktop
- [ ] Parse do CSV executado ao selecionar arquivo
- [ ] Pré-visualização mostra todas as transações encontradas
- [ ] Usuário pode desmarcar transações individualmente
- [ ] Select de categoria obrigatório para importar
- [ ] Importação em batch não falha com 100+ transações
- [ ] Toast de sucesso com quantidade importada
- [ ] Redirecionamento para /transacoes após importar
- [ ] Arquivo inválido exibe mensagem de erro clara
- [ ] Estado de loading enquanto importando (spinner)

### Possíveis desafios/edge cases

- **Arquivo muito grande:** Limitar a 5MB (já validado no parser)
- **Timeout na importação:** Batch do Supabase pode demorar. Considerar chunks de 50 transações.
- **Categoria não selecionada:** Validar antes de importar (toast de erro)
- **Transações duplicadas:** MVP não detecta. Avisar usuário para verificar manualmente.

### Dependências

- TASK-018 completa

### Tempo estimado

**5–6 horas** (incluindo componentes de UI e testes)

---

## Resumo da Sprint 4

Ao completar esta sprint, o usuário poderá:

✅ Fazer upload de CSV da fatura do Nubank  
✅ Visualizar transações encontradas antes de importar  
✅ Atribuir categorias em massa  
✅ Importar 100+ transações em segundos  

**Próxima sprint:** Sprint 5 — Investimentos

---

**Última atualização:** Março 2026  
**Versão:** 1.0
