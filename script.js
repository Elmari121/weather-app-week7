function refreshWeather(response) {
  let temperatureElement = document.querySelector("#temperature");
  let temperature = response.data.current.temperature;
  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windSpeedElement = document.querySelector("#wind-speed");
  let timeElement = document.querySelector("#time");
  let iconElement = document.querySelector("#icon");

  let date = new Date(response.data.current.time * 1000);
  cityElement.innerHTML = response.data.city;
  timeElement.innerHTML = formatDate(date);
  descriptionElement.innerHTML = response.data.current.condition.description;
  humidityElement.innerHTML = `${response.data.current.temperature.humidity}%`;
  windSpeedElement.innerHTML = `${response.data.current.wind.speed} km/h`;
  temperatureElement.innerHTML = Math.round(temperature);
  iconElement.innerHTML = `<img src="${response.data.current.condition.icon_url}" class="weather-app-icon" />`;

  displayForecast(response.data.forecast);
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

function searchCity(city) {
  let apiKey = "30927dtfa44b4770359oe8258a9c5b2c";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(function (response) {
    let forecastApiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}`;
    axios.get(forecastApiUrl).then(function (forecastResponse) {
      response.data.forecast = forecastResponse.data.daily;
      refreshWeather(response);
    });
  });
}

function handleSearchSubmit(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-form-input");
  searchCity(searchInput.value);
}

function displayForecast(forecastData) {
  let forecastHtml = "";

  forecastData.slice(0, 5).forEach(function (day) {
    let dayName = formatDate(new Date(day.time * 1000)).split("sun")[0];
    forecastHtml += `
      <div class="weather-forecast-day">
        <div class="weather-forecast-date">${dayName}</div>
        <div class="weather-forecast-icon">
          <img src="${day.condition.icon_url}" alt="${
      day.condition.description
    }" />
        </div>
        <div class="weather-forecast-temperatures">
          <div class="weather-forecast-temperature">
            <strong>${Math.round(day.temperature.max)}º</strong>
          </div>
          <div class="weather-forecast-temperature">${Math.round(
            day.temperature.min
          )}º</div>
        </div>
      </div>
    `;
  });

  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = forecastHtml;
}

let searchFormElement = document.querySelector("#search-form");
searchFormElement.addEventListener("submit", handleSearchSubmit);

searchCity("Paris");
