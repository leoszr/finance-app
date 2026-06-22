import { formatCentsToCurrency } from '@/lib/money';

type SummaryInput = {
  incomeCents: number;
  expenseCents: number;
  balanceCents: number;
  previous: { previousIncomeCents: number; previousExpenseCents: number; incomeDiffCents: number; expenseDiffCents: number };
};

function money(cents: number) {
  const formatted = formatCentsToCurrency(Math.abs(cents));
  return `${cents < 0 ? '-' : ''}${formatted.ok ? formatted.value : 'R$ 0,00'}`;
}

export function buildLocalReportSummary(report: SummaryInput) {
  const previousIsEmpty = report.previous.previousIncomeCents === 0 && report.previous.previousExpenseCents === 0;
  if (report.incomeCents === 0 && report.expenseCents === 0 && previousIsEmpty) return 'Sem movimentações neste mês. Nada para comparar por enquanto.';
  if (previousIsEmpty) {
    return `Este mês teve ${money(report.incomeCents)} em receitas, ${money(report.expenseCents)} em despesas e saldo de ${money(report.balanceCents)}. Mês anterior sem dados.`;
  }

  const expenseDirection = report.previous.expenseDiffCents > 0 ? 'aumentaram' : report.previous.expenseDiffCents < 0 ? 'caíram' : 'ficaram iguais';
  const incomeDirection = report.previous.incomeDiffCents > 0 ? 'subiram' : report.previous.incomeDiffCents < 0 ? 'caíram' : 'ficaram iguais';
  return `Receitas ${incomeDirection} ${money(Math.abs(report.previous.incomeDiffCents))} e despesas ${expenseDirection} ${money(Math.abs(report.previous.expenseDiffCents))} vs. mês anterior. Saldo do mês: ${money(report.balanceCents)}.`;
}
