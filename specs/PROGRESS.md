# 🎯 Finance App - Progresso do Projeto

**Status Geral**: 0/30 tasks completas (0%)  
**Sprint Atual**: Sprint 0 - Setup e Infraestrutura  
**Última Atualização**: Março 2026

---

## 📊 Visão Geral

```
Progresso Total: [░░░░░░░░░░░░░░░░░░░░] 0%

Sprint 0: [░░░░░░] 0/6 (0%)    🔴 Not Started
Sprint 1: [░░░░] 0/4 (0%)      🔴 Not Started
Sprint 2: [░░░░] 0/4 (0%)      🔴 Not Started
Sprint 3: [░░░] 0/3 (0%)       🔴 Not Started
Sprint 4: [░░] 0/2 (0%)        🔴 Not Started
Sprint 5: [░░░░░] 0/5 (0%)     🔴 Not Started
Sprint 6: [░░░] 0/3 (0%)       🔴 Not Started
Sprint 7: [░░░] 0/3 (0%)       🔴 Not Started
```

---

## 🚀 Sprint 0: Setup e Infraestrutura

**Objetivo**: Repositório funcional com autenticação e deploy automático  
**Estimativa**: 3-5 dias  
**Status**: 🔴 Not Started (0/6 tasks)

### Tasks

- [ ] **TASK-001**: Inicializar repositório Next.js com TypeScript `[SETUP]` ⭐
  - Criar projeto Next.js 14 com App Router
  - Instalar todas as dependências (ver specs)
  - Configurar shadcn/ui, ESLint, Prettier
  - Criar estrutura de pastas completa
  - **Critérios**: `npm run dev` e `npm run build` funcionam sem erros
  - **Tempo estimado**: 2-3h
  - 📄 [Detalhes](./sprints/sprint-0-setup.md#task-001)

- [ ] **TASK-002**: Configurar Supabase `[SETUP]` ⭐
  - Criar projeto no Supabase Dashboard
  - Executar migrations 001-008 em ordem
  - Habilitar Google OAuth
  - Configurar variáveis de ambiente
  - **Critérios**: Todas migrations executam, RLS habilitado, trigger de categorias ativo
  - **Tempo estimado**: 3-4h
  - 📄 [Detalhes](./sprints/sprint-0-setup.md#task-002)

- [ ] **TASK-003**: Autenticação com Google `[FEAT]` 🔥
  - Criar página de login com botão Google OAuth
  - Implementar middleware de proteção de rotas
  - Criar rota de callback OAuth
  - Adicionar botão de logout
  - **Critérios**: Fluxo completo de login/logout funciona, categorias criadas no primeiro login
  - **Tempo estimado**: 3-4h
  - 📄 [Detalhes](./sprints/sprint-0-setup.md#task-003)

- [ ] **TASK-004**: Layout mobile com navegação inferior `[UI]` ⭐
  - Criar componente BottomNav
  - Criar componente PageHeader
  - Configurar layout (app) com navegação
  - **Critérios**: Navegação funciona em 375px, safe area respeitada, item ativo destacado
  - **Tempo estimado**: 2-3h
  - 📄 [Detalhes](./sprints/sprint-0-setup.md#task-004)

- [ ] **TASK-005**: Configurar PWA `[SETUP]` 📌
  - Criar manifest.json
  - Gerar ícones 192x192 e 512x512
  - Configurar next-pwa
  - **Critérios**: App instalável no mobile, Lighthouse PWA score ≥90
  - **Tempo estimado**: 2h
  - 📄 [Detalhes](./sprints/sprint-0-setup.md#task-005)

- [ ] **TASK-006**: Deploy inicial na Vercel `[SETUP]` ⭐
  - Criar repositório GitHub
  - Conectar Vercel ao repositório
  - Configurar env vars na Vercel
  - Atualizar URLs permitidas no Supabase
  - **Critérios**: Deploy automático funciona, login em produção OK, HTTPS ativo
  - **Tempo estimado**: 1-2h
  - 📄 [Detalhes](./sprints/sprint-0-setup.md#task-006)

---

## 💰 Sprint 1: Transações

**Objetivo**: CRUD completo de transações com categorias  
**Estimativa**: 5-7 dias  
**Status**: 🔴 Not Started (0/4 tasks)

### Tasks

- [ ] **TASK-007**: Hook useTransactions `[API]` 🔥
  - Implementar hook com TanStack Query
  - Funções: useTransactions, useCreateTransaction, useUpdateTransaction, useDeleteTransaction
  - **Critérios**: Loading/error states expostos, cache invalidado após mutações, transações ordenadas por date DESC
  - **Tempo estimado**: 3-4h
  - 📄 [Detalhes](./sprints/sprint-1-transactions.md#task-007)

- [ ] **TASK-008**: Formulário de nova transação `[UI]` 🔥
  - Criar TransactionForm com React Hook Form + Zod
  - Campos: tipo, valor, descrição, categoria, data, notas
  - Validação inline
  - **Critérios**: Validação Zod funciona, valor formatado como BRL, categorias filtradas por tipo
  - **Tempo estimado**: 4-5h
  - 📄 [Detalhes](./sprints/sprint-1-transactions.md#task-008)

- [ ] **TASK-009**: Página de transações `[FEAT]` 🔥
  - Criar página /transacoes
  - Navegação por mês (setas)
  - Cards de resumo (receitas, despesas, saldo)
  - Lista agrupada por data
  - Botão flutuante "+"
  - **Critérios**: Trocar mês atualiza dados, swipe/long press para editar/excluir, saldo colorido corretamente
  - **Tempo estimado**: 5-6h
  - 📄 [Detalhes](./sprints/sprint-1-transactions.md#task-009)

- [ ] **TASK-010**: Recorrências `[FEAT]` ⭐
  - CRUD de transações recorrentes
  - Geração automática ao login (RPC)
  - Seção em /configuracoes
  - **Critérios**: Transações geradas aparecem com badge "Recorrente", não gera duplicatas no mês
  - **Tempo estimado**: 4-5h
  - 📄 [Detalhes](./sprints/sprint-1-transactions.md#task-010)

---

## 📊 Sprint 2: Dashboard e Gráficos

**Objetivo**: Dashboard com visualizações do mês atual  
**Estimativa**: 4-5 dias  
**Status**: 🔴 Not Started (0/4 tasks)

### Tasks

- [ ] **TASK-011**: Hook useDashboard `[API]` ⭐
  - Agregar dados do mês
  - Retornar: totalIncome, totalExpenses, balance, expensesByCategory, recentTransactions
  - **Critérios**: Dados corretos, valores zero se sem transações, query < 500ms
  - **Tempo estimado**: 2-3h
  - 📄 [Detalhes](./sprints/sprint-2-dashboard.md#task-011)

- [ ] **TASK-012**: Componente PieChart de gastos `[UI]` ⭐
  - Criar PieChart com Recharts
  - Tooltip com categoria, valor BRL e percentual
  - Legenda abaixo (mobile)
  - **Critérios**: Responsivo, dark mode funciona, categorias com R$0 não aparecem
  - **Tempo estimado**: 3-4h
  - 📄 [Detalhes](./sprints/sprint-2-dashboard.md#task-012)

- [ ] **TASK-013**: Página Dashboard `[FEAT]` 🔥
  - Criar página /dashboard
  - Saudação + mês atual
  - Cards de resumo (3 cards)
  - PieChart de gastos
  - Últimas 5 transações
  - Seção de orçamentos (se houver)
  - **Critérios**: Carrega em <1s (4G), saldo negativo em vermelho, link "Ver todas" funciona
  - **Tempo estimado**: 4-5h
  - 📄 [Detalhes](./sprints/sprint-2-dashboard.md#task-013)

- [ ] **TASK-014**: Comparativo entre meses `[UI]` 📌
  - Criar LineChart com Recharts
  - Mostrar receitas e despesas dos últimos 6 meses
  - Adicionar na página /transacoes
  - **Critérios**: Eixo X em pt-BR, valores em BRL abreviado, mês atual destacado
  - **Tempo estimado**: 3-4h
  - 📄 [Detalhes](./sprints/sprint-2-dashboard.md#task-014)

---

## 🎯 Sprint 3: Metas e Orçamentos

**Objetivo**: Sistema de metas e limites por categoria  
**Estimativa**: 4-5 dias  
**Status**: 🔴 Not Started (0/3 tasks)

### Tasks

- [ ] **TASK-015**: Hooks useBudgets e useGoals `[API]` ⭐
  - Hook useBudgets: listar, criar, editar, deletar + calcular spent
  - Hook useGoals: listar, criar, editar, deletar, addToGoal
  - **Critérios**: spent calculado corretamente, metas inativas não aparecem, cache invalidado
  - **Tempo estimado**: 3-4h
  - 📄 [Detalhes](./sprints/sprint-3-goals-budgets.md#task-015)

- [ ] **TASK-016**: Página de Metas `[FEAT]` 🔥
  - Criar página /metas
  - 3 seções: Orçamentos do mês, Meta mensal, Metas com objetivo
  - Barras de progresso com cores (verde/amarelo/vermelho)
  - Botão "+" para adicionar valor à meta
  - **Critérios**: Orçamento excedido tem alerta, metas concluídas mostram badge, optimistic update funciona
  - **Tempo estimado**: 5-6h
  - 📄 [Detalhes](./sprints/sprint-3-goals-budgets.md#task-016)

- [ ] **TASK-017**: Formulários de orçamento e meta `[UI]` ⭐
  - Criar BudgetForm e GoalForm
  - Validação Zod
  - Abrir em Sheet (drawer bottom)
  - **Critérios**: Não permite orçamento duplicado, prazo futuro obrigatório para metas finais, edição preenche campos
  - **Tempo estimado**: 3-4h
  - 📄 [Detalhes](./sprints/sprint-3-goals-budgets.md#task-017)

---

## 📥 Sprint 4: Import de CSV

**Objetivo**: Importar fatura do Nubank via CSV  
**Estimativa**: 3-4 dias  
**Status**: 🔴 Not Started (0/2 tasks)

### Tasks

- [ ] **TASK-018**: Parser do CSV do Nubank `[API]` ⭐
  - Função parseNubankCSV com Papa Parse
  - Mapear colunas: Data, Descrição, Valor
  - Ignorar estornos (valores positivos)
  - **Critérios**: Retorna {data, errors}, tolera BOM UTF-8, colunas não encontradas retornam erro descritivo
  - **Tempo estimado**: 2-3h
  - 📄 [Detalhes](./sprints/sprint-4-csv-import.md#task-018)

- [ ] **TASK-019**: Fluxo de importação de CSV `[FEAT]` 🔥
  - Criar página /transacoes/importar
  - 3 etapas: Upload → Pré-visualização → Confirmação
  - Seleção de categoria por linha
  - Checkbox para desmarcar linhas
  - Inserção em batch
  - **Critérios**: Arquivo inválido mostra erro, usuário pode desmarcar, import de 100 transações funciona
  - **Tempo estimado**: 5-6h
  - 📄 [Detalhes](./sprints/sprint-4-csv-import.md#task-019)

---

## 💼 Sprint 5: Investimentos

**Objetivo**: Registro de investimentos + calculadora  
**Estimativa**: 5-6 dias  
**Status**: 🔴 Not Started (0/5 tasks)

### Tasks

- [ ] **TASK-020**: Hook useInvestments `[API]` ⭐
  - Funções CRUD de investimentos
  - useInvestmentsSummary: total investido + agrupamento por tipo
  - **Critérios**: totalInvested correto, investimentos inativos não contam, agrupamento por tipo funciona
  - **Tempo estimado**: 2-3h
  - 📄 [Detalhes](./sprints/sprint-5-investments.md#task-020)

- [ ] **TASK-021**: API Route proxy BCB `[API]` ⭐
  - Criar /api/bcb-proxy
  - Suporte para séries: Selic (432), CDI (4389), IPCA (13522)
  - Cache 24h via headers
  - **Critérios**: Response time <2s, cache-control correto, erro 503 se BCB indisponível
  - **Tempo estimado**: 2h
  - 📄 [Detalhes](./sprints/sprint-5-investments.md#task-021)

- [ ] **TASK-022**: Calculadora de investimentos `[UI]` 🔥
  - Componente InvestmentCalculator
  - Parâmetros: fonte taxa (BCB/manual), aporte inicial/mensal, duração
  - Outputs: valor final, total investido, rendimento
  - Gráfico de evolução (LineChart)
  - **Critérios**: Valores real-time ao mover sliders, taxa BCB cached em localStorage se offline, valores formatados BRL
  - **Tempo estimado**: 5-6h
  - 📄 [Detalhes](./sprints/sprint-5-investments.md#task-022)

- [ ] **TASK-023**: Página de Investimentos `[FEAT]` 🔥
  - Criar página /investimentos
  - 2 abas: Portfólio | Calculadora
  - Aba Portfólio: resumo, pie chart, lista de investimentos
  - **Critérios**: Pie chart atualiza ao add/remove, lista vazia mostra CTA, swipe horizontal funciona
  - **Tempo estimado**: 4-5h
  - 📄 [Detalhes](./sprints/sprint-5-investments.md#task-023)

- [ ] **TASK-024**: Formulário de investimento `[UI]` ⭐
  - Criar InvestmentForm
  - Campos: nome, tipo, instituição, valor, tipo/valor de taxa, datas, notas
  - Validação Zod
  - **Critérios**: Label de taxa muda conforme tipo, vencimento > início, sheet/drawer no mobile
  - **Tempo estimado**: 3-4h
  - 📄 [Detalhes](./sprints/sprint-5-investments.md#task-024)

---

## 📄 Sprint 6: Exportação e Histórico

**Objetivo**: Exportar dados e navegar pelo histórico  
**Estimativa**: 3-4 dias  
**Status**: 🔴 Not Started (0/3 tasks)

### Tasks

- [ ] **TASK-025**: Exportar para PDF `[FEAT]` ⭐
  - Função para gerar PDF com jsPDF
  - Conteúdo: cabeçalho, resumo, tabela de transações, rodapé
  - **Critérios**: PDF gerado no cliente, download automático, nome extrato-[mes]-[ano].pdf, paginação correta
  - **Tempo estimado**: 3-4h
  - 📄 [Detalhes](./sprints/sprint-6-export.md#task-025)

- [ ] **TASK-026**: Exportar para Excel `[FEAT]` ⭐
  - Função para gerar XLSX com SheetJS
  - 2 planilhas: Transações + Resumo
  - **Critérios**: Gerado no cliente, valores como número (não string), datas formatadas DD/MM/YYYY
  - **Tempo estimado**: 3-4h
  - 📄 [Detalhes](./sprints/sprint-6-export.md#task-026)

- [ ] **TASK-027**: Filtros avançados no histórico `[UI]` 📌
  - Adicionar painel de filtros em /transacoes
  - Filtros: período custom, categoria (multi), tipo, valor min/max
  - **Critérios**: Filtros persistem na página, contador de filtros ativos, limpar com 1 clique, contagem de resultados
  - **Tempo estimado**: 3-4h
  - 📄 [Detalhes](./sprints/sprint-6-export.md#task-027)

---

## 📧 Sprint 7: Notificações e Polimento

**Objetivo**: Resumo semanal e refinamentos de UX  
**Estimativa**: 3-4 dias  
**Status**: 🔴 Not Started (0/3 tasks)

### Tasks

- [ ] **TASK-028**: Resumo semanal por e-mail `[FEAT]` 📌
  - Edge Function para enviar resumo semanal
  - Conteúdo: total gasto, top 3 categorias, progresso dos orçamentos
  - Agendar com pg_cron para segunda 9h BRT
  - Integração Resend
  - **Critérios**: Email chega segunda ~9h, responsivo, não envia se sem transações, link abre dashboard
  - **Tempo estimado**: 4-5h
  - 📄 [Detalhes](./sprints/sprint-7-polish.md#task-028)

- [ ] **TASK-029**: Estados de loading e erro globais `[UI]` 🔥
  - Skeleton loaders em todas as listas
  - Mensagem de erro com "Tentar novamente"
  - Toast de sucesso/erro em todas as mutações
  - Confirmação antes de deletar (AlertDialog)
  - **Critérios**: Nenhuma tela branca em loading, erros recuperáveis, toasts 4s e dismissable
  - **Tempo estimado**: 3-4h
  - 📄 [Detalhes](./sprints/sprint-7-polish.md#task-029)

- [ ] **TASK-030**: Testes de fumaça end-to-end `[TEST]` 🔥
  - Testar 8 fluxos críticos manualmente
  - Chrome Android + Safari iOS
  - Modo PWA instalado
  - **Critérios**: Todos os 8 fluxos funcionam sem erro nos 2 browsers + PWA
  - **Tempo estimado**: 2-3h
  - 📄 [Detalhes](./sprints/sprint-7-polish.md#task-030)

---

## 📈 Estatísticas

### Por Sprint
| Sprint | Tasks | Completas | Em Progresso | Pendentes | % Completo |
|--------|-------|-----------|--------------|-----------|------------|
| Sprint 0 | 6 | 0 | 0 | 6 | 0% |
| Sprint 1 | 4 | 0 | 0 | 4 | 0% |
| Sprint 2 | 4 | 0 | 0 | 4 | 0% |
| Sprint 3 | 3 | 0 | 0 | 3 | 0% |
| Sprint 4 | 2 | 0 | 0 | 2 | 0% |
| Sprint 5 | 5 | 0 | 0 | 5 | 0% |
| Sprint 6 | 3 | 0 | 0 | 3 | 0% |
| Sprint 7 | 3 | 0 | 0 | 3 | 0% |
| **TOTAL** | **30** | **0** | **0** | **30** | **0%** |

### Por Tipo
| Tipo | Quantidade | % Total |
|------|------------|---------|
| `[SETUP]` | 4 | 13.3% |
| `[FEAT]` | 11 | 36.7% |
| `[UI]` | 9 | 30.0% |
| `[API]` | 5 | 16.7% |
| `[TEST]` | 1 | 3.3% |

### Por Prioridade
| Prioridade | Quantidade | % Total |
|------------|------------|---------|
| 🔥 Critical | 7 | 23.3% |
| ⭐ High | 15 | 50.0% |
| 📌 Medium | 8 | 26.7% |

---

## 🚫 Bloqueios Atuais

*Nenhum bloqueio identificado no momento.*

---

## 📝 Notas de Progresso

### Março 2026
- ✨ Estrutura de specs modulares criada
- 📚 Documentação completa das 7 sprints
- 🎯 30 tasks mapeadas com critérios de aceitação

---

## 🔗 Links Relacionados

- [📚 README das Specs](./README.md)
- [🔧 Guia de Setup](./SETUP.md)
- [📋 Spec Original](../finance-app-specs.md)
- [🤖 AGENTS.md](../AGENTS.md)

---

**Como usar este documento:**
1. Marque tasks como `[x]` quando completadas
2. Atualize % de progresso manualmente
3. Documente bloqueios na seção apropriada
4. Adicione notas de progresso com data
5. Mantenha estatísticas atualizadas

**Última atualização**: Março 2026
