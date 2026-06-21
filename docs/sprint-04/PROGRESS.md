# Progresso — Sprint 04 — Navegação principal e layout base

## Resumo

- Status geral: done
- Branch: `feature/sprint-04-navigation-layout`
- Commit final sugerido: `feat(ui): add main navigation and app shell`
- Sprint entregue com navegação por abas, shell visual, componentes base e estados de feedback.

## Entregue nesta sprint

- Navegação principal com seis abas: Dashboard, Transações, Categorias, Contas, Relatórios e Configurações.
- `Screen` padrão com safe area, keyboard avoiding e padding consistente.
- Componentes UI reutilizáveis: `Button`, `TextInput`, `MoneyInput`, `Card`, `EmptyState`.
- Estados `LoadingState` e `ErrorState` usados no bootstrap do banco local.
- Telas iniciais das abas com estados vazios locais, sem rede externa.

## Progresso por task

### T0401 — Configurar navegação por abas

- Status: done
- Feature: Navegação por abas

#### Desenvolvido

- Criado `app/(tabs)/_layout.tsx` com `Tabs` do Expo Router.
- Criado `app/(tabs)/routes.ts` com as seis abas principais.
- Criadas telas de Dashboard, Transações, Categorias, Contas, Relatórios e Configurações.
- `app/index.tsx` redireciona para Dashboard.

#### Evidências

- Arquivos: `app/(tabs)/*`, `app/index.tsx`, `src/tests/navigation/sprint04-navigation.test.tsx`.
- Teste valida nomes das seis abas e conteúdo de telas principais.

#### Pendências

- Nenhuma.

### T0402 — Criar componente de tela padrão

- Status: done
- Feature: Componente de tela padrão

#### Desenvolvido

- `Screen` criado/atualizado com `SafeAreaView`, `KeyboardAvoidingView`, `ScrollView` e padding padrão.
- Usado em todas as telas de abas.

#### Evidências

- Arquivos: `src/components/Screen.tsx`, `app/(tabs)/dashboard.tsx`, `app/(tabs)/transactions.tsx`.
- Teste: `src/tests/components/sprint04-components.test.tsx`.

#### Pendências

- Nenhuma.

### T0403 — Criar componentes base

- Status: done
- Feature: Componentes base

#### Desenvolvido

- Criados `Button`, `TextInput`, `MoneyInput`, `Card`, `EmptyState`.
- `Button` cobre default, pressed, disabled e loading.
- Inputs cobrem disabled/erro básico.

#### Evidências

- Arquivos: `src/components/ui/*`.
- Teste renderiza todos os componentes base e estado loading do botão.

#### Pendências

- Nenhuma.

### T0404 — Criar estados de carregamento e erro

- Status: done
- Feature: Estados de carregamento e erro

#### Desenvolvido

- Criados `LoadingState` e `ErrorState`.
- `app/_layout.tsx` mostra loading durante inicialização e erro acionável/não técnico quando banco local falha.
- Telas vazias usam `EmptyState`.

#### Evidências

- Arquivos: `src/components/feedback/LoadingState.tsx`, `src/components/feedback/ErrorState.tsx`, `app/_layout.tsx`.
- Teste cobre loading, erro acionável e empty state.

#### Pendências

- Nenhuma.

## Testes executados

- `npm test -- --runInBand` — passou: 15 suítes, 51 testes.
- `npm run lint` — passou sem warnings.
- `npm run typecheck` — passou.

## Decisões técnicas

- Mantida navegação local via Expo Router Tabs, sem login e sem chamadas externas.
- Estados de feedback extraídos para componentes testáveis.
- `Screen` mantém layout responsivo por largura máxima e padding fixo para 375px/412px.

## Problemas / riscos encontrados

- `@testing-library/react-native` emite aviso de `overlapping act()` em teste de navegação mesmo com suíte passando. Não bloqueia entrega, mas vale revisar setup de testes em sprint futura.

## Próximo passo

- Iniciar Sprint 05.
