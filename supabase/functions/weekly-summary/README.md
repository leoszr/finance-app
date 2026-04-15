# weekly-summary

Edge Function para enviar resumo semanal por e-mail.

## Secrets esperados

Configurar no Supabase:

- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `APP_URL`

Secrets padrão do runtime:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## Deploy

```bash
supabase functions deploy weekly-summary
```

## Teste manual

```bash
curl -X POST "${NEXT_PUBLIC_SUPABASE_URL}/functions/v1/weekly-summary" \
  -H "Authorization: Bearer ${NEXT_PUBLIC_SUPABASE_ANON_KEY}"
```

## Agendamento

Rodar migration da sprint 7 para criar job semanal via `pg_cron`.
Horário: segunda-feira, 12:00 UTC (~9h BRT).
