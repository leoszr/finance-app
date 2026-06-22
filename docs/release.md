# Release interno

## Build local

```sh
npm run typecheck
npm run lint
npm test -- --runInBand
```

## EAS interno

IDs configurados:

- Android: `com.leo.financeapp`
- iOS: `com.leo.financeapp`

```sh
npx eas build --profile internal --platform android
npx eas build --profile internal --platform ios
```

iOS exige conta Apple configurada no EAS. Android gera APK interno.

## Validação

- Usar `docs/manual-test-checklist.md` no iPhone e Android.
- Confirmar que dados financeiros seguem locais.
- Anexar resultado do checklist no PR `dev` → `main`.
