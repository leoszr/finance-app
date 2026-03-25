# OpenSpec para Agentes

Guia rapido para agentes de build neste repositorio.

## Comandos uteis
- `/opsx list` -> lista changes e specs.
- `/opsx status <change>` -> mostra progresso da sprint.
- `/opsx apply <change>` -> aplica instrucoes da change.

Equivalente via CLI:

```bash
npx @fission-ai/openspec@latest list
npx @fission-ai/openspec@latest status --change <change-name>
npx @fission-ai/openspec@latest instructions apply --change <change-name> --json
```

## Fluxo padrao
1. Identificar sprint/change ativa.
2. Ler nesta ordem:
   - `openspec/changes/<change>/tasks.md`
   - `openspec/changes/<change>/design.md`
   - deltas em `openspec/changes/<change>/specs/**/spec.md`
   - spec canonica em `openspec/specs/<capability>/spec.md`
3. Implementar uma task por vez.
4. Marcar checkboxes no formato `- [ ] 1.1 ...` / `- [x] ...`.
5. Validar com `npm run build`.

## Regras rapidas
- Manter textos de produto em pt-BR.
- Nao usar `any` em TypeScript.
- Nao remover docs legadas em `specs/` agora.
- Se houver divergencia, OpenSpec da sprint ativa e a fonte de verdade.
