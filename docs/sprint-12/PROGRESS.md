# Progresso — Sprint 12 — Configurações locais

## Resumo

- Status geral: done
- Branch: `feature/sprint-12-local-settings`
- Commit final sugerido: `feat(settings): add local app preferences`

## Entregue nesta sprint

- Tela de configurações com informações do app, preferências e seção de dados locais.
- Preferência de moeda padrão (`BRL`, `USD`, `EUR`) salva em `settings`.
- Preferência de mês inicial (`current`, `lastWithData`) salva em `settings`.
- Dashboard aplica moeda salva e abre no último mês com dados quando configurado.
- Texto local-first: dados ficam no dispositivo, sem sincronização automática, backup manual recomendado.

## Progresso por task

### T1201 — Criar tela de configurações

- Status: done
- Desenvolvido: `src/features/settings/SettingsScreen.tsx`, `app/(tabs)/settings.tsx`
- Evidências: tela acessível pela aba Configurações e teste `src/tests/features-sprint12.test.tsx`.

### T1202 — Criar configuração de moeda padrão

- Status: done
- Desenvolvido: `src/lib/settings/preferences.ts`, `src/lib/money.ts`, `src/features/settings/SettingsScreen.tsx`, `src/features/dashboard/DashboardManager.tsx`
- Evidências: BRL default, escolha salva em `settings`, dashboard formata com moeda salva.

### T1203 — Criar configuração de mês inicial

- Status: done
- Desenvolvido: `src/lib/settings/preferences.ts`, `src/db/queries/dashboardQueries.ts`, `src/features/dashboard/DashboardManager.tsx`
- Evidências: preferência `lastWithData` abre dashboard no mês da transação mais recente.

### T1204 — Criar tela Sobre os dados locais

- Status: done
- Desenvolvido: `src/features/settings/SettingsScreen.tsx`
- Evidências: informa dados no dispositivo, sem sync automático, backup manual recomendado.

## Testes executados

- `npm test -- --runInBand src/tests/features-sprint12.test.tsx` — passou.
- `npm test -- --runInBand` — passou.
- `npm run lint` — passou.
- `npm run typecheck` — passou.

## Decisões técnicas

- Sem dependência nova; preferências usam repositório local `settings` existente.
- Moedas limitadas a `BRL`, `USD`, `EUR` para manter UI simples.
- Preferência de mês inicial aplicada no dashboard, tela inicial do app.

## Problemas / riscos encontrados

- Nenhum bloqueio.

## Próximo passo

- Iniciar Sprint 13 — Segurança local básica.
