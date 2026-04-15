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
