const apiKey = "aa351def03ae96ae4d0d783e366257c0";
const apiUrl =
  "https://api.openweathermap.org/data/2.5/weather?units=imperial&q=";
const defaultCity = "Kansas City";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");

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

    const pressureInteger = data.main.pressure;
    const pressureDecimal = (pressureInteger * 0.02953).toFixed(2);
    document.querySelector(".pressure-text").innerHTML =
      pressureDecimal + " in";

    document.querySelector(".visibility-range").innerHTML = data.visibility;
    //const visibilityInMeters = data.visibility;
    //const visibilityInKm = visibilityInMeters / 1000;
    //document.querySelector(".visibility-range").innerHTML = visibilityInKm + " km";

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
