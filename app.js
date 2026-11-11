const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";
let currentData = null;
let isCelsius = true;

const form = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const loading = document.getElementById("loading");
const error = document.getElementById("error");
const weatherDisplay = document.getElementById("weather-display");
const cityName = document.getElementById("city-name");
const weatherIcon = document.getElementById("weather-icon");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const feelsLike = document.getElementById("feels-like");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const pressure = document.getElementById("pressure");
const historyList = document.getElementById("search-history");

async function getWeather(city) {
    const url = `${BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
    try {
        showLoading(); hideError();
        const response = await fetch(url);
        if (!response.ok) {
            if (response.status === 404) throw new Error("City not found - check spelling");
            if (response.status === 401) throw new Error("API key not valid yet - new keys can take an hour");
            throw new Error("Failed to fetch weather data");
        }
        const data = await response.json();
        currentData = data;
        displayWeather(data);
        saveToHistory(city);
    } catch (err) {
        showError(err.name === "TypeError" ? "Network error - check your connection" : err.message);
    } finally {
        hideLoading();
    }
}

function displayWeather(data) {
    cityName.textContent = `${data.name}, ${data.sys.country}`;
    weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    description.textContent = data.weather[0].description;
    updateTempDisplay();
    feelsLike.textContent = isCelsius ? `${Math.round(data.main.feels_like)}°C` : `${Math.round(data.main.feels_like*9/5+32)}°F`;
    humidity.textContent = `${data.main.humidity}%`;
    wind.textContent = `${data.wind.speed} m/s`;
    pressure.textContent = `${data.main.pressure} hPa`;
    weatherDisplay.classList.remove("hidden");
    document.body.className = data.weather[0].main.toLowerCase();
}

function updateTempDisplay() {
    if(!currentData) return;
    const temp = isCelsius ? `${Math.round(currentData.main.temp)}°C` : `${Math.round(currentData.main.temp*9/5+32)}°F`;
    temperature.textContent = temp;
}

function showLoading() { loading.classList.remove("hidden"); weatherDisplay.classList.add("hidden"); }
function hideLoading() { loading.classList.add("hidden"); }
function showError(msg) { error.textContent = msg; error.classList.remove("hidden"); }
function hideError() { error.classList.add("hidden"); error.textContent = ""; }

function saveToHistory(city) {
    let recent = JSON.parse(localStorage.getItem("recent")) || [];
    recent = [city, ...recent.filter(c => c.toLowerCase() !== city.toLowerCase())].slice(0,5);
    localStorage.setItem("recent", JSON.stringify(recent));
    loadHistory();
}
function loadHistory() {
    const recent = JSON.parse(localStorage.getItem("recent")) || [];
    historyList.innerHTML = recent.map(c => `<li><button class="history-btn">${c}</button></li>`).join("");
    document.querySelectorAll(".history-btn").forEach(btn => {
        btn.addEventListener("click", () => getWeather(btn.textContent));
    });
}

form.addEventListener("submit", e => {
    e.preventDefault();
    const city = cityInput.value.trim();
    if(city) getWeather(city);
    cityInput.value = "";
});

document.getElementById("unit-toggle").addEventListener("click", () => {
    isCelsius = !isCelsius;
    document.getElementById("unit-toggle").textContent = isCelsius ? "Switch to °F" : "Switch to °C";
    updateTempDisplay();
    if(currentData) {
        feelsLike.textContent = isCelsius ? `${Math.round(currentData.main.feels_like)}°C` : `${Math.round(currentData.main.feels_like*9/5+32)}°F`;
    }
});

document.getElementById("geo-btn").addEventListener("click", () => {
    navigator.geolocation.getCurrentPosition(async pos => {
        const {latitude, longitude} = pos.coords;
        const url = `${BASE_URL}?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;
        try {
            showLoading(); hideError();
            const res = await fetch(url);
            const data = await res.json();
            currentData = data;
            displayWeather(data);
        } catch(err) { showError(err.message); } finally { hideLoading(); }
    });
});

loadHistory();

// Check key exists
if(typeof API_KEY === "undefined" || API_KEY === "") console.warn("API_KEY missing - add config.js");
