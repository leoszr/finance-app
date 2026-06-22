# Sprint 13 — Segurança local básica

## Objetivo

Adicionar bloqueio local opcional com biometria ou PIN definido pelo usuário.

## Entrega da sprint

- Branch: `dev`
- Commit final sugerido: `feat(security): add optional local app lock`
- Fase do plano: `Fase 9 — Backup, configurações e segurança`
- Resultado deve ser pequeno, revisável e testável.

## Regras da sprint

- [x] Garantir que o trabalho da sprint será feito na branch `dev`.
- [x] Manter as alterações coesas ao objetivo da sprint.
- [x] Atualizar ou criar testes junto com a implementação.
- [x] Executar `npm test` e `npm run lint` antes do commit final.
- [x] Não adicionar backend, Supabase, PostgreSQL, Java backend, API externa, IA ou sync automático.
- [ ] Ao concluir, abrir PR de `dev` para `main`.
- [x] Atualizar `docs/sprint-13/PROGRESS.md` com evidências reais.

## Tasks

### T1301 — Adicionar suporte a biometria local

- Status: done
- Feature: Suporte a biometria local
- Plano: `PLAN.md` > `Fase 9 — Backup, configurações e segurança`
- Dependências: T1204

#### Requisitos funcionais

- [x] Permitir desbloqueio com Face ID, Touch ID ou biometria Android.
- [x] App detecta disponibilidade.
- [x] Usuário pode ativar bloqueio.
- [x] App solicita autenticação ao abrir.
- [x] Sem biometria, opção fica indisponível.

#### Requisitos técnicos

- [x] Usar autenticação local do dispositivo quando disponível.
- [x] Não enviar credenciais ou dados financeiros para rede.
- [x] Garantir fallback sem apagar dados.

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

- [x] App detecta disponibilidade.
- [x] Usuário pode ativar bloqueio.
- [x] App solicita autenticação ao abrir.
- [x] Sem biometria, opção fica indisponível.

#### Testes e verificação

- [x] Adicionar teste cobrindo `Adicionar suporte a biometria local` em arquivo de teste da sprint.
- [x] Cobrir pelo menos: App detecta disponibilidade.
- [x] Executar `npm test` com a suíte atualizada.
- [x] Executar `npm run lint` sem erros novos.

### T1302 — Criar configuração de bloqueio

- Status: done
- Feature: Configuração de bloqueio
- Plano: `PLAN.md` > `Fase 9 — Backup, configurações e segurança`
- Dependências: T1301

#### Requisitos funcionais

- [x] Salvar preferência local.
- [x] Usuário ativa bloqueio.
- [x] Usuário desativa bloqueio.
- [x] Escolha persiste.
- [x] App respeita escolha ao reiniciar.

#### Requisitos técnicos

- [x] Usar autenticação local do dispositivo quando disponível.
- [x] Não enviar credenciais ou dados financeiros para rede.
- [x] Garantir fallback sem apagar dados.

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

- [x] Usuário ativa bloqueio.
- [x] Usuário desativa bloqueio.
- [x] Escolha persiste.
- [x] App respeita escolha ao reiniciar.

#### Testes e verificação

- [x] Adicionar teste cobrindo `Criar configuração de bloqueio` em arquivo de teste da sprint.
- [x] Cobrir pelo menos: Usuário ativa bloqueio.
- [x] Executar `npm test` com a suíte atualizada.
- [x] Executar `npm run lint` sem erros novos.

### T1303 — Criar tela de bloqueio

- Status: done
- Feature: Tela de bloqueio
- Plano: `PLAN.md` > `Fase 9 — Backup, configurações e segurança`
- Dependências: T1302

#### Requisitos funcionais

- [x] Impedir acesso visual aos dados antes da autenticação.
- [x] Tela aparece antes do dashboard.
- [x] Dados financeiros não aparecem atrás da tela.
- [x] Falha mantém app bloqueado.
- [x] Sucesso libera navegação.

#### Requisitos técnicos

- [x] Usar autenticação local do dispositivo quando disponível.
- [x] Não enviar credenciais ou dados financeiros para rede.
- [x] Garantir fallback sem apagar dados.

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

- [x] Tela aparece antes do dashboard.
- [x] Dados financeiros não aparecem atrás da tela.
- [x] Falha mantém app bloqueado.
- [x] Sucesso libera navegação.

#### Testes e verificação

- [x] Adicionar teste cobrindo `Criar tela de bloqueio` em arquivo de teste da sprint.
- [x] Cobrir pelo menos: Tela aparece antes do dashboard.
- [x] Executar `npm test` com a suíte atualizada.
- [x] Executar `npm run lint` sem erros novos.

### T1304 — Criar fallback controlado

- Status: done
- Feature: Fallback controlado
- Plano: `PLAN.md` > `Fase 9 — Backup, configurações e segurança`
- Dependências: T1303

#### Requisitos funcionais

- [x] Evitar travamento do app.
- [x] Usuário pode tentar autenticar novamente.
- [x] Sem biometria, app mostra aviso.
- [x] App não perde dados.

#### Requisitos técnicos

- [x] Usar autenticação local do dispositivo quando disponível.
- [x] Não enviar credenciais ou dados financeiros para rede.
- [x] Garantir fallback sem apagar dados.

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

- [x] Usuário pode tentar autenticar novamente.
- [x] Sem biometria, app mostra aviso.
- [x] App não perde dados.

#### Testes e verificação

- [x] Adicionar teste cobrindo `Criar fallback controlado` em arquivo de teste da sprint.
- [x] Cobrir pelo menos: Usuário pode tentar autenticar novamente.
- [x] Executar `npm test` com a suíte atualizada.
- [x] Executar `npm run lint` sem erros novos.

## Testes da sprint

- [x] Teste de configuração ativada.
- [x] Teste de configuração desativada.
- [x] Teste de tela bloqueada.
- [x] Teste de desbloqueio com mock.
- [x] Teste de fallback sem biometria.
- [x] `npm test` passa.
- [x] `npm run lint` passa.

## Checklist final

- [x] App abre sem tela branca.
- [x] `npm test` passa com os testes adicionados na sprint.
- [x] `npm run lint` passa sem erros.
- [x] Não há chamada de rede para dados financeiros.
- [x] Não há dependência proibida adicionada.
- [x] `docs/sprint-13/PROGRESS.md` descreve o que foi entregue.
