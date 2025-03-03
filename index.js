// Description: Main JavaScript file for the Weather App

document.addEventListener("DOMContentLoaded", function () {
  hideWeatherInfo(); // Hide all weather details on page load
});

function hideWeatherInfo() {
  document.querySelector(".current-weather").style.display = "none";
  document.querySelector(".weather-forecast").style.display = "none";
}

function clearWeatherData() {
  document.querySelector("#city-name").innerHTML = "";
  document.querySelector("#current-temp").innerHTML = "";
  document.querySelector("#weather-condition-text").innerHTML = "";
  document.querySelector("#date-time").innerHTML = "";
  document.querySelector("#forecast-container").innerHTML = "";
  document.querySelector(".current-temp-icon").src = "";
}

function showWeatherInfo() {
  document.querySelector(".current-weather").style.display = "flex";
  document.querySelector(".weather-forecast").style.display = "block";
}

function search(event) {
  event.preventDefault();
  let searchInputElement = document.querySelector("#city-input");
  let city = searchInputElement.value.trim();

  if (city) {
    document.querySelector("#city-name").textContent = city;

    let apiKey = "d78e7acc0to3ab4c102473f7fd13b43e";
    let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;

    axios.get(apiUrl)
      .then(response => {
        if (!response.data.city) {
          alert("City not found. Please check the spelling and try again!");
          clearWeatherData(); // Clear previous weather data
          hideWeatherInfo();  // Keep only the search form visible
          return;
        }
        displayTemperature(response);
        let lat = response.data.coordinates.latitude;
        let lon = response.data.coordinates.longitude;
        getLocalTime(lat, lon, response.data);
        getForecast(city);
        showWeatherInfo();
      })
      .catch(error => {
        console.error("Error fetching weather data:", error);
        alert("City not found. Please check the spelling and try again!");
        clearWeatherData();
        hideWeatherInfo();
      });
  }
}

function displayTemperature(response) {
  let temperatureElement = document.querySelector("#current-temp");
  let cityElement = document.querySelector("#city-name");
  let weatherConditionElement = document.querySelector("#weather-condition-text");
  let weatherIconElement = document.querySelector(".current-temp-icon");

  let cityName = response.data.city || "Unknown City";
  if (!cityName) {
    alert("City not found. Please check the spelling and try again!");
    clearWeatherData();
    hideWeatherInfo();
    return;
  }

  let temperature = Math.round(response.data.temperature.current);
  let weatherDescription = response.data.condition.description;
  let weatherIconUrl = response.data.condition.icon_url;

  cityElement.innerHTML = cityName;
  temperatureElement.innerHTML = temperature;
  weatherConditionElement.innerHTML = weatherDescription;
  weatherIconElement.src = weatherIconUrl;
  weatherIconElement.alt = weatherDescription;
}

function getLocalTime(lat, lon, weatherData) {
  let apiUrl = `https://api.timezonedb.com/v2.1/get-time-zone?key=ZECGDS9S4KXT&format=json&by=position&lat=${lat}&lng=${lon}`;

  axios.get(apiUrl)
    .then(response => {
      let localTime = new Date(response.data.formatted);
      let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      let day = days[localTime.getDay()];
      let hours = localTime.getHours();
      let minutes = localTime.getMinutes().toString().padStart(2, "0");

      let formattedTime = `${day} ${hours}:${minutes}`;

      let humidity = weatherData.temperature.humidity;
      let windSpeed = Math.round(weatherData.wind.speed);

      document.querySelector("#date-time").innerHTML = `
        <strong>Local Time:</strong> ${formattedTime} <br>
        <strong>Humidity:</strong> ${humidity}% <br>
        <strong>Wind:</strong> ${windSpeed} km/h
      `;
    })
    .catch(error => console.error("Error fetching time data:", error));
}

function getForecast(city) {
  let apiKey = "d78e7acc0to3ab4c102473f7fd13b43e";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=metric`;

  axios.get(apiUrl)
    .then(displayForecast)
    .catch(error => console.error("Error fetching forecast:", error));
}

function displayForecast(response) {
  let forecastContainer = document.querySelector("#forecast-container");
  forecastContainer.innerHTML = "";

  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  response.data.daily.slice(0, 5).forEach((day) => {
    let date = new Date(day.time * 1000);
    let dayName = days[date.getDay()];
    let iconUrl = day.condition.icon_url;
    let maxTemp = Math.round(day.temperature.maximum);
    let minTemp = Math.round(day.temperature.minimum);

    let forecastHTML = `
      <div class="forecast-day">
          <h3>${dayName}</h3>
          <img src="${iconUrl}" alt="${day.condition.description}">
          <p class="forecast-temp">${maxTemp}° / ${minTemp}°</p>
      </div>
    `;
    forecastContainer.innerHTML += forecastHTML;
  });
}

document.querySelector("#search-form").addEventListener("submit", search);