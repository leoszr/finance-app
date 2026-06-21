# Sprint 04 — Navegação principal e layout base

## Objetivo

Criar a estrutura visual principal do app.

## Entrega da sprint

- Branch: `feature/sprint-04-navigation-layout`
- Commit final sugerido: `feat(ui): add main navigation and app shell`
- Fase do plano: `Fase 5 — Navegação e layout base`
- Resultado deve ser pequeno, revisável e testável.

## Regras da sprint

- [x] Criar uma feature branch para a sprint.
- [x] Manter as alterações coesas ao objetivo da sprint.
- [x] Atualizar ou criar testes junto com a implementação.
- [x] Executar `npm test` e `npm run lint` antes do commit final.
- [x] Não adicionar backend, Supabase, PostgreSQL, Java backend, API externa, IA ou sync automático.
- [x] Atualizar `docs/sprint-04/PROGRESS.md` com evidências reais.

## Tasks

### T0401 — Configurar navegação por abas

- Status: done
- Feature: Navegação por abas
- Plano: `PLAN.md` > `Fase 5 — Navegação e layout base`
- Dependências: T0304

#### Requisitos funcionais

- [x] Criar navegação principal.
- [x] Usuário alterna entre Dashboard, Transações, Categorias, Contas, Relatórios e Configurações.
- [x] Abas têm nomes claros.
- [x] Navegação alterna abas em viewport iOS 375px e Android 412px sem erro.

#### Requisitos técnicos

- [x] Respeitar safe area e teclado mobile.
- [x] Criar componentes reutilizáveis e testáveis.
- [x] Manter navegação local e sem login obrigatório.

#### Arquivos prováveis

- `app/(tabs)/_layout.tsx`
- `app/(tabs)/dashboard.tsx`
- `app/(tabs)/transactions.tsx`
- `src/features/settings/`
- `src/hooks/useSettings.ts`
- `app/(tabs)/`
- `src/components/Screen.tsx`

#### Passos sugeridos

1. Ler os arquivos prováveis e confirmar a estrutura existente.
2. Implementar somente o necessário para a feature desta task.
3. Adicionar ou atualizar testes específicos da task.
4. Rodar testes e lint.
5. Registrar evidências em `docs/sprint-04/PROGRESS.md`.

#### Critérios de aceite

- [x] Usuário alterna entre Dashboard, Transações, Categorias, Contas, Relatórios e Configurações.
- [x] Abas têm nomes claros.
- [x] Navegação não corta conteúdo em largura 375px e 414px.

#### Testes e verificação

- [x] Renderizar navegação e validar seis abas principais.
- [x] Adicionar teste cobrindo `Configurar navegação por abas` em arquivo de teste da sprint.
- [x] Cobrir pelo menos: Usuário alterna entre Dashboard, Transações, Categorias, Contas, Relatórios
  e Configurações.
- [x] Executar `npm test` com a suíte atualizada.
- [x] Executar `npm run lint` sem erros novos.

### T0402 — Criar componente de tela padrão

- Status: done
- Feature: Componente de tela padrão
- Plano: `PLAN.md` > `Fase 5 — Navegação e layout base`
- Dependências: T0401

#### Requisitos funcionais

- [x] Padronizar espaçamento e layout.
- [x] Componente `Screen` criado.
- [x] Respeita safe area.
- [x] Aplica padding consistente.
- [x] Usado em pelo menos duas telas.

#### Requisitos técnicos

- [x] Respeitar safe area e teclado mobile.
- [x] Criar componentes reutilizáveis e testáveis.
- [x] Manter navegação local e sem login obrigatório.

#### Arquivos prováveis

- `src/components/Screen.tsx`
- `src/tests/components/Screen.test.tsx`
- `src/components/`
- `src/theme/`
- `app/(tabs)/`

#### Passos sugeridos

1. Ler os arquivos prováveis e confirmar a estrutura existente.
2. Implementar somente o necessário para a feature desta task.
3. Adicionar ou atualizar testes específicos da task.
4. Rodar testes e lint.
5. Registrar evidências em `docs/sprint-04/PROGRESS.md`.

#### Critérios de aceite

- [x] Componente `Screen` criado.
- [x] Respeita safe area.
- [x] Aplica padding consistente.
- [x] Usado em pelo menos duas telas.

#### Testes e verificação

- [x] Testar safe area/padding por snapshot ou props.
- [x] Usar `Screen` em duas telas.
- [x] Adicionar teste cobrindo `Criar componente de tela padrão` em arquivo de teste da sprint.
- [x] Cobrir pelo menos: Componente `Screen` criado.
- [x] Executar `npm test` com a suíte atualizada.
- [x] Executar `npm run lint` sem erros novos.

### T0403 — Criar componentes base

- Status: done
- Feature: Componentes base
- Plano: `PLAN.md` > `Fase 5 — Navegação e layout base`
- Dependências: T0402

#### Requisitos funcionais

- [x] Criar UI reutilizável.
- [x] Componentes `Button`, `TextInput`, `MoneyInput`, `Card`, `EmptyState` criados.
- [x] Componentes aceitam props básicas.
- [x] Componentes documentam estados default, pressed/active, disabled e loading quando aplicável.
- [x] Componentes são testáveis.

#### Requisitos técnicos

- [x] Respeitar safe area e teclado mobile.
- [x] Criar componentes reutilizáveis e testáveis.
- [x] Manter navegação local e sem login obrigatório.

#### Arquivos prováveis

- `src/components/ui/Button.tsx`
- `src/components/ui/TextInput.tsx`
- `src/components/ui/MoneyInput.tsx`
- `src/components/ui/Card.tsx`
- `src/components/ui/EmptyState.tsx`
- `app/(tabs)/`
- `src/components/Screen.tsx`

#### Passos sugeridos

1. Ler os arquivos prováveis e confirmar a estrutura existente.
2. Implementar somente o necessário para a feature desta task.
3. Adicionar ou atualizar testes específicos da task.
4. Rodar testes e lint.
5. Registrar evidências em `docs/sprint-04/PROGRESS.md`.

#### Critérios de aceite

- [x] Componentes `Button`, `TextInput`, `MoneyInput`, `Card`, `EmptyState` criados.
- [x] Componentes aceitam props básicas.
- [x] Componentes têm estado default, pressed/active e disabled documentados.
- [x] Componentes são testáveis.

#### Testes e verificação

- [x] Renderizar cada componente.
- [x] Testar estado disabled/loading/empty quando aplicável.
- [x] Adicionar teste cobrindo `Criar componentes base` em arquivo de teste da sprint.
- [x] Cobrir pelo menos: Componentes `Button`, `TextInput`, `MoneyInput`, `Card`, `EmptyState`
  criados.
- [x] Executar `npm test` com a suíte atualizada.
- [x] Executar `npm run lint` sem erros novos.

### T0404 — Criar estados de carregamento e erro

- Status: done
- Feature: Estados de carregamento e erro
- Plano: `PLAN.md` > `Fase 5 — Navegação e layout base`
- Dependências: T0403

#### Requisitos funcionais

- [x] Evitar telas quebradas.
- [x] Loading aparece durante inicialização.
- [x] Erro de banco mostra mensagem não técnica e acionável.
- [x] Tela vazia usa `EmptyState`.

#### Requisitos técnicos

- [x] Respeitar safe area e teclado mobile.
- [x] Criar componentes reutilizáveis e testáveis.
- [x] Manter navegação local e sem login obrigatório.

#### Arquivos prováveis

- `src/components/feedback/LoadingState.tsx`
- `src/components/feedback/ErrorState.tsx`
- `app/_layout.tsx`
- `app/(tabs)/`
- `src/components/Screen.tsx`

#### Passos sugeridos

1. Ler os arquivos prováveis e confirmar a estrutura existente.
2. Implementar somente o necessário para a feature desta task.
3. Adicionar ou atualizar testes específicos da task.
4. Rodar testes e lint.
5. Registrar evidências em `docs/sprint-04/PROGRESS.md`.

#### Critérios de aceite

- [x] Loading aparece durante inicialização.
- [x] Erro de banco mostra mensagem não técnica e acionável.
- [x] Tela vazia usa `EmptyState`.

#### Testes e verificação

- [x] Simular loading e erro de banco.
- [x] Validar EmptyState em tela sem dados.
- [x] Adicionar teste cobrindo `Criar estados de carregamento e erro` em arquivo de teste da sprint.
- [x] Cobrir pelo menos: Loading aparece durante inicialização.
- [x] Executar `npm test` com a suíte atualizada.
- [x] Executar `npm run lint` sem erros novos.

## Testes da sprint

- [x] Teste de renderização das abas.
- [x] Teste dos componentes base.
- [x] Teste de estado vazio.
- [x] Teste de navegação entre duas abas.
- [x] `npm test` passa.
- [x] `npm run lint` passa.

## Checklist final

- [x] App abre sem tela branca.
- [x] `npm test` passa com os testes adicionados na sprint.
- [x] `npm run lint` passa sem erros.
- [x] Não há chamada de rede para dados financeiros.
- [x] Não há dependência proibida adicionada.
- [x] `docs/sprint-04/PROGRESS.md` descreve o que foi entregue.
