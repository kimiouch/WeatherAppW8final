let apiKey = "c403a9e2a5c07086f36f15c109e2369a";
let apiUrl = "https://api.openweathermap.org/data/2.5/weather?";

let icons = {

    "01d": "./icons/day/clearday.png",
    "02d": "./icons/day/fewclouds.png",
    "03d": "./icons/cloud.png",
    "04d": "./icons/manyclouds.png",
    "09d": "./icons/showerrain.png",
    "10d": "./icons/day/rainyday.png",
    "11d": "./icons/thunder.png",
    "13d": "./icons/snowy.png",
    "50d": "./icons/day/mistday.png",


    "01n": "./icons/night/clearnight.png",
    "02n": "./icons/night/fewclouds.png",
    "03n": "./icons/cloud.png",
    "04n": "./icons/manyclouds.png",
    "09n": "./icons/showerrain.png",
    "10n": "./icons/night/rainynight.png",
    "11n": "./icons/thunder.png",
    "13n": "./icons/snowy.png",
    "50n": "./icons/night/mistnight.png",

}

function today(timestamp) {
    let weekdays = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thurseday",
        "Friday",
        "Saturday"
    ];

    let now = new Date(timestamp);

    let hour = now.getUTCHours();
    let minute = now.getUTCMinutes();

    if (hour < 10) {
        hour = "0" + hour;
    }
    if (minute < 10) {
        minute = "0" + minute;
    }

    let day = `${weekdays[now.getUTCDay()]}, ${hour}:${minute}`;

    return day;
}


function searchForCity(event) {
    event.preventDefault();

    let searchbox = document.querySelector(".type");

    axios
        .get(`${apiUrl}units=metric&q=${searchbox.value}&appid=${apiKey}`)
        .then(setCelsius);

    searchbox.value = "";
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function displayForecast(response) {

    let forecast = response.data.daily;

    let forecastelement = document.querySelector("#forecast");

    let forecastHTML = `<div class="row">`;
    forecast.forEach(function(forecastday, index){

        if (index < 6){
        forecastHTML = forecastHTML +
        ` 
           <div class="col">
			    <div class="forecast-date"> ${formatDay(forecastday.dt)} </div>
			    <img src=" ${icons[forecastday.weather[0].icon]}" class="forecast-icon">

			    <div class="forecast-temp">
				    <span class="forecast-temp-max"> ${Math.round(forecastday.temp.max)}?? </span>
				    <span class="forecast-temp-min"> ${Math.round(forecastday.temp.min)}?? </span>
			    </div>
		    </div>
        `; 
        }
    });
    
    forecastHTML = forecastHTML + `</div>`;
    forecastelement.innerHTML = forecastHTML ;
  
}

function getForecast(coordinates){
  console.log(coordinates);

  let apiKey = "c403a9e2a5c07086f36f15c109e2369a";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`; 
  
  axios.get(apiUrl).then(displayForecast);
}

function setCelsius(response) {
    let cityheader = document.querySelector("#city");
    cityheader.innerHTML = response.data.name;

    let temprature = document.querySelector("#temp");
    celsiusTemp = response.data.main.temp;
    temprature.innerHTML = Math.round(celsiusTemp);

    let description = document.querySelector("#des");
    description.innerHTML = response.data.weather[0].description;

    let Humidity = document.querySelector("#humid");
    Humidity.innerHTML = response.data.main.humidity;

    let Wind = document.querySelector("#wind");
    Wind.innerHTML = Math.round(response.data.wind.speed);

    let iconelement = document.querySelector("#icon");
    iconelement.setAttribute("src", icons[response.data.weather[0].icon]);

    let currrentTime = document.querySelector("#time");
    currrentTime.innerHTML = today((response.data.dt + response.data.timezone) * 1000);

    getForecast(response.data.coord);

}

let searchButton = document.querySelector("button");
searchButton.addEventListener("click", searchForCity);

function searchLoation(event) {
    event.preventDefault();

    navigator.geolocation.getCurrentPosition(
        currentPosition,
        currentPositionError
    );
}

function currentPositionError() {
    let position = {
        coords: {
            latitude: 51.5074,
            longitude: 0.1278
        }
    };
    currentPosition(position);
}


function currentPosition(position) {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    axios
        .get(`${apiUrl}units=metric&lat=${lat}&lon=${lon}&appid=${apiKey}`)
        .then(setCelsius);
}
let currentButton = document.querySelector("#current");
currentButton.addEventListener("click", searchLoation);
