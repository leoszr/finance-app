# Sprint 12 — Configurações locais

## Objetivo

Adicionar preferências locais mínimas do usuário.

## Entrega da sprint

- Branch: `feature/sprint-12-local-settings`
- Commit final sugerido: `feat(settings): add local app preferences`
- Fase do plano: `Fase 9 — Backup, configurações e segurança`
- Resultado deve ser pequeno, revisável e testável.

## Regras da sprint

- [ ] Criar uma feature branch para a sprint.
- [ ] Manter as alterações coesas ao objetivo da sprint.
- [ ] Atualizar ou criar testes junto com a implementação.
- [ ] Executar `npm test` e `npm run lint` antes do commit final.
- [ ] Não adicionar backend, Supabase, PostgreSQL, Java backend, API externa, IA ou sync automático.
- [ ] Atualizar `docs/sprint-12/PROGRESS.md` com evidências reais.

## Tasks

### T1201 — Criar tela de configurações

- Status: todo
- Feature: Tela de configurações
- Plano: `PLAN.md` > `Fase 9 — Backup, configurações e segurança`
- Dependências: T1105

#### Requisitos funcionais

- [ ] Mostrar opções locais do app.
- [ ] Tela acessível pela navegação.
- [ ] Mostra informações do app.
- [ ] Mostra seção de dados locais.
- [ ] Mostra seção de preferências.

#### Requisitos técnicos

- [ ] Persistir preferências no repositório de settings.
- [ ] Aplicar preferências nas telas que formatam dinheiro e mês.
- [ ] Explicar claramente o modelo local-first ao usuário.

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

- [ ] Tela acessível pela navegação.
- [ ] Mostra informações do app.
- [ ] Mostra seção de dados locais.
- [ ] Mostra seção de preferências.

#### Testes e verificação

- [ ] Adicionar teste cobrindo `Criar tela de configurações` em arquivo de teste da sprint.
- [ ] Cobrir pelo menos: Tela acessível pela navegação.
- [ ] Executar `npm test` com a suíte atualizada.
- [ ] Executar `npm run lint` sem erros novos.

### T1202 — Criar configuração de moeda padrão

- Status: todo
- Feature: Configuração de moeda padrão
- Plano: `PLAN.md` > `Fase 9 — Backup, configurações e segurança`
- Dependências: T1201

#### Requisitos funcionais

- [ ] Permitir escolher moeda principal.
- [ ] BRL é padrão.
- [ ] Escolha salva em `settings`.
- [ ] Formatação usa moeda escolhida.
- [ ] App mantém escolha após reiniciar.

#### Requisitos técnicos

- [ ] Persistir preferências no repositório de settings.
- [ ] Aplicar preferências nas telas que formatam dinheiro e mês.
- [ ] Explicar claramente o modelo local-first ao usuário.

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

- [ ] BRL é padrão.
- [ ] Escolha salva em `settings`.
- [ ] Formatação usa moeda escolhida.
- [ ] App mantém escolha após reiniciar.

#### Testes e verificação

- [ ] Adicionar teste cobrindo `Criar configuração de moeda padrão` em arquivo de teste da sprint.
- [ ] Cobrir pelo menos: BRL é padrão.
- [ ] Executar `npm test` com a suíte atualizada.
- [ ] Executar `npm run lint` sem erros novos.

### T1203 — Criar configuração de mês inicial

- Status: todo
- Feature: Configuração de mês inicial
- Plano: `PLAN.md` > `Fase 9 — Backup, configurações e segurança`
- Dependências: T1202

#### Requisitos funcionais

- [ ] Escolher mês atual ou último mês com dados.
- [ ] Opção mês atual abre o app no mês do relógio local.
- [ ] Opção último mês com dados abre o mês mais recente com transações.
- [ ] Escolha persiste localmente.

#### Requisitos técnicos

- [ ] Persistir preferências no repositório de settings.
- [ ] Aplicar preferências nas telas que formatam dinheiro e mês.
- [ ] Explicar claramente o modelo local-first ao usuário.

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

- [ ] Opção mês atual abre o app no mês do relógio local.
- [ ] Opção último mês com dados abre o mês mais recente com transações.
- [ ] Escolha persiste localmente.

#### Testes e verificação

- [ ] Adicionar teste cobrindo `Criar configuração de mês inicial` em arquivo de teste da sprint.
- [ ] Cobrir pelo menos: Opção mês atual abre o app no mês do relógio local.
- [ ] Executar `npm test` com a suíte atualizada.
- [ ] Executar `npm run lint` sem erros novos.

### T1204 — Criar tela Sobre os dados locais

- Status: todo
- Feature: Tela Sobre os dados locais
- Plano: `PLAN.md` > `Fase 9 — Backup, configurações e segurança`
- Dependências: T1203

#### Requisitos funcionais

- [ ] Explicar onde os dados ficam.
- [ ] Informa que dados ficam no dispositivo.
- [ ] Informa que não há sync.
- [ ] Recomenda backup manual.
- [ ] Não menciona serviços externos obrigatórios.

#### Requisitos técnicos

- [ ] Persistir preferências no repositório de settings.
- [ ] Aplicar preferências nas telas que formatam dinheiro e mês.
- [ ] Explicar claramente o modelo local-first ao usuário.

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

- [ ] Informa que dados ficam no dispositivo.
- [ ] Informa que não há sync.
- [ ] Recomenda backup manual.
- [ ] Não menciona serviços externos obrigatórios.

#### Testes e verificação

- [ ] Adicionar teste cobrindo `Criar tela Sobre os dados locais` em arquivo de teste da sprint.
- [ ] Cobrir pelo menos: Informa que dados ficam no dispositivo.
- [ ] Executar `npm test` com a suíte atualizada.
- [ ] Executar `npm run lint` sem erros novos.

## Testes da sprint

- [ ] Teste de salvar configuração.
- [ ] Teste de recuperar configuração.
- [ ] Teste de moeda padrão.
- [ ] Teste de preferência de mês inicial.
- [ ] `npm test` passa.
- [ ] `npm run lint` passa.

## Checklist final

- [ ] App abre sem tela branca.
- [ ] `npm test` passa com os testes adicionados na sprint.
- [ ] `npm run lint` passa sem erros.
- [ ] Não há chamada de rede para dados financeiros.
- [ ] Não há dependência proibida adicionada.
- [ ] `docs/sprint-12/PROGRESS.md` descreve o que foi entregue.
