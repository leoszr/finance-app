import { useEffect, useState } from 'react';

import { createSettingsRepository } from '@/db/repositories/settingsRepository';
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
    try {
      void loadGlassEnabled().then((value) => { if (mounted) setEnabled(value); }).catch(() => undefined);
    } catch {
      // Keep default when DB is not ready in isolated component tests.
    }
    return () => { mounted = false; };
  }, []);

  return enabled;
}
