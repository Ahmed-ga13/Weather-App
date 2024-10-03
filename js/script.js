const cityInput = document.querySelector(".city-input");
const searchBtn = document.querySelector(".search-btn");
const weatherInfoSection = document.querySelector(".weather-info");
const notFoundSection = document.querySelector(".not-found");
const searchCitySection = document.querySelector(".search-city");
const countryTxt = document.querySelector(".country-txt");
const tempTxt = document.querySelector(".temp-txt");
const conditionTxt = document.querySelector(".condition-txt");
const humidityValueTxt = document.querySelector(".humidity-value-txt");
const windValueTxt = document.querySelector(".wind-value-txt");
const weatherSummaryImg = document.querySelector(".weather-summary-img");
const currentDataTxt = document.querySelector(".current-data-txt");
const forecastItemsContainer = document.querySelector(
  ".forecast-items-container"
);

const apiKey = "35c2811da50ab793f30d42dec3152997";

searchBtn.addEventListener("click", () => {
  const cityName = cityInput.value.trim();
  if (cityName !== "") {
    upDateWeatherInfo(cityName);
    cityInput.value = "";
    cityInput.blur();
  } else {
    alert("Please enter a city name.");
  }
});

cityInput.addEventListener("keydown", (event) => {
  const cityName = cityInput.value.trim();
  if (event.key === "Enter" && cityName !== "") {
    upDateWeatherInfo(cityName);
    cityInput.value = "";
    cityInput.blur();
  }
});

async function getFetchData(endPoint, city) {
  const url = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`;
  const response = await fetch(url);

  // تحقق من حالة الاستجابة
  if (!response.ok) {
    throw new Error("Network response was not ok: " + response.statusText);
  }

  return response.json();
}

function getWeatherIcon(id) {
  if (id <= 232) return "thunderstorm.svg";
  if (id <= 321) return "drizzle.svg";
  if (id <= 531) return "rain.svg";
  if (id <= 622) return "snow.svg";
  if (id <= 781) return "atmosphere.svg";
  if (id <= 800) return "clear.svg";
  else return "clouds.svg";
}

function getCurrentDAta() {
  const currentData = new Date();
  const option = {
    weekday: "short",
    day: "2-digit",
    month: "short",
  };

  return currentData.toLocaleDateString("en-GB", option);
}

async function upDateWeatherInfo(city) {
  const weatherData = await getFetchData("weather", city);
  if (weatherData.cod != 200) {
    showDisplaySection(notFoundSection);
    return;
  }
  console.log(weatherData);

  const {
    name: country,
    main: { temp, humidity },
    weather: [{ id, main }],
    wind: { speed },
  } = weatherData;

  countryTxt.textContent = country;
  tempTxt.textContent = Math.round(temp) + " °C";
  conditionTxt.textContent = main;
  humidityValueTxt.textContent = humidity + "%";
  windValueTxt.textContent = speed + " M/s";

  currentDataTxt.textContent = getCurrentDAta();
  weatherSummaryImg.src = `image/weather/${getWeatherIcon(id)}`;

  await ubdateForecastsInfo(city);
  showDisplaySection(weatherInfoSection);
}

async function ubdateForecastsInfo(city) {
  const forecastsData = await getFetchData("forecast", city);

  const timeTaken = "12:00:00";
  const todayDate = new Date().toISOString().split("T")[0];

  forecastItemsContainer.innerHTML = "";

  forecastsData.list.forEach((forecastWeather) => {
    if (
      forecastWeather.dt_txt.includes(timeTaken) &&
      !forecastWeather.dt_txt.includes(todayDate)
    ) {
      updateForecastItems(forecastWeather);
    }
  });
}

function updateForecastItems(weatherData) {
  const {
    dt_txt: data,
    weather: [{ id }],
    main: { temp },
  } = weatherData;

  const dateTaken = new Date(data)
  const dateOption = {
    day: "2-digit",
    month: "short",
  };

  const dateResult = dateTaken.toLocaleDateString("en-US", dateOption);

  const forecastItem = `
      <div class="forecast-item">
          <h5 class="forecast-item-data regular-txt">${dateResult}</h5>
          <img src="image/weather/${getWeatherIcon(
            id
          )}"  class="forecast-item-img">
          <h5 class="forecast-item-temp">${Math.round(temp)} °C</h5>
      </div>
  `;

  forecastItemsContainer.insertAdjacentHTML("beforeend", forecastItem);
}

function showDisplaySection(section) {
  // إخفاء جميع الأقسام
  [weatherInfoSection, searchCitySection, notFoundSection].forEach((sec) => {
    sec.style.display = "none";
  });

  // عرض القسم المحدد
  section.style.display = "flex";
}
