# Sprint 15 — Hardening e release interno

## Objetivo

Preparar uma versão testável real no celular.

## Entrega da sprint

- Branch: `feature/sprint-15-internal-release`
- Commit final sugerido: `chore(release): prepare internal local-first build`
- Fase do plano: `Fase 10 — Polimento e release interno`
- Resultado deve ser pequeno, revisável e testável.

## Regras da sprint

- [ ] Criar uma feature branch para a sprint.
- [ ] Manter as alterações coesas ao objetivo da sprint.
- [ ] Atualizar ou criar testes junto com a implementação.
- [ ] Executar `npm test` e `npm run lint` antes do commit final.
- [ ] Não adicionar backend, Supabase, PostgreSQL, Java backend, API externa, IA ou sync automático.
- [ ] Atualizar `docs/sprint-15/PROGRESS.md` com evidências reais.

## Tasks

### T1501 — Revisar dependências

- Status: todo
- Feature: Dependências
- Plano: `PLAN.md` > `Fase 10 — Polimento e release interno`
- Dependências: T1405

#### Requisitos funcionais

- [ ] Remover dependências desnecessárias.
- [ ] Não há Supabase.
- [ ] Não há PostgreSQL.
- [ ] Não há SDK de IA.
- [ ] Não há cliente HTTP desnecessário.
- [ ] Dependências justificadas.

#### Requisitos técnicos

- [ ] Remover dependências sem uso e justificar as restantes.
- [ ] Documentar teste manual em iOS e Android.
- [ ] Preparar build interno sem introduzir backend.

#### Arquivos prováveis

- `package.json`
- `eas.json`
- `docs/manual-test-checklist.md`
- `src/lib/demoData.ts`
- `docs/release.md`

#### Passos sugeridos

1. Ler os arquivos prováveis e confirmar a estrutura existente.
2. Implementar somente o necessário para a feature desta task.
3. Adicionar ou atualizar testes específicos da task.
4. Rodar testes e lint.
5. Registrar evidências em `docs/sprint-15/PROGRESS.md`.

#### Critérios de aceite

- [ ] Não há Supabase.
- [ ] Não há PostgreSQL.
- [ ] Não há SDK de IA.
- [ ] Não há cliente HTTP desnecessário.
- [ ] Dependências justificadas.

#### Testes e verificação

- [ ] Adicionar teste cobrindo `Revisar dependências` em arquivo de teste da sprint.
- [ ] Cobrir pelo menos: Não há Supabase.
- [ ] Executar `npm test` com a suíte atualizada.
- [ ] Executar `npm run lint` sem erros novos.

### T1502 — Criar checklist de teste manual

- Status: todo
- Feature: Checklist de teste manual
- Plano: `PLAN.md` > `Fase 10 — Polimento e release interno`
- Dependências: T1501

#### Requisitos funcionais

- [ ] Permitir validação humana do app.
- [ ] Checklist existe no repositório.
- [ ] Cada item tem resultado esperado.
- [ ] Checklist cobre iPhone e Android.

#### Requisitos técnicos

- [ ] Remover dependências sem uso e justificar as restantes.
- [ ] Documentar teste manual em iOS e Android.
- [ ] Preparar build interno sem introduzir backend.

#### Arquivos prováveis

- `docs/manual-test-checklist.md`
- `package.json`
- `eas.json`

#### Passos sugeridos

1. Ler os arquivos prováveis e confirmar a estrutura existente.
2. Implementar somente o necessário para a feature desta task.
3. Adicionar ou atualizar testes específicos da task.
4. Rodar testes e lint.
5. Registrar evidências em `docs/sprint-15/PROGRESS.md`.

#### Critérios de aceite

- [ ] Checklist existe no repositório.
- [ ] Cada item tem resultado esperado.
- [ ] Checklist cobre iPhone e Android.

#### Testes e verificação

- [ ] Adicionar teste cobrindo `Criar checklist de teste manual` em arquivo de teste da sprint.
- [ ] Cobrir pelo menos: Checklist existe no repositório.
- [ ] Executar `npm test` com a suíte atualizada.
- [ ] Executar `npm run lint` sem erros novos.

### T1503 — Criar dados de demonstração locais

- Status: todo
- Feature: Dados de demonstração locais
- Plano: `PLAN.md` > `Fase 10 — Polimento e release interno`
- Dependências: T1502

#### Requisitos funcionais

- [ ] Facilitar teste visual do app.
- [ ] Usuário pode popular dados fake.
- [ ] Dados fake marcados como demonstração.
- [ ] Usuário pode apagar dados fake.
- [ ] Função não roda automaticamente em produção.

#### Requisitos técnicos

- [ ] Remover dependências sem uso e justificar as restantes.
- [ ] Documentar teste manual em iOS e Android.
- [ ] Preparar build interno sem introduzir backend.

#### Arquivos prováveis

- `src/lib/demoData.ts`
- `src/features/settings/`
- `package.json`
- `eas.json`

#### Passos sugeridos

1. Ler os arquivos prováveis e confirmar a estrutura existente.
2. Implementar somente o necessário para a feature desta task.
3. Adicionar ou atualizar testes específicos da task.
4. Rodar testes e lint.
5. Registrar evidências em `docs/sprint-15/PROGRESS.md`.

#### Critérios de aceite

- [ ] Usuário pode popular dados fake.
- [ ] Dados fake marcados como demonstração.
- [ ] Usuário pode apagar dados fake.
- [ ] Função não roda automaticamente em produção.

#### Testes e verificação

- [ ] Adicionar teste cobrindo `Criar dados de demonstração locais` em arquivo de teste da sprint.
- [ ] Cobrir pelo menos: Usuário pode popular dados fake.
- [ ] Executar `npm test` com a suíte atualizada.
- [ ] Executar `npm run lint` sem erros novos.

### T1504 — Testar persistência após reinício

- Status: todo
- Feature: Persistência após reinício
- Plano: `PLAN.md` > `Fase 10 — Polimento e release interno`
- Dependências: T1503

#### Requisitos funcionais

- [ ] Garantir comportamento local-first.
- [ ] Dados continuam após fechar e abrir app.
- [ ] Filtros retornam o mesmo resultado antes e depois de reiniciar o app.
- [ ] Relatórios continuam corretos.
- [ ] Backup exportado contém dados atuais.

#### Requisitos técnicos

- [ ] Remover dependências sem uso e justificar as restantes.
- [ ] Documentar teste manual em iOS e Android.
- [ ] Preparar build interno sem introduzir backend.

#### Arquivos prováveis

- `package.json`
- `eas.json`
- `docs/manual-test-checklist.md`
- `src/lib/demoData.ts`
- `docs/release.md`

#### Passos sugeridos

1. Ler os arquivos prováveis e confirmar a estrutura existente.
2. Implementar somente o necessário para a feature desta task.
3. Adicionar ou atualizar testes específicos da task.
4. Rodar testes e lint.
5. Registrar evidências em `docs/sprint-15/PROGRESS.md`.

#### Critérios de aceite

- [ ] Dados continuam após fechar e abrir app.
- [ ] Filtros retornam o mesmo resultado antes e depois de reiniciar o app.
- [ ] Relatórios continuam corretos.
- [ ] Backup exportado contém dados atuais.

#### Testes e verificação

- [ ] Adicionar teste cobrindo `Testar persistência após reinício` em arquivo de teste da sprint.
- [ ] Cobrir pelo menos: Dados continuam após fechar e abrir app.
- [ ] Executar `npm test` com a suíte atualizada.
- [ ] Executar `npm run lint` sem erros novos.

### T1505 — Configurar build interno com EAS

- Status: todo
- Feature: Build interno com EAS
- Plano: `PLAN.md` > `Fase 10 — Polimento e release interno`
- Dependências: T1504

#### Requisitos funcionais

- [ ] Gerar app instalável para teste.
- [ ] EAS configurado.
- [ ] Build Android interno configurado.
- [ ] Build iOS interno configurado se conta Apple estiver disponível.
- [ ] Instruções de build documentadas.

#### Requisitos técnicos

- [ ] Remover dependências sem uso e justificar as restantes.
- [ ] Documentar teste manual em iOS e Android.
- [ ] Preparar build interno sem introduzir backend.

#### Arquivos prováveis

- `src/features/settings/`
- `src/hooks/useSettings.ts`
- `eas.json`
- `docs/release.md`
- `package.json`

#### Passos sugeridos

1. Ler os arquivos prováveis e confirmar a estrutura existente.
2. Implementar somente o necessário para a feature desta task.
3. Adicionar ou atualizar testes específicos da task.
4. Rodar testes e lint.
5. Registrar evidências em `docs/sprint-15/PROGRESS.md`.

#### Critérios de aceite

- [ ] EAS configurado.
- [ ] Build Android interno configurado.
- [ ] Build iOS interno configurado se conta Apple estiver disponível.
- [ ] Instruções de build documentadas.

#### Testes e verificação

- [ ] Adicionar teste cobrindo `Configurar build interno com EAS` em arquivo de teste da sprint.
- [ ] Cobrir pelo menos: EAS configurado.
- [ ] Executar `npm test` com a suíte atualizada.
- [ ] Executar `npm run lint` sem erros novos.

## Testes da sprint

- [ ] Suíte completa.
- [ ] Teste manual com checklist.
- [ ] Teste de export/import.
- [ ] Teste de PDF.
- [ ] Teste de persistência.
- [ ] Teste de build.
- [ ] `npm test` passa.
- [ ] `npm run lint` passa.

## Checklist final

- [ ] App abre sem tela branca.
- [ ] `npm test` passa com os testes adicionados na sprint.
- [ ] `npm run lint` passa sem erros.
- [ ] Não há chamada de rede para dados financeiros.
- [ ] Não há dependência proibida adicionada.
- [ ] `docs/sprint-15/PROGRESS.md` descreve o que foi entregue.
