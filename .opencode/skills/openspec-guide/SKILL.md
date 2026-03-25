# Como usar OpenSpec neste projeto

## Pre-requisitos
- Node.js instalado.
- Estar na raiz do repositorio.

## Comandos principais

```bash
npx @fission-ai/openspec@latest list
npx @fission-ai/openspec@latest list --specs
npx @fission-ai/openspec@latest status --change <change-name>
npx @fission-ai/openspec@latest instructions apply --change <change-name> --json
npx @fission-ai/openspec@latest show <item>
npx @fission-ai/openspec@latest validate <item>
```

## Fluxo recomendado (dia a dia)
1. Descobrir a sprint ativa com `list`/`status`.
2. Ler `tasks.md` da sprint.
3. Ler `design.md` e deltas de spec da mesma sprint.
4. Implementar uma task por vez.
5. Atualizar checkbox em `tasks.md` ao concluir.
6. Rodar `npm run build`.

## Estrutura de arquivos OpenSpec
- `openspec/project.md`: contexto do projeto.
- `openspec/AGENTS.md`: guia curto para agentes.
- `openspec/specs/<capability>/spec.md`: comportamento canonico por capability.
- `openspec/changes/<change>/proposal.md`: motivacao e impacto.
- `openspec/changes/<change>/design.md`: desenho tecnico da sprint.
- `openspec/changes/<change>/tasks.md`: plano executavel.
- `openspec/changes/<change>/specs/**/spec.md`: deltas da sprint.

## Convencao para tasks
Use sempre checkboxes numerados compativeis com apply:

```md
- [ ] 1.1 Implementar ...
- [ ] 1.2 Validar ...
- [ ] 2.1 Atualizar ...
```

## Relacao com docs legadas
- A pasta `specs/` permanece como referencia historica.
- Novas alteracoes devem nascer em `openspec/`.
