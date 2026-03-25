# ADR 001: Adoção do Next.js 14 com App Router

**Status:** Aceito  
**Data:** Março de 2026  
**Decisores:** Equipe de Arquitetura  

---

## Contexto

O projeto Finance App requer uma solução moderna de frontend capaz de:

1. **Renderização híbrida**: Servidor (SSR) para SEO e performance inicial + Cliente (CSR) para interatividade
2. **PWA nativo**: Suporte a Progressive Web App com service workers e manifest
3. **Roteamento moderno**: Sistema de rotas baseado em arquivo com layouts aninhados
4. **Mobile-first**: Otimização para dispositivos móveis (viewport 375px)
5. **Custo zero**: Hospedagem gratuita com deploy automatizado
6. **TypeScript strict**: Tipagem completa e segura em toda a aplicação
7. **Autenticação integrada**: Middleware para proteção de rotas e refresh de sessão

### Requisitos Técnicos

- **Performance**: FCP < 1.8s, LCP < 2.5s (métricas Core Web Vitals)
- **Bundle size**: < 150KB initial JS bundle
- **SEO**: Meta tags dinâmicas, Open Graph, sitemap automático
- **Offline**: Capacidade de funcionar sem conexão (service worker)
- **Layouts compartilhados**: Navbar inferior persistente entre páginas

### Constraints

- Free tier de hospedagem (Vercel Hobby: 100GB bandwidth/mês)
- Sem backend customizado Node.js (usar Supabase para API)
- Deve integrar facilmente com Supabase Auth (cookies, middleware)
- Time limitado: framework deve reduzir boilerplate

---

## Decisão

**Adotar Next.js 14 com App Router como framework principal do projeto.**

### Implementação

1. **Framework**: `next@14` com App Router (`app/` directory)
2. **Linguagem**: TypeScript 5 em strict mode
3. **Estrutura de rotas**:
   ```
   app/
   ├── (auth)/          # Rotas públicas (login)
   │   └── login/page.tsx
   ├── (app)/           # Rotas protegidas (dashboard, transações, etc.)
   │   ├── layout.tsx   # Layout com BottomNav
   │   └── dashboard/page.tsx
   ├── api/
   │   └── bcb-proxy/route.ts  # Edge Route para proxy API BCB
   └── layout.tsx       # Root layout
   ```
4. **Middleware**: `middleware.ts` na raiz para autenticação e refresh de sessão
5. **Hospedagem**: Vercel (free tier) com deploy automático via GitHub
6. **PWA**: Integração com `next-pwa` para geração de service worker

### Configuração

```typescript
// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
})

module.exports = withPWA({
  reactStrictMode: true,
  experimental: {
    serverActions: true,
  },
})
```

---

## Consequências

### Positivas

1. **Performance superior**:
   - SSR automático reduz Time to Interactive (TTI)
   - Automatic code splitting por rota
   - Image Optimization nativo (`next/image`)
   - Edge Runtime disponível para rotas de API

2. **Developer Experience**:
   - Hot Module Replacement (HMR) instantâneo
   - TypeScript first-class support
   - File-based routing (zero config)
   - Layouts aninhados eliminam duplicação de código

3. **Integração com Supabase**:
   - `@supabase/ssr` tem suporte nativo para Next.js App Router
   - Middleware permite refresh automático de sessão
   - Server Components podem acessar Supabase de forma segura

4. **Hospedagem e CI/CD**:
   - Vercel tem integração nativa (deploy em < 1min)
   - Preview deployments automáticos em PRs
   - Analytics gratuito (Web Vitals tracking)
   - Edge Network global (CDN)

5. **PWA simplificado**:
   - `next-pwa` gera service worker automaticamente
   - Cache strategies configuráveis
   - Offline fallback pages

6. **Ecossistema maduro**:
   - 120k+ stars no GitHub
   - Documentação completa em português
   - Grande comunidade (Stack Overflow, Discord)
   - Plugins para Tailwind, shadcn/ui, Supabase

### Negativas

1. **Curva de aprendizado**:
   - App Router é mais novo que Pages Router (menos conteúdo)
   - Server vs Client Components requer entendimento claro
   - Caching behavior pode ser contra-intuitivo

2. **Lock-in com Vercel**:
   - Algumas features são otimizadas para Vercel (Edge Middleware)
   - Deploy em outras plataformas requer configuração extra
   - **Mitigação**: Next.js é open source, pode ser self-hosted

3. **Bundle size**:
   - React 18 + Next.js = ~85KB gzipped (baseline)
   - **Mitigação**: Tree-shaking automático, lazy loading de componentes

4. **Debugging complexo**:
   - Erros em Server Components não aparecem no browser console
   - Hidratação mismatch pode ser difícil de debugar
   - **Mitigação**: Usar `use client` apenas quando necessário

### Trade-offs Aceitos

- **Complexidade vs Produtividade**: Aceitamos a complexidade do App Router em troca de layouts aninhados e Server Components
- **Vendor lock-in parcial**: Aceitamos a otimização para Vercel em troca do free tier generoso e CI/CD automático
- **Bundle size inicial**: Aceitamos 85KB de overhead em troca de performance SSR e roteamento avançado

---

## Alternativas Consideradas

### 1. Next.js 14 com Pages Router

**Descrição**: Versão anterior do sistema de rotas do Next.js

**Prós**:
- Mais conteúdo e tutoriais disponíveis
- Modelo mental mais simples (tudo é Client Component)
- Menos bugs (API estável há anos)

**Contras**:
- Sem layouts aninhados nativos (requer `_app.tsx` complexo)
- Sem Server Components (performance inferior)
- Sem streaming SSR (Suspense boundaries)
- Deprecated em favor do App Router

**Por que foi rejeitado**: App Router é o futuro do Next.js, e layouts aninhados são críticos para o BottomNav persistente.

---

### 2. Remix

**Descrição**: Framework React full-stack com foco em web standards

**Prós**:
- Web standards (Request/Response nativos)
- Nested routes nativo (inspirou App Router)
- Excelente tratamento de erros (Error Boundaries)
- Menos "mágica" que Next.js

**Contras**:
- Requer backend Node.js (não usa Supabase diretamente)
- Menor ecossistema (23k stars vs 120k Next.js)
- Hospedagem gratuita limitada (Fly.io free tier menor)
- Sem Image Optimization nativo

**Por que foi rejeitado**: Falta integração nativa com Supabase e hospedagem gratuita inferior.

---

### 3. Vite + React Router

**Descrição**: Bundler moderno + roteador React tradicional

**Prós**:
- Build extremamente rápido (10x mais rápido que Webpack)
- Zero configuração para TypeScript
- Flexibilidade total (sem opiniões)
- Bundle size menor (apenas cliente)

**Contras**:
- CSR puro (SEO ruim, FCP lento)
- PWA requer configuração manual (Workbox)
- Sem SSR out-of-the-box
- Hospedagem estática apenas (sem API routes)

**Por que foi rejeitado**: Performance inicial inferior (CSR) e falta de API routes para proxy BCB.

---

### 4. Create React App

**Descrição**: Boilerplate oficial do React

**Prós**:
- Setup mais simples possível
- Zero configuração
- Documentação oficial

**Contras**:
- **Deprecated oficialmente** (React recomenda Next.js/Remix)
- Webpack lento
- CSR puro (SEO ruim)
- Sem roteamento incluído

**Por que foi rejeitado**: Oficialmente descontinuado pelo time do React. Não é mais mantido.

---

### 5. Astro + React Islands

**Descrição**: Framework de conteúdo com hidratação parcial

**Prós**:
- Performance excepcional (JS mínimo)
- "Islands architecture" (hidratação seletiva)
- Multi-framework (React + Vue + Svelte)

**Contras**:
- Focado em conteúdo estático (blogs, docs)
- Interatividade limitada (ruim para dashboards)
- Ecossistema menor para apps dinâmicos
- Supabase Auth requer adaptadores customizados

**Por que foi rejeitado**: Não é otimizado para aplicações altamente interativas como um dashboard financeiro.

---

## Referências

- [Next.js 14 Documentation](https://nextjs.org/docs)
- [App Router Migration Guide](https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration)
- [Next.js + Supabase Guide](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Vercel Hobby Plan Limits](https://vercel.com/docs/accounts/plans/hobby)
- [Core Web Vitals](https://web.dev/vitals/)
- [next-pwa Documentation](https://github.com/shadowwalker/next-pwa)
- [React Server Components RFC](https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md)
- [Next.js Performance Best Practices](https://nextjs.org/docs/app/building-your-application/optimizing)

---

**Última revisão:** Março 2026  
**Próxima revisão:** Quando Next.js 15 for lançado (avaliar migração)
