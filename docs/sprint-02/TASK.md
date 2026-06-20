# Sprint 02 — Camada de domínio financeiro

## Objetivo

Criar funções puras e serviços para dinheiro, datas, validação e operações financeiras básicas.

## Entrega da sprint

- Branch: `feature/sprint-02-finance-domain`
- Commit final sugerido: `feat(domain): add money date and validation helpers`
- Fase do plano: `Fase 3 — Domínio financeiro`
- Resultado deve ser pequeno, revisável e testável.

## Regras da sprint

- [ ] Criar uma feature branch para a sprint.
- [ ] Manter as alterações coesas ao objetivo da sprint.
- [ ] Atualizar ou criar testes junto com a implementação.
- [ ] Executar `npm test` e `npm run lint` antes do commit final.
- [ ] Não adicionar backend, Supabase, PostgreSQL, Java backend, API externa, IA ou sync automático.
- [ ] Atualizar `docs/sprint-02/PROGRESS.md` com evidências reais.

## Tasks

### T0201 — Criar utilitário de dinheiro

- Status: todo
- Feature: Utilitário de dinheiro
- Plano: `PLAN.md` > `Fase 3 — Domínio financeiro`
- Dependências: T0106

#### Requisitos funcionais

- [ ] Converter e formatar valores monetários.
- [ ] `parseCurrencyToCents()` criada.
- [ ] `formatCentsToCurrency()` criada.
- [ ] `"25,90"` vira `2590`.
- [ ] `"1.200,00"` vira `120000`.
- [ ] `2590` vira `"R$ 25,90"`.
- [ ] Valores inválidos retornam erro controlado.

#### Requisitos técnicos

- [ ] Implementar funções puras e testáveis.
- [ ] Não acessar UI, banco, rede ou APIs externas nesta camada.
- [ ] Retornar erros em formato previsível.

#### Arquivos prováveis

- `src/lib/money.ts`
- `src/tests/domain/money.test.ts`
- `src/lib/month.ts`

#### Passos sugeridos

1. Ler os arquivos prováveis e confirmar a estrutura existente.
2. Implementar somente o necessário para a feature desta task.
3. Adicionar ou atualizar testes específicos da task.
4. Rodar testes e lint.
5. Registrar evidências em `docs/sprint-02/PROGRESS.md`.

#### Critérios de aceite

- [ ] `parseCurrencyToCents()` criada.
- [ ] `formatCentsToCurrency()` criada.
- [ ] `"25,90"` vira `2590`.
- [ ] `"1.200,00"` vira `120000`.
- [ ] `2590` vira `"R$ 25,90"`.
- [ ] Valores inválidos retornam erro controlado.

#### Testes e verificação

- [ ] Testar `25,90 -> 2590`.
- [ ] Testar `1.200,00 -> 120000`.
- [ ] Testar `2590 -> R$ 25,90`.
- [ ] Adicionar teste cobrindo `Criar utilitário de dinheiro` em arquivo de teste da sprint.
- [ ] Cobrir pelo menos: `parseCurrencyToCents()` criada.
- [ ] Executar `npm test` com a suíte atualizada.

### T0202 — Criar utilitário de datas mensais

- Status: todo
- Feature: Utilitário de datas mensais
- Plano: `PLAN.md` > `Fase 3 — Domínio financeiro`
- Dependências: T0201

#### Requisitos funcionais

- [ ] Padronizar filtros por mês.
- [ ] `getMonthRange()` criada.
- [ ] `formatMonthLabel()` criada.
- [ ] `isDateInsideMonth()` criada.
- [ ] Mês retorna data inicial e final.
- [ ] Funciona com ano diferente.
- [ ] Não depende de backend ou timezone externo.

#### Requisitos técnicos

- [ ] Implementar funções puras e testáveis.
- [ ] Não acessar UI, banco, rede ou APIs externas nesta camada.
- [ ] Retornar erros em formato previsível.

#### Arquivos prováveis

- `src/lib/month.ts`
- `src/tests/domain/month.test.ts`
- `src/features/transactions/filters/`
- `src/lib/transactionFilters.ts`
- `src/lib/money.ts`

#### Passos sugeridos

1. Ler os arquivos prováveis e confirmar a estrutura existente.
2. Implementar somente o necessário para a feature desta task.
3. Adicionar ou atualizar testes específicos da task.
4. Rodar testes e lint.
5. Registrar evidências em `docs/sprint-02/PROGRESS.md`.

#### Critérios de aceite

- [ ] `getMonthRange()` criada.
- [ ] `formatMonthLabel()` criada.
- [ ] `isDateInsideMonth()` criada.
- [ ] Mês retorna data inicial e final.
- [ ] Funciona com ano diferente.
- [ ] Não depende de backend ou timezone externo.

#### Testes e verificação

- [ ] Testar início e fim de mês.
- [ ] Testar virada de ano.
- [ ] Testar data dentro/fora do mês.
- [ ] Adicionar teste cobrindo `Criar utilitário de datas mensais` em arquivo de teste da sprint.
- [ ] Cobrir pelo menos: `getMonthRange()` criada.
- [ ] Executar `npm test` com a suíte atualizada.

### T0203 — Criar validação de conta

- Status: todo
- Feature: Validação de conta
- Plano: `PLAN.md` > `Fase 3 — Domínio financeiro`
- Dependências: T0202

#### Requisitos funcionais

- [ ] Validar dados antes de salvar conta.
- [ ] Nome obrigatório.
- [ ] Saldo inicial permite zero.
- [ ] Moeda padrão é BRL.
- [ ] Erro retornado em formato previsível.

#### Requisitos técnicos

- [ ] Implementar funções puras e testáveis.
- [ ] Não acessar UI, banco, rede ou APIs externas nesta camada.
- [ ] Retornar erros em formato previsível.

#### Arquivos prováveis

- `src/lib/validation/accountValidation.ts`
- `src/tests/domain/accountValidation.test.ts`
- `src/features/accounts/`
- `src/hooks/useAccounts.ts`
- `src/lib/money.ts`
- `src/lib/month.ts`

#### Passos sugeridos

1. Ler os arquivos prováveis e confirmar a estrutura existente.
2. Implementar somente o necessário para a feature desta task.
3. Adicionar ou atualizar testes específicos da task.
4. Rodar testes e lint.
5. Registrar evidências em `docs/sprint-02/PROGRESS.md`.

#### Critérios de aceite

- [ ] Nome obrigatório.
- [ ] Saldo inicial permite zero.
- [ ] Moeda padrão é BRL.
- [ ] Erro retornado em formato previsível.

#### Testes e verificação

- [ ] Testar nome vazio.
- [ ] Testar saldo zero válido.
- [ ] Testar moeda padrão BRL.
- [ ] Adicionar teste cobrindo `Criar validação de conta` em arquivo de teste da sprint.
- [ ] Cobrir pelo menos: Nome obrigatório.
- [ ] Executar `npm test` com a suíte atualizada.

### T0204 — Criar validação de categoria

- Status: todo
- Feature: Validação de categoria
- Plano: `PLAN.md` > `Fase 3 — Domínio financeiro`
- Dependências: T0203

#### Requisitos funcionais

- [ ] Validar categorias.
- [ ] Nome obrigatório.
- [ ] Tipo obrigatório.
- [ ] Tipo inválido rejeitado.
- [ ] Cor e ícone opcionais.

#### Requisitos técnicos

- [ ] Implementar funções puras e testáveis.
- [ ] Não acessar UI, banco, rede ou APIs externas nesta camada.
- [ ] Retornar erros em formato previsível.

#### Arquivos prováveis

- `src/lib/validation/categoryValidation.ts`
- `src/tests/domain/categoryValidation.test.ts`
- `src/features/categories/`
- `src/hooks/useCategories.ts`
- `src/lib/money.ts`
- `src/lib/month.ts`

#### Passos sugeridos

1. Ler os arquivos prováveis e confirmar a estrutura existente.
2. Implementar somente o necessário para a feature desta task.
3. Adicionar ou atualizar testes específicos da task.
4. Rodar testes e lint.
5. Registrar evidências em `docs/sprint-02/PROGRESS.md`.

#### Critérios de aceite

- [ ] Nome obrigatório.
- [ ] Tipo obrigatório.
- [ ] Tipo inválido rejeitado.
- [ ] Cor e ícone opcionais.

#### Testes e verificação

- [ ] Testar tipo inválido.
- [ ] Testar cor e ícone opcionais.
- [ ] Adicionar teste cobrindo `Criar validação de categoria` em arquivo de teste da sprint.
- [ ] Cobrir pelo menos: Nome obrigatório.
- [ ] Executar `npm test` com a suíte atualizada.
- [ ] Executar `npm run lint` sem erros novos.

### T0205 — Criar validação de transação

- Status: todo
- Feature: Validação de transação
- Plano: `PLAN.md` > `Fase 3 — Domínio financeiro`
- Dependências: T0204

#### Requisitos funcionais

- [ ] Validar receita/despesa antes de salvar.
- [ ] Valor maior que zero.
- [ ] Conta obrigatória.
- [ ] Categoria obrigatória.
- [ ] Data obrigatória.
- [ ] Descrição opcional.

#### Requisitos técnicos

- [ ] Implementar funções puras e testáveis.
- [ ] Não acessar UI, banco, rede ou APIs externas nesta camada.
- [ ] Retornar erros em formato previsível.

#### Arquivos prováveis

- `src/lib/validation/transactionValidation.ts`
- `src/tests/domain/transactionValidation.test.ts`
- `src/features/transactions/`
- `src/hooks/useTransactions.ts`
- `src/lib/money.ts`
- `src/lib/month.ts`

#### Passos sugeridos

1. Ler os arquivos prováveis e confirmar a estrutura existente.
2. Implementar somente o necessário para a feature desta task.
3. Adicionar ou atualizar testes específicos da task.
4. Rodar testes e lint.
5. Registrar evidências em `docs/sprint-02/PROGRESS.md`.

#### Critérios de aceite

- [ ] Valor maior que zero.
- [ ] Conta obrigatória.
- [ ] Categoria obrigatória.
- [ ] Data obrigatória.
- [ ] Descrição opcional.

#### Testes e verificação

- [ ] Testar valor zero inválido.
- [ ] Testar conta/categoria/data obrigatórias.
- [ ] Adicionar teste cobrindo `Criar validação de transação` em arquivo de teste da sprint.
- [ ] Cobrir pelo menos: Valor maior que zero.
- [ ] Executar `npm test` com a suíte atualizada.
- [ ] Executar `npm run lint` sem erros novos.

## Testes da sprint

- [ ] Testes unitários de dinheiro.
- [ ] Testes unitários de datas.
- [ ] Testes unitários das validações.
- [ ] Teste de integração validando uma transação completa.
- [ ] `npm test` passa.
- [ ] `npm run lint` passa.

## Checklist final

- [ ] App abre sem tela branca.
- [ ] `npm test` passa com os testes adicionados na sprint.
- [ ] `npm run lint` passa sem erros.
- [ ] Não há chamada de rede para dados financeiros.
- [ ] Não há dependência proibida adicionada.
- [ ] `docs/sprint-02/PROGRESS.md` descreve o que foi entregue.
