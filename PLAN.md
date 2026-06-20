# Plano de Implementação

## Objetivo

Construir um app mobile de tracker financeiro pessoal, local-first, iPhone primeiro e Android compatível.

Stack alvo:

- Expo
- React Native
- TypeScript
- SQLite local
- Drizzle

O app deve permitir cadastrar contas e categorias, registrar receitas e despesas, consultar transações,
visualizar resumo mensal, gerar relatórios locais, exportar/importar backup manual e operar sem conexão com internet.

## Estado Atual

- Projeto sem código-fonte detectado neste repositório no momento da criação deste plano.
- Não há evidência atual de `package.json`, app Expo, banco, testes, lint ou documentação anterior.
- Este plano parte do escopo informado pelo usuário como base de produto.

## Estado Alvo

- App Expo com TypeScript executando em iOS e Android.
- Dados financeiros persistidos em SQLite local.
- Sem backend, Supabase, PostgreSQL remoto, Java backend, API externa, login obrigatório, IA ou sync.
- Camadas separadas: UI, domínio financeiro, repositórios locais, banco SQLite, relatórios e backup.
- Suíte de testes e lint rodando a cada sprint.
- Documentação por sprint em `docs/sprint-XX/` com `TASK.md` e `PROGRESS.md`.

## Arquitetura / Módulos Principais

```txt
Expo App
  |
  |-- UI React Native
  |-- navegação mobile
  |-- domínio financeiro em TypeScript
  |-- validações locais
  |-- repositórios locais
  |-- SQLite local + migrations
  |-- gráficos locais
  |-- relatórios locais
  |-- geração de PDF local
  |-- backup/export/import manual
  `-- configurações e segurança local opcional
```

Regra arquitetural principal:

```txt
Toda informação financeira nasce, vive e é consultada primeiro no SQLite local.
```

## Fases de Implementação

### Fase 1 — Fundação técnica

- Resultado esperado: projeto Expo TypeScript, estrutura de pastas, lint, testes e tela inicial.
- Dependências: Node/npm, Expo CLI via `npx`, ambiente React Native.
- Riscos: versões de Expo e Jest podem exigir ajustes de configuração.

### Fase 2 — Persistência local

- Resultado esperado: SQLite + Drizzle, schema inicial, migrations e inicialização segura do banco.
- Dependências: `expo-sqlite`, `drizzle-orm` e tooling de migrations compatível com Expo.
- Riscos: diferenças de API entre versões do `expo-sqlite` e suporte de testes para SQLite.

### Fase 3 — Domínio financeiro

- Resultado esperado: helpers puros de dinheiro, datas e validações.
- Dependências: TypeScript e runner de testes.
- Riscos: parsing monetário brasileiro e timezone local precisam ser bem testados.

### Fase 4 — Repositórios locais

- Resultado esperado: CRUD de contas, categorias, transações e configurações sem SQL na UI.
- Dependências: schema e inicialização do banco.
- Riscos: integridade referencial, bloqueio de exclusão e testes de banco local.

### Fase 5 — Navegação e layout base

- Resultado esperado: abas principais, shell visual, componentes base, estados vazios, loading e erro.
- Dependências: Expo Router ou React Navigation, safe area e testes de componentes.
- Riscos: compatibilidade visual entre iPhone e Android.

### Fase 6 — Gestão financeira básica

- Resultado esperado: telas de contas, categorias e transações com CRUD, validação e persistência.
- Dependências: repositórios e componentes base.
- Riscos: fluxos de formulário, teclado mobile e consistência entre tipo e categoria.

### Fase 7 — Consulta mensal e dashboard

- Resultado esperado: filtros por mês/tipo/conta/busca, resumo filtrado, dashboard e gráficos locais básicos.
- Dependências: transações persistidas e queries agregadas.
- Riscos: performance de agregações e visualização em telas pequenas.

### Fase 8 — Relatórios e PDF

- Resultado esperado: relatório mensal local, comparação com mês anterior, resumo por regras e PDF.
- Dependências: dados agregados, `expo-print`, `expo-sharing`, `expo-file-system`.
- Riscos: geração e compartilhamento de PDF variam entre iOS e Android.

### Fase 9 — Backup, configurações e segurança

- Resultado esperado: export/import JSON, configurações locais e bloqueio biométrico opcional.
- Dependências: repositórios, file picker/sharing e APIs locais de autenticação.
- Riscos: importação destrutiva exige confirmação explícita; segurança não deve bloquear dados.

### Fase 10 — Polimento e release interno

- Resultado esperado: UX mobile refinada, acessibilidade básica, demo data, checklist e build EAS.
- Dependências: dashboard, relatórios e backup implementados.
- Riscos: configuração EAS/iOS depende de contas e credenciais externas do desenvolvedor.

## Organização da Documentação

- `PLAN.md`: visão geral e ordem de implementação.
- `TASK.md`: índice global das sprints.
- `PROGRESS.md`: progresso global do projeto.
- `docs/sprint-XX/TASK.md`: tarefas detalhadas, requisitos, arquivos prováveis e testes.
- `docs/sprint-XX/PROGRESS.md`: resumo do que foi desenvolvido e evidências da sprint.

## Dependências e Premissas

- Stack alvo: Expo + React Native + TypeScript + SQLite + Drizzle.
- Plataforma principal: iPhone; Android deve permanecer compatível.
- App local-first, sem backend.
- Valores monetários armazenados como inteiros em centavos.
- Moeda padrão: BRL.
- Relatórios, PDF, backup e segurança são locais.
- Assunção: o projeto deve começar do zero neste repositório.
- Assunção: branches e commits seguirão o padrão descrito em cada sprint.

## Riscos

- Migrations locais em app mobile podem exigir estratégia específica para updates futuros.
- Importação de backup com substituição total pode causar perda de dados se a UX for fraca.
- Geração de PDF e compartilhamento podem divergir por plataforma.
- Bloqueio biométrico é conveniência local, não substitui criptografia completa do banco.
- Gráficos precisam ser escolhidos com cuidado para não adicionar dependência pesada.

## Ordem Recomendada

1. Sprint 0 — Fundação do projeto
2. Sprint 1 — Banco local SQLite e migrations
3. Sprint 2 — Camada de domínio financeiro
4. Sprint 3 — Repositórios locais
5. Sprint 4 — Navegação principal e layout base
6. Sprint 5 — Cadastro de contas e categorias
7. Sprint 6 — CRUD de transações
8. Sprint 7 — Filtros, busca e visão mensal
9. Sprint 8 — Dashboard financeiro
10. Sprint 9 — Relatórios locais
11. Sprint 10 — Geração de PDF local
12. Sprint 11 — Exportação e importação de dados
13. Sprint 12 — Configurações locais
14. Sprint 13 — Segurança local básica
15. Sprint 14 — Polimento de experiência mobile
16. Sprint 15 — Hardening e release interno

## Cortes de Produto

### MVP mínimo usável

- Sprints 0 a 8.

### MVP com relatórios

- Sprints 0 a 10.

### MVP com segurança e backup

- Sprints 0 a 13.

### Versão refinada para teste interno

- Sprints 0 a 15.

## Definição de Pronto do Projeto

- Cria contas localmente.
- Cria categorias localmente.
- Registra receitas e despesas.
- Edita e exclui transações.
- Mostra resumo mensal.
- Mostra gráfico por categoria.
- Gera relatório mensal.
- Exporta backup JSON.
- Importa backup JSON.
- Funciona sem internet.
- Mantém dados após reiniciar.
- Não depende de backend.

## Assunções

- Assunção: o nome público do app ainda pode mudar.
- Assunção: nenhum serviço externo será necessário para o MVP.
- Assunção: EAS poderá ser usado somente para build/distribuição na sprint de release.
