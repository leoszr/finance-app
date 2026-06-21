# Progresso — Sprint 00 — Fundação do projeto

## Resumo

- Status geral: done
- Branch: `feature/sprint-00-project-foundation`
- Commit final sugerido: `chore(project): setup expo local-first finance app`
- Sprint implementada com base Expo + TypeScript, estrutura modular, lint, testes e tela inicial temporária.

## Entregue nesta sprint

- Projeto Expo TypeScript criado em `package.json`, `app.json`, `tsconfig.json` e `app/`.
- Expo Router configurado com `app/_layout.tsx` e `app/index.tsx`.
- Estrutura criada: `app/`, `src/components/`, `src/db/`, `src/features/`, `src/hooks/`, `src/lib/`, `src/tests/`, `src/types/`.
- Alias `@/` configurado para `src/*` em TypeScript, Jest e imports do app.
- Lint configurado com `eslint.config.js` e script `npm run lint`.
- Testes configurados com `jest.config.js`, `jest-expo` e `@testing-library/react-native`.
- Tela inicial temporária mostra `Finance App`, selo `local-first` e mensagem de fundação técnica.

## Progresso por task

### T0001 — Criar projeto Expo com TypeScript

- Status: done
- Feature: Projeto Expo com TypeScript

#### Desenvolvido

- Criados `package.json`, `package-lock.json`, `app.json`, `tsconfig.json`, `app/_layout.tsx` e `app/index.tsx`.
- TypeScript em modo estrito ativado.
- Script `npm start` usando `expo start`.

#### Evidências

- `npm install` executado com exit code 0.
- `npx expo start --clear` iniciou Metro em `http://localhost:8081` com exit code 0 após parada manual.
- `npx expo export --platform ios --output-dir /tmp/finance-app-export-check` gerou bundle iOS com exit code 0.

#### Pendências

- Nenhuma para a sprint.

### T0002 — Configurar estrutura de pastas

- Status: done
- Feature: Estrutura de pastas

#### Desenvolvido

- Criadas as pastas exigidas e `.gitkeep` nas pastas ainda sem implementação.
- Alias `@/` adotado para imports de `src/*`.
- `app/index.tsx` importa `@/components/Screen` e `@/lib/appInfo`.

#### Evidências

- Teste `src/tests/smoke.test.tsx` valida existência das pastas e import absoluto.
- `npm run typecheck` executado com exit code 0.

#### Pendências

- Nenhuma para a sprint.

### T0003 — Configurar lint e formatação

- Status: done
- Feature: Lint e formatação

#### Desenvolvido

- Criado `eslint.config.js` com base `eslint-config-expo/flat`.
- Script `npm run lint` criado.
- Adicionado `eslint-import-resolver-typescript` para resolver alias TypeScript no lint.

#### Evidências

- `npm run lint` executado com exit code 0.
- Teste `src/tests/smoke.test.tsx` valida script de lint.

#### Pendências

- Nenhuma para a sprint.

### T0004 — Configurar ambiente de testes

- Status: done
- Feature: Ambiente de testes

#### Desenvolvido

- Criado `jest.config.js` com preset `jest-expo`.
- Criado `src/tests/setup.ts`.
- Criados testes unitários e de componente em `src/tests/smoke.test.tsx`.

#### Evidências

- `npm test` executado com exit code 0.
- Resultado: 2 suítes passando, 7 testes passando.
- Testes cobrem módulo TypeScript e renderização React Native com texto.

#### Pendências

- Nenhuma para a sprint.

### T0005 — Criar tela inicial temporária

- Status: done
- Feature: Tela inicial temporária

#### Desenvolvido

- Criada tela inicial em `app/index.tsx`.
- Criado wrapper visual `src/components/Screen.tsx`.
- Conteúdo mostra nome do app e informa abordagem local-first.
- Layout usa `ScrollView`, largura fluida e card central para evitar corte em larguras mobile comuns.

#### Evidências

- `src/tests/home.test.tsx` renderiza a tela e busca `Finance App` e `local-first`.
- `npm test` executado com exit code 0.
- `npm run lint` executado com exit code 0.

#### Pendências

- Nenhuma para a sprint.

## Testes executados

- `npm install` — exit code 0.
- `npm test` — exit code 0; 2 suítes, 7 testes passando.
- `npm run lint` — exit code 0.
- `npm run typecheck` — exit code 0.
- `npx expo start --clear` — Metro iniciou em `http://localhost:8081`; servidor parado manualmente com exit code 0.
- `npx expo export --platform ios --output-dir /tmp/finance-app-export-check` — bundle iOS gerado com exit code 0.

## Decisões técnicas

- Usar Expo Router agora, pois a sprint já prevê `app/index.tsx` e o plano deixa Expo Router como opção válida.
- Manter app local-first sem backend, cliente HTTP, sync automático ou dependência remota de dados.
- Usar alias `@/` apontando para `src/*`.
- Usar Jest + `jest-expo` + `@testing-library/react-native` para testes unitários e de componentes.

## Problemas / riscos encontrados

- `npm audit` reportou 36 vulnerabilidades moderadas em dependências transitivas após `npm install`; não foi usado `npm audit fix --force` para evitar breaking changes fora do escopo da sprint.
- `npx expo start --clear` valida o Metro local; teste em dispositivo/simulador não foi executado neste ambiente.

## Próximo passo

- Iniciar Sprint 01: banco local SQLite e migrations.
