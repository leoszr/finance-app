import { jsPDF } from 'jspdf'

import { formatCurrencyBRL } from '@/lib/formatters'
import {
  assertTransactionsAvailable,
  formatExportMonthLabel,
  formatExportMonthStamp,
  mapTransactionsExportRows,
  type ExportTransactionsPayload
} from '@/lib/export/transactions-export-shared'

function drawSummaryCard(
  doc: jsPDF,
  x: number,
  y: number,
  width: number,
  title: string,
  value: string
) {
  doc.setDrawColor(226, 232, 240)
  doc.roundedRect(x, y, width, 18, 2, 2)
  doc.setFontSize(9)
  doc.setTextColor(71, 85, 105)
  doc.text(title, x + 4, y + 6)
  doc.setFontSize(11)
  doc.setTextColor(15, 23, 42)
  doc.text(value, x + 4, y + 13)
}

function drawTableHeader(doc: jsPDF, startY: number) {
  doc.setFillColor(241, 245, 249)
  doc.rect(12, startY, 186, 8, 'F')
  doc.setFontSize(8)
  doc.setTextColor(15, 23, 42)
  doc.text('Data', 14, startY + 5.5)
  doc.text('Tipo', 36, startY + 5.5)
  doc.text('Categoria', 58, startY + 5.5)
  doc.text('Descricao', 104, startY + 5.5)
  doc.text('Valor', 175, startY + 5.5, { align: 'right' })
}

export async function exportTransactionsPdf({
  month,
  transactions,
  summary,
  appliedFilters = []
}: ExportTransactionsPayload) {
  assertTransactionsAvailable(transactions)

  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const rows = mapTransactionsExportRows(transactions)
  const monthLabel = formatExportMonthLabel(month)
  const fileName = `extrato_${formatExportMonthStamp(month)}.pdf`

  doc.setFontSize(18)
  doc.setTextColor(15, 23, 42)
  doc.text('Extrato financeiro', 12, 18)

  doc.setFontSize(10)
  doc.setTextColor(71, 85, 105)
  doc.text(`Referencia: ${monthLabel}`, 12, 25)
  doc.text(`Transacoes exportadas: ${transactions.length}`, 12, 31)

  if (appliedFilters.length > 0) {
    doc.text(`Filtros: ${appliedFilters.join(' • ')}`, 12, 37, { maxWidth: 186 })
  }

  const summaryY = appliedFilters.length > 0 ? 44 : 38
  const cardWidth = 58

  drawSummaryCard(doc, 12, summaryY, cardWidth, 'Receitas', formatCurrencyBRL(summary.income))
  drawSummaryCard(doc, 76, summaryY, cardWidth, 'Despesas', formatCurrencyBRL(summary.expense))
  drawSummaryCard(doc, 140, summaryY, cardWidth, 'Saldo', formatCurrencyBRL(summary.balance))

  let cursorY = summaryY + 28
  drawTableHeader(doc, cursorY)
  cursorY += 12

  doc.setFontSize(8)

  rows.forEach((row) => {
    if (cursorY > 284) {
      doc.addPage()
      cursorY = 16
      drawTableHeader(doc, cursorY)
      cursorY += 12
    }

    doc.setTextColor(51, 65, 85)
    doc.text(row.Data, 14, cursorY)
    doc.text(row.Tipo, 36, cursorY)
    doc.text(doc.splitTextToSize(row.Categoria, 42), 58, cursorY, { maxWidth: 42 })
    doc.text(doc.splitTextToSize(row.Descricao, 64), 104, cursorY, { maxWidth: 64 })
    doc.text(row.Valor, 175, cursorY, { align: 'right' })

    doc.setDrawColor(226, 232, 240)
    doc.line(12, cursorY + 3, 198, cursorY + 3)
    cursorY += 10
  })

  await doc.save(fileName, { returnPromise: true })
}
