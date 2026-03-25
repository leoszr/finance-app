# Sprint 6 — Exportação e Histórico

**Objetivo:** Exportar dados para PDF/Excel e navegação avançada pelo histórico.  
**Estimativa:** 3–4 dias  
**Status:** 🔴 Não iniciado  
**Tasks:** TASK-025, TASK-026, TASK-027

---

## Visão Geral

Esta sprint permite que usuários exportem dados financeiros e naveguem pelo histórico completo:
- Exportação de extratos mensais para PDF
- Exportação para Excel com múltiplas planilhas
- Filtros avançados de transações (período, categoria, valor)

Ao final, o usuário poderá gerar relatórios profissionais e analisar dados históricos com facilidade.

---

## TASK-025: Exportar para PDF

**Descrição expandida:**  
Gerar PDF do extrato mensal com tabela de transações e resumo financeiro usando jsPDF + jspdf-autotable, completamente no cliente (sem backend).

### Arquivos a criar/modificar

```
├── lib/utils/export/
│   └── pdf.ts                     (função de geração)
├── components/transactions/
│   └── ExportButton.tsx           (botão com menu)
```

### Código exemplo

#### `lib/utils/export/pdf.ts`
```typescript
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { Transaction } from '@/lib/types'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { formatCurrency } from '@/lib/utils/currency'

/**
 * Gerar PDF do extrato mensal
 * 
 * @param transactions Array de transações do mês
 * @param month Data do mês (para título)
 * @param summary Resumo financeiro (receitas, despesas, saldo)
 * @param userName Nome do usuário
 */
export async function generateMonthlyPDF(
  transactions: Transaction[],
  month: Date,
  summary: {
    totalIncome: number
    totalExpenses: number
    balance: number
  },
  userName?: string
): Promise<void> {
  // Criar documento PDF
  const doc = new jsPDF()

  // Configurações
  const pageWidth = doc.internal.pageSize.getWidth()
  const monthLabel = format(month, "MMMM 'de' yyyy", { locale: ptBR })

  // ====================================
  // CABEÇALHO
  // ====================================

  // Título
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('Extrato Financeiro', pageWidth / 2, 20, { align: 'center' })

  // Mês
  doc.setFontSize(14)
  doc.setFont('helvetica', 'normal')
  doc.text(monthLabel, pageWidth / 2, 30, { align: 'center' })

  // Nome do usuário (se fornecido)
  if (userName) {
    doc.setFontSize(10)
    doc.setTextColor(100)
    doc.text(userName, pageWidth / 2, 38, { align: 'center' })
    doc.setTextColor(0)
  }

  // ====================================
  // RESUMO FINANCEIRO
  // ====================================

  const summaryY = userName ? 48 : 40

  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('Resumo do Período', 14, summaryY)

  autoTable(doc, {
    startY: summaryY + 5,
    head: [['', 'Valor']],
    body: [
      ['Receitas', formatCurrency(summary.totalIncome)],
      ['Despesas', formatCurrency(summary.totalExpenses)],
      [
        'Saldo',
        {
          content: formatCurrency(summary.balance),
          styles: {
            textColor: summary.balance >= 0 ? [22, 163, 74] : [220, 38, 38], // green/red
            fontStyle: 'bold',
          },
        },
      ],
    ],
    theme: 'grid',
    headStyles: {
      fillColor: [63, 63, 70], // zinc-700
      textColor: 255,
      fontSize: 10,
    },
    bodyStyles: {
      fontSize: 10,
    },
    columnStyles: {
      0: { cellWidth: 40 },
      1: { halign: 'right', cellWidth: 40 },
    },
    margin: { left: 14, right: 14 },
  })

  // ====================================
  // TABELA DE TRANSAÇÕES
  // ====================================

  const transactionsY = (doc as any).lastAutoTable.finalY + 15

  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('Transações', 14, transactionsY)

  // Preparar dados da tabela
  const tableData = transactions.map((t) => [
    format(new Date(t.date), 'dd/MM/yyyy'),
    t.description,
    t.category?.name || '-',
    t.type === 'income' ? 'Receita' : 'Despesa',
    {
      content: formatCurrency(Number(t.amount)),
      styles: {
        textColor: t.type === 'income' ? [22, 163, 74] : [220, 38, 38],
        fontStyle: 'bold',
      },
    },
  ])

  autoTable(doc, {
    startY: transactionsY + 5,
    head: [['Data', 'Descrição', 'Categoria', 'Tipo', 'Valor']],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: [63, 63, 70],
      textColor: 255,
      fontSize: 9,
    },
    bodyStyles: {
      fontSize: 9,
    },
    columnStyles: {
      0: { cellWidth: 25 },
      1: { cellWidth: 60 },
      2: { cellWidth: 35 },
      3: { cellWidth: 25, halign: 'center' },
      4: { cellWidth: 30, halign: 'right' },
    },
    margin: { left: 14, right: 14 },
    didDrawPage: (data) => {
      // Rodapé em todas as páginas
      const pageCount = doc.getNumberOfPages()
      const currentPage = doc.getCurrentPageInfo().pageNumber

      doc.setFontSize(8)
      doc.setTextColor(150)
      doc.text(
        `Página ${currentPage} de ${pageCount}`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      )

      doc.text(
        `Gerado em ${format(new Date(), 'dd/MM/yyyy HH:mm')}`,
        14,
        doc.internal.pageSize.getHeight() - 10
      )
    },
  })

  // ====================================
  // SALVAR PDF
  // ====================================

  const fileName = `extrato-${format(month, 'yyyy-MM')}.pdf`
  doc.save(fileName)
}
```

#### `components/transactions/ExportButton.tsx`
```typescript
'use client'

import { useState } from 'react'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useTransactions, useMonthSummary } from '@/lib/hooks/useTransactions'
import { generateMonthlyPDF } from '@/lib/utils/export/pdf'
import { generateMonthlyExcel } from '@/lib/utils/export/excel'
import { useToast } from '@/components/ui/use-toast'
import { createClient } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'

interface ExportButtonProps {
  month: Date
}

export function ExportButton({ month }: ExportButtonProps) {
  const [exporting, setExporting] = useState(false)
  const { toast } = useToast()

  const { data: transactions = [] } = useTransactions({ month })
  const summary = useMonthSummary(month)

  // Buscar nome do usuário
  const supabase = createClient()
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      return user
    },
  })

  async function handleExportPDF() {
    if (transactions.length === 0) {
      toast({
        title: 'Nenhuma transação',
        description: 'Não há transações para exportar neste período.',
        variant: 'destructive',
      })
      return
    }

    setExporting(true)
    try {
      await generateMonthlyPDF(
        transactions,
        month,
        summary,
        user?.user_metadata?.full_name
      )

      toast({
        title: 'PDF gerado',
        description: 'O arquivo foi baixado com sucesso.',
      })
    } catch (error) {
      console.error('Erro ao gerar PDF:', error)
      toast({
        title: 'Erro ao gerar PDF',
        description: 'Não foi possível gerar o arquivo.',
        variant: 'destructive',
      })
    } finally {
      setExporting(false)
    }
  }

  async function handleExportExcel() {
    if (transactions.length === 0) {
      toast({
        title: 'Nenhuma transação',
        description: 'Não há transações para exportar neste período.',
        variant: 'destructive',
      })
      return
    }

    setExporting(true)
    try {
      await generateMonthlyExcel(transactions, month, summary)

      toast({
        title: 'Excel gerado',
        description: 'O arquivo foi baixado com sucesso.',
      })
    } catch (error) {
      console.error('Erro ao gerar Excel:', error)
      toast({
        title: 'Erro ao gerar Excel',
        description: 'Não foi possível gerar o arquivo.',
        variant: 'destructive',
      })
    } finally {
      setExporting(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={exporting}>
          <Download className="mr-2 h-4 w-4" />
          {exporting ? 'Gerando...' : 'Exportar'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleExportPDF}>
          Exportar como PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportExcel}>
          Exportar como Excel
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

### Passos de implementação

1. **Criar função de geração de PDF**
2. **Criar componente ExportButton**
3. **Adicionar botão na página de transações**
4. **Testar com diferentes quantidades de transações**
5. **Verificar paginação automática (> 1 página)**

### Critérios de aceitação

- [ ] PDF gerado inteiramente no cliente (sem backend)
- [ ] Download inicia automaticamente
- [ ] Nome do arquivo: `extrato-YYYY-MM.pdf`
- [ ] Tabela de resumo com receitas, despesas e saldo
- [ ] Tabela de transações com todas as colunas
- [ ] Paginação automática se > 1 página
- [ ] Rodapé com data de geração e número da página
- [ ] Saldo em verde (positivo) ou vermelho (negativo)
- [ ] Valores monetários formatados como BRL

### Possíveis desafios/edge cases

- **Muitas transações:** jsPDF pode ser lento com 1000+ linhas. Considerar aviso de performance.
- **Caracteres especiais:** jsPDF não suporta emojis. Remover ícones das categorias.
- **Fontes personalizadas:** jsPDF usa apenas Helvetica/Times/Courier por padrão. Suficiente para MVP.

### Dependências

- TASK-007 completa (useTransactions)

### Tempo estimado

**3–4 horas** (incluindo testes de paginação)

---

## TASK-026: Exportar para Excel

**Descrição expandida:**  
Gerar arquivo .xlsx com múltiplas planilhas (Transações + Resumo) usando SheetJS.

### Arquivos a criar/modificar

```
├── lib/utils/export/
│   └── excel.ts                   (função de geração)
```

### Código exemplo (resumido)

#### `lib/utils/export/excel.ts`
```typescript
import * as XLSX from 'xlsx'
import { Transaction } from '@/lib/types'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export async function generateMonthlyExcel(
  transactions: Transaction[],
  month: Date,
  summary: {
    totalIncome: number
    totalExpenses: number
    balance: number
  }
): Promise<void> {
  // Criar workbook
  const wb = XLSX.utils.book_new()

  // ====================================
  // Planilha 1: Transações
  // ====================================

  const transactionsData = transactions.map((t) => ({
    Data: format(new Date(t.date), 'dd/MM/yyyy'),
    Descrição: t.description,
    Categoria: t.category?.name || '-',
    Tipo: t.type === 'income' ? 'Receita' : 'Despesa',
    Valor: Number(t.amount), // Número (não string) para Excel
  }))

  const ws1 = XLSX.utils.json_to_sheet(transactionsData)
  XLSX.utils.book_append_sheet(wb, ws1, 'Transações')

  // ====================================
  // Planilha 2: Resumo
  // ====================================

  const summaryData = [
    { Descrição: 'Receitas', Valor: summary.totalIncome },
    { Descrição: 'Despesas', Valor: summary.totalExpenses },
    { Descrição: 'Saldo', Valor: summary.balance },
  ]

  const ws2 = XLSX.utils.json_to_sheet(summaryData)
  XLSX.utils.book_append_sheet(wb, ws2, 'Resumo')

  // ====================================
  // Salvar arquivo
  // ====================================

  const fileName = `extrato-${format(month, 'yyyy-MM')}.xlsx`
  XLSX.writeFile(wb, fileName)
}
```

### Critérios de aceitação

- [ ] Arquivo .xlsx gerado no cliente
- [ ] Planilha "Transações" com todas as transações
- [ ] Planilha "Resumo" com totais
- [ ] Valores como números (não strings)
- [ ] Datas formatadas como DD/MM/YYYY
- [ ] Download automático

### Dependências

- TASK-025 completa (estrutura similar)

### Tempo estimado

**1–2 horas** (SheetJS é mais simples que jsPDF)

---

## TASK-027: Filtros avançados no histórico

**Descrição expandida:**  
Adicionar painel de filtros na página de transações permitindo busca por período, categoria, tipo e valor.

### Arquivos a criar/modificar

```
├── components/transactions/
│   └── FilterPanel.tsx            (painel de filtros)
├── app/(app)/transacoes/
│   └── page.tsx                   (adicionar filtros)
```

### Código exemplo (resumido)

```typescript
interface Filters {
  startDate?: string
  endDate?: string
  categoryIds: string[]
  type?: 'income' | 'expense'
  minAmount?: number
  maxAmount?: number
}

// Query com filtros aplicados
const { data } = await supabase
  .from('transactions')
  .select('*, category:categories(*)')
  .eq('user_id', user.id)
  .gte('date', filters.startDate || '1900-01-01')
  .lte('date', filters.endDate || '2100-12-31')
  .in('category_id', filters.categoryIds.length > 0 ? filters.categoryIds : allCategoryIds)
  .gte('amount', filters.minAmount || 0)
  .lte('amount', filters.maxAmount || 999999999)
```

### Critérios de aceitação

- [ ] Filtros persistem enquanto usuário está na página
- [ ] Contador de filtros ativos visível (badge)
- [ ] Botão "Limpar filtros"
- [ ] Resultados filtrados exibem contagem
- [ ] Filtros funcionam em conjunto (AND lógico)

### Dependências

- TASK-009 completa

### Tempo estimado

**3–4 horas** (lógica de filtros complexa)

---

## Resumo da Sprint 6

Ao completar esta sprint, o usuário terá:

✅ Exportação para PDF profissional  
✅ Exportação para Excel com planilhas  
✅ Filtros avançados de transações  

**Próxima sprint:** Sprint 7 — Polimento e Testes

---

**Última atualização:** Março 2026  
**Versão:** 1.0
