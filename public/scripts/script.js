const apiKey = "3b9d591cb1cc7a9399bfbf44df8430e5";
const city = "London";
var latitude, longitude;

const sunny = "/assets/img/sunny.svg";
const cloudy = "/assets/img/cloudy.svg";
const hail = "/assets/img/hail.svg";
const rainy = "/assets/img/rainy.svg";
const snow = "/assets/img/snow.svg";
const strong_rain = "/assets/img/strong-rain.svg";
const sunny_cloud = "/assets/img/sunny-cloud.svg";
const sunny_rain = "/assets/img/sunny-rain.svg";
const thunderstorm = "/assets/img/thunderstorm.svg";
const night_clear_cloud = "/assets/img/night-clear-cloud.svg";
const night_clear = "/assets/img/night-clear.svg";
const night_cloud = "/assets/img/night-cloud.svg";
const night_rain = "/assets/img/night-rain.svg";

function getUserLocation() {
  if (navigator.geolocation) {
    // Request the user's location
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
  } else {
    alert("Geolocation is not supported by your browser");
  }
}

function successCallback(position) {
  // Get the latitude and longitude
  latitude = position.coords.latitude;
  longitude = position.coords.longitude;
  console.log(latitude, longitude);

  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`
  )
    .then((response) => response.json())
    .then(async (data) => {
      changeLiveContent(data);

      const username = sessionStorage.getItem("username");
      if (username) {
        saveSnapshot(username, latitude, longitude, data);
      } else {
        console.error("Username not found in session storage");
      }
      const occurrences = await findSnapshots(username);

      if (occurrences) {
        changeOptions(occurrences);
      }
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
    });

  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}`
  )
    .then((response) => response.json())
    .then((data) => {
      changePanelContent(data);
      changeListContent(data);
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
    });
}

function errorCallback(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      alert("User denied the request for Geolocation.");
      break;
    case error.POSITION_UNAVAILABLE:
      alert("Location information is unavailable.");
      break;
    case error.TIMEOUT:
      alert("The request to get user location timed out.");
      break;
    default:
      alert("An unknown error occurred.");
      break;
  }
}

window.onload = function () {
  getUserLocation();
};

function kC(kelvin) {
  // Check if the input is a valid temperature (non-negative)
  if (kelvin < 0) {
    console.error("Invalid temperature: Kelvin cannot be negative.");
    return;
  }

  // Conversion formula
  const celsius = kelvin - 273.15;
  return celsius.toFixed(0);
}
function kmH(metersPerSecond) {
  // Check if the input is a valid speed (non-negative)
  if (metersPerSecond < 0) {
    console.error("Invalid speed: Speed cannot be negative.");
    return;
  }

  // Conversion factor from m/s to km/h
  const conversionFactor = 3.6;

  // Calculate the speed in km/h
  const kmPerHour = metersPerSecond * conversionFactor;

  // Return the result
  return kmPerHour.toFixed(1);
}

function convertTimestampToTime(timestamp) {
  // Create a new Date object using the timestamp (multiply by 1000 to convert from seconds to milliseconds)
  const sunriseDate = new Date(timestamp * 1000);

  // Get various components of the date
  const hours = sunriseDate.getHours().toString().padStart(2, "0");
  const minutes = sunriseDate.getMinutes().toString().padStart(2, "0");

  // Format the time
  const formattedTime = `${hours}:${minutes}`;

  return formattedTime;
}

function capitalizeEachWord(str) {
  return str.replace(/\b\w/g, (match) => match.toUpperCase());
}

function getWeatherImgPath(iconCode) {
  let iconPath;

  switch (iconCode) {
    case "01d":
      iconPath = sunny;
      break;
    case "01n":
      iconPath = night_clear;
      break;
    case "02d":
      iconPath = sunny_cloud;
      break;
    case "02n":
      iconPath = night_clear_cloud;
      break;
    case "03d":
      iconPath = sunny_cloud;
      break;
    case "03n":
      iconPath = night_cloud;
      break;
    case "04d":
      iconPath = sunny_cloud;
      break;
    case "04n":
      iconPath = night_cloud;
      break;
    case "10d":
      iconPath = strong_rain;
      break;
    case "10n":
      iconPath = night_rain;
      break;
    case "11d":
    case "11n":
      iconPath = thunderstorm;
      break;
    case "13d":
    case "13n":
      iconPath = snow;
      break;
    case "50d":
    case "50n":
      iconPath = cloudy;
      break;
    default:
      iconPath = sunny;
      break;
  }

  return iconPath;
}

function convertTo12hrFormat(timestamp) {
  const date = new Date(timestamp);

  // Get hours, minutes, and AM/PM
  const hours = date.getHours() % 12 || 12; // Convert 0 to 12
  const minutes = ("0" + date.getMinutes()).slice(-2);
  const period = date.getHours() >= 12 ? "PM" : "AM";

  // Format the time in 12-hour format
  const time12hr = `${hours} ${period}`;

  return time12hr;
}

function createListItem(
  day,
  humidity,
  dayIcon,
  nightIcon,
  temperatureMin,
  temperatureMax
) {
  const thirdSectionContainer = document.querySelector(".third-section");

  // Create the main container div
  const listItem = document.createElement("div");
  listItem.classList.add("list");

  // Create and append the day text
  const dayText = document.createElement("p");
  dayText.classList.add("list-text");
  dayText.textContent = day;
  listItem.appendChild(dayText);

  // Create and append the humidity section
  const humidityContainer = document.createElement("div");
  humidityContainer.classList.add("humidity");

  const humidityIcon = document.createElement("img");
  humidityIcon.src = "/assets/img/iwwa_humidity.svg";
  humidityIcon.alt = "iwwa_humidity";
  humidityContainer.appendChild(humidityIcon);

  const humidityText = document.createElement("p");
  humidityText.textContent = humidity + "%";
  humidityContainer.appendChild(humidityText);

  listItem.appendChild(humidityContainer);

  // Create and append the weather icons
  const weatherIcon1 = document.createElement("img");
  weatherIcon1.src = dayIcon;
  weatherIcon1.alt = dayIcon;
  listItem.appendChild(weatherIcon1);

  const weatherIcon2 = document.createElement("img");
  weatherIcon2.src = nightIcon;
  weatherIcon2.alt = nightIcon;
  listItem.appendChild(weatherIcon2);

  // Create and append the temperature texts
  const temperatureMinText = document.createElement("p");
  temperatureMinText.textContent = temperatureMin + "º";
  listItem.appendChild(temperatureMinText);

  const temperatureMaxText = document.createElement("p");
  temperatureMaxText.textContent = temperatureMax + "º";
  listItem.appendChild(temperatureMaxText);

  thirdSectionContainer.appendChild(listItem);
}

function createPanel(time, weatherIcon, temperature, humidity) {
  const secondSectionContainer = document.querySelector(".second-section");
  // Create the main container div
  const panelItem = document.createElement("div");
  panelItem.classList.add("panel");

  // Create and append the time text
  const timeText = document.createElement("p");
  timeText.textContent = time;
  panelItem.appendChild(timeText);

  // Create and append the weather icon
  const weatherIconImg = document.createElement("img");
  weatherIconImg.classList.add("panel-weather-img");
  weatherIconImg.src = weatherIcon;
  weatherIconImg.alt = weatherIcon;
  panelItem.appendChild(weatherIconImg);

  // Create and append the temperature text
  const temperatureText = document.createElement("p");
  temperatureText.classList.add("panel-degree");
  temperatureText.textContent = temperature + "º";
  panelItem.appendChild(temperatureText);

  // Create and append the humidity section
  const humidityContainer = document.createElement("div");
  humidityContainer.classList.add("humidity");

  const humidityLength = document.createElement("div");
  humidityLength.classList.add("length");

  const humidityIcon = document.createElement("img");
  humidityIcon.src = "/assets/img/iwwa_humidity.svg";
  humidityIcon.alt = "iwwa_humidity";
  humidityLength.appendChild(humidityIcon);

  humidityContainer.appendChild(humidityLength);

  const humidityText = document.createElement("p");
  humidityText.textContent = humidity + "%";
  humidityContainer.appendChild(humidityText);

  panelItem.appendChild(humidityContainer);

  // Append the entire item to the specified container
  secondSectionContainer.appendChild(panelItem);
}

function changeLiveContent(data) {
  document.getElementById("degree").textContent = kC(data.main.temp) + "º";
  document.getElementById("description").textContent = capitalizeEachWord(
    data.weather[0].description
  );
  document.getElementById("feels").textContent =
    kC(data.main.feels_like) + "ºC";
  document.getElementById("minTemp").textContent = kC(data.main.temp_min);
  document.getElementById("maxTemp").textContent = kC(data.main.temp_max);
  document.getElementById("humidityId").textContent = data.main.humidity + "%";
  document.getElementById("sunriseId").textContent = convertTimestampToTime(
    data.sys.sunrise
  );
  document.getElementById("sunsetId").textContent = convertTimestampToTime(
    data.sys.sunset
  );
  document.getElementById("windId").textContent = kmH(data.wind.speed);
  document.getElementById("city").textContent = data.name;
  document.getElementById("country").textContent = data.sys.country;
  document.getElementById("weatherImg").src = getWeatherImgPath(
    data.weather[0].icon
  );
}

function changePanelContent(data) {
  const secondSectionContainer = document.querySelector(".second-section");
  secondSectionContainer.innerHTML = "";
  for (let i = 1; i <= 5; i++) {
    if (data == "timestamp") {
      createPanel("-", getWeatherImgPath("01n"), "-", "-");
    } else {
      var listData = data.list[i];
      var time = convertTo12hrFormat(listData.dt_txt);
      var weatherIcon = getWeatherImgPath(listData.weather[0].icon);
      var temperature = kC(listData.main.temp);
      var humidity = listData.main.humidity;

      createPanel(time, weatherIcon, temperature, humidity);
    }
  }
}

function changeListContent(data) {
  const thirdSectionContainer = document.querySelector(".third-section");
  thirdSectionContainer.innerHTML = "";

  const currentDate = new Date();

  // Get the day of the week as a number (0 for Sunday, 1 for Monday, etc.)
  const weekdayNumber = currentDate.getDay();

  // Array of weekday names
  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  for (let i = 0; i < 5; i++) {
    if (data == "timestamp") {
      createListItem(
        "-",
        "-",
        getWeatherImgPath("01d"),
        getWeatherImgPath("01n"),
        "-",
        "-"
      );
    } else {
      selectedDay = (weekdayNumber + i + 1) % 7;
      var day = weekdays[selectedDay];
      var toplistData = data.list[(i + 1) * 8 - 1];
      var bottomlistData = data.list[(i + 1) * 8 - 4];

      var dayIcon = getWeatherImgPath(toplistData.weather[0].icon);
      var nightIcon = getWeatherImgPath(bottomlistData.weather[0].icon);
      var temperatureMin = kC(toplistData.main.temp);
      var temperatureMax = kC(bottomlistData.main.temp);

      var humidity = toplistData.main.humidity;

      createListItem(
        day,
        humidity,
        dayIcon,
        nightIcon,
        temperatureMin,
        temperatureMax
      );
    }
  }
}

var inputElement = document.getElementById("search");

inputElement.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    var inputValue = inputElement.value;
    search(inputValue);
  }
});

const selectElement = document.getElementById("selectId");

selectElement.addEventListener("change", function () {
  const selectedOption = selectElement.options[selectElement.selectedIndex];

  if (selectElement.selectedIndex == 0) {
    getUserLocation();
  } else {
    const weatherData = JSON.parse(selectedOption.value);

    changeLiveContent(weatherData);
    changeListContent("timestamp");
    changePanelContent("timestamp");
  }
});

function search(location) {
  if (!location || location == "") {
    alert("Please enter a city name");
    return;
  }
  var latitude;
  var longitude;

  // Make the first API request
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("City not found");
      }
      return response.json();
    })
    .then((data) => {
      // Process and display the weather information
      latitude = data.coord.lat;
      longitude = data.coord.lon;
      changeLiveContent(data);

      const username = sessionStorage.getItem("username");
      if (username) {
        saveSnapshot(username, latitude, longitude, data);
      } else {
        console.error("Username not found in session storage");
      }

      // Make the second API request only after the first one is completed
      return fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}`
      );
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error fetching weather data");
      }
      return response.json();
    })
    .then((data) => {
      // Process and display forecast data
      changePanelContent(data);
      changeListContent(data);
    })
    .catch((error) => {
      alert("Error fetching weather data: " + error.message);
    });
}

async function saveSnapshot(userID, lat, lon, weather) {
  // Send data to the server using fetch or another AJAX library
  const response = await fetch("/saveData", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userID, weather, location: { lat, lon } }),
  });

  const result = await response.json();
  console.log(result);
}

async function findSnapshots(userID) {
  try {
    // Make a GET request to the endpoint using fetch
    const response = await fetch(`/getData/${userID}`);

    // Check if the request was successful (status code 200)
    if (response.ok) {
      // Parse the JSON response
      const data = await response.json();

      // Access the occurrences from the response
      const occurrences = data.occurrences;
      return occurrences;
      // Do something with the occurrences
      console.log("Occurrences:", occurrences);
    } else {
      console.error("Error:", response.statusText);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

function formatOptionDateTime(timestamp) {
  const dateObject = new Date(timestamp);

  const options = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };

  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
    dateObject
  );
  const formattedTime = dateObject.toLocaleTimeString("en-US", {
    hour12: false,
  });

  return `${formattedTime} ${formattedDate}`;
}

function changeOptions(occurrences) {
  const selectElement = document.getElementById("selectId");
  selectElement.innerHTML = "";

  const liveOption = document.createElement("option");

  liveOption.value = "Live";
  liveOption.text = "Live";

  selectElement.appendChild(liveOption);

  occurrences.forEach((occurence) => {
    const newOption = document.createElement("option");
    newOption.value = JSON.stringify(occurence.weather);
    newOption.text = formatOptionDateTime(occurence.createdAt);
    selectElement.appendChild(newOption);
  });
}
