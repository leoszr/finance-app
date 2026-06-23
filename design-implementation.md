# Design Implementation

## Objetivo do documento

Mapear a implementação visual atual do app: componentes, paths, relações entre eles e composição de cada view. Este arquivo serve como inventário para planejar uma melhoria de design sem perder o que já existe.

## Linguagem visual atual

- Produto mobile-first, local-first, iPhone primeiro e Android compatível.
- Canvas principal escuro: `#0b1220`.
- Conteúdo financeiro em cards claros: `#f8fafc` com borda `#dbe4f0`.
- Ação primária em teal: `#0f766e`.
- Texto financeiro crítico com alto contraste: ink `#0f172a`, body `#475569`.
- Feedback positivo em teal claro, erros em vermelho, avisos em âmbar.
- Componentes usam system font do React Native, peso alto para hierarquia.

## Arquitetura visual

```txt
app/_layout.tsx
  └─ AppLockGate
      └─ Stack
          └─ app/(tabs)/_layout.tsx
              └─ Tabs
                  ├─ Dashboard
                  ├─ Transações
                  ├─ Categorias
                  ├─ Contas
                  ├─ Relatórios
                  └─ Configurações
```

Todas as telas principais usam o mesmo padrão:

```txt
Screen
  ├─ Header da rota
  └─ Feature manager
      ├─ Card/Form
      ├─ filtros ou ações
      ├─ EmptyState quando vazio
      └─ Cards/listas/resumos
```

## Componentes base de layout

### `src/components/Screen.tsx`

Wrapper principal das telas.

Corresponde a:
- safe area da tela.
- fundo escuro do app.
- scroll vertical.
- proteção de teclado via `KeyboardAvoidingView`.
- largura máxima de conteúdo (`maxWidth: 720`).
- padding mobile seguro.

Relação:
- Usado diretamente pelas rotas em `app/(tabs)/*.tsx`.
- Usado por `AppLockScreen` para tela bloqueada centralizada.
- `BackupScreen` também usa `Screen` internamente porque é exportada direto como rota.

### `src/components/ui/Card.tsx`

Superfície clara para conteúdo financeiro e controles.

Corresponde a:
- container legível sobre o canvas escuro.
- separação visual entre blocos de tarefa.
- borda hairline, raio 24, shadow leve.

Relação:
- Base de quase todas as views de feature.
- Envolve formulários, filtros, resumos, listas e tela de lock.
- Deve evitar nesting excessivo. Hoje há casos como `Card > EmptyState` em dashboard/relatórios.

## Componentes de UI interativos

### `src/components/ui/Button.tsx`

Botão padrão do app.

Corresponde a:
- ação primária ou opção selecionável.
- estado loading com `ActivityIndicator`.
- estado disabled usado também como seleção ativa em grupos de opções.
- alvo mínimo 48px.

Relação:
- Usado em forms, filtros, navegação de mês, edição/exclusão, backup via Settings, biometria e PDF.
- O app ainda não tem variantes explícitas (`primary`, `secondary`, `danger`). A distinção destrutiva aparece no `Alert`, não no botão.

### `src/components/ui/TextInput.tsx`

Input textual padrão.

Corresponde a:
- label visível.
- input branco com borda cinza.
- label acessível automática.
- erro por borda vermelha e texto abaixo.

Relação:
- Base de campos em contas, categorias e transações.
- Recebe `error` dos managers de feature.

### `src/components/ui/MoneyInput.tsx`

Input monetário especializado.

Corresponde a:
- wrapper sobre `TextInput`.
- teclado numérico (`decimal-pad`).
- placeholder `R$ 0,00`.
- formatação BRL ao digitar/paste.

Relação:
- Usado em `AccountsManager` para saldo inicial.
- Usado em `TransactionsManager` para valor da transação.
- Depende visualmente de `TextInput`, mas tem regra própria de parsing/format.

### `src/components/ui/EmptyState.tsx`

Estado vazio educativo.

Corresponde a:
- ícone simples `◌`.
- título.
- mensagem de próximo passo.
- ação opcional.
- fundo azul claro.

Relação:
- Usado em contas, categorias, transações, dashboard e relatórios.
- Serve para ensinar o próximo lançamento, não só dizer que não há dados.

### `src/components/ui/index.ts`

Barrel export dos componentes UI.

Corresponde a:
- ponto de importação curto para `Button`, `Card`, `EmptyState`, `MoneyInput`, `TextInput`.

## Componentes de feedback global

### `src/components/feedback/LoadingState.tsx`

Tela global de carregamento.

Corresponde a:
- loading centralizado em canvas escuro.
- spinner teal.
- mensagem curta.

Relação:
- Usado por `app/_layout.tsx` ao inicializar o banco.
- Usado por `AppLockGate` ao verificar bloqueio local.

### `src/components/feedback/ErrorState.tsx`

Tela global de erro.

Corresponde a:
- erro full-screen em canvas escuro.
- título em vermelho claro.
- mensagem orientativa.
- botão opcional de retry.

Relação:
- Usado em `app/_layout.tsx` quando o banco local falha.

## Componentes financeiros e gráficos

### `src/components/finance/SummaryCard.tsx`

Card de métrica financeira.

Corresponde a:
- label pequeno uppercase.
- valor grande.
- tom visual por tipo: `income`, `expense`, `neutral`.

Relação:
- Usado no Dashboard para receitas, despesas, saldo mensal, saldo total.
- Usado nos Relatórios para receitas, despesas e saldo do período.
- Internamente usa `Card`.

### `src/components/charts/BarRow.tsx`

Linha de gráfico horizontal.

Corresponde a:
- label e valor lado a lado.
- trilho cinza.
- barra colorida proporcional com largura mínima visual.

Relação:
- Usado em `DashboardManager` para receita x despesa e maiores gastos por categoria.
- Não usa biblioteca externa de gráfico.

## Navegação e rotas

### `app/_layout.tsx`

Root layout.

Corresponde a:
- bootstrap visual do app.
- inicialização do SQLite.
- telas globais de loading/erro.
- proteção por bloqueio local.
- Stack sem header.

Composição:
```txt
RootLayout
  ├─ ErrorState, se DB falha
  ├─ LoadingState, se DB ainda não inicializou
  └─ AppLockGate
      └─ Stack
```

### `app/index.tsx`

Rota inicial.

Corresponde a:
- redirect direto para `/dashboard`.

### `app/(tabs)/_layout.tsx`

Layout de tabs.

Corresponde a:
- navegação principal inferior.
- ícones textuais simples.
- tabs com active teal e inactive slate.
- oculta rota `backup` da tab bar.

Relação:
- Consome `src/navigation/tabRoutes.ts`.

### `src/navigation/tabRoutes.ts`

Definição declarativa das tabs.

Corresponde a:
- ordem da navegação.
- nome técnico da rota.
- título visual.
- ícone textual.

Tabs:
- Dashboard: `⌂`
- Transações: `↕`
- Categorias: `◈`
- Contas: `◍`
- Relatórios: `▣`
- Configurações: `⚙`


## Paginação do app

Este app usa paginação por rotas/tabs do Expo Router, não paginação numérica de lista. A navegação principal é uma tab bar inferior, com uma rota auxiliar de backup escondida da tab bar e acessada por Configurações.

### Mapa de páginas

| Página | Path da rota | Visível na tab bar | Objetivo | View principal |
| --- | --- | --- | --- | --- |
| Inicial | `app/index.tsx` | Não | Redirecionar o usuário para o Dashboard ao abrir o app. | `Redirect` para `/dashboard` |
| Dashboard | `app/(tabs)/dashboard.tsx` | Sim | Mostrar o resumo financeiro do mês: receitas, despesas, saldo, gráficos e saldos por conta. | `DashboardManager` |
| Transações | `app/(tabs)/transactions.tsx` | Sim | Registrar, editar, excluir, buscar e filtrar receitas/despesas. | `TransactionsManager` |
| Categorias | `app/(tabs)/categories.tsx` | Sim | Criar e organizar categorias de receita e despesa usadas nas transações. | `CategoriesManager` |
| Contas | `app/(tabs)/accounts.tsx` | Sim | Criar e manter contas, carteiras, cartões e saldos iniciais. | `AccountsManager` |
| Relatórios | `app/(tabs)/reports.tsx` | Sim | Analisar o mês, comparar com mês anterior, listar transações e gerar PDF local. | `ReportScreen` |
| Configurações | `app/(tabs)/settings.tsx` | Sim | Ajustar preferências locais, acessar backup, criar demo e ativar bloqueio local. | `SettingsScreen` |
| Backup | `app/(tabs)/backup.tsx` | Não | Exportar e importar backup JSON local. | `BackupScreen` |
| Bloqueio local | `src/features/security/AppLockScreen.tsx` | Não | Bloquear o acesso visual aos dados até autenticação local. | `AppLockScreen` |
| Loading global | `src/components/feedback/LoadingState.tsx` | Não | Informar inicialização do banco ou verificação de bloqueio. | `LoadingState` |
| Erro global | `src/components/feedback/ErrorState.tsx` | Não | Explicar falha crítica de inicialização local. | `ErrorState` |

### Fluxo de entrada

```txt
app/index.tsx
  -> /dashboard
      -> app/(tabs)/dashboard.tsx
```

Antes de qualquer página tab renderizar, `app/_layout.tsx` executa:

```txt
inicializar SQLite
  -> se erro: ErrorState
  -> se carregando: LoadingState
  -> se ok: AppLockGate
      -> se bloqueado: AppLockScreen
      -> se liberado: TabsLayout
```

### Ordem da tab bar

A ordem vem de `src/navigation/tabRoutes.ts`:

1. Dashboard
2. Transações
3. Categorias
4. Contas
5. Relatórios
6. Configurações

### Página auxiliar: Backup

`Backup` é rota dentro de `(tabs)`, mas fica escondida com `options={{ href: null }}` em `app/(tabs)/_layout.tsx`.

Fluxo:

```txt
Configurações
  -> botão Backup
      -> /backup
```

Objetivo desse desenho:
- manter backup fora da navegação principal.
- evitar poluir a tab bar com uma tarefa pouco frequente.
- ainda permitir acesso rápido a partir de Dados locais.

### Páginas por intenção do usuário

| Intenção | Página recomendada | Por quê |
| --- | --- | --- |
| Ver situação do mês | Dashboard | Resume tudo sem exigir leitura de lista. |
| Lançar gasto ou receita | Transações | Formulário principal de movimentação. |
| Organizar nomes de gastos | Categorias | Define agrupamentos para relatórios e gráficos. |
| Organizar origem do dinheiro | Contas | Define onde saldo e transações vivem. |
| Entender o mês em detalhe | Relatórios | Comparação, resumo textual, categorias e PDF. |
| Proteger ou configurar app | Configurações | Preferências, segurança, demo e backup. |
| Salvar/restaurar dados | Backup | Export/import manual local. |

### Observação sobre paginação de listas

Hoje não há paginação incremental em listas de transações, contas ou categorias. As listas são carregadas inteiras e filtradas em memória na view. Para o escopo atual isso é aceitável. Se o volume crescer, a primeira página a receber paginação real deve ser `Transações`, usando limite por mês/filtro no repositório.

## Views por rota

### Dashboard

Path da rota:
- `app/(tabs)/dashboard.tsx`

Feature principal:
- `src/features/dashboard/DashboardManager.tsx`

Composição:
```txt
Screen
  ├─ Header
  │   ├─ kicker: Visão geral
  │   ├─ title: Dashboard
  │   └─ subtitle: Resumo financeiro local...
  └─ DashboardManager
      ├─ Card: navegação de mês
      ├─ Card + EmptyState, se não há dados
      ├─ grid de SummaryCard
      ├─ Card: Receita x despesa com BarRow
      ├─ Card: Maiores gastos por categoria com BarRow
      └─ Card: Saldo por conta
```

Componentes usados:
- `Screen`
- `Card`
- `Button`
- `EmptyState`
- `SummaryCard`
- `BarRow`

Função da view:
- Visão resumida do mês selecionado.
- Mostra entradas, saídas, saldo mensal e saldo total.
- Expõe gráficos simples sem dependência pesada.
- Reage a mudanças nos dados financeiros via `subscribeToFinanceDataChanges`.

Relações:
- Usa configurações de moeda e mês inicial.
- Usa queries agregadas em `createDashboardQueries`.
- Compartilha padrão de navegação mensal com Relatórios e Transações.

### Transações

Path da rota:
- `app/(tabs)/transactions.tsx`

Feature principal:
- `src/features/transactions/TransactionsManager.tsx`

Composição:
```txt
Screen
  ├─ Header: Transações
  └─ TransactionsManager
      ├─ Card: formulário de nova/editar transação
      │   ├─ Button group: Receita/Despesa
      │   ├─ MoneyInput: Valor
      │   ├─ TextInput: Data
      │   ├─ TextInput: Descrição
      │   ├─ Button group: Conta
      │   ├─ Button group: Categoria compatível
      │   ├─ erro/status
      │   └─ Button: Salvar transação
      ├─ título: Transações recentes
      ├─ Card: filtros
      │   ├─ mês anterior/mês seguinte
      │   ├─ filtro tipo
      │   ├─ filtro conta
      │   ├─ TextInput: Buscar descrição
      │   └─ resumo: receitas/despesas/saldo
      ├─ EmptyState, se filtro não retorna transações
      └─ Card por transação
          ├─ descrição ou tipo
          ├─ categoria, conta, data
          ├─ valor colorido
          └─ ações Editar/Excluir
```

Componentes usados:
- `Screen`
- `Card`
- `Button`
- `MoneyInput`
- `TextInput`
- `EmptyState`
- `Alert` nativo para exclusão

Função da view:
- Registro, edição, filtro, busca e exclusão de transações.
- É a view mais densa do app.

Relações:
- Depende de contas e categorias já cadastradas.
- Categoria exibida no formulário muda conforme tipo da transação.
- Alimenta Dashboard e Relatórios via eventos de alteração de dados.

### Categorias

Path da rota:
- `app/(tabs)/categories.tsx`

Feature principal:
- `src/features/categories/CategoriesManager.tsx`

Composição:
```txt
Screen
  ├─ Header: Categorias
  └─ CategoriesManager
      ├─ Card: formulário nova/editar categoria
      │   ├─ TextInput: Nome
      │   ├─ Button group: Receita/Despesa
      │   ├─ Button group: cores
      │   ├─ erro/status
      │   └─ Button: Salvar categoria
      ├─ título: Categorias de receita
      ├─ EmptyState ou CategoryItem list
      ├─ título: Categorias de despesa
      └─ EmptyState ou CategoryItem list
```

Componentes usados:
- `Screen`
- `Card`
- `Button`
- `TextInput`
- `EmptyState`
- `Alert` nativo para exclusão

Função da view:
- Cadastrar e manter categorias por tipo.
- Separar leitura entre receita e despesa.

Relações:
- Categorias são usadas por `TransactionsManager` e agregações de Dashboard/Relatórios.
- Mudança de tipo é bloqueada se houver transações, por regra de repositório.

### Contas

Path da rota:
- `app/(tabs)/accounts.tsx`

Feature principal:
- `src/features/accounts/AccountsManager.tsx`

Composição:
```txt
Screen
  ├─ Header: Contas
  └─ AccountsManager
      ├─ Card: formulário nova/editar conta
      │   ├─ TextInput: Nome da conta
      │   ├─ Button group: Tipo
      │   ├─ MoneyInput: Saldo inicial
      │   ├─ erro/status
      │   └─ Button: Salvar conta
      ├─ listHeader
      │   ├─ título: Contas cadastradas
      │   └─ Button: Adicionar conta
      ├─ EmptyState, se não há contas
      └─ Card por conta
          ├─ nome
          ├─ tipo e saldo inicial
          └─ ações Editar/Excluir
```

Componentes usados:
- `Screen`
- `Card`
- `Button`
- `MoneyInput`
- `TextInput`
- `EmptyState`
- `Alert` nativo para exclusão

Função da view:
- Criar origens de dinheiro: corrente, poupança, dinheiro, crédito, investimento, outro.

Relações:
- Contas são pré-requisito prático para lançar transações.
- Exclusão é bloqueada quando há transações ligadas.

### Relatórios

Path da rota:
- `app/(tabs)/reports.tsx`

Feature principal:
- `src/features/reports/ReportScreen.tsx`

Composição:
```txt
Screen
  ├─ Header
  │   ├─ kicker: Relatórios locais
  │   ├─ title: Relatórios
  │   └─ subtitle: Análise mensal criada só com dados do aparelho.
  └─ ReportScreen
      ├─ Card: navegação de mês
      ├─ Card: ação Gerar PDF + feedback
      ├─ Card + EmptyState, se sem dados
      ├─ grid de SummaryCard
      ├─ Card: Observações locais
      ├─ Card: Comparação com mês anterior
      ├─ Card: Gastos por categoria
      └─ Card: Transações do período
```

Componentes usados:
- `Screen`
- `Card`
- `Button`
- `EmptyState`
- `SummaryCard`

Função da view:
- Análise mensal mais detalhada que dashboard.
- Geração e compartilhamento de PDF local.

Relações:
- Usa `createReportQueries`.
- Usa `buildLocalReportSummary` para copy analítica.
- Usa `generateAndShareReportPdf` para PDF.
- Reage a eventos de mudança financeira.

### Backup

Path da rota:
- `app/(tabs)/backup.tsx`

Feature principal:
- `src/features/backup/BackupScreen.tsx`

Composição:
```txt
BackupScreen
  └─ Screen
      ├─ Header: Backup
      ├─ texto explicativo
      ├─ RNButton: Exportar e compartilhar JSON
      ├─ RNButton: Importar JSON
      └─ status
```

Componentes usados:
- `Screen`
- `Button` nativo do React Native (`RNButton`), não o `Button` do design system
- `Alert` nativo para confirmação destrutiva de importação

Função da view:
- Exportar backup local.
- Importar JSON com confirmação.

Relações:
- A rota existe, mas fica oculta na tab bar.
- É acessada por botão em Configurações.
- Visualmente é a tela menos alinhada ao design system porque usa `RNButton` e estilos inline.

### Configurações

Path da rota:
- `app/(tabs)/settings.tsx`

Feature principal:
- `src/features/settings/SettingsScreen.tsx`

Composição:
```txt
Screen
  ├─ Header: Configurações
  └─ SettingsScreen
      ├─ Card: identidade do app
      ├─ Card: Preferências
      │   ├─ moeda padrão
      │   ├─ preview monetário
      │   ├─ Button group: BRL/USD/EUR
      │   ├─ mês inicial
      │   └─ Button group: mês atual/último mês com dados
      ├─ Card: Dados locais
      │   ├─ copy local-first
      │   └─ Button: Backup
      ├─ Card: Demonstração
      │   ├─ copy demo
      │   ├─ Button: Criar demo
      │   └─ Button: Apagar demo
      ├─ Card: Segurança local
      │   ├─ status do bloqueio
      │   ├─ disponibilidade biométrica
      │   └─ Button group: ativar/desativar
      └─ status global
```

Componentes usados:
- `Screen`
- `Card`
- `Button`
- `Alert` nativo para apagar dados demo

Função da view:
- Preferências locais.
- Entrada para Backup.
- Dados de demonstração.
- Bloqueio biométrico local.

Relações:
- Atualiza settings persistidos via `settingsRepository`.
- Notifica `AppLockGate` quando segurança muda.
- Chama `seedDemoData` e `clearDemoData`.

### Bloqueio local

Paths:
- `src/features/security/AppLockGate.tsx`
- `src/features/security/AppLockScreen.tsx`

Composição:
```txt
AppLockGate
  ├─ LoadingState, enquanto verifica configuração
  ├─ AppLockScreen, se bloqueado
  └─ children, se liberado

AppLockScreen
  └─ Screen centered
      └─ Card
          ├─ title: App bloqueado
          ├─ texto explicativo
          ├─ aviso opcional
          └─ Button: Desbloquear ou Continuar sem biometria
```

Componentes usados:
- `LoadingState`
- `Screen`
- `Card`
- `Button`

Função da view:
- Proteger acesso visual aos dados financeiros quando bloqueio local está ativado.

Relações:
- Envolve toda a árvore de navegação em `app/_layout.tsx`.
- Depende de `useAppLock`, settings e API local de autenticação.

## Relações entre grupos de componentes

### Layout e navegação

```txt
RootLayout -> AppLockGate -> TabsLayout -> route Screen -> feature manager
```

- `RootLayout` garante banco pronto antes de exibir qualquer view.
- `AppLockGate` decide se mostra a aplicação ou lock screen.
- `TabsLayout` organiza a navegação inferior.
- `Screen` dá consistência visual para todas as rotas.

### Design system mínimo

```txt
Card
Button
TextInput
MoneyInput -> TextInput
EmptyState
```

- `Card` cria superfície de leitura.
- `Button` cria ações e seletores tipo pill.
- `TextInput` cobre campos básicos.
- `MoneyInput` especializa campo monetário.
- `EmptyState` cobre ausência de dados com orientação.

### Finance UI

```txt
SummaryCard -> Card
BarRow
```

- `SummaryCard` é métrica financeira reutilizada.
- `BarRow` é gráfico simples para comparação proporcional.

### Feedback

```txt
LoadingState
ErrorState
status inline nas features
Alert nativo para destrutivo
```

- Loading e erro globais são componentes dedicados.
- Sucesso e erro local ainda são textos/status inline repetidos em cada feature.
- Confirmações destrutivas usam `Alert.alert` nativo.

## Componentes por path

| Grupo | Path | Papel |
| --- | --- | --- |
| Layout | `src/components/Screen.tsx` | Canvas escuro, safe area, scroll e teclado. |
| UI | `src/components/ui/Card.tsx` | Superfície clara de conteúdo. |
| UI | `src/components/ui/Button.tsx` | Ações, seletores e loading. |
| UI | `src/components/ui/TextInput.tsx` | Campo textual com label e erro. |
| UI | `src/components/ui/MoneyInput.tsx` | Campo monetário BRL. |
| UI | `src/components/ui/EmptyState.tsx` | Estado vazio educativo. |
| UI | `src/components/ui/index.ts` | Export central dos componentes UI. |
| Feedback | `src/components/feedback/LoadingState.tsx` | Loading full-screen. |
| Feedback | `src/components/feedback/ErrorState.tsx` | Erro full-screen. |
| Finance | `src/components/finance/SummaryCard.tsx` | Card de métrica monetária. |
| Chart | `src/components/charts/BarRow.tsx` | Barra horizontal proporcional. |
| Navigation | `src/navigation/tabRoutes.ts` | Definição das tabs. |
| Route | `app/_layout.tsx` | Bootstrap, DB, lock, stack. |
| Route | `app/index.tsx` | Redirect para dashboard. |
| Route | `app/(tabs)/_layout.tsx` | Tab bar inferior. |
| Route | `app/(tabs)/dashboard.tsx` | Shell da tela Dashboard. |
| Route | `app/(tabs)/transactions.tsx` | Shell da tela Transações. |
| Route | `app/(tabs)/categories.tsx` | Shell da tela Categorias. |
| Route | `app/(tabs)/accounts.tsx` | Shell da tela Contas. |
| Route | `app/(tabs)/reports.tsx` | Shell da tela Relatórios. |
| Route | `app/(tabs)/settings.tsx` | Shell da tela Configurações. |
| Route | `app/(tabs)/backup.tsx` | Export da tela Backup. |
| Feature | `src/features/dashboard/DashboardManager.tsx` | Dashboard mensal, métricas e gráficos. |
| Feature | `src/features/transactions/TransactionsManager.tsx` | CRUD, filtros e lista de transações. |
| Feature | `src/features/categories/CategoriesManager.tsx` | CRUD e listagem de categorias. |
| Feature | `src/features/accounts/AccountsManager.tsx` | CRUD e listagem de contas. |
| Feature | `src/features/reports/ReportScreen.tsx` | Relatório mensal e PDF. |
| Feature | `src/features/backup/BackupScreen.tsx` | Export/import JSON. |
| Feature | `src/features/settings/SettingsScreen.tsx` | Preferências, backup, demo e segurança. |
| Feature | `src/features/security/AppLockGate.tsx` | Gate global de bloqueio. |
| Feature | `src/features/security/AppLockScreen.tsx` | Tela visual de desbloqueio. |

## Pontos de inconsistência para design futuro

- Headers de rota estão duplicados com estilos inline em várias telas.
- Dashboard e Relatórios usam header mais rico, outras telas usam só título.
- `BackupScreen` usa `RNButton`, não o `Button` do design system.
- `Button` representa ação primária, opção selecionada, filtro e destrutivo sem variantes.
- Status de sucesso/erro é repetido inline em managers.
- Grupos de opção usam botão disabled como selecionado, mas disabled também significa indisponível.
- Cores de categoria aparecem como texto hexadecimal, não como swatch visual.
- Cards de listas, forms e filtros usam o mesmo peso visual, criando pouca hierarquia.
- EmptyState às vezes aparece dentro de `Card`, criando nested surface.

## Plano de ação recomendado

Decisão principal: **evoluir o design system próprio do app com direção visual inspirada nos websites da Apple**, não migrar para `shadcn/ui` web nem adotar biblioteca pesada de componentes. O projeto é Expo/React Native, já tem componentes base e precisa preservar sensação nativa, local-first, calma e confiável.

Direção estética: **Apple website adaptado para app financeiro**. Fundo claro, muito espaço, tipografia forte, cards limpos, bordas sutis, sombras mínimas, azul como ação/link, conteúdo financeiro com contraste alto. Sem Liquid Glass, sem glassmorphism, sem blur decorativo, sem translucidez em dados.

### Stack visual escolhida

| Área | Escolha | Motivo |
| --- | --- | --- |
| Componentes | Design system próprio em `src/components/ui` | Menos dependência, mais controle visual, encaixe direto com Expo/React Native. |
| Ícones | `lucide-react-native` | Ícones consistentes, leves e melhores que símbolos textuais. |
| Estilo | `StyleSheet` + tokens centralizados | Mantém padrão atual, sem custo de configurar NativeWind/Tamagui. |
| Direção visual | Apple websites: editorial, claro, preciso, premium | Mais atual para produto de confiança, sem depender de efeitos frágeis. |
| Superfícies | Opacas, brancas ou cinza frio claro | Legibilidade máxima para dados financeiros. |
| shadcn | Não usar `shadcn/ui` web | Usa DOM/Radix/Tailwind web, não encaixa direto em React Native. |
| NativeWind/reusables | Não usar agora | Útil no futuro, mas neste momento adiciona migração maior que o benefício. |

### Objetivos do redesenho

1. Criar fundação visual reutilizável antes de alterar telas.
2. Reduzir inconsistências entre forms, filtros, listas e feedbacks.
3. Trocar símbolos textuais por ícones reais.
4. Separar ação, seleção, perigo e estado desabilitado.
5. Melhorar hierarquia: forms, filtros, dados financeiros e listas não devem ter o mesmo peso visual.
6. Usar estética clara, editorial e precisa, inspirada nos websites da Apple.
7. Manter legibilidade AA em dados críticos.
8. Remover a ideia de Liquid Glass/glassmorphism do plano.

### Princípios visuais Apple-like

- **Clareza primeiro**: texto grande, contraste alto, conteúdo direto.
- **Espaço como luxo**: respiro generoso em headers, seções e cards principais.
- **Superfícies opacas**: nada de blur, vidro, frost ou translucidez ornamental.
- **Tipografia nativa forte**: system font, títulos grandes, pesos 700-900, corpo 16-17px.
- **Azul como linguagem de ação**: primário, links, seleção e navegação ativa.
- **Pouca decoração**: bordas finas, sombras muito suaves, divisores quando bastam.
- **Dados acima do efeito**: valores monetários têm prioridade visual sobre ícones e cromas.
- **Motion funcional**: microinterações curtas, não coreografia.

### Regras de interpretação da referência Apple

Apple é referência de linguagem visual, não molde literal de layout.

- Usar: clareza, precisão, respiro, hierarquia tipográfica, superfícies limpas e ações azuis.
- Não copiar: hero marketing gigante, narrativa longa, excesso de espaço quando a tarefa exige rapidez.
- Dashboard pode ser mais editorial e espaçoso.
- Transações deve ser mais densa, rápida e operacional.
- Relatórios fica no meio: visual, mas ainda analítico.
- Configurações deve parecer nativa, organizada e silenciosa.

### Tema e densidade

Tema inicial: **light-only**.

- Tokens devem ser preparados para dark mode futuro.
- A implementação atual não deve incluir dark mode para evitar aumento de escopo.
- Não criar toggle de tema nesta etapa.

Densidade por contexto:

| Contexto | Densidade | Regra |
| --- | --- | --- |
| Dashboard | Confortável/editorial | Mais respiro, card hero forte, poucas decisões por bloco. |
| Transações | Compacta operacional | Lista eficiente, valores alinhados, filtros acessíveis sem ocupar tudo. |
| Relatórios | Intermediária | Gráficos e leitura analítica com bom respiro. |
| Configurações | Confortável nativa | Seções claras, ações pouco frequentes, pouco ruído. |
| Backup/Segurança | Confortável e explícita | Copy direta, confirmação clara, risco visível. |

### Regras para data visualization

Gráficos devem servir leitura financeira, não decoração.

- Sem 3D.
- Sem sombras em barras/linhas/donut.
- Sem gradientes decorativos.
- Labels mínimos, mas suficientes para entender o dado.
- Valores principais aparecem fora do gráfico em texto legível.
- Cor sempre tem apoio textual; nunca depender só de cor.
- Legenda deve ser direta ou incorporada ao próprio dado.
- Eixos e divisores devem ser discretos.
- Donut só quando mostrar progresso/parte de um todo; comparação temporal usa barras/linhas simples.
- Despesa, receita, alerta e sucesso usam tokens semânticos consistentes.

### Fase 1 — Fundação de tokens semânticos

Criar tokens em `src/theme/` para remover cores e medidas soltas dos componentes.

Paths planejados:

```txt
src/theme/colors.ts
src/theme/spacing.ts
src/theme/radius.ts
src/theme/shadows.ts
src/theme/typography.ts
src/theme/motion.ts
src/theme/index.ts
```

Estrutura recomendada:

```txt
primitive tokens
  blue.500, slate.900, red.600, green.600...
semantic tokens
  background.app, surface.card, text.primary, action.primary...
component tokens
  button.primary.bg, card.border, tab.active, input.focusBorder...
```

Conteúdo mínimo:

- `background.app`: `#f5f5f7` ou cinza frio equivalente.
- `surface.card`: branco opaco.
- `surface.subtle`: cinza claro para blocos secundários.
- `text.primary`, `text.secondary`, `text.tertiary`.
- `border.subtle`, `border.focus`, `border.danger`.
- `action.primary`: azul calmo inspirado em ação Apple, sem neon.
- `semantic.success`, `semantic.danger`, `semantic.warning`, `semantic.info`.
- `spacing`: `4`, `8`, `12`, `16`, `20`, `24`, `32`, `40`, `48`.
- `radius`: `sm`, `md`, `lg`, `xl`, `xxl`, `pill`, `round`.
- `shadows`: `none`, `hairline`, `soft`, `floating`; sombras leves.
- `typography`: title, largeTitle, sectionTitle, body, label, caption, amount.
- `motion`: duração 120ms, 180ms, 220ms e curvas simples.

Critérios de aceite:

- Nenhum componente novo deve declarar cor crítica inline.
- Componentes base importam tokens de `src/theme`.
- Tokens são semânticos, não só paleta de cor.
- Tema inicial é light-only; tokens podem prever dark futuro, mas sem toggle ou implementação dark nesta etapa.
- `npm run typecheck` passa.

### Fase 2 — Ícones consistentes

Instalar `lucide-react-native` e substituir ícones textuais.

Uso inicial:

- Tab bar: `LayoutDashboard`, `ArrowUpDown`, `ChartPie`, `FileText`.
- Configurações: `Settings` ou `SlidersHorizontal`, não hamburger se abrir só configurações.
- FAB: `Plus`.
- Empty states: ícone por contexto (`Wallet`, `Tags`, `ReceiptText`, `Shield`, `DatabaseBackup`).
- Ações: `Pencil`, `Trash2`, `Download`, `Upload`, `FileDown`.

Critérios de aceite:

- `src/navigation/tabRoutes.ts` não deve depender de símbolos unicode como ícone final.
- Ícones têm tamanho e cor via tokens.
- Ícones decorativos usam `accessibilityElementsHidden` quando necessário; ações mantêm label textual/acessível.
- Botões só com ícone usam `accessibilityLabel`, `accessibilityHint` e `hitSlop`.

### Fase 3 — Primitivos do design system

Evoluir componentes existentes antes de mexer nas telas.

#### `Button`

Adicionar variantes:

```tsx
variant="primary" | "secondary" | "tertiary" | "ghost" | "danger" | "success"
size="sm" | "md" | "lg" | "icon"
selected?: boolean
leftIcon?: ReactNode
rightIcon?: ReactNode
fullWidth?: boolean
```

Regras:

- `primary`: azul sólido, uma ação principal por bloco.
- `secondary`: cinza claro/opaco com texto forte.
- `tertiary`: texto azul, estilo link/ação leve à Apple.
- `ghost`: ação discreta dentro de listas/cards.
- `danger`: destrutivo claro, nunca usado por estética.
- `disabled` significa indisponível.
- `selected` significa opção ativa.

#### `Card`

Adicionar variantes:

```tsx
variant="default" | "subtle" | "elevated" | "interactive" | "critical"
padding="sm" | "md" | "lg" | "xl"
```

Regras:

- `default`: conteúdo financeiro principal, branco opaco.
- `subtle`: filtros, apoio e seções menos importantes.
- `elevated`: resumo principal ou bloco hero.
- `interactive`: lista tocável ou item clicável.
- `critical`: só para dados/avisos que exigem atenção.
- Evitar `Card` dentro de `Card`; preferir divisores ou seções internas.

#### `TextInput` e `MoneyInput`

Melhorias:

- estado `focused` com borda azul e sombra mínima.
- `helperText` além de `error`.
- placeholder com contraste adequado.
- ícone opcional à esquerda/direita.
- altura mínima 48px preservada.
- suporte a Dynamic Type sem cortar valor.

#### Novos primitivos

| Componente | Path sugerido | Função |
| --- | --- | --- |
| `ScreenHeader` | `src/components/ui/ScreenHeader.tsx` | Título grande, subtítulo curto e ação opcional. |
| `InlineStatus` | `src/components/ui/InlineStatus.tsx` | Sucesso, erro, aviso e info locais. |
| `SegmentedControl` | `src/components/ui/SegmentedControl.tsx` | Abas e escolhas com seleção real. |
| `ActionRow` | `src/components/ui/ActionRow.tsx` | Linhas responsivas de ações. |
| `ListItemCard` | `src/components/ui/ListItemCard.tsx` | Base para conta, categoria e transação. |
| `FloatingTabBar` | `src/components/ui/FloatingTabBar.tsx` | Tab bar inferior opaca, arredondada, sem blur. |
| `FloatingActionButton` | `src/components/ui/FloatingActionButton.tsx` | Botão `+` para nova transação. |
| `SettingsButton` | `src/components/ui/SettingsButton.tsx` | Acesso a Configurações no topo. |

Critérios de aceite:

- Nenhum seletor usa `disabled` para indicar seleção.
- `BackupScreen` deixa de usar `RNButton`.
- Status inline repetido começa a migrar para `InlineStatus`.
- Alvos de toque ficam com mínimo 44px, preferencial 48px.

### Fase 4 — Navegação e estrutura global

Objetivo: tornar a navegação premium, clara e parecida com produto Apple, sem vidro.

Implementar:

- `FloatingTabBar`: tab bar inferior opaca, branca, com borda sutil e sombra leve.
- `FloatingActionButton`: botão `+` azul integrado à navegação, ação primária de nova transação.
- `SettingsButton`: canto superior direito, abre Configurações.
- `ScreenHeader` em todas as views principais.

Regras:

- Tab bar final deve mostrar só: Dashboard, Transações, Budget, Relatórios.
- Configurações sai da tab bar e vira tela acessada pelo botão de configurações.
- Backup e segurança ficam dentro de Configurações.
- Nada de blur, glass, frosted surface ou translucidez ornamental.
- Superfícies de navegação são opacas, com borda fina e sombra muito leve.

Critérios de aceite:

- Rotas atuais continuam acessíveis durante migração.
- Navegação funciona em iOS, Android e web.
- FAB não cobre conteúdo importante nem fica preso ao teclado.
- Botão de Configurações usa ícone de configurações, não hamburger genérico.

### Fase 5 — Componentes financeiros e listas

Criar componentes específicos para leitura financeira.

| Componente | Path sugerido | Uso |
| --- | --- | --- |
| `TransactionListItem` | `src/components/finance/TransactionListItem.tsx` | Lista densa de gastos/recebimentos. |
| `AccountListItem` | `src/components/finance/AccountListItem.tsx` | Contas cadastradas. |
| `CategoryListItem` | `src/components/finance/CategoryListItem.tsx` | Categorias com swatch, não hexadecimal visível. |
| `MetricCard` ou `SummaryCard` v2 | `src/components/finance/SummaryCard.tsx` | Métricas com hierarquia melhor. |
| `BudgetDonut` | `src/components/charts/BudgetDonut.tsx` | Budget restante no Dashboard/Budget. |
| `TrendBars` | `src/components/charts/TrendBars.tsx` | Gastos vs ganhos ao longo do tempo. |
| `DateFilterBar` | `src/components/ui/DateFilterBar.tsx` | Dia, mês, ano e data específica. |

Regras:

- Valores monetários alinhados à direita quando em lista.
- Despesa usa vermelho controlado; receita usa verde; saldo neutro usa ink/accent conforme contexto.
- Categoria usa swatch visual e nome legível, não texto hexadecimal.
- Gráficos sem gradiente decorativo; cores apenas para diferenciar dado e estado.
- Listas usam densidade confortável, com divisores sutis ou cards compactos, não cards pesados repetidos.
- Seguir regras de data visualization: sem 3D, sem sombra no gráfico, valores principais fora do gráfico e cor sempre acompanhada de texto.

### Fase 6 — Budget mínimo funcional

Não colocar uma tab principal só com “em breve”. Budget deve ter funcionalidade mínima antes de entrar como tab final.

Mínimo aceitável:

- usuário define budget mensal geral.
- valor fica salvo localmente.
- Dashboard mostra gasto real vs budget.
- Budget mostra progresso, restante e estado.
- Sem budget definido: estado vazio bonito com CTA `Definir budget mensal`.

Objetivo futuro:

- budget por categoria.
- comparação automática com despesas reais.
- alertas por categoria.

### Fase 7 — Motion e feedback mobile

Adicionar microinterações funcionais, sem espetáculo.

Regras:

- Press feedback: scale `0.96–0.98` e opacidade leve.
- Mudança de segmento/filtro: 150–220ms.
- FAB: feedback curto ao toque.
- Loading em conteúdo: preferir skeleton/placeholder local quando possível.
- Respeitar reduzir movimento quando disponível.
- Usar `react-native-reanimated` só onde melhorar estado/percepção.

Opcional pós-fundação:

```bash
npm install expo-haptics
```

Uso recomendado:

- salvar transação: success.
- erro de validação: warning.
- ação destrutiva confirmada: impact.
- trocar segmento/filtro: light.

### Fase 8 — Polimento por tela

Ordem recomendada:

1. **Backup**: tela menor, ótimo alvo para validar novos `Button`, `Card`, `InlineStatus` e `ScreenHeader`.
2. **Configurações**: consolidar preferências, backup, segurança e aparência.
3. **Nova transação**: FAB deve abrir tela dedicada `/new-transaction`, mais acessível e keyboard-safe que bottom sheet.
4. **Transações**: maior ganho de UX; aplicar `SegmentedControl`, `DateFilterBar`, `TransactionListItem` e FAB.
5. **Dashboard**: melhorar hierarquia, resumo principal, `BudgetDonut` e gráficos.
6. **Budget**: mínimo funcional antes de virar tab principal.
7. **Relatórios**: reutilizar métricas/gráficos do Dashboard e organizar PDF como ação secundária clara.
8. **Contas/Categorias**: migrar acesso para fluxos internos ou Configurações conforme a navegação final.

### Fase 9 — Acessibilidade, regressão e acabamento

Checklist obrigatório antes de encerrar o redesign:

- Contraste AA para texto normal.
- Placeholder legível.
- Labels acessíveis em campos, botões de ícone e FAB.
- `accessibilityRole`, `accessibilityLabel` e `accessibilityHint` nos controles principais.
- `hitSlop` em botões de ícone.
- Estado `selected` diferente de `disabled`.
- Loading não remove o texto do botão sem indicar progresso.
- Erros têm mensagem textual, não só cor.
- Cards não ficam aninhados sem necessidade.
- Layout confortável em 375px.
- Dynamic Type/fonte aumentada não corta valores importantes.
- Forms continuam seguros com teclado aberto.
- Hover/focus funcionam no web.
- `npm run lint`, `npm run typecheck` e `npm test` passam.

### Entregáveis esperados

```txt
Etapa 1: tokens semânticos + Button/Card/TextInput v2
Etapa 2: lucide icons + ScreenHeader/InlineStatus/SegmentedControl
Etapa 3: Backup + Configurações alinhadas ao design system
Etapa 4: navegação final com FloatingTabBar, FloatingActionButton e SettingsButton
Etapa 5: nova transação via FAB
Etapa 6: Transações refinada
Etapa 7: Dashboard + Budget mínimo funcional
Etapa 8: Relatórios refinados
Etapa 9: hardening visual, acessibilidade e testes
```

## Divisão em sprints de desenvolvimento

As sprints abaixo transformam o plano visual em entregas incrementais. Cada sprint deve terminar com app compilando, testes passando e sem quebrar fluxos existentes.

### Definição de pronto global

Vale para todas as sprints:

- `npm run lint` passa.
- `npm run typecheck` passa.
- `npm test` passa ou falhas são documentadas com causa clara.
- Alterações mantêm compatibilidade iOS, Android e web.
- Nenhum dado financeiro crítico perde contraste.
- Nenhum controle novo fica sem label acessível.
- Componentes novos usam tokens de `src/theme`, não cores soltas.
- Nada de Liquid Glass, glassmorphism, blur/frost ou cards translúcidos.
- Tema inicial é light-only; não criar toggle dark mode nesta fase.
- Apple é referência visual, não layout literal; preservar densidade quando a tarefa exigir.
- Gráficos seguem regras de data visualization: sem ornamento e sem depender só de cor.
- O app continua funcional com as rotas existentes durante a migração.

### Sprint UI-01 — Fundação visual e tokens

Objetivo:
- criar a base semântica do novo design inspirado nos websites da Apple.
- preparar o app para evoluir componentes sem espalhar estilos inline.

O que fazer:
- Criar `src/theme/colors.ts`.
- Criar `src/theme/spacing.ts`.
- Criar `src/theme/radius.ts`.
- Criar `src/theme/shadows.ts`.
- Criar `src/theme/typography.ts`.
- Criar `src/theme/motion.ts`.
- Criar `src/theme/index.ts`.
- Definir tokens primitivos, semânticos e de componentes.
- Migrar `Button`, `Card`, `TextInput`, `Screen` e feedbacks globais para tokens onde for seguro.
- Ajustar canvas do app para fundo claro editorial (`#f5f5f7` ou equivalente).
- Documentar no próprio tema quais tokens são estáveis e quais são internos de componente.

Critérios de aceitação:
- `src/theme/index.ts` exporta todos os tokens.
- Componentes base não dependem mais das cores antigas principais inline.
- Fundo principal claro aplicado de forma consistente.
- Cards usam superfície branca opaca.
- Não existe implementação de dark mode nem toggle de tema.
- Typecheck, lint e testes passam.

### Sprint UI-02 — Componentes primitivos v2

Objetivo:
- transformar o design system mínimo em um conjunto de primitivos reutilizáveis.
- remover ambiguidade entre botão selecionado, botão desabilitado e ação destrutiva.

O que fazer:
- Evoluir `src/components/ui/Button.tsx` com:
  - `variant="primary" | "secondary" | "tertiary" | "ghost" | "danger" | "success"`.
  - `size="sm" | "md" | "lg" | "icon"`.
  - `selected`, `leftIcon`, `rightIcon`, `fullWidth`.
- Evoluir `src/components/ui/Card.tsx` com:
  - `variant="default" | "subtle" | "elevated" | "interactive" | "critical"`.
  - `padding="sm" | "md" | "lg" | "xl"`.
- Evoluir `src/components/ui/TextInput.tsx`:
  - foco visual.
  - `helperText`.
  - placeholder legível.
  - suporte a ícones opcionais.
- Garantir que `MoneyInput` continue usando `TextInput` sem quebrar parsing/formatação.
- Criar `ScreenHeader`.
- Criar `InlineStatus`.
- Criar `SegmentedControl`.
- Criar `ActionRow`.
- Atualizar `src/components/ui/index.ts`.

Critérios de aceitação:
- Nenhum novo seletor usa `disabled` para representar seleção.
- `Button` mantém compatibilidade com usos atuais.
- `TextInput` mostra erro e helper text corretamente.
- `SegmentedControl` expõe estado selecionado acessível.
- Componentes têm alvos mínimos de 44px, preferencialmente 48px.
- Typecheck, lint e testes passam.

### Sprint UI-03 — Ícones, feedbacks e telas menores

Objetivo:
- substituir símbolos textuais por ícones consistentes.
- validar os novos primitivos em telas de menor risco.

O que fazer:
- Instalar `lucide-react-native`.
- Trocar ícones textuais de navegação por ícones reais.
- Criar padrão de tamanho/cor de ícones via tokens.
- Migrar `BackupScreen` para o design system:
  - remover `RNButton`.
  - usar `ScreenHeader`, `Card`, `Button`, `InlineStatus`.
- Migrar estados de erro/sucesso locais mais simples para `InlineStatus`.
- Melhorar `EmptyState` com ícone opcional e copy curta.
- Garantir acessibilidade em botões só com ícone.

Critérios de aceitação:
- `src/navigation/tabRoutes.ts` não usa símbolos unicode como ícones finais.
- `BackupScreen` não usa mais `Button` nativo do React Native.
- Ícones de ação têm `accessibilityLabel` quando não há texto visível.
- Empty states continuam educativos e sem nested surface desnecessário.
- Typecheck, lint e testes passam.

### Sprint UI-04 — Configurações e estrutura global

Objetivo:
- tirar Configurações da navegação principal sem perder acesso.
- criar estrutura global compatível com a navegação final.

O que fazer:
- Criar `SettingsButton` opaco, circular ou pill, com borda sutil.
- Substituir ideia de hamburger por `Settings` ou `SlidersHorizontal`.
- Ajustar headers das views para aceitarem ação de configurações no topo quando necessário.
- Migrar `SettingsScreen` para novos componentes:
  - `ScreenHeader`.
  - `Card` v2.
  - `Button` v2.
  - `InlineStatus`.
  - `SegmentedControl` para moeda/mês inicial/segurança.
- Remover qualquer opção de ativar/desativar glass.
- Manter Backup e segurança dentro de Configurações.

Critérios de aceitação:
- Configurações permanece acessível sem estar na tab bar final.
- Não existe toggle ou copy sobre glass.
- Botão de Configurações tem label/hint acessível.
- Preferências continuam persistindo corretamente.
- Segurança local continua funcionando.
- Typecheck, lint e testes passam.

### Sprint UI-05 — Navegação final e nova transação

Objetivo:
- implementar navegação inferior opaca e ação principal clara para nova transação.

O que fazer:
- Criar `FloatingTabBar` opaca:
  - fundo branco.
  - borda sutil.
  - sombra leve.
  - tabs com ícone + label.
  - item ativo azul.
- Criar `FloatingActionButton` azul para `+`.
- Integrar FAB à ação de nova transação.
- Garantir que FAB abra tela dedicada `/new-transaction`.
- Revisar `app/(tabs)/_layout.tsx` para a ordem final:
  - Dashboard.
  - Transações.
  - Budget quando funcional.
  - Relatórios.
- Manter rotas antigas acessíveis durante transição.
- Ajustar padding inferior das telas para não ficar coberto pela tab bar/FAB.

Critérios de aceitação:
- Tab bar final é opaca, sem blur/translucidez.
- FAB não cobre conteúdo importante.
- `/new-transaction` abre corretamente pelo FAB.
- A navegação funciona em iOS, Android e web.
- Rotas auxiliares não aparecem indevidamente na tab bar.
- Safe area é respeitada em iOS/Android.
- Com teclado aberto, tab bar/FAB não bloqueiam campos ou ações principais.
- Typecheck, lint e testes passam.

### Sprint UI-06 — Transações refinada

Objetivo:
- tornar Transações a tela mais rápida e legível do app.

O que fazer:
- Criar `TransactionListItem`.
- Criar ou aplicar `DateFilterBar`.
- Usar `SegmentedControl` para `Gastos` e `Recebimentos`.
- Melhorar filtros por dia, mês, ano e data específica.
- Alinhar valores à direita.
- Mostrar categoria/conta com hierarquia secundária.
- Usar ícones ou swatches consistentes por categoria.
- Reduzir peso visual de cards repetidos na lista.
- Garantir que edição/exclusão continuem funcionando.
- Preservar busca por descrição.

Critérios de aceitação:
- Lista diferencia claramente gasto e recebimento.
- Valor monetário é o elemento dominante do item.
- Filtros não quebram em 375px.
- Filtros e formulário continuam usáveis com teclado aberto.
- Estados vazios explicam próximo passo.
- Editar e excluir preservam confirmação/feedback.
- Typecheck, lint e testes passam.

### Sprint UI-07 — Budget mínimo funcional

Objetivo:
- transformar Budget em feature real antes de virar tab principal definitiva.

O que fazer:
- Criar persistência local para budget mensal geral.
- Criar tela Budget com:
  - `ScreenHeader`.
  - card hero de budget restante.
  - input/fluxo para definir ou editar budget mensal.
  - progresso visual simples.
  - estado vazio com CTA `Definir budget mensal`.
- Calcular despesas reais do mês contra budget definido.
- Criar `BudgetDonut` ou progresso equivalente.
- Expor dados mínimos para Dashboard reutilizar.
- Definir estados:
  - saudável.
  - perto do limite.
  - estourado.
  - sem budget definido.

Critérios de aceitação:
- Usuário consegue salvar e editar budget mensal.
- Budget persiste ao fechar/reabrir app.
- App compara despesas reais do mês contra budget.
- Dashboard consegue exibir gasto vs budget.
- Estados de cor não dependem só de cor, também têm texto.
- Typecheck, lint e testes passam.

### Sprint UI-08 — Dashboard Apple-like

Objetivo:
- redesenhar Dashboard como visão premium, clara e acionável.

O que fazer:
- Aplicar `ScreenHeader` com título grande.
- Criar card hero de resumo financeiro.
- Integrar budget restante ou estado sem budget.
- Integrar `BudgetDonut` ou progresso de budget.
- Criar/refinar `TrendBars` para gastos vs ganhos.
- Revisar `SummaryCard` para métrica mais limpa e menos pesada.
- Reduzir nested cards.
- Adicionar ações rápidas:
  - nova transação.
  - ir para Budget.
  - ir para Relatórios.

Critérios de aceitação:
- Dashboard comunica saldo/situação do mês em poucos segundos.
- Budget aparece quando configurado e não parece placeholder.
- Gráficos são legíveis em 375px.
- Não há gradientes decorativos.
- Gráficos não usam sombra/3D e não dependem só de cor.
- Cards têm hierarquia clara: hero, métricas, detalhes.
- Typecheck, lint e testes passam.

### Sprint UI-09 — Relatórios refinado

Objetivo:
- transformar Relatórios em análise visual clara, com PDF como ação de apoio.

O que fazer:
- Aplicar `ScreenHeader` com título grande.
- Reusar métricas e gráficos refinados do Dashboard.
- Melhorar filtros por período.
- Organizar comparação com mês anterior.
- Melhorar gastos por categoria com lista/gráfico simples.
- Deixar PDF como ação secundária ou tertiary, não foco principal.
- Migrar mensagens de PDF para `InlineStatus`.

Critérios de aceitação:
- Relatórios mostram análise antes de oferecer PDF.
- Comparação com mês anterior é fácil de entender.
- Visualizações seguem as regras de data visualization do documento.
- PDF continua gerando e compartilhando como antes.
- Estados sem dados são claros e acionáveis.
- Typecheck, lint e testes passam.

### Sprint UI-10 — Contas, Categorias e consolidação

Objetivo:
- alinhar telas auxiliares ao novo design e decidir onde vivem no fluxo final.

O que fazer:
- Criar `AccountListItem`.
- Criar `CategoryListItem`.
- Substituir hexadecimal visível por swatch de cor.
- Migrar botões de tipo para `SegmentedControl`.
- Padronizar ações Editar/Excluir.
- Avaliar se Contas/Categorias ficam:
  - em Configurações.
  - em fluxos internos de Transações.
  - como telas auxiliares ocultas da tab bar.
- Atualizar links/CTAs conforme decisão.

Critérios de aceitação:
- Contas e categorias não aparecem como tabs principais.
- Usuário ainda consegue criar/editar/excluir contas e categorias.
- Categoria mostra swatch e nome, não hexadecimal como informação principal.
- Exclusões bloqueadas por regra continuam protegidas.
- Typecheck, lint e testes passam.

### Sprint UI-11 — Motion, haptics e acabamento

Objetivo:
- adicionar refinamento tátil/visual sem comprometer acessibilidade.

O que fazer:
- Padronizar press feedback em botões, cards interativos e FAB.
- Adicionar transições curtas em seleção de segmentos/filtros.
- Criar skeletons simples para carregamentos locais quando fizer sentido.
- Respeitar redução de movimento quando disponível.
- Opcional: instalar `expo-haptics`.
- Aplicar haptics em:
  - salvar transação.
  - erro de validação.
  - confirmação destrutiva.
  - troca de segmento/filtro.
- Revisar hover/focus no web.

Critérios de aceitação:
- Motion é funcional, curto e não distrai.
- App continua confortável com redução de movimento.
- Haptics, se instalado, tem fallback silencioso.
- Web mantém foco visível e hover coerente.
- Typecheck, lint e testes passam.

### Sprint UI-12 — Hardening final e documentação

Objetivo:
- fechar redesign com qualidade de release interno.

O que fazer:
- Auditoria visual em 375px.
- Auditoria de contraste.
- Auditoria de Dynamic Type/fonte aumentada.
- Auditoria de safe area e teclado aberto nas telas com formulário.
- Auditoria das regras de data visualization.
- Revisar labels acessíveis.
- Revisar estados vazios, erros e loading.
- Remover estilos mortos e componentes antigos não usados.
- Atualizar `design-implementation.md` com o estado final real.
- Atualizar documentação de rotas/componentes se a navegação mudar.

Critérios de aceitação:
- Todas as telas principais seguem a direção Apple-like.
- Nenhuma referência implementável a glass/liquid glass permanece.
- Fluxos principais funcionam:
  - criar transação.
  - editar/excluir transação.
  - criar conta/categoria.
  - definir budget.
  - gerar PDF.
  - exportar/importar backup.
  - bloquear/desbloquear app.
- `npm run lint`, `npm run typecheck` e `npm test` passam.
- Documento reflete o design implementado, não só intenção.

## Modelo final de design decidido

Esta seção registra as decisões finais para orientar a próxima implementação visual.

### Referência visual final

Referência: **websites da Apple**, adaptados para um app financeiro mobile.

Interpretação:
- Apple inspira clareza, hierarquia, respiro e acabamento.
- O app não deve copiar landing pages ou heros de marketing.
- Telas operacionais mantêm densidade suficiente para uso rápido.

Usar:
- fundo claro `#f5f5f7` ou próximo.
- cards brancos opacos.
- tipografia grande e confiante.
- subtítulos curtos em cinza escuro.
- botões azuis arredondados.
- links/tertiary actions em azul.
- divisores e bordas sutis.
- sombras mínimas.
- motion curto e funcional.

Não usar:
- Liquid Glass.
- glassmorphism.
- blur/frost.
- cards translúcidos.
- gradientes decorativos.
- neon.
- tema fintech escuro pesado.
- hamburger se o botão abre só Configurações.

Tema:
- light-only na implementação atual.
- tokens preparados para dark mode futuro.
- sem toggle de tema por enquanto.

### Views principais finais

A navegação principal deve conter somente quatro views quando todas estiverem úteis:

1. **Dashboard**
2. **Transações**
3. **Budget**
4. **Relatórios**

Configurações deixa de ser tab principal. Deve abrir por botão de configurações no canto superior direito.

Backup e segurança ficam dentro de Configurações.

### Dashboard

Objetivo:
- funcionar como central de ações rápidas.
- resumir a situação financeira atual.
- permitir leitura rápida do budget e do fluxo de dinheiro.

Componentes desejados:
- título grande dentro da própria view.
- resumo principal em card hero branco.
- donut chart de budget.
- gráfico de gastos/ganhos x tempo.
- ações rápidas para adicionar transação, ir para Budget e ir para Relatórios.

Densidade:
- confortável/editorial.
- mais respiro que as listas operacionais.
- poucos blocos competindo por atenção.

Donut de budget:
- centro deve mostrar **Budget restante**.
- formato recomendado:
  - `Budget restante`
  - valor em BRL.
  - dias restantes do período.
- anel representa gasto real dividido pelo budget total.
- estados de cor:
  - azul calmo como acento base.
  - verde para situação positiva/sucesso.
  - âmbar para perto do limite.
  - vermelho para budget estourado.

Gráfico temporal:
- inspirado em leitura limpa de produto Apple: eixos simples, labels poucos, barras precisas.
- deve comparar **gastos vs ganhos** ao longo do tempo.
- pode ter filtros `Semana`, `Mês`, `Trimestre` no futuro.
- sem gradientes decorativos.
- sem sombra, 3D ou ornamento.
- valores principais devem aparecer em texto fora do gráfico.

### Transações

Objetivo:
- ser uma lista densa e rápida de movimentações.
- focar em leitura, filtro e lançamento.

Densidade:
- compacta operacional.
- menos respiro que Dashboard.
- priorizar leitura rápida de valor, descrição, data e categoria.

Estrutura:
- duas abas principais:
  - **Gastos**
  - **Recebimentos**
- lista de transações abaixo.
- cada item deve mostrar:
  - ícone/categoria.
  - título/descrição.
  - data/hora ou data.
  - conta/categoria quando útil.
  - valor alinhado à direita.

Filtros necessários:
- por dia.
- por mês.
- por ano.
- por data específica.

Adição de transação:
- botão flutuante `+`.
- ação: abrir tela dedicada `/new-transaction`.
- visual: botão circular destacado em azul calmo.

### Budget

Objetivo inicial:
- funcionalidade mínima real, não placeholder.

Mínimo funcional:
- usuário define budget mensal geral.
- app salva localmente.
- app compara despesas reais do mês vs budget.
- app mostra restante, percentual usado e estado.
- se não houver budget, mostrar estado vazio com CTA claro.

Objetivo futuro:
- usuário define budget por categoria.
- app compara despesas reais vs budget.
- app mostra progresso e alertas por categoria.

Estrutura recomendada:
- título grande dentro da view.
- card hero com budget restante.
- progresso visual simples.
- lista de categorias quando existir budget por categoria.
- CTA primário para definir/editar budget.

### Relatórios

Objetivo:
- análise visual.
- PDF como opção disponível, não como foco absoluto.

Densidade:
- intermediária.
- gráficos com leitura limpa.
- análise acima de decoração.

Componentes desejados:
- título grande dentro da view.
- filtros por período.
- gráficos principais.
- comparação com mês anterior.
- gastos por categoria.
- tendência do período.
- botão para exportar PDF como ação secundária ou tertiary.

### Configurações

Objetivo:
- tela inteira acessada por botão de configurações.
- concentrar opções menos frequentes.

Acesso:
- ícone `Settings` ou `SlidersHorizontal` no canto superior direito.
- botão opaco, circular ou pill, com fundo branco e borda sutil.
- toque abre tela inteira de Configurações.

Conteúdo:
- preferências locais.
- aparência, se houver opções futuras.
- backup.
- segurança local.
- dados de demonstração, se mantidos.

### Navegação final

Tipo:
- barra inferior **flutuante opaca**.

Itens:
- Dashboard.
- Transações.
- Budget.
- Relatórios.

Ação central:
- botão flutuante `+` integrado à barra inferior.
- ação principal: nova transação.

Configurações:
- fora da barra inferior.
- acessada por botão no topo direito.

### Header final

Topo global:
- somente botão de configurações no canto superior direito.
- sem barra superior cheia.
- sem título global.

Títulos:
- cada view tem seu próprio título grande dentro do conteúdo.
- subtítulo curto quando ajudar a explicar o estado ou contexto.

### Tema visual

Tema escolhido:
- **Claro editorial inspirado nos websites da Apple**.

Regras:
- sem glassmorphism.
- sem Liquid Glass.
- sem blur/frost/translucidez ornamental.
- sem gradientes decorativos.
- fundo claro suave.
- cards brancos opacos.
- navegação/menu/FAB opacos com borda e sombra leve.
- dados financeiros críticos sempre legíveis.

Acento principal:
- **azul calmo**.

Uso de cores:
- azul: ação principal, seleção, navegação ativa.
- verde: dinheiro positivo/sucesso.
- vermelho: despesas/erro/estouro.
- âmbar: alerta/perto do limite.
- cinzas frios: texto, bordas, fundos neutros.

### Componentes novos planejados

Pacote completo aprovado:

| Componente | Objetivo |
| --- | --- |
| `FloatingTabBar` | Barra inferior flutuante opaca com tabs principais. |
| `SettingsButton` | Botão de configurações no canto superior direito. |
| `FloatingActionButton` | Botão `+` inferior integrado à navegação. |
| `ScreenHeader` | Título/subtítulo dentro da view, não no topo global. |
| `SegmentedControl` | Abas e escolhas como Gastos/Recebimentos, Semana/Mês/Trimestre. |
| `DateFilterBar` | Filtros por dia, mês, ano e data específica. |
| `TransactionListItem` | Item padrão de transação em lista densa. |
| `BudgetDonut` | Donut chart do budget restante. |
| `TrendBars` | Gráfico de gastos/ganhos x tempo. |
| `InlineStatus` | Feedback local de sucesso, erro e aviso. |

### Atualização necessária na paginação

A paginação atual documentada antes ainda reflete o app existente. Para o modelo final, a navegação deve mudar para:

```txt
Tabs finais
  ├─ Dashboard
  ├─ Transações
  ├─ Budget
  └─ Relatórios

Topo direito
  └─ Configurações tela inteira
      ├─ Preferências
      ├─ Aparência, se houver opções futuras
      ├─ Backup
      ├─ Segurança local
      └─ Demo data
```

Rotas atuais que deixam de ser tabs principais:
- `accounts`
- `categories`
- `settings`

Essas funções devem migrar ou ser acessadas por fluxos internos quando necessário:
- Contas e categorias podem ser tratadas dentro de Configurações, Transações ou Budget em etapa futura.
- Backup fica dentro de Configurações.
