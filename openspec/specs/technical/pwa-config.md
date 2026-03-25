# Tecnico: pwa-config

## Objetivo
Definir configuracao minima de PWA para experiencia mobile-first.

## Requisitos
- Manifest valido com nome, icones e `display` standalone.
- Service worker ativo em producao.
- Aplicacao instalavel em navegadores compativeis.

## Diretrizes
- Priorizar funcionamento em viewport 375px.
- Garantir navegacao e formularios usaveis em touch.
- Definir icones nos tamanhos exigidos para Android/iOS.

## Cache
- Cache de assets estaticos para melhorar abertura recorrente.
- Rotas de API criticas podem usar estrategia controlada de cache.
- Evitar cache agressivo para dados sensiveis de usuario.

## Evolucao prevista
- Melhorar suporte offline para leitura.
- Avaliar fila de sincronizacao para acoes offline em sprint futura.
