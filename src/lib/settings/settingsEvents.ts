import type { SETTINGS_KEYS } from '@/lib/settings/preferences';

type SettingsKey = (typeof SETTINGS_KEYS)[keyof typeof SETTINGS_KEYS];
type Listener = (key?: SettingsKey) => void;

const listeners = new Set<Listener>();

export function notifySettingsChanged(key?: SettingsKey) {
  for (const listener of listeners) listener(key);
}

export function subscribeToSettingsChanges(listener: Listener) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}
