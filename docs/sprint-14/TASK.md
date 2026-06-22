# Sprint 14 — Polimento de experiência mobile

## Objetivo

Melhorar usabilidade no iPhone e Android.

## Entrega da sprint

- Branch: `dev`
- Commit final sugerido: `feat(ui): polish mobile finance experience`
- Fase do plano: `Fase 10 — Polimento e release interno`
- Resultado deve ser pequeno, revisável e testável.

## Regras da sprint

- [x] Garantir que o trabalho da sprint será feito na branch `dev`.
- [x] Manter as alterações coesas ao objetivo da sprint.
- [x] Atualizar ou criar testes junto com a implementação.
- [x] Executar `npm test` e `npm run lint` antes do commit final.
- [x] Não adicionar backend, Supabase, PostgreSQL, Java backend, API externa, IA ou sync automático.
- [ ] Ao concluir, abrir PR de `dev` para `main`.
- [x] Atualizar `docs/sprint-14/PROGRESS.md` com evidências reais.

## Tasks

### T1401 — Ajustar layout para telas pequenas

- Status: done
- Feature: Layout para telas pequenas
- Plano: `PLAN.md` > `Fase 10 — Polimento e release interno`
- Dependências: T1304

#### Requisitos funcionais

- [x] Melhorar uso em iPhone.
- [x] Telas não cortam conteúdo em largura de 375px.
- [x] Botões não ficam cortados.
- [x] Formulários são roláveis.
- [x] Teclado não cobre campos importantes.

#### Requisitos técnicos

- [x] Melhorar responsividade para largura pequena.
- [x] Manter acessibilidade básica e feedback visível.
- [x] Evitar mudanças grandes de arquitetura nesta sprint.

#### Arquivos prováveis

- `src/components/`
- `src/theme/`
- `src/features/`

#### Passos sugeridos

1. Ler os arquivos prováveis e confirmar a estrutura existente.
2. Implementar somente o necessário para a feature desta task.
3. Adicionar ou atualizar testes específicos da task.
4. Rodar testes e lint.
5. Registrar evidências em `docs/sprint-14/PROGRESS.md`.

#### Critérios de aceite

- [x] Telas não cortam conteúdo em largura de 375px.
- [x] Botões não ficam cortados.
- [x] Formulários são roláveis.
- [x] Teclado não cobre campos importantes.

#### Testes e verificação

- [x] Adicionar teste cobrindo `Ajustar layout para telas pequenas` em arquivo de teste da sprint.
- [x] Cobrir pelo menos: Telas não cortam conteúdo em largura de 375px.
- [x] Executar `npm test` com a suíte atualizada.
- [x] Executar `npm run lint` sem erros novos.

### T1402 — Melhorar inputs monetários

- Status: done
- Feature: Inputs monetários
- Plano: `PLAN.md` > `Fase 10 — Polimento e release interno`
- Dependências: T1401

#### Requisitos funcionais

- [x] Deixar lançamento de valores mais rápido.
- [x] Teclado numérico abre.
- [x] Valor formatado enquanto digita.
- [x] Campo não aceita letras.
- [x] Valor salvo em centavos.

#### Requisitos técnicos

- [x] Melhorar responsividade para largura pequena.
- [x] Manter acessibilidade básica e feedback visível.
- [x] Evitar mudanças grandes de arquitetura nesta sprint.

#### Arquivos prováveis

- `src/components/ui/MoneyInput.tsx`
- `src/lib/money.ts`
- `src/components/`
- `src/features/`

#### Passos sugeridos

1. Ler os arquivos prováveis e confirmar a estrutura existente.
2. Implementar somente o necessário para a feature desta task.
3. Adicionar ou atualizar testes específicos da task.
4. Rodar testes e lint.
5. Registrar evidências em `docs/sprint-14/PROGRESS.md`.

#### Critérios de aceite

- [x] Teclado numérico abre.
- [x] Valor formatado enquanto digita.
- [x] Campo não aceita letras.
- [x] Valor salvo em centavos.

#### Testes e verificação

- [x] Adicionar teste cobrindo `Melhorar inputs monetários` em arquivo de teste da sprint.
- [x] Cobrir pelo menos: Teclado numérico abre.
- [x] Executar `npm test` com a suíte atualizada.
- [x] Executar `npm run lint` sem erros novos.

### T1403 — Adicionar feedback visual de ações

- Status: done
- Feature: Feedback visual de ações
- Plano: `PLAN.md` > `Fase 10 — Polimento e release interno`
- Dependências: T1402

#### Requisitos funcionais

- [x] Deixar salvamento, exclusão e erro claros.
- [x] Salvar mostra confirmação.
- [x] Excluir mostra confirmação.
- [x] Erro mostra mensagem não técnica e acionável.
- [x] Loading aparece em ações demoradas.

#### Requisitos técnicos

- [x] Melhorar responsividade para largura pequena.
- [x] Manter acessibilidade básica e feedback visível.
- [x] Evitar mudanças grandes de arquitetura nesta sprint.
- [x] Pedir confirmação quando houver remoção de dados.

#### Arquivos prováveis

- `src/components/`
- `src/features/`
- `src/theme/`
- `src/components/feedback/`
- `src/tests/accessibility/`

#### Passos sugeridos

1. Ler os arquivos prováveis e confirmar a estrutura existente.
2. Implementar somente o necessário para a feature desta task.
3. Adicionar ou atualizar testes específicos da task.
4. Rodar testes e lint.
5. Registrar evidências em `docs/sprint-14/PROGRESS.md`.

#### Critérios de aceite

- [x] Salvar mostra confirmação.
- [x] Excluir mostra confirmação.
- [x] Erro mostra mensagem não técnica e acionável.
- [x] Loading aparece em ações demoradas.

#### Testes e verificação

- [x] Adicionar teste cobrindo `Adicionar feedback visual de ações` em arquivo de teste da sprint.
- [x] Cobrir pelo menos: Salvar mostra confirmação.
- [x] Executar `npm test` com a suíte atualizada.
- [x] Executar `npm run lint` sem erros novos.

### T1404 — Melhorar empty states

- Status: done
- Feature: Empty states
- Plano: `PLAN.md` > `Fase 10 — Polimento e release interno`
- Dependências: T1403

#### Requisitos funcionais

- [x] Guiar usuário sem dados.
- [x] Dashboard vazio orienta criar conta/categoria/transação.
- [x] Transações vazias orientam adicionar transação.
- [x] Relatório vazio explica ausência de dados.

#### Requisitos técnicos

- [x] Melhorar responsividade para largura pequena.
- [x] Manter acessibilidade básica e feedback visível.
- [x] Evitar mudanças grandes de arquitetura nesta sprint.

#### Arquivos prováveis

- `src/components/`
- `src/features/`
- `src/theme/`
- `src/components/feedback/`
- `src/tests/accessibility/`

#### Passos sugeridos

1. Ler os arquivos prováveis e confirmar a estrutura existente.
2. Implementar somente o necessário para a feature desta task.
3. Adicionar ou atualizar testes específicos da task.
4. Rodar testes e lint.
5. Registrar evidências em `docs/sprint-14/PROGRESS.md`.

#### Critérios de aceite

- [x] Dashboard vazio orienta criar conta/categoria/transação.
- [x] Transações vazias orientam adicionar transação.
- [x] Relatório vazio explica ausência de dados.

#### Testes e verificação

- [x] Adicionar teste cobrindo `Melhorar empty states` em arquivo de teste da sprint.
- [x] Cobrir pelo menos: Dashboard vazio orienta criar conta/categoria/transação.
- [x] Executar `npm test` com a suíte atualizada.
- [x] Executar `npm run lint` sem erros novos.

### T1405 — Ajustar acessibilidade básica

- Status: done
- Feature: Acessibilidade básica
- Plano: `PLAN.md` > `Fase 10 — Polimento e release interno`
- Dependências: T1404

#### Requisitos funcionais

- [x] Melhorar uso geral.
- [x] Botões principais têm label acessível.
- [x] Contraste mínimo WCAG AA para texto normal.
- [x] Textos importantes não são minúsculos.
- [x] Leitor de tela não quebra navegação.

#### Requisitos técnicos

- [x] Melhorar responsividade para largura pequena.
- [x] Manter acessibilidade básica e feedback visível.
- [x] Evitar mudanças grandes de arquitetura nesta sprint.
- [x] Usar labels acessíveis em controles interativos principais.

#### Arquivos prováveis

- `src/tests/accessibility/`
- `src/components/`
- `src/features/`

#### Passos sugeridos

1. Ler os arquivos prováveis e confirmar a estrutura existente.
2. Implementar somente o necessário para a feature desta task.
3. Adicionar ou atualizar testes específicos da task.
4. Rodar testes e lint.
5. Registrar evidências em `docs/sprint-14/PROGRESS.md`.

#### Critérios de aceite

- [x] Botões principais têm label acessível.
- [x] Contraste mínimo WCAG AA para texto normal.
- [x] Textos importantes não são minúsculos.
- [x] Leitor de tela não quebra navegação.

#### Testes e verificação

- [x] Adicionar teste cobrindo `Ajustar acessibilidade básica` em arquivo de teste da sprint.
- [x] Cobrir pelo menos: Botões principais têm label acessível.
- [x] Executar `npm test` com a suíte atualizada.
- [x] Executar `npm run lint` sem erros novos.

## Testes da sprint

- [x] Teste de formulário com teclado.
- [x] Teste de inputs monetários.
- [x] Teste de mensagens de sucesso.
- [x] Teste de estados vazios.
- [x] Teste básico de acessibilidade nos componentes principais.
- [x] `npm test` passa.
- [x] `npm run lint` passa.

## Checklist final

- [x] App abre sem tela branca.
- [x] `npm test` passa com os testes adicionados na sprint.
- [x] `npm run lint` passa sem erros.
- [x] Não há chamada de rede para dados financeiros.
- [x] Não há dependência proibida adicionada.
- [x] `docs/sprint-14/PROGRESS.md` descreve o que foi entregue.
