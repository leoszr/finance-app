# Feature: Transações e Recorrências

**Status:** 🔄 Em desenvolvimento  
**Prioridade:** 🔴 CRÍTICA  
**Sprint:** Sprint 1 - Transações  
**Tasks relacionadas:** TASK-007, TASK-008, TASK-009, TASK-010  
**Estimativa:** 5-7 dias

---

## 1. Visão Geral

Sistema completo de gerenciamento de transações financeiras (receitas e despesas) com suporte a:
- **CRUD completo** de transações manuais
- **Categorização** com ícones e cores
- **Recorrências** automáticas (despesas e receitas fixas mensais)
- **Filtros** por mês, categoria, tipo
- **Agrupamento** por data na visualização
- **Isolamento** total por usuário via RLS

### Objetivos
- ✅ Criar, editar, visualizar e excluir transações
- ✅ Categorizar todas as transações
- ✅ Gerenciar recorrências (gastos fixos mensais)
- ✅ Gerar automaticamente transações recorrentes ao virar o mês
- ✅ Visualizar histórico completo com filtros
- ✅ Calcular resumos (receitas, despesas, saldo) do mês

---

## 2. Requisitos Funcionais

### RF-001: Criar Transação Manual
- **Descrição:** Usuário pode criar nova transação (receita ou despesa)
- **Regras de negócio:**
  - Campos obrigatórios: tipo, valor, descrição, categoria, data
  - Valor deve ser > 0 (sempre positivo)
  - Descrição máximo 100 caracteres
  - Data não pode ser mais de 2 anos no passado
  - Categoria deve ser do tipo correspondente (expense ou income)

### RF-002: Editar Transação
- **Descrição:** Usuário pode editar transações existentes
- **Regras de negócio:**
  - Não permitir editar transações geradas por recorrência (apenas excluir e recriar)
  - Atualizar `updated_at` automaticamente
  - Validações iguais à criação

### RF-003: Excluir Transação
- **Descrição:** Usuário pode excluir transações
- **Regras de negócio:**
  - Exibir confirmação antes de excluir
  - Transações recorrentes podem ser excluídas (não afeta a recorrência original)
  - Exclusão é permanente (sem soft delete no MVP)

### RF-004: Listar Transações do Mês
- **Descrição:** Visualizar todas as transações de um mês específico
- **Regras de negócio:**
  - Ordenar por data DESC (mais recentes primeiro)
  - Agrupar por data (Hoje, Ontem, 12 de março, etc.)
  - Incluir dados da categoria (nome, ícone, cor) via JOIN
  - Filtrar apenas pelo `user_id` do usuário logado

### RF-005: Calcular Resumo do Mês
- **Descrição:** Exibir cards de resumo (receitas, despesas, saldo)
- **Regras de negócio:**
  - Total de receitas = SUM(amount) WHERE type = 'income'
  - Total de despesas = SUM(amount) WHERE type = 'expense'
  - Saldo = receitas - despesas
  - Saldo positivo = verde, negativo = vermelho

### RF-006: Gerenciar Recorrências
- **Descrição:** CRUD de despesas e receitas recorrentes (fixas mensais)
- **Regras de negócio:**
  - Dia do mês: 1-28 (para evitar problemas com fevereiro)
  - Recorrência inativa não gera novas transações
  - Excluir recorrência não exclui transações já geradas
  - Editar recorrência não afeta transações já geradas

### RF-007: Gerar Transações Recorrentes Automaticamente
- **Descrição:** Ao fazer login ou virar o mês, gerar transações do mês atual
- **Regras de negócio:**
  - Gerar apenas se `last_generated_month < current_month`
  - Data da transação = dia especificado na recorrência
  - Marcar transação com `is_recurring = true` e `recurring_id`
  - Atualizar `last_generated_month` após gerar
  - Não gerar duplicatas

---

## 3. User Stories

### 🎯 US-001: Criar Transação Rápida
**Como** usuário  
**Quero** lançar uma despesa rapidamente pelo celular  
**Para** manter meu controle financeiro em dia

**Cenário:** Criar despesa simples
```gherkin
Dado que estou na página de transações
Quando clico no botão "+"
E seleciono tipo "Despesa"
E digito valor "R$ 45,00"
E digito descrição "Almoço"
E seleciono categoria "Alimentação"
E seleciono data "Hoje"
E clico em "Salvar"
Então vejo toast "Transação criada com sucesso"
E vejo a transação na lista
E vejo o saldo atualizado
```

**Cenário:** Validação de campos obrigatórios
```gherkin
Dado que estou no formulário de nova transação
Quando deixo o campo "Descrição" vazio
E tento salvar
Então vejo erro "Descrição obrigatória" abaixo do campo
E o botão "Salvar" fica desabilitado
```

---

### 🎯 US-002: Editar Transação
**Como** usuário  
**Quero** corrigir informações de uma transação  
**Para** manter meus dados precisos

**Cenário:** Editar descrição e valor
```gherkin
Dado que tenho uma transação "Supermercado - R$ 150,00"
Quando clico na transação para editar
E altero descrição para "Supermercado Extra"
E altero valor para "R$ 165,50"
E clico em "Salvar"
Então vejo toast "Transação atualizada"
E vejo as novas informações na lista
E vejo o saldo recalculado
```

**Cenário:** Bloquear edição de recorrente
```gherkin
Dado que tenho uma transação gerada por recorrência
Quando clico nela para editar
Então vejo mensagem "Transações recorrentes não podem ser editadas"
E vejo botão "Excluir esta transação"
E vejo link "Editar recorrência original"
```

---

### 🎯 US-003: Visualizar Histórico por Mês
**Como** usuário  
**Quero** navegar entre meses  
**Para** acompanhar meu histórico financeiro

**Cenário:** Navegar para mês anterior
```gherkin
Dado que estou vendo transações de Março/2026
Quando clico na seta esquerda no cabeçalho
Então vejo transações de Fevereiro/2026
E vejo resumo atualizado (receitas, despesas, saldo)
E a URL muda para /transacoes?mes=2026-02
```

**Cenário:** Estado vazio
```gherkin
Dado que estou em Janeiro/2026
E não tenho transações neste mês
Quando carrego a página
Então vejo ilustração de estado vazio
E vejo texto "Nenhuma transação em janeiro"
E vejo botão "Adicionar primeira transação"
```

---

### 🎯 US-004: Configurar Recorrências
**Como** usuário  
**Quero** cadastrar minhas despesas fixas mensais  
**Para** não precisar lançá-las manualmente todo mês

**Cenário:** Criar recorrência (aluguel)
```gherkin
Dado que estou em Configurações > Recorrências
Quando clico em "Nova recorrência"
E seleciono tipo "Despesa"
E digito descrição "Aluguel"
E digito valor "R$ 1.500,00"
E seleciono categoria "Moradia"
E seleciono dia "5"
E clico em "Salvar"
Então vejo a recorrência na lista
E vejo status "Ativa"
E vejo próxima geração "05/abr/2026"
```

**Cenário:** Geração automática no próximo mês
```gherkin
Dado que tenho recorrência "Aluguel" configurada para dia 5
E estamos em 01/abril/2026
Quando faço login
Então vejo toast "1 recorrências lançadas para abril"
E vejo transação "Aluguel - R$ 1.500,00" com data 05/04/2026
E vejo badge "Recorrente" na transação
```

---

### 🎯 US-005: Excluir Transação
**Como** usuário  
**Quero** remover uma transação lançada por engano  
**Para** manter meus dados corretos

**Cenário:** Excluir com confirmação
```gherkin
Dado que tenho transação "Teste - R$ 10,00"
Quando faço swipe left na transação (ou long press)
E clico em "Excluir"
Então vejo AlertDialog "Tem certeza que deseja excluir?"
Quando confirmo
Então vejo toast "Transação excluída"
E a transação desaparece da lista
E o saldo é recalculado
```

---

## 4. Schema de Dados

### Tabela: `transactions`
```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  type TEXT NOT NULL CHECK (type IN ('expense', 'income')),
  amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  description TEXT NOT NULL,
  date DATE NOT NULL,
  notes TEXT,
  is_recurring BOOLEAN DEFAULT false,
  recurring_id UUID,                -- referência ao registro de recorrência
  source TEXT CHECK (source IN ('manual', 'csv_nubank', 'recurring')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS obrigatório
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_data" ON transactions
  FOR ALL USING (auth.uid() = user_id);

-- Índices para performance
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_transactions_user_month ON transactions(user_id, date_trunc('month', date));
CREATE INDEX idx_transactions_category ON transactions(category_id);
```

**Campos:**
- `id`: UUID único da transação
- `user_id`: Referência ao usuário (RLS)
- `category_id`: Categoria da transação (ON DELETE RESTRICT para evitar órfãos)
- `type`: 'expense' ou 'income'
- `amount`: Valor sempre positivo (formato: 12 dígitos, 2 decimais)
- `description`: Descrição curta (máx 100 chars)
- `date`: Data da transação (tipo DATE, sem hora)
- `notes`: Campo opcional para observações
- `is_recurring`: Flag para identificar transações geradas automaticamente
- `recurring_id`: UUID da recorrência que gerou esta transação (nullable)
- `source`: Origem da transação ('manual', 'csv_nubank', 'recurring')

---

### Tabela: `recurrents`
```sql
CREATE TABLE recurrents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  type TEXT NOT NULL CHECK (type IN ('expense', 'income')),
  amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  description TEXT NOT NULL,
  day_of_month INTEGER NOT NULL CHECK (day_of_month BETWEEN 1 AND 28),
  active BOOLEAN DEFAULT true,
  last_generated_month DATE,        -- último mês em que gerou transação (formato: YYYY-MM-01)
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS obrigatório
ALTER TABLE recurrents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_data" ON recurrents
  FOR ALL USING (auth.uid() = user_id);

CREATE INDEX idx_recurrents_user_id ON recurrents(user_id);
CREATE INDEX idx_recurrents_active ON recurrents(user_id, active);
```

**Campos:**
- `day_of_month`: Dia fixo do mês (1-28 para evitar problemas com fevereiro)
- `active`: Se false, não gera novas transações
- `last_generated_month`: Controle de duplicação (formato: '2026-03-01')

---

### Função SQL: Gerar Transações Recorrentes
```sql
CREATE OR REPLACE FUNCTION generate_recurring_transactions(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  rec RECORD;
  current_month DATE := date_trunc('month', CURRENT_DATE);
  count INTEGER := 0;
BEGIN
  FOR rec IN
    SELECT * FROM recurrents
    WHERE user_id = p_user_id
      AND active = true
      AND (last_generated_month IS NULL OR last_generated_month < current_month)
  LOOP
    -- Gerar transação do mês atual
    INSERT INTO transactions (
      user_id,
      category_id,
      type,
      amount,
      description,
      date,
      is_recurring,
      recurring_id,
      source
    ) VALUES (
      p_user_id,
      rec.category_id,
      rec.type,
      rec.amount,
      rec.description,
      (current_month + (rec.day_of_month - 1) * INTERVAL '1 day')::DATE,
      true,
      rec.id,
      'recurring'
    );

    -- Atualizar controle de geração
    UPDATE recurrents
    SET last_generated_month = current_month
    WHERE id = rec.id;

    count := count + 1;
  END LOOP;

  RETURN count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Lógica:**
1. Buscar todas as recorrências ativas do usuário que não foram geradas no mês atual
2. Para cada uma, inserir uma transação com data = dia especificado
3. Atualizar `last_generated_month` para evitar duplicação
4. Retornar quantidade de transações geradas

---

## 5. Componentes React

### 5.1 Página de Transações
**Arquivo:** `app/(app)/transacoes/page.tsx`

```typescript
'use client'

import { useState } from 'react'
import { format, startOfMonth, addMonths, subMonths } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useTransactions } from '@/lib/hooks/useTransactions'
import { TransactionList } from '@/components/transactions/TransactionList'
import { TransactionForm } from '@/components/forms/TransactionForm'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { formatCurrency } from '@/lib/utils/currency'

export default function TransactionsPage() {
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()))
  const [isFormOpen, setIsFormOpen] = useState(false)

  const { data, isLoading, error } = useTransactions(currentMonth)

  const summary = {
    income: data?.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0) || 0,
    expenses: data?.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0) || 0,
  }
  const balance = summary.income - summary.expenses

  const handlePrevMonth = () => setCurrentMonth(prev => subMonths(prev, 1))
  const handleNextMonth = () => setCurrentMonth(prev => addMonths(prev, 1))
  const isCurrentMonth = format(currentMonth, 'yyyy-MM') === format(new Date(), 'yyyy-MM')

  if (isLoading) {
    return <TransactionsSkeleton />
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
        <p className="text-muted-foreground mb-4">Erro ao carregar transações</p>
        <Button onClick={() => window.location.reload()}>Tentar novamente</Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Cabeçalho com navegação de mês */}
      <div className="sticky top-0 z-10 bg-background border-b p-4">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="icon" onClick={handlePrevMonth}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold capitalize">
            {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
          </h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNextMonth}
            disabled={isCurrentMonth}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Cards de resumo */}
        <div className="grid grid-cols-3 gap-2">
          <Card>
            <CardContent className="p-3">
              <p className="text-xs text-muted-foreground">Receitas</p>
              <p className="text-sm font-semibold text-green-600">
                {formatCurrency(summary.income)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <p className="text-xs text-muted-foreground">Despesas</p>
              <p className="text-sm font-semibold text-red-500">
                {formatCurrency(summary.expenses)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <p className="text-xs text-muted-foreground">Saldo</p>
              <p className={`text-sm font-semibold ${balance >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                {formatCurrency(balance)}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Lista de transações */}
      <div className="flex-1 overflow-y-auto pb-20">
        {data && data.length > 0 ? (
          <TransactionList transactions={data} />
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[300px] p-8">
            <p className="text-muted-foreground mb-4">
              Nenhuma transação em {format(currentMonth, 'MMMM', { locale: ptBR })}
            </p>
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar primeira transação
            </Button>
          </div>
        )}
      </div>

      {/* Botão flutuante para nova transação */}
      <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
        <SheetTrigger asChild>
          <Button
            size="icon"
            className="fixed bottom-20 right-4 h-14 w-14 rounded-full shadow-lg"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[90vh]">
          <TransactionForm onSuccess={() => setIsFormOpen(false)} />
        </SheetContent>
      </Sheet>
    </div>
  )
}
```

---

### 5.2 Formulário de Transação
**Arquivo:** `components/forms/TransactionForm.tsx`

```typescript
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useCategories } from '@/lib/hooks/useCategories'
import { useCreateTransaction } from '@/lib/hooks/useTransactions'
import { CurrencyInput } from '@/components/shared/CurrencyInput'
import { CategoryBadge } from '@/components/shared/CategoryBadge'
import { useToast } from '@/components/ui/use-toast'
import type { TransactionType } from '@/lib/types'

const formSchema = z.object({
  type: z.enum(['expense', 'income']),
  amount: z.number().positive('Valor deve ser maior que zero'),
  description: z.string().min(1, 'Descrição obrigatória').max(100, 'Máximo 100 caracteres'),
  category_id: z.string().uuid('Selecione uma categoria'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida'),
  notes: z.string().max(500, 'Máximo 500 caracteres').optional(),
})

type FormData = z.infer<typeof formSchema>

interface TransactionFormProps {
  onSuccess?: () => void
  defaultValues?: Partial<FormData>
}

export function TransactionForm({ onSuccess, defaultValues }: TransactionFormProps) {
  const { toast } = useToast()
  const { data: categories } = useCategories()
  const createTransaction = useCreateTransaction()

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: 'expense',
      date: format(new Date(), 'yyyy-MM-dd'),
      ...defaultValues,
    },
  })

  const selectedType = form.watch('type')
  const filteredCategories = categories?.filter(c => c.type === selectedType) || []

  const onSubmit = async (data: FormData) => {
    try {
      await createTransaction.mutateAsync({
        ...data,
        source: 'manual',
        is_recurring: false,
      })

      toast({
        title: 'Transação criada com sucesso',
      })

      form.reset()
      onSuccess?.()
    } catch (error) {
      toast({
        title: 'Erro ao criar transação',
        description: 'Tente novamente mais tarde',
        variant: 'destructive',
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-semibold">Nova Transação</h2>

        {/* Tipo (toggle) */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo</FormLabel>
              <FormControl>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant={field.value === 'expense' ? 'default' : 'outline'}
                    onClick={() => field.onChange('expense')}
                    className="w-full"
                  >
                    Despesa
                  </Button>
                  <Button
                    type="button"
                    variant={field.value === 'income' ? 'default' : 'outline'}
                    onClick={() => field.onChange('income')}
                    className="w-full"
                  >
                    Receita
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Valor */}
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor</FormLabel>
              <FormControl>
                <CurrencyInput
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="R$ 0,00"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Descrição */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ex: Supermercado" maxLength={100} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Categoria */}
        <FormField
          control={form.control}
          name="category_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoria</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {filteredCategories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      <CategoryBadge category={category} />
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Data */}
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Notas (opcional) */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notas (opcional)</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Observações adicionais"
                  maxLength={500}
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={createTransaction.isPending}
        >
          {createTransaction.isPending ? 'Salvando...' : 'Salvar transação'}
        </Button>
      </form>
    </Form>
  )
}
```

---

### 5.3 Lista de Transações
**Arquivo:** `components/transactions/TransactionList.tsx`

```typescript
'use client'

import { format, isToday, isYesterday, isSameDay } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Badge } from '@/components/ui/badge'
import { CategoryBadge } from '@/components/shared/CategoryBadge'
import { formatCurrency } from '@/lib/utils/currency'
import { TransactionActions } from './TransactionActions'
import type { Transaction } from '@/lib/types'

interface TransactionListProps {
  transactions: Transaction[]
}

export function TransactionList({ transactions }: TransactionListProps) {
  // Agrupar por data
  const groupedByDate = transactions.reduce((groups, transaction) => {
    const date = transaction.date
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(transaction)
    return groups
  }, {} as Record<string, Transaction[]>)

  const getDateLabel = (dateStr: string): string => {
    const date = new Date(dateStr)
    if (isToday(date)) return 'Hoje'
    if (isYesterday(date)) return 'Ontem'
    return format(date, 'd \'de\' MMMM', { locale: ptBR })
  }

  return (
    <div className="space-y-6 p-4">
      {Object.entries(groupedByDate).map(([date, items]) => (
        <div key={date}>
          <h3 className="text-sm font-medium text-muted-foreground mb-2 capitalize">
            {getDateLabel(date)}
          </h3>
          <div className="space-y-2">
            {items.map(transaction => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function TransactionItem({ transaction }: { transaction: Transaction }) {
  const isExpense = transaction.type === 'expense'

  return (
    <div className="flex items-center gap-3 p-3 bg-card rounded-lg border">
      <CategoryBadge category={transaction.category} size="lg" />
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium truncate">{transaction.description}</p>
          {transaction.is_recurring && (
            <Badge variant="secondary" className="text-xs">Recorrente</Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground">{transaction.category?.name}</p>
      </div>

      <div className="flex items-center gap-2">
        <p className={`font-semibold ${isExpense ? 'text-red-500' : 'text-green-600'}`}>
          {isExpense ? '-' : '+'} {formatCurrency(transaction.amount)}
        </p>
        <TransactionActions transaction={transaction} />
      </div>
    </div>
  )
}
```

---

## 6. Hooks

### Hook: `useTransactions`
**Arquivo:** `lib/hooks/useTransactions.ts`

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { createClient } from '@/lib/supabase/client'
import { useUser } from './useUser'
import type { Transaction } from '@/lib/types'

export function useTransactions(month: Date) {
  const { data: user } = useUser()
  const supabase = createClient()

  const monthKey = format(month, 'yyyy-MM')

  return useQuery({
    queryKey: ['transactions', user?.id, monthKey],
    queryFn: async (): Promise<Transaction[]> => {
      if (!user) throw new Error('User not authenticated')

      const startDate = format(month, 'yyyy-MM-01')
      const endDate = format(new Date(month.getFullYear(), month.getMonth() + 1, 0), 'yyyy-MM-dd')

      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          category:categories(*)
        `)
        .eq('user_id', user.id)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: false })
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as Transaction[]
    },
    enabled: !!user,
  })
}

export function useCreateTransaction() {
  const queryClient = useQueryClient()
  const { data: user } = useUser()
  const supabase = createClient()

  return useMutation({
    mutationFn: async (data: Omit<Transaction, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      if (!user) throw new Error('User not authenticated')

      const { data: transaction, error } = await supabase
        .from('transactions')
        .insert({
          ...data,
          user_id: user.id,
        })
        .select()
        .single()

      if (error) throw error
      return transaction
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Transaction> }) => {
      const { data: transaction, error } = await supabase
        .from('transactions')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return transaction
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}
```

---

## 7. Validações Zod

```typescript
// lib/schemas/transaction.ts
import { z } from 'zod'

export const transactionSchema = z.object({
  type: z.enum(['expense', 'income'], {
    errorMap: () => ({ message: 'Selecione o tipo de transação' }),
  }),
  amount: z
    .number({ required_error: 'Valor obrigatório' })
    .positive('Valor deve ser maior que zero')
    .max(999999999.99, 'Valor muito alto'),
  description: z
    .string()
    .min(1, 'Descrição obrigatória')
    .max(100, 'Descrição muito longa (máximo 100 caracteres)'),
  category_id: z.string().uuid('Selecione uma categoria válida'),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida')
    .refine(
      (date) => {
        const parsed = new Date(date)
        const twoYearsAgo = new Date()
        twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2)
        return parsed >= twoYearsAgo
      },
      { message: 'Data não pode ser mais de 2 anos no passado' }
    ),
  notes: z.string().max(500, 'Notas muito longas (máximo 500 caracteres)').optional(),
})

export const recurrentSchema = z.object({
  type: z.enum(['expense', 'income']),
  amount: z.number().positive('Valor deve ser maior que zero'),
  description: z.string().min(1, 'Descrição obrigatória').max(100),
  category_id: z.string().uuid('Selecione uma categoria'),
  day_of_month: z
    .number()
    .int()
    .min(1, 'Dia deve ser entre 1 e 28')
    .max(28, 'Dia deve ser entre 1 e 28 (para evitar problemas com fevereiro)'),
  active: z.boolean().default(true),
})
```

---

## 8. Estados de UI

### Loading State
```typescript
function TransactionsSkeleton() {
  return (
    <div className="p-4 space-y-6">
      <div className="grid grid-cols-3 gap-2">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
      <div className="space-y-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    </div>
  )
}
```

### Error State
```typescript
function TransactionError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
      <p className="text-muted-foreground mb-4">Erro ao carregar transações</p>
      <Button onClick={onRetry}>Tentar novamente</Button>
    </div>
  )
}
```

### Empty State
```typescript
function EmptyTransactions({ month, onAdd }: { month: Date; onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] p-8">
      <div className="text-6xl mb-4">📊</div>
      <p className="text-lg font-medium mb-2">Nenhuma transação</p>
      <p className="text-muted-foreground mb-4">
        Comece adicionando sua primeira transação em {format(month, 'MMMM', { locale: ptBR })}
      </p>
      <Button onClick={onAdd}>
        <Plus className="mr-2 h-4 w-4" />
        Adicionar transação
      </Button>
    </div>
  )
}
```

---

## 9. Edge Cases

### EC-001: Categoria excluída
**Problema:** Usuário exclui categoria que tem transações associadas  
**Solução:** `ON DELETE RESTRICT` na FK impede exclusão  
**UI:** Exibir mensagem "Não é possível excluir categoria com transações. Altere as transações primeiro."

### EC-002: Recorrência desativada no meio do mês
**Problema:** Usuário desativa recorrência depois que transação já foi gerada  
**Solução:** Transação gerada permanece, próximos meses não geram mais  
**UI:** Badge "Recorrente" continua visível, mas próxima geração mostra "Desativada"

### EC-003: Editar transação recorrente
**Problema:** Usuário tenta editar transação gerada automaticamente  
**Solução:** Bloquear edição, permitir apenas exclusão  
**UI:** Exibir mensagem: "Transações recorrentes não podem ser editadas. Você pode excluir esta transação ou editar a recorrência original."

### EC-004: Valor negativo
**Problema:** Usuário tenta inserir valor negativo  
**Solução:** Input numérico com validação Zod bloqueia  
**UI:** Mensagem "Valor deve ser maior que zero"

### EC-005: Data futura muito distante
**Problema:** Usuário seleciona data no ano 2100  
**Solução:** Permitir (pode ser planejamento)  
**UI:** Sem bloqueio, mas exibir aviso "Você selecionou uma data muito no futuro"

---

## 10. Queries Supabase

### Buscar transações do mês com categorias
```typescript
const { data, error } = await supabase
  .from('transactions')
  .select(`
    *,
    category:categories(
      id,
      name,
      icon,
      color,
      type
    )
  `)
  .eq('user_id', userId)
  .gte('date', '2026-03-01')
  .lte('date', '2026-03-31')
  .order('date', { ascending: false })
  .order('created_at', { ascending: false })
```

### Criar transação
```typescript
const { data, error } = await supabase
  .from('transactions')
  .insert({
    user_id: userId,
    type: 'expense',
    amount: 150.00,
    description: 'Supermercado',
    category_id: 'uuid-here',
    date: '2026-03-15',
    source: 'manual',
  })
  .select()
  .single()
```

### Buscar recorrências ativas
```typescript
const { data, error } = await supabase
  .from('recurrents')
  .select(`
    *,
    category:categories(*)
  `)
  .eq('user_id', userId)
  .eq('active', true)
  .order('day_of_month', { ascending: true })
```

### Gerar transações recorrentes (RPC)
```typescript
const { data: count, error } = await supabase.rpc('generate_recurring_transactions', {
  p_user_id: userId,
})

console.log(`${count} transações geradas`)
```

---

## 11. Testes Sugeridos

### Teste: Criar transação
```typescript
test('Criar transação manual com sucesso', async () => {
  const { data: transaction } = await supabase
    .from('transactions')
    .insert({
      user_id: testUserId,
      type: 'expense',
      amount: 50,
      description: 'Café',
      category_id: categoryId,
      date: '2026-03-15',
      source: 'manual',
    })
    .select()
    .single()

  expect(transaction.amount).toBe(50)
  expect(transaction.description).toBe('Café')
})
```

### Teste E2E: Fluxo completo
```typescript
test('Criar, editar e excluir transação', async ({ page }) => {
  await page.goto('/transacoes')
  await page.click('[data-testid="add-transaction"]')
  await page.fill('[name="description"]', 'Teste')
  await page.fill('[name="amount"]', '100')
  await page.selectOption('[name="category_id"]', categoryId)
  await page.click('button[type="submit"]')

  await expect(page.locator('text=Teste')).toBeVisible()
  await expect(page.locator('text=R$ 100,00')).toBeVisible()
})
```

---

## 12. Links para Tasks

- **TASK-007:** Hook `useTransactions`
- **TASK-008:** Formulário de nova transação
- **TASK-009:** Página de transações
- **TASK-010:** Recorrências

---

**Última atualização:** Março 2026
