# Sprint 11 — Exportação e importação de dados

## Objetivo

Permitir backup manual local-first.

## Entrega da sprint

- Branch: `feature/sprint-11-backup-import-export`
- Commit final sugerido: `feat(backup): add local data export and import`
- Fase do plano: `Fase 9 — Backup, configurações e segurança`
- Resultado deve ser pequeno, revisável e testável.

## Regras da sprint

- [ ] Criar uma feature branch para a sprint.
- [ ] Manter as alterações coesas ao objetivo da sprint.
- [ ] Atualizar ou criar testes junto com a implementação.
- [ ] Executar `npm test` e `npm run lint` antes do commit final.
- [ ] Não adicionar backend, Supabase, PostgreSQL, Java backend, API externa, IA ou sync automático.
- [ ] Atualizar `docs/sprint-11/PROGRESS.md` com evidências reais.

## Tasks

### T1101 — Criar exportação JSON

- Status: todo
- Feature: Exportação JSON
- Plano: `PLAN.md` > `Fase 9 — Backup, configurações e segurança`
- Dependências: T1005

#### Requisitos funcionais

- [ ] Exportar dados completos do app.
- [ ] Exporta contas.
- [ ] Exporta categorias.
- [ ] Exporta transações.
- [ ] Exporta configurações.
- [ ] Arquivo contém versão do schema.

#### Requisitos técnicos

- [ ] Exportar e importar dados locais em JSON versionado.
- [ ] Validar arquivo completo antes de alterar o banco.
- [ ] Pedir confirmação antes de substituição total.

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

- [ ] Exporta contas.
- [ ] Exporta categorias.
- [ ] Exporta transações.
- [ ] Exporta configurações.
- [ ] Arquivo contém versão do schema.

#### Testes e verificação

- [ ] Adicionar teste cobrindo `Criar exportação JSON` em arquivo de teste da sprint.
- [ ] Cobrir pelo menos: Exporta contas.
- [ ] Executar `npm test` com a suíte atualizada.
- [ ] Executar `npm run lint` sem erros novos.

### T1102 — Criar compartilhamento do backup

- Status: todo
- Feature: Compartilhamento do backup
- Plano: `PLAN.md` > `Fase 9 — Backup, configurações e segurança`
- Dependências: T1101

#### Requisitos funcionais

- [ ] Permitir salvar ou enviar backup.
- [ ] Usuário gera arquivo `.json`.
- [ ] Menu de compartilhamento abre.
- [ ] Nome do arquivo contém data.
- [ ] Erro tratado.

#### Requisitos técnicos

- [ ] Exportar e importar dados locais em JSON versionado.
- [ ] Validar arquivo completo antes de alterar o banco.
- [ ] Pedir confirmação antes de substituição total.

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

- [ ] Usuário gera arquivo `.json`.
- [ ] Menu de compartilhamento abre.
- [ ] Nome do arquivo contém data.
- [ ] Erro tratado.

#### Testes e verificação

- [ ] Adicionar teste cobrindo `Criar compartilhamento do backup` em arquivo de teste da sprint.
- [ ] Cobrir pelo menos: Usuário gera arquivo `.json`.
- [ ] Executar `npm test` com a suíte atualizada.
- [ ] Executar `npm run lint` sem erros novos.

### T1103 — Criar validação de arquivo importado

- Status: todo
- Feature: Validação de arquivo importado
- Plano: `PLAN.md` > `Fase 9 — Backup, configurações e segurança`
- Dependências: T1102

#### Requisitos funcionais

- [ ] Impedir importação inválida.
- [ ] Valida versão do schema.
- [ ] Valida presença de contas.
- [ ] Valida presença de categorias.
- [ ] Valida transações.
- [ ] Rejeita arquivo inválido sem alterar banco.

#### Requisitos técnicos

- [ ] Exportar e importar dados locais em JSON versionado.
- [ ] Validar arquivo completo antes de alterar o banco.
- [ ] Pedir confirmação antes de substituição total.
- [ ] Usar transação de banco para evitar restauração parcial.

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

- [ ] Valida versão do schema.
- [ ] Valida presença de contas.
- [ ] Valida presença de categorias.
- [ ] Valida transações.
- [ ] Rejeita arquivo inválido sem alterar banco.

#### Testes e verificação

- [ ] Adicionar teste cobrindo `Criar validação de arquivo importado` em arquivo de teste da sprint.
- [ ] Cobrir pelo menos: Valida versão do schema.
- [ ] Executar `npm test` com a suíte atualizada.
- [ ] Executar `npm run lint` sem erros novos.

### T1104 — Criar importação com substituição total

- Status: todo
- Feature: Importação com substituição total
- Plano: `PLAN.md` > `Fase 9 — Backup, configurações e segurança`
- Dependências: T1103

#### Requisitos funcionais

- [ ] Restaurar backup.
- [ ] Usuário escolhe arquivo.
- [ ] App valida arquivo.
- [ ] App pede confirmação.
- [ ] Banco local substituído.
- [ ] Dados aparecem após restauração.

#### Requisitos técnicos

- [ ] Exportar e importar dados locais em JSON versionado.
- [ ] Validar arquivo completo antes de alterar o banco.
- [ ] Pedir confirmação antes de substituição total.
- [ ] Usar transação de banco para evitar restauração parcial.

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

- [ ] Usuário escolhe arquivo.
- [ ] App valida arquivo.
- [ ] App pede confirmação.
- [ ] Banco local substituído.
- [ ] Dados aparecem após restauração.

#### Testes e verificação

- [ ] Adicionar teste cobrindo `Criar importação com substituição total` em arquivo de teste da
  sprint.
- [ ] Cobrir pelo menos: Usuário escolhe arquivo.
- [ ] Executar `npm test` com a suíte atualizada.
- [ ] Executar `npm run lint` sem erros novos.

### T1105 — Criar tela de backup

- Status: todo
- Feature: Tela de backup
- Plano: `PLAN.md` > `Fase 9 — Backup, configurações e segurança`
- Dependências: T1104

#### Requisitos funcionais

- [ ] Centralizar exportação e importação.
- [ ] Tela acessível por configurações.
- [ ] Botão de exportar.
- [ ] Botão de importar.
- [ ] Textos explicam backup manual.
- [ ] Nenhuma conta online exigida.

#### Requisitos técnicos

- [ ] Exportar e importar dados locais em JSON versionado.
- [ ] Validar arquivo completo antes de alterar o banco.
- [ ] Pedir confirmação antes de substituição total.
- [ ] Usar transação de banco para evitar restauração parcial.

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

- [ ] Tela acessível por configurações.
- [ ] Botão de exportar.
- [ ] Botão de importar.
- [ ] Textos explicam backup manual.
- [ ] Nenhuma conta online exigida.

#### Testes e verificação

- [ ] Adicionar teste cobrindo `Criar tela de backup` em arquivo de teste da sprint.
- [ ] Cobrir pelo menos: Tela acessível por configurações.
- [ ] Executar `npm test` com a suíte atualizada.
- [ ] Executar `npm run lint` sem erros novos.

## Testes da sprint

- [ ] Teste de geração JSON.
- [ ] Teste de validação de backup válido.
- [ ] Teste de rejeição de backup inválido.
- [ ] Teste de importação preservando integridade.
- [ ] Teste de exportar e importar no mesmo fluxo.
- [ ] `npm test` passa.
- [ ] `npm run lint` passa.

## Checklist final

- [ ] App abre sem tela branca.
- [ ] `npm test` passa com os testes adicionados na sprint.
- [ ] `npm run lint` passa sem erros.
- [ ] Não há chamada de rede para dados financeiros.
- [ ] Não há dependência proibida adicionada.
- [ ] `docs/sprint-11/PROGRESS.md` descreve o que foi entregue.
