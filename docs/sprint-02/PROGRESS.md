# Progresso — Sprint 02 — Camada de domínio financeiro

## Resumo

- Status geral: concluído
- Branch: `feature/sprint-02-finance-domain`
- Commit final sugerido: `feat(domain): add money date and validation helpers`

## Entregue nesta sprint

- Utilitários puros para dinheiro em `src/lib/money.ts`.
- Utilitários puros para filtros mensais em `src/lib/month.ts`.
- Tipo `Result` e erro previsível em `src/lib/result.ts`.
- Validações puras para conta, categoria e transação em `src/lib/validation/`.
- Testes unitários da sprint em `src/tests/domain/`.

## Progresso por task

### T0201 — Criar utilitário de dinheiro

- Status: done
- Feature: Utilitário de dinheiro

#### Desenvolvido

- `parseCurrencyToCents()` criada.
- `formatCentsToCurrency()` criada.
- Conversões BRL com centavos inteiros seguros, espaço normal em `R$ 25,90` e erro controlado.

#### Evidências

- Arquivos: `src/lib/money.ts`, `src/lib/result.ts`, `src/tests/domain/money.test.ts`.
- Testes cobrem `25,90 -> 2590`, `1.200,00 -> 120000`, `2590 -> R$ 25,90`, valor inválido e centavos inseguros.

#### Pendências

- Nenhuma.

### T0202 — Criar utilitário de datas mensais

- Status: done
- Feature: Utilitário de datas mensais

#### Desenvolvido

- `getMonthRange()` criada.
- `formatMonthLabel()` criada.
- `isDateInsideMonth()` criada.
- Funções usam datas UTC, validam mês `1..12` e retornam `Result`, sem backend ou timezone externo.

#### Evidências

- Arquivos: `src/lib/month.ts`, `src/tests/domain/month.test.ts`.
- Testes cobrem início/fim de mês, virada de ano, dentro/fora do mês e mês inválido.

#### Pendências

- Nenhuma.

### T0203 — Criar validação de conta

- Status: done
- Feature: Validação de conta

#### Desenvolvido

- `validateAccount()` criada.
- Nome obrigatório, saldo inicial zero válido e moeda padrão `BRL`.

#### Evidências

- Arquivos: `src/lib/validation/accountValidation.ts`, `src/tests/domain/accountValidation.test.ts`.
- Testes cobrem nome vazio, saldo zero e moeda padrão.

#### Pendências

- Nenhuma.

### T0204 — Criar validação de categoria

- Status: done
- Feature: Validação de categoria

#### Desenvolvido

- `validateCategory()` criada.
- Nome obrigatório, tipo obrigatório, tipo inválido rejeitado, cor/ícone opcionais.

#### Evidências

- Arquivos: `src/lib/validation/categoryValidation.ts`, `src/tests/domain/categoryValidation.test.ts`.
- Testes cobrem nome vazio, tipo inválido e opcionais.

#### Pendências

- Nenhuma.

### T0205 — Criar validação de transação

- Status: done
- Feature: Validação de transação

#### Desenvolvido

- `validateTransaction()` criada.
- Valor maior que zero e seguro, IDs positivos inteiros, data real `YYYY-MM-DD` e descrição opcional.

#### Evidências

- Arquivos: `src/lib/validation/transactionValidation.ts`, `src/tests/domain/transactionValidation.test.ts`.
- Testes cobrem valor zero inválido, IDs inválidos, data inválida, obrigatórios e integração de transação completa.

#### Pendências

- Nenhuma.

## Testes executados

- `npm test -- --runInBand` — passou: 9 suites, 32 testes.
- `npm run lint` — passou sem warnings.
- `npm run typecheck` — passou.

## Decisões técnicas

- Domínio financeiro isolado em funções puras sem UI, banco, rede ou APIs externas.
- Erros retornam `Result<T>` com `{ code, message, field }`.
- Dinheiro fica como inteiro em centavos.
- Datas mensais usam strings `YYYY-MM-DD` com validação de mês/data para filtros previsíveis.

## Problemas / riscos encontrados

- Branch criada a partir da sprint 01 local ainda com alterações não commitadas; diff atual inclui sprint 01 + sprint 02 até o commit/merge anterior ser consolidado.

## Próximo passo

- Revisar diff e fazer commit sugerido: `feat(domain): add money date and validation helpers` após consolidar a sprint 01.
