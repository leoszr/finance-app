import { Pressable, StyleSheet, Text, View } from 'react-native';

type Option<T extends string> = { label: string; value: T };

type SegmentedControlProps<T extends string> = {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  testID?: string;
};

export function SegmentedControl<T extends string>({ options, value, onChange, testID }: SegmentedControlProps<T>) {
  return (
    <View accessibilityRole="tablist" style={styles.wrap} testID={testID}>
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            key={option.value}
            onPress={() => onChange(option.value)}
            style={({ pressed }) => [styles.item, selected && styles.selected, pressed && styles.pressed]}
          >
            <Text style={[styles.label, selected && styles.selectedLabel]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, borderRadius: 18, backgroundColor: '#e2e8f0', padding: 5 },
  item: { minHeight: 42, flexGrow: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 14, paddingHorizontal: 14 },
  selected: { backgroundColor: '#ffffff' },
  pressed: { opacity: 0.78 },
  label: { color: '#475569', fontSize: 15, fontWeight: '900' },
  selectedLabel: { color: '#2563eb' },
});
