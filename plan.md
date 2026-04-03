# Plano da Sprint Atual — Sprint 4 (CSV Import + Categorias)

## Estágio atual

- Branch: `sprint-4-csv-import`
- Sprints concluídas: 0, 1, 2, 3
- Sprint atual: 4 (em andamento)

## Tasks da sprint

### Bloco A — CSV Import
- [x] TASK-018.1 Parser CSV Nubank (`parse-nubank-csv`)
- [x] TASK-018.2 Pré-validação de arquivo e linhas inválidas
- [x] TASK-019.1 Página `/transacoes/importar` em etapas (upload/preview/confirmação)
- [x] TASK-019.2 Importação batch com `source = 'csv_nubank'`
- [x] TASK-019.3 Feedback de sucesso/erro (toast ou alerta)

### Bloco B — Categorias (prioridade adicionada)
- [x] CAT-001 Garantir categorias padrão para usuários existentes também
- [x] CAT-002 Permitir criar categoria manualmente (nome, tipo, cor)
- [x] CAT-003 Expor criação de categoria no fluxo de transações
- [x] CAT-004 Expor criação de categoria no fluxo de importação CSV

### Bloco C — Qualidade / Fechamento
- [x] Atualizar `openspec/changes/sprint-4-csv-import/tasks.md`
- [x] Atualizar `progress.md`
- [x] Rodar `npm run lint`
- [x] Rodar `npm run build`
- [ ] Commit + push
- [ ] Abrir PR `sprint-4-csv-import -> main`

## Estratégia de implementação

1. Concluir importação batch (TASK-019.2/019.3).
2. Implementar categorias padrão idempotentes via RPC + login callback.
3. Implementar criação de categoria (hook + UI reutilizável).
4. Integrar criação de categoria em:
   - formulário de transações
   - página de importação CSV
5. Validar e fechar sprint.
