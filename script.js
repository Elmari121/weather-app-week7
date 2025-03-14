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

  // Update the UI with the weather data
  cityElement.innerHTML = weatherData.data.city;
  timeElement.innerHTML = formatDate(date);
  descriptionElement.innerHTML = weatherData.data.condition.description;
  humidityElement.innerHTML = `${weatherData.data.temperature.humidity}%`;
  windSpeedElement.innerHTML = `${weatherData.data.wind.speed} km/h`;
  temperatureElement.innerHTML = Math.round(temperature);
  iconElement.innerHTML = `<img src="${weatherData.data.condition.icon_url}" class="weather-app-icon" />`;
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
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}`;

  // Show a loading state
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
