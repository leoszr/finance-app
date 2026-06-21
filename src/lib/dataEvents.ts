const listeners = new Set<() => void>();

export function notifyFinanceDataChanged() {
  for (const listener of listeners) listener();
}

export function subscribeToFinanceDataChanges(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
