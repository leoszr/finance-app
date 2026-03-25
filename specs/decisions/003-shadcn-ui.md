# ADR 003: shadcn/ui + Tailwind CSS como Sistema de Design

**Status:** Aceito  
**Data:** Março de 2026  
**Decisores:** Equipe de Arquitetura  

---

## Contexto

O projeto Finance App requer uma biblioteca de componentes UI que atenda:

1. **Mobile-first**: Componentes otimizados para telas pequenas (375px viewport)
2. **Acessibilidade**: WCAG 2.1 AA compliance (screen readers, keyboard navigation)
3. **Customização**: Ability para ajustar cores, espaçamentos, tipografia sem fork
4. **Dark mode**: Suporte nativo a tema escuro
5. **Performance**: Bundle size pequeno (< 50KB para componentes comuns)
6. **TypeScript**: Tipos completos e safe
7. **Componentes essenciais**: Forms, Modals, Toasts, Dialogs, Select, DatePicker

### Requisitos de Design

- **Estética moderna**: Design limpo e minimalista
- **Consistência**: Componentes seguem o mesmo design language
- **Responsividade**: Componentes se adaptam a diferentes viewports
- **Touch-friendly**: Targets de toque mínimo 44x44px (iOS guidelines)

### Constraints

- Não pode ser uma biblioteca monolítica (evitar bundle bloat)
- Deve integrar com Tailwind CSS (já usado no projeto)
- Não pode ter dependências pesadas (ex: Emotion, styled-components)
- Deve funcionar com React Server Components (Next.js App Router)

### Stack Atual

- **Tailwind CSS**: Utility-first CSS framework
- **Next.js 14**: App Router com Server Components
- **TypeScript strict**: Sem `any` types

---

## Decisão

**Adotar shadcn/ui como sistema de componentes UI, construído sobre Radix UI primitives e estilizado com Tailwind CSS.**

### Implementação

1. **Instalação**: Via CLI do shadcn/ui (copia componentes para o projeto)
   ```bash
   npx shadcn-ui@latest init
   npx shadcn-ui@latest add button form dialog toast sheet select
   ```

2. **Componentes copiados para**: `components/ui/`
   - Componentes são **copiados**, não instalados como dependência
   - Podemos modificar 100% do código
   - Nenhum bloat de biblioteca monolítica

3. **Dependências**:
   ```json
   {
     "@radix-ui/react-dialog": "^1.0.5",
     "@radix-ui/react-toast": "^1.1.5",
     "@radix-ui/react-select": "^2.0.0",
     "class-variance-authority": "^0.7.0",
     "clsx": "^2.0.0",
     "tailwind-merge": "^2.0.0"
   }
   ```

4. **Configuração Tailwind**:
   ```javascript
   // tailwind.config.js
   module.exports = {
     darkMode: ["class"],
     content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
     theme: {
       extend: {
         colors: {
           border: "hsl(var(--border))",
           background: "hsl(var(--background))",
           foreground: "hsl(var(--foreground))",
           // ... CSS variables para theming
         },
       },
     },
   }
   ```

5. **Estrutura de arquivos**:
   ```
   components/
   ├── ui/              # shadcn/ui components (gerados)
   │   ├── button.tsx
   │   ├── form.tsx
   │   ├── dialog.tsx
   │   ├── toast.tsx
   │   ├── sheet.tsx    # Mobile drawer
   │   └── select.tsx
   └── shared/          # Componentes customizados do app
       ├── MonthPicker.tsx
       └── CategoryBadge.tsx
   ```

---

## Consequências

### Positivas

1. **Copy, não install**:
   - Componentes são copiados para `components/ui/`
   - **Ownership completo**: podemos modificar qualquer linha
   - Sem breaking changes de versões (não há "upgrade")
   - Zero vendor lock-in

2. **Bundle size mínimo**:
   - Button component: ~2KB gzipped
   - Form + validation: ~8KB gzipped
   - Tree-shaking perfeito (importamos apenas o que usamos)
   - **Comparação**: Material-UI Button sozinho = 15KB

3. **Acessibilidade nativa**:
   - Radix UI primitives seguem WAI-ARIA 1.2
   - Keyboard navigation automático (Tab, Enter, Escape)
   - Screen reader support (aria-labels, roles)
   - Focus management (focus traps em modals)

4. **Dark mode zero-config**:
   - CSS variables para cores (`--background`, `--foreground`)
   - Troca via classe `.dark` no root element
   - Suporta `prefers-color-scheme` automático

5. **TypeScript perfeito**:
   - Tipos gerados automaticamente
   - Autocomplete completo no VSCode
   - Compile-time safety (nenhum `any`)

6. **Mobile-first nativo**:
   - `Sheet` component (drawer from bottom) para forms mobile
   - Componentes respondem a touch events
   - Tailwind breakpoints nativos (`sm:`, `md:`, `lg:`)

7. **Integração com React Hook Form**:
   - `Form` component tem integração nativa
   - Composição com Zod para validação
   ```typescript
   <Form {...form}>
     <FormField
       control={form.control}
       name="amount"
       render={({ field }) => (
         <FormItem>
           <FormLabel>Valor</FormLabel>
           <FormControl>
             <Input type="number" {...field} />
           </FormControl>
           <FormMessage />
         </FormItem>
       )}
     />
   </Form>
   ```

8. **Documentação excelente**:
   - Exemplos interativos para cada componente
   - Copy-paste snippets prontos
   - Dark mode examples

### Negativas

1. **Atualizações manuais**:
   - Novos componentes precisam ser "baixados" via CLI
   - Bugfixes em componentes requerem re-copy
   - **Mitigação**: Acontece raramente, e podemos fixar localmente

2. **Tailwind obrigatório**:
   - Não funciona sem Tailwind CSS
   - Componentes usam `cn()` helper (tailwind-merge)
   - **Mitigação**: Já estamos usando Tailwind

3. **Radix UI dependencies**:
   - Cada componente complexo adiciona ~10KB
   - Dialog + Toast + Select = ~30KB total
   - **Mitigação**: Ainda é menor que Material-UI (200KB+)

4. **Customização via Tailwind**:
   - Mudanças estruturais requerem editar JSX
   - Não há "theme config" centralizado (exceto CSS vars)
   - **Mitigação**: Ownership total permite qualquer mudança

5. **Componentes básicos**:
   - Sem DataTable avançado (precisamos construir)
   - Sem Charts (usamos Recharts separadamente)
   - Sem Date Picker complexo (integramos react-day-picker)
   - **Mitigação**: Foco em componentes primitivos é intencional

### Trade-offs Aceitos

- **Atualizações manuais vs Ownership**: Aceitamos updates manuais em troca de controle total
- **Tailwind obrigatório vs Performance**: Aceitamos dependência de Tailwind em troca de bundle size mínimo
- **Componentes básicos vs Bundle size**: Aceitamos construir componentes avançados em troca de não ter bloat

---

## Alternativas Consideradas

### 1. Material-UI (MUI)

**Descrição**: Biblioteca React mais popular, implementa Material Design do Google

**Prós**:
- Ecossistema maduro (90k+ stars, 10 anos)
- Componentes complexos (DataGrid, DatePicker avançado)
- Theming poderoso (via `createTheme`)
- TypeScript excelente
- Documentação completa

**Contras**:
- **Bundle size gigante**: 200KB+ gzipped para componentes básicos
- Material Design não é mobile-first (feito para Android)
- Emotion/styled-components obrigatório (20KB adicional)
- Não funciona bem com Server Components (usa Context)
- Customização requer override de 50+ CSS classes

**Por que foi rejeitado**: Bundle size inaceitável para mobile-first. Material Design não se alinha com nosso design system.

---

### 2. Chakra UI

**Descrição**: Component library com foco em acessibilidade e developer experience

**Prós**:
- Acessibilidade nativa (WAI-ARIA)
- Theming via `extendTheme` (fácil de customizar)
- Dark mode nativo
- Componentes composable
- TypeScript excelente

**Contras**:
- **Bundle size grande**: 120KB+ gzipped
- Usa Emotion (CSS-in-JS, 15KB adicional)
- Não funciona com Server Components (requer Context)
- Menos customizável que Tailwind (styles inline)
- Menos popular que MUI (35k stars)

**Por que foi rejeitado**: Incompatível com Server Components. Bundle size ainda grande. Emotion adiciona complexidade.

---

### 3. Ant Design

**Descrição**: Enterprise UI library do Alibaba

**Prós**:
- Componentes enterprise (Table, Form, Upload)
- Design system completo
- Internacionalização nativa (pt-BR incluído)
- Documentação em português

**Contras**:
- **Design chinês** (não se alinha com estética ocidental)
- Bundle size massivo: 300KB+ gzipped
- Less CSS (compilação adicional)
- Não mobile-first (foco em desktop admin panels)
- Customização limitada (override de variables)

**Por que foi rejeitado**: Design system não se alinha com mobile-first. Bundle size proibitivo.

---

### 4. Mantine

**Descrição**: Modern React component library com 100+ componentes

**Prós**:
- 100+ componentes incluídos
- Dark mode nativo
- Hooks utilitários (useMediaQuery, useClipboard)
- TypeScript perfeito
- Bundle size moderado (~80KB)

**Contras**:
- Emotion obrigatório (CSS-in-JS)
- Menos popular (20k stars, comunidade menor)
- Não funciona com Server Components
- Theming via JS (não CSS variables)
- Menos acessível que Radix

**Por que foi rejeitado**: Incompatível com Server Components. Emotion adiciona complexidade. Comunidade menor.

---

### 5. Radix UI Primitives (puro)

**Descrição**: Unstyled component primitives (base do shadcn/ui)

**Prós**:
- Acessibilidade perfeita (WAI-ARIA compliance)
- Zero styles (total customização)
- Bundle size mínimo
- TypeScript nativo
- Funciona com Server Components

**Contras**:
- **Sem estilos** (precisamos escrever 100% do CSS)
- Sem design system (cores, espaçamentos, tipografia)
- Sem componentes complexos (Form, Input)
- Produtividade baixa (muito trabalho manual)

**Por que foi rejeitado**: Muito low-level. shadcn/ui já nos dá Radix + Tailwind styling, melhor DX.

---

## Componentes Utilizados no Projeto

| Componente | Uso | Bundle Impact |
|------------|-----|---------------|
| `Button` | CTAs, forms, navigation | 2KB |
| `Form` | Transaction/Budget/Goal forms | 8KB |
| `Sheet` | Mobile drawers (nova transação) | 12KB |
| `Dialog` | Confirmações desktop | 10KB |
| `Toast` | Feedback (sucesso/erro) | 6KB |
| `Select` | Dropdowns (categorias) | 10KB |
| `Input` | Text/number inputs | 1KB |
| `Label` | Form labels | 0.5KB |
| `Card` | Dashboard cards | 2KB |
| `Badge` | Category badges | 1KB |
| **TOTAL** | | **52.5KB** |

---

## Métricas de Sucesso

1. **Performance**:
   - Initial bundle (UI components) < 60KB gzipped
   - Lighthouse Accessibility score > 95

2. **Developer Experience**:
   - Tempo para adicionar novo form: < 30min
   - Zero bugs de acessibilidade (keyboard/screen reader)

3. **Manutenibilidade**:
   - Componentes customizados < 10% do código UI
   - Menos de 1 update de componente/mês

---

## Referências

- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Radix UI Primitives](https://www.radix-ui.com/primitives)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [React Hook Form + shadcn/ui](https://ui.shadcn.com/docs/components/form)
- [class-variance-authority (CVA)](https://cva.style/docs)
- [Bundle Size Comparison](https://bundlephobia.com/)

---

**Última revisão:** Março 2026  
**Próxima revisão:** Após 100 componentes criados (avaliar se patterns estão consistentes)
