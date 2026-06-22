# Sprint 12 — Configurações locais

## Objetivo

Adicionar preferências locais mínimas do usuário.

## Entrega da sprint

- Branch: `feature/sprint-12-local-settings`
- Commit final sugerido: `feat(settings): add local app preferences`
- Fase do plano: `Fase 9 — Backup, configurações e segurança`
- Resultado deve ser pequeno, revisável e testável.

## Regras da sprint

- [x] Criar uma feature branch para a sprint.
- [x] Manter as alterações coesas ao objetivo da sprint.
- [x] Atualizar ou criar testes junto com a implementação.
- [x] Executar `npm test` e `npm run lint` antes do commit final.
- [x] Não adicionar backend, Supabase, PostgreSQL, Java backend, API externa, IA ou sync automático.
- [x] Atualizar `docs/sprint-12/PROGRESS.md` com evidências reais.

## Tasks

### T1201 — Criar tela de configurações

- Status: done
- Feature: Tela de configurações
- Plano: `PLAN.md` > `Fase 9 — Backup, configurações e segurança`
- Dependências: T1105

#### Requisitos funcionais

- [x] Mostrar opções locais do app.
- [x] Tela acessível pela navegação.
- [x] Mostra informações do app.
- [x] Mostra seção de dados locais.
- [x] Mostra seção de preferências.

#### Requisitos técnicos

- [x] Persistir preferências no repositório de settings.
- [x] Aplicar preferências nas telas que formatam dinheiro e mês.
- [x] Explicar claramente o modelo local-first ao usuário.

#### Arquivos prováveis

- `src/features/settings/`
- `src/hooks/useSettings.ts`
- `src/features/settings/SettingsScreen.tsx`
- `src/db/repositories/settingsRepository.ts`
- `src/tests/features/settings/`

#### Passos sugeridos

1. Ler os arquivos prováveis e confirmar a estrutura existente.
2. Implementar somente o necessário para a feature desta task.
3. Adicionar ou atualizar testes específicos da task.
4. Rodar testes e lint.
5. Registrar evidências em `docs/sprint-12/PROGRESS.md`.

#### Critérios de aceite

- [x] Tela acessível pela navegação.
- [x] Mostra informações do app.
- [x] Mostra seção de dados locais.
- [x] Mostra seção de preferências.

#### Testes e verificação

- [x] Adicionar teste cobrindo `Criar tela de configurações` em arquivo de teste da sprint.
- [x] Cobrir pelo menos: Tela acessível pela navegação.
- [x] Executar `npm test` com a suíte atualizada.
- [x] Executar `npm run lint` sem erros novos.

### T1202 — Criar configuração de moeda padrão

- Status: done
- Feature: Configuração de moeda padrão
- Plano: `PLAN.md` > `Fase 9 — Backup, configurações e segurança`
- Dependências: T1201

#### Requisitos funcionais

- [x] Permitir escolher moeda principal.
- [x] BRL é padrão.
- [x] Escolha salva em `settings`.
- [x] Formatação usa moeda escolhida.
- [x] App mantém escolha após reiniciar.

#### Requisitos técnicos

- [x] Persistir preferências no repositório de settings.
- [x] Aplicar preferências nas telas que formatam dinheiro e mês.
- [x] Explicar claramente o modelo local-first ao usuário.

#### Arquivos prováveis

- `src/features/settings/`
- `src/hooks/useSettings.ts`
- `src/lib/money.ts`

#### Passos sugeridos

1. Ler os arquivos prováveis e confirmar a estrutura existente.
2. Implementar somente o necessário para a feature desta task.
3. Adicionar ou atualizar testes específicos da task.
4. Rodar testes e lint.
5. Registrar evidências em `docs/sprint-12/PROGRESS.md`.

#### Critérios de aceite

- [x] BRL é padrão.
- [x] Escolha salva em `settings`.
- [x] Formatação usa moeda escolhida.
- [x] App mantém escolha após reiniciar.

#### Testes e verificação

- [x] Adicionar teste cobrindo `Criar configuração de moeda padrão` em arquivo de teste da sprint.
- [x] Cobrir pelo menos: BRL é padrão.
- [x] Executar `npm test` com a suíte atualizada.
- [x] Executar `npm run lint` sem erros novos.

### T1203 — Criar configuração de mês inicial

- Status: done
- Feature: Configuração de mês inicial
- Plano: `PLAN.md` > `Fase 9 — Backup, configurações e segurança`
- Dependências: T1202

#### Requisitos funcionais

- [x] Escolher mês atual ou último mês com dados.
- [x] Opção mês atual abre o app no mês do relógio local.
- [x] Opção último mês com dados abre o mês mais recente com transações.
- [x] Escolha persiste localmente.

#### Requisitos técnicos

- [x] Persistir preferências no repositório de settings.
- [x] Aplicar preferências nas telas que formatam dinheiro e mês.
- [x] Explicar claramente o modelo local-first ao usuário.

#### Arquivos prováveis

- `src/lib/month.ts`
- `src/features/settings/`
- `src/hooks/useSettings.ts`

#### Passos sugeridos

1. Ler os arquivos prováveis e confirmar a estrutura existente.
2. Implementar somente o necessário para a feature desta task.
3. Adicionar ou atualizar testes específicos da task.
4. Rodar testes e lint.
5. Registrar evidências em `docs/sprint-12/PROGRESS.md`.

#### Critérios de aceite

- [x] Opção mês atual abre o app no mês do relógio local.
- [x] Opção último mês com dados abre o mês mais recente com transações.
- [x] Escolha persiste localmente.

#### Testes e verificação

- [x] Adicionar teste cobrindo `Criar configuração de mês inicial` em arquivo de teste da sprint.
- [x] Cobrir pelo menos: Opção mês atual abre o app no mês do relógio local.
- [x] Executar `npm test` com a suíte atualizada.
- [x] Executar `npm run lint` sem erros novos.

### T1204 — Criar tela Sobre os dados locais

- Status: done
- Feature: Tela Sobre os dados locais
- Plano: `PLAN.md` > `Fase 9 — Backup, configurações e segurança`
- Dependências: T1203

#### Requisitos funcionais

- [x] Explicar onde os dados ficam.
- [x] Informa que dados ficam no dispositivo.
- [x] Informa que não há sync.
- [x] Recomenda backup manual.
- [x] Não menciona serviços externos obrigatórios.

#### Requisitos técnicos

- [x] Persistir preferências no repositório de settings.
- [x] Aplicar preferências nas telas que formatam dinheiro e mês.
- [x] Explicar claramente o modelo local-first ao usuário.

#### Arquivos prováveis

- `src/features/settings/`
- `src/hooks/useSettings.ts`
- `src/features/settings/SettingsScreen.tsx`
- `src/db/repositories/settingsRepository.ts`
- `src/tests/features/settings/`

#### Passos sugeridos

1. Ler os arquivos prováveis e confirmar a estrutura existente.
2. Implementar somente o necessário para a feature desta task.
3. Adicionar ou atualizar testes específicos da task.
4. Rodar testes e lint.
5. Registrar evidências em `docs/sprint-12/PROGRESS.md`.

#### Critérios de aceite

- [x] Informa que dados ficam no dispositivo.
- [x] Informa que não há sync.
- [x] Recomenda backup manual.
- [x] Não menciona serviços externos obrigatórios.

#### Testes e verificação

- [x] Adicionar teste cobrindo `Criar tela Sobre os dados locais` em arquivo de teste da sprint.
- [x] Cobrir pelo menos: Informa que dados ficam no dispositivo.
- [x] Executar `npm test` com a suíte atualizada.
- [x] Executar `npm run lint` sem erros novos.

## Testes da sprint

- [x] Teste de salvar configuração.
- [x] Teste de recuperar configuração.
- [x] Teste de moeda padrão.
- [x] Teste de preferência de mês inicial.
- [x] `npm test` passa.
- [x] `npm run lint` passa.

## Checklist final

- [x] App abre sem tela branca.
- [x] `npm test` passa com os testes adicionados na sprint.
- [x] `npm run lint` passa sem erros.
- [x] Não há chamada de rede para dados financeiros.
- [x] Não há dependência proibida adicionada.
- [x] `docs/sprint-12/PROGRESS.md` descreve o que foi entregue.
