# Design - Sprint 6 Export

## Escopo tecnico
- Utilitarios client-side para gerar PDF (jsPDF) e XLSX (SheetJS).
- Botao de exportacao com opcoes de formato.
- Painel de filtros para recorte de transacoes no historico.

## Decisoes
- Nao enviar dados sensiveis para servidor no processo de export.
- Arquivo nomeado por referencia de mes/ano.
- Exportacao condicionada a existencia de dados no periodo.

## Validacoes
- Arquivos gerados com conteudo coerente (resumo + linhas).
- Filtros impactam lista e recorte exportado.
