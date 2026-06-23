import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import { BarRow } from '@/components/charts/BarRow';
import { BudgetDonut } from '@/components/charts/BudgetDonut';
import { SummaryCard } from '@/components/finance/SummaryCard';
import { Button, Card, EmptyState } from '@/components/ui';
import { createBudgetQueries, type MonthlyBudgetSummary } from '@/db/queries/budgetQueries';
import { createDashboardQueries, type MonthlyDashboardSummary } from '@/db/queries/dashboardQueries';
import { createSettingsRepository } from '@/db/repositories/settingsRepository';
import { formatMonthLabel } from '@/lib/month';
import { subscribeToFinanceDataChanges } from '@/lib/dataEvents';
import { formatSignedCentsToCurrency, type AppCurrency } from '@/lib/money';
import { normalizeCurrency, normalizeInitialMonth, SETTINGS_KEYS } from '@/lib/settings/preferences';

type DashboardQueries = ReturnType<typeof createDashboardQueries>;
type BudgetQueries = ReturnType<typeof createBudgetQueries>;
type SettingsRepository = ReturnType<typeof createSettingsRepository>;

let defaultDashboardQueries: DashboardQueries | undefined;
let defaultBudgetQueries: BudgetQueries | undefined;
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

function getDefaultBudgetQueries() {
  defaultBudgetQueries ??= createBudgetQueries();
  return defaultBudgetQueries;
}

function getDefaultSettingsRepository() {
  defaultSettingsRepository ??= createSettingsRepository();
  return defaultSettingsRepository;
}

function monthLabel(year: number, month: number) {
  const formatted = formatMonthLabel(year, month);
  return formatted.ok ? formatted.value : `${month}/${year}`;
}

function daysLeftInMonth(year: number, month: number) {
  const now = new Date();
  if (now.getFullYear() !== year || now.getMonth() + 1 !== month) return new Date(year, month, 0).getDate();
  return new Date(year, month, 0).getDate() - now.getDate() + 1;
}

function QuickAction({ icon, title, hint, onPress }: { icon: string; title: string; hint: string; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.quickAction, pressed && styles.quickActionPressed]}>
      <View style={styles.quickIcon}><Text style={styles.quickIconText}>{icon}</Text></View>
      <Text style={styles.quickTitle}>{title}</Text>
      <Text style={styles.quickHint}>{hint}</Text>
    </Pressable>
  );
}

export function DashboardManager({ dashboardQueries, settingsRepository }: { dashboardQueries?: DashboardQueries; settingsRepository?: SettingsRepository }) {
  const [selectedMonth, setSelectedMonth] = useState(currentYearMonth);
  const [currency, setCurrency] = useState<AppCurrency>('BRL');
  const [summary, setSummary] = useState<MonthlyDashboardSummary | null>(null);
  const [budgetSummary, setBudgetSummary] = useState<MonthlyBudgetSummary | null>(null);
  const [budgetLoadFailed, setBudgetLoadFailed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loadRequestRef = useRef(0);

  const loadData = useCallback(async () => {
    const requestId = ++loadRequestRef.current;
    try {
      const budgetPromise = dashboardQueries
        ? Promise.resolve(null)
        : Promise.resolve()
          .then(() => getDefaultBudgetQueries().getMonthlyBudgetSummary(selectedMonth.year, selectedMonth.month))
          .catch(() => null);
      const [result, budgetResult] = await Promise.all([
        (dashboardQueries ?? getDefaultDashboardQueries()).getMonthlySummary(selectedMonth.year, selectedMonth.month),
        budgetPromise,
      ]);
      if (requestId !== loadRequestRef.current) return;
      if (!result.ok) { setError(result.error.message); return; }
      if (budgetResult && !budgetResult.ok) { setError(budgetResult.error.message); return; }
      setError(null);
      setSummary(result.value);
      setBudgetSummary(budgetResult?.ok ? budgetResult.value : null);
      setBudgetLoadFailed(!dashboardQueries && budgetResult === null);
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
          <EmptyState title="Monte seu painel financeiro" message="Crie uma conta, adicione categorias e registre uma transação para liberar saldos e gráficos." testID="dashboard-empty-state" />
        </Card>
      ) : null}

      {budgetLoadFailed ? (
        <Card>
          <Text style={styles.sectionTitle}>Budget</Text>
          <Text style={styles.muted}>Budget indisponível agora. Abra a tela Budget para revisar o planejamento do mês.</Text>
        </Card>
      ) : budgetSummary?.hasBudget ? (
        <Card>
          <BudgetDonut spentCents={summary.expenseCents} totalCents={Math.max(budgetSummary.totalBudgetCents, 1)} daysLeft={daysLeftInMonth(selectedMonth.year, selectedMonth.month)} currency={currency} />
        </Card>
      ) : (
        <Card>
          <EmptyState title="Budget não definido" message="Defina um budget mensal para acompanhar gasto planejado no dashboard." />
        </Card>
      )}

      <Card>
        <Text style={styles.sectionTitle}>Adicionar rápido</Text>
        <View style={styles.quickGrid}>
          <QuickAction icon="◎" title="Conta" hint="origem" onPress={() => router.push('/accounts' as never)} />
          <QuickAction icon="◌" title="Budget" hint="limite" onPress={() => router.push('/budget' as never)} />
          <QuickAction icon="+" title="Transação" hint="lançar" onPress={() => router.push('/transactions' as never)} />
        </View>
      </Card>

      <View style={styles.grid}>
        <SummaryCard label="Receitas" value={formatSignedCentsToCurrency(summary.incomeCents, currency)} tone="income" />
        <SummaryCard label="Despesas" value={formatSignedCentsToCurrency(summary.expenseCents, currency)} tone="expense" />
        <SummaryCard label="Saldo mensal" value={formatSignedCentsToCurrency(summary.balanceCents, currency)} tone={summary.balanceCents < 0 ? 'expense' : 'income'} />
        <SummaryCard label="Saldo total" value={formatSignedCentsToCurrency(summary.totalBalanceCents, currency)} />
      </View>

      <Card>
        <Text style={styles.sectionTitle}>Receita x despesa</Text>
        {maxFlow === 0 ? <Text style={styles.muted}>Registre uma receita ou despesa para comparar entradas e saídas deste mês.</Text> : (
          <View style={styles.chart}>
            <BarRow label="Receitas" value={formatSignedCentsToCurrency(summary.incomeCents, currency)} ratio={summary.incomeCents / maxFlow} color="#10b981" />
            <BarRow label="Despesas" value={formatSignedCentsToCurrency(summary.expenseCents, currency)} ratio={summary.expenseCents / maxFlow} color="#ef4444" />
          </View>
        )}
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Maiores gastos por categoria</Text>
        {summary.expenseCategories.length === 0 ? <Text style={styles.muted}>Quando você lançar despesas, suas maiores categorias aparecem aqui.</Text> : (
          <View style={styles.chart}>
            {summary.expenseCategories.map((category) => (
              <BarRow key={category.categoryId} label={category.categoryName} value={formatSignedCentsToCurrency(category.amountCents, currency)} ratio={category.amountCents / maxCategory} />
            ))}
          </View>
        )}
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Saldo por conta</Text>
        {summary.accountBalances.length === 0 ? <Text style={styles.muted}>Crie uma conta para acompanhar saldo total e saldo por origem.</Text> : summary.accountBalances.map((account) => (
          <View key={account.accountId} style={styles.accountRow}>
            <Text style={styles.accountName}>{account.accountName}</Text>
            <Text style={styles.accountValue}>{formatSignedCentsToCurrency(account.balanceCents, currency)}</Text>
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
  lightText: { color: '#475569', fontWeight: '800' },
  error: { color: '#b91c1c', fontWeight: '900' },
  accountRow: { marginTop: 12, flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  accountName: { color: '#0f172a', fontSize: 16, fontWeight: '900' },
  accountValue: { color: '#334155', fontSize: 16, fontWeight: '900', fontVariant: ['tabular-nums'] },
  quickGrid: { flexDirection: 'row', gap: 10, marginTop: 14 },
  quickAction: {
    minHeight: 108,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: '#ecfdf5',
    padding: 10,
  },
  quickActionPressed: { opacity: 0.86, transform: [{ scale: 0.96 }] },
  quickIcon: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center', borderRadius: 16, backgroundColor: '#0f766e' },
  quickIconText: { color: '#f8fafc', fontSize: 23, fontWeight: '900', lineHeight: 28 },
  quickTitle: { marginTop: 8, color: '#0f172a', fontSize: 15, fontWeight: '900', textAlign: 'center' },
  quickHint: { marginTop: 2, color: '#64748b', fontSize: 12, fontWeight: '800', textAlign: 'center' },
});
