import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { SummaryCard } from '@/components/finance/SummaryCard';
import { Button, Card, EmptyState } from '@/components/ui';
import { createReportQueries, type MonthlyReport } from '@/db/queries/reportQueries';
import { subscribeToFinanceDataChanges } from '@/lib/dataEvents';
import { formatCentsToCurrency } from '@/lib/money';
import { formatMonthLabel } from '@/lib/month';
import { buildLocalReportSummary } from '@/lib/reportSummary';

type ReportQueries = ReturnType<typeof createReportQueries>;

let defaultReportQueries: ReportQueries | undefined;

function currentYearMonth() {
  const date = new Date();
  return { year: date.getFullYear(), month: date.getMonth() + 1 };
}

function moveMonth(year: number, month: number, offset: number) {
  const date = new Date(year, month - 1 + offset, 1);
  return { year: date.getFullYear(), month: date.getMonth() + 1 };
}

function getDefaultReportQueries() {
  defaultReportQueries ??= createReportQueries();
  return defaultReportQueries;
}

function money(cents: number) {
  const formatted = formatCentsToCurrency(Math.abs(cents));
  return `${cents < 0 ? '-' : ''}${formatted.ok ? formatted.value : 'R$ 0,00'}`;
}

function monthLabel(year: number, month: number) {
  const formatted = formatMonthLabel(year, month);
  return formatted.ok ? formatted.value : `${month}/${year}`;
}

function percent(value: number | null) {
  return value === null ? 'sem base anterior' : `${value > 0 ? '+' : ''}${value}%`;
}

export function ReportScreen({ reportQueries }: { reportQueries?: ReportQueries }) {
  const [selectedMonth, setSelectedMonth] = useState(currentYearMonth);
  const [report, setReport] = useState<MonthlyReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const loadRequestRef = useRef(0);

  const loadData = useCallback(async () => {
    const requestId = ++loadRequestRef.current;
    try {
      const result = await (reportQueries ?? getDefaultReportQueries()).getMonthlyReport(selectedMonth.year, selectedMonth.month);
      if (requestId !== loadRequestRef.current) return;
      if (!result.ok) { setError(result.error.message); return; }
      setError(null);
      setReport(result.value);
    } catch {
      if (requestId === loadRequestRef.current) setError('Relatório indisponível.');
    }
  }, [reportQueries, selectedMonth.month, selectedMonth.year]);

  useEffect(() => {
    const timer = setTimeout(() => void loadData(), 0);
    const unsubscribe = subscribeToFinanceDataChanges(() => void loadData());
    return () => { clearTimeout(timer); unsubscribe(); };
  }, [loadData]);

  function changeMonth(offset: number) {
    loadRequestRef.current += 1;
    setReport(null);
    setSelectedMonth((current) => moveMonth(current.year, current.month, offset));
  }

  if (error) return <Text accessibilityRole="alert" style={styles.error}>{error}</Text>;
  if (!report) return <Text style={styles.lightText}>Carregando relatório...</Text>;

  return (
    <View style={styles.stack}>
      <Card>
        <View style={styles.monthRow}>
          <Button testID="report-previous-month-button" onPress={() => changeMonth(-1)}>Mês anterior</Button>
          <Text testID="report-selected-month-label" style={styles.month}>{monthLabel(selectedMonth.year, selectedMonth.month)}</Text>
          <Button testID="report-next-month-button" onPress={() => changeMonth(1)}>Mês seguinte</Button>
        </View>
      </Card>

      {!report.hasData ? <Card><EmptyState title="Relatório sem dados" message="Nenhuma movimentação neste mês." testID="report-empty-state" /></Card> : null}

      <View style={styles.grid}>
        <SummaryCard label="Receitas" value={money(report.incomeCents)} tone="income" />
        <SummaryCard label="Despesas" value={money(report.expenseCents)} tone="expense" />
        <SummaryCard label="Saldo do período" value={money(report.balanceCents)} tone={report.balanceCents < 0 ? 'expense' : 'income'} />
      </View>

      <Card>
        <Text style={styles.sectionTitle}>Observações locais</Text>
        <Text style={styles.muted}>{buildLocalReportSummary(report)}</Text>
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Comparação com mês anterior</Text>
        <Text style={styles.rowText}>Receitas anteriores: {money(report.previous.previousIncomeCents)} ({money(report.previous.incomeDiffCents)}, {percent(report.previous.incomeDiffPercent)})</Text>
        <Text style={styles.rowText}>Despesas anteriores: {money(report.previous.previousExpenseCents)} ({money(report.previous.expenseDiffCents)}, {percent(report.previous.expenseDiffPercent)})</Text>
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Gastos por categoria</Text>
        {report.expenseCategories.length === 0 ? <Text style={styles.muted}>Sem despesas neste mês.</Text> : report.expenseCategories.map((category) => (
          <View key={category.categoryId} style={styles.row}>
            <Text style={styles.rowName}>{category.categoryName}</Text>
            <Text style={styles.rowText}>{money(category.amountCents)} • {category.percent}%</Text>
          </View>
        ))}
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Transações do período</Text>
        {report.transactions.length === 0 ? <Text style={styles.muted}>Nenhuma transação no período.</Text> : report.transactions.map((transaction) => (
          <View key={transaction.id} style={styles.transactionRow}>
            <Text style={styles.rowName}>{transaction.date} · {transaction.description}</Text>
            <Text style={styles.rowText}>{transaction.categoryName} · {transaction.accountName}</Text>
            <Text style={[styles.amount, transaction.type === 'expense' && styles.expense]}>{transaction.type === 'expense' ? '-' : ''}{money(transaction.amountCents)}</Text>
          </View>
        ))}
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 16 },
  grid: { gap: 12 },
  monthRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 10, justifyContent: 'space-between' },
  month: { color: '#0f172a', fontSize: 16, fontWeight: '900', textTransform: 'capitalize' },
  sectionTitle: { color: '#0f172a', fontSize: 20, fontWeight: '900' },
  muted: { marginTop: 10, color: '#64748b', fontSize: 15, fontWeight: '700', lineHeight: 22 },
  lightText: { color: '#f8fafc', fontWeight: '800' },
  error: { color: '#fecaca', fontWeight: '900' },
  row: { marginTop: 12, flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  transactionRow: { marginTop: 14, gap: 4 },
  rowName: { color: '#0f172a', fontSize: 16, fontWeight: '900' },
  rowText: { marginTop: 10, color: '#475569', fontSize: 15, fontWeight: '800' },
  amount: { color: '#047857', fontSize: 16, fontWeight: '900' },
  expense: { color: '#b91c1c' },
});
