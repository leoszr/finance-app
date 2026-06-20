# Sprint 04 — Navegação principal e layout base

## Objetivo

Criar a estrutura visual principal do app.

## Entrega da sprint

- Branch: `feature/sprint-04-navigation-layout`
- Commit final sugerido: `feat(ui): add main navigation and app shell`
- Fase do plano: `Fase 5 — Navegação e layout base`
- Resultado deve ser pequeno, revisável e testável.

## Regras da sprint

- [ ] Criar uma feature branch para a sprint.
- [ ] Manter as alterações coesas ao objetivo da sprint.
- [ ] Atualizar ou criar testes junto com a implementação.
- [ ] Executar `npm test` e `npm run lint` antes do commit final.
- [ ] Não adicionar backend, Supabase, PostgreSQL, Java backend, API externa, IA ou sync automático.
- [ ] Atualizar `docs/sprint-04/PROGRESS.md` com evidências reais.

## Tasks

### T0401 — Configurar navegação por abas

- Status: todo
- Feature: Navegação por abas
- Plano: `PLAN.md` > `Fase 5 — Navegação e layout base`
- Dependências: T0304

#### Requisitos funcionais

- [ ] Criar navegação principal.
- [ ] Usuário alterna entre Dashboard, Transações, Categorias, Contas, Relatórios e Configurações.
- [ ] Abas têm nomes claros.
- [ ] Navegação alterna abas em viewport iOS 375px e Android 412px sem erro.

#### Requisitos técnicos

- [ ] Respeitar safe area e teclado mobile.
- [ ] Criar componentes reutilizáveis e testáveis.
- [ ] Manter navegação local e sem login obrigatório.

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

- [ ] Usuário alterna entre Dashboard, Transações, Categorias, Contas, Relatórios e Configurações.
- [ ] Abas têm nomes claros.
- [ ] Navegação não corta conteúdo em largura 375px e 414px.

#### Testes e verificação

- [ ] Renderizar navegação e validar seis abas principais.
- [ ] Adicionar teste cobrindo `Configurar navegação por abas` em arquivo de teste da sprint.
- [ ] Cobrir pelo menos: Usuário alterna entre Dashboard, Transações, Categorias, Contas, Relatórios
  e Configurações.
- [ ] Executar `npm test` com a suíte atualizada.
- [ ] Executar `npm run lint` sem erros novos.

### T0402 — Criar componente de tela padrão

- Status: todo
- Feature: Componente de tela padrão
- Plano: `PLAN.md` > `Fase 5 — Navegação e layout base`
- Dependências: T0401

#### Requisitos funcionais

- [ ] Padronizar espaçamento e layout.
- [ ] Componente `Screen` criado.
- [ ] Respeita safe area.
- [ ] Aplica padding consistente.
- [ ] Usado em pelo menos duas telas.

#### Requisitos técnicos

- [ ] Respeitar safe area e teclado mobile.
- [ ] Criar componentes reutilizáveis e testáveis.
- [ ] Manter navegação local e sem login obrigatório.

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

- [ ] Componente `Screen` criado.
- [ ] Respeita safe area.
- [ ] Aplica padding consistente.
- [ ] Usado em pelo menos duas telas.

#### Testes e verificação

- [ ] Testar safe area/padding por snapshot ou props.
- [ ] Usar `Screen` em duas telas.
- [ ] Adicionar teste cobrindo `Criar componente de tela padrão` em arquivo de teste da sprint.
- [ ] Cobrir pelo menos: Componente `Screen` criado.
- [ ] Executar `npm test` com a suíte atualizada.
- [ ] Executar `npm run lint` sem erros novos.

### T0403 — Criar componentes base

- Status: todo
- Feature: Componentes base
- Plano: `PLAN.md` > `Fase 5 — Navegação e layout base`
- Dependências: T0402

#### Requisitos funcionais

- [ ] Criar UI reutilizável.
- [ ] Componentes `Button`, `TextInput`, `MoneyInput`, `Card`, `EmptyState` criados.
- [ ] Componentes aceitam props básicas.
- [ ] Componentes documentam estados default, pressed/active, disabled e loading quando aplicável.
- [ ] Componentes são testáveis.

#### Requisitos técnicos

- [ ] Respeitar safe area e teclado mobile.
- [ ] Criar componentes reutilizáveis e testáveis.
- [ ] Manter navegação local e sem login obrigatório.

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

- [ ] Componentes `Button`, `TextInput`, `MoneyInput`, `Card`, `EmptyState` criados.
- [ ] Componentes aceitam props básicas.
- [ ] Componentes têm estado default, pressed/active e disabled documentados.
- [ ] Componentes são testáveis.

#### Testes e verificação

- [ ] Renderizar cada componente.
- [ ] Testar estado disabled/loading/empty quando aplicável.
- [ ] Adicionar teste cobrindo `Criar componentes base` em arquivo de teste da sprint.
- [ ] Cobrir pelo menos: Componentes `Button`, `TextInput`, `MoneyInput`, `Card`, `EmptyState`
  criados.
- [ ] Executar `npm test` com a suíte atualizada.
- [ ] Executar `npm run lint` sem erros novos.

### T0404 — Criar estados de carregamento e erro

- Status: todo
- Feature: Estados de carregamento e erro
- Plano: `PLAN.md` > `Fase 5 — Navegação e layout base`
- Dependências: T0403

#### Requisitos funcionais

- [ ] Evitar telas quebradas.
- [ ] Loading aparece durante inicialização.
- [ ] Erro de banco mostra mensagem não técnica e acionável.
- [ ] Tela vazia usa `EmptyState`.

#### Requisitos técnicos

- [ ] Respeitar safe area e teclado mobile.
- [ ] Criar componentes reutilizáveis e testáveis.
- [ ] Manter navegação local e sem login obrigatório.

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

- [ ] Loading aparece durante inicialização.
- [ ] Erro de banco mostra mensagem não técnica e acionável.
- [ ] Tela vazia usa `EmptyState`.

#### Testes e verificação

- [ ] Simular loading e erro de banco.
- [ ] Validar EmptyState em tela sem dados.
- [ ] Adicionar teste cobrindo `Criar estados de carregamento e erro` em arquivo de teste da sprint.
- [ ] Cobrir pelo menos: Loading aparece durante inicialização.
- [ ] Executar `npm test` com a suíte atualizada.
- [ ] Executar `npm run lint` sem erros novos.

## Testes da sprint

- [ ] Teste de renderização das abas.
- [ ] Teste dos componentes base.
- [ ] Teste de estado vazio.
- [ ] Teste de navegação entre duas abas.
- [ ] `npm test` passa.
- [ ] `npm run lint` passa.

## Checklist final

- [ ] App abre sem tela branca.
- [ ] `npm test` passa com os testes adicionados na sprint.
- [ ] `npm run lint` passa sem erros.
- [ ] Não há chamada de rede para dados financeiros.
- [ ] Não há dependência proibida adicionada.
- [ ] `docs/sprint-04/PROGRESS.md` descreve o que foi entregue.
