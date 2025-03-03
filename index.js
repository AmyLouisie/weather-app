function search(event) {
    event.preventDefault();
    let searchInputElement = document.querySelector("#city-input");
    let city = searchInputElement.value.trim();
  
    if (city) {
      document.querySelector("#city-name").textContent = city;
  
      let apiKey = "d78e7acc0to3ab4c102473f7fd13b43e";
      let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;
  
      axios.get(apiUrl).then(displayTemperature);
    }
  }
  
  function displayTemperature(response) {
    let temperatureElement = document.querySelector("#current-temp");
    let temperature = Math.round(response.data.temperature.current);
    let cityElement = document.querySelector("#city-name");
    let humidityElement = document.querySelector("#date-time");
  
    cityElement.innerHTML = response.data.city;
    temperatureElement.innerHTML = temperature;
  
    let humidity = response.data.temperature.humidity;
    let windSpeed = Math.round(response.data.wind.speed);
  
    let now = new Date();
    let days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
  
    let day = days[now.getDay()];
    let hours = now.getHours();
    let minutes = now.getMinutes().toString().padStart(2, "0");
  
    let formattedTime = `${day} ${hours}:${minutes}`;
    humidityElement.innerHTML = `${formattedTime}, ${response.data.condition.description}<br> Humidity: <strong>${humidity}%</strong>, Wind: <strong>${windSpeed} km/h</strong>`;
  }
  
  document.querySelector("#search-form").addEventListener("submit", search);
  
  displayCurrentDateTime();
  