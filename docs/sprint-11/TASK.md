# Sprint 11 — Exportação e importação de dados

## Objetivo

Permitir backup manual local-first.

## Entrega da sprint

- Branch: `feature/sprint-11-backup-import-export`
- Commit final sugerido: `feat(backup): add local data export and import`
- Fase do plano: `Fase 9 — Backup, configurações e segurança`
- Resultado deve ser pequeno, revisável e testável.

## Regras da sprint

- [x] Criar uma feature branch para a sprint.
- [x] Manter as alterações coesas ao objetivo da sprint.
- [x] Atualizar ou criar testes junto com a implementação.
- [x] Executar `npm test` e `npm run lint` antes do commit final.
- [x] Não adicionar backend, Supabase, PostgreSQL, Java backend, API externa, IA ou sync automático.
- [x] Atualizar `docs/sprint-11/PROGRESS.md` com evidências reais.

## Tasks

### T1101 — Criar exportação JSON

- Status: done
- Feature: Exportação JSON
- Plano: `PLAN.md` > `Fase 9 — Backup, configurações e segurança`
- Dependências: T1005

#### Requisitos funcionais

- [x] Exportar dados completos do app.
- [x] Exporta contas.
- [x] Exporta categorias.
- [x] Exporta transações.
- [x] Exporta configurações.
- [x] Arquivo contém versão do schema.

#### Requisitos técnicos

- [x] Exportar e importar dados locais em JSON versionado.
- [x] Validar arquivo completo antes de alterar o banco.
- [x] Pedir confirmação antes de substituição total.

#### Arquivos prováveis

- `src/features/backup/`
- `src/lib/backup/exportBackup.ts`
- `src/lib/backup/`

#### Passos sugeridos

1. Ler os arquivos prováveis e confirmar a estrutura existente.
2. Implementar somente o necessário para a feature desta task.
3. Adicionar ou atualizar testes específicos da task.
4. Rodar testes e lint.
5. Registrar evidências em `docs/sprint-11/PROGRESS.md`.

#### Critérios de aceite

- [x] Exporta contas.
- [x] Exporta categorias.
- [x] Exporta transações.
- [x] Exporta configurações.
- [x] Arquivo contém versão do schema.

#### Testes e verificação

- [x] Adicionar teste cobrindo `Criar exportação JSON` em arquivo de teste da sprint.
- [x] Cobrir pelo menos: Exporta contas.
- [x] Executar `npm test` com a suíte atualizada.
- [x] Executar `npm run lint` sem erros novos.

### T1102 — Criar compartilhamento do backup

- Status: done
- Feature: Compartilhamento do backup
- Plano: `PLAN.md` > `Fase 9 — Backup, configurações e segurança`
- Dependências: T1101

#### Requisitos funcionais

- [x] Permitir salvar ou enviar backup.
- [x] Usuário gera arquivo `.json`.
- [x] Menu de compartilhamento abre.
- [x] Nome do arquivo contém data.
- [x] Erro tratado.

#### Requisitos técnicos

- [x] Exportar e importar dados locais em JSON versionado.
- [x] Validar arquivo completo antes de alterar o banco.
- [x] Pedir confirmação antes de substituição total.

#### Arquivos prováveis

- `src/features/backup/`
- `src/lib/backup/`
- `src/features/backup/BackupScreen.tsx`
- `src/tests/features/backup/`
- `src/lib/backup/backupSchema.ts`

#### Passos sugeridos

1. Ler os arquivos prováveis e confirmar a estrutura existente.
2. Implementar somente o necessário para a feature desta task.
3. Adicionar ou atualizar testes específicos da task.
4. Rodar testes e lint.
5. Registrar evidências em `docs/sprint-11/PROGRESS.md`.

#### Critérios de aceite

- [x] Usuário gera arquivo `.json`.
- [x] Menu de compartilhamento abre.
- [x] Nome do arquivo contém data.
- [x] Erro tratado.

#### Testes e verificação

- [x] Adicionar teste cobrindo `Criar compartilhamento do backup` em arquivo de teste da sprint.
- [x] Cobrir pelo menos: Usuário gera arquivo `.json`.
- [x] Executar `npm test` com a suíte atualizada.
- [x] Executar `npm run lint` sem erros novos.

### T1103 — Criar validação de arquivo importado

- Status: done
- Feature: Validação de arquivo importado
- Plano: `PLAN.md` > `Fase 9 — Backup, configurações e segurança`
- Dependências: T1102

#### Requisitos funcionais

- [x] Impedir importação inválida.
- [x] Valida versão do schema.
- [x] Valida presença de contas.
- [x] Valida presença de categorias.
- [x] Valida transações.
- [x] Rejeita arquivo inválido sem alterar banco.

#### Requisitos técnicos

- [x] Exportar e importar dados locais em JSON versionado.
- [x] Validar arquivo completo antes de alterar o banco.
- [x] Pedir confirmação antes de substituição total.
- [x] Usar transação de banco para evitar restauração parcial.

#### Arquivos prováveis

- `src/features/backup/`
- `src/lib/backup/importBackup.ts`
- `src/lib/backup/`

#### Passos sugeridos

1. Ler os arquivos prováveis e confirmar a estrutura existente.
2. Implementar somente o necessário para a feature desta task.
3. Adicionar ou atualizar testes específicos da task.
4. Rodar testes e lint.
5. Registrar evidências em `docs/sprint-11/PROGRESS.md`.

#### Critérios de aceite

- [x] Valida versão do schema.
- [x] Valida presença de contas.
- [x] Valida presença de categorias.
- [x] Valida transações.
- [x] Rejeita arquivo inválido sem alterar banco.

#### Testes e verificação

- [x] Adicionar teste cobrindo `Criar validação de arquivo importado` em arquivo de teste da sprint.
- [x] Cobrir pelo menos: Valida versão do schema.
- [x] Executar `npm test` com a suíte atualizada.
- [x] Executar `npm run lint` sem erros novos.

### T1104 — Criar importação com substituição total

- Status: done
- Feature: Importação com substituição total
- Plano: `PLAN.md` > `Fase 9 — Backup, configurações e segurança`
- Dependências: T1103

#### Requisitos funcionais

- [x] Restaurar backup.
- [x] Usuário escolhe arquivo.
- [x] App valida arquivo.
- [x] App pede confirmação.
- [x] Banco local substituído.
- [x] Dados aparecem após restauração.

#### Requisitos técnicos

- [x] Exportar e importar dados locais em JSON versionado.
- [x] Validar arquivo completo antes de alterar o banco.
- [x] Pedir confirmação antes de substituição total.
- [x] Usar transação de banco para evitar restauração parcial.

#### Arquivos prováveis

- `src/features/backup/`
- `src/lib/backup/`
- `src/lib/backup/importBackup.ts`

#### Passos sugeridos

1. Ler os arquivos prováveis e confirmar a estrutura existente.
2. Implementar somente o necessário para a feature desta task.
3. Adicionar ou atualizar testes específicos da task.
4. Rodar testes e lint.
5. Registrar evidências em `docs/sprint-11/PROGRESS.md`.

#### Critérios de aceite

- [x] Usuário escolhe arquivo.
- [x] App valida arquivo.
- [x] App pede confirmação.
- [x] Banco local substituído.
- [x] Dados aparecem após restauração.

#### Testes e verificação

- [x] Adicionar teste cobrindo `Criar importação com substituição total` em arquivo de teste da
  sprint.
- [x] Cobrir pelo menos: Usuário escolhe arquivo.
- [x] Executar `npm test` com a suíte atualizada.
- [x] Executar `npm run lint` sem erros novos.

### T1105 — Criar tela de backup

- Status: done
- Feature: Tela de backup
- Plano: `PLAN.md` > `Fase 9 — Backup, configurações e segurança`
- Dependências: T1104

#### Requisitos funcionais

- [x] Centralizar exportação e importação.
- [x] Tela acessível por configurações.
- [x] Botão de exportar.
- [x] Botão de importar.
- [x] Textos explicam backup manual.
- [x] Nenhuma conta online exigida.

#### Requisitos técnicos

- [x] Exportar e importar dados locais em JSON versionado.
- [x] Validar arquivo completo antes de alterar o banco.
- [x] Pedir confirmação antes de substituição total.
- [x] Usar transação de banco para evitar restauração parcial.

#### Arquivos prováveis

- `src/features/backup/`
- `src/lib/backup/`
- `src/lib/backup/exportBackup.ts`
- `src/lib/backup/importBackup.ts`

#### Passos sugeridos

1. Ler os arquivos prováveis e confirmar a estrutura existente.
2. Implementar somente o necessário para a feature desta task.
3. Adicionar ou atualizar testes específicos da task.
4. Rodar testes e lint.
5. Registrar evidências em `docs/sprint-11/PROGRESS.md`.

#### Critérios de aceite

- [x] Tela acessível por configurações.
- [x] Botão de exportar.
- [x] Botão de importar.
- [x] Textos explicam backup manual.
- [x] Nenhuma conta online exigida.

#### Testes e verificação

- [x] Adicionar teste cobrindo `Criar tela de backup` em arquivo de teste da sprint.
- [x] Cobrir pelo menos: Tela acessível por configurações.
- [x] Executar `npm test` com a suíte atualizada.
- [x] Executar `npm run lint` sem erros novos.

## Testes da sprint

- [x] Teste de geração JSON.
- [x] Teste de validação de backup válido.
- [x] Teste de rejeição de backup inválido.
- [x] Teste de importação preservando integridade.
- [x] Teste de exportar e importar no mesmo fluxo.
- [x] `npm test` passa.
- [x] `npm run lint` passa.

## Checklist final

- [x] App abre sem tela branca.
- [x] `npm test` passa com os testes adicionados na sprint.
- [x] `npm run lint` passa sem erros.
- [x] Não há chamada de rede para dados financeiros.
- [x] Não há dependência proibida adicionada.
- [x] `docs/sprint-11/PROGRESS.md` descreve o que foi entregue.
