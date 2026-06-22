import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { Button, Card, EmptyState, MoneyInput, TextInput } from '@/components/ui';
import { createAccountsRepository, type AccountRecord } from '@/db/repositories/accountsRepository';
import { createCategoriesRepository, type CategoryRecord } from '@/db/repositories/categoriesRepository';
import { createTransactionsRepository, type TransactionRecord } from '@/db/repositories/transactionsRepository';
import type { RepositoryResult } from '@/db/repositories/types';
import { parseCurrencyToCents } from '@/lib/money';
import type { TransactionInput } from '@/lib/validation/transactionValidation';
import type { TransactionType } from '@/types/finance';

type TransactionsRepository = ReturnType<typeof createTransactionsRepository>;
type AccountsRepository = ReturnType<typeof createAccountsRepository>;
type CategoriesRepository = ReturnType<typeof createCategoriesRepository>;

type FormState = {
  id?: number;
  type: TransactionType;
  amount: string;
  accountId?: number;
  categoryId?: number;
  transactionDate: string;
  description: string;
};

type FieldErrors = Partial<Record<keyof TransactionInput, string>>;
type TypeFilter = 'all' | TransactionType;

let defaultTransactionsRepository: TransactionsRepository | undefined;
let defaultAccountsRepository: AccountsRepository | undefined;
let defaultCategoriesRepository: CategoriesRepository | undefined;

const emptyForm: FormState = { type: 'expense', amount: '0,00', transactionDate: todayIsoDate(), description: '' };
const typeLabels: Record<TransactionType, string> = { income: 'Receita', expense: 'Despesa' };

function todayIsoDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function currentYearMonth() {
  const date = new Date();
  return { year: date.getFullYear(), month: date.getMonth() + 1 };
}

function moveMonth(year: number, month: number, offset: number) {
  const date = new Date(year, month - 1 + offset, 1);
  return { year: date.getFullYear(), month: date.getMonth() + 1 };
}

function formatMonth(year: number, month: number) {
  return new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(new Date(year, month - 1, 1));
}

function getDefaultTransactionsRepository() {
  defaultTransactionsRepository ??= createTransactionsRepository();
  return defaultTransactionsRepository;
}

function getDefaultAccountsRepository() {
  defaultAccountsRepository ??= createAccountsRepository();
  return defaultAccountsRepository;
}

function getDefaultCategoriesRepository() {
  defaultCategoriesRepository ??= createCategoriesRepository();
  return defaultCategoriesRepository;
}

function centsToMoney(cents: number) {
  return (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function TransactionsManager({
  transactionsRepository,
  accountsRepository,
  categoriesRepository,
}: {
  transactionsRepository?: TransactionsRepository;
  accountsRepository?: AccountsRepository;
  categoriesRepository?: CategoriesRepository;
}) {
  const activeTransactionsRepository = useMemo(() => transactionsRepository ?? getDefaultTransactionsRepository(), [transactionsRepository]);
  const activeAccountsRepository = useMemo(() => accountsRepository ?? getDefaultAccountsRepository(), [accountsRepository]);
  const activeCategoriesRepository = useMemo(() => categoriesRepository ?? getDefaultCategoriesRepository(), [categoriesRepository]);
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [accounts, setAccounts] = useState<AccountRecord[]>([]);
  const [categories, setCategories] = useState<CategoryRecord[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(currentYearMonth);
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [accountFilter, setAccountFilter] = useState<number | 'all'>('all');
  const [search, setSearch] = useState('');
  const isSavingRef = useRef(false);
  const loadRequestRef = useRef(0);

  const compatibleCategories = categories.filter((category) => category.type === form.type);
  const filteredTransactions = transactions.filter((transaction) => {
    const [yearText, monthText] = transaction.transactionDate.split('-');
    const inMonth = Number(yearText) === selectedMonth.year && Number(monthText) === selectedMonth.month;
    const inType = typeFilter === 'all' || transaction.type === typeFilter;
    const inAccount = accountFilter === 'all' || transaction.accountId === accountFilter;
    const inSearch = !search.trim() || (transaction.description ?? '').toLowerCase().includes(search.trim().toLowerCase());
    return inMonth && inType && inAccount && inSearch;
  });
  const totalIncome = filteredTransactions.filter((transaction) => transaction.type === 'income').reduce((sum, transaction) => sum + transaction.amountCents, 0);
  const totalExpense = filteredTransactions.filter((transaction) => transaction.type === 'expense').reduce((sum, transaction) => sum + transaction.amountCents, 0);
  const balance = totalIncome - totalExpense;

  const loadData = useCallback(async () => {
    const requestId = ++loadRequestRef.current;
    const [nextTransactions, nextAccounts, nextCategories] = await Promise.all([
      activeTransactionsRepository.getTransactions(),
      activeAccountsRepository.getAccounts(),
      activeCategoriesRepository.getCategories(),
    ]);
    if (requestId !== loadRequestRef.current) return;
    setTransactions(nextTransactions);
    setAccounts(nextAccounts);
    setCategories(nextCategories);
  }, [activeAccountsRepository, activeCategoriesRepository, activeTransactionsRepository]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  function setType(type: TransactionType) {
    setFieldErrors((current) => ({ ...current, type: undefined, categoryId: undefined }));
    setForm((current) => ({ ...current, type, categoryId: undefined }));
  }

  function applyResultError(result: RepositoryResult<TransactionRecord>) {
    if (result.ok) return;
    setError(result.error.message);
    setFieldErrors((current) => ({ ...current, [result.error.field ?? 'amountCents']: result.error.message }));
  }

  async function saveTransaction() {
    if (isSavingRef.current) return;
    isSavingRef.current = true;
    setIsSaving(true);
    try {
      setError(null); setStatus('');
      setFieldErrors({});
      const amount = parseCurrencyToCents(form.amount);
      if (!amount.ok) {
        setError(amount.error.message);
        setFieldErrors({ amountCents: amount.error.message });
        return;
      }
      const input: TransactionInput = {
        accountId: form.accountId,
        categoryId: form.categoryId,
        type: form.type,
        amountCents: amount.value,
        transactionDate: form.transactionDate,
        description: form.description,
      };
      const result = form.id
        ? await activeTransactionsRepository.updateTransaction(form.id, input)
        : await activeTransactionsRepository.createTransaction(input);
      if (!result.ok) {
        applyResultError(result);
        return;
      }
      setForm({ ...emptyForm, transactionDate: todayIsoDate() });
      await loadData();
      setStatus(form.id ? 'Transação atualizada.' : 'Transação salva.');
    } finally {
      isSavingRef.current = false;
      setIsSaving(false);
    }
  }

  async function deleteTransaction(transaction: TransactionRecord) {
    const remove = async () => {
      setError(null); setStatus('');
      const result = await activeTransactionsRepository.deleteTransaction(transaction.id);
      if (!result.ok) { setError(result.error.message); return; }
      await loadData();
      setStatus('Transação excluída.');
    };
    if (Alert.alert) {
      Alert.alert('Excluir transação', `Remover ${transaction.description || centsToMoney(transaction.amountCents)}?`, [{ text: 'Cancelar' }, { text: 'Excluir', style: 'destructive', onPress: remove }]);
      return;
    }
    await remove();
  }

  function editTransaction(transaction: TransactionRecord) {
    setError(null);
    setFieldErrors({});
    setForm({
      id: transaction.id,
      type: transaction.type,
      accountId: transaction.accountId,
      categoryId: transaction.categoryId,
      amount: String(transaction.amountCents / 100).replace('.', ','),
      transactionDate: transaction.transactionDate,
      description: transaction.description ?? '',
    });
  }

  function findAccountName(id: number) {
    return accounts.find((account) => account.id === id)?.name ?? `Conta #${id}`;
  }

  function findCategoryName(id: number) {
    return categories.find((category) => category.id === id)?.name ?? `Categoria #${id}`;
  }

  return (
    <View style={styles.stack}>
      <Card>
        <Text style={styles.sectionTitle}>{form.id ? 'Editar transação' : 'Nova transação'}</Text>
        <View style={styles.form}>
          <View style={styles.rowActions}>
            <Button onPress={() => setType('income')} disabled={form.type === 'income'}>Receita</Button>
            <Button onPress={() => setType('expense')} disabled={form.type === 'expense'}>Despesa</Button>
          </View>
          <MoneyInput testID="transaction-amount-input" label="Valor" value={form.amount} onChangeText={(amount) => { setFieldErrors((current) => ({ ...current, amountCents: undefined })); setForm((current) => ({ ...current, amount })); }} error={fieldErrors.amountCents} />
          <TextInput testID="transaction-date-input" label="Data" value={form.transactionDate} onChangeText={(transactionDate) => { setFieldErrors((current) => ({ ...current, transactionDate: undefined })); setForm((current) => ({ ...current, transactionDate })); }} error={fieldErrors.transactionDate} />
          <TextInput testID="transaction-description-input" label="Descrição" value={form.description} onChangeText={(description) => setForm((current) => ({ ...current, description }))} />
          <Text style={styles.label}>Conta</Text>
          <View style={styles.rowActions}>{accounts.map((account) => <Button key={account.id} onPress={() => { setFieldErrors((current) => ({ ...current, accountId: undefined })); setForm((current) => ({ ...current, accountId: account.id })); }} disabled={form.accountId === account.id}>{account.name}</Button>)}</View>
          {fieldErrors.accountId ? <Text accessibilityRole="alert" style={styles.error}>{fieldErrors.accountId}</Text> : null}
          <Text style={styles.label}>Categoria</Text>
          <View style={styles.rowActions}>{compatibleCategories.map((category) => <Button key={category.id} onPress={() => { setFieldErrors((current) => ({ ...current, categoryId: undefined })); setForm((current) => ({ ...current, categoryId: category.id })); }} disabled={form.categoryId === category.id}>{category.name}</Button>)}</View>
          {fieldErrors.categoryId ? <Text accessibilityRole="alert" style={styles.error}>{fieldErrors.categoryId}</Text> : null}
          {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
          {status ? <Text accessibilityLiveRegion="polite" style={styles.status}>{status}</Text> : null}
          <Button testID="save-transaction-button" onPress={saveTransaction} disabled={isSaving}>Salvar transação</Button>
        </View>
      </Card>

      <Text style={styles.sectionTitleLight}>Transações recentes</Text>
      <Card>
        <View style={styles.form}>
          <View style={styles.rowActions}>
            <Button testID="previous-month-button" onPress={() => setSelectedMonth((current) => moveMonth(current.year, current.month, -1))}>Mês anterior</Button>
            <Text testID="selected-month-label" style={styles.filterLabel}>{formatMonth(selectedMonth.year, selectedMonth.month)}</Text>
            <Button testID="next-month-button" onPress={() => setSelectedMonth((current) => moveMonth(current.year, current.month, 1))}>Mês seguinte</Button>
          </View>
          <View style={styles.rowActions}>
            <Button onPress={() => setTypeFilter('all')} disabled={typeFilter === 'all'}>Todos</Button>
            <Button onPress={() => setTypeFilter('income')} disabled={typeFilter === 'income'}>Receitas</Button>
            <Button onPress={() => setTypeFilter('expense')} disabled={typeFilter === 'expense'}>Despesas</Button>
          </View>
          <View style={styles.rowActions}>
            <Button onPress={() => setAccountFilter('all')} disabled={accountFilter === 'all'}>Todas as contas</Button>
            {accounts.map((account) => <Button key={account.id} onPress={() => setAccountFilter(account.id)} disabled={accountFilter === account.id}>{account.name}</Button>)}
          </View>
          <TextInput testID="transaction-search-input" label="Buscar descrição" value={search} onChangeText={setSearch} />
          <View style={styles.summary}>
            <Text style={styles.summaryText}>Receitas: {centsToMoney(totalIncome)}</Text>
            <Text style={styles.summaryText}>Despesas: {centsToMoney(totalExpense)}</Text>
            <Text style={styles.summaryText}>Saldo: {centsToMoney(balance)}</Text>
          </View>
        </View>
      </Card>
      {filteredTransactions.length === 0 ? <EmptyState title="Adicione sua primeira transação" message="Registre uma receita ou despesa para acompanhar saldo, relatórios e gráficos deste mês." /> : filteredTransactions.map((transaction) => (
        <Card key={transaction.id}>
          <Text style={styles.itemTitle}>{transaction.description || typeLabels[transaction.type]}</Text>
          <Text style={styles.itemMeta}>{findCategoryName(transaction.categoryId)} · {findAccountName(transaction.accountId)} · {transaction.transactionDate}</Text>
          <Text style={[styles.amount, transaction.type === 'income' ? styles.income : styles.expense]}>{transaction.type === 'income' ? '+' : '-'} {centsToMoney(transaction.amountCents)}</Text>
          <View style={styles.rowActions}>
            <Button onPress={() => editTransaction(transaction)}>Editar</Button>
            <Button testID={`delete-transaction-${transaction.id}`} onPress={() => void deleteTransaction(transaction)}>Excluir</Button>
          </View>
        </Card>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 16 }, form: { gap: 12 }, rowActions: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  sectionTitle: { color: '#0f172a', fontSize: 20, fontWeight: '900' }, sectionTitleLight: { color: '#f8fafc', fontSize: 20, fontWeight: '900' },
  label: { color: '#1e293b', fontWeight: '800' }, itemTitle: { color: '#0f172a', fontSize: 18, fontWeight: '900' },
  itemMeta: { marginTop: 6, color: '#475569', fontSize: 15, fontWeight: '700' }, amount: { marginTop: 8, fontSize: 18, fontWeight: '900' },
  income: { color: '#047857' }, expense: { color: '#b91c1c' }, error: { color: '#b91c1c', fontWeight: '800' }, status: { borderWidth: 1, borderColor: '#99f6e4', borderRadius: 999, backgroundColor: '#ccfbf1', padding: 10, color: '#115e59', fontWeight: '900', textAlign: 'center' },
  filterLabel: { alignSelf: 'center', color: '#0f172a', fontSize: 16, fontWeight: '900', textTransform: 'capitalize' },
  summary: { gap: 6, borderTopWidth: 1, borderTopColor: '#e2e8f0', paddingTop: 12 }, summaryText: { color: '#0f172a', fontSize: 15, fontWeight: '800' },
});
