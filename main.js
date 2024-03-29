const apiKey = "aa351def03ae96ae4d0d783e366257c0";
const apiUrl =
  "https://api.openweathermap.org/data/2.5/weather?units=imperial&q=";
const defaultCity = "Kansas City";
const apiUrl2 =
  "http://api.openweathermap.org/data/2.5/air_pollution?lat=39.0997&lon=-94.5786&appid=aa351def03ae96ae4d0d783e366257c0";
const apiUrl3 =
  "http://api.openweathermap.org/data/2.5/forecast?lat=39.0997&lon=-94.5786&appid=aa351def03ae96ae4d0d783e366257c0";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");

async function fetchDayForecast() {
  try {
    const response = await fetch(apiUrl3);
    const data = await response.json();

    if (response.ok) {
      const tuesDay = document.querySelector(".tues");
      const wedDay = document.querySelector(".wed");
      const thurDay = document.querySelector(".thur");
      const friDay = document.querySelector(".fri");
      const satDay = document.querySelector(".sat");

      document.querySelector(".tues").innerHTML = data.list[1].dt;
      document.querySelector(".wed").innerHTML = data.list[9].dt;
      document.querySelector(".thur").innerHTML = data.list[17].dt;
      document.querySelector(".fri").innerHTML = data.list[25].dt;
      document.querySelector(".sat").innerHTML = data.list[33].dt;

      function getDayNameFromTimestamp(unixTimestamp) {
        const milliseconds = unixTimestamp * 1000;

        const date = new Date(milliseconds);
        const dayOfWeek = date.getDay();
        const dayNames = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];

        return dayNames[dayOfWeek];
      }
      const unixTimestamp = 1711497600;
      const dayName = getDayNameFromTimestamp(unixTimestamp);
      console.log(dayName);

      tuesDay.innerHTML = getDayNameFromTimestamp(data.list[1].dt);
      wedDay.innerHTML = getDayNameFromTimestamp(data.list[9].dt);
      thurDay.innerHTML = getDayNameFromTimestamp(data.list[17].dt);
      friDay.innerHTML = getDayNameFromTimestamp(data.list[25].dt);
      satDay.innerHTML = getDayNameFromTimestamp(data.list[33].dt);

      console.log(data);
    } else {
      console.log(
        "Failed to retrieve Day Forecast data. Status code:",
        response.status
      );
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

fetchDayForecast();

async function fetchAirPollution() {
  const lat = 39.0997;
  const lon = -94.5786;

  try {
    const response = await fetch(apiUrl2);
    const data = await response.json();

    if (response.ok) {
      console.log("Air Pollution Response:");
      console.log("==========================");
      console.log(data);

      const aqi = data.list[0].main.aqi;

      // Map AQI values to descriptions
      const aqiDescriptions = {
        1: "Good",
        2: "Fair",
        3: "Moderate",
        4: "Poor",
        5: "Very Poor",
      };

      // Set AQI description in HTML element
      const aqiDescription = aqiDescriptions[aqi];
      document.querySelector(".air-quality-description").innerHTML =
        aqiDescription;
    } else {
      console.log(
        "Failed to retrieve air pollution data. Status code:",
        response.status
      );
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

fetchAirPollution();

async function checkWeather(city) {
  const response = await fetch(apiUrl + city + `&appid=${apiKey}`);

  if (response.status == 404) {
    document.querySelector(".error").style.display = "block";
    document.querySelector(".weather").style.display = "none";
    document.querySelector(".humidity-info").style.display = "none";
    document.querySelector(".wind-info").style.display = "none";
  } else {
    const data = await response.json();

    console.log(data);

    document.querySelector(".city").innerHTML = data.name;
    document.querySelector(".temp").innerHTML =
      Math.round(data.main.temp) + "°F";
    document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
    document.querySelector(".wind").innerHTML = data.wind.speed + " mph";
    document.querySelector(".feels-text").innerHTML =
      data.main.feels_like + " °F";
    document.querySelector(".high-temp").innerHTML =
      " " + Math.round(data.main.temp_max);
    document.querySelector(".low-temp").innerHTML = Math.round(
      data.main.temp_min
    );

    // Assuming data.sys.sunrise and data.sys.sunset are Unix timestamps
    const sunriseTimestamp = data.sys.sunrise;
    const sunsetTimestamp = data.sys.sunset;

    // Convert Unix timestamps to milliseconds by multiplying by 1000
    const sunriseTime = new Date(sunriseTimestamp * 1000);
    const sunsetTime = new Date(sunsetTimestamp * 1000);

    // Get hours, minutes, and seconds
    const sunriseHours = sunriseTime.getHours().toString().padStart(2, "0");
    const sunriseMinutes = sunriseTime.getMinutes().toString().padStart(2, "0");
    const sunriseSeconds = sunriseTime.getSeconds().toString().padStart(2, "0");

    const sunsetHours = sunsetTime.getHours().toString().padStart(2, "0");
    const sunsetMinutes = sunsetTime.getMinutes().toString().padStart(2, "0");
    const sunsetSeconds = sunsetTime.getSeconds().toString().padStart(2, "0");

    // Construct formatted time strings
    const formattedSunriseTime = `${sunriseHours}:${sunriseMinutes}:${sunriseSeconds}`;
    const formattedSunsetTime = `${sunsetHours}:${sunsetMinutes}:${sunsetSeconds}`;
    document.querySelector(".sunrise-text").innerHTML = formattedSunriseTime;
    document.querySelector(".sunset-text").innerHTML = formattedSunsetTime;

    // Calculate the percentage of the day passed since sunrise
    const now = Date.now();
    const percentageOfDay =
      (now - sunriseTimestamp * 1000) /
      (sunsetTimestamp * 1000 - sunriseTimestamp * 1000);

    // Get the arch element and its width
    const arch = document.querySelector(".arch");
    const archWidth = arch.clientWidth;

    // Calculate the horizontal position of the sun based on the percentage of the day passed
    const sunPosition = percentageOfDay * archWidth;

    // Get the sun element
    const sun = document.querySelector(".sun-img");

    // Set the left position of the sun element
    sun.style.left = sunPosition + "px";

    const pressureInteger = data.main.pressure;
    const pressureDecimal = (pressureInteger * 0.02953).toFixed(2);
    document.querySelector(".pressure-text").innerHTML =
      pressureDecimal + " in";

    document.querySelector(".visibility-range").innerHTML = data.visibility;

    if (data.weather[0].main == "Clouds") {
      weatherIcon.src = "images/clouds.png";
    } else if (data.weather[0].main == "Clear") {
      weatherIcon.src = "images/clear.png";
    } else if (data.weather[0].main == "Rain") {
      weatherIcon.src = "images/rain.png";
    } else if (data.weather[0].main == "Drizzle") {
      weatherIcon.src = "images/drizzle.png";
    } else if (data.weather[0].main == "Mist") {
      weatherIcon.src = "images/mist.png";
    } else if (data.weather[0].main == "Snow") {
      weatherIcon.src = "images/snow.png";
    }

    document.querySelector(".weather").style.display = "block";
    document.querySelector(".humidity-info").style.display = "block";
    document.querySelector(".wind-info").style.display = "block";
    document.querySelector(".error").style.display = "none";
  }
}

searchBtn.addEventListener("click", () => {
  checkWeather(searchBox.value);
});

checkWeather(defaultCity);
