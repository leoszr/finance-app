# Sprint 15 — Hardening e release interno

## Objetivo

Preparar uma versão testável real no celular.

## Entrega da sprint

- Branch: `dev`
- Commit final sugerido: `chore(release): prepare internal local-first build`
- Fase do plano: `Fase 10 — Polimento e release interno`
- Resultado deve ser pequeno, revisável e testável.

## Regras da sprint

- [x] Garantir que o trabalho da sprint será feito na branch `dev`.
- [x] Manter as alterações coesas ao objetivo da sprint.
- [x] Atualizar ou criar testes junto com a implementação.
- [x] Executar `npm test` e `npm run lint` antes do commit final.
- [x] Não adicionar backend, Supabase, PostgreSQL, Java backend, API externa, IA ou sync automático.
- [x] Ao concluir, abrir PR de `dev` para `main`.
- [x] Atualizar `docs/sprint-15/PROGRESS.md` com evidências reais.

## Tasks

### T1501 — Revisar dependências

- Status: done
- Feature: Dependências
- Plano: `PLAN.md` > `Fase 10 — Polimento e release interno`
- Dependências: T1405

#### Requisitos funcionais

- [x] Remover dependências desnecessárias.
- [x] Não há Supabase.
- [x] Não há PostgreSQL.
- [x] Não há SDK de IA.
- [x] Não há cliente HTTP desnecessário.
- [x] Dependências justificadas.

#### Requisitos técnicos

- [x] Remover dependências sem uso e justificar as restantes.
- [x] Documentar teste manual em iOS e Android.
- [x] Preparar build interno sem introduzir backend.

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

- [x] Não há Supabase.
- [x] Não há PostgreSQL.
- [x] Não há SDK de IA.
- [x] Não há cliente HTTP desnecessário.
- [x] Dependências justificadas.

#### Testes e verificação

- [x] Adicionar teste cobrindo `Revisar dependências` em arquivo de teste da sprint.
- [x] Cobrir pelo menos: Não há Supabase.
- [x] Executar `npm test` com a suíte atualizada.
- [x] Executar `npm run lint` sem erros novos.

### T1502 — Criar checklist de teste manual

- Status: done
- Feature: Checklist de teste manual
- Plano: `PLAN.md` > `Fase 10 — Polimento e release interno`
- Dependências: T1501

#### Requisitos funcionais

- [x] Permitir validação humana do app.
- [x] Checklist existe no repositório.
- [x] Cada item tem resultado esperado.
- [x] Checklist cobre iPhone e Android.

#### Requisitos técnicos

- [x] Remover dependências sem uso e justificar as restantes.
- [x] Documentar teste manual em iOS e Android.
- [x] Preparar build interno sem introduzir backend.

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

- [x] Checklist existe no repositório.
- [x] Cada item tem resultado esperado.
- [x] Checklist cobre iPhone e Android.

#### Testes e verificação

- [x] Adicionar teste cobrindo `Criar checklist de teste manual` em arquivo de teste da sprint.
- [x] Cobrir pelo menos: Checklist existe no repositório.
- [x] Executar `npm test` com a suíte atualizada.
- [x] Executar `npm run lint` sem erros novos.

### T1503 — Criar dados de demonstração locais

- Status: done
- Feature: Dados de demonstração locais
- Plano: `PLAN.md` > `Fase 10 — Polimento e release interno`
- Dependências: T1502

#### Requisitos funcionais

- [x] Facilitar teste visual do app.
- [x] Usuário pode popular dados fake.
- [x] Dados fake marcados como demonstração.
- [x] Usuário pode apagar dados fake.
- [x] Função não roda automaticamente em produção.

#### Requisitos técnicos

- [x] Remover dependências sem uso e justificar as restantes.
- [x] Documentar teste manual em iOS e Android.
- [x] Preparar build interno sem introduzir backend.

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

- [x] Usuário pode popular dados fake.
- [x] Dados fake marcados como demonstração.
- [x] Usuário pode apagar dados fake.
- [x] Função não roda automaticamente em produção.

#### Testes e verificação

- [x] Adicionar teste cobrindo `Criar dados de demonstração locais` em arquivo de teste da sprint.
- [x] Cobrir pelo menos: Usuário pode popular dados fake.
- [x] Executar `npm test` com a suíte atualizada.
- [x] Executar `npm run lint` sem erros novos.

### T1504 — Testar persistência após reinício

- Status: done
- Feature: Persistência após reinício
- Plano: `PLAN.md` > `Fase 10 — Polimento e release interno`
- Dependências: T1503

#### Requisitos funcionais

- [x] Garantir comportamento local-first.
- [x] Dados continuam após fechar e abrir app.
- [x] Filtros retornam o mesmo resultado antes e depois de reiniciar o app.
- [x] Relatórios continuam corretos.
- [x] Backup exportado contém dados atuais.

#### Requisitos técnicos

- [x] Remover dependências sem uso e justificar as restantes.
- [x] Documentar teste manual em iOS e Android.
- [x] Preparar build interno sem introduzir backend.

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

- [x] Dados continuam após fechar e abrir app.
- [x] Filtros retornam o mesmo resultado antes e depois de reiniciar o app.
- [x] Relatórios continuam corretos.
- [x] Backup exportado contém dados atuais.

#### Testes e verificação

- [x] Adicionar teste cobrindo `Testar persistência após reinício` em arquivo de teste da sprint.
- [x] Cobrir pelo menos: Dados continuam após fechar e abrir app.
- [x] Executar `npm test` com a suíte atualizada.
- [x] Executar `npm run lint` sem erros novos.

### T1505 — Configurar build interno com EAS

- Status: done
- Feature: Build interno com EAS
- Plano: `PLAN.md` > `Fase 10 — Polimento e release interno`
- Dependências: T1504

#### Requisitos funcionais

- [x] Gerar app instalável para teste.
- [x] EAS configurado.
- [x] Build Android interno configurado.
- [x] Build iOS interno configurado se conta Apple estiver disponível.
- [x] Instruções de build documentadas.

#### Requisitos técnicos

- [x] Remover dependências sem uso e justificar as restantes.
- [x] Documentar teste manual em iOS e Android.
- [x] Preparar build interno sem introduzir backend.

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

- [x] EAS configurado.
- [x] Build Android interno configurado.
- [x] Build iOS interno configurado se conta Apple estiver disponível.
- [x] Instruções de build documentadas.

#### Testes e verificação

- [x] Adicionar teste cobrindo `Configurar build interno com EAS` em arquivo de teste da sprint.
- [x] Cobrir pelo menos: EAS configurado.
- [x] Executar `npm test` com a suíte atualizada.
- [x] Executar `npm run lint` sem erros novos.

## Testes da sprint

- [x] Suíte completa.
- [ ] Teste manual com checklist.
- [ ] Teste de export/import.
- [ ] Teste de PDF.
- [x] Teste de persistência.
- [ ] Teste de build.
- [x] `npm test` passa.
- [x] `npm run lint` passa.

## Checklist final

- [ ] App abre sem tela branca.
- [x] `npm test` passa com os testes adicionados na sprint.
- [x] `npm run lint` passa sem erros.
- [x] Não há chamada de rede para dados financeiros.
- [x] Não há dependência proibida adicionada.
- [x] `docs/sprint-15/PROGRESS.md` descreve o que foi entregue.
