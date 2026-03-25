# Design - Sprint 4 CSV Import

## Escopo tecnico
- Parser dedicado para CSV Nubank.
- Fluxo em etapas: upload -> preview -> import.
- Sugestao inicial de categoria por descricao.

## Decisoes
- Ignorar valores positivos (estorno/pagamento).
- Exigir categoria antes do commit da importacao.
- Inserir em lote com `source = 'csv_nubank'`.

## Validacoes
- Mensagem clara para arquivo invalido.
- Contador de selecionadas e estado de importacao visivel.
