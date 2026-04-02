# Plano de Sprint — Sprint 4 (CSV Import)

## Estágio atual (2026-04-02)

- Branch ativa: `sprint-4-csv-import`
- Sprint 3 foi encerrada e mergeada na `main` via PR #7.
- Branch anterior de trabalho (`sprint-3-goals-budgets`) foi fechada/removida no remoto.
- Situação do produto:
  - Sprint 0 ✅
  - Sprint 1 ✅
  - Sprint 2 ✅
  - Sprint 3 ✅
  - Sprint 4 ⏳ início

## Objetivo da Sprint 4

Implementar importação de CSV do Nubank com fluxo em etapas:
1. Upload
2. Preview com validação/seleção
3. Importação em lote (`source = 'csv_nubank'`)

## Escopo (OpenSpec)

Referências:
- `openspec/changes/sprint-4-csv-import/tasks.md`
- `openspec/changes/sprint-4-csv-import/design.md`

Tasks alvo:
- [ ] 1.1 Parser CSV Nubank
- [ ] 1.2 Validações de formato e linhas inválidas
- [ ] 2.1 Página de importação em etapas
- [ ] 2.2 Preview com seleção e categoria por linha
- [ ] 3.1 Importação batch com `source = csv_nubank`
- [ ] 3.2 Tratamento de erros e feedback por toast
- [ ] 4.1 Rodar build e registrar validação

## Plano de execução técnico

### Fase A — Base de domínio e parser
- [ ] Criar parser dedicado (ex.: `lib/csv/parse-nubank-csv.ts`)
- [ ] Aceitar BOM UTF-8 e normalizar cabeçalhos
- [ ] Mapear colunas esperadas (`Data`, `Descrição`, `Valor`)
- [ ] Ignorar valores positivos (estorno/pagamento)
- [ ] Retornar estrutura tipada com:
  - linhas válidas
  - linhas inválidas + motivo
  - resumo (total, válidas, inválidas)

### Fase B — Fluxo de UI (3 etapas)
- [ ] Criar página `app/(app)/transacoes/importar/page.tsx`
- [ ] Etapa 1: upload + validação de arquivo
- [ ] Etapa 2: preview com:
  - seleção/deseleção de linha
  - seleção de categoria por linha (obrigatória)
  - contador de linhas selecionadas
- [ ] Etapa 3: confirmação de importação

### Fase C — Importação em lote
- [ ] Montar payload com `type = 'expense'` e `source = 'csv_nubank'`
- [ ] Inserir em batch no Supabase
- [ ] Invalidar cache de `transactions` e `dashboard`
- [ ] Exibir feedback claro de sucesso/erro

### Fase D — Qualidade e fechamento
- [ ] Estados de loading/erro/retry
- [ ] Mensagens pt-BR e acessíveis
- [ ] Rodar:
  - `npm run lint`
  - `npm run build`
- [ ] Atualizar `openspec/changes/sprint-4-csv-import/tasks.md`
- [ ] Atualizar `progress.md`
- [ ] Abrir PR `sprint-4-csv-import -> main`

## Riscos e mitigação

- Risco: CSV com variações de cabeçalho/encoding.
  - Mitigação: parser tolerante + mensagens descritivas.
- Risco: importação com linha sem categoria.
  - Mitigação: bloquear confirmação até 100% categorizado.
- Risco: volume alto degradar UX.
  - Mitigação: processamento incremental + indicadores de progresso.

## Critério de pronto da sprint

- TASK-018 e TASK-019 concluídas.
- Importação real criando transações com `source = 'csv_nubank'`.
- Build/lint verdes.
- Progresso/documentação atualizados.
