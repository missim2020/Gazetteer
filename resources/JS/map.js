let map;
let homeLatitude;
let homeLongitude;
let countries;
let bordersToDisplay;
let latlng;
let geojson;
let markerCluster;
let options;

//====get location ==================================
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showLocation, showError);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

getLocation();

// ===List of countries ===========================

function listOfCountries() {
  $.getJSON("resources/PHP/listOfCountries.php", function (data) {
    //console.log(data)
    const countriesList = document.getElementById("countries");
    options = "";

    data.map(function (feature) {
      //console.log(feature.properties.iso_a2)
      if (options == 0) {
        options += `<option selected="true" disabled>Choose a Country</option>`;
      } else {
        options += `<option value="${feature.code}">${feature.name}</option>`;
      }
    });

    countriesList.innerHTML = options;

    var firstOption = $("#countries option:first");
    var nextOptions = $("#countries option:not(:first)").sort(function (a, b) {
      return a.text == b.text ? 0 : a.text < b.text ? -1 : 1;
    });
    $("#countries").html(nextOptions).prepend(firstOption);
  });
}

//==Info about the country========================================

function initialize(countriesData) {
  countries = countriesData;
}

function displayCountryInfo(countryByAlpha2Code) {
  let countryData = countries.find(
    (country) => country.alpha2Code === countryByAlpha2Code
  );
  //console.log(countryData);
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

  //country = countryData.alpha2Code

  return {
    lat: countryData.latlng[0],
    lng: countryData.latlng[1],
    capital: countryData.capital,
    currency: countryData.currencies[0].code,
    countryShortCode: countryData.alpha2Code,
  };
}

//console.log(currency)

//====show borders of selected country===============================

function handleCountryChange(selectedCountryCode) {
  let value = $("#countries").val();

  $.ajax({
    url: "resources/PHP/borders.php",
    type: "POST",
    data: {
      value: value,
    },
    success: function (country) {
      //console.log(country)

      bordersToDisplay = L.geoJSON(JSON.parse(country), {
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
      const {
        currency,
        capital,
        lat,
        lng,
        countryShortCode,
      } = displayCountryInfo(selectedCountryCode);
      weather(capital);
      wikipedia(lat, lng);
      exchangeRates(currency);
      getCountryBoundingBox(countryShortCode);
    },
  });
}

//======highlighting the country==================================

function highlightingCountry() {
  $.getJSON("resources/PHP/highlightedCountryBorders.php", function (data) {
    geojson = L.geoJSON(data, {
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
  });
}

function onCountryClick(e) {
  let clickedCountryName;

  geojson.resetStyle();
  bordersToDisplay.clearLayers();
  clickedCountryName = e.target.feature.properties.iso_a2;
  document.getElementById("countries").value = clickedCountryName;

  let layer = e.target;

  layer.setStyle({
    weight: 2,
    color: "#00B6BC",
    fillColor: "#71D5E4",
  });

  const { currency, capital, lat, lng, countryShortCode } = displayCountryInfo(
    clickedCountryName
  );
  exchangeRates(currency);
  wikipedia(lat, lng);
  weather(capital);
  putMarkerCluster();
  getCountryBoundingBox(countryShortCode);
}

//==== wikipedia link =========================================

function wikipedia(lat, lng) {
  $.ajax({
    url: "resources/PHP/wikipedia.php",
    type: "POST",
    dataType: "json",
    data: {
      lat,
      lng,
    },

    success: function (result) {
      //console.log(result);

      if (result.status.name == "ok") {
        const countryInfo = result.data[0];
        $("#summary").html(countryInfo ? countryInfo.summary : "-");
        $("#link")
          .html(countryInfo ? countryInfo.wikipediaUrl : "-")
          .attr(
            "href",
            countryInfo ? "https://" + countryInfo.wikipediaUrL : "#"
          );
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

function weather(capital) {
  $.ajax({
    url: "resources/PHP/openweather.php",
    type: "POST",
    dataType: "json",
    data: {
      capital,
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

function exchangeRates(currency) {
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
        let homeCountry = result.data.geonames[0].countryCode;

        //console.log(result);
        listOfCountries();

        fetch("resources/PHP/getCountryInfo.php")
          .then((res) => res.json())
          .then((result) => {
            initialize(result.data);
            //console.log(result.data)

            document.getElementById("countries").value = homeCountry;

            const {
              currency,
              capital,
              lat,
              lng,
              countryShortCode,
            } = displayCountryInfo(homeCountry);
            wikipedia(lat, lng);
            weather(capital);
            exchangeRates(currency);
            getCountryBoundingBox(countryShortCode);

            geojson.resetStyle();
            if (bordersToDisplay) {
              bordersToDisplay.clearLayers();
              handleCountryChange(homeCountry);
            } else {
              handleCountryChange(homeCountry);
              //bordersToDisplay.addTo(map);
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
});

$("#countries").change(function (e) {
  putMarkerCluster();

  geojson.resetStyle();
  if (bordersToDisplay) {
    bordersToDisplay.clearLayers();
    handleCountryChange(e.target.value);
  }
});

//=====show locations ==========================================================

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
//=======  marker Clusters===========================

function markerClusters() {
  let icon = L.icon({
    iconUrl: "images/icon1.png",
    iconSize: [40, 40],
  });

  markerCluster = L.markerClusterGroup();

  let sel = document.getElementById("countries");
  let text = sel.options[sel.selectedIndex].text;
  //console.log(text)

  $.ajax({
    url: "resources/PHP/airports.php",
    type: "POST",
    data: {
      text: text,
    },
    success: function (airports_list) {
      //console.log(airports_list)
      airports_list = JSON.parse(airports_list);
      for (let i = 0; i < airports_list.length; i++) {
        let popup =
          airports_list[i].name + "<br/><b>City:</b> " + airports_list[i].city;

        let m = L.marker([airports_list[i].lat, airports_list[i].lng], {
          icon: icon,
        }).bindPopup(popup);

        markerCluster.addLayer(m);
      }

      map.addLayer(markerCluster);
    },
  });
}
//========   add more Wikipedia links as Region News  ===============================================

function getCountryBoundingBox(countryShortCode) {
  $.ajax({
    url: "resources/PHP/getWikipediaEntries.php",
    type: "POST",
    dataType: "json",
    data: {
      countryShortCode,
    },

    success: function (result) {
      //console.log(result);

      if (result.status.name == "ok") {
        let html = "";
        for (let i = 0; i < result.data.geonames.length; i++) {
          html += "<tr>";
          html += "<td>";
          html += result.data.geonames[i].summary + "<br>";

          html +=
            "<a href='https://" +
            result.data.geonames[i].wikipediaUrl +
            "' target='_blank'>" +
            result.data.geonames[i].wikipediaUrl +
            "</a>";

          html += "</td>";
          html += "<td>";
          if (result.data.geonames[i].thumbnailImg) {
            html +=
              "<img src='" +
              result.data.geonames[i].thumbnailImg +
              "'alt='image'/>";
          } else {
            html +=
              "<img src='./images/news.png' style='width:80px; height:80px'alt='image'/>";
          }

          html += "</td>";
          html += "</tr>";
        }
        $("#News").html(html);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}
