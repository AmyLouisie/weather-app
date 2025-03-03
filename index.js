// Description: Main JavaScript file for the Weather App

function search(event) {
  event.preventDefault();
  let searchInputElement = document.querySelector("#city-input");
  let city = searchInputElement.value.trim();

  if (city) {
      document.querySelector("#city-name").textContent = city; // Update immediately

      let apiKey = "d78e7acc0to3ab4c102473f7fd13b43e";
      let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;

      axios.get(apiUrl)
          .then(displayTemperature)
          .catch(error => console.error("Error fetching weather data:", error));
  }
}
function displayTemperature(response) {
  console.log(response); // Debugging to check API response

  let temperatureElement = document.querySelector("#current-temp");
  let cityElement = document.querySelector("#city-name");
  let weatherConditionElement = document.querySelector("#weather-condition-text");
  let weatherIconElement = document.querySelector(".current-temp-icon");

  // Ensure API response contains city name
  let cityName = response.data.city || (response.data.coordinates ? response.data.coordinates.city : "Unknown City");

  if (!cityName) {
      console.error("City name not found in API response", response);
      cityElement.innerHTML = "City not found";
      return;
  }

  let temperature = Math.round(response.data.temperature.current);
  let weatherDescription = response.data.condition.description;
  let weatherIconUrl = response.data.condition.icon_url; // API provides a direct URL for icons

  cityElement.innerHTML = cityName; // Display fetched city name
  temperatureElement.innerHTML = temperature;
  weatherConditionElement.innerHTML = weatherDescription;
  weatherIconElement.src = weatherIconUrl; // Set icon dynamically
  weatherIconElement.alt = weatherDescription; // Improve accessibility

  // Update humidity and wind
  let humidity = response.data.temperature.humidity;
  let windSpeed = Math.round(response.data.wind.speed);
  let humidityElement = document.querySelector("#date-time");

  let now = new Date();
  let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  let formattedTime = `${days[now.getDay()]} ${now.getHours()}:${now.getMinutes().toString().padStart(2, "0")}`;

  humidityElement.innerHTML = `${formattedTime}<br> Humidity: <strong>${humidity}%</strong>, Wind: <strong>${windSpeed} km/h</strong>`;
}

document.querySelector("#search-form").addEventListener("submit", search);