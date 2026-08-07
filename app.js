const searchForm = document.getElementById('searchForm');
const cityInput = document.getElementById('cityInput');
const statusMsg = document.getElementById('statusMsg');
const weatherCard = document.getElementById('weatherCard');
const weatherIcon = document.getElementById('weatherIcon');
const temperature = document.getElementById('temperature');
const cityName = document.getElementById('cityName');
const weatherDesc = document.getElementById('weatherDesc');
const feelsLike = document.getElementById('feelsLike');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const recentList = document.getElementById('recentList');

const WEATHER_CODES = {
  0: { desc: 'Céu limpo', icon: '☀️' },
  1: { desc: 'Poucas nuvens', icon: '🌤️' },
  2: { desc: 'Parcialmente nublado', icon: '⛅' },
  3: { desc: 'Nublado', icon: '☁️' },
  45: { desc: 'Neblina', icon: '🌫️' },
  48: { desc: 'Neblina com geada', icon: '🌫️' },
  51: { desc: 'Garoa leve', icon: '🌦️' },
  53: { desc: 'Garoa moderada', icon: '🌦️' },
  55: { desc: 'Garoa intensa', icon: '🌧️' },
  61: { desc: 'Chuva leve', icon: '🌧️' },
  63: { desc: 'Chuva moderada', icon: '🌧️' },
  65: { desc: 'Chuva forte', icon: '🌧️' },
  71: { desc: 'Neve leve', icon: '🌨️' },
  73: { desc: 'Neve moderada', icon: '🌨️' },
  75: { desc: 'Neve forte', icon: '❄️' },
  80: { desc: 'Pancadas de chuva', icon: '🌦️' },
  81: { desc: 'Pancadas de chuva fortes', icon: '🌧️' },
  95: { desc: 'Trovoadas', icon: '⛈️' },
  96: { desc: 'Trovoadas com granizo', icon: '⛈️' },
};

const RECENT_KEY = 'weather-app-recent-cities';

function getRecentCities() {
  return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
}

function saveRecentCity(name) {
  const cities = getRecentCities().filter((c) => c !== name);
  cities.unshift(name);
  localStorage.setItem(RECENT_KEY, JSON.stringify(cities.slice(0, 5)));
  renderRecentCities();
}

function renderRecentCities() {
  const cities = getRecentCities();
  recentList.innerHTML = '';
  cities.forEach((city) => {
    const li = document.createElement('li');
    li.textContent = city;
    li.addEventListener('click', () => fetchWeather(city));
    recentList.appendChild(li);
  });
}

function setStatus(message) {
  statusMsg.textContent = message;
}

async function geocodeCity(city) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=pt`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Falha ao buscar localização');
  const data = await res.json();
  if (!data.results || data.results.length === 0) {
    throw new Error('Cidade não encontrada');
  }
  return data.results[0];
}

async function fetchForecast(latitude, longitude) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Falha ao buscar previsão');
  const data = await res.json();
  return data.current;
}

function renderWeather(location, current) {
  const weatherInfo = WEATHER_CODES[current.weather_code] || { desc: 'Condição desconhecida', icon: '❓' };

  weatherIcon.textContent = weatherInfo.icon;
  temperature.textContent = `${Math.round(current.temperature_2m)}°C`;
  cityName.textContent = `${location.name}${location.country ? ', ' + location.country : ''}`;
  weatherDesc.textContent = weatherInfo.desc;
  feelsLike.textContent = `${Math.round(current.apparent_temperature)}°C`;
  humidity.textContent = `${current.relative_humidity_2m}%`;
  windSpeed.textContent = `${Math.round(current.wind_speed_10m)} km/h`;

  weatherCard.classList.remove('hidden');
}

async function fetchWeather(city) {
  setStatus('Buscando...');
  weatherCard.classList.add('hidden');

  try {
    const location = await geocodeCity(city);
    const current = await fetchForecast(location.latitude, location.longitude);
    renderWeather(location, current);
    saveRecentCity(location.name);
    setStatus('');
  } catch (err) {
    setStatus(err.message || 'Algo deu errado. Tente novamente.');
  }
}

searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (!city) return;
  fetchWeather(city);
});

renderRecentCities();
