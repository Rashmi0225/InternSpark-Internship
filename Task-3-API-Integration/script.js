const apiKey = "00008c166a358b46acc4f56ceac6d6c9";

const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const loading = document.getElementById("loading");
const errorDiv = document.getElementById("error");
const weatherResult = document.getElementById("weather-result");

searchBtn.addEventListener("click", fetchWeather);

cityInput.addEventListener("keypress", function(e) {
    if (e.key === "Enter") fetchWeather();
});

function fetchWeather() {
    const city = cityInput.value.trim();

    if (!city) return;

    showLoading();

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
        .then(response => {
            if (!response.ok) {
                throw new Error("City not found");
            }
            return response.json();
        })
        .then(data => {
            displayWeather(data);
        })
        .catch(error => {
            showError(error.message);
        });
}

function showLoading() {
    loading.classList.remove("hidden");
    weatherResult.classList.add("hidden");
    errorDiv.classList.add("hidden");
}

function displayWeather(data) {
    loading.classList.add("hidden");
    weatherResult.classList.remove("hidden");

    document.getElementById("city-name").innerText = data.name;
    document.getElementById("temperature").innerText = data.main.temp;
    document.getElementById("humidity").innerText = data.main.humidity;
    document.getElementById("wind").innerText = data.wind.speed;
}

function showError(message) {
    loading.classList.add("hidden");
    errorDiv.classList.remove("hidden");
    errorDiv.innerText = message;
}
