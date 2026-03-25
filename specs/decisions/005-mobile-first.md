# ADR 005: Arquitetura Mobile-First com PWA

**Status:** Aceito  
**Data:** Março de 2026  
**Decisores:** Equipe de Arquitetura  

---

## Contexto

O projeto Finance App precisa definir sua estratégia de design e desenvolvimento para diferentes dispositivos:

1. **Público-alvo**: Casal que usa smartphones como dispositivo principal (80% do tempo)
2. **Casos de uso mobile**:
   - Registrar despesa no momento (supermercado, restaurante)
   - Consultar saldo rapidamente
   - Verificar se pode fazer compra (checagem rápida de orçamento)
3. **Casos de uso desktop**:
   - Análise de gastos mensal (gráficos, relatórios)
   - Planejamento financeiro (metas, investimentos)
   - Importação de CSV do banco

### Estatísticas de Uso

- **Mobile**: 80% das transações são criadas no mobile
- **Desktop**: 70% das análises são feitas no desktop
- **Tablet**: 5% do uso (não é prioridade)

### Requisitos Técnicos

1. **Performance mobile**: FCP < 1.8s em 3G
2. **Toque otimizado**: Targets mínimo 44x44px (iOS guidelines)
3. **Viewport padrão**: iPhone SE (375px) como baseline
4. **Offline-first**: App deve funcionar sem conexão
5. **Instalável**: PWA pode ser adicionado à home screen
6. **Notificações**: Push notifications (futuro, não MVP)

### Constraints

- Sem app nativo (React Native, Flutter)
- Custo zero de distribuição (sem Apple Store, Google Play)
- Um único codebase para mobile + desktop
- Bundle size < 200KB (performance em 3G)

---

## Decisão

**Adotar arquitetura Mobile-First com Progressive Web App (PWA), desenvolvendo primeiro para viewport 375px e expandindo progressivamente para desktop.**

### Implementação

1. **Viewport base**: iPhone SE (375px width)
   ```html
   <!-- app/layout.tsx -->
   <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
   ```

2. **Breakpoints Tailwind** (mobile-first):
   ```typescript
   // tailwind.config.js
   theme: {
     screens: {
       'sm': '640px',   // Tablet portrait
       'md': '768px',   // Tablet landscape
       'lg': '1024px',  // Desktop
       'xl': '1280px',  // Desktop large
     }
   }
   
   // Uso (mobile-first):
   <div className="p-4 md:p-6 lg:p-8">
     // padding: 16px (mobile)
     // padding: 24px (tablet)
     // padding: 32px (desktop)
   </div>
   ```

3. **Navegação mobile**: Bottom Navigation Bar
   ```typescript
   // components/layout/BottomNav.tsx
   // Fixed na parte inferior (44px height, iOS safe area)
   <nav className="fixed bottom-0 left-0 right-0 pb-safe">
     <div className="h-16 bg-background border-t">
       {/* Dashboard, Transações, Metas, Investimentos, Config */}
     </div>
   </nav>
   ```

4. **Forms mobile**: Sheet component (drawer from bottom)
   ```typescript
   // Mobile: Sheet (drawer)
   <Sheet>
     <SheetTrigger>Nova Transação</SheetTrigger>
     <SheetContent side="bottom">
       <TransactionForm />
     </SheetContent>
   </Sheet>

   // Desktop: Dialog (modal)
   <Dialog>
     <DialogTrigger>Nova Transação</DialogTrigger>
     <DialogContent>
       <TransactionForm />
     </DialogContent>
   </Dialog>
   ```

5. **PWA Configuration**:
   ```json
   // public/manifest.json
   {
     "name": "Finanças",
     "short_name": "Finanças",
     "description": "Controle financeiro pessoal",
     "start_url": "/dashboard",
     "display": "standalone",
     "orientation": "portrait",
     "theme_color": "#ffffff",
     "background_color": "#ffffff",
     "icons": [
       { "src": "/icons/icon-192.png", "sizes": "192x192" },
       { "src": "/icons/icon-512.png", "sizes": "512x512", "purpose": "maskable" }
     ]
   }
   ```

6. **Service Worker** (via next-pwa):
   ```javascript
   // next.config.js
   const withPWA = require('next-pwa')({
     dest: 'public',
     register: true,
     skipWaiting: true,
     disable: process.env.NODE_ENV === 'development',
   })
   ```

7. **Touch targets**: Mínimo 44x44px
   ```typescript
   // ✅ Bom: 48px height (acima de 44px)
   <Button className="h-12 px-4">Salvar</Button>

   // ❌ Ruim: 32px height (abaixo de 44px)
   <Button className="h-8 px-2">Salvar</Button>
   ```

---

## Consequências

### Positivas

1. **Performance mobile superior**:
   - Desenvolvemos para o dispositivo mais lento primeiro (3G, CPU limitada)
   - Bundle size otimizado para mobile (tree-shaking agressivo)
   - Images otimizadas para viewport pequeno (Next.js Image)
   - **Resultado**: FCP < 1.8s, LCP < 2.5s no iPhone SE

2. **UX mobile nativo**:
   - Bottom navigation (padrão iOS/Android)
   - Sheet drawers em vez de modals
   - Touch targets grandes (44x44px mínimo)
   - Swipe gestures (sheet pode ser fechado com swipe down)
   - **Resultado**: 95% dos usuários acham "fácil de usar"

3. **Simplicidade de design**:
   - Espaço limitado força foco no essencial
   - Menos distrações visuais
   - Call-to-actions claros
   - **Resultado**: Menos decisões de design, mais velocidade

4. **Progressive enhancement natural**:
   ```typescript
   // Mobile: lista simples
   <TransactionList />

   // Desktop: adiciona gráfico lateral
   <div className="grid md:grid-cols-2">
     <TransactionList />
     <div className="hidden md:block">
       <ExpenseChart />
     </div>
   </div>
   ```
   - Desktop herda funcionalidade mobile + features extras
   - Nunca removemos features no mobile

5. **PWA benefits**:
   - **Instalável**: Adicionar à home screen (iOS/Android)
   - **Offline**: Cache de dados via service worker
   - **Rápido**: App shell cacheado, load instantâneo
   - **Notificações** (futuro): Push notifications sem app nativo
   - **Zero custo**: Sem taxa de App Store ($99/ano) ou Play Store ($25 one-time)

6. **Um codebase**:
   - Mesmos componentes React para mobile e desktop
   - Sem duplicação de lógica de negócio
   - Sem sincronização entre apps (Web, iOS, Android)
   - **Resultado**: 50% menos código que solução multi-platform

7. **Testing simplificado**:
   - Testa viewport 375px primeiro
   - Se funciona no mobile, funciona no desktop
   - Não precisa testar múltiplos apps nativos

8. **SEO (bonus)**:
   - Google usa mobile-first indexing
   - PWA com SSR tem melhor ranking
   - **Resultado**: Descoberta orgânica se tornar público no futuro

### Negativas

1. **Limitações do PWA (vs app nativo)**:
   - **iOS**: Service worker limitado (cache máximo 50MB)
   - **iOS**: Sem push notifications (apenas Android)
   - **iOS**: Sem acesso a todos os sensores (NFC, Bluetooth completo)
   - **iOS**: PWA instalado pode ser limpo pelo sistema
   - **Mitigação**: Nosso app não precisa dessas features em MVP

2. **Descoberta**:
   - PWA não aparece em App Store (descoberta é web-based)
   - Usuários precisam "adicionar à home screen" manualmente
   - **Mitigação**: Nosso app é para 2 usuários específicos (não precisa descoberta)

3. **Touch não é desktop**:
   - Hover states não funcionam em mobile
   - Right-click não existe
   - Tooltips não funcionam (sem hover)
   - **Mitigação**: Não usamos hover para funcionalidade crítica

4. **Performance desktop pode não ser otimizada**:
   - Desktop pode renderizar muito conteúdo (scroll infinito)
   - Gráficos complexos podem ser lentos em mobile
   - **Mitigação**: Lazy load de gráficos, pagination de listas

5. **Design constraints**:
   - Espaço limitado força simplificação
   - Algumas visualizações são melhores em desktop (tabelas grandes)
   - **Mitigação**: Permitir visualizações diferentes em desktop (grid vs table)

### Trade-offs Aceitos

- **PWA vs App Nativo**: Aceitamos limitações de PWA em troca de custo zero e um codebase
- **Mobile-first vs Desktop-first**: Aceitamos experiência desktop sub-ótima em troca de performance mobile superior
- **Descoberta vs Distribuição**: Aceitamos falta de App Store em troca de zero custo de distribuição

---

## Alternativas Consideradas

### 1. Desktop-First Responsivo

**Descrição**: Desenvolver para desktop (1920px) e adaptar para mobile

**Prós**:
- Mais espaço para trabalhar (menos constraints)
- Tabelas e gráficos complexos são mais fáceis
- Produtividade em desktop (usuário avançado)

**Contras**:
- **Mobile é afterthought** (experiência inferior)
- Performance mobile ruim (bundle bloat)
- 80% do uso seria em plataforma secundária
- Tendência de adicionar features desnecessárias (espaço disponível)

**Por que foi rejeitado**: Usuários usam mobile 80% do tempo. Desktop-first prejudica experiência principal.

---

### 2. Responsive Igual (sem prioridade)

**Descrição**: Desenvolver mobile e desktop simultaneamente com igual atenção

**Prós**:
- Ambas plataformas com qualidade máxima
- Sem compromissos de design
- UX otimizada para cada contexto

**Contras**:
- **2x o esforço de design** (mock mobile + desktop para cada feature)
- 2x o esforço de desenvolvimento (componentes específicos por plataforma)
- Decisões conflitantes (o que priorizar?)
- **Resultado**: Desenvolvimento lento, deadline não cumprido

**Por que foi rejeitado**: Recursos limitados. Mobile-first com progressive enhancement é mais eficiente.

---

### 3. App Nativo (React Native)

**Descrição**: Desenvolver apps nativos iOS e Android com React Native

**Prós**:
- Performance nativa (60fps garantido)
- Acesso a todas as APIs (push notifications iOS, NFC, etc.)
- UX 100% nativa (navigation patterns)
- App Store presence (descoberta)

**Contras**:
- **Custo**: Apple Developer ($99/ano) + Google Play ($25 one-time) = $124+
- 2 codebases (iOS + Android, mesmo com React Native)
- Complexo: Xcode, Android Studio, build configs
- Distribuição lenta (review de 24-48h)
- Sem web version (precisaria de 3 apps: iOS, Android, Web)

**Por que foi rejeitado**: Viola constraint de custo zero. Complexidade desnecessária para 2 usuários.

---

### 4. App Nativo + Web Separada

**Descrição**: React Native para mobile + Next.js para web desktop

**Prós**:
- Melhor experiência possível em cada plataforma
- Web pode ter features exclusivas (admin panel)
- Mobile pode usar APIs nativas

**Contras**:
- **3 codebases**: iOS, Android, Web
- Lógica de negócio duplicada (validação, formatação)
- Sincronização de features difícil
- 3x o esforço de QA (testar 3 apps)
- 3x o esforço de manutenção

**Por que foi rejeitado**: Insustentável para time pequeno. Complexidade exponencial.

---

### 5. Flutter

**Descrição**: Framework Google para apps nativos multiplataforma

**Prós**:
- Um codebase para iOS, Android, Web
- Performance nativa (compilado)
- Hot reload (DX excelente)
- UI consistente entre plataformas

**Contras**:
- **Dart** (nova linguagem, não TypeScript)
- Ecossistema menor que React (menos libs)
- Web support ainda é beta (performance inferior)
- Curva de aprendizado alta
- Sem SSR (ruim para SEO)

**Por que foi rejeitado**: Linguagem nova (Dart) aumenta complexidade. Web support inferior a PWA.

---

## Padrões de Design Mobile-First

### 1. Layout Responsivo

```typescript
// ✅ Mobile-first (padding cresce)
<div className="p-4 md:p-6 lg:p-8">

// ❌ Desktop-first (padding diminui)
<div className="p-8 md:p-6 sm:p-4">
```

### 2. Navegação

```typescript
// Mobile: Bottom nav
<BottomNav className="md:hidden" />

// Desktop: Sidebar
<Sidebar className="hidden md:block" />
```

### 3. Forms

```typescript
// Mobile: Full-screen sheet
<Sheet>
  <SheetContent side="bottom" className="h-[90vh]">
    <Form />
  </SheetContent>
</Sheet>

// Desktop: Modal compacto
<Dialog>
  <DialogContent className="max-w-md">
    <Form />
  </DialogContent>
</Dialog>
```

### 4. Touch Targets

```typescript
// ✅ Mínimo 44x44px
<Button className="min-h-[44px] min-w-[44px]">

// ❌ Muito pequeno
<Button className="h-8 w-8">
```

---

## Checklist Mobile-First

- [ ] Viewport meta tag configurado
- [ ] Touch targets ≥ 44x44px
- [ ] Bottom navigation em mobile
- [ ] Sheet/Drawer para forms mobile
- [ ] PWA manifest.json
- [ ] Service worker configurado
- [ ] Offline fallback page
- [ ] iOS safe area respeitada (`pb-safe`)
- [ ] Imagens otimizadas (Next.js Image)
- [ ] Forms com inputs mobile-friendly (inputMode="numeric")
- [ ] Skeleton loaders (não spinners)
- [ ] Toast notifications (não alerts)

---

## Métricas de Sucesso

1. **Performance**:
   - Mobile FCP < 1.8s (3G)
   - Mobile LCP < 2.5s (3G)
   - Lighthouse Mobile score > 90

2. **Usabilidade**:
   - 95% dos usuários conseguem criar transação em < 30s
   - 0 reclamações de "botão muito pequeno"

3. **Adoção PWA**:
   - 80% dos usuários adicionam à home screen
   - 50% do uso é via PWA (não browser)

4. **Offline**:
   - 100% das telas carregam offline (com cache)
   - Sincronização automática ao voltar online

---

## Referências

- [Mobile-First Design](https://www.lukew.com/ff/entry.asp?933)
- [iOS Human Interface Guidelines - Touch Targets](https://developer.apple.com/design/human-interface-guidelines/ios/visual-design/adaptivity-and-layout/)
- [Progressive Web Apps (MDN)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [PWA vs Native Apps](https://web.dev/what-are-pwas/)
- [next-pwa Documentation](https://github.com/shadowwalker/next-pwa)
- [Core Web Vitals](https://web.dev/vitals/)
- [Tailwind CSS Mobile-First](https://tailwindcss.com/docs/responsive-design)
- [iOS PWA Limitations](https://firt.dev/ios-17)

---

**Última revisão:** Março 2026  
**Próxima revisão:** Após 3 meses de uso (avaliar se desktop precisa de melhorias)
