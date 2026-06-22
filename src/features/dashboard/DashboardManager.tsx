import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { BarRow } from '@/components/charts/BarRow';
import { SummaryCard } from '@/components/finance/SummaryCard';
import { Button, Card, EmptyState } from '@/components/ui';
import { createDashboardQueries, type MonthlyDashboardSummary } from '@/db/queries/dashboardQueries';
import { createSettingsRepository } from '@/db/repositories/settingsRepository';
import { formatMonthLabel } from '@/lib/month';
import { subscribeToFinanceDataChanges } from '@/lib/dataEvents';
import { formatCentsToCurrency, type AppCurrency } from '@/lib/money';
import { normalizeCurrency, normalizeInitialMonth, SETTINGS_KEYS } from '@/lib/settings/preferences';

type DashboardQueries = ReturnType<typeof createDashboardQueries>;
type SettingsRepository = ReturnType<typeof createSettingsRepository>;

let defaultDashboardQueries: DashboardQueries | undefined;
let defaultSettingsRepository: SettingsRepository | undefined;

function currentYearMonth() {
  const date = new Date();
  return { year: date.getFullYear(), month: date.getMonth() + 1 };
}

function moveMonth(year: number, month: number, offset: number) {
  const date = new Date(year, month - 1 + offset, 1);
  return { year: date.getFullYear(), month: date.getMonth() + 1 };
}

function getDefaultDashboardQueries() {
  defaultDashboardQueries ??= createDashboardQueries();
  return defaultDashboardQueries;
}

function getDefaultSettingsRepository() {
  defaultSettingsRepository ??= createSettingsRepository();
  return defaultSettingsRepository;
}

function money(cents: number, currency: AppCurrency) {
  const formatted = formatCentsToCurrency(Math.abs(cents), currency);
  return `${cents < 0 ? '-' : ''}${formatted.ok ? formatted.value : 'R$ 0,00'}`;
}

function monthLabel(year: number, month: number) {
  const formatted = formatMonthLabel(year, month);
  return formatted.ok ? formatted.value : `${month}/${year}`;
}

export function DashboardManager({ dashboardQueries, settingsRepository }: { dashboardQueries?: DashboardQueries; settingsRepository?: SettingsRepository }) {
  const [selectedMonth, setSelectedMonth] = useState(currentYearMonth);
  const [currency, setCurrency] = useState<AppCurrency>('BRL');
  const [summary, setSummary] = useState<MonthlyDashboardSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const loadRequestRef = useRef(0);

  const loadData = useCallback(async () => {
    const requestId = ++loadRequestRef.current;
    try {
      const result = await (dashboardQueries ?? getDefaultDashboardQueries()).getMonthlySummary(selectedMonth.year, selectedMonth.month);
      if (requestId !== loadRequestRef.current) return;
      if (!result.ok) { setError(result.error.message); return; }
      setError(null);
      setSummary(result.value);
    } catch {
      if (requestId === loadRequestRef.current) setError('Dashboard indisponível.');
    }
  }, [dashboardQueries, selectedMonth.month, selectedMonth.year]);

  useEffect(() => {
    if (!settingsRepository && dashboardQueries) return;
    const timer = setTimeout(() => {
      let repository: SettingsRepository;
      try {
        repository = settingsRepository ?? getDefaultSettingsRepository();
      } catch {
        return;
      }
      void Promise.all([
        repository.getSetting(SETTINGS_KEYS.currency),
        repository.getSetting(SETTINGS_KEYS.initialMonth),
      ]).then(async ([savedCurrency, savedInitialMonth]) => {
        setCurrency(normalizeCurrency(savedCurrency?.value));
        if (normalizeInitialMonth(savedInitialMonth?.value) === 'lastWithData') {
          const latest = await (dashboardQueries ?? getDefaultDashboardQueries()).getLatestTransactionMonth();
          if (latest) setSelectedMonth(latest);
        }
      });
    }, 0);
    return () => clearTimeout(timer);
  }, [dashboardQueries, settingsRepository]);

  useEffect(() => {
    const timer = setTimeout(() => void loadData(), 0);
    const unsubscribe = subscribeToFinanceDataChanges(() => void loadData());
    return () => { clearTimeout(timer); unsubscribe(); };
  }, [loadData]);

  if (error) {
    return <Text accessibilityRole="alert" style={styles.error}>{error}</Text>;
  }

  if (!summary) {
    return <Text style={styles.lightText}>Carregando dashboard...</Text>;
  }

  const maxCategory = Math.max(...summary.expenseCategories.map((category) => category.amountCents), 0);
  const maxFlow = Math.max(summary.incomeCents, summary.expenseCents, 0);

  return (
    <View style={styles.stack}>
      <Card>
        <View style={styles.monthRow}>
          <Button testID="dashboard-previous-month-button" onPress={() => setSelectedMonth((current) => moveMonth(current.year, current.month, -1))}>Mês anterior</Button>
          <Text testID="dashboard-selected-month-label" style={styles.month}>{monthLabel(selectedMonth.year, selectedMonth.month)}</Text>
          <Button testID="dashboard-next-month-button" onPress={() => setSelectedMonth((current) => moveMonth(current.year, current.month, 1))}>Mês seguinte</Button>
        </View>
      </Card>

      {!summary.hasData ? (
        <Card>
          <EmptyState title="Sem dados ainda" message="Cadastre contas e transações para liberar seu resumo financeiro." testID="dashboard-empty-state" />
        </Card>
      ) : null}

      <View style={styles.grid}>
        <SummaryCard label="Receitas" value={money(summary.incomeCents, currency)} tone="income" />
        <SummaryCard label="Despesas" value={money(summary.expenseCents, currency)} tone="expense" />
        <SummaryCard label="Saldo mensal" value={money(summary.balanceCents, currency)} tone={summary.balanceCents < 0 ? 'expense' : 'income'} />
        <SummaryCard label="Saldo total" value={money(summary.totalBalanceCents, currency)} />
      </View>

      <Card>
        <Text style={styles.sectionTitle}>Receita x despesa</Text>
        {maxFlow === 0 ? <Text style={styles.muted}>Sem receitas ou despesas neste mês.</Text> : (
          <View style={styles.chart}>
            <BarRow label="Receitas" value={money(summary.incomeCents, currency)} ratio={summary.incomeCents / maxFlow} color="#10b981" />
            <BarRow label="Despesas" value={money(summary.expenseCents, currency)} ratio={summary.expenseCents / maxFlow} color="#ef4444" />
          </View>
        )}
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Maiores gastos por categoria</Text>
        {summary.expenseCategories.length === 0 ? <Text style={styles.muted}>Sem despesas neste mês.</Text> : (
          <View style={styles.chart}>
            {summary.expenseCategories.map((category) => (
              <BarRow key={category.categoryId} label={category.categoryName} value={money(category.amountCents, currency)} ratio={category.amountCents / maxCategory} />
            ))}
          </View>
        )}
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Saldo por conta</Text>
        {summary.accountBalances.length === 0 ? <Text style={styles.muted}>Nenhuma conta cadastrada.</Text> : summary.accountBalances.map((account) => (
          <View key={account.accountId} style={styles.accountRow}>
            <Text style={styles.accountName}>{account.accountName}</Text>
            <Text style={styles.accountValue}>{money(account.balanceCents, currency)}</Text>
          </View>
        ))}
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 16 },
  grid: { gap: 12 },
  chart: { gap: 14, marginTop: 14 },
  monthRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 10, justifyContent: 'space-between' },
  month: { color: '#0f172a', fontSize: 16, fontWeight: '900', textTransform: 'capitalize' },
  sectionTitle: { color: '#0f172a', fontSize: 20, fontWeight: '900' },
  muted: { marginTop: 10, color: '#64748b', fontSize: 15, fontWeight: '700' },
  lightText: { color: '#f8fafc', fontWeight: '800' },
  error: { color: '#fecaca', fontWeight: '900' },
  accountRow: { marginTop: 12, flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  accountName: { color: '#0f172a', fontSize: 16, fontWeight: '900' },
  accountValue: { color: '#334155', fontSize: 16, fontWeight: '900' },
});
