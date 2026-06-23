import type { MonthlyReport } from '@/db/queries/reportQueries';
import { formatSignedCentsToCurrency, type AppCurrency } from '@/lib/money';
import { formatMonthLabel } from '@/lib/month';
import { buildLocalReportSummary } from '@/lib/reportSummary';

function escapeHtml(value: string) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function monthLabel(year: number, month: number) {
  const formatted = formatMonthLabel(year, month);
  return formatted.ok ? formatted.value : `${month}/${year}`;
}

function transactionAmountCents(transaction: { amountCents: number; type: 'income' | 'expense' }) {
  return transaction.type === 'expense' ? -Math.abs(transaction.amountCents) : Math.abs(transaction.amountCents);
}

export function buildReportPdfHtml(report: MonthlyReport, year: number, month: number, currency: AppCurrency = 'BRL') {
  const categories = report.expenseCategories.length === 0
    ? '<tr><td colspan="3">Sem despesas neste mês.</td></tr>'
    : report.expenseCategories.map((category) => `<tr><td>${escapeHtml(category.categoryName)}</td><td>${formatSignedCentsToCurrency(category.amountCents, currency)}</td><td>${category.percent}%</td></tr>`).join('');
  const transactions = report.transactions.length === 0
    ? '<tr><td colspan="5">Nenhuma transação no período.</td></tr>'
    : report.transactions.map((transaction) => `<tr><td>${escapeHtml(transaction.date)}</td><td>${escapeHtml(transaction.description)}</td><td>${escapeHtml(transaction.categoryName)}</td><td>${escapeHtml(transaction.accountName)}</td><td>${formatSignedCentsToCurrency(transactionAmountCents(transaction), currency)}</td></tr>`).join('');

  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <title>Relatório financeiro mensal</title>
  <style>
    @page { size: A4; margin: 24mm; }
    body { color: #0f172a; font-family: Arial, sans-serif; font-size: 12px; }
    h1 { font-size: 24px; margin: 0 0 4px; }
    h2 { font-size: 16px; margin: 24px 0 8px; }
    .muted { color: #475569; }
    .cards { display: table; width: 100%; margin: 18px 0; table-layout: fixed; }
    .card { border: 1px solid #cbd5e1; border-radius: 8px; display: table-cell; padding: 12px; }
    .label { color: #475569; font-size: 10px; font-weight: bold; text-transform: uppercase; }
    .value { font-size: 18px; font-weight: bold; margin-top: 6px; }
    table { border-collapse: collapse; margin-top: 8px; width: 100%; page-break-inside: auto; }
    tr { page-break-inside: avoid; page-break-after: auto; }
    th, td { border-bottom: 1px solid #e2e8f0; padding: 8px 6px; text-align: left; vertical-align: top; }
    th { background: #f1f5f9; font-size: 10px; text-transform: uppercase; }
  </style>
</head>
<body>
  <h1>Relatório financeiro mensal</h1>
  <p class="muted">${escapeHtml(monthLabel(year, month))}</p>
  <div class="cards">
    <div class="card"><div class="label">Receitas</div><div class="value">${formatSignedCentsToCurrency(report.incomeCents, currency)}</div></div>
    <div class="card"><div class="label">Despesas</div><div class="value">${formatSignedCentsToCurrency(report.expenseCents, currency)}</div></div>
    <div class="card"><div class="label">Saldo</div><div class="value">${formatSignedCentsToCurrency(report.balanceCents, currency)}</div></div>
  </div>
  <h2>Observações</h2>
  <p>${escapeHtml(buildLocalReportSummary(report, currency))}</p>
  <h2>Gastos por categoria</h2>
  <table><thead><tr><th>Categoria</th><th>Total</th><th>% despesas</th></tr></thead><tbody>${categories}</tbody></table>
  <h2>Transações</h2>
  <table><thead><tr><th>Data</th><th>Descrição</th><th>Categoria</th><th>Conta</th><th>Valor</th></tr></thead><tbody>${transactions}</tbody></table>
</body>
</html>`;
}
