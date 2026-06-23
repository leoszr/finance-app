import { useEffect, useState } from 'react';

import { createSettingsRepository } from '@/db/repositories/settingsRepository';
import { subscribeToSettingsChanges } from '@/lib/settings/settingsEvents';
import { normalizeGlassSetting, SETTINGS_KEYS } from '@/lib/settings/preferences';

let repository: ReturnType<typeof createSettingsRepository> | undefined;
let cached = true;
let loading: Promise<boolean> | undefined;

function getRepository() {
  repository ??= createSettingsRepository();
  return repository;
}

function loadGlassEnabled() {
  loading ??= getRepository().getSetting(SETTINGS_KEYS.glassEnabled)
    .then((setting) => {
      cached = normalizeGlassSetting(setting?.value);
      loading = undefined;
      return cached;
    });
  return loading;
}

export function setCachedGlassEnabled(value: boolean) {
  cached = value;
  loading = undefined;
}

export function useGlassEnabled() {
  const [enabled, setEnabled] = useState(cached);

  useEffect(() => {
    let mounted = true;
    const reload = () => {
      loading = undefined;
      try {
        void loadGlassEnabled().then((value) => { if (mounted) setEnabled(value); }).catch(() => undefined);
      } catch {
        // Keep current value when DB is not ready in isolated component tests.
      }
    };
    try {
      void loadGlassEnabled().then((value) => { if (mounted) setEnabled(value); }).catch(() => undefined);
    } catch {
      // Keep default when DB is not ready in isolated component tests.
    }
    const unsubscribe = subscribeToSettingsChanges((key) => {
      if (!key || key === SETTINGS_KEYS.glassEnabled) reload();
    });
    return () => { mounted = false; unsubscribe(); };
  }, []);

  return enabled;
}
