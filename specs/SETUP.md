# 🔧 Finance App - Guia de Setup

Este guia contém todas as instruções para configurar o ambiente de desenvolvimento do Finance App do zero.

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** 18.17 ou superior ([Download](https://nodejs.org/))
- **npm** 9 ou superior (vem com Node.js)
- **Git** ([Download](https://git-scm.com/))
- **Conta Google** (para testar OAuth)
- **Conta Supabase** (free tier) → [supabase.com](https://supabase.com)
- **Conta Vercel** (free tier, opcional para deploy) → [vercel.com](https://vercel.com)

### Verificar versões instaladas

```bash
node --version  # deve ser >= 18.17
npm --version   # deve ser >= 9
git --version
```

---

## 🚀 Passo 1: Clonar o Repositório

```bash
# Clone o repositório
git clone <URL_DO_REPOSITORIO>
cd finance-app

# Verifique se está na branch main
git branch
```

---

## 📦 Passo 2: Instalar Dependências

### 2.1 Inicializar projeto Next.js

Se o projeto ainda não foi inicializado, execute:

```bash
npx create-next-app@14 . --typescript --tailwind --app --no-src-dir
```

**Respostas sugeridas para o CLI:**
- ✔ Would you like to use ESLint? → **Yes**
- ✔ Would you like to use Turbopack? → **No** (opcional)
- ✔ Would you like to customize the default import alias? → **No**

### 2.2 Instalar todas as dependências

```bash
# Dependências principais
npm install @supabase/supabase-js@2 @supabase/ssr
npm install @tanstack/react-query@5
npm install zustand@4
npm install react-hook-form@7 @hookform/resolvers@3 zod@3
npm install date-fns@3
npm install recharts@2
npm install papaparse@5
npm install jspdf@2 jspdf-autotable@3
npm install xlsx@0.18

# Dependências de tipos
npm install -D @types/papaparse

# Instalar shadcn/ui
npx shadcn-ui@latest init
```

**Configuração do shadcn/ui:**
- ✔ Would you like to use TypeScript? → **Yes**
- ✔ Which style would you like to use? → **Default**
- ✔ Which color would you like to use as base color? → **Zinc**
- ✔ Where is your global CSS file? → **app/globals.css**
- ✔ Would you like to use CSS variables for colors? → **Yes**
- ✔ Where is your tailwind.config.js located? → **tailwind.config.ts**
- ✔ Configure the import alias for components? → **@/components**
- ✔ Configure the import alias for utils? → **@/lib/utils**

### 2.3 Instalar componentes shadcn/ui necessários

```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add select
npx shadcn-ui@latest add textarea
npx shadcn-ui@latest add form
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add sheet
npx shadcn-ui@latest add alert-dialog
npx shadcn-ui@latest add card
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add skeleton
npx shadcn-ui@latest add calendar
```

### 2.4 Instalar next-pwa (para PWA)

```bash
npm install next-pwa
```

---

## ⚙️ Passo 3: Configurar Arquivos de Configuração

### 3.1 Configurar TypeScript (tsconfig.json)

Certifique-se de que o `tsconfig.json` tem:

```json
{
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    },
    // ... outras opções
  }
}
```

### 3.2 Configurar ESLint (.eslintrc.json)

Adicione regras personalizadas se necessário:

```json
{
  "extends": "next/core-web-vitals",
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": "warn"
  }
}
```

### 3.3 Configurar Prettier (.prettierrc)

Crie o arquivo `.prettierrc`:

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```

### 3.4 Configurar next-pwa (next.config.js)

Crie ou edite `next.config.js`:

```javascript
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
})

module.exports = withPWA({
  // outras configurações Next.js
})
```

---

## 🗄️ Passo 4: Configurar Supabase

### 4.1 Criar projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Clique em "New Project"
3. Preencha:
   - **Name**: finance-app (ou outro nome)
   - **Database Password**: gere uma senha forte e **guarde-a**
   - **Region**: escolha a mais próxima (ex: South America - São Paulo)
   - **Pricing Plan**: Free

4. Aguarde ~2 minutos para o projeto ser criado

### 4.2 Executar Migrations

1. No dashboard do Supabase, vá para **SQL Editor**
2. Clique em **+ New Query**
3. Execute as migrations **na ordem abaixo**:

#### Migration 001 - Categorias

```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('expense', 'income', 'investment')),
  icon TEXT,
  color TEXT,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_data" ON categories FOR ALL USING (auth.uid() = user_id);
CREATE INDEX idx_categories_user_id ON categories(user_id);
```

#### Migration 002 - Transações

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
  recurring_id UUID,
  source TEXT CHECK (source IN ('manual', 'csv_nubank', 'recurring')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_data" ON transactions FOR ALL USING (auth.uid() = user_id);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_transactions_user_month ON transactions(user_id, date_trunc('month', date));
```

#### Migration 003 - Recorrências

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
  last_generated_month DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE recurrents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_data" ON recurrents FOR ALL USING (auth.uid() = user_id);
CREATE INDEX idx_recurrents_user_id ON recurrents(user_id);
```

#### Migration 004 - Orçamentos

```sql
CREATE TABLE budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  month DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, category_id, month)
);

ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_data" ON budgets FOR ALL USING (auth.uid() = user_id);
CREATE INDEX idx_budgets_user_month ON budgets(user_id, month);
```

#### Migration 005 - Metas

```sql
CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('monthly_savings', 'final_target')),
  target_amount NUMERIC(12,2) NOT NULL CHECK (target_amount > 0),
  current_amount NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (current_amount >= 0),
  deadline DATE,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_data" ON goals FOR ALL USING (auth.uid() = user_id);
CREATE INDEX idx_goals_user_id ON goals(user_id);
```

#### Migration 006 - Investimentos

```sql
CREATE TYPE investment_type AS ENUM (
  'cdb',
  'tesouro_direto',
  'lci',
  'lca',
  'poupanca',
  'outros_renda_fixa'
);

CREATE TABLE investments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type investment_type NOT NULL,
  institution TEXT NOT NULL,
  invested_amount NUMERIC(12,2) NOT NULL CHECK (invested_amount > 0),
  rate_type TEXT NOT NULL CHECK (rate_type IN ('fixed', 'cdi_pct', 'selic_pct', 'ipca_plus')),
  rate_value NUMERIC(8,4) NOT NULL,
  start_date DATE NOT NULL,
  maturity_date DATE,
  notes TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE investments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_data" ON investments FOR ALL USING (auth.uid() = user_id);
CREATE INDEX idx_investments_user_id ON investments(user_id);
```

#### Migration 007 - Trigger de Categorias Padrão

```sql
CREATE OR REPLACE FUNCTION create_default_categories()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO categories (user_id, name, type, icon, is_default) VALUES
    (NEW.id, 'Alimentação', 'expense', 'utensils', true),
    (NEW.id, 'Moradia', 'expense', 'home', true),
    (NEW.id, 'Transporte', 'expense', 'car', true),
    (NEW.id, 'Saúde', 'expense', 'heart-pulse', true),
    (NEW.id, 'Lazer', 'expense', 'gamepad-2', true),
    (NEW.id, 'Roupas', 'expense', 'shirt', true),
    (NEW.id, 'Viagens', 'expense', 'plane', true),
    (NEW.id, 'Assinaturas', 'expense', 'repeat', true),
    (NEW.id, 'Salário', 'income', 'wallet', true),
    (NEW.id, 'Freelance', 'income', 'briefcase', true),
    (NEW.id, 'Renda fixa', 'investment', 'landmark', true);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_default_categories();
```

#### Migration 008 - Função de Recorrências

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
    INSERT INTO transactions (
      user_id, category_id, type, amount, description, date, is_recurring, recurring_id, source
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

    UPDATE recurrents
    SET last_generated_month = current_month
    WHERE id = rec.id;

    count := count + 1;
  END LOOP;
  RETURN count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 4.3 Verificar RLS

Execute esta query para verificar que RLS está habilitado em todas as tabelas:

```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

Todas as tabelas devem ter `rowsecurity = true`.

### 4.4 Configurar Google OAuth

1. No dashboard do Supabase, vá para **Authentication** → **Providers**
2. Habilite **Google**
3. Você precisará criar um OAuth Client no Google Cloud Console:
   - Acesse [console.cloud.google.com](https://console.cloud.google.com)
   - Crie um novo projeto (ou use existente)
   - Vá para **APIs & Services** → **Credentials**
   - Clique em **Create Credentials** → **OAuth client ID**
   - Tipo: **Web application**
   - Authorized redirect URIs: copie a URL do Supabase (fornecida no dashboard)
4. Cole o **Client ID** e **Client Secret** no dashboard do Supabase
5. Em **Site URL**, adicione: `http://localhost:3000`
6. Em **Redirect URLs**, adicione: `http://localhost:3000/**`

### 4.5 Obter chaves do Supabase

1. No dashboard, vá para **Project Settings** → **API**
2. Copie:
   - **Project URL** (ex: `https://xxx.supabase.co`)
   - **anon/public key** (começa com `eyJ...`)

---

## 🔐 Passo 5: Configurar Variáveis de Ambiente

Crie o arquivo `.env.local` na raiz do projeto:

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **IMPORTANTE**: 
- Nunca commite o arquivo `.env.local` no Git
- Certifique-se de que `.env.local` está no `.gitignore`
- Use apenas a `anon key`, NUNCA a `service_role key` no cliente

---

## 🏗️ Passo 6: Criar Estrutura de Pastas

Execute o script abaixo ou crie manualmente as pastas:

```bash
mkdir -p app/{api/bcb-proxy,\(auth\)/login,\(app\)/{dashboard,transacoes/{nova,importar},metas,investimentos,configuracoes}}
mkdir -p components/{ui,charts,forms,layout,shared}
mkdir -p lib/{supabase,hooks,utils/{csv-parsers,export},types}
mkdir -p store
mkdir -p public/icons
```

---

## ▶️ Passo 7: Rodar o Projeto

```bash
# Modo desenvolvimento
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

**Você deve ver:**
- Página padrão do Next.js (se ainda não criou rotas)
- OU página de login (se já implementou TASK-003)

---

## ✅ Verificar Instalação

### Checklist de verificação:

- [ ] `npm run dev` inicia sem erros
- [ ] `npm run build` compila sem erros
- [ ] TypeScript strict mode ativo (`tsconfig.json`)
- [ ] shadcn/ui instalado (pasta `components/ui` existe)
- [ ] Supabase projeto criado e migrations executadas
- [ ] Google OAuth configurado no Supabase
- [ ] Variáveis de ambiente configuradas em `.env.local`
- [ ] Estrutura de pastas criada conforme specs
- [ ] ESLint e Prettier configurados

### Testar conexão com Supabase

Crie um arquivo temporário `test-supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function test() {
  const { data, error } = await supabase.auth.getSession()
  console.log('Supabase conectado:', error ? 'ERRO' : 'OK')
  console.log(data)
}

test()
```

Execute: `npx tsx test-supabase.ts`

---

## 🐛 Troubleshooting

### Erro: "Module not found"

```bash
# Limpe node_modules e reinstale
rm -rf node_modules package-lock.json
npm install
```

### Erro: TypeScript não reconhece alias @/

Verifique `tsconfig.json`:
- `"baseUrl": "."` está definido?
- `"paths": { "@/*": ["./*"] }` está correto?

Reinicie o servidor: `Ctrl+C` e `npm run dev`

### Erro: Supabase "Invalid API key"

- Verifique se copiou a chave completa (sem espaços extras)
- Confirme que está usando `NEXT_PUBLIC_SUPABASE_ANON_KEY`, não `service_role`
- Reinicie o servidor após alterar `.env.local`

### Erro: Google OAuth não funciona

- Certifique-se de que a URL de redirect está correta no Google Cloud Console
- Verifique se o Client ID e Secret estão corretos no Supabase
- Limpe cookies e tente novamente em aba anônima

### Erro: RLS policy violation

- Certifique-se de que está autenticado (tem sessão válida)
- Verifique se as policies foram criadas corretamente
- Execute as queries de verificação da seção 4.3

---

## 📚 Próximos Passos

Agora que o ambiente está configurado:

1. **Leia o [PROGRESS.md](./PROGRESS.md)** para ver as tasks disponíveis
2. **Comece pela Sprint 0** → [sprint-0-setup.md](./sprints/sprint-0-setup.md)
3. **Primeira task**: [TASK-001 - Inicializar repositório Next.js](./sprints/sprint-0-setup.md#task-001)
4. **Consulte [AGENTS.md](../AGENTS.md)** para guidelines de código

---

## 🔗 Links Úteis

- [Next.js 14 Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [shadcn/ui Docs](https://ui.shadcn.com)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Recharts Docs](https://recharts.org)

---

**Precisa de ajuda?** Consulte a [documentação completa nas specs](./README.md) ou abra uma issue no repositório.
