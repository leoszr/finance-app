# Sprint 14 — Polimento de experiência mobile

## Objetivo

Melhorar usabilidade no iPhone e Android.

## Entrega da sprint

- Branch: `dev`
- Commit final sugerido: `feat(ui): polish mobile finance experience`
- Fase do plano: `Fase 10 — Polimento e release interno`
- Resultado deve ser pequeno, revisável e testável.

## Regras da sprint

- [ ] Garantir que o trabalho da sprint será feito na branch `dev`.
- [ ] Manter as alterações coesas ao objetivo da sprint.
- [ ] Atualizar ou criar testes junto com a implementação.
- [ ] Executar `npm test` e `npm run lint` antes do commit final.
- [ ] Não adicionar backend, Supabase, PostgreSQL, Java backend, API externa, IA ou sync automático.
- [ ] Ao concluir, abrir PR de `dev` para `main`.
- [ ] Atualizar `docs/sprint-14/PROGRESS.md` com evidências reais.

## Tasks

### T1401 — Ajustar layout para telas pequenas

- Status: todo
- Feature: Layout para telas pequenas
- Plano: `PLAN.md` > `Fase 10 — Polimento e release interno`
- Dependências: T1304

#### Requisitos funcionais

- [ ] Melhorar uso em iPhone.
- [ ] Telas não cortam conteúdo em largura de 375px.
- [ ] Botões não ficam cortados.
- [ ] Formulários são roláveis.
- [ ] Teclado não cobre campos importantes.

#### Requisitos técnicos

- [ ] Melhorar responsividade para largura pequena.
- [ ] Manter acessibilidade básica e feedback visível.
- [ ] Evitar mudanças grandes de arquitetura nesta sprint.

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

- [ ] Telas não cortam conteúdo em largura de 375px.
- [ ] Botões não ficam cortados.
- [ ] Formulários são roláveis.
- [ ] Teclado não cobre campos importantes.

#### Testes e verificação

- [ ] Adicionar teste cobrindo `Ajustar layout para telas pequenas` em arquivo de teste da sprint.
- [ ] Cobrir pelo menos: Telas não cortam conteúdo em largura de 375px.
- [ ] Executar `npm test` com a suíte atualizada.
- [ ] Executar `npm run lint` sem erros novos.

### T1402 — Melhorar inputs monetários

- Status: todo
- Feature: Inputs monetários
- Plano: `PLAN.md` > `Fase 10 — Polimento e release interno`
- Dependências: T1401

#### Requisitos funcionais

- [ ] Deixar lançamento de valores mais rápido.
- [ ] Teclado numérico abre.
- [ ] Valor formatado enquanto digita.
- [ ] Campo não aceita letras.
- [ ] Valor salvo em centavos.

#### Requisitos técnicos

- [ ] Melhorar responsividade para largura pequena.
- [ ] Manter acessibilidade básica e feedback visível.
- [ ] Evitar mudanças grandes de arquitetura nesta sprint.

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

- [ ] Teclado numérico abre.
- [ ] Valor formatado enquanto digita.
- [ ] Campo não aceita letras.
- [ ] Valor salvo em centavos.

#### Testes e verificação

- [ ] Adicionar teste cobrindo `Melhorar inputs monetários` em arquivo de teste da sprint.
- [ ] Cobrir pelo menos: Teclado numérico abre.
- [ ] Executar `npm test` com a suíte atualizada.
- [ ] Executar `npm run lint` sem erros novos.

### T1403 — Adicionar feedback visual de ações

- Status: todo
- Feature: Feedback visual de ações
- Plano: `PLAN.md` > `Fase 10 — Polimento e release interno`
- Dependências: T1402

#### Requisitos funcionais

- [ ] Deixar salvamento, exclusão e erro claros.
- [ ] Salvar mostra confirmação.
- [ ] Excluir mostra confirmação.
- [ ] Erro mostra mensagem não técnica e acionável.
- [ ] Loading aparece em ações demoradas.

#### Requisitos técnicos

- [ ] Melhorar responsividade para largura pequena.
- [ ] Manter acessibilidade básica e feedback visível.
- [ ] Evitar mudanças grandes de arquitetura nesta sprint.
- [ ] Pedir confirmação quando houver remoção de dados.

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

- [ ] Salvar mostra confirmação.
- [ ] Excluir mostra confirmação.
- [ ] Erro mostra mensagem não técnica e acionável.
- [ ] Loading aparece em ações demoradas.

#### Testes e verificação

- [ ] Adicionar teste cobrindo `Adicionar feedback visual de ações` em arquivo de teste da sprint.
- [ ] Cobrir pelo menos: Salvar mostra confirmação.
- [ ] Executar `npm test` com a suíte atualizada.
- [ ] Executar `npm run lint` sem erros novos.

### T1404 — Melhorar empty states

- Status: todo
- Feature: Empty states
- Plano: `PLAN.md` > `Fase 10 — Polimento e release interno`
- Dependências: T1403

#### Requisitos funcionais

- [ ] Guiar usuário sem dados.
- [ ] Dashboard vazio orienta criar conta/categoria/transação.
- [ ] Transações vazias orientam adicionar transação.
- [ ] Relatório vazio explica ausência de dados.

#### Requisitos técnicos

- [ ] Melhorar responsividade para largura pequena.
- [ ] Manter acessibilidade básica e feedback visível.
- [ ] Evitar mudanças grandes de arquitetura nesta sprint.

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

- [ ] Dashboard vazio orienta criar conta/categoria/transação.
- [ ] Transações vazias orientam adicionar transação.
- [ ] Relatório vazio explica ausência de dados.

#### Testes e verificação

- [ ] Adicionar teste cobrindo `Melhorar empty states` em arquivo de teste da sprint.
- [ ] Cobrir pelo menos: Dashboard vazio orienta criar conta/categoria/transação.
- [ ] Executar `npm test` com a suíte atualizada.
- [ ] Executar `npm run lint` sem erros novos.

### T1405 — Ajustar acessibilidade básica

- Status: todo
- Feature: Acessibilidade básica
- Plano: `PLAN.md` > `Fase 10 — Polimento e release interno`
- Dependências: T1404

#### Requisitos funcionais

- [ ] Melhorar uso geral.
- [ ] Botões principais têm label acessível.
- [ ] Contraste mínimo WCAG AA para texto normal.
- [ ] Textos importantes não são minúsculos.
- [ ] Leitor de tela não quebra navegação.

#### Requisitos técnicos

- [ ] Melhorar responsividade para largura pequena.
- [ ] Manter acessibilidade básica e feedback visível.
- [ ] Evitar mudanças grandes de arquitetura nesta sprint.
- [ ] Usar labels acessíveis em controles interativos principais.

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

- [ ] Botões principais têm label acessível.
- [ ] Contraste mínimo WCAG AA para texto normal.
- [ ] Textos importantes não são minúsculos.
- [ ] Leitor de tela não quebra navegação.

#### Testes e verificação

- [ ] Adicionar teste cobrindo `Ajustar acessibilidade básica` em arquivo de teste da sprint.
- [ ] Cobrir pelo menos: Botões principais têm label acessível.
- [ ] Executar `npm test` com a suíte atualizada.
- [ ] Executar `npm run lint` sem erros novos.

## Testes da sprint

- [ ] Teste de formulário com teclado.
- [ ] Teste de inputs monetários.
- [ ] Teste de mensagens de sucesso.
- [ ] Teste de estados vazios.
- [ ] Teste básico de acessibilidade nos componentes principais.
- [ ] `npm test` passa.
- [ ] `npm run lint` passa.

## Checklist final

- [ ] App abre sem tela branca.
- [ ] `npm test` passa com os testes adicionados na sprint.
- [ ] `npm run lint` passa sem erros.
- [ ] Não há chamada de rede para dados financeiros.
- [ ] Não há dependência proibida adicionada.
- [ ] `docs/sprint-14/PROGRESS.md` descreve o que foi entregue.
