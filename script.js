function refreshWeather(weatherData) {
  let temperatureElement = document.querySelector("#temperature");
  let temperature = weatherData.data.temperature.current;
  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windSpeedElement = document.querySelector("#wind-speed");
  let timeElement = document.querySelector("#time");
  let iconElement = document.querySelector("#icon");
  let date = new Date(weatherData.data.time * 1000);

  cityElement.innerHTML = weatherData.data.city;
  timeElement.innerHTML = formatDate(date);
  descriptionElement.innerHTML = weatherData.data.condition.description;
  humidityElement.innerHTML = `${weatherData.data.temperature.humidity}%`;
  windSpeedElement.innerHTML = `${weatherData.data.wind.speed} km/h`;
  temperatureElement.innerHTML = Math.round(temperature);
  iconElement.innerHTML = `<img src="${weatherData.data.condition.icon_url}" class="weather-app-icon" />`;

  getWeatherForecast(weatherData.data.city);
}

function formatDate(date) {
  let minutes = date.getMinutes();
  let hours = date.getHours();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return `${day} ${hours}:${minutes}`;
}

function getWeatherForecast(city) {
  let apiKey = "30927dtfa44b4770359oe8258a9c5b2c";
  let forecastUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}`;

  axios
    .get(forecastUrl)
    .then((response) => {
      if (response.data.error) {
        console.error("Error fetching forecast data");
      } else {
        updateForecast(response);
      }
    })
    .catch((error) => {
      console.error(error);
      alert("Error fetching forecast data. Please try again.");
    });
}

function updateForecast(forecastData) {
  let forecastContainer = document.querySelector("#forecast");
  let forecast = forecastData.data.daily;

  forecastContainer.innerHTML = "";

  forecast.forEach((dayData, index) => {
    if (index < 5) {
      let dayElement = document.createElement("div");
      dayElement.classList.add("weather-forecast-day");

      let dayName = new Date(dayData.time * 1000).toLocaleString("en-us", {
        weekday: "short",
      });
      let maxTemp = Math.round(dayData.temperature.max);
      let minTemp = Math.round(dayData.temperature.min);
      let iconUrl = dayData.condition.icon_url;

      dayElement.innerHTML = `
        <div class="weather-forecast-date">${dayName}</div>
        <img src="${iconUrl}" class="weather-forecast-icon" />
        <div class="weather-forecast-temperatures">
          <div class="weather-forecast-temperature"><strong>${maxTemp}º</strong></div>
          <div class="weather-forecast-temperature">${minTemp}º</div>
        </div>
      `;

      forecastContainer.appendChild(dayElement);
    }
  });
}

function searchCity(city) {
  let apiKey = "30927dtfa44b4770359oe8258a9c5b2c";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}`;

  document.querySelector("#city").innerHTML = "Loading...";
  document.querySelector("#temperature").innerHTML = "...";

  axios
    .get(apiUrl)
    .then((response) => {
      if (response.data.error) {
        alert("City not found. Please try again.");
      } else {
        refreshWeather(response);
      }
    })
    .catch((error) => {
      console.error(error);
      alert("Error fetching weather data. Please try again.");
    });
}

function handleSearchSubmit(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-form-input");

  if (searchInput.value.trim() !== "") {
    searchCity(searchInput.value);
  } else {
    alert("Please enter a city.");
  }
}

let searchFormElement = document.querySelector("#search-form");
searchFormElement.addEventListener("submit", handleSearchSubmit);

searchCity("Paris");
