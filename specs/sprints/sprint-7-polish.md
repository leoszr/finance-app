# Sprint 7 — Polimento e Testes

**Objetivo:** Resumo semanal por e-mail, tratamento completo de erros e testes finais de qualidade.  
**Estimativa:** 3–4 dias  
**Status:** 🔴 Não iniciado  
**Tasks:** TASK-028, TASK-029, TASK-030

---

## Visão Geral

Esta sprint final foca em polimento, qualidade e experiência do usuário:
- Resumo semanal automático por e-mail
- Estados de loading e erro em todas as telas
- Testes de fumaça (smoke tests) dos fluxos críticos

Ao final, o aplicativo estará pronto para lançamento com alta qualidade e experiência refinada.

---

## TASK-028: Resumo semanal por e-mail

**Descrição expandida:**  
Criar Supabase Edge Function para enviar resumo semanal automático por e-mail toda segunda-feira às 9h BRT.

### Arquivos a criar/modificar

```
├── supabase/functions/weekly-summary/
│   ├── index.ts                   (Edge Function)
│   └── deno.json                  (config)
```

### Código exemplo

#### `supabase/functions/weekly-summary/index.ts`
```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

/**
 * Edge Function: Resumo Semanal
 * 
 * Dispara toda segunda-feira às 9h BRT (12:00 UTC)
 * 
 * Envia e-mail com:
 * - Total gasto na semana
 * - Top 3 categorias de gasto
 * - Progresso dos orçamentos do mês
 * 
 * Trigger: pg_cron
 * Schedule: 0 12 * * 1 (segunda-feira 12:00 UTC = 9h BRT)
 */

interface Env {
  SUPABASE_URL: string
  SUPABASE_SERVICE_ROLE_KEY: string
  RESEND_API_KEY: string
}

serve(async (req) => {
  try {
    const env = Deno.env.toObject() as Env

    // Criar cliente Supabase (service role para acessar todos os usuários)
    const supabase = createClient(
      env.SUPABASE_URL,
      env.SUPABASE_SERVICE_ROLE_KEY
    )

    // Calcular período (últimos 7 dias)
    const today = new Date()
    const sevenDaysAgo = new Date(today)
    sevenDaysAgo.setDate(today.getDate() - 7)

    const startDate = sevenDaysAgo.toISOString().split('T')[0]
    const endDate = today.toISOString().split('T')[0]

    // Buscar todos os usuários
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers()

    if (usersError) {
      console.error('Erro ao buscar usuários:', usersError)
      return new Response(JSON.stringify({ error: 'Failed to fetch users' }), {
        status: 500,
      })
    }

    console.log(`Processando ${users.users.length} usuários`)

    // Processar cada usuário
    for (const user of users.users) {
      try {
        // Buscar transações da semana
        const { data: transactions, error: transError } = await supabase
          .from('transactions')
          .select('*, category:categories(name)')
          .eq('user_id', user.id)
          .eq('type', 'expense')
          .gte('date', startDate)
          .lte('date', endDate)

        if (transError) {
          console.error(`Erro ao buscar transações do usuário ${user.id}:`, transError)
          continue
        }

        // Se não houver transações, não enviar e-mail
        if (!transactions || transactions.length === 0) {
          console.log(`Usuário ${user.email} não tem transações esta semana`)
          continue
        }

        // Calcular total gasto
        const totalSpent = transactions.reduce(
          (sum, t) => sum + Number(t.amount),
          0
        )

        // Top 3 categorias
        const categoryTotals = new Map<string, number>()
        transactions.forEach((t) => {
          const categoryName = t.category?.name || 'Sem categoria'
          const current = categoryTotals.get(categoryName) || 0
          categoryTotals.set(categoryName, current + Number(t.amount))
        })

        const topCategories = Array.from(categoryTotals.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([name, total]) => ({
            name,
            total,
            percentage: (total / totalSpent) * 100,
          }))

        // Buscar orçamentos do mês (para progresso)
        const currentMonth = today.toISOString().substring(0, 7) + '-01'
        const { data: budgets } = await supabase
          .from('budgets')
          .select('*, category:categories(name)')
          .eq('user_id', user.id)
          .eq('month', currentMonth)

        // Calcular progresso dos orçamentos
        const budgetProgress = budgets || []

        // Gerar HTML do e-mail
        const emailHTML = generateEmailHTML({
          userName: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuário',
          totalSpent,
          topCategories,
          budgetProgress,
          weekStart: startDate,
          weekEnd: endDate,
        })

        // Enviar e-mail via Resend
        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${env.RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: 'Finanças <noreply@seudominio.com>',
            to: user.email,
            subject: 'Seu resumo financeiro semanal',
            html: emailHTML,
          }),
        })

        if (!emailResponse.ok) {
          console.error(`Erro ao enviar e-mail para ${user.email}:`, await emailResponse.text())
          continue
        }

        console.log(`E-mail enviado para ${user.email}`)
      } catch (error) {
        console.error(`Erro ao processar usuário ${user.email}:`, error)
        continue
      }
    }

    return new Response(
      JSON.stringify({ success: true, usersProcessed: users.users.length }),
      { status: 200 }
    )
  } catch (error) {
    console.error('Erro geral:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
    })
  }
})

/**
 * Gerar HTML do e-mail
 */
function generateEmailHTML(data: {
  userName: string
  totalSpent: number
  topCategories: Array<{ name: string; total: number; percentage: number }>
  budgetProgress: any[]
  weekStart: string
  weekEnd: string
}): string {
  const { userName, totalSpent, topCategories, weekStart, weekEnd } = data

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Resumo Semanal</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f9fafb;
    }
    .container {
      background-color: white;
      border-radius: 8px;
      padding: 30px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    h1 {
      color: #16a34a;
      margin-top: 0;
    }
    .summary-card {
      background-color: #f3f4f6;
      border-radius: 6px;
      padding: 20px;
      margin: 20px 0;
    }
    .amount {
      font-size: 32px;
      font-weight: bold;
      color: #16a34a;
    }
    .category {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #e5e7eb;
    }
    .category:last-child {
      border-bottom: none;
    }
    .btn {
      display: inline-block;
      background-color: #16a34a;
      color: white;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 6px;
      margin-top: 20px;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      font-size: 12px;
      color: #6b7280;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Olá, ${userName}!</h1>
    <p>Aqui está o resumo dos seus gastos de ${formatDate(weekStart)} a ${formatDate(weekEnd)}.</p>
    
    <div class="summary-card">
      <p style="margin: 0; color: #6b7280; font-size: 14px;">Total gasto na semana</p>
      <div class="amount">R$ ${totalSpent.toFixed(2).replace('.', ',')}</div>
    </div>

    <h2 style="margin-top: 30px;">Top 3 Categorias</h2>
    ${topCategories
      .map(
        (cat) => `
      <div class="category">
        <span><strong>${cat.name}</strong></span>
        <span>R$ ${cat.total.toFixed(2).replace('.', ',')} (${cat.percentage.toFixed(0)}%)</span>
      </div>
    `
      )
      .join('')}

    <a href="https://seu-app.vercel.app/dashboard" class="btn">Ver detalhes no app</a>

    <div class="footer">
      <p>Você está recebendo este e-mail porque tem uma conta ativa no app Finanças.</p>
      <p>Para cancelar, acesse Configurações no app.</p>
    </div>
  </div>
</body>
</html>
  `
}

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-')
  return `${day}/${month}/${year}`
}
```

#### Configurar pg_cron no Supabase

```sql
-- No SQL Editor do Supabase, executar:

SELECT cron.schedule(
  'weekly-summary',             -- nome do job
  '0 12 * * 1',                 -- cron: segunda 12:00 UTC (9h BRT)
  $$
    SELECT
      net.http_post(
        url:='https://seu-projeto.supabase.co/functions/v1/weekly-summary',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb
      ) AS request_id;
  $$
);
```

### Passos de implementação

1. **Criar Edge Function:**
   ```bash
   supabase functions new weekly-summary
   ```

2. **Configurar Resend:**
   - Criar conta em https://resend.com (gratuita)
   - Obter API Key
   - Adicionar em Supabase → Settings → Secrets: `RESEND_API_KEY`

3. **Deploy da função:**
   ```bash
   supabase functions deploy weekly-summary
   ```

4. **Configurar pg_cron:**
   - Executar SQL acima no Supabase Dashboard

5. **Testar manualmente:**
   ```bash
   curl -X POST https://seu-projeto.supabase.co/functions/v1/weekly-summary \
     -H "Authorization: Bearer YOUR_ANON_KEY"
   ```

### Critérios de aceitação

- [ ] E-mail enviado toda segunda-feira às ~9h BRT
- [ ] E-mail responsivo (mobile-friendly)
- [ ] Conteúdo correto (total, top 3, progresso)
- [ ] Se usuário não tem transações na semana, e-mail não é enviado
- [ ] Link no e-mail abre o app direto no dashboard
- [ ] E-mails não vão para spam (verificar com teste real)

### Possíveis desafios/edge cases

- **Timezone:** Certificar que 12:00 UTC = 9h BRT (considerando horário de verão)
- **Rate limiting:** Resend free tier: 3.000 e-mails/mês. Suficiente para 2 usuários.
- **E-mail não chega:** Verificar se domínio está configurado no Resend (SPF, DKIM)

### Dependências

- Sprint 0 completa (Supabase configurado)

### Tempo estimado

**3–4 horas** (incluindo configuração do Resend e testes)

---

## TASK-029: Estados de loading e erro globais

**Descrição expandida:**  
Garantir que todas as telas têm skeleton loaders, tratamento de erro com retry e toasts de feedback.

### Checklist de implementação

#### Loading States
- [ ] Dashboard: skeleton em vez de spinner
- [ ] Transações: skeleton da lista
- [ ] Metas: skeleton dos cards
- [ ] Investimentos: skeleton do portfólio
- [ ] Gráficos: placeholder cinza enquanto carrega

#### Error States
- [ ] Todas as queries TanStack Query expõem `error` e `isError`
- [ ] Componente ErrorMessage com botão "Tentar novamente"
- [ ] Erro de rede recuperável sem reload de página
- [ ] Mensagens de erro em português

#### Feedback de Sucesso
- [ ] Toast após criar transação
- [ ] Toast após editar transação
- [ ] Toast após excluir transação
- [ ] Toast após criar orçamento/meta
- [ ] Toast após importar CSV
- [ ] Toast após exportar PDF/Excel

#### Confirmações Destrutivas
- [ ] AlertDialog antes de excluir transação
- [ ] AlertDialog antes de excluir orçamento
- [ ] AlertDialog antes de excluir meta
- [ ] AlertDialog antes de excluir investimento
- [ ] Nunca usar `window.confirm()`

### Código exemplo

#### `components/shared/ErrorMessage.tsx`
```typescript
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

interface ErrorMessageProps {
  message?: string
  onRetry?: () => void
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-red-200 bg-red-50 p-8 text-center dark:border-red-900 dark:bg-red-950">
      <AlertCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
      <h3 className="mt-4 font-semibold text-red-900 dark:text-red-100">
        Erro ao carregar dados
      </h3>
      <p className="mt-2 text-sm text-red-700 dark:text-red-300">
        {message || 'Não foi possível carregar as informações. Tente novamente.'}
      </p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" className="mt-4">
          Tentar novamente
        </Button>
      )}
    </div>
  )
}
```

#### Exemplo de uso
```typescript
const { data, isLoading, error, refetch } = useTransactions({ month })

if (isLoading) return <TransactionsSkeleton />
if (error) return <ErrorMessage onRetry={refetch} />

return <TransactionList data={data} />
```

### Critérios de aceitação

- [ ] Nenhuma tela exibe tela em branco durante loading
- [ ] Erros de rede são recuperáveis sem reload
- [ ] Todos os toasts têm duração de 4s
- [ ] Toasts podem ser fechados manualmente
- [ ] AlertDialog em todas as ações destrutivas
- [ ] Mensagens de erro são claras e em português

### Dependências

- Todas as sprints anteriores

### Tempo estimado

**4–5 horas** (revisar todas as páginas)

---

## TASK-030: Testes de fumaça (smoke tests) end-to-end

**Descrição expandida:**  
Verificar manualmente os fluxos críticos do aplicativo antes do lançamento.

### Fluxos a testar

#### 1. Autenticação
- [ ] Login com Google funciona
- [ ] Após login, categorias padrão são criadas
- [ ] Dashboard carrega com dados do usuário
- [ ] Logout destrói sessão
- [ ] Após logout, não consegue acessar rotas protegidas

#### 2. Transações
- [ ] Criar transação manual (receita e despesa)
- [ ] Transação aparece na lista imediatamente
- [ ] Saldo atualizado corretamente
- [ ] Editar transação
- [ ] Excluir transação (com confirmação)
- [ ] Navegar entre meses

#### 3. Import CSV
- [ ] Upload de CSV do Nubank funciona
- [ ] Pré-visualização mostra transações
- [ ] Atribuir categorias
- [ ] Importar 50+ transações
- [ ] Transações aparecem na lista

#### 4. Orçamentos
- [ ] Criar orçamento para categoria
- [ ] Gastar acima do limite
- [ ] Barra fica vermelha
- [ ] Alerta visual aparece

#### 5. Metas
- [ ] Criar meta de economia mensal
- [ ] Criar meta com prazo
- [ ] Adicionar valor à meta
- [ ] Progresso atualiza

#### 6. Investimentos
- [ ] Adicionar investimento
- [ ] Investimento aparece no portfólio
- [ ] Pie chart atualiza
- [ ] Calculadora funciona com taxa do BCB
- [ ] Gráfico de projeção renderiza

#### 7. Exportação
- [ ] Exportar PDF
- [ ] Arquivo baixado com nome correto
- [ ] PDF abre e exibe dados
- [ ] Exportar Excel
- [ ] Excel abre com 2 planilhas

#### 8. PWA
- [ ] App funciona no modo PWA instalado
- [ ] Ícone aparece na home screen
- [ ] Abre sem barra do navegador

### Dispositivos a testar

- [ ] Chrome Android (Pixel ou similar)
- [ ] Safari iOS (iPhone 12 ou superior)
- [ ] Chrome Desktop (1920x1080)
- [ ] Safari Desktop (macOS)

### Critérios de aceitação

- [ ] Todos os 8 fluxos funcionam sem erro no Chrome Android
- [ ] Todos os 8 fluxos funcionam no Safari iOS
- [ ] App funciona em modo PWA instalado
- [ ] Nenhum erro 500 ou quebra de layout
- [ ] Performance aceitável (< 3s para load inicial)

### Dependências

- Todas as sprints completas

### Tempo estimado

**2–3 horas** (testes manuais em múltiplos dispositivos)

---

## Resumo da Sprint 7

Ao completar esta sprint, o aplicativo terá:

✅ Resumo semanal automático por e-mail  
✅ Estados de loading e erro em todas as telas  
✅ Testes de fumaça passando em todos os fluxos  
✅ **Aplicativo pronto para lançamento!** 🚀  

---

**Última atualização:** Março 2026  
**Versão:** 1.0
