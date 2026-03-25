# Feature: Autenticação e Sessão

**Status:** 🔄 Em desenvolvimento  
**Prioridade:** 🔴 CRÍTICA  
**Sprint:** Sprint 0 - Setup e Infraestrutura  
**Tasks relacionadas:** TASK-002, TASK-003  
**Estimativa:** 2-3 dias

---

## 1. Visão Geral

Sistema completo de autenticação usando **Google OAuth via Supabase Auth**, com middleware de proteção de rotas, refresh automático de sessão e geração de categorias padrão no primeiro login.

### Objetivos
- ✅ Login sem senha (Google OAuth)
- ✅ Sessão persistente com refresh automático
- ✅ Proteção de rotas autenticadas
- ✅ Geração de categorias padrão no primeiro login
- ✅ Geração de transações recorrentes ao fazer login
- ✅ Logout com limpeza completa de sessão

### Fluxo de Autenticação

```
┌─────────────┐
│   Usuário   │
│ não logado  │
└──────┬──────┘
       │
       ├─ Acessa rota protegida (/dashboard)
       │  └─> Middleware detecta ausência de sessão
       │      └─> Redireciona para /login
       │
       ├─ Página /login
       │  └─> Clica em "Entrar com Google"
       │      └─> Supabase Auth inicia OAuth flow
       │          └─> Redireciona para Google
       │              └─> Usuário autoriza
       │                  └─> Google redireciona para /auth/callback
       │                      └─> Callback processa tokens
       │                          ├─> Se novo usuário:
       │                          │   └─> Trigger SQL cria categorias padrão
       │                          │
       │                          └─> RPC: generate_recurring_transactions()
       │                              └─> Toast: "X recorrências lançadas"
       │                                  └─> Redireciona para /dashboard
       │
       └─ Dashboard (logado)
          └─> Middleware valida sessão em cada request
              ├─> Se sessão expirada: refresh automático
              └─> Se refresh falhar: redireciona para /login
```

---

## 2. Requisitos Funcionais

### RF-001: Login com Google OAuth
- **Descrição:** Usuário deve poder fazer login usando conta Google
- **Regras de negócio:**
  - Apenas OAuth do Google habilitado (sem email/senha)
  - Redirecionar para `/dashboard` após login bem-sucedido
  - Se erro no OAuth, exibir mensagem amigável e manter na tela de login

### RF-002: Criação de Categorias Padrão
- **Descrição:** No primeiro login, criar automaticamente categorias padrão para o usuário
- **Regras de negócio:**
  - Trigger SQL dispara automaticamente ao inserir usuário em `auth.users`
  - Criar 11 categorias (8 despesas, 2 receitas, 1 investimento)
  - Categorias marcadas como `is_default = true`

### RF-003: Geração de Transações Recorrentes
- **Descrição:** Ao fazer login, gerar transações do mês atual para recorrências ativas
- **Regras de negócio:**
  - Chamar RPC `generate_recurring_transactions(user_id)` após callback
  - Gerar apenas para recorrências que não foram geradas no mês atual
  - Exibir toast com quantidade de transações geradas (ex: "2 recorrências lançadas para março")
  - Se count = 0, não exibir toast

### RF-004: Middleware de Proteção de Rotas
- **Descrição:** Proteger todas as rotas do grupo `(app)` contra acesso não autenticado
- **Regras de negócio:**
  - Rotas protegidas: `/dashboard`, `/transacoes`, `/metas`, `/investimentos`, `/configuracoes`
  - Rotas públicas: `/login`, `/api/bcb-proxy`
  - Se sessão inválida ou ausente: redirecionar para `/login`
  - Se sessão expirada: tentar refresh automático antes de redirecionar

### RF-005: Logout
- **Descrição:** Usuário deve poder sair da aplicação com limpeza completa de sessão
- **Regras de negócio:**
  - Chamar `supabase.auth.signOut()`
  - Limpar cookies e tokens
  - Redirecionar para `/login`
  - Invalidar cache do TanStack Query

### RF-006: Persistência de Sessão
- **Descrição:** Sessão deve persistir entre reloads e abas do navegador
- **Regras de negócio:**
  - Usar `localStorage` para persistir tokens
  - Refresh automático antes da expiração (tokens do Supabase expiram em 1h)
  - Se refresh falhar, redirecionar para login

---

## 3. User Stories

### 🎯 US-001: Primeiro Acesso
**Como** novo usuário  
**Quero** fazer login com minha conta Google  
**Para** começar a usar o app sem precisar criar senha

**Cenário:** Primeiro login bem-sucedido
```gherkin
Dado que sou um novo usuário
Quando acesso /login
E clico em "Entrar com Google"
E autorizo o aplicativo no Google
Então sou redirecionado para /dashboard
E vejo minhas categorias padrão criadas
E vejo mensagem de boas-vindas
```

**Cenário:** Categorias padrão criadas
```gherkin
Dado que acabei de fazer meu primeiro login
Quando acesso a página de nova transação
E abro o select de categorias
Então vejo 8 categorias de despesa
E vejo 2 categorias de receita
E vejo 1 categoria de investimento
E todas têm ícones atribuídos
```

---

### 🎯 US-002: Login Recorrente
**Como** usuário recorrente  
**Quero** fazer login e ter minhas transações recorrentes geradas automaticamente  
**Para** não precisar lançá-las manualmente todo mês

**Cenário:** Login com recorrências pendentes
```gherkin
Dado que tenho 2 recorrências ativas
E não acessei o app no mês atual
Quando faço login
Então vejo toast "2 recorrências lançadas para março"
E vejo as 2 transações na lista do mês atual
E cada uma tem badge "Recorrente"
```

**Cenário:** Login sem recorrências pendentes
```gherkin
Dado que já acessei o app neste mês
Quando faço login novamente
Então não vejo toast de recorrências
E não são criadas transações duplicadas
```

---

### 🎯 US-003: Proteção de Rotas
**Como** sistema  
**Quero** proteger rotas autenticadas  
**Para** garantir que apenas usuários logados acessem seus dados

**Cenário:** Acesso sem login
```gherkin
Dado que não estou logado
Quando tento acessar /dashboard
Então sou redirecionado para /login
E a URL de origem é preservada
Quando faço login com sucesso
Então sou redirecionado para /dashboard
```

**Cenário:** Sessão expirada
```gherkin
Dado que estou logado
E minha sessão expirou (após 1h)
Quando navego para qualquer página protegida
Então o middleware tenta refresh automático
E se refresh bem-sucedido, carrego a página
E se refresh falhar, sou redirecionado para /login
```

---

### 🎯 US-004: Logout
**Como** usuário logado  
**Quero** sair da aplicação  
**Para** proteger meus dados em dispositivos compartilhados

**Cenário:** Logout bem-sucedido
```gherkin
Dado que estou logado
Quando clico no botão "Sair" nas configurações
Então vejo AlertDialog "Tem certeza que deseja sair?"
Quando confirmo
Então minha sessão é encerrada
E sou redirecionado para /login
E não consigo acessar rotas protegidas sem fazer login novamente
```

---

## 4. Schema de Dados

### Tabela: `auth.users` (gerenciada pelo Supabase)
```sql
-- Estrutura simplificada (gerenciada pelo Supabase Auth)
CREATE TABLE auth.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  -- Outros campos gerenciados pelo Supabase
);
```

### Tabela: `categories`
```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('expense', 'income', 'investment')),
  icon TEXT,                        -- nome do ícone (ex: "utensils")
  color TEXT,                       -- hex color (ex: "#FF5733")
  is_default BOOLEAN DEFAULT false, -- categorias padrão do sistema
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS obrigatório
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_data" ON categories
  FOR ALL USING (auth.uid() = user_id);

CREATE INDEX idx_categories_user_id ON categories(user_id);
```

### Categorias Padrão (criadas pelo trigger)
| name | type | icon | color |
|------|------|------|-------|
| Alimentação | expense | utensils | #FF6B6B |
| Moradia | expense | home | #4ECDC4 |
| Transporte | expense | car | #45B7D1 |
| Saúde | expense | heart-pulse | #96CEB4 |
| Lazer | expense | gamepad-2 | #FFEAA7 |
| Roupas | expense | shirt | #DFE6E9 |
| Viagens | expense | plane | #74B9FF |
| Assinaturas | expense | repeat | #A29BFE |
| Salário | income | wallet | #00B894 |
| Freelance | income | briefcase | #FDCB6E |
| Renda fixa | investment | landmark | #6C5CE7 |

### Trigger: Criar Categorias no Primeiro Login
```sql
CREATE OR REPLACE FUNCTION create_default_categories()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO categories (user_id, name, type, icon, color, is_default) VALUES
    (NEW.id, 'Alimentação', 'expense', 'utensils', '#FF6B6B', true),
    (NEW.id, 'Moradia', 'expense', 'home', '#4ECDC4', true),
    (NEW.id, 'Transporte', 'expense', 'car', '#45B7D1', true),
    (NEW.id, 'Saúde', 'expense', 'heart-pulse', '#96CEB4', true),
    (NEW.id, 'Lazer', 'expense', 'gamepad-2', '#FFEAA7', true),
    (NEW.id, 'Roupas', 'expense', 'shirt', '#DFE6E9', true),
    (NEW.id, 'Viagens', 'expense', 'plane', '#74B9FF', true),
    (NEW.id, 'Assinaturas', 'expense', 'repeat', '#A29BFE', true),
    (NEW.id, 'Salário', 'income', 'wallet', '#00B894', true),
    (NEW.id, 'Freelance', 'income', 'briefcase', '#FDCB6E', true),
    (NEW.id, 'Renda fixa', 'investment', 'landmark', '#6C5CE7', true);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_default_categories();
```

---

## 5. Componentes React

### 5.1 Página de Login
**Arquivo:** `app/(auth)/login/page.tsx`

```typescript
import { createBrowserClient } from '@supabase/ssr'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Chrome } from 'lucide-react'

export default function LoginPage() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      console.error('Erro ao fazer login:', error)
      // TODO: Exibir toast de erro
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary">
            <span className="text-3xl">💰</span>
          </div>
          <CardTitle className="text-2xl">Finanças</CardTitle>
          <CardDescription>
            Controle financeiro pessoal simples e eficiente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleGoogleLogin}
            className="w-full"
            size="lg"
            variant="outline"
          >
            <Chrome className="mr-2 h-5 w-5" />
            Entrar com Google
          </Button>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Ao continuar, você concorda com nossos Termos de Uso
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
```

---

### 5.2 Callback OAuth
**Arquivo:** `app/auth/callback/route.ts`

```typescript
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    )

    await supabase.auth.exchangeCodeForSession(code)

    // Obter user_id para gerar recorrências
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      // Gerar transações recorrentes do mês atual
      const { data: count, error } = await supabase.rpc('generate_recurring_transactions', {
        p_user_id: user.id,
      })

      // Redirecionar com informação de recorrências geradas
      const redirectUrl = new URL('/dashboard', requestUrl.origin)
      if (count && count > 0) {
        redirectUrl.searchParams.set('recurring_generated', count.toString())
      }
      return NextResponse.redirect(redirectUrl)
    }
  }

  // Em caso de erro, redirecionar para login
  return NextResponse.redirect(new URL('/login', requestUrl.origin))
}
```

---

### 5.3 Middleware de Proteção
**Arquivo:** `middleware.ts`

```typescript
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Tentar refresh da sessão
  const { data: { session }, error } = await supabase.auth.getSession()

  // Rotas públicas
  const publicRoutes = ['/login', '/auth/callback']
  const isPublicRoute = publicRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )

  // Se não há sessão e rota é protegida, redirecionar para login
  if (!session && !isPublicRoute) {
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Se há sessão e está na página de login, redirecionar para dashboard
  if (session && request.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}
```

---

### 5.4 Botão de Logout
**Arquivo:** `components/auth/LogoutButton.tsx`

```typescript
'use client'

import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { LogOut } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'

export function LogoutButton() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleLogout = async () => {
    // Limpar cache do React Query
    queryClient.clear()

    // Fazer logout no Supabase
    await supabase.auth.signOut()

    // Redirecionar para login
    router.push('/login')
    router.refresh()
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-start">
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Tem certeza que deseja sair?</AlertDialogTitle>
          <AlertDialogDescription>
            Você precisará fazer login novamente para acessar o aplicativo.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleLogout}>Sair</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
```

---

## 6. Hooks e Utilities

### 6.1 Hook useUser
**Arquivo:** `lib/hooks/useUser.ts`

```typescript
'use client'

import { createBrowserClient } from '@supabase/ssr'
import { useQuery } from '@tanstack/react-query'
import type { User } from '@supabase/supabase-js'

export function useUser() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  return useQuery({
    queryKey: ['user'],
    queryFn: async (): Promise<User | null> => {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) throw error
      return user
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  })
}
```

---

### 6.2 Supabase Clients
**Arquivo:** `lib/supabase/client.ts`

```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

**Arquivo:** `lib/supabase/server.ts`

```typescript
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )
}
```

---

## 7. Validações e Regras de Negócio

### RN-001: Unicidade de Email
- **Regra:** Cada email pode ter apenas uma conta
- **Validação:** Gerenciada pelo Supabase Auth
- **Erro:** "Usuário já existe"

### RN-002: Categorias Padrão Únicas
- **Regra:** Trigger deve criar categorias apenas uma vez por usuário
- **Validação:** Trigger dispara apenas no INSERT de novo usuário
- **Garantia:** Primary key em `auth.users(id)` garante unicidade

### RN-003: RLS em Categorias
- **Regra:** Usuário só acessa suas próprias categorias
- **Validação:** Policy SQL `auth.uid() = user_id`
- **Erro se violado:** 403 Forbidden (Supabase)

### RN-004: Recorrências Únicas no Mês
- **Regra:** Não gerar transação recorrente duas vezes no mesmo mês
- **Validação:** Função SQL verifica `last_generated_month < current_month`
- **Garantia:** Campo `last_generated_month` atualizado após geração

---

## 8. Estados de UI

### Estado: Login
```typescript
type LoginState = 
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success' } // Redireciona imediatamente
```

**Renderização:**
- `idle`: Botão "Entrar com Google" habilitado
- `loading`: Botão desabilitado, spinner, texto "Conectando..."
- `error`: Toast de erro com mensagem
- `success`: Redireciona para /dashboard

---

### Estado: Middleware
```typescript
type MiddlewareState =
  | { authenticated: true; user: User }
  | { authenticated: false; redirectTo: string }
  | { authenticated: 'refreshing' } // Tentando refresh
```

**Comportamento:**
- `authenticated: true`: Permite acesso à rota
- `authenticated: false`: Redireciona para /login
- `authenticated: 'refreshing'`: Aguarda refresh antes de decidir

---

### Estado: Logout
```typescript
type LogoutState = 
  | { status: 'idle' }
  | { status: 'confirming' } // AlertDialog aberto
  | { status: 'loading' }    // Fazendo logout
  | { status: 'success' }    // Redireciona
```

**Renderização:**
- `idle`: Botão "Sair" habilitado
- `confirming`: AlertDialog aberto
- `loading`: Dialog fechado, spinner global
- `success`: Redireciona para /login

---

## 9. Edge Cases e Tratamento de Erros

### EC-001: OAuth cancelado pelo usuário
**Cenário:** Usuário fecha popup do Google antes de autorizar  
**Comportamento:** Supabase retorna erro, usuário permanece em /login  
**Tratamento:** Não exibir erro (comportamento esperado), permitir nova tentativa

---

### EC-002: Token expirado durante navegação
**Cenário:** Usuário deixa aba aberta por mais de 1h  
**Comportamento:** Middleware tenta refresh automático  
**Tratamento:**
- Se refresh bem-sucedido: continua navegação
- Se refresh falhar: redireciona para /login com mensagem "Sessão expirada"

---

### EC-003: Erro ao criar categorias padrão
**Cenário:** Trigger falha ao inserir categorias (ex: violação de constraint)  
**Comportamento:** Usuário faz login, mas não tem categorias  
**Tratamento:**
- No dashboard, verificar se há categorias
- Se vazio, exibir botão "Criar categorias padrão" que chama função SQL manualmente

---

### EC-004: Erro ao gerar recorrências
**Cenário:** RPC `generate_recurring_transactions` falha  
**Comportamento:** Login funciona, mas recorrências não são geradas  
**Tratamento:**
- Não bloquear login
- Log de erro no console
- Exibir toast: "Não foi possível gerar recorrências. Tente novamente mais tarde."
- Adicionar botão em Configurações para gerar manualmente

---

### EC-005: Múltiplas abas abertas
**Cenário:** Usuário faz logout em uma aba  
**Comportamento:** Outras abas ainda têm tokens em memória  
**Tratamento:**
- Supabase emite evento `SIGNED_OUT`
- Escutar evento com `supabase.auth.onAuthStateChange()`
- Ao detectar logout, redirecionar todas as abas para /login

```typescript
supabase.auth.onAuthStateChange((event) => {
  if (event === 'SIGNED_OUT') {
    window.location.href = '/login'
  }
})
```

---

### EC-006: Rede offline durante login
**Cenário:** Usuário tenta fazer login sem conexão  
**Comportamento:** Fetch para Google OAuth falha  
**Tratamento:**
- Exibir toast: "Sem conexão com a internet"
- Manter botão habilitado para nova tentativa

---

## 10. Queries Supabase

### Query: Verificar se usuário tem categorias
```typescript
const { data: categories, count } = await supabase
  .from('categories')
  .select('id', { count: 'exact', head: true })
  .eq('user_id', userId)

if (count === 0) {
  // Usuário não tem categorias, algo deu errado no trigger
  // Exibir opção de criar manualmente
}
```

---

### Query: Gerar recorrências (RPC)
```typescript
const { data: count, error } = await supabase.rpc('generate_recurring_transactions', {
  p_user_id: userId,
})

if (error) {
  console.error('Erro ao gerar recorrências:', error)
  // Exibir toast de erro
} else if (count > 0) {
  toast({
    title: `${count} recorrências lançadas para ${format(new Date(), 'MMMM', { locale: ptBR })}`,
  })
}
```

---

### Query: Obter usuário logado (Server Component)
```typescript
import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  return <div>Olá, {user.email}</div>
}
```

---

## 11. Testes Sugeridos

### Teste Unitário: Trigger de Categorias
```sql
-- Testar se trigger cria 11 categorias ao inserir usuário
BEGIN;
  -- Inserir usuário de teste
  INSERT INTO auth.users (id, email) VALUES 
    ('550e8400-e29b-41d4-a716-446655440000', 'test@example.com');

  -- Verificar se 11 categorias foram criadas
  SELECT COUNT(*) FROM categories WHERE user_id = '550e8400-e29b-41d4-a716-446655440000';
  -- Esperado: 11

  -- Verificar se todas têm is_default = true
  SELECT COUNT(*) FROM categories 
  WHERE user_id = '550e8400-e29b-41d4-a716-446655440000' AND is_default = true;
  -- Esperado: 11

ROLLBACK;
```

---

### Teste E2E: Fluxo completo de login
```typescript
// Usando Playwright ou Cypress
test('Fluxo completo de primeiro login', async ({ page }) => {
  // 1. Acessar app sem login
  await page.goto('/dashboard')
  await expect(page).toHaveURL(/\/login/)

  // 2. Clicar em "Entrar com Google"
  await page.click('text=Entrar com Google')
  
  // 3. (Mock do OAuth) Simular retorno com code
  await page.goto('/auth/callback?code=mock_code')

  // 4. Verificar redirecionamento para dashboard
  await expect(page).toHaveURL('/dashboard')

  // 5. Verificar se categorias foram criadas
  await page.goto('/transacoes/nova')
  await page.click('[data-testid="category-select"]')
  const categories = await page.locator('[role="option"]').count()
  expect(categories).toBeGreaterThanOrEqual(11)
})
```

---

### Teste E2E: Middleware protege rotas
```typescript
test('Middleware redireciona usuário não autenticado', async ({ page, context }) => {
  // Limpar cookies para simular usuário não logado
  await context.clearCookies()

  // Tentar acessar rota protegida
  await page.goto('/dashboard')

  // Verificar redirecionamento para login
  await expect(page).toHaveURL(/\/login/)

  // Verificar que query param de redirect foi adicionado
  expect(page.url()).toContain('redirect=%2Fdashboard')
})
```

---

### Teste E2E: Logout funciona corretamente
```typescript
test('Logout limpa sessão e redireciona', async ({ page }) => {
  // Fazer login (assumindo helper de login)
  await login(page, 'test@example.com')

  // Navegar para configurações
  await page.goto('/configuracoes')

  // Clicar em "Sair"
  await page.click('text=Sair')

  // Confirmar no AlertDialog
  await page.click('text=Sair', { force: true }) // Botão de confirmação

  // Verificar redirecionamento para login
  await expect(page).toHaveURL('/login')

  // Tentar acessar rota protegida
  await page.goto('/dashboard')

  // Verificar que permanece em login (não logado)
  await expect(page).toHaveURL(/\/login/)
})
```

---

### Teste de Integração: RPC de recorrências
```typescript
test('Gerar recorrências ao fazer login', async ({ page }) => {
  // Criar recorrência de teste via API
  await createRecurringTransaction({
    description: 'Aluguel',
    amount: 1500,
    day_of_month: 5,
  })

  // Fazer logout e login novamente (para disparar RPC)
  await logout(page)
  await login(page)

  // Verificar toast de confirmação
  await expect(page.locator('text=1 recorrências lançadas')).toBeVisible()

  // Navegar para transações do mês atual
  await page.goto('/transacoes')

  // Verificar se transação foi criada
  await expect(page.locator('text=Aluguel')).toBeVisible()
  await expect(page.locator('[data-badge="Recorrente"]')).toBeVisible()
})
```

---

## 12. Links para Tasks de Implementação

- **TASK-002:** Configurar Supabase (migrations, Auth, RLS)
- **TASK-003:** Autenticação com Google (login, callback, middleware, logout)

---

## 13. Checklist de Implementação

### Setup Inicial
- [ ] Criar projeto no Supabase Dashboard
- [ ] Executar migration 001 (categories)
- [ ] Executar migration 007 (trigger de categorias)
- [ ] Habilitar Google OAuth no Supabase Dashboard
- [ ] Configurar URLs de redirect (localhost + produção)
- [ ] Adicionar variáveis de ambiente (.env.local)

### Código
- [ ] Criar `lib/supabase/client.ts`
- [ ] Criar `lib/supabase/server.ts`
- [ ] Criar página `app/(auth)/login/page.tsx`
- [ ] Criar rota `app/auth/callback/route.ts`
- [ ] Criar `middleware.ts`
- [ ] Criar componente `LogoutButton.tsx`
- [ ] Criar hook `useUser.ts`

### Testes
- [ ] Testar login com Google em localhost
- [ ] Testar criação de categorias no primeiro login
- [ ] Testar proteção de rotas (acesso sem login)
- [ ] Testar refresh automático de sessão
- [ ] Testar logout e limpeza de sessão
- [ ] Testar geração de recorrências ao fazer login

### Deploy
- [ ] Configurar variáveis de ambiente na Vercel
- [ ] Adicionar URL de produção no Supabase Auth
- [ ] Testar login em produção
- [ ] Verificar HTTPS e cookies funcionando

---

**Última atualização:** Março 2026  
**Responsável:** Squad de Autenticação  
**Revisores:** Tech Lead, Product Owner
