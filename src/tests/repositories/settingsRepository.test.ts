import { createSettingsRepository } from '@/db/repositories/settingsRepository';
import { createFakeRepositoryDatabase } from '@/tests/repositories/fakeRepositoryDatabase';

describe('Sprint 03 settingsRepository', () => {
  it('covers T0304: sets gets updates and deletes settings', async () => {
    const repository = createSettingsRepository(createFakeRepositoryDatabase());

    await expect(repository.getSetting('theme')).resolves.toBeNull();
    await expect(repository.setSetting('theme', 'dark')).resolves.toEqual({ ok: true, value: { key: 'theme', value: 'dark' } });
    await expect(repository.getSetting('theme')).resolves.toEqual({ key: 'theme', value: 'dark' });
    await expect(repository.setSetting('theme', 'light')).resolves.toEqual({ ok: true, value: { key: 'theme', value: 'light' } });
    await expect(repository.getSetting('theme')).resolves.toEqual({ key: 'theme', value: 'light' });
    await expect(repository.deleteSetting('theme')).resolves.toEqual({ ok: true, value: null });
    await expect(repository.getSetting('theme')).resolves.toBeNull();
  });

  it('rejects empty setting keys and trims valid keys', async () => {
    const repository = createSettingsRepository(createFakeRepositoryDatabase());

    await expect(repository.setSetting('   ', 'x')).resolves.toEqual({
      ok: false,
      error: { code: 'setting_key_required', message: 'Chave da configuração é obrigatória.', field: 'key' },
    });
    await expect(repository.setSetting(' theme ', 'dark')).resolves.toEqual({ ok: true, value: { key: 'theme', value: 'dark' } });
  });
});
