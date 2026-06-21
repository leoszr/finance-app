# Tarefas de refatoração e hardening

Arquivo para achados fora do escopo da sprint atual. Não executar automaticamente; puxar para uma sprint futura quando priorizado.

## R001 — Remover acoplamento com `this` nos repositories

- Status: todo
- Origem: review pós Sprint 04
- Prioridade sugerida: média
- Escopo: camada local de repositórios

### Problema

Métodos de repository chamam outros métodos via `this`. Se consumidor destruturar métodos, o contexto é perdido e chamadas podem falhar em runtime.

Exemplo de risco:

```ts
const { createAccount } = createAccountsRepository();
await createAccount(input); // `this` pode ficar undefined dentro do método
```

### Arquivos candidatos

- `src/db/repositories/accountsRepository.ts`
- `src/db/repositories/categoriesRepository.ts`
- `src/db/repositories/transactionsRepository.ts`

### Resultado esperado

- Substituir chamadas `this.get...` por funções fechadas em closure ou por objeto repository estável.
- Garantir que destructuring de métodos funcione.
- Adicionar testes cobrindo destructuring para create/update dos três repositories.

### Critérios de aceite

- [ ] `createAccount`/`updateAccount` funcionam após destructuring.
- [ ] `createCategory`/`updateCategory` funcionam após destructuring.
- [ ] `createTransaction`/`updateTransaction` funcionam após destructuring.
- [ ] `npm test` passa.
- [ ] `npm run lint` passa.
- [ ] `npm run typecheck` passa.

## R002 — Fortalecer teste de integração da navegação por abas

- Status: todo
- Origem: review pós Sprint 04
- Prioridade sugerida: baixa/média
- Escopo: testes de navegação Expo Router

### Problema

O teste atual da Sprint 04 valida constantes e renderização de telas, mas não renderiza o `TabsLayout` nem simula press real nas abas. Isso reduz cobertura contra regressão no wiring do Expo Router.

### Arquivos candidatos

- `src/tests/navigation/sprint04-navigation.test.tsx`
- `app/(tabs)/_layout.tsx`
- configuração/test harness do Expo Router, se necessário

### Resultado esperado

- Criar harness/integration test capaz de renderizar a navegação por abas.
- Simular troca entre ao menos duas abas reais.
- Validar labels das seis abas via navigator, não só via constante.
- Remover ou documentar warning `overlapping act()` se o setup atual causar ruído.

### Critérios de aceite

- [ ] Teste renderiza `TabsLayout` ou harness equivalente do Expo Router.
- [ ] Teste simula navegação entre pelo menos duas abas reais.
- [ ] Teste valida as seis labels principais no navigator.
- [ ] Não há warning recorrente de `overlapping act()` na suíte.
- [ ] `npm test` passa.
- [ ] `npm run lint` passa.
