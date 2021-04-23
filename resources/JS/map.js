let map;
let homeLatitude;
let homeLongitude;
let countries;
let lat;
let lng;
let capital;
let bordersToDisplay;
let homeCountry;
let countryData;
let latlng;
let countriesList;
let geojson;
let currency;
let markerCluster;

//====get location ==================================
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showLocation, showError);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

getLocation();

// ===Info about the country ===========================
function listOfCountries() {
  countriesList = document.getElementById("countries");
  let options = "";

  borders.features.map(function (feature) {
    if (options == 0) {
      options += `<option selected="true" disabled>Choose a Country</option>`;
    } else {
      options += `<option value="${feature.properties.iso_a2}">${feature.properties.name}</option>`;
    }
  });

  countriesList.innerHTML = options;

  var firstOption = $("#countries option:first");
  var nextOptions = $("#countries option:not(:first)").sort(function (a, b) {
    return a.text == b.text ? 0 : a.text < b.text ? -1 : 1;
  });
  $("#countries").html(nextOptions).prepend(firstOption);
}

function initialize(countriesData) {
  countries = countriesData;
}

function displayCountryInfo(countryByAlpha2Code) {
  countryData = countries.find(
    (country) => country.alpha2Code === countryByAlpha2Code
  );
  // console.log(countryData);
  document.querySelector("#flag-container img").src = countryData.flag;
  document.querySelector(
    "#flag-container img"
  ).alt = `Flag of ${countryData.name}`;
  document.getElementById("country-name").innerHTML = countryData.name;
  document.getElementById("capital").innerHTML = countryData.capital;
  document.getElementById(
    "dialing-code"
  ).innerHTML = `+${countryData.callingCodes[0]}`;
  document.getElementById(
    "population"
  ).innerHTML = countryData.population.toLocaleString("en-US");
  document.getElementById("currencies").innerHTML = countryData.currencies
    .filter((c) => c.name)
    .map((c) => `${c.name} (${c.code})`)
    .join(", ");
  document.getElementById("region").innerHTML = countryData.region;

  document.getElementById("area").innerHTML = `${countryData.area} sq.km`;
  document.getElementById("timeZone").innerHTML = countryData.timezones;
  document.getElementById("borders").innerHTML = countryData.borders;
  document.getElementById("languages").innerHTML = countryData.languages
    .filter((l) => l.name)
    .map((l) => l.name);

  lat = countryData.latlng[0];
  lng = countryData.latlng[1];
  capital = countryData.capital;
  currency = countryData.currencies[0].code;
}

//======highlighting the country==================================
function highlightingCountry() {
  geojson = L.geoJSON(borders, {
    style: function () {
      return {
        color: "transparent",
        fillColor: "transparent",
      };
    },

    onEachFeature: function (_, layer) {
      layer.on({
        mousedown: onCountryClick,
      });
    },
  }).addTo(map);
}

function onCountryClick(e) {
  geojson.resetStyle();
  bordersToDisplay.clearLayers();
  let clickedCountryName = e.target.feature.properties.iso_a2;

  document.getElementById("countries").value = clickedCountryName;
  showModal();

  let layer = e.target;

  layer.setStyle({
    weight: 2,
    color: "#00B6BC",
    fillColor: "#71D5E4",
  });

  displayCountryInfo(clickedCountryName);
  exchangeRates();
  wikipedia(clickedCountryName);
  weather(clickedCountryName);

  if (markerCluster) {
    markerCluster.clearLayers();
    markerClusters();
  } else {
    markerClusters();
  }
}

//====show borders of selected country===============================

function handleCountryChange(selectedCountryCode) {
  let selectedCountry = borders.features.filter((country) => {
    return country.properties.iso_a2 === selectedCountryCode;
  });

  bordersToDisplay = L.geoJSON(selectedCountry, {
    style: function () {
      return {
        color: "white",
        fillColor: "green",
      };
    },
    onEachFeature: function (_, layer) {
      map.fitBounds(layer.getBounds()); //zoom selected country
    },
  });

  bordersToDisplay.addTo(map);
  displayCountryInfo(selectedCountryCode);
}

document.getElementById("countries").addEventListener("change", (e) => {
  geojson.resetStyle();
  if (bordersToDisplay) {
    bordersToDisplay.clearLayers();
    handleCountryChange(e.target.value);
  } else {
    handleCountryChange(e.target.value);
    bordersToDisplay.addTo(map);
  }
});

//==== wikipedia link =========================================

function wikipedia() {
  $.ajax({
    url: "resources/PHP/wikipedia.php",
    type: "POST",
    dataType: "json",
    data: {
      lat: lat,
      lng: lng,
    },

    success: function (result) {
      //console.log(result);

      if (result.status.name == "ok") {
        $("#summary").html(result.data[0].summary);
        $("#link")
          .html(result.data[0].wikipediaUrl)
          .attr("href", "https://" + result.data[0].wikipediaUrl);
      }
    },

    error: function (jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

// ==== Weather =========================================

function weather() {
  $.ajax({
    url: "resources/PHP/openweather.php",
    type: "POST",
    dataType: "json",
    data: {
      capital: capital,
    },

    success: function (result) {
      //console.log(result);

      if (result.status.name == "ok") {
        $("#city").html(result.data.city.name);
        $("#weatherIcon").html(
          getWeatherIcon(result.data.list[0].weather[0].id)
        );
        $("#description").html(result.data.list[0].weather[0].description);
        $("#temp").html(result.data.list[0].main.temp + "<small> ℃</small>");
        $("#pressure").html(result.data.list[0].main.pressure + " hPa");
        $("#humidity").html(result.data.list[0].main.humidity + " %");
        $("#wind_speed").html(result.data.list[0].wind.speed + " meter/sec");
        $("#clouds").html(result.data.list[0].clouds.all + " %");

        let html = "";
        for (let i = 8; i < result.data.cnt; i += 8) {
          html += "<tr>";
          html += "<td>";
          html += result.data.list[i].dt_txt;
          html += "</td>";
          html += "<td>";
          html += result.data.list[i].weather[0].description;
          html += "</td>";
          html += "<td>";
          html += result.data.list[i].main.temp;
          html += "℃";
          html += "</td>";
          html += "</tr>";
        }
        $("#forecast").html(html);
      }
    },

    error: function (jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });

  getWeatherIcon();
}
//==== exchange rates =============================================

function exchangeRates() {
  $.ajax({
    url: "resources/PHP/exchangeRates.php",
    type: "POST",
    dataType: "json",
    data: {
      base: currency,
    },

    success: function (result) {
      //console.log(result);

      if (result.status.name == "ok") {
        $("#currencyName").html(currency);
        $("#date").html(result.data.date);

        let html = "";
        for (let rate in result.data.rates) {
          html += "<tr>";
          html += "<td>";
          html += rate;
          html += "</td>";
          html += "<td>";
          html += result.data.rates[rate];
          html += "</td>";
          html += "</tr>";
        }
        $("#exchange-rates").html(html);
      }
    },

    error: function (jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

//=================================================================

function onLoad() {
  $.ajax({
    url: "resources/PHP/findPlaceNearby.php",
    type: "GET",
    dataType: "json",
    data: {
      homeLatitude: homeLatitude,
      homeLongitude: homeLongitude,
    },

    success: function (result) {
      if (result.status.name == "ok") {
        homeCountry = result.data.geonames[0].countryCode;

        //console.log(result);
        listOfCountries();

        fetch("resources/PHP/getCountryInfo.php")
          .then((res) => res.json())
          .then((result) => {
            initialize(result.data);
            //console.log(data)

            document.getElementById("countries").value = homeCountry;

            displayCountryInfo(homeCountry);
            wikipedia();
            weather();
            exchangeRates();

            if (bordersToDisplay) {
              bordersToDisplay.clearLayers();
              handleCountryChange(homeCountry);
            } else {
              handleCountryChange(homeCountry);
              bordersToDisplay.addTo(map);
            }

            if (markerCluster) {
              markerCluster.clearLayers();
              markerClusters(homeCountry);
            } else {
              markerClusters();
            }
          })
          .catch((err) => console.log("Error:", err));
      }
    },

    error: function (jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

//======================================================================
//$(document).ready(onLoad);

$(document).ready(function () {
  preloader();
  onLoad();
  showModal();
});

$("#countries").change(function () {
  exchangeRates();
  wikipedia();
  weather();
  if (markerCluster) {
    markerCluster.clearLayers();
    markerClusters();
  } else {
    markerClusters();
  }
});

//===================================================================

function showLocation(location) {
  latlng = new L.LatLng(location.coords.latitude, location.coords.longitude);
  homeLatitude = location.coords.latitude;
  homeLongitude = location.coords.longitude;

  map = L.map("map", {
    zoomControl: false,
  }).setView(latlng, 7);

  setMap();
  highlightingCountry();
  onLoad();
}

function showError(error) {
  if (error.PERMISSION_DENIED) {
    homeCountry = "GB";
    latlng = [51.5482, -0.0763];
    homeLatitude = 51.5482;
    homeLongitude = -0.0763;

    map = L.map("map", {
      zoomControl: false,
    });

    setMap();
    highlightingCountry();
    onLoad();
  } else if (error.POSITION_UNAVAILABLE) {
    alert("Location information is unavailable.");
  } else if (error.TIMEOUT) {
    alert("The request to get user location timed out.");
  } else {
    alert("An unknown error occurred.");
  }
}
//=================marker Clusters=================
function markerClusters() {
  let icon = L.icon({
    iconUrl: "images/icon1.png",
    iconSize: [40, 40],
  });

  markerCluster = L.markerClusterGroup();

  sel = document.getElementById("countries");
  text = sel.options[sel.selectedIndex].text;

  for (var i = 0; i < markers2.length; i++) {
    if (markers2[i].country == text) {
      var popup = markers2[i].name + "<br/><b>City:</b> " + markers2[i].city;

      let m = L.marker([markers2[i].lat, markers2[i].lon], {
        icon: icon,
      }).bindPopup(popup);

      markerCluster.addLayer(m);
    }

    map.addLayer(markerCluster);
  }
}
