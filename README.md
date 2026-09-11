# Ambulante Conecta — Protótipo web responsivo

Arquivos de telas:
- `cadastro.html` — cadastro/diagnóstico com stepper
- `orientacao.html` — trilha de formalização MEI + licença municipal
- `mapa.html` — pontos de venda, filtro e solicitação
- `comunicacao.html` — canal com Prefeitura/sindicato
- `gestor.html` — aprovação/recusa de solicitações
- `dashboard.html` — indicadores agregados

Arquivos compartilhados:
- `styles.css`
- `script.js`
- `manifest.json`
- `sw.js`

## Executar
Use um servidor local para testar o service worker/PWA, por exemplo:
`python -m http.server 8000`

Depois abra `http://localhost:8000/cadastro.html`.

O protótipo não possui back-end real: botões e validações simulam os fluxos acadêmicos.
