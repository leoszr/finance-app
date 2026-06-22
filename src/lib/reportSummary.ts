import { formatSignedCentsToCurrency, type AppCurrency } from '@/lib/money';

type SummaryInput = {
  incomeCents: number;
  expenseCents: number;
  balanceCents: number;
  previous: { previousIncomeCents: number; previousExpenseCents: number; incomeDiffCents: number; expenseDiffCents: number };
};

export function buildLocalReportSummary(report: SummaryInput, currency: AppCurrency = 'BRL') {
  const previousIsEmpty = report.previous.previousIncomeCents === 0 && report.previous.previousExpenseCents === 0;
  if (report.incomeCents === 0 && report.expenseCents === 0 && previousIsEmpty) return 'Sem movimentações neste mês. Nada para comparar por enquanto.';
  if (previousIsEmpty) {
    return `Este mês teve ${formatSignedCentsToCurrency(report.incomeCents, currency)} em receitas, ${formatSignedCentsToCurrency(report.expenseCents, currency)} em despesas e saldo de ${formatSignedCentsToCurrency(report.balanceCents, currency)}. Mês anterior sem dados.`;
  }

  const expenseDirection = report.previous.expenseDiffCents > 0 ? 'aumentaram' : report.previous.expenseDiffCents < 0 ? 'caíram' : 'ficaram iguais';
  const incomeDirection = report.previous.incomeDiffCents > 0 ? 'subiram' : report.previous.incomeDiffCents < 0 ? 'caíram' : 'ficaram iguais';
  return `Receitas ${incomeDirection} ${formatSignedCentsToCurrency(Math.abs(report.previous.incomeDiffCents), currency)} e despesas ${expenseDirection} ${formatSignedCentsToCurrency(Math.abs(report.previous.expenseDiffCents), currency)} vs. mês anterior. Saldo do mês: ${formatSignedCentsToCurrency(report.balanceCents, currency)}.`;
}
