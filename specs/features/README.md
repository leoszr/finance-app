# Features do Finance App

Este diretório contém especificações detalhadas de todas as features do aplicativo de gestão financeira.

## 📑 Índice de Features

### 🔴 Críticas (Sprint 0-2)
1. **[authentication.md](./authentication.md)** - Sistema de autenticação Google OAuth
   - Login sem senha
   - Middleware de proteção de rotas
   - Geração automática de categorias
   - Sessão persistente com refresh automático
   - **1001 linhas** | Sprint 0

2. **[transactions.md](./transactions.md)** - Gerenciamento de transações
   - CRUD completo de receitas e despesas
   - Recorrências automáticas
   - Categorização com ícones
   - Filtros por mês e categoria
   - **1181 linhas** | Sprint 1

3. **[dashboard.md](./dashboard.md)** - Dashboard e visualizações
   - Resumo financeiro do mês
   - Gráfico de pizza (gastos por categoria)
   - Últimas transações
   - Comparativo mensal (6 meses)
   - **998 linhas** | Sprint 2

### 🟡 Altas (Sprint 3)
4. **[budgets.md](./budgets.md)** - Orçamentos mensais
   - Definir limites por categoria
   - Acompanhamento visual com barras de progresso
   - Alertas quando próximo/acima do limite
   - Copiar orçamentos entre meses
   - Sugestões baseadas em histórico
   - **1065 linhas** | Sprint 3

5. **[goals.md](./goals.md)** - Metas financeiras
   - Meta de economia mensal
   - Meta com objetivo final e prazo
   - Adicionar valores manualmente
   - Progresso visual
   - Alertas de prazo próximo
   - **833 linhas** | Sprint 3

### 🟢 Médias (Sprint 4-5)
6. **[investments.md](./investments.md)** - Investimentos em renda fixa
   - Cadastro de CDB, Tesouro, LCI/LCA, Poupança
   - Portfólio com total investido
   - Calculadora de rentabilidade
   - Integração com API do BCB (Selic/CDI/IPCA)
   - **602 linhas** | Sprint 5

7. **[csv-import.md](./csv-import.md)** - Importação de CSV
   - Upload de fatura do Nubank
   - Parsing automático
   - Pré-visualização com seleção
   - Sugestão de categorias
   - Importação em batch
   - **523 linhas** | Sprint 4

### 🔵 Baixas (Sprint 6)
8. **[export.md](./export.md)** - Exportação de dados
   - Exportar extrato em PDF
   - Exportar transações em Excel
   - Geração client-side (sem servidor)
   - **487 linhas** | Sprint 6

---

## 📊 Estatísticas

- **Total de features:** 8
- **Total de linhas:** 6.690
- **Média por feature:** 836 linhas
- **Maior feature:** transactions.md (1.181 linhas)
- **Menor feature:** export.md (487 linhas)

---

## 📝 Estrutura dos Arquivos

Cada arquivo de feature segue o mesmo template:

1. **Metadados** - Status, prioridade, sprint, tasks, estimativa
2. **Visão Geral** - Objetivos e descrição da funcionalidade
3. **Requisitos Funcionais** - RF-001, RF-002, etc.
4. **User Stories** - Cenários em Gherkin
5. **Schema de Dados** - Tabelas, campos, constraints SQL
6. **Componentes React** - Código TypeScript completo
7. **Hooks e Utilities** - Lógica reutilizável
8. **Validações Zod** - Schemas de validação
9. **Estados de UI** - Loading, error, empty, success
10. **Edge Cases** - Casos extremos e tratamento
11. **Queries Supabase** - Exemplos de consultas
12. **Testes Sugeridos** - Unitários e E2E
13. **Links para Tasks** - Referências ao TASK-XXX

---

## 🎯 Como Usar

### Para Desenvolvedores

1. Leia a feature completa antes de começar a implementação
2. Siga os exemplos de código fornecidos (TypeScript strict)
3. Implemente os testes sugeridos
4. Valide os critérios de aceitação das user stories
5. Marque as tasks relacionadas como concluídas

### Para Product Owners

1. Use as user stories para validar o comportamento
2. Verifique os edge cases contemplados
3. Aprove ou solicite ajustes nos requisitos funcionais
4. Acompanhe o progresso pelas tasks vinculadas

### Para QA

1. Use os cenários Gherkin para criar casos de teste
2. Valide todos os edge cases documentados
3. Execute os testes sugeridos (unitários e E2E)
4. Teste estados de loading, error e empty

---

## 🔗 Documentos Relacionados

- **[finance-app-specs.md](../../finance-app-specs.md)** - Especificação completa do projeto
- **[AGENTS.md](../../AGENTS.md)** - Guia para desenvolvimento (stack, code style, comandos)
- **[SETUP.md](../SETUP.md)** - Instruções de configuração do ambiente
- **[sprints/](../sprints/)** - Planejamento detalhado de cada sprint

---

## ✅ Checklist de Qualidade

Antes de considerar uma feature completa, verifique:

- [ ] Todos os RF (Requisitos Funcionais) implementados
- [ ] User stories validadas (cenários passando)
- [ ] Schema de dados criado com RLS habilitado
- [ ] Componentes React seguem code style do AGENTS.md
- [ ] Validações Zod implementadas
- [ ] Estados de UI (loading/error/empty) tratados
- [ ] Edge cases cobertos
- [ ] Testes unitários e E2E criados e passando
- [ ] TypeScript strict (sem `any`, sem type casting)
- [ ] Mobile-first (testado em 375px)
- [ ] Dark mode funcionando
- [ ] Acessibilidade (ARIA labels, keyboard navigation)

---

**Última atualização:** Março 2026  
**Versão das specs:** 1.0  
**Responsável:** Squad de Desenvolvimento Finance App
