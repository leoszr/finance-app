# Sprint 13 — Segurança local básica

## Objetivo

Adicionar bloqueio local opcional com biometria ou PIN definido pelo usuário.

## Entrega da sprint

- Branch: `dev`
- Commit final sugerido: `feat(security): add optional local app lock`
- Fase do plano: `Fase 9 — Backup, configurações e segurança`
- Resultado deve ser pequeno, revisável e testável.

## Regras da sprint

- [ ] Garantir que o trabalho da sprint será feito na branch `dev`.
- [ ] Manter as alterações coesas ao objetivo da sprint.
- [ ] Atualizar ou criar testes junto com a implementação.
- [ ] Executar `npm test` e `npm run lint` antes do commit final.
- [ ] Não adicionar backend, Supabase, PostgreSQL, Java backend, API externa, IA ou sync automático.
- [ ] Ao concluir, abrir PR de `dev` para `main`.
- [ ] Atualizar `docs/sprint-13/PROGRESS.md` com evidências reais.

## Tasks

### T1301 — Adicionar suporte a biometria local

- Status: todo
- Feature: Suporte a biometria local
- Plano: `PLAN.md` > `Fase 9 — Backup, configurações e segurança`
- Dependências: T1204

#### Requisitos funcionais

- [ ] Permitir desbloqueio com Face ID, Touch ID ou biometria Android.
- [ ] App detecta disponibilidade.
- [ ] Usuário pode ativar bloqueio.
- [ ] App solicita autenticação ao abrir.
- [ ] Sem biometria, opção fica indisponível.

#### Requisitos técnicos

- [ ] Usar autenticação local do dispositivo quando disponível.
- [ ] Não enviar credenciais ou dados financeiros para rede.
- [ ] Garantir fallback sem apagar dados.

#### Arquivos prováveis

- `src/features/security/`
- `src/lib/localAuth.ts`
- `src/hooks/useAppLock.ts`

#### Passos sugeridos

1. Ler os arquivos prováveis e confirmar a estrutura existente.
2. Implementar somente o necessário para a feature desta task.
3. Adicionar ou atualizar testes específicos da task.
4. Rodar testes e lint.
5. Registrar evidências em `docs/sprint-13/PROGRESS.md`.

#### Critérios de aceite

- [ ] App detecta disponibilidade.
- [ ] Usuário pode ativar bloqueio.
- [ ] App solicita autenticação ao abrir.
- [ ] Sem biometria, opção fica indisponível.

#### Testes e verificação

- [ ] Adicionar teste cobrindo `Adicionar suporte a biometria local` em arquivo de teste da sprint.
- [ ] Cobrir pelo menos: App detecta disponibilidade.
- [ ] Executar `npm test` com a suíte atualizada.
- [ ] Executar `npm run lint` sem erros novos.

### T1302 — Criar configuração de bloqueio

- Status: todo
- Feature: Configuração de bloqueio
- Plano: `PLAN.md` > `Fase 9 — Backup, configurações e segurança`
- Dependências: T1301

#### Requisitos funcionais

- [ ] Salvar preferência local.
- [ ] Usuário ativa bloqueio.
- [ ] Usuário desativa bloqueio.
- [ ] Escolha persiste.
- [ ] App respeita escolha ao reiniciar.

#### Requisitos técnicos

- [ ] Usar autenticação local do dispositivo quando disponível.
- [ ] Não enviar credenciais ou dados financeiros para rede.
- [ ] Garantir fallback sem apagar dados.

#### Arquivos prováveis

- `src/features/settings/`
- `src/hooks/useSettings.ts`
- `src/features/security/`
- `src/hooks/useAppLock.ts`
- `src/lib/localAuth.ts`

#### Passos sugeridos

1. Ler os arquivos prováveis e confirmar a estrutura existente.
2. Implementar somente o necessário para a feature desta task.
3. Adicionar ou atualizar testes específicos da task.
4. Rodar testes e lint.
5. Registrar evidências em `docs/sprint-13/PROGRESS.md`.

#### Critérios de aceite

- [ ] Usuário ativa bloqueio.
- [ ] Usuário desativa bloqueio.
- [ ] Escolha persiste.
- [ ] App respeita escolha ao reiniciar.

#### Testes e verificação

- [ ] Adicionar teste cobrindo `Criar configuração de bloqueio` em arquivo de teste da sprint.
- [ ] Cobrir pelo menos: Usuário ativa bloqueio.
- [ ] Executar `npm test` com a suíte atualizada.
- [ ] Executar `npm run lint` sem erros novos.

### T1303 — Criar tela de bloqueio

- Status: todo
- Feature: Tela de bloqueio
- Plano: `PLAN.md` > `Fase 9 — Backup, configurações e segurança`
- Dependências: T1302

#### Requisitos funcionais

- [ ] Impedir acesso visual aos dados antes da autenticação.
- [ ] Tela aparece antes do dashboard.
- [ ] Dados financeiros não aparecem atrás da tela.
- [ ] Falha mantém app bloqueado.
- [ ] Sucesso libera navegação.

#### Requisitos técnicos

- [ ] Usar autenticação local do dispositivo quando disponível.
- [ ] Não enviar credenciais ou dados financeiros para rede.
- [ ] Garantir fallback sem apagar dados.

#### Arquivos prováveis

- `src/features/security/`
- `src/hooks/useAppLock.ts`
- `src/lib/localAuth.ts`

#### Passos sugeridos

1. Ler os arquivos prováveis e confirmar a estrutura existente.
2. Implementar somente o necessário para a feature desta task.
3. Adicionar ou atualizar testes específicos da task.
4. Rodar testes e lint.
5. Registrar evidências em `docs/sprint-13/PROGRESS.md`.

#### Critérios de aceite

- [ ] Tela aparece antes do dashboard.
- [ ] Dados financeiros não aparecem atrás da tela.
- [ ] Falha mantém app bloqueado.
- [ ] Sucesso libera navegação.

#### Testes e verificação

- [ ] Adicionar teste cobrindo `Criar tela de bloqueio` em arquivo de teste da sprint.
- [ ] Cobrir pelo menos: Tela aparece antes do dashboard.
- [ ] Executar `npm test` com a suíte atualizada.
- [ ] Executar `npm run lint` sem erros novos.

### T1304 — Criar fallback controlado

- Status: todo
- Feature: Fallback controlado
- Plano: `PLAN.md` > `Fase 9 — Backup, configurações e segurança`
- Dependências: T1303

#### Requisitos funcionais

- [ ] Evitar travamento do app.
- [ ] Usuário pode tentar autenticar novamente.
- [ ] Sem biometria, app mostra aviso.
- [ ] App não perde dados.

#### Requisitos técnicos

- [ ] Usar autenticação local do dispositivo quando disponível.
- [ ] Não enviar credenciais ou dados financeiros para rede.
- [ ] Garantir fallback sem apagar dados.

#### Arquivos prováveis

- `src/features/security/`
- `src/lib/localAuth.ts`
- `src/features/security/AppLockScreen.tsx`
- `src/hooks/useAppLock.ts`
- `src/tests/features/security/`

#### Passos sugeridos

1. Ler os arquivos prováveis e confirmar a estrutura existente.
2. Implementar somente o necessário para a feature desta task.
3. Adicionar ou atualizar testes específicos da task.
4. Rodar testes e lint.
5. Registrar evidências em `docs/sprint-13/PROGRESS.md`.

#### Critérios de aceite

- [ ] Usuário pode tentar autenticar novamente.
- [ ] Sem biometria, app mostra aviso.
- [ ] App não perde dados.

#### Testes e verificação

- [ ] Adicionar teste cobrindo `Criar fallback controlado` em arquivo de teste da sprint.
- [ ] Cobrir pelo menos: Usuário pode tentar autenticar novamente.
- [ ] Executar `npm test` com a suíte atualizada.
- [ ] Executar `npm run lint` sem erros novos.

## Testes da sprint

- [ ] Teste de configuração ativada.
- [ ] Teste de configuração desativada.
- [ ] Teste de tela bloqueada.
- [ ] Teste de desbloqueio com mock.
- [ ] Teste de fallback sem biometria.
- [ ] `npm test` passa.
- [ ] `npm run lint` passa.

## Checklist final

- [ ] App abre sem tela branca.
- [ ] `npm test` passa com os testes adicionados na sprint.
- [ ] `npm run lint` passa sem erros.
- [ ] Não há chamada de rede para dados financeiros.
- [ ] Não há dependência proibida adicionada.
- [ ] `docs/sprint-13/PROGRESS.md` descreve o que foi entregue.
