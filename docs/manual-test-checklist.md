# Checklist de teste manual — release interno

Execute no iPhone e no Android. Marque resultado real no PR.

| Área | Passo | Resultado esperado |
| --- | --- | --- |
| Abertura | Abrir o app instalado. | App abre sem tela branca. |
| Demo | Configurações > Criar demo. | Conta, categorias e transações `[Demo]` aparecem nas telas. |
| Persistência | Fechar e abrir o app. | Dados continuam visíveis. |
| Transações | Criar receita e despesa. | Valores aparecem no mês correto. |
| Filtros | Filtrar/listar mês com dados. | Resultado igual antes e depois de reiniciar. |
| Relatórios | Abrir relatórios. | Totais refletem as transações locais. |
| PDF | Gerar PDF. | Arquivo é criado e pode ser compartilhado. |
| Backup | Exportar backup. | Arquivo contém os dados atuais. |
| Importação | Importar backup em base limpa. | Dados retornam sem backend. |
| Segurança | Ativar bloqueio local. | App pede biometria ao bloquear/reabrir. |
| Limpeza | Configurações > Apagar demo. | Dados `[Demo]` são removidos. |
