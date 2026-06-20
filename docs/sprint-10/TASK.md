# Sprint 10 — Geração de PDF local

## Objetivo

Gerar PDF mensal diretamente no celular.

## Entrega da sprint

- Branch: `feature/sprint-10-pdf-export`
- Commit final sugerido: `feat(reports): add local pdf report generation`
- Fase do plano: `Fase 8 — Relatórios e PDF`
- Resultado deve ser pequeno, revisável e testável.

## Regras da sprint

- [ ] Criar uma feature branch para a sprint.
- [ ] Manter as alterações coesas ao objetivo da sprint.
- [ ] Atualizar ou criar testes junto com a implementação.
- [ ] Executar `npm test` e `npm run lint` antes do commit final.
- [ ] Não adicionar backend, Supabase, PostgreSQL, Java backend, API externa, IA ou sync automático.
- [ ] Atualizar `docs/sprint-10/PROGRESS.md` com evidências reais.

## Tasks

### T1001 — Instalar ferramentas de PDF local

- Status: todo
- Feature: Ferramentas de PDF local
- Plano: `PLAN.md` > `Fase 8 — Relatórios e PDF`
- Dependências: T0905

#### Requisitos funcionais

- [ ] Adicionar geração e compartilhamento de PDF.
- [ ] Dependências prováveis: `expo-print`, `expo-sharing`, `expo-file-system`.
- [ ] App compila.
- [ ] Nenhuma dependência de backend adicionada.

#### Requisitos técnicos

- [ ] Gerar PDF no dispositivo.
- [ ] Usar APIs Expo locais para impressão, arquivo e compartilhamento.
- [ ] Tratar erro sem perder dados financeiros.
- [ ] Mockar APIs Expo nos testes automatizados.

#### Arquivos prováveis

- `src/features/reports/pdf/`
- `src/lib/pdf/`
- `package.json`
- `app.json`
- `src/tests/features/reports/pdf/`

#### Passos sugeridos

1. Ler os arquivos prováveis e confirmar a estrutura existente.
2. Implementar somente o necessário para a feature desta task.
3. Adicionar ou atualizar testes específicos da task.
4. Rodar testes e lint.
5. Registrar evidências em `docs/sprint-10/PROGRESS.md`.

#### Critérios de aceite

- [ ] Dependências prováveis: `expo-print`, `expo-sharing`, `expo-file-system`.
- [ ] App compila.
- [ ] Nenhuma dependência de backend adicionada.

#### Testes e verificação

- [ ] Adicionar teste cobrindo `Instalar ferramentas de PDF local` em arquivo de teste da sprint.
- [ ] Cobrir pelo menos: Dependências prováveis: `expo-print`, `expo-sharing`, `expo-file-system`.
- [ ] Executar `npm test` com a suíte atualizada.
- [ ] Executar `npm run lint` sem erros novos.

### T1002 — Criar template HTML do relatório

- Status: todo
- Feature: Template HTML do relatório
- Plano: `PLAN.md` > `Fase 8 — Relatórios e PDF`
- Dependências: T1001

#### Requisitos funcionais

- [ ] Transformar dados financeiros em HTML.
- [ ] HTML inclui título.
- [ ] HTML inclui mês.
- [ ] HTML inclui receitas, despesas e saldo.
- [ ] HTML inclui tabela de categorias.
- [ ] HTML inclui tabela de transações.
- [ ] Layout A4 tem título, totais e tabelas sem sobreposição.

#### Requisitos técnicos

- [ ] Gerar PDF no dispositivo.
- [ ] Usar APIs Expo locais para impressão, arquivo e compartilhamento.
- [ ] Tratar erro sem perder dados financeiros.

#### Arquivos prováveis

- `src/features/reports/`
- `src/db/queries/reportQueries.ts`
- `src/features/reports/pdf/`
- `src/lib/pdf/`

#### Passos sugeridos

1. Ler os arquivos prováveis e confirmar a estrutura existente.
2. Implementar somente o necessário para a feature desta task.
3. Adicionar ou atualizar testes específicos da task.
4. Rodar testes e lint.
5. Registrar evidências em `docs/sprint-10/PROGRESS.md`.

#### Critérios de aceite

- [ ] HTML inclui título.
- [ ] HTML inclui mês.
- [ ] HTML inclui receitas, despesas e saldo.
- [ ] HTML inclui tabela de categorias.
- [ ] HTML inclui tabela de transações.
- [ ] Layout A4 tem título, totais e tabelas sem sobreposição.

#### Testes e verificação

- [ ] Adicionar teste cobrindo `Criar template HTML do relatório` em arquivo de teste da sprint.
- [ ] Cobrir pelo menos: HTML inclui título.
- [ ] Executar `npm test` com a suíte atualizada.
- [ ] Executar `npm run lint` sem erros novos.

### T1003 — Criar função de geração de PDF

- Status: todo
- Feature: Função de geração de PDF
- Plano: `PLAN.md` > `Fase 8 — Relatórios e PDF`
- Dependências: T1002

#### Requisitos funcionais

- [ ] Converter HTML em PDF local.
- [ ] Função recebe dados do relatório.
- [ ] Gera arquivo PDF.
- [ ] Retorna URI local.
- [ ] Trata erro de geração.

#### Requisitos técnicos

- [ ] Gerar PDF no dispositivo.
- [ ] Usar APIs Expo locais para impressão, arquivo e compartilhamento.
- [ ] Tratar erro sem perder dados financeiros.
- [ ] Mockar APIs Expo nos testes automatizados.

#### Arquivos prováveis

- `src/features/reports/pdf/`
- `src/lib/pdf/`
- `package.json`
- `app.json`
- `src/tests/features/reports/pdf/`

#### Passos sugeridos

1. Ler os arquivos prováveis e confirmar a estrutura existente.
2. Implementar somente o necessário para a feature desta task.
3. Adicionar ou atualizar testes específicos da task.
4. Rodar testes e lint.
5. Registrar evidências em `docs/sprint-10/PROGRESS.md`.

#### Critérios de aceite

- [ ] Função recebe dados do relatório.
- [ ] Gera arquivo PDF.
- [ ] Retorna URI local.
- [ ] Trata erro de geração.

#### Testes e verificação

- [ ] Adicionar teste cobrindo `Criar função de geração de PDF` em arquivo de teste da sprint.
- [ ] Cobrir pelo menos: Função recebe dados do relatório.
- [ ] Executar `npm test` com a suíte atualizada.
- [ ] Executar `npm run lint` sem erros novos.

### T1004 — Criar botão Gerar PDF

- Status: todo
- Feature: Botão Gerar PDF
- Plano: `PLAN.md` > `Fase 8 — Relatórios e PDF`
- Dependências: T1003

#### Requisitos funcionais

- [ ] Permitir gerar relatório pela interface.
- [ ] Botão aparece na tela de relatórios.
- [ ] Botão gera PDF do mês selecionado.
- [ ] Botão mostra loading durante geração.
- [ ] Erro exibido se geração falhar.

#### Requisitos técnicos

- [ ] Gerar PDF no dispositivo.
- [ ] Usar APIs Expo locais para impressão, arquivo e compartilhamento.
- [ ] Tratar erro sem perder dados financeiros.
- [ ] Mockar APIs Expo nos testes automatizados.

#### Arquivos prováveis

- `src/features/reports/`
- `src/db/queries/reportQueries.ts`
- `src/features/reports/pdf/`
- `src/lib/pdf/`

#### Passos sugeridos

1. Ler os arquivos prováveis e confirmar a estrutura existente.
2. Implementar somente o necessário para a feature desta task.
3. Adicionar ou atualizar testes específicos da task.
4. Rodar testes e lint.
5. Registrar evidências em `docs/sprint-10/PROGRESS.md`.

#### Critérios de aceite

- [ ] Botão aparece na tela de relatórios.
- [ ] Botão gera PDF do mês selecionado.
- [ ] Botão mostra loading durante geração.
- [ ] Erro exibido se geração falhar.

#### Testes e verificação

- [ ] Adicionar teste cobrindo `Criar botão Gerar PDF` em arquivo de teste da sprint.
- [ ] Cobrir pelo menos: Botão aparece na tela de relatórios.
- [ ] Executar `npm test` com a suíte atualizada.
- [ ] Executar `npm run lint` sem erros novos.

### T1005 — Criar compartilhamento do PDF

- Status: todo
- Feature: Compartilhamento do PDF
- Plano: `PLAN.md` > `Fase 8 — Relatórios e PDF`
- Dependências: T1004

#### Requisitos funcionais

- [ ] Abrir menu nativo de compartilhamento.
- [ ] Após gerar PDF, usuário pode compartilhar.
- [ ] Funciona em iOS.
- [ ] Funciona em Android.
- [ ] Sem compartilhamento disponível, mostra mensagem alternativa.

#### Requisitos técnicos

- [ ] Gerar PDF no dispositivo.
- [ ] Usar APIs Expo locais para impressão, arquivo e compartilhamento.
- [ ] Tratar erro sem perder dados financeiros.
- [ ] Mockar APIs Expo nos testes automatizados.

#### Arquivos prováveis

- `src/features/reports/pdf/`
- `src/lib/pdf/`
- `package.json`
- `app.json`
- `src/tests/features/reports/pdf/`

#### Passos sugeridos

1. Ler os arquivos prováveis e confirmar a estrutura existente.
2. Implementar somente o necessário para a feature desta task.
3. Adicionar ou atualizar testes específicos da task.
4. Rodar testes e lint.
5. Registrar evidências em `docs/sprint-10/PROGRESS.md`.

#### Critérios de aceite

- [ ] Após gerar PDF, usuário pode compartilhar.
- [ ] Funciona em iOS.
- [ ] Funciona em Android.
- [ ] Sem compartilhamento disponível, mostra mensagem alternativa.

#### Testes e verificação

- [ ] Adicionar teste cobrindo `Criar compartilhamento do PDF` em arquivo de teste da sprint.
- [ ] Cobrir pelo menos: Após gerar PDF, usuário pode compartilhar.
- [ ] Executar `npm test` com a suíte atualizada.
- [ ] Executar `npm run lint` sem erros novos.

## Testes da sprint

- [ ] Teste do HTML gerado.
- [ ] Teste de presença dos dados no template.
- [ ] Teste de função de geração com mock.
- [ ] Teste do botão de PDF.
- [ ] Teste de erro controlado.
- [ ] `npm test` passa.
- [ ] `npm run lint` passa.

## Checklist final

- [ ] App abre sem tela branca.
- [ ] `npm test` passa com os testes adicionados na sprint.
- [ ] `npm run lint` passa sem erros.
- [ ] Não há chamada de rede para dados financeiros.
- [ ] Não há dependência proibida adicionada.
- [ ] `docs/sprint-10/PROGRESS.md` descreve o que foi entregue.
