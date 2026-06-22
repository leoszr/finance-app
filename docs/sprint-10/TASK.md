# Sprint 10 — Geração de PDF local

## Objetivo

Gerar PDF mensal diretamente no celular.

## Entrega da sprint

- Branch: `feature/sprint-10-pdf-export`
- Commit final sugerido: `feat(reports): add local pdf report generation`
- Fase do plano: `Fase 8 — Relatórios e PDF`
- Resultado deve ser pequeno, revisável e testável.

## Regras da sprint

- [x] Criar uma feature branch para a sprint.
- [x] Manter as alterações coesas ao objetivo da sprint.
- [x] Atualizar ou criar testes junto com a implementação.
- [x] Executar `npm test` e `npm run lint` antes do commit final.
- [x] Não adicionar backend, Supabase, PostgreSQL, Java backend, API externa, IA ou sync automático.
- [x] Atualizar `docs/sprint-10/PROGRESS.md` com evidências reais.

## Tasks

### T1001 — Instalar ferramentas de PDF local

- Status: done
- Feature: Ferramentas de PDF local
- Plano: `PLAN.md` > `Fase 8 — Relatórios e PDF`
- Dependências: T0905

#### Requisitos funcionais

- [x] Adicionar geração e compartilhamento de PDF.
- [x] Dependências prováveis: `expo-print`, `expo-sharing`, `expo-file-system`.
- [x] App compila.
- [x] Nenhuma dependência de backend adicionada.

#### Requisitos técnicos

- [x] Gerar PDF no dispositivo.
- [x] Usar APIs Expo locais para impressão, arquivo e compartilhamento.
- [x] Tratar erro sem perder dados financeiros.
- [x] Mockar APIs Expo nos testes automatizados.

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

- [x] Dependências prováveis: `expo-print`, `expo-sharing`, `expo-file-system`.
- [x] App compila.
- [x] Nenhuma dependência de backend adicionada.

#### Testes e verificação

- [x] Adicionar teste cobrindo `Instalar ferramentas de PDF local` em arquivo de teste da sprint.
- [x] Cobrir pelo menos: Dependências prováveis: `expo-print`, `expo-sharing`, `expo-file-system`.
- [x] Executar `npm test` com a suíte atualizada.
- [x] Executar `npm run lint` sem erros novos.

### T1002 — Criar template HTML do relatório

- Status: done
- Feature: Template HTML do relatório
- Plano: `PLAN.md` > `Fase 8 — Relatórios e PDF`
- Dependências: T1001

#### Requisitos funcionais

- [x] Transformar dados financeiros em HTML.
- [x] HTML inclui título.
- [x] HTML inclui mês.
- [x] HTML inclui receitas, despesas e saldo.
- [x] HTML inclui tabela de categorias.
- [x] HTML inclui tabela de transações.
- [x] Layout A4 tem título, totais e tabelas sem sobreposição.

#### Requisitos técnicos

- [x] Gerar PDF no dispositivo.
- [x] Usar APIs Expo locais para impressão, arquivo e compartilhamento.
- [x] Tratar erro sem perder dados financeiros.

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

- [x] HTML inclui título.
- [x] HTML inclui mês.
- [x] HTML inclui receitas, despesas e saldo.
- [x] HTML inclui tabela de categorias.
- [x] HTML inclui tabela de transações.
- [x] Layout A4 tem título, totais e tabelas sem sobreposição.

#### Testes e verificação

- [x] Adicionar teste cobrindo `Criar template HTML do relatório` em arquivo de teste da sprint.
- [x] Cobrir pelo menos: HTML inclui título.
- [x] Executar `npm test` com a suíte atualizada.
- [x] Executar `npm run lint` sem erros novos.

### T1003 — Criar função de geração de PDF

- Status: done
- Feature: Função de geração de PDF
- Plano: `PLAN.md` > `Fase 8 — Relatórios e PDF`
- Dependências: T1002

#### Requisitos funcionais

- [x] Converter HTML em PDF local.
- [x] Função recebe dados do relatório.
- [x] Gera arquivo PDF.
- [x] Retorna URI local.
- [x] Trata erro de geração.

#### Requisitos técnicos

- [x] Gerar PDF no dispositivo.
- [x] Usar APIs Expo locais para impressão, arquivo e compartilhamento.
- [x] Tratar erro sem perder dados financeiros.
- [x] Mockar APIs Expo nos testes automatizados.

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

- [x] Função recebe dados do relatório.
- [x] Gera arquivo PDF.
- [x] Retorna URI local.
- [x] Trata erro de geração.

#### Testes e verificação

- [x] Adicionar teste cobrindo `Criar função de geração de PDF` em arquivo de teste da sprint.
- [x] Cobrir pelo menos: Função recebe dados do relatório.
- [x] Executar `npm test` com a suíte atualizada.
- [x] Executar `npm run lint` sem erros novos.

### T1004 — Criar botão Gerar PDF

- Status: done
- Feature: Botão Gerar PDF
- Plano: `PLAN.md` > `Fase 8 — Relatórios e PDF`
- Dependências: T1003

#### Requisitos funcionais

- [x] Permitir gerar relatório pela interface.
- [x] Botão aparece na tela de relatórios.
- [x] Botão gera PDF do mês selecionado.
- [x] Botão mostra loading durante geração.
- [x] Erro exibido se geração falhar.

#### Requisitos técnicos

- [x] Gerar PDF no dispositivo.
- [x] Usar APIs Expo locais para impressão, arquivo e compartilhamento.
- [x] Tratar erro sem perder dados financeiros.
- [x] Mockar APIs Expo nos testes automatizados.

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

- [x] Botão aparece na tela de relatórios.
- [x] Botão gera PDF do mês selecionado.
- [x] Botão mostra loading durante geração.
- [x] Erro exibido se geração falhar.

#### Testes e verificação

- [x] Adicionar teste cobrindo `Criar botão Gerar PDF` em arquivo de teste da sprint.
- [x] Cobrir pelo menos: Botão aparece na tela de relatórios.
- [x] Executar `npm test` com a suíte atualizada.
- [x] Executar `npm run lint` sem erros novos.

### T1005 — Criar compartilhamento do PDF

- Status: done
- Feature: Compartilhamento do PDF
- Plano: `PLAN.md` > `Fase 8 — Relatórios e PDF`
- Dependências: T1004

#### Requisitos funcionais

- [x] Abrir menu nativo de compartilhamento.
- [x] Após gerar PDF, usuário pode compartilhar.
- [x] Funciona em iOS.
- [x] Funciona em Android.
- [x] Sem compartilhamento disponível, mostra mensagem alternativa.

#### Requisitos técnicos

- [x] Gerar PDF no dispositivo.
- [x] Usar APIs Expo locais para impressão, arquivo e compartilhamento.
- [x] Tratar erro sem perder dados financeiros.
- [x] Mockar APIs Expo nos testes automatizados.

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

- [x] Após gerar PDF, usuário pode compartilhar.
- [x] Funciona em iOS.
- [x] Funciona em Android.
- [x] Sem compartilhamento disponível, mostra mensagem alternativa.

#### Testes e verificação

- [x] Adicionar teste cobrindo `Criar compartilhamento do PDF` em arquivo de teste da sprint.
- [x] Cobrir pelo menos: Após gerar PDF, usuário pode compartilhar.
- [x] Executar `npm test` com a suíte atualizada.
- [x] Executar `npm run lint` sem erros novos.

## Testes da sprint

- [x] Teste do HTML gerado.
- [x] Teste de presença dos dados no template.
- [x] Teste de função de geração com mock.
- [x] Teste do botão de PDF.
- [x] Teste de erro controlado.
- [x] `npm test` passa.
- [x] `npm run lint` passa.

## Checklist final

- [x] App abre sem tela branca.
- [x] `npm test` passa com os testes adicionados na sprint.
- [x] `npm run lint` passa sem erros.
- [x] Não há chamada de rede para dados financeiros.
- [x] Não há dependência proibida adicionada.
- [x] `docs/sprint-10/PROGRESS.md` descreve o que foi entregue.
