import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { SummaryCard } from '@/components/finance/SummaryCard';
import { Button, Card, EmptyState } from '@/components/ui';
import { createReportQueries, type MonthlyReport } from '@/db/queries/reportQueries';
import { createSettingsRepository } from '@/db/repositories/settingsRepository';
import { subscribeToFinanceDataChanges } from '@/lib/dataEvents';
import { formatSignedCentsToCurrency, type AppCurrency } from '@/lib/money';
import { formatMonthLabel } from '@/lib/month';
import { generateAndShareReportPdf, type PdfResult } from '@/features/reports/pdf/reportPdf';
import { buildLocalReportSummary } from '@/lib/reportSummary';
import type { Result } from '@/lib/result';
import { normalizeCurrency, SETTINGS_KEYS } from '@/lib/settings/preferences';

type ReportQueries = ReturnType<typeof createReportQueries>;
type SettingsRepository = ReturnType<typeof createSettingsRepository>;
type PdfGenerator = (report: MonthlyReport, year: number, month: number, currency: AppCurrency) => Promise<Result<PdfResult>>;

let defaultReportQueries: ReportQueries | undefined;
let defaultSettingsRepository: SettingsRepository | undefined;

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

function getDefaultSettingsRepository() {
  defaultSettingsRepository ??= createSettingsRepository();
  return defaultSettingsRepository;
}

function monthLabel(year: number, month: number) {
  const formatted = formatMonthLabel(year, month);
  return formatted.ok ? formatted.value : `${month}/${year}`;
}

function percent(value: number | null) {
  return value === null ? 'sem base anterior' : `${value > 0 ? '+' : ''}${value}%`;
}

function transactionAmountCents(transaction: { amountCents: number; type: 'income' | 'expense' }) {
  return transaction.type === 'expense' ? -Math.abs(transaction.amountCents) : Math.abs(transaction.amountCents);
}

export function ReportScreen({ reportQueries, settingsRepository, pdfGenerator = generateAndShareReportPdf }: { reportQueries?: ReportQueries; settingsRepository?: SettingsRepository; pdfGenerator?: PdfGenerator }) {
  const [selectedMonth, setSelectedMonth] = useState(currentYearMonth);
  const [currency, setCurrency] = useState<AppCurrency>('BRL');
  const [report, setReport] = useState<MonthlyReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfMessage, setPdfMessage] = useState<string | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const loadRequestRef = useRef(0);
  const pdfRequestRef = useRef(0);

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

  useEffect(() => {
    if (!settingsRepository && reportQueries) return;
    const timer = setTimeout(() => {
      const repository = settingsRepository ?? getDefaultSettingsRepository();
      void repository.getSetting(SETTINGS_KEYS.currency).then((setting) => setCurrency(normalizeCurrency(setting?.value))).catch(() => undefined);
    }, 0);
    return () => clearTimeout(timer);
  }, [reportQueries, settingsRepository]);

  function changeMonth(offset: number) {
    loadRequestRef.current += 1;
    pdfRequestRef.current += 1;
    setPdfLoading(false);
    setPdfMessage(null);
    setPdfError(null);
    setReport(null);
    setSelectedMonth((current) => moveMonth(current.year, current.month, offset));
  }


  async function handleGeneratePdf() {
    if (!report) return;
    const requestId = ++pdfRequestRef.current;
    setPdfLoading(true);
    setPdfMessage(null);
    setPdfError(null);
    const result = await pdfGenerator(report, selectedMonth.year, selectedMonth.month, currency);
    if (requestId !== pdfRequestRef.current) return;
    setPdfLoading(false);
    if (!result.ok) { setPdfError(result.error.message); return; }
    setPdfMessage(result.value.shared ? 'PDF gerado e compartilhado.' : 'PDF gerado. Compartilhamento indisponível neste dispositivo.');
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

      <Card>
        <Button testID="generate-report-pdf-button" loading={pdfLoading} onPress={handleGeneratePdf}>Gerar PDF</Button>
        {pdfMessage ? <Text style={styles.success}>{pdfMessage}</Text> : null}
        {pdfError ? <Text accessibilityRole="alert" style={styles.pdfError}>{pdfError}</Text> : null}
      </Card>

      {!report.hasData ? <Card><EmptyState title="Relatório sem dados" message="Registre transações neste mês para gerar análise, comparação e PDF local." testID="report-empty-state" /></Card> : null}

      <View style={styles.grid}>
        <SummaryCard label="Receitas" value={formatSignedCentsToCurrency(report.incomeCents, currency)} tone="income" />
        <SummaryCard label="Despesas" value={formatSignedCentsToCurrency(report.expenseCents, currency)} tone="expense" />
        <SummaryCard label="Saldo do período" value={formatSignedCentsToCurrency(report.balanceCents, currency)} tone={report.balanceCents < 0 ? 'expense' : 'income'} />
      </View>

      <Card>
        <Text style={styles.sectionTitle}>Observações locais</Text>
        <Text style={styles.muted}>{buildLocalReportSummary(report, currency)}</Text>
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Comparação com mês anterior</Text>
        <Text style={styles.rowText}>Receitas anteriores: {formatSignedCentsToCurrency(report.previous.previousIncomeCents, currency)} ({formatSignedCentsToCurrency(report.previous.incomeDiffCents, currency)}, {percent(report.previous.incomeDiffPercent)})</Text>
        <Text style={styles.rowText}>Despesas anteriores: {formatSignedCentsToCurrency(report.previous.previousExpenseCents, currency)} ({formatSignedCentsToCurrency(report.previous.expenseDiffCents, currency)}, {percent(report.previous.expenseDiffPercent)})</Text>
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Gastos por categoria</Text>
        {report.expenseCategories.length === 0 ? <Text style={styles.muted}>Lance despesas para ver a participação de cada categoria.</Text> : report.expenseCategories.map((category) => (
          <View key={category.categoryId} style={styles.row}>
            <Text style={styles.rowName}>{category.categoryName}</Text>
            <Text style={styles.rowText}>{formatSignedCentsToCurrency(category.amountCents, currency)} • {category.percent}%</Text>
          </View>
        ))}
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Transações do período</Text>
        {report.transactions.length === 0 ? <Text style={styles.muted}>As transações do mês aparecem aqui depois do primeiro lançamento.</Text> : report.transactions.map((transaction) => (
          <View key={transaction.id} style={styles.transactionRow}>
            <Text style={styles.rowName}>{transaction.date} · {transaction.description}</Text>
            <Text style={styles.rowText}>{transaction.categoryName} · {transaction.accountName}</Text>
            <Text style={[styles.amount, transaction.type === 'expense' && styles.expense]}>{formatSignedCentsToCurrency(transactionAmountCents(transaction), currency)}</Text>
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
  lightText: { color: '#475569', fontWeight: '800' },
  error: { color: '#b91c1c', fontWeight: '900' },
  success: { marginTop: 10, color: '#047857', fontSize: 15, fontWeight: '900' },
  pdfError: { marginTop: 10, color: '#b91c1c', fontSize: 15, fontWeight: '900' },
  row: { marginTop: 12, flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  transactionRow: { marginTop: 14, gap: 4 },
  rowName: { color: '#0f172a', fontSize: 16, fontWeight: '900' },
  rowText: { marginTop: 10, color: '#475569', fontSize: 15, fontWeight: '800' },
  amount: { color: '#047857', fontSize: 16, fontWeight: '900', fontVariant: ['tabular-nums'] },
  expense: { color: '#b91c1c' },
});
