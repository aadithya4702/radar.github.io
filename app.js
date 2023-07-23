const apikey = "9fe6d2656f5f206c8b768e75326e49bb";
window.addEventListener("load", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      let lon = position.coords.longitude;
      let lat = position.coords.latitude;
      const url =
        `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&` +
        `lon=${lon}&appid=${apikey}`;

      fetch(url)
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          console.log(data);
          // console.log(new Date().getTime());
          var dat = new Date(data.dt);
          // console.log(dat.toLocaleString(undefined, "Asia/Kolkata"));
          // console.log(new Date().getMinutes());
          weatherReport(data);
        });
    });
  }
});

function searchByCity() {
  var place = document.getElementById("input").value;
  var urlsearch =
    `http://api.openweathermap.org/data/2.5/weather?q=${place}&` +
    `appid=${apikey}`;

  fetch(urlsearch)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      console.log(data);
      weatherReport(data);
    });
  document.getElementById("input").value = "";
}

function weatherReport(data) {
  var urlcast =
    `http://api.openweathermap.org/data/2.5/forecast?q=${data.name}&` +
    `appid=${apikey}`;

  fetch(urlcast)
    .then((res) => {
      return res.json();
    })
    .then((forecast) => {
      // console.log(forecast.city);
      hourForecast(forecast);

      // console.log(data);
      document.getElementById("cit").innerText =
        data.name + ", " + data.sys.country;
      // console.log(data.name, data.sys.country);

      // console.log(Math.floor(data.main.temp - 273));
      document.getElementById("temperature").innerText =
        Math.floor(data.main.temp - 273) + "°C";

      document.getElementById("clouds").innerText = data.weather[0].description;
      // console.log(data.weather[0].description);

      let icon1 = data.weather[0].icon;
      let iconurl = "http://api.openweathermap.org/img/w/" + icon1 + ".png";
      console.log(iconurl);
      document.getElementById("img").src = iconurl;

      var icd = "01d";
      var icn = "01n";

      let sunrise = data.sys.sunrise;
      let sre = new Date(sunrise * 1000);
      let nsr = sre.toLocaleString("en-US");
      document.getElementById("sr").innerText = nsr;

      let sunset = data.sys.sunset;
      let sse = new Date(sunset * 1000);
      let nss = sse.toLocaleString("en-US");
      document.getElementById("ss").innerText = nss;

      let humidity = data.main.humidity;
      let hum = humidity + "%";
      document.getElementById("hu").innerText = hum;

      let wind = data.wind.speed;
      let win = wind + "m/s";
      document.getElementById("wi").innerText = win;

      if (data.weather[0].id >= 200 && data.weather[0].id < 600) {
        document.body.classList.remove(
          "bg-snow",
          "bg-atmos",
          "bg-clrd",
          "bg-clrn",
          "bg-norm"
        );
        document.body.classList.add("bg-thunder");
      } else if (data.weather[0].id >= 600 && data.weather[0].id < 700) {
        document.body.classList.remove(
          "bg-thunder",
          "bg-atmos",
          "bg-clrd",
          "bg-clrn",
          "bg-norm"
        );
        document.body.classList.add("bg-snow");
      } else if (data.weather[0].id >= 700 && data.weather[0].id < 800) {
        document.body.classList.remove(
          "bg-thunder",
          "bg-snow",
          "bg-clrd",
          "bg-clrn",
          "bg-norm"
        );
        document.body.classList.add("bg-atmos");
      } else if (data.weather[0].id == 800 && data.weather[0].icon == icd) {
        document.body.classList.remove(
          "bg-thunder",
          "bg-snow",
          "bg-atmos",
          "bg-clrn",
          "bg-norm"
        );
        document.body.classList.add("bg-clrd");
      } else if (data.weather[0].id == 800 && data.weather[0].icon == icn) {
        document.body.classList.remove(
          "bg-thunder",
          "bg-snow",
          "bg-atmos",
          "bg-clrd",
          "bg-norm"
        );
        document.body.classList.add("bg-clrn");
      } else if (data.weather[0].id > 800) {
        document.body.classList.remove(
          "bg-thunder",
          "bg-snow",
          "bg-atmos",
          "bg-clrd",
          "bg-clrn"
        );
        document.body.classList.add("bg-norm");
      }
    });
}

function hourForecast(forecast) {
  document.querySelector(".temp").innerHTML = "";
  for (let i = 0; i < 5; i++) {
    var date = new Date(forecast.list[i].dt * 1000);
    console.log(
      date.toLocaleTimeString(undefined, "Asia/Kolkata").replace(":00", "")
    );

    let hourR = document.createElement("div");
    hourR.setAttribute("class", "next");

    let div = document.createElement("div");
    let time = document.createElement("p");
    time.setAttribute("class", "time");
    time.innerText = date
      .toLocaleTimeString(undefined, "Asia/Kolkata")
      .replace(":00", "");

    let temp = document.createElement("h3");
    temp.innerText =
      Math.floor(forecast.list[i].main.temp_max - 273) +
      " °C" +
      " / " +
      Math.floor(forecast.list[i].main.temp_min - 273) +
      " °C";

    div.appendChild(time);
    div.appendChild(temp);

    let desc = document.createElement("p");
    desc.setAttribute("class", "desc");
    desc.innerText = forecast.list[i].weather[0].description;

    hourR.appendChild(div);
    hourR.appendChild(desc);
    document.querySelector(".temp").appendChild(hourR);
  }
}
