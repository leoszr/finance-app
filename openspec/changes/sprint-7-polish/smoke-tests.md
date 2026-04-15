# Smoke Tests - Sprint 7 Polish

Data: 2026-04-15

## Ambiente
- App local: `http://127.0.0.1:3000`
- Navegador: `chromium --headless`
- Observacao: ambiente local sem sessao autenticada disponivel para automacao.

## 3.1 Autenticacao e transacoes

### Login
- rota `GET /login` respondeu `200`
- DOM contem `Finance App`
- DOM contem botao `Entrar com Google`
- screenshot: `/tmp/finance-app-sprint7-evidence/login.png`

### Rotas protegidas sem sessao
Resultados observados:

```json
{
  "http://127.0.0.1:3000/login": {
    "final_url": "http://127.0.0.1:3000/login",
    "status": 200
  },
  "http://127.0.0.1:3000/dashboard": {
    "final_url": "http://127.0.0.1:3000/login",
    "status": 200
  },
  "http://127.0.0.1:3000/transacoes": {
    "final_url": "http://127.0.0.1:3000/login",
    "status": 200
  },
  "http://127.0.0.1:3000/transacoes/importar": {
    "final_url": "http://127.0.0.1:3000/login",
    "status": 200
  },
  "http://127.0.0.1:3000/metas": {
    "final_url": "http://127.0.0.1:3000/login",
    "status": 200
  },
  "http://127.0.0.1:3000/investimentos": {
    "final_url": "http://127.0.0.1:3000/login",
    "status": 200
  }
}
```

Evidencias visuais:
- `/tmp/finance-app-sprint7-evidence/dashboard-redirect.png`
- `/tmp/finance-app-sprint7-evidence/transacoes-redirect.png`

### Conclusao 3.1
- tela publica de login renderiza corretamente
- middleware protege dashboard e transacoes sem reload quebrado
- sem credenciais de teste automatizaveis, fluxos autenticados completos ficaram limitados no ambiente local

## 3.2 Metas, investimentos, import e export

### Rotas protegidas verificadas
- `/transacoes/importar` -> redireciona para `/login`
- `/metas` -> redireciona para `/login`
- `/investimentos` -> redireciona para `/login`

Evidencias visuais:
- `/tmp/finance-app-sprint7-evidence/importar-redirect.png`
- `/tmp/finance-app-sprint7-evidence/metas-redirect.png`
- `/tmp/finance-app-sprint7-evidence/investimentos-redirect.png`

### Integracao externa usada por investimentos
Resposta de `GET /api/bcb-proxy?indicator=selic`:

```json
{
  "indicator": "selic",
  "label": "Selic",
  "code": 11,
  "value": 0.054266,
  "unit": "% a.d.",
  "period": "daily",
  "annualRate": 14.649931856394517,
  "date": "2026-04-14"
}
```

### Exportacao
- utilitarios PDF/XLSX compilam no build de producao
- botao de exportacao e filtros foram integrados na pagina de transacoes
- execucao visual autenticada do fluxo de exportacao ficou bloqueada por ausencia de sessao de teste no ambiente local

### Conclusao 3.2
- import, metas e investimentos mantem protecao de rota esperada
- endpoint BCB responde corretamente para calculadora de investimentos
- fluxo completo autenticado de export/import/metas/investimentos exige credenciais de teste para automacao end-to-end
