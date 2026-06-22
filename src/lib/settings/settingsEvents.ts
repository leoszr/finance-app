const listeners = new Set<() => void>();

export function notifySettingsChanged() {
  for (const listener of listeners) listener();
}

export function subscribeToSettingsChanges(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}
