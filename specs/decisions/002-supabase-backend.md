# ADR 002: Supabase como Backend Completo

**Status:** Aceito  
**Data:** Março de 2026  
**Decisores:** Equipe de Arquitetura  

---

## Contexto

O projeto Finance App precisa de uma solução backend que forneça:

1. **Banco de dados relacional**: PostgreSQL para transações financeiras, orçamentos, metas
2. **Autenticação segura**: OAuth com Google, gestão de sessões, refresh tokens
3. **Row Level Security (RLS)**: Isolamento total de dados entre os dois usuários
4. **API REST/GraphQL**: Acesso aos dados sem escrever backend
5. **Storage**: Upload de arquivos CSV (importação Nubank)
6. **Edge Functions**: Serverless functions para lógica customizada
7. **Real-time (futuro)**: Sincronização instantânea entre dispositivos

### Requisitos de Segurança

- **Isolamento de dados**: Cada usuário acessa APENAS seus próprios dados
- **Sem SQL injection**: Prepared statements automáticos
- **HTTPS obrigatório**: Todas as conexões criptografadas
- **Token refresh**: Sessões longas sem re-login frequente

### Constraints de Custo

- **Budget zero**: Usar apenas free tier
- **Supabase Free Tier**:
  - 500MB database storage
  - 5GB bandwidth/mês
  - 50MB file storage
  - 2 CPU cores
  - Pausado após 7 dias de inatividade (retoma automaticamente)

### Requisitos Técnicos

- TypeScript SDK com tipos automáticos
- Migrations versionadas (SQL)
- Suporte a triggers e stored procedures
- Backup automático (point-in-time recovery em planos pagos, mas não necessário em MVP)

---

## Decisão

**Adotar Supabase como solução backend all-in-one, incluindo PostgreSQL, Auth, Storage e Edge Functions.**

### Implementação

1. **Banco de dados**: PostgreSQL 15 com extensões habilitadas (`uuid-ossp`, `pgcrypto`)
2. **Autenticação**: Supabase Auth com Google OAuth provider
3. **SDK**: `@supabase/supabase-js@2` + `@supabase/ssr` para Next.js App Router
4. **Migrations**: Arquivos SQL versionados em `/supabase/migrations/`
5. **RLS**: Habilitado em todas as tabelas com políticas `auth.uid() = user_id`
6. **Edge Functions**: Deno runtime para lógica serverless (ex: resumo semanal)

### Estrutura

```typescript
// lib/supabase/client.ts - Browser client
import { createBrowserClient } from '@supabase/ssr'

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// lib/supabase/server.ts - Server client
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const createClient = () => {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies }
  )
}
```

### Exemplo de RLS

```sql
-- Todas as tabelas seguem este padrão:
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_data" ON transactions
  FOR ALL USING (auth.uid() = user_id);

-- Índices para performance:
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_user_month ON transactions(user_id, date_trunc('month', date));
```

---

## Consequências

### Positivas

1. **Zero backend code**:
   - Não precisamos escrever API REST/GraphQL manualmente
   - SDK gera tipos TypeScript automaticamente (via CLI)
   - Reduz em ~70% o código backend comparado a Node.js custom

2. **Segurança nativa**:
   - RLS garante isolamento de dados no nível do banco
   - Não é possível acessar dados de outro usuário, mesmo com token vazado
   - Policies SQL são imutáveis (não podem ser bypassadas pelo client)
   - Rate limiting automático no free tier

3. **PostgreSQL completo**:
   - ACID transactions
   - Foreign keys, triggers, stored procedures
   - JSON/JSONB support
   - Full-text search nativo
   - Índices compostos para queries complexas

4. **Auth simplificado**:
   - Google OAuth em 5 linhas de código
   - Refresh token automático (SDK gerencia)
   - Session management com cookies httpOnly
   - Email confirmation (se adicionar login por email futuramente)

5. **Developer Experience**:
   - Supabase Studio (UI web para gerenciar dados)
   - SQL Editor com autocomplete
   - Logs de queries em tempo real
   - Database branching (preview environments)

6. **Escalabilidade**:
   - Migração para plano pago é transparente (sem code changes)
   - Pro plan: $25/mês, 8GB database, 250GB bandwidth
   - Connection pooling automático (PgBouncer)

7. **Integração com Next.js**:
   - `@supabase/ssr` foi feito especificamente para App Router
   - Middleware nativo para refresh de sessão
   - Server Components podem acessar Supabase com segurança

### Negativas

1. **Vendor lock-in**:
   - Migrar para outro backend requer reescrever toda a camada de dados
   - RLS policies são específicas do PostgreSQL
   - Edge Functions usam Deno (não Node.js)
   - **Mitigação**: Supabase é open source, pode ser self-hosted

2. **Limitações do free tier**:
   - 500MB database (suficiente para ~100k transações)
   - Pausa após 7 dias de inatividade (retoma em ~2s)
   - Sem point-in-time recovery (backups manuais apenas)
   - **Mitigação**: Monitorar uso, upgrade para Pro se necessário

3. **Cold starts**:
   - Primeira query após inatividade: ~2-3s
   - Edge Functions: ~200ms cold start
   - **Mitigação**: Keep-alive request diário via cron job (Vercel Cron)

4. **Complexidade de RLS**:
   - Policies SQL podem ser difíceis de debugar
   - Erros de RLS retornam "zero rows" (não erro explícito)
   - **Mitigação**: Testar policies com `SET ROLE` no SQL Editor

5. **TypeScript types**:
   - Types gerados precisam ser atualizados manualmente (`npx supabase gen types`)
   - Mudanças no schema requerem regenerar types
   - **Mitigação**: Adicionar script no package.json (`npm run types`)

### Trade-offs Aceitos

- **Vendor lock-in vs Velocidade**: Aceitamos lock-in em troca de 70% menos código backend
- **Free tier limits vs Custo**: Aceitamos 500MB database em troca de custo zero
- **Cold starts vs Simplicidade**: Aceitamos 2-3s de latência após inatividade em troca de não gerenciar infraestrutura

---

## Alternativas Consideradas

### 1. Firebase (Google)

**Descrição**: Backend-as-a-Service do Google com Firestore (NoSQL)

**Prós**:
- Integração nativa com Google (OAuth, Analytics, Cloud Functions)
- Real-time nativo (WebSocket)
- Generous free tier (1GB storage, 50k reads/day)
- SDKs maduros para web/mobile

**Contras**:
- **Firestore é NoSQL** (ruim para dados relacionais complexos)
- Queries limitadas (sem JOINs, agregações complexas)
- Security Rules são menos poderosas que RLS
- Pricing imprevisível (cobrado por operação)
- Vendor lock-in maior que Supabase (não é open source)

**Por que foi rejeitado**: Dados financeiros são altamente relacionais (transações → categorias, orçamentos → categorias, etc.). NoSQL força denormalização e duplicação de dados.

---

### 2. AWS Amplify

**Descrição**: Framework full-stack da AWS com AppSync (GraphQL)

**Prós**:
- Ecossistema AWS completo (S3, Lambda, Cognito)
- GraphQL nativo (AppSync)
- Escalabilidade infinita
- CDN global (CloudFront)

**Contras**:
- **Complexidade brutal** (CloudFormation, IAM policies)
- Free tier confuso (cobrado por múltiplos serviços)
- Cognito Auth é complicado (comparado a Supabase Auth)
- DX ruim (CLI lento, logs difíceis de acessar)
- Lock-in AWS extremo

**Por que foi rejeitado**: Complexidade desnecessária para MVP. AWS é overkill para 2 usuários.

---

### 3. PlanetScale + Auth0 + Vercel Functions

**Descrição**: Solução modular com serviços especializados

**Prós**:
- PlanetScale: MySQL serverless excelente (branching, zero downtime migrations)
- Auth0: Auth enterprise-grade
- Vercel Functions: Já estamos na Vercel
- Cada serviço é melhor-na-categoria

**Contras**:
- **3 serviços separados** (mais complexo de gerenciar)
- Auth0 free tier: apenas 7k usuários ativos/mês (MAS temos 2 usuários!)
- PlanetScale free tier foi descontinuado (agora $29/mês mínimo)
- Precisamos escrever API routes manualmente (sem SDK automático)
- Sem RLS nativo (precisamos implementar auth em cada endpoint)

**Por que foi rejeitado**: PlanetScale não tem free tier. Auth0 é overkill para 2 usuários. Complexidade de integração alta.

---

### 4. Backend Custom Node.js (Express + PostgreSQL)

**Descrição**: Backend tradicional com Express.js e PostgreSQL self-hosted ou Railway

**Prós**:
- Controle total do código
- Sem vendor lock-in
- Pode usar ORMs maduros (Prisma, TypeORM)
- Flexibilidade máxima

**Contras**:
- **~2000 linhas de código adicional** (auth, CRUD, migrations)
- Hospedagem não é gratuita (Railway free tier: $5/mês)
- Precisamos gerenciar segurança manualmente (SQL injection, CSRF, rate limiting)
- Backups manuais
- Deployment mais complexo (não é apenas `git push`)

**Por que foi rejeitado**: Viola constraint de custo zero e aumenta drasticamente o tempo de desenvolvimento.

---

### 5. Pocketbase (Self-hosted)

**Descrição**: Backend open source em Go (alternativa a Supabase)

**Prós**:
- Open source completo
- Single binary (fácil de deployar)
- Admin UI embutido
- Real-time nativo
- SQLite (zero config)

**Contras**:
- **Sem free hosting** (precisa self-host)
- SQLite não escala bem (limite ~1TB)
- Comunidade menor que Supabase
- Menos features (sem Edge Functions, Storage limitado)
- Hospedagem gratuita inexistente (Fly.io cobra após free tier)

**Por que foi rejeitado**: Não tem hospedagem gratuita. SQLite é inadequado para dados relacionais complexos em produção.

---

## Métricas de Sucesso

1. **Performance**:
   - Queries simples (SELECT) < 50ms
   - Queries com JOINs < 150ms
   - Auth (login) < 1s

2. **Disponibilidade**:
   - Uptime > 99.5% (Supabase SLA)
   - Cold start recovery < 3s

3. **Custo**:
   - $0/mês no MVP
   - < $25/mês após 1000 transações/mês

4. **Segurança**:
   - Zero data leaks entre usuários
   - Todos os testes de RLS passando

---

## Referências

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Free Tier Limits](https://supabase.com/pricing)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase + Next.js App Router](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [PostgreSQL RLS Documentation](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [Supabase vs Firebase Comparison](https://supabase.com/alternatives/supabase-vs-firebase)
- [Self-hosting Supabase](https://supabase.com/docs/guides/self-hosting)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)

---

**Última revisão:** Março 2026  
**Próxima revisão:** Após 6 meses de uso (avaliar necessidade de Pro plan)
