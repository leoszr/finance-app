do $block$
begin
  if to_regnamespace('cron') is null then
    raise notice 'Schema cron nao existe. Agendamento semanal ignorado neste ambiente.';
    return;
  end if;

  perform cron.schedule(
    'weekly-summary-job',
    '0 12 * * 1',
    $job$
    select
      net.http_post(
        url:= (select decrypted_secret from vault.decrypted_secrets where name = 'project_url') || '/functions/v1/weekly-summary',
        headers:= jsonb_build_object(
          'Content-Type',
          'application/json',
          'Authorization',
          'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'anon_key')
        ),
        body:= '{}'::jsonb
      ) as request_id;
    $job$
  );
end;
$block$;
