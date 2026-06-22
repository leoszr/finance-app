# Revisão de dependências — Sprint 15

## Bloqueios confirmados

- Supabase: ausente.
- PostgreSQL: ausente.
- SDK de IA: ausente.
- Cliente HTTP dedicado: ausente.

## Dependências mantidas

- `expo`, `react`, `react-native`, `expo-router`: base do app Expo.
- `expo-sqlite`: persistência local-first.
- `expo-file-system`, `expo-sharing`, `expo-print`: backup/exportação e PDF local.
- `expo-local-authentication`: bloqueio biométrico local.
- Pacotes Expo/React Native de navegação, splash, sistema, web e runtime: parte da base Expo SDK 54 usada pelo template/runtime.
- Dependências de teste, lint e TypeScript: suíte automatizada e checagem estática.

Decisão: nenhuma remoção manual. Mais seguro validar com Expo antes de cortar dependências de runtime do SDK.
