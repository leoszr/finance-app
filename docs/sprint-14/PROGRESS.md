# Progresso — Sprint 14 — Polimento de experiência mobile

## Resumo

- Status geral: done
- Branch: `dev`
- Commit final sugerido: `feat(ui): polish mobile finance experience`

## Entregue nesta sprint

- Contexto de produto/design criado em `PRODUCT.md` e `DESIGN.md`, com direção Apple Liquid Glass aplicada de forma funcional.
- Layout mobile ajustado para ações flexíveis em 375px e tela com padding mais seguro.
- `MoneyInput` agora filtra letras, formata enquanto digita e mantém teclado numérico.
- Feedback visual de sucesso em contas, categorias e transações.
- Empty states reescritos para orientar próximo passo em dashboard, transações e relatórios.
- Labels acessíveis em inputs e botões principais com alvo mínimo preservado.

## Progresso por task

### T1401 — Ajustar layout para telas pequenas

- Status: done
- Feature: Layout para telas pequenas

#### Desenvolvido

- Botões agora aceitam crescimento/encolhimento em linhas com `flexWrap`.
- `Screen` reduziu padding horizontal para 16px, melhor para 375px.

#### Evidências

- Teste em `src/tests/features-sprint14.test.tsx` cobre linha de ações em largura 375px.

#### Pendências

- Nenhuma.

### T1402 — Melhorar inputs monetários

- Status: done
- Feature: Inputs monetários

#### Desenvolvido

- `MoneyInput` formata por dígitos para `R$ 0,00` enquanto digita.
- Letras são descartadas antes de atualizar o valor.
- Transações seguem salvas em centavos.

#### Evidências

- Teste cobre `abc1234` virando `R$ 12,34` e persistência como `1234` centavos.

#### Pendências

- Nenhuma.

### T1403 — Adicionar feedback visual de ações

- Status: done
- Feature: Feedback visual de ações

#### Desenvolvido

- Mensagens de sucesso para salvar/atualizar/excluir contas, categorias e transações.
- Feedback usa superfície leve tipo Liquid Glass sem depender de blur.
- Loading existente em botões foi preservado.

#### Evidências

- Testes cobrem mensagem `Transação salva.`.

#### Pendências

- Nenhuma.

### T1404 — Melhorar empty states

- Status: done
- Feature: Empty states

#### Desenvolvido

- Dashboard vazio orienta criar conta, categoria e transação.
- Transações vazias orientam lançar receita ou despesa.
- Relatório vazio explica que precisa de transações para análise e PDF.

#### Evidências

- Testes de Sprint 14, Sprint 08 e Sprint 09 atualizados para as novas mensagens.

#### Pendências

- Nenhuma.

### T1405 — Ajustar acessibilidade básica

- Status: done
- Feature: Acessibilidade básica

#### Desenvolvido

- `TextInput` define `accessibilityLabel` a partir do label visual.
- `Button` aceita `accessibilityLabel` explícito.
- Textos importantes mantidos em 14px ou mais.

#### Evidências

- Teste cobre label acessível e teclado numérico do input monetário.

#### Pendências

- Nenhuma.

## Testes executados

- `npm run typecheck` — passou.
- `npm run lint` — passou.
- `npm test -- --runInBand` — 26 suites, 110 testes passaram.

## Decisões técnicas

- Não foi adicionada dependência visual para blur/glass. Liquid Glass foi aplicado como direção: superfícies translúcidas simples, pills, hairlines e feedback leve.
- Mantido foco product UI: legibilidade financeira acima de efeito visual.
- `npx impeccable skills update` foi tentado a pedido do usuário, mas falhou porque não há skill folder do Impeccable instalado neste projeto.
- Pós-review: app lock agora reage a mudanças de configuração sem remount, unlock bloqueia toques repetidos e input monetário não reinterpreta decimal ambíguo.

## Problemas / riscos encontrados

- Liquid Glass nativo completo exigiria APIs/plataforma específicas. Nesta sprint ficou como linguagem visual leve e compatível com React Native atual.

## Próximo passo

- Abrir PR de `dev` para `main` ou iniciar Sprint 15.
