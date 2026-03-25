# Arquitetura da Aplicação — Finance App

**Versão:** 1.0  
**Última atualização:** Março 2026  
**Nível:** Avançado — Arquitetura de Software

---

## 1. Visão Geral da Arquitetura

Esta aplicação segue uma arquitetura **híbrida SSR/CSR** (Server-Side Rendering + Client-Side Rendering) baseada no Next.js 14 App Router, com foco em:

- **Mobile-first PWA**: Progressive Web App otimizada para dispositivos móveis (viewport mínimo 375px)
- **Zero-cost infrastructure**: Uso exclusivo de free tiers (Supabase, Vercel)
- **Data isolation**: Segregação completa de dados por usuário via Row Level Security (RLS)
- **Type-safe**: TypeScript strict mode em toda a codebase
- **Scalable patterns**: Preparada para expansão futura sem refatoração massiva

### 1.1 Princípios Arquiteturais

#### Separation of Concerns
- **Presentation Layer**: Componentes React (UI pura)
- **Business Logic Layer**: Hooks customizados e utilitários
- **Data Layer**: Supabase client + TanStack Query
- **Security Layer**: Row Level Security (RLS) + Middleware

#### Domain-Driven Design (Parcial)
A aplicação é organizada por **domínios de negócio**:
- `transactions`: Transações financeiras (receitas/despesas)
- `budgets`: Orçamentos e limites por categoria
- `goals`: Metas de economia
- `investments`: Carteira de investimentos
- `categories`: Categorização de transações

#### SOLID Principles
- **Single Responsibility**: Cada hook faz uma única coisa (ex: `useTransactions` apenas gerencia transações)
- **Open/Closed**: Componentes extensíveis via props, mas fechados para modificação interna
- **Interface Segregation**: Tipos TypeScript granulares, não "god objects"
- **Dependency Inversion**: Componentes dependem de abstrações (hooks), não de implementações diretas

---

## 2. Diagrama de Arquitetura de Alto Nível

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER (Browser)                          │
│                      Mobile-first viewport                      │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    NEXT.JS 14 APP ROUTER                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │   Pages      │  │  API Routes  │  │   Middleware         │  │
│  │  (RSC/CSR)   │  │  (Edge RT)   │  │  (Auth + Session)    │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬───────────┘  │
└─────────┼──────────────────┼─────────────────────┼──────────────┘
          │                  │                     │
          ▼                  ▼                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                     CLIENT-SIDE LAYER                           │
│  ┌─────────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │  React          │  │  TanStack    │  │  Zustand         │   │
│  │  Components     │  │  Query       │  │  (Global State)  │   │
│  │  (shadcn/ui)    │  │  (Cache)     │  │                  │   │
│  └────────┬────────┘  └──────┬───────┘  └──────────────────┘   │
└───────────┼────────────────────┼──────────────────────────────────┘
            │                    │
            ▼                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                      CUSTOM HOOKS LAYER                         │
│  ┌──────────────────┐  ┌───────────────┐  ┌─────────────────┐  │
│  │ useTransactions  │  │  useBudgets   │  │  useInvestments │  │
│  │ useGoals         │  │  useDashboard │  │  useCategories  │  │
│  └────────┬─────────┘  └───────┬───────┘  └────────┬────────┘  │
└───────────┼────────────────────┼───────────────────┼────────────┘
            │                    │                   │
            ▼                    ▼                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                   SUPABASE CLIENT LAYER                         │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  @supabase/supabase-js (Browser Client)                  │   │
│  │  - Auth: Google OAuth                                    │   │
│  │  - Database: PostgreSQL queries                          │   │
│  │  - RPC: Stored procedures (generate_recurring)           │   │
│  └──────────────────────────┬───────────────────────────────┘   │
└─────────────────────────────┼───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     SUPABASE BACKEND                            │
│  ┌──────────────────┐  ┌──────────────┐  ┌─────────────────┐   │
│  │  PostgreSQL DB   │  │  Auth        │  │  Edge Functions │   │
│  │  (RLS Enabled)   │  │  (Google)    │  │  (weekly email) │   │
│  │  - 6 tables      │  │              │  │                 │   │
│  │  - Triggers      │  │              │  │                 │   │
│  │  - Functions     │  │              │  │                 │   │
│  └──────────────────┘  └──────────────┘  └─────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                            │
│  ┌──────────────────┐  ┌──────────────────────────────────┐    │
│  │  BCB API         │  │  Resend (Email)                  │    │
│  │  (Taxa Selic,    │  │  (Resumo semanal)                │    │
│  │   CDI, IPCA)     │  │                                  │    │
│  └──────────────────┘  └──────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Estrutura de Pastas Detalhada

### 3.1 Organização Completa

```
/finance-app
├── app/                                # Next.js App Router (RSC-first)
│   ├── (auth)/                         # Route Group: Rotas públicas (não autenticadas)
│   │   ├── login/
│   │   │   └── page.tsx                # Página de login (Google OAuth)
│   │   └── auth/
│   │       └── callback/
│   │           └── route.ts            # Callback OAuth do Supabase
│   │
│   ├── (app)/                          # Route Group: Rotas protegidas (autenticadas)
│   │   ├── layout.tsx                  # Layout wrapper (BottomNav + PageHeader)
│   │   ├── dashboard/
│   │   │   └── page.tsx                # Dashboard principal (resumo do mês)
│   │   ├── transacoes/
│   │   │   ├── page.tsx                # Lista de transações (filtros + resumo)
│   │   │   ├── nova/
│   │   │   │   └── page.tsx            # Nova transação (formulário inline)
│   │   │   └── importar/
│   │   │       └── page.tsx            # Import CSV do Nubank (3 etapas)
│   │   ├── metas/
│   │   │   └── page.tsx                # Orçamentos + Metas (3 seções)
│   │   ├── investimentos/
│   │   │   └── page.tsx                # Portfólio + Calculadora (tabs)
│   │   └── configuracoes/
│   │       └── page.tsx                # Perfil + Recorrências + Categorias
│   │
│   ├── api/                            # API Routes (Edge Runtime)
│   │   └── bcb-proxy/
│   │       └── route.ts                # Proxy para API do Banco Central (Selic, CDI, IPCA)
│   │
│   ├── layout.tsx                      # Root Layout (metadata, fonts, providers)
│   └── globals.css                     # Tailwind base + custom styles
│
├── components/
│   ├── ui/                             # shadcn/ui components (auto-generated via CLI)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── sheet.tsx                   # Mobile drawer
│   │   ├── alert-dialog.tsx            # Confirmação de exclusão
│   │   ├── toast.tsx                   # Notificações
│   │   └── ...                         # 20+ componentes
│   │
│   ├── charts/
│   │   ├── PieChart.tsx                # Gráfico de pizza (Recharts)
│   │   ├── LineChart.tsx               # Gráfico de linha (Recharts)
│   │   └── InvestmentCalculator.tsx    # Calculadora standalone
│   │
│   ├── forms/
│   │   ├── TransactionForm.tsx         # Formulário de transação (RHF + Zod)
│   │   ├── BudgetForm.tsx              # Formulário de orçamento
│   │   ├── GoalForm.tsx                # Formulário de meta
│   │   ├── InvestmentForm.tsx          # Formulário de investimento
│   │   └── RecurrentForm.tsx           # Formulário de recorrência
│   │
│   ├── layout/
│   │   ├── BottomNav.tsx               # Navegação inferior mobile (4 itens)
│   │   ├── PageHeader.tsx              # Cabeçalho de página (título + ação)
│   │   └── AppProviders.tsx            # Wrapper de providers (TanStack Query)
│   │
│   └── shared/
│       ├── MonthPicker.tsx             # Seletor de mês (setas < >)
│       ├── CategoryBadge.tsx           # Badge de categoria (ícone + cor)
│       ├── CurrencyInput.tsx           # Input formatado BRL
│       ├── TransactionList.tsx         # Lista de transações (agrupada por data)
│       ├── BudgetCard.tsx              # Card de orçamento (barra de progresso)
│       ├── GoalCard.tsx                # Card de meta (progresso + prazo)
│       └── LoadingSpinner.tsx          # Skeleton loader
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts                   # Browser client (createBrowserClient)
│   │   ├── server.ts                   # Server client (createServerClient + cookies)
│   │   └── middleware.ts               # Middleware helper (session refresh)
│   │
│   ├── hooks/
│   │   ├── useTransactions.ts          # CRUD transações + agregações
│   │   ├── useBudgets.ts               # CRUD orçamentos + cálculo de spent
│   │   ├── useGoals.ts                 # CRUD metas + progresso
│   │   ├── useInvestments.ts           # CRUD investimentos + summary
│   │   ├── useCategories.ts            # Lista categorias filtradas por tipo
│   │   ├── useDashboard.ts             # Agregação dashboard (resumo do mês)
│   │   └── useRecurrents.ts            # CRUD recorrências
│   │
│   ├── utils/
│   │   ├── currency.ts                 # Formatação BRL (Intl.NumberFormat)
│   │   ├── date.ts                     # Formatação de datas (date-fns + pt-BR)
│   │   ├── csv-parsers/
│   │   │   └── nubank.ts               # Parser CSV do Nubank (Papa Parse)
│   │   ├── export/
│   │   │   ├── pdf.ts                  # Geração de PDF (jsPDF)
│   │   │   └── excel.ts                # Geração de Excel (SheetJS)
│   │   ├── bcb.ts                      # Fetch taxas do BCB (Selic, CDI, IPCA)
│   │   └── calculations.ts             # Cálculos de investimentos (juros compostos)
│   │
│   └── types/
│       └── index.ts                    # Tipos TypeScript centralizados (17 interfaces)
│
├── store/
│   └── useAppStore.ts                  # Zustand store (mês selecionado, filtros)
│
├── middleware.ts                        # Next.js middleware (auth + session refresh)
│
├── public/
│   ├── manifest.json                   # PWA manifest
│   ├── icons/
│   │   ├── icon-192.png
│   │   └── icon-512.png
│   └── sw.js                           # Service Worker (gerado por next-pwa)
│
└── supabase/
    ├── migrations/                     # SQL migrations (ordem numérica)
    │   ├── 001_categories.sql
    │   ├── 002_transactions.sql
    │   ├── 003_recurrents.sql
    │   ├── 004_budgets.sql
    │   ├── 005_goals.sql
    │   ├── 006_investments.sql
    │   ├── 007_seed_trigger.sql
    │   └── 008_generate_recurrents.sql
    │
    └── functions/
        └── weekly-summary/
            └── index.ts                # Edge Function (resumo semanal por email)
```

### 3.2 Justificativa de Decisões

#### Route Groups `(auth)` e `(app)`
**Por quê?**
- Permite layouts diferentes sem afetar a URL
- `(auth)` tem layout minimalista (apenas logo + botão)
- `(app)` tem layout completo (BottomNav + PageHeader)
- Middleware pode diferenciar facilmente rotas protegidas

**Alternativa rejeitada**: Usar `/dashboard` como prefixo explícito (poluiria URLs)

#### Separação `components/ui` vs `components/forms`
**Por quê?**
- `ui/` é gerenciado pelo shadcn CLI (não editar manualmente)
- `forms/` contém lógica de negócio (validação Zod, mutações)
- Facilita updates do shadcn sem conflitos

#### Hooks customizados em `lib/hooks`
**Por quê?**
- Abstrai lógica de data fetching dos componentes
- Reutilização (ex: `useTransactions` usado em 3 páginas)
- Facilita testes unitários futuros
- Segue padrão "thin components, fat hooks"

#### `lib/types/index.ts` centralizado
**Por quê?**
- Evita duplicação de tipos
- Facilita refatoração (mudar em um lugar só)
- Permite herança/composição de tipos
- Garante consistência entre componentes

**Anti-pattern evitado**: Definir tipos inline em cada componente

---

## 4. Fluxo de Dados Detalhado

### 4.1 Fluxo de Leitura (Query)

```
User Interaction (ex: abrir página de transações)
         │
         ▼
┌──────────────────────────────────────┐
│   Component (TransacoesPage.tsx)    │
│   - Chama useTransactions(month)     │
└──────────────────┬───────────────────┘
                   │
                   ▼
┌──────────────────────────────────────┐
│   Custom Hook (useTransactions.ts)   │
│   - Define query key                 │
│   - Define query function            │
│   - Usa useQuery do TanStack         │
└──────────────────┬───────────────────┘
                   │
                   ▼
┌──────────────────────────────────────┐
│   TanStack Query                     │
│   - Verifica cache local             │
│   - Se hit: retorna imediatamente    │
│   - Se miss: executa queryFn         │
└──────────────────┬───────────────────┘
                   │
                   ▼
┌──────────────────────────────────────┐
│   Supabase Client (client.ts)       │
│   - supabase.from('transactions')    │
│   - .select('*, category:categories(*)') │
│   - .eq('user_id', userId)           │
│   - .gte('date', startOfMonth)       │
│   - .lte('date', endOfMonth)         │
└──────────────────┬───────────────────┘
                   │
                   ▼
┌──────────────────────────────────────┐
│   Supabase Backend                   │
│   - Valida JWT token                 │
│   - Aplica RLS policies              │
│   - Executa query SQL                │
│   - Filtra por auth.uid() = user_id  │
└──────────────────┬───────────────────┘
                   │
                   ▼
┌──────────────────────────────────────┐
│   PostgreSQL Database                │
│   - Busca rows com indexes           │
│   - JOIN com categories              │
│   - Retorna JSON                     │
└──────────────────┬───────────────────┘
                   │
                   ▼
       Dados retornam pela stack
       (cache + state update)
                   │
                   ▼
┌──────────────────────────────────────┐
│   Component Re-render                │
│   - data disponível                  │
│   - isLoading = false                │
│   - Renderiza lista                  │
└──────────────────────────────────────┘
```

**Performance**: 
- Cache hit: ~5ms (leitura de memória)
- Cache miss: ~200-500ms (round-trip Supabase + DB)

### 4.2 Fluxo de Escrita (Mutation)

```
User Interaction (ex: criar transação)
         │
         ▼
┌──────────────────────────────────────┐
│   Form Component                     │
│   - React Hook Form submission       │
│   - Validação Zod                    │
│   - Chama mutate(data)               │
└──────────────────┬───────────────────┘
                   │
                   ▼
┌──────────────────────────────────────┐
│   Custom Hook (useCreateTransaction) │
│   - useMutation do TanStack          │
│   - mutationFn: insert no Supabase   │
└──────────────────┬───────────────────┘
                   │
                   ▼
┌──────────────────────────────────────┐
│   Supabase Client                    │
│   - supabase.from('transactions')    │
│   - .insert({ ...data, user_id })    │
│   - .select()                        │
└──────────────────┬───────────────────┘
                   │
                   ▼
┌──────────────────────────────────────┐
│   Supabase Backend                   │
│   - Valida JWT                       │
│   - RLS policy: PERMITE insert se    │
│     auth.uid() = data.user_id        │
│   - Insere row no PostgreSQL         │
└──────────────────┬───────────────────┘
                   │
                   ▼
┌──────────────────────────────────────┐
│   onSuccess callback                 │
│   - queryClient.invalidateQueries    │
│     (['transactions', userId, month])│
│   - toast.success('Criado!')         │
│   - form.reset()                     │
└──────────────────┬───────────────────┘
                   │
                   ▼
┌──────────────────────────────────────┐
│   TanStack Query Refetch             │
│   - Invalida cache                   │
│   - Re-executa query automaticamente │
│   - Componente re-renderiza          │
└──────────────────────────────────────┘
```

**Optimistic Update** (opcional, não implementado no MVP):
```typescript
// Exemplo futuro:
onMutate: async (newTransaction) => {
  await queryClient.cancelQueries({ queryKey: ['transactions'] })
  const previousData = queryClient.getQueryData(['transactions'])
  
  queryClient.setQueryData(['transactions'], (old) => [...old, newTransaction])
  
  return { previousData }
},
onError: (err, newTransaction, context) => {
  queryClient.setQueryData(['transactions'], context.previousData)
}
```

### 4.3 Fluxo de Autenticação

```
User clica "Entrar com Google"
         │
         ▼
┌──────────────────────────────────────┐
│   Login Page                         │
│   - supabase.auth.signInWithOAuth    │
│     ({ provider: 'google' })         │
└──────────────────┬───────────────────┘
                   │
                   ▼
┌──────────────────────────────────────┐
│   Redirect para Google OAuth         │
│   - User escolhe conta               │
│   - Google autentica                 │
│   - Redirect de volta com code       │
└──────────────────┬───────────────────┘
                   │
                   ▼
┌──────────────────────────────────────┐
│   Callback Route (/auth/callback)    │
│   - Supabase troca code por session  │
│   - Seta cookie com JWT              │
│   - Redirect para /dashboard         │
└──────────────────┬───────────────────┘
                   │
                   ▼
┌──────────────────────────────────────┐
│   Middleware (middleware.ts)         │
│   - Lê cookie                        │
│   - Valida JWT                       │
│   - Refresh token se expirado        │
│   - PERMITE acesso a /dashboard      │
└──────────────────┬───────────────────┘
                   │
                   ▼
┌──────────────────────────────────────┐
│   Dashboard carrega                  │
│   - useUser() retorna user data      │
│   - Trigger: generate_recurring()    │
│   - Queries executam com user_id     │
└──────────────────────────────────────┘
```

**Primeiro login trigger**:
```sql
-- Executado automaticamente no banco:
ON INSERT INTO auth.users
  → create_default_categories(NEW.id)
  → 11 categorias padrão criadas
```

---

## 5. Padrões Arquiteturais Utilizados

### 5.1 Repository Pattern (Implícito)

Embora não haja classes explícitas de "Repository", os **hooks customizados** funcionam como repositories:

```typescript
// lib/hooks/useTransactions.ts atua como TransactionRepository
export function useTransactions(month: Date) {
  const userId = useUser()?.id
  
  return useQuery({
    queryKey: ['transactions', userId, format(month, 'yyyy-MM')],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select('*, category:categories(*)')
        .eq('user_id', userId)
        .gte('date', startOfMonth(month))
        .lte('date', endOfMonth(month))
        .order('date', { ascending: false })
      
      if (error) throw error
      return data as Transaction[]
    },
    enabled: !!userId,
  })
}
```

**Benefícios**:
- Abstrai implementação de data fetching
- Facilita trocar backend (ex: migrar de Supabase para Prisma)
- Facilita mocking em testes

### 5.2 Provider Pattern

Usado para injeção de dependências e contexto global:

```typescript
// components/layout/AppProviders.tsx
export function AppProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minuto
        retry: 1,
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  )
}
```

### 5.3 Compound Component Pattern

Usado em formulários complexos:

```typescript
// Exemplo: TransactionForm
<TransactionForm onSubmit={handleSubmit}>
  <TransactionForm.TypeToggle />
  <TransactionForm.AmountInput />
  <TransactionForm.CategorySelect />
  <TransactionForm.DatePicker />
  <TransactionForm.NotesTextarea />
  <TransactionForm.SubmitButton />
</TransactionForm>
```

**Benefícios**:
- Flexibilidade de composição
- Reutilização de partes do formulário
- Facilita variantes (ex: TransactionFormQuick sem notas)

### 5.4 Custom Hook Pattern

Centraliza lógica reutilizável:

```typescript
// lib/hooks/useDashboard.ts
export function useDashboard(month: Date) {
  const { data: transactions } = useTransactions(month)
  const { data: budgets } = useBudgets(month)
  
  const summary = useMemo(() => {
    if (!transactions) return null
    
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)
    
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)
    
    return {
      totalIncome: income,
      totalExpenses: expenses,
      balance: income - expenses,
      // ... agregações
    }
  }, [transactions])
  
  return { summary, budgets }
}
```

### 5.5 Facade Pattern

API Routes atuam como facades para serviços externos:

```typescript
// app/api/bcb-proxy/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const serie = searchParams.get('serie')
  
  // Esconde complexidade da API do BCB
  const response = await fetch(
    `https://api.bcb.gov.br/dados/serie/bcdata.sgs.${serie}/dados/ultimos/1?formato=json`
  )
  
  const data = await response.json()
  
  // Normaliza response
  return NextResponse.json({
    value: parseFloat(data[0].valor),
    date: data[0].data,
    period: 'annual'
  }, {
    headers: {
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600'
    }
  })
}
```

---

## 6. Decisões de Design e Trade-offs

### 6.1 Next.js App Router vs Pages Router

**Escolha**: App Router (RSC-first)

**Pros**:
- Server Components por padrão (menos JavaScript no bundle)
- Layouts aninhados sem prop drilling
- Streaming SSR (melhor TTFB)
- Futuro do Next.js (suporte prioritário)

**Cons**:
- Curva de aprendizado mais alta
- Menos exemplos na comunidade (2026: já resolvido)
- Bugs em versões iniciais (2024: já estável)

**Trade-off aceito**: Vale a pena pela performance e DX (Developer Experience)

### 6.2 Supabase vs Firebase vs Prisma + PostgreSQL

**Escolha**: Supabase

**Pros**:
- PostgreSQL (SQL real, não NoSQL)
- RLS nativo (segurança no banco, não no código)
- Free tier generoso (500MB DB + 50k usuários auth)
- Edge Functions + Storage inclusos
- Open source (self-hosting futuro)

**Cons**:
- Menos maduro que Firebase (2026: já muito estável)
- Menos integrações third-party

**Alternativas rejeitadas**:
- Firebase: NoSQL dificulta queries complexas (ex: agregações)
- Prisma + Railway: Sem auth builtin, mais custoso

### 6.3 TanStack Query vs SWR vs Apollo

**Escolha**: TanStack Query (React Query)

**Pros**:
- Cache granular e configurável
- Suporte a mutations com invalidação
- DevTools excelente
- Retry + refetch automático
- Funciona com qualquer data fetching (não só GraphQL como Apollo)

**Cons**:
- Bundle size ligeiramente maior que SWR (~13kb vs ~5kb)

**Trade-off aceito**: Recursos extras compensam os 8kb adicionais

### 6.4 Zustand vs Redux vs Context API

**Escolha**: Zustand

**Pros**:
- Simples (sem boilerplate)
- Performance (evita re-renders desnecessários)
- TypeScript-first
- Bundle size pequeno (~1kb)

**Cons**:
- Menos recursos que Redux Toolkit (sem DevTools time-travel)

**Uso no projeto**:
```typescript
// store/useAppStore.ts
interface AppState {
  selectedMonth: Date
  setSelectedMonth: (month: Date) => void
  filters: {
    categoryId?: string
    type?: TransactionType
  }
  setFilters: (filters: AppState['filters']) => void
}

export const useAppStore = create<AppState>((set) => ({
  selectedMonth: new Date(),
  setSelectedMonth: (month) => set({ selectedMonth: month }),
  filters: {},
  setFilters: (filters) => set({ filters }),
}))
```

**Por que não Context API?**
- Re-render de toda árvore ao mudar qualquer valor
- Zustand permite seletores: `useAppStore(state => state.selectedMonth)`

### 6.5 shadcn/ui vs Material-UI vs Chakra UI

**Escolha**: shadcn/ui

**Pros**:
- Copy/paste (não é dependency, é código que você possui)
- Tailwind-based (consistência com resto do projeto)
- Acessibilidade (Radix UI primitives)
- Dark mode nativo
- Customização total (não é biblioteca, é código)

**Cons**:
- Sem componentes "avançados" builtin (ex: DataGrid)
- Precisa atualizar manualmente via CLI

**Trade-off aceito**: Flexibilidade > componentes prontos

---

## 7. Estratégias de Performance

### 7.1 Code Splitting

**Next.js App Router faz automaticamente**:
- Cada `page.tsx` é um chunk separado
- Componentes grandes podem usar `dynamic()`:

```typescript
// app/(app)/investimentos/page.tsx
import dynamic from 'next/dynamic'

const InvestmentCalculator = dynamic(
  () => import('@/components/charts/InvestmentCalculator'),
  { loading: () => <CalculatorSkeleton /> }
)

export default function InvestimentosPage() {
  return (
    <Tabs defaultValue="portfolio">
      <TabsContent value="portfolio">
        {/* ... */}
      </TabsContent>
      <TabsContent value="calculator">
        <InvestmentCalculator />
      </TabsContent>
    </Tabs>
  )
}
```

**Resultado**: Calculadora (Recharts + cálculos) só é carregada quando usuário abre a aba

### 7.2 Database Indexes

```sql
-- Otimizações implementadas nas migrations:

-- 1. Index composto para queries do mês (mais comum)
CREATE INDEX idx_transactions_user_month 
  ON transactions(user_id, date_trunc('month', date));

-- 2. Index simples para filtros
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_transactions_category_id ON transactions(category_id);

-- 3. Index para budgets
CREATE INDEX idx_budgets_user_month ON budgets(user_id, month);

-- 4. Todas as foreign keys têm index automático (PostgreSQL)
```

**Query performance**:
- Sem index: ~500ms (full table scan)
- Com index: ~50ms (index scan + bitmap heap scan)

### 7.3 TanStack Query Cache Strategy

```typescript
// lib/hooks/useTransactions.ts
export function useTransactions(month: Date) {
  return useQuery({
    queryKey: ['transactions', userId, format(month, 'yyyy-MM')],
    queryFn: fetchTransactions,
    
    // Configurações de cache:
    staleTime: 60 * 1000,           // Considera "fresco" por 1 min
    cacheTime: 5 * 60 * 1000,       // Mantém em cache por 5 min após unused
    refetchOnWindowFocus: false,    // Não refetch ao voltar para aba
    refetchOnMount: false,          // Não refetch se cache ainda válido
  })
}
```

**Cenário típico**:
1. User abre `/transacoes` → fetch inicial (500ms)
2. User vai para `/dashboard` → usa cache (5ms)
3. User volta para `/transacoes` → usa cache se < 1min (5ms)
4. User cria nova transação → invalidateQueries → refetch (500ms)

### 7.4 Memoization

```typescript
// lib/hooks/useDashboard.ts
export function useDashboard(month: Date) {
  const { data: transactions } = useTransactions(month)
  
  // Evita recalcular agregações a cada render
  const summary = useMemo(() => {
    if (!transactions) return null
    
    // Cálculos pesados aqui
    return calculateSummary(transactions)
  }, [transactions]) // Só recalcula se transactions mudar
  
  return { summary }
}
```

### 7.5 Image Optimization

```typescript
// Next.js Image component (futuro):
import Image from 'next/image'

<Image
  src="/icons/icon-192.png"
  width={192}
  height={192}
  alt="App Icon"
  loading="lazy"
/>
```

**Resultado**: Imagens servidas em WebP, lazy-loaded, com placeholders

---

## 8. Escalabilidade e Expansão Futura

### 8.1 Suporte a Dashboard Consolidado do Casal

**Arquitetura preparada**:
```sql
-- Migration futura (009):
CREATE TABLE couple_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id UUID NOT NULL REFERENCES auth.users(id),
  user2_id UUID NOT NULL REFERENCES auth.users(id),
  status TEXT CHECK (status IN ('pending', 'accepted')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user1_id, user2_id)
);

-- View consolidada (futuro):
CREATE VIEW couple_transactions AS
SELECT t.*, 'user1' as owner
FROM transactions t
INNER JOIN couple_relationships cr ON t.user_id = cr.user1_id
WHERE cr.status = 'accepted' AND auth.uid() IN (cr.user1_id, cr.user2_id)
UNION ALL
SELECT t.*, 'user2' as owner
FROM transactions t
INNER JOIN couple_relationships cr ON t.user_id = cr.user2_id
WHERE cr.status = 'accepted' AND auth.uid() IN (cr.user1_id, cr.user2_id);
```

**UI futura**:
- Toggle na `BottomNav`: "Meu" vs "Casal"
- Reutiliza todos os componentes existentes (apenas muda query)

### 8.2 Suporte a Ações, FIIs, Cripto

**Schema já preparado**:
```sql
-- Migration futura (010):
ALTER TYPE investment_type ADD VALUE 'acao';
ALTER TYPE investment_type ADD VALUE 'fii';
ALTER TYPE investment_type ADD VALUE 'cripto';

-- Adicionar campos específicos:
ALTER TABLE investments ADD COLUMN ticker TEXT; -- Ex: PETR4, HASH11
ALTER TABLE investments ADD COLUMN quantity NUMERIC(16,8); -- Quantidade de ações
ALTER TABLE investments ADD COLUMN current_price NUMERIC(12,2); -- Preço atual (atualizado via API)
```

**Hook futuro**:
```typescript
// lib/hooks/useStockPrices.ts
export function useStockPrices(tickers: string[]) {
  return useQuery({
    queryKey: ['stocks', tickers],
    queryFn: () => fetchStockPrices(tickers), // API B3 ou Yahoo Finance
    refetchInterval: 60 * 1000, // Atualiza a cada 1 min
  })
}
```

### 8.3 Real-time Subscriptions

**Supabase Realtime**:
```typescript
// lib/hooks/useTransactionsRealtime.ts (futuro)
export function useTransactionsRealtime(month: Date) {
  const queryClient = useQueryClient()
  
  useEffect(() => {
    const channel = supabase
      .channel('transactions')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'transactions',
        filter: `user_id=eq.${userId}`,
      }, (payload) => {
        queryClient.invalidateQueries(['transactions'])
      })
      .subscribe()
    
    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId, queryClient])
  
  return useTransactions(month)
}
```

**Caso de uso**: Se usuário tiver o app aberto em dois dispositivos, mudanças em um refletem no outro instantaneamente

### 8.4 Offline Support (PWA)

**Service Worker strategy** (futuro):
```typescript
// public/sw.js (gerado por next-pwa)
workbox.routing.registerRoute(
  /^https:\/\/.*\.supabase\.co\/rest\/v1\/transactions/,
  new workbox.strategies.NetworkFirst({
    cacheName: 'transactions-cache',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 7 * 24 * 60 * 60, // 1 semana
      }),
    ],
  })
)
```

**Background Sync**:
```typescript
// Futuro: fila de mutations offline
if ('serviceWorker' in navigator && 'SyncManager' in window) {
  navigator.serviceWorker.ready.then((registration) => {
    return registration.sync.register('sync-transactions')
  })
}
```

---

## 9. Segurança

### 9.1 Camadas de Segurança

```
┌─────────────────────────────────────────┐
│  Camada 1: HTTPS (Vercel)               │ ← Man-in-the-middle protection
├─────────────────────────────────────────┤
│  Camada 2: Google OAuth                 │ ← Authentication
├─────────────────────────────────────────┤
│  Camada 3: JWT Tokens (Supabase Auth)   │ ← Authorization (stateless)
├─────────────────────────────────────────┤
│  Camada 4: Middleware (Next.js)         │ ← Session validation + refresh
├─────────────────────────────────────────┤
│  Camada 5: RLS (PostgreSQL)             │ ← Data isolation (database level)
├─────────────────────────────────────────┤
│  Camada 6: Input Validation (Zod)       │ ← Injection prevention
└─────────────────────────────────────────┘
```

### 9.2 RLS como Última Linha de Defesa

**Mesmo se o middleware falhar**, RLS garante que:
```typescript
// Se um atacante tentar:
const { data } = await supabase
  .from('transactions')
  .select('*')
  .eq('user_id', 'victim-user-id') // Tentativa de acessar dados de outro user

// RLS irá automaticamente adicionar WHERE auth.uid() = user_id
// Resultado: data = [] (vazio)
```

**Nunca desabilitar RLS**, mesmo em desenvolvimento:
```sql
-- ❌ NUNCA fazer isso:
ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;

-- ✅ Se precisar testar com service_role, fazer via Edge Function:
-- supabase/functions/admin-tool/index.ts (com auth admin)
```

### 9.3 Proteção contra SQL Injection

**Supabase JS Client já sanitiza queries**:
```typescript
// Seguro (parametrizado automaticamente):
supabase
  .from('transactions')
  .select('*')
  .eq('description', userInput) // userInput é escapado

// ❌ Nunca fazer raw SQL com input do usuário:
supabase.rpc('raw_query', { sql: `SELECT * FROM transactions WHERE description = '${userInput}'` })
```

### 9.4 CSRF Protection

**Next.js + Supabase já protegem**:
- JWT em HttpOnly cookie (não acessível via JavaScript)
- SameSite=Lax (cookies não enviados em requests cross-origin)

---

## 10. Monitoramento e Debugging

### 10.1 TanStack Query DevTools

```typescript
// app/layout.tsx (apenas dev)
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AppProviders>
          {children}
          {process.env.NODE_ENV === 'development' && (
            <ReactQueryDevtools initialIsOpen={false} />
          )}
        </AppProviders>
      </body>
    </html>
  )
}
```

**Recursos**:
- Ver cache em tempo real
- Inspecionar queries ativas
- Invalidar cache manualmente
- Ver network requests

### 10.2 Vercel Analytics

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

**Métricas coletadas** (free tier):
- Page views
- TTFB (Time to First Byte)
- FCP (First Contentful Paint)
- LCP (Largest Contentful Paint)

### 10.3 Error Boundary

```typescript
// components/ErrorBoundary.tsx (futuro)
'use client'

export class ErrorBoundary extends Component {
  state = { hasError: false }
  
  static getDerivedStateFromError(error) {
    return { hasError: true }
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Error caught:', error, errorInfo)
    // Futuro: enviar para Sentry
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback onReset={() => this.setState({ hasError: false })} />
    }
    
    return this.props.children
  }
}
```

---

## 11. Testes (Estratégia Futura)

### 11.1 Pirâmide de Testes

```
          ┌───────┐
          │  E2E  │  ← 10% (Playwright: fluxos críticos)
          └───┬───┘
         ┌────┴────┐
         │ Integration│ ← 30% (hooks + API routes)
         └────┬─────┘
      ┌───────┴────────┐
      │  Unit Tests    │ ← 60% (utils + components puros)
      └────────────────┘
```

### 11.2 Testes de Hooks (Jest + React Testing Library)

```typescript
// lib/hooks/__tests__/useTransactions.test.ts
import { renderHook, waitFor } from '@testing-library/react'
import { useTransactions } from '../useTransactions'

describe('useTransactions', () => {
  it('retorna transações do mês correto', async () => {
    const { result } = renderHook(() => useTransactions(new Date('2025-07-01')))
    
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    
    expect(result.current.data).toHaveLength(5)
    expect(result.current.data[0].date).toMatch(/^2025-07/)
  })
})
```

### 11.3 Testes E2E (Playwright)

```typescript
// e2e/transaction-flow.spec.ts
import { test, expect } from '@playwright/test'

test('criar transação e ver na lista', async ({ page }) => {
  await page.goto('/login')
  await page.click('button:has-text("Entrar com Google")')
  
  // Mock OAuth (via Playwright)
  await page.waitForURL('/dashboard')
  
  await page.goto('/transacoes')
  await page.click('button[aria-label="Nova transação"]')
  
  await page.fill('input[name="description"]', 'Teste E2E')
  await page.fill('input[name="amount"]', '100')
  await page.click('button:has-text("Salvar")')
  
  await expect(page.locator('text=Teste E2E')).toBeVisible()
})
```

---

## 12. Conclusão

Esta arquitetura foi projetada para:
- **Simplicidade**: Fácil de entender e manter
- **Performance**: Cache agressivo + SSR + code splitting
- **Segurança**: RLS + JWT + validação em camadas
- **Escalabilidade**: Padrões que suportam crescimento
- **DX (Developer Experience)**: TypeScript strict + DevTools + hot reload

**Next steps** para evolução:
1. Implementar error boundaries
2. Adicionar testes unitários (coverage > 80%)
3. Implementar offline support (Service Worker)
4. Adicionar Sentry para error tracking
5. Implementar real-time subscriptions
6. Adicionar dashboard consolidado do casal

---

**Referências**:
- [Next.js App Router Docs](https://nextjs.org/docs/app)
- [Supabase RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [TanStack Query Best Practices](https://tanstack.com/query/latest/docs/react/guides/queries)
- [Vercel Performance Docs](https://vercel.com/docs/concepts/analytics)
