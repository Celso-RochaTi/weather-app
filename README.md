# 🌤️ Weather App

Aplicativo de previsão do tempo em tempo real, feito com HTML, CSS e JavaScript puro, consumindo a API pública e gratuita [Open-Meteo](https://open-meteo.com/) (sem necessidade de chave de API).

🔗 **Demo ao vivo:** https://weather-app-lyart-nine-11.vercel.app

## ✨ Funcionalidades

- Busca de clima atual por nome da cidade
- Geocodificação automática (converte nome da cidade em coordenadas)
- Exibe temperatura, sensação térmica, umidade e velocidade do vento
- Ícone e descrição de acordo com a condição climática
- Histórico das últimas cidades pesquisadas (salvo no `localStorage`)

## 🛠️ Tecnologias

- HTML5
- CSS3
- JavaScript (Vanilla) — `fetch`, `async/await`
- [Open-Meteo API](https://open-meteo.com/) (geocoding + forecast)

## ▶️ Como executar

```bash
git clone https://github.com/Celso-RochaTi/weather-app.git
cd weather-app
```

Abra o `index.html` diretamente no navegador, ou sirva localmente:

```bash
python -m http.server 8000
```

E acesse `http://localhost:8000`.

## 📄 Licença

Este projeto está sob a licença MIT.
