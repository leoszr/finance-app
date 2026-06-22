import { Pressable, StyleSheet, Text, View } from 'react-native';

type TransactionListItemProps = {
  title: string;
  meta: string;
  amount: string;
  type: 'income' | 'expense';
  onEdit: () => void;
  onDelete: () => void;
  deleteTestID?: string;
};

export function TransactionListItem({ title, meta, amount, type, onEdit, onDelete, deleteTestID }: TransactionListItemProps) {
  return (
    <View style={styles.item}>
      <View style={styles.icon}><Text style={styles.iconText}>{type === 'income' ? '↑' : '↓'}</Text></View>
      <View style={styles.body}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.meta}>{meta}</Text>
        <View style={styles.actions}>
          <Pressable accessibilityRole="button" onPress={onEdit}><Text style={styles.action}>Editar</Text></Pressable>
          <Pressable accessibilityRole="button" onPress={onDelete} testID={deleteTestID}><Text style={[styles.action, styles.delete]}>Excluir</Text></Pressable>
        </View>
      </View>
      <Text style={[styles.amount, type === 'income' ? styles.income : styles.expense]}>{amount}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  item: { flexDirection: 'row', alignItems: 'center', gap: 12, borderBottomWidth: 1, borderBottomColor: '#e2e8f0', paddingVertical: 14 },
  icon: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center', borderRadius: 14, backgroundColor: '#e0f2fe' },
  iconText: { color: '#2563eb', fontSize: 18, fontWeight: '900' },
  body: { flex: 1, minWidth: 0 },
  title: { color: '#0f172a', fontSize: 16, fontWeight: '900' },
  meta: { marginTop: 3, color: '#64748b', fontSize: 13, fontWeight: '700' },
  actions: { flexDirection: 'row', gap: 14, marginTop: 8 },
  action: { color: '#2563eb', fontSize: 13, fontWeight: '900' },
  delete: { color: '#b91c1c' },
  amount: { fontSize: 15, fontWeight: '900' },
  income: { color: '#047857' },
  expense: { color: '#b91c1c' },
});
