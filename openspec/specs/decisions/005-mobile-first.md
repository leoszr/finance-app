# ADR 005 - Estrategia mobile-first com PWA

## Status
Aceito

## Contexto
O uso principal do produto ocorre em smartphone, com necessidade de acesso rapido no dia a dia.

## Decisao
Adotar abordagem mobile-first e distribuicao via PWA.

## Racional
- Prioriza principal contexto de uso (tela pequena e toque).
- Permite instalacao sem loja de aplicativos.
- Mantem um unico codebase web para evolucao do MVP.

## Consequencias
- Layouts e componentes devem nascer em 375px e escalar para desktop.
- Fluxos de formulario priorizam `Sheet` no mobile.
