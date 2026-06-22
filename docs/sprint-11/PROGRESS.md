# Progresso — Sprint 11 — Exportação e importação de dados

## Resumo

- Status geral: done
- Branch: `feature/sprint-11-backup-import-export`
- Commit final sugerido: `feat(backup): add local data export and import`

## Entregue nesta sprint

- Backup JSON local versionado com contas, categorias, transações e configurações.
- Exportação para arquivo `.json` em cache e abertura do menu nativo de compartilhamento.
- Escolha de arquivo JSON via seletor nativo do `expo-file-system`.
- Validação antes de importar e restauração em transação SQLite com substituição total.
- Tela de backup acessível por Configurações, sem conta online ou backend.

## Progresso por task

### T1101 — Criar exportação JSON

- Status: done
- Desenvolvido: `src/lib/backup/backupSchema.ts`, `src/lib/backup/exportBackup.ts`, `src/tests/features-sprint11.test.tsx`
- Evidências: exporta `schemaVersion`, `accounts`, `categories`, `transactions`, `settings`.

### T1102 — Criar compartilhamento do backup

- Status: done
- Desenvolvido: `src/lib/backup/backupFile.ts`, `src/features/backup/BackupScreen.tsx`
- Evidências: gera `backup-YYYY-MM-DD.json` e chama `Sharing.shareAsync` quando disponível.

### T1103 — Criar validação de arquivo importado

- Status: done
- Desenvolvido: `src/lib/backup/importBackup.ts`, `src/tests/features-sprint11.test.tsx`
- Evidências: `validateBackup` rejeita schema inválido e linhas incompletas antes de alterar banco.

### T1104 — Criar importação com substituição total

- Status: done
- Desenvolvido: `src/lib/backup/importBackup.ts`, `src/features/backup/BackupScreen.tsx`
- Evidências: tela pede confirmação; importação usa `BEGIN IMMEDIATE`, deletes e inserts, `COMMIT`/`ROLLBACK`.

### T1105 — Criar tela de backup

- Status: done
- Desenvolvido: `app/(tabs)/backup.tsx`, `app/(tabs)/settings.tsx`, `src/features/backup/BackupScreen.tsx`
- Evidências: Configurações abre Backup; tela tem exportar, importar JSON por arquivo e texto de backup manual local.

## Testes executados

- `npm test -- --runInBand src/tests/features-sprint11.test.tsx` — passou.
- `npm test -- --runInBand` — passou.
- `npm run lint` — passou.
- `npm run typecheck` — passou.

## Decisões técnicas

- Usar `expo-file-system` já instalado para escrever/pick JSON; sem dependência nova.
- Usar `expo-sharing` já instalado para abrir menu nativo; se usuário cancelar, arquivo local continua gerado.
- Importação substitui tudo só após confirmação na tela.

## Problemas / riscos encontrados

- Nenhum bloqueio.

## Próximo passo

- Iniciar Sprint 12 — Configurações locais.
