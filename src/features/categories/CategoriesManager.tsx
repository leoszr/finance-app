import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { createCategoriesRepository, type CategoryRecord } from '@/db/repositories/categoriesRepository';
import type { RepositoryResult } from '@/db/repositories/types';
import type { CategoryInput } from '@/lib/validation/categoryValidation';
import type { TransactionType } from '@/types/finance';
import { Button, Card, EmptyState, TextInput } from '@/components/ui';

type CategoriesRepository = ReturnType<typeof createCategoriesRepository>;
let defaultCategoriesRepository: CategoriesRepository | undefined;

function getDefaultCategoriesRepository() {
  defaultCategoriesRepository ??= createCategoriesRepository();
  return defaultCategoriesRepository;
}
type FormState = { id?: number; name: string; type: TransactionType; color: string };
const emptyForm: FormState = { name: '', type: 'expense', color: '#0f766e' };
const colors = ['#0f766e', '#2563eb', '#c2410c', '#7c3aed'];
const typeLabels: Record<TransactionType, string> = { income: 'Receita', expense: 'Despesa' };

export function CategoriesManager({ repository }: { repository?: CategoriesRepository }) {
  const activeRepository = useMemo(() => repository ?? getDefaultCategoriesRepository(), [repository]);
  const [categories, setCategories] = useState<CategoryRecord[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState('');
  const [fieldError, setFieldError] = useState<string | undefined>();
  const [isSaving, setIsSaving] = useState(false);
  const isSavingRef = useRef(false);
  const loadRequestRef = useRef(0);

  const loadCategories = useCallback(async () => {
    const requestId = ++loadRequestRef.current;
    const nextCategories = await activeRepository.getCategories();
    if (requestId === loadRequestRef.current) setCategories(nextCategories);
  }, [activeRepository]);
  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  async function saveCategory() {
    if (isSavingRef.current) return;
    isSavingRef.current = true;
    setIsSaving(true);
    try {
      setError(null); setFieldError(undefined); setStatus('');
      const input: CategoryInput = { name: form.name, type: form.type, color: form.color };
      const result: RepositoryResult<CategoryRecord> = form.id ? await activeRepository.updateCategory(form.id, input) : await activeRepository.createCategory(input);
      if (!result.ok) {
        setError(result.error.message);
        if (result.error.field === 'name') setFieldError(result.error.message);
        return;
      }
      setForm(emptyForm);
      await loadCategories();
      setStatus(form.id ? 'Categoria atualizada.' : 'Categoria salva.');
    } finally {
      isSavingRef.current = false;
      setIsSaving(false);
    }
  }

  async function deleteCategory(category: CategoryRecord) {
    const remove = async () => {
      setError(null); setStatus('');
      const result = await activeRepository.deleteCategory(category.id);
      if (!result.ok) { setError(result.error.message); return; }
      setFieldError(undefined);
      await loadCategories();
      setStatus('Categoria excluída.');
    };
    if (Alert.alert) {
      Alert.alert('Excluir categoria', `Remover ${category.name}?`, [{ text: 'Cancelar' }, { text: 'Excluir', style: 'destructive', onPress: remove }]);
      return;
    }
    await remove();
  }

  const income = categories.filter((category) => category.type === 'income');
  const expense = categories.filter((category) => category.type === 'expense');

  return (
    <View style={styles.stack}>
      <Card>
        <Text style={styles.sectionTitle}>Nova categoria</Text>
        <View style={styles.form}>
          <TextInput testID="category-name-input" label="Nome da categoria" value={form.name} onChangeText={(name) => { setFieldError(undefined); setForm((current) => ({ ...current, name })); }} error={fieldError} />
          <Text style={styles.label}>Tipo</Text>
          <View style={styles.rowActions}>
            <Button onPress={() => { setFieldError(undefined); setForm((current) => ({ ...current, type: 'income' })); }} disabled={form.type === 'income'}>Receita</Button>
            <Button onPress={() => { setFieldError(undefined); setForm((current) => ({ ...current, type: 'expense' })); }} disabled={form.type === 'expense'}>Despesa</Button>
          </View>
          <Text style={styles.label}>Cor</Text>
          <View style={styles.rowActions}>
            {colors.map((color) => <Button key={color} onPress={() => { setFieldError(undefined); setForm((current) => ({ ...current, color })); }} disabled={form.color === color}>{color}</Button>)}
          </View>
          {error && !fieldError ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
          {status ? <Text accessibilityLiveRegion="polite" style={styles.status}>{status}</Text> : null}
          <Button testID="save-category-button" onPress={saveCategory} disabled={isSaving}>Salvar categoria</Button>
        </View>
      </Card>

      <Text style={styles.sectionTitleLight}>Categorias de receita</Text>
      {income.length === 0 ? <EmptyState title="Crie categorias de receita" message="Separe salário, reembolsos e outras entradas para entender de onde vem o dinheiro." /> : income.map((category) => <CategoryItem key={category.id} category={category} onEdit={() => { setError(null); setFieldError(undefined); setForm({ id: category.id, name: category.name, type: category.type, color: category.color ?? colors[0] }); }} onDelete={() => void deleteCategory(category)} />)}

      <Text style={styles.sectionTitleLight}>Categorias de despesa</Text>
      {expense.length === 0 ? <EmptyState title="Crie categorias de despesa" message="Use categorias como mercado, casa e transporte para ler seus gastos sem esforço." /> : expense.map((category) => <CategoryItem key={category.id} category={category} onEdit={() => { setError(null); setFieldError(undefined); setForm({ id: category.id, name: category.name, type: category.type, color: category.color ?? colors[0] }); }} onDelete={() => void deleteCategory(category)} />)}
    </View>
  );
}

function CategoryItem({ category, onEdit, onDelete }: { category: CategoryRecord; onEdit: () => void; onDelete: () => void }) {
  return (
    <Card>
      <Text style={styles.itemTitle}>{category.name}</Text>
      <Text style={styles.itemMeta}>{typeLabels[category.type]} · {category.color ?? 'sem cor'}</Text>
      <View style={styles.rowActions}><Button onPress={onEdit}>Editar</Button><Button testID={`delete-category-${category.id}`} onPress={onDelete}>Excluir</Button></View>
    </Card>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 16 }, form: { gap: 12 }, rowActions: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 }, sectionTitle: { color: '#0f172a', fontSize: 20, fontWeight: '900' }, sectionTitleLight: { color: '#f8fafc', fontSize: 20, fontWeight: '900' }, label: { color: '#1e293b', fontWeight: '800' }, itemTitle: { color: '#0f172a', fontSize: 18, fontWeight: '900' }, itemMeta: { marginTop: 6, color: '#475569', fontSize: 15, fontWeight: '700' }, error: { color: '#b91c1c', fontWeight: '800' }, status: { borderWidth: 1, borderColor: '#99f6e4', borderRadius: 999, backgroundColor: '#ccfbf1', padding: 10, color: '#115e59', fontWeight: '900', textAlign: 'center' },
});
