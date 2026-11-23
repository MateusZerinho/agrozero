# AgroZero

Protótipo navegável (React + Vite) para pequenos produtores rurais. Junta as ideias do **ZeroField** (alerta com ação e voz, venda local, funciona offline) e do **AgroVision** (mapa de talhões por satélite/NDVI, central de alertas, assistente de IA). O nome do app fica na constante `APP` em `src/App.jsx`.

## Rodar no VS Code
```bash
npm install
npm run dev
```
Abra o endereço que aparecer no terminal. Para ver como no celular, use o modo responsivo do navegador (F12).

## GitHub e Vercel
```bash
git init
git add .
git commit -m "Protótipo AgroZero"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/agrozero.git
git push -u origin main
```
Na Vercel: **Add New > Project**, importe o repositório e clique em **Deploy** (ela detecta o Vite sozinha). O link gerado é o que vai no template.

## Para o template da atividade
Descrição em uma linha: *AgroZero é um app mobile que ajuda pequenos produtores rurais a evitar perdas de safra e vender melhor, unindo alertas de clima e de satélite, um assistente com voz e pedidos de compradores locais, mesmo sem internet.*

## Onde mexer
- `src/App.jsx`: telas, dados de exemplo (`PLOTS`, `ALERTS`, `PRICES`, `ORDERS0`) e o assistente simulado (`answer`).
- `src/styles.css`: cores e tamanhos (variáveis no topo).
- Teste o modo offline em **Configurações > Simular sem internet**.
- Layout responsivo: celular até 899px (menu embaixo) e PC a partir de 900px (menu lateral e telas em colunas), no final de `src/styles.css`.

- Logo e favicon: `public/logo.png` e `public/favicon.png`. Visual baseado nas telas do AgroVision (Plus Jakarta Sans, paleta verde, mapa NDVI, alertas, assistente e relatórios).
