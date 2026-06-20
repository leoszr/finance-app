# Sprint 00 — Fundação do projeto

## Objetivo

Criar a base técnica do app Expo com TypeScript, estrutura de pastas, testes e qualidade mínima.

## Entrega da sprint

- Branch: `feature/sprint-00-project-foundation`
- Commit final sugerido: `chore(project): setup expo local-first finance app`
- Fase do plano: `Fase 1 — Fundação técnica`
- Resultado deve ser pequeno, revisável e testável.

## Regras da sprint

- [ ] Criar uma feature branch para a sprint.
- [ ] Manter as alterações coesas ao objetivo da sprint.
- [ ] Atualizar ou criar testes junto com a implementação.
- [ ] Executar `npm test` e `npm run lint` antes do commit final.
- [ ] Não adicionar backend, Supabase, PostgreSQL, Java backend, API externa, IA ou sync automático.
- [ ] Atualizar `docs/sprint-00/PROGRESS.md` com evidências reais.

## Tasks

### T0001 — Criar projeto Expo com TypeScript

- Status: todo
- Feature: Projeto Expo com TypeScript
- Plano: `PLAN.md` > `Fase 1 — Fundação técnica`
- Dependências: nenhuma

#### Requisitos funcionais

- [ ] Iniciar o app mobile.
- [ ] Projeto Expo criado.
- [ ] TypeScript ativo.
- [ ] App abre uma tela inicial.
- [ ] `npm install` funciona sem erro.
- [ ] `npx expo start` inicia o projeto.

#### Requisitos técnicos

- [ ] Usar Expo com TypeScript em modo estrito sempre que viável.
- [ ] Manter estrutura modular, com responsabilidade clara por pasta.
- [ ] Não adicionar backend, cliente HTTP ou dependência remota de dados.

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

- [ ] Projeto Expo criado.
- [ ] TypeScript ativo.
- [ ] App abre uma tela inicial.
- [ ] `npm install` funciona sem erro.
- [ ] `npx expo start` inicia o projeto.

#### Testes e verificação

- [ ] Executar `npm install` sem erro.
- [ ] Executar `npx expo start --clear` e confirmar bundle inicial.
- [ ] Adicionar teste cobrindo `Criar projeto Expo com TypeScript` em arquivo de teste da sprint.
- [ ] Cobrir pelo menos: Projeto Expo criado.
- [ ] Executar `npm test` com a suíte atualizada.
- [ ] Executar `npm run lint` sem erros novos.

### T0002 — Configurar estrutura de pastas

- Status: todo
- Feature: Estrutura de pastas
- Plano: `PLAN.md` > `Fase 1 — Fundação técnica`
- Dependências: T0001

#### Requisitos funcionais

- [ ] Criar organização previsível para o projeto.
- [ ] Pastas `app/`, `src/components/`, `src/db/`, `src/features/`, `src/hooks/`, `src/lib/`,
  `src/tests/` e `src/types/` criadas.
- [ ] Se alias `@/` for adotado, TypeScript, Jest e bundler resolvem imports corretamente.
- [ ] Nenhum arquivo solto desnecessário na raiz.

#### Requisitos técnicos

- [ ] Usar Expo com TypeScript em modo estrito sempre que viável.
- [ ] Manter estrutura modular, com responsabilidade clara por pasta.
- [ ] Não adicionar backend, cliente HTTP ou dependência remota de dados.

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

- [ ] Pastas `app/`, `src/components/`, `src/db/`, `src/features/`, `src/hooks/`, `src/lib/`,
  `src/tests/` e `src/types/` criadas.
- [ ] Se alias `@/` for adotado, TypeScript, Jest e bundler resolvem imports corretamente.
- [ ] Nenhum arquivo solto desnecessário na raiz.

#### Testes e verificação

- [ ] Criar import absoluto de exemplo se alias for habilitado.
- [ ] Executar TypeScript sem erro de paths.
- [ ] Adicionar teste cobrindo `Configurar estrutura de pastas` em arquivo de teste da sprint.
- [ ] Cobrir pelo menos: Pastas `app/`, `src/components/`, `src/db/`, `src/features/`, `src/hooks/`,
  `src/lib/`, `src/tests/` e `src/types/` criadas.
- [ ] Executar `npm test` com a suíte atualizada.
- [ ] Executar `npm run lint` sem erros novos.

### T0003 — Configurar lint e formatação

- Status: todo
- Feature: Lint e formatação
- Plano: `PLAN.md` > `Fase 1 — Fundação técnica`
- Dependências: T0001

#### Requisitos funcionais

- [ ] Padronizar qualidade do código.
- [ ] Script `npm run lint` criado.
- [ ] Lint roda sem erro.
- [ ] Configuração compatível com React Native e TypeScript.

#### Requisitos técnicos

- [ ] Usar Expo com TypeScript em modo estrito sempre que viável.
- [ ] Manter estrutura modular, com responsabilidade clara por pasta.
- [ ] Não adicionar backend, cliente HTTP ou dependência remota de dados.

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

- [ ] Script `npm run lint` criado.
- [ ] Lint roda sem erro.
- [ ] Configuração compatível com React Native e TypeScript.

#### Testes e verificação

- [ ] Executar `npm run lint` com exit code 0.
- [ ] Adicionar teste cobrindo `Configurar lint e formatação` em arquivo de teste da sprint.
- [ ] Cobrir pelo menos: Script `npm run lint` criado.
- [ ] Executar `npm test` com a suíte atualizada.
- [ ] Executar `npm run lint` sem erros novos.

### T0004 — Configurar ambiente de testes

- Status: todo
- Feature: Ambiente de testes
- Plano: `PLAN.md` > `Fase 1 — Fundação técnica`
- Dependências: T0001, T0003

#### Requisitos funcionais

- [ ] Permitir testes unitários e de componentes.
- [ ] Script `npm test` criado.
- [ ] Teste inicial passa.
- [ ] Ambiente testa funções TypeScript.
- [ ] Ambiente renderiza componente React Native com texto e props.

#### Requisitos técnicos

- [ ] Usar Expo com TypeScript em modo estrito sempre que viável.
- [ ] Manter estrutura modular, com responsabilidade clara por pasta.
- [ ] Não adicionar backend, cliente HTTP ou dependência remota de dados.

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

- [ ] Script `npm test` criado.
- [ ] Teste inicial passa.
- [ ] Ambiente testa funções TypeScript.
- [ ] Ambiente renderiza componente React Native com texto e props.

#### Testes e verificação

- [ ] Executar `npm test` com teste unitário e teste de componente passando.
- [ ] Adicionar teste cobrindo `Configurar ambiente de testes` em arquivo de teste da sprint.
- [ ] Cobrir pelo menos: Script `npm test` criado.
- [ ] Executar `npm test` com a suíte atualizada.
- [ ] Executar `npm run lint` sem erros novos.

### T0005 — Criar tela inicial temporária

- Status: todo
- Feature: Tela inicial temporária
- Plano: `PLAN.md` > `Fase 1 — Fundação técnica`
- Dependências: T0001, T0002

#### Requisitos funcionais

- [ ] Validar navegação básica.
- [ ] Tela inicial mostra nome do app.
- [ ] Tela indica que o app é local-first.
- [ ] Layout não corta conteúdo em larguras 375px e 414px.

#### Requisitos técnicos

- [ ] Usar Expo com TypeScript em modo estrito sempre que viável.
- [ ] Manter estrutura modular, com responsabilidade clara por pasta.
- [ ] Não adicionar backend, cliente HTTP ou dependência remota de dados.

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

- [ ] Tela inicial mostra nome do app.
- [ ] Tela indica que o app é local-first.
- [ ] Layout não corta conteúdo em largura 375px e 414px.

#### Testes e verificação

- [ ] Renderizar tela inicial e buscar nome do app.
- [ ] Validar texto `local-first` na tela.
- [ ] Adicionar teste cobrindo `Criar tela inicial temporária` em arquivo de teste da sprint.
- [ ] Cobrir pelo menos: Tela inicial mostra nome do app.
- [ ] Executar `npm test` com a suíte atualizada.
- [ ] Executar `npm run lint` sem erros novos.

## Testes da sprint

- [ ] Teste de renderização da tela inicial.
- [ ] Teste de importação de módulo utilitário TypeScript.
- [ ] Lint completo.
- [ ] `npm test` passa.
- [ ] `npm run lint` passa.

## Checklist final

- [ ] App abre sem tela branca.
- [ ] `npm test` passa com os testes adicionados na sprint.
- [ ] `npm run lint` passa sem erros.
- [ ] Não há chamada de rede para dados financeiros.
- [ ] Não há dependência proibida adicionada.
- [ ] `docs/sprint-00/PROGRESS.md` descreve o que foi entregue.
