# Project Status

> Documentacao reconstruida a partir do estado atual do codigo apos remocao dos docs anteriores.

## Estado atual
- Branch atual: `main`
- Estagio: produto funcional com principais modulos do MVP implementados
- Maturidade: app pronto para uso manual/local e com sinais de preparo para deploy, mas ainda sem suite de testes automatizados nem pipeline de CI

## Sinais de conclusao funcional
Capacidades implementadas no codigo:
- autenticacao Google + sessao protegida
- aviso e redirecionamento quando sessao termina no app
- dashboard financeiro
- CRUD de transacoes
- recorrencias
- categorias e categorias padrao
- importacao CSV do Nubank
- metas e orcamentos
- investimentos + calculadora com taxas BCB
- exportacao PDF e XLSX
- PWA/offline
- Edge Function de resumo semanal

## Validacao hoje
Comandos disponiveis:
```bash
npm run dev
npm run build
npm run start
npm run lint
```

O repositorio possui:
- configuracao ESLint ativa em `eslint.config.mjs`
- migrations Supabase versionadas em `supabase/migrations/`
- endpoint utilitario de seed/reset para dev em `app/api/dev/seed/route.ts`

O repositorio nao possui hoje:
- script `test`
- arquivos `*.spec.*` ou `*.test.*` visiveis
- workflows de CI visiveis em `.github`

## Estado do worktree
Worktree esta sujo no momento. Ha grande conjunto de delecoes de documentacao/specs ainda nao commitadas, incluindo:
- `AGENTS.md`
- `openspec/**`
- `specs/**`
- outros `.md` auxiliares

Tambem existe nova documentacao reconstruida:
- `PROJECT_OVERVIEW.md`
- `PROJECT_STATUS.md`

## Riscos e lacunas observadas
- Risco de perda de rastreabilidade funcional por remocao dos docs/specs antigos
- Expiracao real de sessao Supabase nao e controlada pelo repo; regra de 30 dias exige configuracao no Dashboard do Supabase (`Auth > Sessions` e revisao de `JWT expiry`)
- Variaveis de ambiente extras da Edge Function nao estao centralizadas no app web
- Lista de categorias padrao aparece em mais de um lugar no codigo, o que aumenta risco de drift
- Variaveis como `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_SITE_URL` e `NEXT_PUBLIC_LOCAL_DEV_MODE` aparecem em ambiente local, mas sem uso evidente no codigo atual

## Leitura pratica do estagio do projeto
Projeto parece em fase de **pos-MVP / consolidacao**:
- funcionalidades centrais ja existem
- backend e regras de acesso ja existem
- UX mobile-first ja esta montada
- faltam mais garantias operacionais: testes, CI e organizacao de documentacao definitiva

## Proximos passos recomendados
1. Configurar no Supabase `Auth > Sessions` o time-box de 30 dias e revisar `JWT expiry`
2. Decidir quais docs removidos devem ser restaurados ou substituidos
3. Consolidar documentacao minima de produto, arquitetura e deploy
4. Adicionar testes criticos para auth, transacoes, importacao e exportacao
5. Criar pipeline de CI com lint + build
6. Revisar envs nao usados e centralizar configuracao de producao
