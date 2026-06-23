import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { Button, Card, EmptyState, GlassMenuButton, MoneyInput, ScreenHeader } from '@/components/ui';
import { createBudgetQueries, type MonthlyBudgetSummary, type BudgetCategorySummary } from '@/db/queries/budgetQueries';
import { createBudgetsRepository } from '@/db/repositories/budgetsRepository';
import { createCategoriesRepository, type CategoryRecord } from '@/db/repositories/categoriesRepository';
import { createSettingsRepository } from '@/db/repositories/settingsRepository';
import { subscribeToFinanceDataChanges } from '@/lib/dataEvents';
import { formatSignedCentsToCurrency, parseCurrencyToCents, type AppCurrency } from '@/lib/money';
import { formatMonthLabel } from '@/lib/month';
import { normalizeCurrency, SETTINGS_KEYS } from '@/lib/settings/preferences';

const COLORS = ['#0f766e', '#22c55e', '#f59e0b', '#dc2626', '#2563eb', '#7c3aed', '#db2777', '#0891b2'];

function currentYearMonth() {
  const date = new Date();
  return { year: date.getFullYear(), month: date.getMonth() + 1 };
}

function monthLabel(year: number, month: number) {
  const result = formatMonthLabel(year, month);
  return result.ok ? result.value : `${month}/${year}`;
}

function moneyText(cents: number, currency: AppCurrency) {
  return formatSignedCentsToCurrency(cents, currency).replace('-', '');
}

function percent(cents: number, total: number) {
  return total <= 0 ? 0 : Math.min(100, Math.round((cents / total) * 100));
}

function BudgetPie({ summary, currency }: { summary: MonthlyBudgetSummary; currency: AppCurrency }) {
  const usedPercent = percent(summary.totalSpentCents, summary.totalBudgetCents);
  return (
    <Card>
      <Text style={styles.sectionTitle}>Budget total do mês</Text>
      <View style={styles.heroRow}>
        <View style={[styles.donut, summary.remainingCents < 0 && styles.donutDanger]}>
          <Text style={styles.donutKicker}>{usedPercent}% usado</Text>
          <Text style={styles.donutValue}>{moneyText(summary.totalBudgetCents, currency)}</Text>
          <Text style={styles.donutSub}>budget total</Text>
        </View>
        <View style={styles.heroCopy}>
          <Text style={styles.metric}>Gasto: {moneyText(summary.totalSpentCents, currency)}</Text>
          <Text style={[styles.metric, summary.remainingCents < 0 && styles.danger]}>Restante: {formatSignedCentsToCurrency(summary.remainingCents, currency)}</Text>
          <View style={styles.track}><View style={[styles.fill, { width: `${usedPercent}%` }, summary.remainingCents < 0 && styles.fillDanger]} /></View>
        </View>
      </View>
    </Card>
  );
}

function CategoryPie({ categories, currency }: { categories: BudgetCategorySummary[]; currency: AppCurrency }) {
  const total = categories.reduce((sum, item) => sum + item.budgetCents, 0);
  return (
    <Card>
      <Text style={styles.sectionTitle}>Budget por categoria</Text>
      {categories.length === 0 ? <Text style={styles.muted}>Defina limites nas categorias para montar o pie chart.</Text> : (
        <>
          <View style={styles.segmentBar}>
            {categories.filter((item) => item.budgetCents > 0).map((item, index) => (
              <View key={item.categoryId} style={{ flex: Math.max(item.budgetCents, 1), backgroundColor: item.color ?? COLORS[index % COLORS.length] }} />
            ))}
          </View>
          {categories.map((item, index) => (
            <View key={item.categoryId} style={styles.legendRow}>
              <View style={[styles.dot, { backgroundColor: item.color ?? COLORS[index % COLORS.length] }]} />
              <Text style={styles.legendName}>{item.categoryName}</Text>
              <Text style={styles.legendValue}>{moneyText(item.budgetCents, currency)} · {percent(item.budgetCents, total)}%</Text>
            </View>
          ))}
        </>
      )}
    </Card>
  );
}

function CategoryCard({ item, currency, index }: { item: BudgetCategorySummary; currency: AppCurrency; index: number }) {
  const used = percent(item.spentCents, item.budgetCents);
  const remaining = item.budgetCents - item.spentCents;
  return (
    <Card>
      <View style={styles.categoryTop}>
        <View style={[styles.dot, { backgroundColor: item.color ?? COLORS[index % COLORS.length] }]} />
        <Text style={styles.categoryTitle}>{item.categoryName}</Text>
      </View>
      <Text style={styles.cardMoney}>{moneyText(item.budgetCents, currency)}</Text>
      <Text style={styles.muted}>Gasto {moneyText(item.spentCents, currency)} · {used}% usado</Text>
      <Text style={[styles.remaining, remaining < 0 && styles.danger]}>Restante {formatSignedCentsToCurrency(remaining, currency)}</Text>
      <View style={styles.track}><View style={[styles.fill, { width: `${used}%` }, remaining < 0 && styles.fillDanger]} /></View>
    </Card>
  );
}

export default function BudgetScreen() {
  const [selectedMonth] = useState(currentYearMonth);
  const [currency, setCurrency] = useState<AppCurrency>('BRL');
  const [summary, setSummary] = useState<MonthlyBudgetSummary | null>(null);
  const [categories, setCategories] = useState<CategoryRecord[]>([]);
  const [totalInput, setTotalInput] = useState('R$ 0,00');
  const [categoryInputs, setCategoryInputs] = useState<Record<number, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const requestRef = useRef(0);

  const loadData = useCallback(async () => {
    const requestId = ++requestRef.current;
    try {
      const [summaryResult, expenseCategories] = await Promise.all([
        createBudgetQueries().getMonthlyBudgetSummary(selectedMonth.year, selectedMonth.month),
        createCategoriesRepository().getCategoriesByType('expense'),
      ]);
      if (requestId !== requestRef.current) return;
      if (!summaryResult.ok) { setError(summaryResult.error.message); return; }
      setError(null);
      setSummary(summaryResult.value);
      setCategories(expenseCategories);
      setTotalInput(moneyText(summaryResult.value.totalBudgetCents, currency));
      setCategoryInputs(Object.fromEntries(summaryResult.value.categories.map((item) => [item.categoryId, moneyText(item.budgetCents, currency)])));
    } catch {
      if (requestId === requestRef.current) setError('Budget indisponível.');
    }
  }, [currency, selectedMonth.month, selectedMonth.year]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void createSettingsRepository().getSetting(SETTINGS_KEYS.currency).then((setting) => setCurrency(normalizeCurrency(setting?.value))).catch(() => undefined);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => void loadData(), 0);
    const unsubscribe = subscribeToFinanceDataChanges(() => void loadData());
    return () => { clearTimeout(timer); unsubscribe(); };
  }, [loadData]);

  async function saveBudget() {
    const total = parseCurrencyToCents(totalInput);
    if (!total.ok) { setError(total.error.message); return; }
    const limits = [];
    for (const category of categories) {
      const parsed = parseCurrencyToCents(categoryInputs[category.id] ?? 'R$ 0,00');
      if (!parsed.ok) { setError(`${category.name}: ${parsed.error.message}`); return; }
      limits.push({ categoryId: category.id, amountCents: parsed.value });
    }
    setSaving(true);
    try {
      const result = await createBudgetsRepository().upsertMonthlyBudget({ year: selectedMonth.year, month: selectedMonth.month, totalCents: total.value, categories: limits });
      if (!result.ok) { setError(result.error.message); return; }
      await loadData();
    } catch {
      setError('Não foi possível salvar o budget.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Screen testID="budget-screen">
      <GlassMenuButton />
      <ScreenHeader title="Budget" subtitle={`Planejamento de ${monthLabel(selectedMonth.year, selectedMonth.month)}.`} />
      {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
      {!summary ? <Text style={styles.muted}>Carregando budget...</Text> : (
        <View style={styles.stack}>
          {!summary.hasExpenseCategories ? <Card><EmptyState title="Sem categorias de despesa" message="Crie categorias de despesa para planejar budgets por categoria." /></Card> : null}
          <Card>
            <Text style={styles.sectionTitle}>Definir budget</Text>
            <MoneyInput label="Budget total do mês" value={totalInput} onChangeText={setTotalInput} />
            <View style={styles.inputList}>
              {categories.map((category) => <MoneyInput key={category.id} label={category.name} value={categoryInputs[category.id] ?? 'R$ 0,00'} onChangeText={(text) => setCategoryInputs((current) => ({ ...current, [category.id]: text }))} />)}
            </View>
            <Button loading={saving} onPress={saveBudget}>Salvar budget</Button>
          </Card>
          {summary.hasBudget ? <BudgetPie summary={summary} currency={currency} /> : <Card><EmptyState title="Budget não definido" message="Informe o total mensal e os limites por categoria para ver os gráficos." /></Card>}
          <CategoryPie categories={summary.categories} currency={currency} />
          <View style={styles.stack}>{summary.categories.map((item, index) => <CategoryCard key={item.categoryId} item={item} index={index} currency={currency} />)}</View>
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 16 },
  sectionTitle: { marginBottom: 12, color: '#0f172a', fontSize: 20, fontWeight: '900' },
  inputList: { marginVertical: 14, gap: 12 },
  error: { marginBottom: 12, color: '#b91c1c', fontWeight: '900' },
  muted: { color: '#64748b', fontSize: 15, fontWeight: '800', lineHeight: 22 },
  heroRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 18 },
  donut: { width: 178, height: 178, borderRadius: 89, borderWidth: 16, borderColor: '#0f766e', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  donutDanger: { borderColor: '#dc2626' },
  donutKicker: { color: '#475569', fontSize: 13, fontWeight: '900' },
  donutValue: { marginTop: 6, color: '#0f172a', fontSize: 22, fontWeight: '900', fontVariant: ['tabular-nums'], textAlign: 'center' },
  donutSub: { color: '#64748b', fontSize: 13, fontWeight: '800' },
  heroCopy: { flex: 1, minWidth: 180, gap: 8 },
  metric: { color: '#0f172a', fontSize: 16, fontWeight: '900', fontVariant: ['tabular-nums'] },
  track: { marginTop: 10, height: 10, overflow: 'hidden', borderRadius: 999, backgroundColor: '#e2e8f0' },
  fill: { height: '100%', borderRadius: 999, backgroundColor: '#0f766e' },
  fillDanger: { backgroundColor: '#dc2626' },
  segmentBar: { height: 34, flexDirection: 'row', overflow: 'hidden', borderRadius: 999, backgroundColor: '#e2e8f0' },
  legendRow: { marginTop: 12, flexDirection: 'row', alignItems: 'center', gap: 10 },
  dot: { width: 12, height: 12, borderRadius: 6 },
  legendName: { flex: 1, color: '#0f172a', fontSize: 15, fontWeight: '900' },
  legendValue: { color: '#475569', fontSize: 14, fontWeight: '800', fontVariant: ['tabular-nums'] },
  categoryTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  categoryTitle: { color: '#0f172a', fontSize: 18, fontWeight: '900' },
  cardMoney: { marginTop: 10, color: '#0f172a', fontSize: 26, fontWeight: '900', fontVariant: ['tabular-nums'] },
  remaining: { marginTop: 8, color: '#0f766e', fontSize: 15, fontWeight: '900', fontVariant: ['tabular-nums'] },
  danger: { color: '#b91c1c' },
});
