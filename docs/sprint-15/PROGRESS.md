# Progresso — Sprint 15 — Hardening e release interno

## Resumo

- Status geral: done
- Branch: `dev`
- Commit final sugerido: `chore(release): prepare internal local-first build`

## Entregue nesta sprint

- Revisão de dependências documentada em `docs/dependency-review.md`.
- Checklist manual criado em `docs/manual-test-checklist.md` para iPhone e Android.
- Dados de demonstração locais criados/apagados via Configurações, marcados com `[Demo]`.
- Persistência local coberta por teste recriando wrappers de repositório sobre a mesma base.
- Build interno EAS configurado em `eas.json` e documentado em `docs/release.md`.
- Pós-review: limpeza demo exige confirmação, reduz colisão de `[Demo]`, build ganhou IDs nativos e input monetário preserva `1.234` como `R$ 1.234,00`.

## Progresso por task

### T1501 — Revisar dependências

- Status: done
- Feature: Dependências

#### Desenvolvido

- Confirmado ausência de Supabase, PostgreSQL, SDK de IA e cliente HTTP dedicado.
- Dependências restantes justificadas em `docs/dependency-review.md`.

#### Evidências

- Teste em `src/tests/features-sprint15.test.tsx` valida dependências proibidas.

#### Pendências

- Nenhuma.

### T1502 — Criar checklist de teste manual

- Status: done
- Feature: Checklist de teste manual

#### Desenvolvido

- Criado `docs/manual-test-checklist.md` com passos e resultado esperado.
- Checklist cobre iPhone e Android.

#### Evidências

- Teste valida existência de iPhone, Android e resultado esperado.

#### Pendências

- Nenhuma.

### T1503 — Criar dados de demonstração locais

- Status: done
- Feature: Dados de demonstração locais

#### Desenvolvido

- Criado `src/lib/demoData.ts` com `seedDemoData` e `clearDemoData`.
- Configurações ganhou botões `Criar demo` e `Apagar demo`.
- Dados demo usam prefixo `[Demo]` e não rodam automaticamente.

#### Evidências

- Teste valida criação e limpeza de conta, categorias e transações demo.

#### Pendências

- Nenhuma.

### T1504 — Testar persistência após reinício

- Status: done
- Feature: Persistência após reinício

#### Desenvolvido

- Checklist manual inclui fechar/reabrir app, filtros, relatórios e backup.
- Teste automatizado confirma dados preservados ao recriar wrappers de repositório sobre a mesma base local.

#### Evidências

- `src/tests/features-sprint15.test.tsx` cobre persistência de repositório.

#### Pendências

- Teste físico em aparelho deve ser anexado no PR.

### T1505 — Configurar build interno com EAS

- Status: done
- Feature: Build interno com EAS

#### Desenvolvido

- Criado `eas.json` com profile `internal` e Android APK.
- Criado `docs/release.md` com comandos de build e validação.

#### Evidências

- Teste valida `eas.json` e instrução `eas build --profile internal`.

#### Pendências

- iOS depende de conta Apple disponível no EAS.

## Testes executados

- `npm test -- --runInBand src/tests/features-sprint15.test.tsx` — passou, 8 testes.
- `npm run typecheck` — passou.
- `npm run lint` — passou.
- `npm test -- --runInBand` — passou, 27 suites, 118 testes.

## Decisões técnicas

- Não removidas dependências do runtime Expo sem `expo doctor`; risco maior que ganho para release interno.
- Demo usa prefixo `[Demo]`, sem migration nova e sem backend.
- Android interno configurado como APK; iOS mantido no perfil, dependente de conta Apple.

## Problemas / riscos encontrados

- Teste manual real em iPhone/Android ainda precisa ser executado fora do ambiente automatizado.

## Próximo passo

- Abrir PR de `dev` para `main`.
