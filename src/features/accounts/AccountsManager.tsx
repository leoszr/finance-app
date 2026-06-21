import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { createAccountsRepository, type AccountRecord } from '@/db/repositories/accountsRepository';
import type { RepositoryResult } from '@/db/repositories/types';
import type { AccountInput } from '@/lib/validation/accountValidation';
import type { AccountType } from '@/types/finance';
import { Button, Card, EmptyState, MoneyInput, TextInput } from '@/components/ui';

type AccountsRepository = ReturnType<typeof createAccountsRepository>;
let defaultAccountsRepository: AccountsRepository | undefined;

function getDefaultAccountsRepository() {
  defaultAccountsRepository ??= createAccountsRepository();
  return defaultAccountsRepository;
}

type FormState = { id?: number; name: string; type: AccountType; initialBalance: string };
const emptyForm: FormState = { name: '', type: 'checking', initialBalance: '0,00' };
const accountTypeLabels: Record<AccountType, string> = {
  checking: 'Corrente', savings: 'Poupança', cash: 'Dinheiro', credit: 'Crédito', investment: 'Investimento', other: 'Outro',
};

function centsToMoney(cents: number) {
  return (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function parseMoneyToCents(value: string) {
  const normalized = value.replace(/[^\d,-]/g, '').replace(',', '.');
  const number = Number(normalized || 0);
  return Number.isFinite(number) ? Math.round(number * 100) : Number.NaN;
}

export function AccountsManager({ repository }: { repository?: AccountsRepository }) {
  const activeRepository = useMemo(() => repository ?? getDefaultAccountsRepository(), [repository]);
  const [accounts, setAccounts] = useState<AccountRecord[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<string | undefined>();
  const [isSaving, setIsSaving] = useState(false);
  const isSavingRef = useRef(false);
  const loadRequestRef = useRef(0);

  const loadAccounts = useCallback(async () => {
    const requestId = ++loadRequestRef.current;
    const nextAccounts = await activeRepository.getAccounts();
    if (requestId === loadRequestRef.current) setAccounts(nextAccounts);
  }, [activeRepository]);

  useEffect(() => {
    void loadAccounts();
  }, [loadAccounts]);

  async function saveAccount() {
    if (isSavingRef.current) return;
    isSavingRef.current = true;
    setIsSaving(true);
    try {
      setError(null); setFieldError(undefined);
      const input: AccountInput = {
        name: form.name,
        type: form.type,
        currency: 'BRL',
        initialBalanceCents: parseMoneyToCents(form.initialBalance),
      };
      const result: RepositoryResult<AccountRecord> = form.id
        ? await activeRepository.updateAccount(form.id, input)
        : await activeRepository.createAccount(input);
      if (!result.ok) {
        setError(result.error.message);
        if (result.error.field === 'name') setFieldError(result.error.message);
        return;
      }
      setForm(emptyForm);
      await loadAccounts();
    } finally {
      isSavingRef.current = false;
      setIsSaving(false);
    }
  }

  async function deleteAccount(account: AccountRecord) {
    const remove = async () => {
      setError(null);
      const result = await activeRepository.deleteAccount(account.id);
      if (!result.ok) { setError(result.error.message); return; }
      setFieldError(undefined);
      await loadAccounts();
    };
    if (Alert.alert) {
      Alert.alert('Excluir conta', `Remover ${account.name}?`, [{ text: 'Cancelar' }, { text: 'Excluir', style: 'destructive', onPress: remove }]);
      return;
    }
    await remove();
  }

  return (
    <View style={styles.stack}>
      <Card>
        <Text style={styles.sectionTitle}>Nova conta</Text>
        <View style={styles.form}>
          <TextInput testID="account-name-input" label="Nome da conta" value={form.name} onChangeText={(name) => { setFieldError(undefined); setForm((current) => ({ ...current, name })); }} error={fieldError} />
          <Text style={styles.label}>Tipo</Text>
          <View style={styles.options}>
            {(Object.keys(accountTypeLabels) as AccountType[]).map((type) => (
              <Button key={type} onPress={() => setForm((current) => ({ ...current, type }))} disabled={form.type === type}>{accountTypeLabels[type]}</Button>
            ))}
          </View>
          <MoneyInput testID="account-balance-input" label="Saldo inicial" value={form.initialBalance} onChangeText={(initialBalance) => setForm((current) => ({ ...current, initialBalance }))} />
          {error && !fieldError ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
          <Button testID="save-account-button" onPress={saveAccount} disabled={isSaving}>Salvar conta</Button>
        </View>
      </Card>

      <View style={styles.listHeader}>
        <Text style={styles.sectionTitle}>Contas cadastradas</Text>
        <Button onPress={() => { setError(null); setFieldError(undefined); setForm(emptyForm); }}>Adicionar conta</Button>
      </View>

      {accounts.length === 0 ? (
        <EmptyState title="Nenhuma conta" message="Adicione sua primeira conta para registrar transações." />
      ) : accounts.map((account) => (
        <Card key={account.id}>
          <Text style={styles.itemTitle}>{account.name}</Text>
          <Text style={styles.itemMeta}>{accountTypeLabels[account.type]} · {centsToMoney(account.initialBalanceCents)}</Text>
          <View style={styles.rowActions}>
            <Button onPress={() => { setError(null); setFieldError(undefined); setForm({ id: account.id, name: account.name, type: account.type, initialBalance: String(account.initialBalanceCents / 100).replace('.', ',') }); }}>Editar</Button>
            <Button testID={`delete-account-${account.id}`} onPress={() => void deleteAccount(account)}>Excluir</Button>
          </View>
        </Card>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 16 }, form: { gap: 12 }, listHeader: { gap: 12 }, rowActions: { flexDirection: 'row', gap: 10, marginTop: 14 }, options: { gap: 8 },
  sectionTitle: { color: '#0f172a', fontSize: 20, fontWeight: '900' }, label: { color: '#1e293b', fontWeight: '800' },
  itemTitle: { color: '#0f172a', fontSize: 18, fontWeight: '900' }, itemMeta: { marginTop: 6, color: '#475569', fontSize: 15, fontWeight: '700' },
  error: { color: '#b91c1c', fontWeight: '800' },
});
