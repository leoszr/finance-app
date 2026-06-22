import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const SCREEN_PADDING = { horizontal: 20, vertical: 24 } as const;

type ScreenProps = {
  children: ReactNode;
  centered?: boolean;
  testID?: string;
};

export function Screen({ children, centered = false, testID }: ScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea} testID={testID}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoiding}
      >
        <ScrollView
          contentContainerStyle={[styles.content, centered && styles.centered]}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.body}>{children}</View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#eef6f4',
  },
  keyboardAvoiding: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: SCREEN_PADDING.vertical,
    paddingBottom: 132,
  },
  centered: {
    justifyContent: 'center',
  },
  body: {
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
  },
});
