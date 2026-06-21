import type { TextInputProps } from 'react-native';

import { TextInput } from './TextInput';

type MoneyInputProps = Omit<TextInputProps, 'keyboardType'> & { label: string; error?: string };

export function MoneyInput(props: MoneyInputProps) {
  return <TextInput keyboardType="decimal-pad" placeholder="R$ 0,00" {...props} />;
}
