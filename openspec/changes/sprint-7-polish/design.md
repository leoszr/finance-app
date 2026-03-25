# Design - Sprint 7 Polish

## Escopo tecnico
- Edge Function semanal para consolidar dados e enviar email.
- Componente padrao de erro com acao `Tentar novamente`.
- Revisao das telas para skeletons e toasts consistentes.
- Roteiro de smoke tests multi-fluxo.

## Decisoes
- Nao enviar email para usuario sem movimentacao na semana.
- Padronizar mensagens de erro em pt-BR.
- Priorizar fluxos de maior impacto (auth, transacoes, import/export).

## Validacoes
- Funcao semanal executa sem quebrar em falhas pontuais por usuario.
- Smoke tests manuais cobrem caminho feliz e erro principal.
