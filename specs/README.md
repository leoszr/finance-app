# 📚 Finance App - Especificações Técnicas

Bem-vindo à documentação completa do projeto Finance App! Esta pasta contém todas as especificações técnicas, documentação de features, planejamento de sprints e decisões arquiteturais.

## 🎯 Visão Geral do Projeto

**App de Gestão Financeira para Casal** - Aplicação web mobile-first de controle financeiro pessoal para uso de dois usuários (casal) com dados completamente isolados.

- **Stack**: Next.js 14, TypeScript (strict), Supabase, Tailwind CSS + shadcn/ui
- **Idioma**: Português (pt-BR)
- **Arquitetura**: PWA mobile-first, zero-cost infrastructure
- **Status**: 🚧 Em desenvolvimento (Sprint 0)

## 📖 Como Navegar nesta Documentação

### 🚀 Começando

1. **Novo no projeto?** → Comece pelo [SETUP.md](./SETUP.md)
2. **Quer ver o progresso?** → Veja [PROGRESS.md](./PROGRESS.md)
3. **Precisa entender a arquitetura?** → Leia [technical/architecture.md](./technical/architecture.md)

### 📂 Estrutura de Pastas

```
/specs
├── README.md                 # 👈 Você está aqui!
├── PROGRESS.md              # 📊 Checklist de progresso do projeto
├── SETUP.md                 # 🔧 Guia de instalação e configuração
│
├── /sprints                 # 📅 Planejamento por Sprint
│   ├── sprint-0-setup.md
│   ├── sprint-1-transactions.md
│   ├── sprint-2-dashboard.md
│   ├── sprint-3-goals-budgets.md
│   ├── sprint-4-csv-import.md
│   ├── sprint-5-investments.md
│   ├── sprint-6-export.md
│   └── sprint-7-polish.md
│
├── /features                # ✨ Documentação por Funcionalidade
│   ├── authentication.md
│   ├── transactions.md
│   ├── dashboard.md
│   ├── budgets.md
│   ├── goals.md
│   ├── investments.md
│   ├── csv-import.md
│   └── export.md
│
├── /technical               # 🏗️ Documentação Técnica
│   ├── architecture.md
│   ├── database-schema.md
│   ├── security-rls.md
│   ├── state-management.md
│   ├── api-integration.md
│   └── pwa-config.md
│
└── /decisions               # 💡 Architecture Decision Records
    ├── 001-next-app-router.md
    ├── 002-supabase-backend.md
    ├── 003-shadcn-ui.md
    ├── 004-tanstack-query.md
    └── 005-mobile-first.md
```

## 🗺️ Guia de Navegação por Persona

### 👨‍💻 Desenvolvedor Iniciando no Projeto
1. **[SETUP.md](./SETUP.md)** - Configure o ambiente
2. **[technical/architecture.md](./technical/architecture.md)** - Entenda a arquitetura
3. **[technical/database-schema.md](./technical/database-schema.md)** - Conheça o schema
4. **[sprints/sprint-0-setup.md](./sprints/sprint-0-setup.md)** - Primeira sprint
5. **[PROGRESS.md](./PROGRESS.md)** - Veja o que já foi feito

### 🎨 Designer/Product Owner
1. **[Visão Geral](#visão-geral-do-projeto)** (acima)
2. **[features/](./features/)** - Todas as funcionalidades documentadas
3. **[sprints/](./sprints/)** - Planejamento e priorização
4. **[PROGRESS.md](./PROGRESS.md)** - Status atual

### 🏗️ Arquiteto/Tech Lead
1. **[technical/architecture.md](./technical/architecture.md)** - Arquitetura geral
2. **[decisions/](./decisions/)** - ADRs (Architecture Decision Records)
3. **[technical/security-rls.md](./technical/security-rls.md)** - Segurança e RLS
4. **[technical/state-management.md](./technical/state-management.md)** - Estado e cache

### 🧪 QA/Tester
1. **[features/](./features/)** - Requisitos e critérios de aceitação
2. **[sprints/](./sprints/)** - Tasks com critérios de aceitação detalhados
3. **[PROGRESS.md](./PROGRESS.md)** - O que está pronto para testar

## 📋 Índice Rápido por Funcionalidade

| Funcionalidade | Sprint | Feature Doc | Status |
|----------------|--------|-------------|--------|
| 🔐 Autenticação Google | 0 | [authentication.md](./features/authentication.md) | 📝 Planejado |
| 💰 Transações (CRUD) | 1 | [transactions.md](./features/transactions.md) | 📝 Planejado |
| 🔄 Transações Recorrentes | 1 | [transactions.md](./features/transactions.md) | 📝 Planejado |
| 📊 Dashboard + Gráficos | 2 | [dashboard.md](./features/dashboard.md) | 📝 Planejado |
| 💳 Orçamentos por Categoria | 3 | [budgets.md](./features/budgets.md) | 📝 Planejado |
| 🎯 Metas Financeiras | 3 | [goals.md](./features/goals.md) | 📝 Planejado |
| 📥 Import CSV (Nubank) | 4 | [csv-import.md](./features/csv-import.md) | 📝 Planejado |
| 💼 Investimentos | 5 | [investments.md](./features/investments.md) | 📝 Planejado |
| 🧮 Calculadora de Investimentos | 5 | [investments.md](./features/investments.md) | 📝 Planejado |
| 📄 Export PDF/Excel | 6 | [export.md](./features/export.md) | 📝 Planejado |
| 📧 Resumo Semanal Email | 7 | [sprints/sprint-7-polish.md](./sprints/sprint-7-polish.md) | 📝 Planejado |

## 🎯 Sprints Overview

### Sprint 0: Setup e Infraestrutura (3-5 dias)
**Tasks**: 6 | **Status**: 🔴 Not Started  
Setup inicial, autenticação, deploy, PWA básico.  
→ [Ver detalhes](./sprints/sprint-0-setup.md)

### Sprint 1: Transações (5-7 dias)
**Tasks**: 4 | **Status**: 🔴 Not Started  
CRUD completo de transações, recorrências, categorias.  
→ [Ver detalhes](./sprints/sprint-1-transactions.md)

### Sprint 2: Dashboard e Gráficos (4-5 dias)
**Tasks**: 4 | **Status**: 🔴 Not Started  
Dashboard com visualizações, gráficos de gastos.  
→ [Ver detalhes](./sprints/sprint-2-dashboard.md)

### Sprint 3: Metas e Orçamentos (4-5 dias)
**Tasks**: 3 | **Status**: 🔴 Not Started  
Sistema de metas financeiras e limites por categoria.  
→ [Ver detalhes](./sprints/sprint-3-goals-budgets.md)

### Sprint 4: Import CSV (3-4 dias)
**Tasks**: 2 | **Status**: 🔴 Not Started  
Import de fatura do Nubank via CSV.  
→ [Ver detalhes](./sprints/sprint-4-csv-import.md)

### Sprint 5: Investimentos (5-6 dias)
**Tasks**: 5 | **Status**: 🔴 Not Started  
Módulo de investimentos com calculadora.  
→ [Ver detalhes](./sprints/sprint-5-investments.md)

### Sprint 6: Exportação e Histórico (3-4 dias)
**Tasks**: 3 | **Status**: 🔴 Not Started  
Export PDF/Excel e filtros avançados.  
→ [Ver detalhes](./sprints/sprint-6-export.md)

### Sprint 7: Notificações e Polimento (3-4 dias)
**Tasks**: 3 | **Status**: 🔴 Not Started  
Resumo semanal, states de loading/error, testes.  
→ [Ver detalhes](./sprints/sprint-7-polish.md)

## 📊 Progresso Geral

**Tasks Totais**: 30  
**Completas**: 0 (0%)  
**Em Progresso**: 0  
**Pendentes**: 30  

Veja detalhes completos em [PROGRESS.md](./PROGRESS.md)

## 🔗 Links Úteis

- **Repositório**: (adicionar URL do GitHub)
- **Deploy Produção**: (adicionar URL Vercel)
- **Supabase Dashboard**: (adicionar URL Supabase)
- **Figma/Design**: (adicionar se houver)
- **Documento Original**: [../finance-app-specs.md](../finance-app-specs.md)
- **AGENTS.md**: [../AGENTS.md](../AGENTS.md)

## 🤝 Contribuindo

Este é um projeto em desenvolvimento ativo. Para contribuir:

1. Leia o [SETUP.md](./SETUP.md) para configurar o ambiente
2. Consulte [PROGRESS.md](./PROGRESS.md) para ver tasks disponíveis
3. Siga as guidelines do [AGENTS.md](../AGENTS.md)
4. Certifique-se de que todas as tasks passam nos critérios de aceitação
5. Use commits semânticos: `feat:`, `fix:`, `chore:`, `refactor:`

## 📝 Convenções desta Documentação

### Status Icons
- 🔴 **Not Started** - Ainda não iniciado
- 🟡 **In Progress** - Em desenvolvimento
- 🟢 **Done** - Completo e testado
- 🔵 **Blocked** - Bloqueado (aguardando dependência)
- ⚪ **Skipped** - Pulado (fora do escopo)

### Prioridade
- 🔥 **Critical** - Bloqueador ou alta prioridade
- ⭐ **High** - Importante
- 📌 **Medium** - Prioridade normal
- 💡 **Low** - Pode ser adiado

### Labels de Task
- `[SETUP]` - Configuração/infraestrutura
- `[FEAT]` - Nova funcionalidade
- `[UI]` - Interface/componentes
- `[API]` - Backend/API
- `[TEST]` - Testes
- `[DOC]` - Documentação
- `[FIX]` - Correção de bug

## 📚 Glossário

- **RLS**: Row Level Security (Supabase)
- **PWA**: Progressive Web App
- **shadcn/ui**: Biblioteca de componentes UI
- **TanStack Query**: React Query (gerenciamento de estado servidor)
- **Zustand**: Biblioteca de gerenciamento de estado global
- **BCB**: Banco Central do Brasil
- **ADR**: Architecture Decision Record

## 📞 Suporte

Para dúvidas ou sugestões sobre a documentação:
- Abra uma issue no GitHub
- Consulte o documento original [finance-app-specs.md](../finance-app-specs.md)
- Revise as decisões arquiteturais em [decisions/](./decisions/)

---

**Última atualização**: Março 2026  
**Versão das Specs**: 1.0  
**Responsável**: Equipe de Desenvolvimento Finance App
