import type { TextInputProps } from 'react-native';

import { TextInput } from './TextInput';

type MoneyInputProps = Omit<TextInputProps, 'keyboardType'> & { label: string; error?: string };

export function formatMoneyInputText(text: string) {
  const hasDecimalSeparator = /[,.]/.test(text);
  const validDecimal = /^\s*(?:R\$\s*)?(?:(?:\d{1,3}(?:\.\d{3})+)|\d+)(?:,\d{0,2})?\s*$/.test(text);
  if (hasDecimalSeparator && !validDecimal) return text;

  const digits = text.replace(/\D/g, '').replace(/^0+(?=\d{3,})/, '');
  const cents = Number(digits || 0);
  return `R$ ${(cents / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function MoneyInput({ onChangeText, ...props }: MoneyInputProps) {
  return (
    <TextInput
      keyboardType="decimal-pad"
      placeholder="R$ 0,00"
      {...props}
      onChangeText={(text) => onChangeText?.(formatMoneyInputText(text))}
    />
  );
}
