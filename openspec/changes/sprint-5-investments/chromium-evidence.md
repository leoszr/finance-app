# Evidências Chromium - Sprint 5 Investments

Data: 2026-04-15

## Ambiente
- App local em `http://127.0.0.1:3000`
- Navegador: `chromium --headless`

## Verificações executadas

### 1. Tela de login renderiza corretamente
Comando:
```bash
chromium --headless --no-sandbox --disable-gpu --window-size=390,844 --screenshot=/tmp/finance-app-investments-evidence/login-page.png http://127.0.0.1:3000/login
```
Resultado:
- tela carregou
- botão `Entrar com Google` presente no DOM
- screenshot gerado em `/tmp/finance-app-investments-evidence/login-page.png`

### 2. Rota protegida `/investimentos` redireciona para login sem sessão
Comando:
```bash
chromium --headless --no-sandbox --disable-gpu --window-size=390,844 --screenshot=/tmp/finance-app-investments-evidence/investimentos-redirect.png http://127.0.0.1:3000/investimentos
```
Resultado:
- middleware protege rota
- acesso sem sessão redireciona para `/login`
- screenshot gerado em `/tmp/finance-app-investments-evidence/investimentos-redirect.png`

### 3. Proxy BCB responde para indicadores suportados
Comandos:
```bash
curl http://127.0.0.1:3000/api/bcb-proxy?indicator=selic
curl http://127.0.0.1:3000/api/bcb-proxy?indicator=cdi
curl http://127.0.0.1:3000/api/bcb-proxy?indicator=ipca
```
Resultado:
```json
{
  "selic": {
    "indicator": "selic",
    "label": "Selic",
    "code": 11,
    "value": 0.054266,
    "unit": "% a.d.",
    "period": "daily",
    "annualRate": 14.649931856394517,
    "date": "2026-04-14"
  },
  "cdi": {
    "indicator": "cdi",
    "label": "CDI",
    "code": 4389,
    "value": 14.65,
    "unit": "% a.a.",
    "period": "annual",
    "annualRate": 14.65,
    "date": "2026-04-13"
  },
  "ipca": {
    "indicator": "ipca",
    "label": "IPCA",
    "code": 433,
    "value": 0.88,
    "unit": "% a.m.",
    "period": "monthly",
    "annualRate": 11.08639745607627,
    "date": "2026-03-01"
  }
}
```

## Observação
Como ambiente local não tinha sessão autenticada disponível para automação, validação visual da área protegida confirmou:
- render da tela pública de login
- proteção da rota `/investimentos`
- funcionamento do proxy BCB usado pela calculadora
