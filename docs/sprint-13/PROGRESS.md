# Progresso — Sprint 13 — Segurança local básica

## Resumo

- Status geral: done
- Branch: `dev`
- Commit final sugerido: `feat(security): add optional local app lock`

## Entregue nesta sprint

- Suporte a autenticação local via `expo-local-authentication`.
- Configuração local para ativar/desativar bloqueio do app.
- Gate de bloqueio antes da navegação principal, sem mostrar dados financeiros atrás.
- Tela de bloqueio com retry e fallback controlado quando biometria fica indisponível.

## Progresso por task

### T1301 — Adicionar suporte a biometria local

- Status: done
- Feature: Suporte a biometria local

#### Desenvolvido

- `src/lib/localAuth.ts` detecta hardware, cadastro biométrico e tipos suportados.
- Autenticação local usa prompt nativo do aparelho.

#### Evidências

- Teste: `src/tests/features-sprint13.test.tsx` cobre detecção biométrica.

#### Pendências

- Nenhuma.

### T1302 — Criar configuração de bloqueio

- Status: done
- Feature: Configuração de bloqueio

#### Desenvolvido

- `appLockEnabled` salvo em `settings`.
- `SettingsScreen` permite ativar/desativar bloqueio quando biometria está disponível.

#### Evidências

- Teste cobre ativação, persistência e desativação.

#### Pendências

- Nenhuma.

### T1303 — Criar tela de bloqueio

- Status: done
- Feature: Tela de bloqueio

#### Desenvolvido

- `AppLockGate` envolve a navegação raiz após inicialização do banco.
- `AppLockScreen` bloqueia visualmente antes do dashboard e libera após autenticação.

#### Evidências

- Teste garante que conteúdo privado não aparece antes do desbloqueio.

#### Pendências

- Nenhuma.

### T1304 — Criar fallback controlado

- Status: done
- Feature: Fallback controlado

#### Desenvolvido

- Falha de autenticação mantém o app bloqueado e permite nova tentativa.
- Se biometria estiver indisponível após bloqueio ativado, o app mostra aviso e permite entrada sem apagar dados.

#### Evidências

- Testes cobrem retry após falha e fallback sem biometria.

#### Pendências

- Nenhuma.

## Testes executados

- `npm run typecheck` — passou.
- `npm run lint` — passou.
- `npm test -- --runInBand` — 25 suites, 103 testes passaram.

## Decisões técnicas

- Preferido bloqueio biométrico nativo do Expo. Sem PIN próprio nesta sprint para evitar armazenar segredo local fraco sem SecureStore.
- Fallback sem biometria libera o app com aviso para evitar travamento e perda de acesso aos dados locais.
- Pós-review: lock desativado não consulta biometria; falhas nativas não travam app; retorno do background relocka o app.

## Problemas / riscos encontrados

- `npm install` reportou 37 vulnerabilidades moderadas já existentes no audit; não bloqueou build/testes.
- `expo-local-authentication` adicionou suporte nativo; precisa rebuild do app nativo para uso em device.
- Disabling app lock sem nova autenticação foi deferido para hardening futuro.

## Próximo passo

- Abrir PR de `dev` para `main` ou iniciar Sprint 14.
