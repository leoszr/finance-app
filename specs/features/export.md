# Feature: Exportação (PDF e Excel)

**Status:** 🔄 Em desenvolvimento  
**Prioridade:** 🟢 BAIXA  
**Sprint:** Sprint 6 - Exportação e Histórico  
**Tasks relacionadas:** TASK-025, TASK-026  
**Estimativa:** 2-3 dias

---

## 1. Visão Geral

Sistema de exportação de extratos financeiros em dois formatos:
- **PDF**: Extrato formatado para impressão
- **Excel (XLSX)**: Planilha para análise

### Objetivos
- ✅ Exportar extrato mensal em PDF
- ✅ Exportar transações em Excel
- ✅ Geração client-side (sem servidor)
- ✅ Download automático no navegador

---

## 2. Requisitos Funcionais

### RF-001: Exportar para PDF
- **Descrição:** Gerar PDF do extrato mensal
- **Regras de negócio:**
  - Biblioteca: jsPDF + jspdf-autotable
  - Conteúdo: cabeçalho, resumo, tabela de transações, rodapé
  - Nome do arquivo: `extrato-[mes]-[ano].pdf`
  - Geração no cliente (sem enviar dados ao servidor)

### RF-002: Exportar para Excel
- **Descrição:** Gerar planilha XLSX com transações
- **Regras de negócio:**
  - Biblioteca: SheetJS (xlsx)
  - 2 planilhas: "Transações" e "Resumo"
  - Nome do arquivo: `extrato-[mes]-[ano].xlsx`
  - Valores como número (não string)
  - Datas formatadas DD/MM/YYYY

### RF-003: Botão de Exportação
- **Descrição:** Botão acessível na página de transações
- **Regras de negócio:**
  - Dropdown com opções: "Exportar PDF" e "Exportar Excel"
  - Desabilitado se não houver transações no mês
  - Loading durante geração

---

## 3. User Stories

### 🎯 US-001: Exportar PDF
**Como** usuário  
**Quero** exportar meu extrato em PDF  
**Para** imprimir ou arquivar

**Cenário:** Exportar mês atual
```gherkin
Dado que tenho 15 transações em março
Quando clico em "Exportar" no cabeçalho
E seleciono "Exportar PDF"
Então vejo loading "Gerando PDF..."
E após 2 segundos o download inicia
E o arquivo se chama "extrato-marco-2026.pdf"
E ao abrir vejo:
  - Cabeçalho com logo e "Extrato - Março 2026"
  - Resumo: Receitas, Despesas, Saldo
  - Tabela com as 15 transações
  - Rodapé com data de geração
```

---

### 🎯 US-002: Exportar Excel
**Como** usuário  
**Quero** exportar em Excel  
**Para** fazer análises avançadas

**Cenário:** Exportar e abrir no Excel
```gherkin
Dado que tenho transações em março
Quando exporto para Excel
Então baixa arquivo "extrato-marco-2026.xlsx"
E ao abrir no Excel vejo:
  - Planilha "Transações" com colunas:
    Data | Descrição | Categoria | Tipo | Valor
  - Planilha "Resumo" com:
    Total de Receitas | Total de Despesas | Saldo
E valores estão formatados como moeda
E posso fazer fórmulas sobre os dados
```

---

## 4. Implementação

### 4.1 Exportar PDF
**Arquivo:** `lib/utils/export/pdf.ts`

```typescript
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { formatCurrency } from '../currency'
import type { Transaction } from '@/lib/types'

interface ExportPDFOptions {
  transactions: Transaction[]
  month: Date
  userName: string
  summary: {
    totalIncome: number
    totalExpenses: number
    balance: number
  }
}

export async function exportToPDF({
  transactions,
  month,
  userName,
  summary,
}: ExportPDFOptions) {
  const doc = new jsPDF()

  const monthName = format(month, 'MMMM yyyy', { locale: ptBR })

  // Cabeçalho
  doc.setFontSize(20)
  doc.text('Finanças', 14, 20)
  doc.setFontSize(12)
  doc.text(`Extrato - ${monthName}`, 14, 28)
  doc.setFontSize(10)
  doc.text(userName, 14, 34)

  // Resumo
  doc.setFontSize(11)
  doc.text('Resumo do Mês', 14, 45)

  autoTable(doc, {
    startY: 50,
    head: [['Tipo', 'Valor']],
    body: [
      ['Receitas', formatCurrency(summary.totalIncome)],
      ['Despesas', formatCurrency(summary.totalExpenses)],
      ['Saldo', formatCurrency(summary.balance)],
    ],
    theme: 'grid',
    headStyles: { fillColor: [100, 100, 100] },
  })

  // Tabela de transações
  const finalY = (doc as any).lastAutoTable.finalY || 80

  doc.setFontSize(11)
  doc.text('Transações', 14, finalY + 10)

  const tableData = transactions.map((t) => [
    format(new Date(t.date), 'dd/MM/yyyy'),
    t.description,
    t.category?.name || 'Sem categoria',
    t.type === 'income' ? 'Receita' : 'Despesa',
    formatCurrency(t.amount),
  ])

  autoTable(doc, {
    startY: finalY + 15,
    head: [['Data', 'Descrição', 'Categoria', 'Tipo', 'Valor']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [70, 130, 180] },
    styles: { fontSize: 9 },
    columnStyles: {
      0: { cellWidth: 25 },
      1: { cellWidth: 60 },
      2: { cellWidth: 35 },
      3: { cellWidth: 25 },
      4: { cellWidth: 30, halign: 'right' },
    },
  })

  // Rodapé
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.text(
      `Gerado em ${format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}`,
      14,
      doc.internal.pageSize.height - 10
    )
    doc.text(
      `Página ${i} de ${pageCount}`,
      doc.internal.pageSize.width - 40,
      doc.internal.pageSize.height - 10
    )
  }

  // Download
  const filename = `extrato-${format(month, 'MMMM-yyyy', { locale: ptBR })}.pdf`
  doc.save(filename)
}
```

---

### 4.2 Exportar Excel
**Arquivo:** `lib/utils/export/excel.ts`

```typescript
import * as XLSX from 'xlsx'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { Transaction } from '@/lib/types'

interface ExportExcelOptions {
  transactions: Transaction[]
  month: Date
  summary: {
    totalIncome: number
    totalExpenses: number
    balance: number
  }
}

export async function exportToExcel({
  transactions,
  month,
  summary,
}: ExportExcelOptions) {
  // Criar workbook
  const wb = XLSX.utils.book_new()

  // Planilha 1: Transações
  const transactionsData = transactions.map((t) => ({
    Data: format(new Date(t.date), 'dd/MM/yyyy'),
    Descrição: t.description,
    Categoria: t.category?.name || 'Sem categoria',
    Tipo: t.type === 'income' ? 'Receita' : 'Despesa',
    Valor: Number(t.amount),
  }))

  const ws1 = XLSX.utils.json_to_sheet(transactionsData)

  // Largura das colunas
  ws1['!cols'] = [
    { wch: 12 }, // Data
    { wch: 40 }, // Descrição
    { wch: 20 }, // Categoria
    { wch: 10 }, // Tipo
    { wch: 15 }, // Valor
  ]

  // Formato de moeda para coluna Valor
  const range = XLSX.utils.decode_range(ws1['!ref']!)
  for (let row = range.s.r + 1; row <= range.e.r; row++) {
    const cellAddress = XLSX.utils.encode_cell({ r: row, c: 4 }) // Coluna E (Valor)
    if (ws1[cellAddress]) {
      ws1[cellAddress].z = 'R$ #,##0.00'
    }
  }

  XLSX.utils.book_append_sheet(wb, ws1, 'Transações')

  // Planilha 2: Resumo
  const summaryData = [
    { Tipo: 'Receitas', Valor: summary.totalIncome },
    { Tipo: 'Despesas', Valor: summary.totalExpenses },
    { Tipo: 'Saldo', Valor: summary.balance },
  ]

  const ws2 = XLSX.utils.json_to_sheet(summaryData)

  ws2['!cols'] = [
    { wch: 15 }, // Tipo
    { wch: 20 }, // Valor
  ]

  XLSX.utils.book_append_sheet(wb, ws2, 'Resumo')

  // Download
  const filename = `extrato-${format(month, 'MMMM-yyyy', { locale: ptBR })}.xlsx`
  XLSX.writeFile(wb, filename)
}
```

---

### 4.3 Componente de Exportação
**Arquivo:** `components/transactions/ExportButton.tsx`

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
import { useTransactions } from '@/lib/hooks/useTransactions'
import { useUser } from '@/lib/hooks/useUser'
import { useToast } from '@/components/ui/use-toast'
import { exportToPDF } from '@/lib/utils/export/pdf'
import { exportToExcel } from '@/lib/utils/export/excel'

interface ExportButtonProps {
  month: Date
}

export function ExportButton({ month }: ExportButtonProps) {
  const [loading, setLoading] = useState(false)
  const { data: transactions } = useTransactions(month)
  const { data: user } = useUser()
  const { toast } = useToast()

  const hasTransactions = transactions && transactions.length > 0

  const summary = transactions
    ? {
        totalIncome: transactions
          .filter((t) => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0),
        totalExpenses: transactions
          .filter((t) => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0),
        balance: 0,
      }
    : { totalIncome: 0, totalExpenses: 0, balance: 0 }

  summary.balance = summary.totalIncome - summary.totalExpenses

  const handleExportPDF = async () => {
    if (!transactions || !user) return

    setLoading(true)

    try {
      await exportToPDF({
        transactions,
        month,
        userName: user.email?.split('@')[0] || 'Usuário',
        summary,
      })

      toast({
        title: 'PDF exportado com sucesso',
      })
    } catch (error) {
      toast({
        title: 'Erro ao exportar PDF',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleExportExcel = async () => {
    if (!transactions) return

    setLoading(true)

    try {
      await exportToExcel({
        transactions,
        month,
        summary,
      })

      toast({
        title: 'Excel exportado com sucesso',
      })
    } catch (error) {
      toast({
        title: 'Erro ao exportar Excel',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={!hasTransactions || loading}>
          <Download className="mr-2 h-4 w-4" />
          {loading ? 'Exportando...' : 'Exportar'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={handleExportPDF}>
          Exportar PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportExcel}>
          Exportar Excel
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

---

## 5. Integração na Página

**Arquivo:** `app/(app)/transacoes/page.tsx`

```typescript
// Adicionar no cabeçalho da página
<div className="flex items-center justify-between mb-4">
  <h1>Transações</h1>
  <ExportButton month={currentMonth} />
</div>
```

---

## 6. Edge Cases

### EC-001: Muitas transações (100+)
**Problema:** PDF com 10 páginas fica pesado  
**Solução:** Limitar a 100 por exportação  
**UI:** Avisar: "Apenas as 100 primeiras transações serão exportadas"

### EC-002: Caracteres especiais
**Problema:** Descrição com emoji ou caracteres Unicode  
**Solução:** jsPDF suporta UTF-8  
**Teste:** Transação com descrição "Café ☕"

### EC-003: Sem transações
**Problema:** Exportar mês vazio  
**Solução:** Desabilitar botão se lista vazia  
**UI:** Botão cinza com tooltip "Nenhuma transação para exportar"

---

## 7. Testes Sugeridos

### Teste: Geração de PDF
```typescript
test('Gerar PDF com transações', async () => {
  const transactions = [
    { date: '2026-03-15', description: 'Teste', amount: 100, type: 'expense', category: { name: 'Alimentação' } },
  ]

  // Mock do jsPDF
  const mockSave = jest.fn()
  jest.mock('jspdf', () => ({
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      save: mockSave,
      text: jest.fn(),
      setFontSize: jest.fn(),
    })),
  }))

  await exportToPDF({
    transactions,
    month: new Date('2026-03-01'),
    userName: 'Teste',
    summary: { totalIncome: 0, totalExpenses: 100, balance: -100 },
  })

  expect(mockSave).toHaveBeenCalledWith('extrato-março-2026.pdf')
})
```

---

## 8. Links para Tasks

- **TASK-025:** Exportar para PDF
- **TASK-026:** Exportar para Excel

---

**Última atualização:** Março 2026
