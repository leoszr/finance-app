# Sprint 00 — Fundação do projeto

## Objetivo

Criar a base técnica do app Expo com TypeScript, estrutura de pastas, testes e qualidade mínima.

## Entrega da sprint

- Branch: `feature/sprint-00-project-foundation`
- Commit final sugerido: `chore(project): setup expo local-first finance app`
- Fase do plano: `Fase 1 — Fundação técnica`
- Resultado deve ser pequeno, revisável e testável.

## Regras da sprint

- [x] Criar uma feature branch para a sprint.
- [x] Manter as alterações coesas ao objetivo da sprint.
- [x] Atualizar ou criar testes junto com a implementação.
- [x] Executar `npm test` e `npm run lint` antes do commit final.
- [x] Não adicionar backend, Supabase, PostgreSQL, Java backend, API externa, IA ou sync automático.
- [x] Atualizar `docs/sprint-00/PROGRESS.md` com evidências reais.

## Tasks

### T0001 — Criar projeto Expo com TypeScript

- Status: done
- Feature: Projeto Expo com TypeScript
- Plano: `PLAN.md` > `Fase 1 — Fundação técnica`
- Dependências: nenhuma

#### Requisitos funcionais

- [x] Iniciar o app mobile.
- [x] Projeto Expo criado.
- [x] TypeScript ativo.
- [x] App abre uma tela inicial.
- [x] `npm install` funciona sem erro.
- [x] `npx expo start` inicia o projeto.

#### Requisitos técnicos

- [x] Usar Expo com TypeScript em modo estrito sempre que viável.
- [x] Manter estrutura modular, com responsabilidade clara por pasta.
- [x] Não adicionar backend, cliente HTTP ou dependência remota de dados.

#### Arquivos prováveis

- `package.json`
- `app.json`
- `app/index.tsx`
- `tsconfig.json`

#### Passos sugeridos

1. Ler os arquivos prováveis e confirmar a estrutura existente.
2. Implementar somente o necessário para a feature desta task.
3. Adicionar ou atualizar testes específicos da task.
4. Rodar testes e lint.
5. Registrar evidências em `docs/sprint-00/PROGRESS.md`.

#### Critérios de aceite

- [x] Projeto Expo criado.
- [x] TypeScript ativo.
- [x] App abre uma tela inicial.
- [x] `npm install` funciona sem erro.
- [x] `npx expo start` inicia o projeto.

#### Testes e verificação

- [x] Executar `npm install` sem erro.
- [x] Executar `npx expo start --clear` e confirmar bundle inicial.
- [x] Adicionar teste cobrindo `Criar projeto Expo com TypeScript` em arquivo de teste da sprint.
- [x] Cobrir pelo menos: Projeto Expo criado.
- [x] Executar `npm test` com a suíte atualizada.
- [x] Executar `npm run lint` sem erros novos.

### T0002 — Configurar estrutura de pastas

- Status: done
- Feature: Estrutura de pastas
- Plano: `PLAN.md` > `Fase 1 — Fundação técnica`
- Dependências: T0001

#### Requisitos funcionais

- [x] Criar organização previsível para o projeto.
- [x] Pastas `app/`, `src/components/`, `src/db/`, `src/features/`, `src/hooks/`, `src/lib/`,
  `src/tests/` e `src/types/` criadas.
- [x] Se alias `@/` for adotado, TypeScript, Jest e bundler resolvem imports corretamente.
- [x] Nenhum arquivo solto desnecessário na raiz.

#### Requisitos técnicos

- [x] Usar Expo com TypeScript em modo estrito sempre que viável.
- [x] Manter estrutura modular, com responsabilidade clara por pasta.
- [x] Não adicionar backend, cliente HTTP ou dependência remota de dados.

#### Arquivos prováveis

- `app/`
- `src/components/`
- `src/db/`
- `src/features/`
- `src/hooks/`
- `src/lib/`
- `src/tests/`
- `src/types/`

#### Passos sugeridos

1. Ler os arquivos prováveis e confirmar a estrutura existente.
2. Implementar somente o necessário para a feature desta task.
3. Adicionar ou atualizar testes específicos da task.
4. Rodar testes e lint.
5. Registrar evidências em `docs/sprint-00/PROGRESS.md`.

#### Critérios de aceite

- [x] Pastas `app/`, `src/components/`, `src/db/`, `src/features/`, `src/hooks/`, `src/lib/`,
  `src/tests/` e `src/types/` criadas.
- [x] Se alias `@/` for adotado, TypeScript, Jest e bundler resolvem imports corretamente.
- [x] Nenhum arquivo solto desnecessário na raiz.

#### Testes e verificação

- [x] Criar import absoluto de exemplo se alias for habilitado.
- [x] Executar TypeScript sem erro de paths.
- [x] Adicionar teste cobrindo `Configurar estrutura de pastas` em arquivo de teste da sprint.
- [x] Cobrir pelo menos: Pastas `app/`, `src/components/`, `src/db/`, `src/features/`, `src/hooks/`,
  `src/lib/`, `src/tests/` e `src/types/` criadas.
- [x] Executar `npm test` com a suíte atualizada.
- [x] Executar `npm run lint` sem erros novos.

### T0003 — Configurar lint e formatação

- Status: done
- Feature: Lint e formatação
- Plano: `PLAN.md` > `Fase 1 — Fundação técnica`
- Dependências: T0001

#### Requisitos funcionais

- [x] Padronizar qualidade do código.
- [x] Script `npm run lint` criado.
- [x] Lint roda sem erro.
- [x] Configuração compatível com React Native e TypeScript.

#### Requisitos técnicos

- [x] Usar Expo com TypeScript em modo estrito sempre que viável.
- [x] Manter estrutura modular, com responsabilidade clara por pasta.
- [x] Não adicionar backend, cliente HTTP ou dependência remota de dados.

#### Arquivos prováveis

- `package.json`
- `eslint.config.*`
- `prettier.config.*`
- `src/features/settings/`
- `src/hooks/useSettings.ts`
- `app.json`

#### Passos sugeridos

1. Ler os arquivos prováveis e confirmar a estrutura existente.
2. Implementar somente o necessário para a feature desta task.
3. Adicionar ou atualizar testes específicos da task.
4. Rodar testes e lint.
5. Registrar evidências em `docs/sprint-00/PROGRESS.md`.

#### Critérios de aceite

- [x] Script `npm run lint` criado.
- [x] Lint roda sem erro.
- [x] Configuração compatível com React Native e TypeScript.

#### Testes e verificação

- [x] Executar `npm run lint` com exit code 0.
- [x] Adicionar teste cobrindo `Configurar lint e formatação` em arquivo de teste da sprint.
- [x] Cobrir pelo menos: Script `npm run lint` criado.
- [x] Executar `npm test` com a suíte atualizada.
- [x] Executar `npm run lint` sem erros novos.

### T0004 — Configurar ambiente de testes

- Status: done
- Feature: Ambiente de testes
- Plano: `PLAN.md` > `Fase 1 — Fundação técnica`
- Dependências: T0001, T0003

#### Requisitos funcionais

- [x] Permitir testes unitários e de componentes.
- [x] Script `npm test` criado.
- [x] Teste inicial passa.
- [x] Ambiente testa funções TypeScript.
- [x] Ambiente renderiza componente React Native com texto e props.

#### Requisitos técnicos

- [x] Usar Expo com TypeScript em modo estrito sempre que viável.
- [x] Manter estrutura modular, com responsabilidade clara por pasta.
- [x] Não adicionar backend, cliente HTTP ou dependência remota de dados.

#### Arquivos prováveis

- `package.json`
- `jest.config.*`
- `src/tests/setup.ts`
- `src/tests/smoke.test.tsx`
- `src/features/settings/`
- `src/hooks/useSettings.ts`
- `app.json`

#### Passos sugeridos

1. Ler os arquivos prováveis e confirmar a estrutura existente.
2. Implementar somente o necessário para a feature desta task.
3. Adicionar ou atualizar testes específicos da task.
4. Rodar testes e lint.
5. Registrar evidências em `docs/sprint-00/PROGRESS.md`.

#### Critérios de aceite

- [x] Script `npm test` criado.
- [x] Teste inicial passa.
- [x] Ambiente testa funções TypeScript.
- [x] Ambiente renderiza componente React Native com texto e props.

#### Testes e verificação

- [x] Executar `npm test` com teste unitário e teste de componente passando.
- [x] Adicionar teste cobrindo `Configurar ambiente de testes` em arquivo de teste da sprint.
- [x] Cobrir pelo menos: Script `npm test` criado.
- [x] Executar `npm test` com a suíte atualizada.
- [x] Executar `npm run lint` sem erros novos.

### T0005 — Criar tela inicial temporária

- Status: done
- Feature: Tela inicial temporária
- Plano: `PLAN.md` > `Fase 1 — Fundação técnica`
- Dependências: T0001, T0002

#### Requisitos funcionais

- [x] Validar navegação básica.
- [x] Tela inicial mostra nome do app.
- [x] Tela indica que o app é local-first.
- [x] Layout não corta conteúdo em larguras 375px e 414px.

#### Requisitos técnicos

- [x] Usar Expo com TypeScript em modo estrito sempre que viável.
- [x] Manter estrutura modular, com responsabilidade clara por pasta.
- [x] Não adicionar backend, cliente HTTP ou dependência remota de dados.

#### Arquivos prováveis

- `app/index.tsx`
- `src/components/Screen.tsx`
- `src/tests/home.test.tsx`
- `package.json`
- `app.json`

#### Passos sugeridos

1. Ler os arquivos prováveis e confirmar a estrutura existente.
2. Implementar somente o necessário para a feature desta task.
3. Adicionar ou atualizar testes específicos da task.
4. Rodar testes e lint.
5. Registrar evidências em `docs/sprint-00/PROGRESS.md`.

#### Critérios de aceite

- [x] Tela inicial mostra nome do app.
- [x] Tela indica que o app é local-first.
- [x] Layout não corta conteúdo em largura 375px e 414px.

#### Testes e verificação

- [x] Renderizar tela inicial e buscar nome do app.
- [x] Validar texto `local-first` na tela.
- [x] Adicionar teste cobrindo `Criar tela inicial temporária` em arquivo de teste da sprint.
- [x] Cobrir pelo menos: Tela inicial mostra nome do app.
- [x] Executar `npm test` com a suíte atualizada.
- [x] Executar `npm run lint` sem erros novos.

## Testes da sprint

- [x] Teste de renderização da tela inicial.
- [x] Teste de importação de módulo utilitário TypeScript.
- [x] Lint completo.
- [x] `npm test` passa.
- [x] `npm run lint` passa.

## Checklist final

- [x] App abre sem tela branca.
- [x] `npm test` passa com os testes adicionados na sprint.
- [x] `npm run lint` passa sem erros.
- [x] Não há chamada de rede para dados financeiros.
- [x] Não há dependência proibida adicionada.
- [x] `docs/sprint-00/PROGRESS.md` descreve o que foi entregue.
